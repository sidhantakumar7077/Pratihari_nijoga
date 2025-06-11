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
import Ionicons from 'react-native-vector-icons/Ionicons';

const Index = () => {

  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchStarted, setSearchStarted] = useState(false);

  const memberData = [
    { id: 1, name: 'Suresh Behera', role: 'President' },
    { id: 2, name: 'Pramod Sahu', role: 'Secretary' },
    { id: 3, name: 'Manoj Nayak', role: 'Treasurer' },
    { id: 4, name: 'Bikash Das', role: 'Member' },
    { id: 5, name: 'Subrat Mishra', role: 'Member' },
    { id: 6, name: 'Rajeev Ranjan', role: 'Member' },
    { id: 7, name: 'Amit Kumar', role: 'Advisor' },
  ];

  useEffect(() => {
    setMembers(memberData);
    setFilteredMembers(memberData);
  }, []);

  useEffect(() => {
    if (query.length >= 3) {
      const results = members.filter((member) =>
        member.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMembers(results);
    } else {
      setFilteredMembers(members);
    }

    setSearchStarted(query.length > 0);
  }, [query]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Ionicons name="person-circle" size={40} color="#341551" />
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.role}>{item.role}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

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
      </View>

      {!searchStarted && (
        <View style={styles.placeholderContainer}>
          <Ionicons name="search-circle" size={80} color="#ddd" />
          <Text style={styles.placeholderText}>Start typing to search members</Text>
        </View>
      )}

      {searchStarted && (
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => item.id.toString()}
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
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    // padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#051b65',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
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
  },
});
