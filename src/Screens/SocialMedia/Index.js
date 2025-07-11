import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { base_url } from '../../../App';

const Index = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [socialProfiles, setSocialProfiles] = useState(null);

  const getSocialProfiles = async () => {
    try {
      const token = await AsyncStorage.getItem('storeAccesstoken');
      const response = await fetch(`${base_url}api/get-socialmedia`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.status && result.data) {
        setSocialProfiles(result.data);
        console.log("Social profiles fetched successfully:", result.data);
      } else {
        console.error('Failed to fetch social profiles:', result.message);
        setSocialProfiles(null);
      }
    } catch (error) {
      console.error('Error fetching social profiles:', error);
      setSocialProfiles(null);
    }
  };

  const openLink = (url) => {
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.error('Error opening URL:', err)
      );
    }
  };

  const profiles = [
    {
      platform: 'Facebook',
      icon: <FontAwesome name="facebook" size={28} color="#3b5998" />,
      color: '#3b5998',
      urlKey: 'facebook_url',
    },
    {
      platform: 'Instagram',
      icon: <Entypo name="instagram" size={28} color="#E1306C" />,
      color: '#E1306C',
      urlKey: 'instagram_url',
    },
    {
      platform: 'X',
      icon: <FontAwesome name="twitter" size={28} color="#1DA1F2" />,
      color: '#1DA1F2',
      urlKey: 'twitter_url',
    },
    {
      platform: 'LinkedIn',
      icon: <Entypo name="linkedin" size={28} color="#0077b5" />,
      color: '#0077b5',
      urlKey: 'linkedin_url',
    },
    {
      platform: 'YouTube',
      icon: (
        <MaterialCommunityIcons
          name="youtube"
          size={28}
          color="#FF0000"
        />
      ),
      color: '#FF0000',
      urlKey: 'youtube_url',
    },
  ];

  useEffect(() => {
    if (isFocused) {
      getSocialProfiles();
    }
  }, [isFocused]);

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
          <Text style={styles.headerTitle}>Social Media</Text>
        </View>
        <Text style={styles.headerSubtitle}>Check out your social media Profiles</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          {profiles.map((item, index) => {
            const url = socialProfiles?.[item.urlKey];
            if (!url) return null;

            return (
              <TouchableOpacity
                key={index}
                style={[styles.card, { borderLeftColor: item.color }]}
                activeOpacity={0.9}
                onPress={() => openLink(url)}
              >
                <View style={styles.iconContainer}>{item.icon}</View>
                <View style={styles.textContainer}>
                  <Text style={styles.platform}>{item.platform}</Text>
                  <Text style={styles.handle}>{url}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
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
  content: {
    paddingVertical: 10,
    width: '90%',
    alignSelf: 'center',
    paddingBottom: 20,
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
