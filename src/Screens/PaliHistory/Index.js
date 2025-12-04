import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { base_url } from '../../../App';

// ---------- Helpers ----------
const fmtTime = (t) => (t ? moment(t, 'HH:mm:ss').format('hh:mm A') : '—');
const computeDuration = (start, end) => {
  if (!start || !end) return '—';
  const s = moment(start, 'HH:mm:ss');
  const e = moment(end, 'HH:mm:ss');
  const mins = Math.max(0, e.diff(s, 'minutes'));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
};

const statusTheme = (statusRaw) => {
  const s = (statusRaw || '').toLowerCase();
  switch (s) {
    case 'started':
      return {
        chipBg: 'rgba(59,130,246,0.18)',
        chipText: '#1d4ed8',
        ribbon: ['#93c5fd', '#60a5fa'],
        glow: ['rgba(147,197,253,0.45)', 'rgba(96,165,250,0.25)'],
      };
    case 'completed':
    case 'ended':
      return {
        chipBg: 'rgba(16,185,129,0.18)',
        chipText: '#047857',
        ribbon: ['#6ee7b7', '#34d399'],
        glow: ['rgba(110,231,183,0.45)', 'rgba(52,211,153,0.25)'],
      };
    case 'active':
      return {
        chipBg: 'rgba(250,204,21,0.20)',
        chipText: '#a16207',
        ribbon: ['#fde68a', '#f59e0b'],
        glow: ['rgba(253,230,138,0.45)', 'rgba(245,158,11,0.25)'],
      };
    default:
      return {
        chipBg: 'rgba(148,163,184,0.20)',
        chipText: '#475569',
        ribbon: ['#e2e8f0', '#cbd5e1'],
        glow: ['rgba(226,232,240,0.45)', 'rgba(203,213,225,0.25)'],
      };
  }
};

// ---------- Small UI bits ----------
const StatusChip = ({ status }) => {
  const theme = statusTheme(status);
  return (
    <LinearGradient
      colors={[theme.chipBg, 'rgba(255,255,255,0.6)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.chip}
    >
      <Text style={[styles.chipText, { color: theme.chipText }]}>
        {status ? status[0].toUpperCase() + status.slice(1) : '—'}
      </Text>
    </LinearGradient>
  );
};

const InfoPill = ({ icon, text, tint = ['#e2e8f0', '#f8fafc'] }) => (
  <LinearGradient
    colors={tint}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.pill}
  >
    <Ionicons name={icon} size={15} color="#0f172a" />
    <Text style={styles.pillText}>{text}</Text>
  </LinearGradient>
);

// ---------- Card ----------
const HistoryCard = ({ item, index }) => {
  const date = moment(item.date).format('DD MMM YYYY');
  const start = fmtTime(item.start_time);
  const end = fmtTime(item.end_time);
  const duration = computeDuration(item.start_time, item.end_time);
  const theme = useMemo(() => statusTheme(item.seba_status), [item.seba_status]);

  return (
    <View style={[styles.cardWrap, { marginTop: index === 0 ? 12 : 18 }]}>
      {/* Soft colorful glow behind the card */}
      <LinearGradient
        colors={theme.glow}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.glow}
      />

      {/* Gradient border wrapper */}
      <LinearGradient
        colors={[theme.ribbon[0], theme.ribbon[1]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.cardOuter}
      >
        {/* Inner glass card */}
        <View style={styles.cardInner}>

          {/* Header row */}
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sebaName}>{item.seba_name || '—'}</Text>
              <Text style={styles.sebaId}>#{item.seba_id}</Text>
            </View>
            <StatusChip status={item.seba_status} />
          </View>

          {/* Date + type row */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={18} color="#334155" />
              <Text style={styles.rowText}>{date}</Text>
            </View>
            <View style={styles.dot} />
            <View style={styles.metaItem}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#334155" />
              <Text style={styles.rowText}>{(item.type || '').toUpperCase() || '—'}</Text>
            </View>
          </View>

          {/* Start / End / Duration */}
          <View style={styles.splitBox}>
            <View style={styles.splitCol}>
              <Text style={styles.splitLabel}>Start</Text>
              <Text style={styles.splitValue}>{start}</Text>
            </View>
            <View style={styles.splitDivider} />
            <View style={styles.splitCol}>
              <Text style={styles.splitLabel}>End</Text>
              <Text style={styles.splitValue}>{end}</Text>
            </View>
            <View style={styles.splitDivider} />
            <View style={styles.splitCol}>
              <Text style={styles.splitLabel}>Duration</Text>
              <Text style={styles.splitValue}>{duration}</Text>
            </View>
          </View>

          {/* Footer pills with gentle gradient tints */}
          <View style={styles.pillsRow}>
            <InfoPill
              icon="people-outline"
              text={`Beddha #${item.beddha_id}`}
              tint={['#eef2ff', '#f5f3ff']}
            />
            <InfoPill
              icon="pricetag-outline"
              text={item.pratihari_id}
              tint={['#ecfeff', '#f0fdfa']}
            />
            <InfoPill
              icon="shield-checkmark-outline"
              text={(item.type || '').toUpperCase()}
              tint={['#fff7ed', '#fffbeb']}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

// ---------- Empty / Error ----------
const EmptyState = () => (
  <View style={styles.emptyWrap}>
    <View style={styles.emptyIconWrap}>
      <Ionicons name="time-outline" size={26} color="#6366f1" />
    </View>
    <Text style={styles.emptyTitle}>No history yet</Text>
    <Text style={styles.emptySubtitle}>Your completed or started seba will appear here.</Text>
  </View>
);

// ---------- Screen ----------
const Index = () => {

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  const fetchHistory = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError('');

      const token = await AsyncStorage.getItem('storeAccesstoken');
      const res = await fetch(`${base_url}api/seba-history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { throw new Error(text?.slice(0, 300) || 'Invalid server response'); }
      if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);

      const list = Array.isArray(data?.data) ? data.data : [];
      setHistory(list);
    } catch (e) {
      setError(e?.message || 'Failed to load history');
      setHistory([]);
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) fetchHistory(false);
  }, [isFocused, fetchHistory]);

  return (
    <View style={styles.safeArea}>
      <LinearGradient colors={['#4c1d95', '#6366f1']} style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={24} color="#fff" style={{ marginRight: 10 }} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pali History</Text>
        </View>
        <Text style={styles.headerSubtitle}>Explore the history of Pali events</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 28 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchHistory(true)} colors={['#6366f1']} />
        }
      >
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Loading history…</Text>
          </View>
        ) : error ? (
          <View style={styles.errorWrap}>
            <Ionicons name="alert-circle-outline" size={22} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => fetchHistory(false)} style={styles.retryBtn}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : history.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={history}
            scrollEnabled={false}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
            renderItem={({ item, index }) => <HistoryCard item={item} index={index} />}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default Index;

// ---------- Styles ----------
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingTop: 10, paddingBottom: 40, paddingHorizontal: 20 },
  headerTitle: { fontSize: 28, fontFamily: 'Poppins-Bold', color: '#ffffff' },
  headerSubtitle: { fontSize: 16, fontFamily: 'Inter-Regular', color: '#e2e8f0', marginTop: 8 },

  scrollContainer: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#f8fafc',
  },

  // Loading / error / empty
  loadingWrap: { paddingTop: 40, alignItems: 'center' },
  loadingText: { marginTop: 8, color: '#475569' },

  errorWrap: { padding: 20, alignItems: 'center', gap: 10 },
  errorText: { color: '#ef4444' },
  retryBtn: {
    marginTop: 6,
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  retryText: { color: '#fff', fontWeight: '600' },

  emptyWrap: { padding: 28, alignItems: 'center' },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  emptySubtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },

  // Card wrapper + glow
  cardWrap: { position: 'relative' },
  glow: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    bottom: -2,
    borderRadius: 20,
    opacity: 0.6,
    zIndex: 0,
    filter: 'blur(10px)', // ignored on RN Android/iOS but harmless
  },

  // Gradient border card
  cardOuter: {
    borderRadius: 20,
    padding: 2,           // border thickness
    zIndex: 1,
  },
  cardInner: {
    backgroundColor: '#ffffffee',
    borderRadius: 18,
    padding: 16,
    overflow: 'hidden',

    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  sebaName: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  sebaId: { color: '#64748b', fontWeight: '600', marginTop: 2 },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  chipText: { fontSize: 12, fontWeight: '800' },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
    marginBottom: 6,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#cbd5e1' },
  rowText: { color: '#334155', fontSize: 14, fontWeight: '700' },

  splitBox: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  splitCol: { flex: 1, padding: 12 },
  splitDivider: { width: 1, backgroundColor: '#e2e8f0' },
  splitLabel: { color: '#334155', fontWeight: '700', marginBottom: 4 },
  splitValue: { color: '#0f172a', fontSize: 16, fontWeight: '900' },

  pillsRow: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.06)',
  },
  pillText: { color: '#0f172a', fontWeight: '800' },
});