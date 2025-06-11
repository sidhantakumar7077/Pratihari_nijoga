import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Index = () => {

  const navigation = useNavigation();

  const socialProfiles = [
    {
      id: '1',
      platform: 'Facebook',
      icon: <FontAwesome name="facebook" size={28} color="#3b5998" />,
      handle: 'facebook.com/yourusername',
      url: 'https://facebook.com/yourusername',
    },
    {
      id: '2',
      platform: 'Instagram',
      icon: <Entypo name="instagram" size={28} color="#E1306C" />,
      handle: '@yourinsta',
      url: 'https://instagram.com/yourinsta',
    },
    {
      id: '3',
      platform: 'Twitter',
      icon: <FontAwesome name="twitter" size={28} color="#1DA1F2" />,
      handle: '@yourtwitter',
      url: 'https://twitter.com/yourtwitter',
    },
    {
      id: '4',
      platform: 'LinkedIn',
      icon: <Entypo name="linkedin" size={28} color="#0077b5" />,
      handle: 'linkedin.com/in/yourprofile',
      url: 'https://linkedin.com/in/yourprofile',
    },
    {
      id: '5',
      platform: 'YouTube',
      icon: <MaterialCommunityIcons name="youtube" size={28} color="#FF0000" />,
      handle: 'youtube.com/yourchannel',
      url: 'https://youtube.com/yourchannel',
    },
  ];

  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error('Error opening URL:', err));
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'Facebook':
        return '#3b5998';
      case 'Instagram':
        return '#E1306C';
      case 'Twitter':
        return '#1DA1F2';
      case 'LinkedIn':
        return '#0077b5';
      case 'YouTube':
        return '#FF0000';
      default:
        return '#ccc';
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: getPlatformColor(item.platform) }]}
      activeOpacity={0.9}
      onPress={() => openLink(item.url)}
    >
      <View style={styles.iconContainer}>{item.icon}</View>
      <View style={styles.textContainer}>
        <Text style={styles.platform}>{item.platform}</Text>
        <Text style={styles.handle}>{item.handle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Social Media</Text>
      </View>
      <FlatList
        data={socialProfiles}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 10, width: '90%', alignSelf: 'center' }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    // paddingHorizontal: 16,
    // paddingTop: 20,
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  platform: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  handle: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
});
