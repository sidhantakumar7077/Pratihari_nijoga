import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
  Modal,
  TextInput,
  ScrollView,
  RefreshControl,
  Platform,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import { base_url } from '../../../App';

const STATUS_COLORS = {
  pending: { bg: '#fff7ed', text: '#9a3412', border: '#fdba74' },   // orange
  approved: { bg: '#ecfdf5', text: '#065f46', border: '#6ee7b7' },  // green
  rejected: { bg: '#fef2f2', text: '#991b1b', border: '#fca5a5' },  // red
  default: { bg: '#eef2ff', text: '#3730a3', border: '#c7d2fe' },
};

const Index = () => {

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // List + loading
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // New application modal
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState('');
  const [header, setHeader] = useState('');
  const [body, setBody] = useState('');
  const [photo, setPhoto] = useState(null);

  // UX helpers
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('all'); // all | pending | approved | rejected
  const [autoRefresh, setAutoRefresh] = useState(true);
  const pollRef = useRef(null);
  const prevStatusRef = useRef({}); // id -> status map to detect changes
  const mounted = useRef(false);
  const [reasonModal, setReasonModal] = useState({ visible: false, reason: '', title: '' });

  // Full image modal
  const [imageModal, setImageModal] = useState({ visible: false, uri: '' });

  const showToast = (msg) => ToastAndroid.show(msg, ToastAndroid.SHORT);

  const sortNewestFirst = (arr) =>
    [...arr].sort((a, b) => {
      // Prefer created_at/updated_at if present; fallback to date (DD-MM-YYYY)
      const da = Date.parse(a.updated_at || a.created_at || a.date?.split('-').reverse().join('-') || '1970-01-01');
      const db = Date.parse(b.updated_at || b.created_at || b.date?.split('-').reverse().join('-') || '1970-01-01');
      return db - da;
    });

  const getApplications = async ({ showLoader = true, detectChanges = true } = {}) => {
    try {
      if (showLoader) setLoading(true);
      const token = await AsyncStorage.getItem('storeAccesstoken');
      const res = await axios.get(`${base_url}api/get-application`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });

      if (res.data?.status === 'success') {
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        const sorted = sortNewestFirst(list);
        if (detectChanges) {
          // Diff statuses and toast changes
          const prev = prevStatusRef.current || {};
          sorted.forEach((item) => {
            const prevStatus = prev[item.id];
            if (prevStatus && prevStatus !== item.status) {
              showToast(`${item.header || 'Application'} is now ${item.status}`);
            }
          });
          prevStatusRef.current = Object.fromEntries(sorted.map((i) => [i.id, i.status]));
        } else {
          prevStatusRef.current = Object.fromEntries(sorted.map((i) => [i.id, i.status]));
        }
        setApplications(sorted);
      } else {
        showToast(res.data?.message || 'Failed to load applications.');
      }
    } catch (err) {
      console.error(err);
      showToast('Error fetching applications.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Polling setup
  useEffect(() => {
    mounted.current = true;
    if (isFocused) {
      getApplications({ showLoader: true, detectChanges: false });
      if (autoRefresh) {
        pollRef.current && clearInterval(pollRef.current);
        pollRef.current = setInterval(() => {
          if (mounted.current) getApplications({ showLoader: false, detectChanges: true });
        }, 15000);
      }
    }
    return () => {
      mounted.current = false;
      pollRef.current && clearInterval(pollRef.current);
    };
  }, [isFocused, autoRefresh]);

  const onRefresh = () => {
    setRefreshing(true);
    getApplications({ showLoader: false, detectChanges: true });
  };

  // Helper to format today's date as DD-MM-YYYY
  const getTodayFormatted = () => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  // When new application modal opens, set today's date and keep it read-only
  useEffect(() => {
    if (modalVisible) {
      setDate(getTodayFormatted());
    }
  }, [modalVisible]);

  // New application submit
  const handleSubmit = async () => {
    if (!date) {
      showToast('Date is missing.');
      return;
    }
    const hasPhoto = !!(photo && photo.uri);
    if (!hasPhoto) {
      if (!header?.trim()) {
        showToast('Please enter subject.');
        return;
      }
      if (!body?.trim()) {
        showToast('Please enter body.');
        return;
      }
    }

    const formData = new FormData();
    formData.append('date', date); // DD-MM-YYYY (today)
    formData.append('header', header.trim());
    formData.append('body', body.trim());
    if (photo && photo.uri) {
      formData.append('photo', {
        uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
        type: photo.type || 'image/jpeg',
        name: photo.fileName || 'application.jpg',
      });
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('storeAccesstoken');
      await axios.post(`${base_url}api/application/save`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      showToast('Submitted successfully!');
      setModalVisible(false);
      setDate('');
      setHeader('');
      setBody('');
      setPhoto(null);
      await getApplications({ showLoader: false, detectChanges: true }); // Refresh list
    } catch (error) {
      console.error(error);
      showToast('Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (!response.didCancel && !response.errorCode && response.assets?.length) {
        const image = response.assets[0];
        setPhoto(image);
      }
    });
  };

  // Filters + search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications.filter((a) => {
      const byStatus = tab === 'all' ? true : a.status?.toLowerCase() === tab;
      const str = `${a.header || ''} ${a.body || ''} ${a.date || ''}`.toLowerCase();
      return byStatus && (q ? str.includes(q) : true);
    });
  }, [applications, tab, query]);

  const StatusBadge = ({ status }) => {
    const key = (status || 'default').toLowerCase();
    const { bg, text, border } = STATUS_COLORS[key] || STATUS_COLORS.default;
    return (
      <View style={[styles.badge, { backgroundColor: bg, borderColor: border }]}>
        <Text style={[styles.badgeText, { color: text }]}>{(status || '').toUpperCase()}</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const imgUri = item.photo_url || item.photo;

    return (
      <View style={styles.card}>
        {imgUri ? (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setImageModal({ visible: true, uri: imgUri })}
          >
            <Image source={{ uri: imgUri }} style={styles.image} />
          </TouchableOpacity>
        ) : (
          <View style={[styles.image, { backgroundColor: '#e5e7eb' }]} />
        )}
        <View style={{ flex: 1, marginLeft: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.header}
            </Text>
            <StatusBadge status={item.status} />
          </View>
          <Text style={styles.cardDate}>Date: {item.date}</Text>
          <Text style={styles.cardBody} numberOfLines={3}>
            {item.body}
          </Text>

          {/* Rejection reason */}
          {item.status?.toLowerCase() === 'rejected' && !!item.rejection_reason && (
            <TouchableOpacity
              style={styles.reasonBtn}
              onPress={() =>
                setReasonModal({
                  visible: true,
                  reason: item.rejection_reason,
                  title: item.header,
                })
              }
            >
              <Ionicons name="alert-circle-outline" size={16} color="#991b1b" />
              <Text style={styles.reasonBtnText}>View reason</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#4c1d95', '#6366f1']} style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              size={24}
              color="#fff"
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Applications</Text>
          <View
            style={{
              position: 'absolute',
              right: 15,
              flexDirection: 'row',
              gap: 12,
            }}
          >
            {/* Auto refresh toggle */}
            <TouchableOpacity
              onPress={() => setAutoRefresh((p) => !p)}
              style={[
                styles.iconBtn,
                {
                  backgroundColor: autoRefresh
                    ? 'rgba(255,255,255,0.3)'
                    : 'rgba(255,255,255,0.15)',
                },
              ]}
            >
              <Ionicons
                name={autoRefresh ? 'refresh-circle' : 'refresh'}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="add-circle-outline" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>
          Apply for various services and events
        </Text>

        {/* Search + Tabs */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#6b7280" />
          <TextInput
            placeholder="Search applications…"
            placeholderTextColor="#9ca3af"
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.tabs}>
          {['all', 'pending', 'approved', 'rejected'].map((t) => {
            const active = tab === t;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setTab(t)}
                style={[styles.tab, active && styles.tabActive]}
              >
                <Text
                  style={[styles.tabText, active && styles.tabTextActive]}
                >
                  {t[0].toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#051b65"
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons
                  name="document-text-outline"
                  size={40}
                  color="#9ca3af"
                />
                <Text style={styles.emptyTitle}>No applications</Text>
                <Text style={styles.emptySubtitle}>
                  Create a new application to get started.
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* New Application Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <LinearGradient colors={['#4c1d95', '#6366f1']} style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#fff"
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>New Application</Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Fill out the form to submit a new application
            </Text>
          </LinearGradient>

          <View style={styles.scrollContainer}>
            <ScrollView contentContainerStyle={styles.form}>
              {/* Date (read-only, today's date) */}
              <View style={[styles.input, styles.disabledInput]}>
                <Text style={styles.inputText}>
                  {date || 'Today'}
                </Text>
              </View>

              {/* Header & Body */}
              <TextInput
                style={styles.input}
                placeholder="Subject"
                value={header}
                onChangeText={setHeader}
                placeholderTextColor="#aaa"
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Body"
                value={body}
                onChangeText={setBody}
                multiline
                numberOfLines={6}
                placeholderTextColor="#aaa"
              />

              {/* Photo */}
              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Ionicons name="image-outline" size={20} color="#555" />
                <Text style={styles.imageButtonText}>
                  Select application photo to send
                </Text>
              </TouchableOpacity>
              {photo && (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                    setImageModal({ visible: true, uri: photo.uri })
                  }
                >
                  <Image
                    source={{ uri: photo.uri }}
                    style={styles.previewImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitText}>Submit</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Rejection Reason Modal */}
      <Modal
        visible={reasonModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setReasonModal({ visible: false, reason: '', title: '' })
        }
      >
        <View style={styles.reasonOverlay}>
          <View style={styles.reasonCard}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Ionicons name="alert-circle" size={20} color="#991b1b" />
              <Text style={styles.reasonTitle} numberOfLines={1}>
                {reasonModal.title || 'Application'}
              </Text>
            </View>
            <Text style={styles.reasonText}>
              {reasonModal.reason || 'No reason provided.'}
            </Text>
            <TouchableOpacity
              style={styles.reasonClose}
              onPress={() =>
                setReasonModal({ visible: false, reason: '', title: '' })
              }
            >
              <Text style={styles.reasonCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Full Image Modal */}
      <Modal
        visible={imageModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModal({ visible: false, uri: '' })}
      >
        <View style={styles.imageOverlay}>
          <TouchableOpacity
            style={styles.imageClose}
            onPress={() => setImageModal({ visible: false, uri: '' })}
            activeOpacity={0.9}
          >
            <Ionicons name="close" size={26} color="#fff" />
          </TouchableOpacity>
          {imageModal.uri ? (
            <Image
              source={{ uri: imageModal.uri }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          ) : null}
        </View>
      </Modal>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingTop: 10, paddingBottom: 40, paddingHorizontal: 20 },
  headerTitle: { fontSize: 28, fontFamily: 'Poppins-Bold', color: '#ffffff' },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#e2e8f0',
    marginTop: 8,
  },
  scrollContainer: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#f8fafc',
  },

  // list
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  image: { width: 80, height: 80, borderRadius: 8 },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    maxWidth: '55%',
  },
  cardDate: { fontSize: 13, color: '#888', marginVertical: 4 },
  cardBody: { fontSize: 14, color: '#555' },

  // search + tabs
  searchBar: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  searchInput: {
    flex: 1,
    color: '#111827',
    fontSize: 15,
    marginHorizontal: 8,
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  tabActive: { backgroundColor: '#fff' },
  tabText: { color: '#e2e8f0', fontWeight: '700' },
  tabTextActive: { color: '#111827' },

  // status badge
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },

  // reason button
  reasonBtn: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reasonBtnText: { color: '#991b1b', fontWeight: '700' },

  // modal (new application)
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  form: { padding: 20 },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  disabledInput: {
    backgroundColor: '#f3f4f6',
  },
  inputText: { fontSize: 16, color: '#222' },
  placeholderText: { fontSize: 16, color: '#aaa' },
  textArea: { height: 120, textAlignVertical: 'top' },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  imageButtonText: { marginLeft: 10, color: '#333', fontSize: 15 },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  submitButton: {
    backgroundColor: '#051b65',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },

  // icon button
  iconBtn: { padding: 4, borderRadius: 10 },

  // empty state
  emptyState: { alignItems: 'center', paddingTop: 40, gap: 6 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  emptySubtitle: { fontSize: 13, color: '#6b7280' },

  // rejection reason modal
  reasonOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  reasonCard: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    padding: 16,
  },
  reasonTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
  },
  reasonText: { marginTop: 8, fontSize: 14, color: '#374151' },
  reasonClose: {
    marginTop: 14,
    alignSelf: 'flex-end',
    backgroundColor: '#051b65',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  reasonCloseText: { color: '#fff', fontWeight: '700' },

  // full image modal
  imageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 6,
  },
  fullImage: {
    width: '95%',
    height: '80%',
  },
});