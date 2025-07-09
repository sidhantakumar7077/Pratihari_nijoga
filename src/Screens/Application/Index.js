import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import { base_url } from '../../../App';

const Index = () => {
  const navigation = useNavigation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [date, setDate] = useState('');
  const [header, setHeader] = useState('');
  const [body, setBody] = useState('');
  const [photo, setPhoto] = useState(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const showToast = (msg) => ToastAndroid.show(msg, ToastAndroid.SHORT);

  const getApplications = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('storeAccesstoken');
      const res = await axios.get(`${base_url}api/get-application`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status === 'success') {
        setApplications(res.data.data || []);
      } else {
        showToast('Failed to load applications.');
      }
    } catch (err) {
      console.error(err);
      showToast('Error fetching applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!date || !header || !body || !photo) {
      showToast('Please complete all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('date', date);
    formData.append('header', header);
    formData.append('body', body);
    formData.append('photo', {
      uri: photo.uri,
      type: photo.type,
      name: photo.fileName,
    });

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('storeAccesstoken');
      const response = await axios.post(
        `${base_url}api/application/save`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      showToast('Submitted successfully!');
      setModalVisible(false);
      setDate('');
      setHeader('');
      setBody('');
      setPhoto(null);
      await getApplications(); // Refresh list
    } catch (error) {
      console.error(error);
      showToast('Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo', quality: 1 }, response => {
      if (!response.didCancel && !response.errorCode && response.assets?.length) {
        const image = response.assets[0];
        setPhoto(image);
      }
    });
  };

  useEffect(() => {
    getApplications();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.photo_url }} style={styles.image} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.cardTitle}>{item.header}</Text>
        <Text style={styles.cardDate}>Date: {item.date}</Text>
        <Text style={styles.cardBody}>{item.body}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4c1d95', '#6366f1']}
        style={styles.header}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" marginRight={10} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Applications</Text>
          <TouchableOpacity style={{ position: 'absolute', right: 15 }}>
            <Ionicons name="add-circle-outline" size={30} color="#fff" onPress={() => setModalVisible(true)} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Apply for various services and events</Text>
      </LinearGradient>

      <View style={styles.scrollContainer}>
        {/* Content */}
        {loading ? (
          <ActivityIndicator size="large" color="#051b65" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={applications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
          />
        )}
      </View>

      {/* Modal for New Application */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <LinearGradient
            colors={['#4c1d95', '#6366f1']}
            style={styles.header}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="arrow-back" size={24} color="#fff" marginRight={10} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>New Application</Text>
            </View>
            <Text style={styles.headerSubtitle}>Fill out the form to submit a new application</Text>
          </LinearGradient>
          <View style={styles.scrollContainer}>
            <ScrollView contentContainerStyle={styles.form}>
              <TouchableOpacity onPress={() => setOpenDatePicker(true)} style={styles.input}>
                <Text style={date ? styles.inputText : styles.placeholderText}>
                  {date || 'Select Date'}
                </Text>
              </TouchableOpacity>

              <DatePicker
                modal
                mode="date"
                open={openDatePicker}
                date={selectedDate}
                onConfirm={(pickedDate) => {
                  setOpenDatePicker(false);
                  setSelectedDate(pickedDate);
                  const formatted = pickedDate.toLocaleDateString('en-GB').split('/').join('-');
                  setDate(formatted);
                }}
                onCancel={() => setOpenDatePicker(false)}
              />

              <TextInput
                style={styles.input}
                placeholder="Header"
                value={header}
                onChangeText={setHeader}
                placeholderTextColor="#aaa"
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Application Body"
                value={body}
                onChangeText={setBody}
                multiline
                numberOfLines={6}
                placeholderTextColor="#aaa"
              />

              <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Ionicons name="image-outline" size={20} color="#555" />
                <Text style={styles.imageButtonText}>Select Photo</Text>
              </TouchableOpacity>

              {photo && (
                <Image source={{ uri: photo.uri }} style={styles.previewImage} resizeMode="contain" />
              )}

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal >
    </SafeAreaView >
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  header: {
    paddingTop: 10,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
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
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDate: {
    fontSize: 13,
    color: '#888',
    marginVertical: 4,
  },
  cardBody: {
    fontSize: 14,
    color: '#555',
  },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#051b65',
    elevation: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#fff',
  },
  form: {
    padding: 20,
  },
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
  inputText: {
    fontSize: 16,
    color: '#222',
  },
  placeholderText: {
    fontSize: 16,
    color: '#aaa',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaeaea',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  imageButtonText: {
    marginLeft: 10,
    color: '#333',
    fontSize: 15,
  },
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
  submitText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});