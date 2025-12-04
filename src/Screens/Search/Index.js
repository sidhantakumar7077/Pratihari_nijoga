import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { base_url } from '../../../App';

const Index = () => {

  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchStarted, setSearchStarted] = useState(false); // true only when >= 3 chars

  const getAllMembers = async () => {
    try {
      const response = await fetch(base_url + 'api/approved-pratihari-profiles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMembers(data.data);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  useEffect(() => {
    getAllMembers();
  }, []);

  useEffect(() => {
    const loweredQuery = query.toLowerCase();

    if (query.length >= 3) {
      const results = members.filter((member) => {
        return (
          (member.first_name && member.first_name.toLowerCase().includes(loweredQuery)) ||
          (member.middle_name && member.middle_name.toLowerCase().includes(loweredQuery)) ||
          (member.last_name && member.last_name.toLowerCase().includes(loweredQuery)) ||
          (member.alias_name && member.alias_name.toLowerCase().includes(loweredQuery)) ||
          (member.email && member.email.toLowerCase().includes(loweredQuery)) ||
          (member.phone_no && member.phone_no.includes(loweredQuery)) ||
          (member.whatsapp_no && member.whatsapp_no.includes(loweredQuery)) ||
          (member.full_name && member.full_name.toLowerCase().includes(loweredQuery))
        );
      });

      setFilteredMembers(results);
      setSearchStarted(true);
    } else {
      // < 3 letters → don't show list
      setFilteredMembers([]);
      setSearchStarted(false);
    }
  }, [query, members]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PratihariProfileById', item)}
    >
      {item.profile_photo_url ? (
        <Image
          source={{ uri: item.profile_photo_url }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      ) : (
        <Ionicons name="person-circle" size={40} color="#341551" />
      )}
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.name}>{item.full_name}</Text>
        <Text style={styles.role}>{item.alias_name || 'No alias'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c1d95', '#6366f1']}
        style={styles.header}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" marginRight={10} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search</Text>
        </View>
        <Text style={styles.headerSubtitle}>Find Pratihari Members</Text>
      </LinearGradient>

      <View style={styles.scrollContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={22} color="#888" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search Nijoga Member..."
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={Keyboard.dismiss}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={22} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {!searchStarted && (
          <View style={styles.placeholderContainer}>
            <Ionicons name="search-circle" size={80} color="#ddd" />
            <Text style={styles.placeholderText}>
              Type at least 3 letters to search members
            </Text>
          </View>
        )}

        {searchStarted && (
          <FlatList
            data={filteredMembers}
            keyExtractor={(item) => item.pratihari_id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>No members found</Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 30, width: '90%', alignSelf: 'center' }}
          />
        )}
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
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
  searchBox: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 2,
    marginVertical: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  role: {
    fontSize: 14,
    color: '#666',
  },
  placeholderContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  placeholderText: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 10,
    textAlign: 'center',
  },
});