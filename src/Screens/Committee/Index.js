import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Committee</Text>
      </View>

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
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6fb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#051b65',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
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
