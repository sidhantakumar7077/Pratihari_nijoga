import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { base_url } from '../../../App';

const DEFAULT_IMAGE = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const Index = () => {

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [committeeList, setCommitteeList] = useState([]);
  const [loading, setLoading] = useState(false);

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const fetchCommitteeData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}api/designations`);

      if (response.data.status === 'success') {
        setCommitteeList(response.data.data || []);
      } else {
        showToast('Something went wrong');
      }
    } catch (error) {
      console.error(error);
      showToast('Failed to fetch committee data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchCommitteeData();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => {
    const name = item.pratihari?.full_name || 'N/A';
    const designation = item.designation || 'N/A';
    const year = item.year || '';

    return (
      <View style={styles.card}>
        <Image source={{ uri: DEFAULT_IMAGE }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>{designation.toUpperCase()}</Text>
          <Text style={styles.year}>Year: {year}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.safeArea}>
      <LinearGradient
        colors={['#4c1d95', '#6366f1']}
        style={styles.header}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" marginRight={10} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Committee</Text>
        </View>
        <Text style={styles.headerSubtitle}>View the committee members and their roles</Text>
      </LinearGradient>

      <View style={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 30 }} size="large" color="#051b65" />
        ) : (
          <FlatList
            data={committeeList}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={styles.emptyText}>No committee data found.</Text>}
          />
        )}
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
    backgroundColor: '#ccc',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  role: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  year: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 16,
  },
});
