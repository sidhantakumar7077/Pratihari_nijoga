import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabView, TabBar } from 'react-native-tab-view';
import { base_url } from '../../../App';

const initialLayout = { width: Dimensions.get('window').width };

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || 'N/A'}</Text>
  </View>
);

const SectionCard = ({ title, children }) => (
  <View style={styles.sectionCard}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.cardContent}>{children}</View>
  </View>
);

const ProfileTab = ({ data }) => (
  <ScrollView contentContainerStyle={styles.tabContainer}>
    <SectionCard title="Personal Info">
      <View style={{ alignItems: 'center', marginBottom: 10 }}>
        <Image source={{ uri: data.profile_photo_url }} style={{ width: 100, height: 100, borderRadius: 50 }} />
      </View>
      <InfoRow label="Name" value={`${data.first_name} ${data.middle_name} ${data.last_name}`} />
      <InfoRow label="Alias" value={data.alias_name} />
      <InfoRow label="Email" value={data.email} />
      <InfoRow label="Phone" value={data.phone_no} />
      <InfoRow label="Whatsapp" value={data.whatsapp_no} />
      <InfoRow label="Blood Group" value={data.blood_group} />
      <InfoRow label="Health Card" value={data.healthcard_no} />
      {data.joining_date ?
        <InfoRow label="Joining Date" value={data.joining_date} />
        :
        <InfoRow label="Joining Year" value={data.joining_year} />
      }
      <InfoRow label="Date of Birth" value={data.date_of_birth} />
    </SectionCard>
  </ScrollView>
);

const FamilyTab = ({ data }) => (
  <ScrollView contentContainerStyle={styles.tabContainer}>
    <SectionCard title="Family Details">
      <InfoRow label="Father's Name" value={data.father_name} />
      <InfoRow label="Mother's Name" value={data.mother_name} />
      <InfoRow label="Marital Status" value={data.maritial_status} />
      <InfoRow label="Spouse's Name" value={data.spouse_name} />
    </SectionCard>
  </ScrollView>
);

const AddressTab = ({ data }) => (
  <ScrollView contentContainerStyle={styles.tabContainer}>
    <SectionCard title="Address">
      <InfoRow label="Address" value={data.address} />
      <InfoRow label="Sahi" value={data.sahi} />
      <InfoRow label="Landmark" value={data.landmark} />
      <InfoRow label="Post" value={data.post} />
      <InfoRow label="District" value={data.district} />
      <InfoRow label="Police Station" value={data.police_station} />
      <InfoRow label="Pincode" value={data.pincode} />
      <InfoRow label="District" value={data.district} />
      <InfoRow label="State" value={data.state} />
      <InfoRow label="Country" value={data.country} />
    </SectionCard>
  </ScrollView>
);

const IdCardTab = ({ data }) => (
  <ScrollView contentContainerStyle={styles.tabContainer}>
    {data.map((item, idx) => (
      <SectionCard key={idx} title={`ID Card #${idx + 1}`}>
        <InfoRow label="ID Type" value={item.id_type} />
        <InfoRow label="ID Number" value={item.id_number} />
      </SectionCard>
    ))}
  </ScrollView>
);

const OccupationTab = ({ data }) => (
  <ScrollView contentContainerStyle={styles.tabContainer}>
    {data.map((item, idx) => (
      <SectionCard key={idx} title={`Occupation #${idx + 1}`}>
        <InfoRow label="Occupation" value={item.occupation_type} />
        <InfoRow label="Extra Activity" value={item.extra_activity} />
      </SectionCard>
    ))}
  </ScrollView>
);

const Index = () => {
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = async () => {
    try {
      const token = await AsyncStorage.getItem('storeAccesstoken');
      const response = await fetch(`${base_url}api/get-all-pratihari-profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setProfileData(json.data);
      } else {
        console.warn('Failed to fetch profile data:', json.message);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'profile', title: 'Profile' },
    { key: 'family', title: 'Family' },
    { key: 'address', title: 'Address' },
    { key: 'idcard', title: 'ID Card' },
    { key: 'occupation', title: 'Occupation' },
  ]);

  const renderScene = ({ route }) => {
    if (!profileData) return <View style={styles.tabContainer}><Text>Loading data...</Text></View>;

    switch (route.key) {
      case 'profile':
        return <ProfileTab data={profileData.profile} />;
      case 'family':
        return <FamilyTab data={profileData.family} />;
      case 'address':
        return <AddressTab data={profileData.address} />;
      case 'idcard':
        return <IdCardTab data={profileData.idcard} />;
      case 'occupation':
        return <OccupationTab data={profileData.occupation} />;
      case 'social':
        return <SocialMediaTab data={profileData.socialMedia[0]} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#051b65" />
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile', { data: profileData })}>
          <Ionicons name="create-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{ backgroundColor: '#fff' }}
            style={{ backgroundColor: '#051b65' }}
            renderLabel={({ route, focused }) => (
              <Text style={[styles.tabLabel, { color: focused ? '#fff' : '#bbb' }]}>
                {route.title}
              </Text>
            )}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#051b65',
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  tabContainer: {
    padding: 16,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#051b65',
    marginBottom: 12,
  },
  cardContent: {},
  infoRow: {
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: '#777',
    fontWeight: '600',
  },
  value: {
    fontSize: 15,
    color: '#222',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});