import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { base_url } from '../../../App';

import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const InfoRow = ({ icon: Icon, label, value, iconName, iconColor = '#6366f1' }) => (
  <View style={styles.infoRow}>
    <View style={[styles.infoIcon, { backgroundColor: iconColor + '15' }]}>
      <Icon name={iconName} size={18} color={iconColor} />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || 'N/A'}</Text>
    </View>
  </View>
);

const SectionCard = ({ title, icon: Icon, iconName, children, gradient = ['#6366f1', '#8b5cf6'] }) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <LinearGradient colors={gradient} style={styles.sectionIconContainer}>
        <Icon name={iconName} size={20} color="#fff" />
      </LinearGradient>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const FamilyMember = ({ name, relation, imageUrl }) => (
  <View style={styles.familyMember}>
    <View style={styles.familyImageContainer}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.familyImage} />
      ) : (
        <View style={styles.familyImagePlaceholder}>
          <Feather name="user" size={24} color="#94a3b8" />
        </View>
      )}
    </View>
    <Text style={styles.familyName}>{name}</Text>
    <Text style={styles.familyRelation}>{relation}</Text>
  </View>
);

const ActionCard = ({ title, subtitle, icon: Icon, iconName, color, onPress }) => (
  <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.actionIcon, { backgroundColor: color + '15' }]}>
      <Icon name={iconName} size={20} color={color} />
    </View>
    <View style={styles.actionContent}>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </View>
    <Feather name="chevron-right" size={20} color="#94a3b8" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const navigation = useNavigation();
  const mounted = useRef(true);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    mounted.current = true;
    (async () => {
      try {
        const token = await AsyncStorage.getItem('storeAccesstoken');
        const res = await fetch(`${base_url}api/get-all-pratihari-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (mounted.current && json.success) {
          setProfileData(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted.current) setLoading(false);
      }
    })();
    return () => {
      mounted.current = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load profile data</Text>
      </View>
    );
  }

  const { profile, family, address, idcard, occupation, sebaDetails } = profileData;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'pending': return 'Pending Approval';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  const tabs = [
    { id: 'overview', title: 'Overview', icon: Feather, iconName: 'user' },
    { id: 'family', title: 'Family', icon: Feather, iconName: 'heart' },
    { id: 'details', title: 'Details', icon: Feather, iconName: 'info' },
  ];

  const renderOverview = () => (
    <ScrollView style={styles.tabContent}>
      <SectionCard title="Personal Info" icon={Feather} iconName="user">
        <InfoRow icon={Feather} iconName="mail" label="Email" value={profile.email} />
        <InfoRow icon={Feather} iconName="phone" label="Phone" value={profile.phone_no} iconColor="#10b981" />
        <InfoRow icon={Feather} iconName="message-circle" label="WhatsApp" value={profile.whatsapp_no} iconColor="#25d366" />
        <InfoRow icon={Feather} iconName="calendar" label="Date of Birth" value={profile.date_of_birth} iconColor="#f59e0b" />
        <InfoRow icon={Feather} iconName="clock" label="Joining Date" value={profile.joining_date} iconColor="#8b5cf6" />
        <InfoRow icon={Feather} iconName="credit-card" label="Health Card" value={profile.healthcard_no} iconColor="#ef4444" />
      </SectionCard>

      <SectionCard title="Address" icon={Feather} iconName="map-pin" gradient={['#10b981', '#059669']}>
        <InfoRow icon={Feather} iconName="map-pin" label="Address" value={address.address} />
        <InfoRow icon={Feather} iconName="map" label="Landmark" value={address.landmark} />
        <InfoRow icon={Feather} iconName="map" label="District" value={address.district} />
        <InfoRow icon={Feather} iconName="map" label="State" value={address.state} />
        <InfoRow icon={Feather} iconName="map" label="Pincode" value={address.pincode} />
      </SectionCard>

      <SectionCard title="Occupation" icon={Feather} iconName="briefcase" gradient={['#f59e0b', '#d97706']}>
        {occupation.map((occ, i) => (
          <View key={i}>
            <InfoRow icon={Feather} iconName="briefcase" label="Type" value={occ.occupation_type} />
            <InfoRow icon={Feather} iconName="activity" label="Activities" value={occ.extra_activity} />
          </View>
        ))}
      </SectionCard>

      <View style={styles.actionsSection}>
        <Text style={styles.actionsSectionTitle}>Quick Actions</Text>
        <ActionCard title="Edit Profile" subtitle="Update info" icon={Feather} iconName="edit" color="#6366f1" />
        <ActionCard title="Settings" subtitle="Preferences" icon={Feather} iconName="settings" color="#10b981" />
        <ActionCard title="Sign Out" subtitle="Logout" icon={Feather} iconName="log-out" color="#ef4444" />
      </View>
    </ScrollView>
  );

  const renderFamily = () => (
    <ScrollView style={styles.tabContent}>
      <SectionCard title="Family Members" icon={Feather} iconName="users">
        <View style={styles.familyGrid}>
          <FamilyMember name={family.father_name} relation="Father" imageUrl={family.father_photo_url} />
          <FamilyMember name={family.mother_name} relation="Mother" imageUrl={family.mother_photo_url} />
          {family.maritial_status === 'married' && (
            <FamilyMember name={family.spouse_name} relation="Spouse" imageUrl={family.spouse_photo_url} />
          )}
        </View>
        <InfoRow icon={Feather} iconName="heart" label="Marital Status" value={family.maritial_status} iconColor="#ec4899" />
      </SectionCard>
    </ScrollView>
  );

  const renderDetails = () => (
    <ScrollView style={styles.tabContent}>
      <SectionCard title="ID Cards" icon={Feather} iconName="credit-card" gradient={['#8b5cf6', '#7c3aed']}>
        {idcard.map((item, i) => (
          <InfoRow
            key={i}
            icon={Feather}
            iconName="credit-card"
            label={item.id_type}
            value={item.id_number}
          />
        ))}
      </SectionCard>
      <SectionCard title="Services" icon={Feather} iconName="award" gradient={['#f59e0b', '#d97706']}>
        {sebaDetails.map((seba, i) => (
          <View key={i}>
            <InfoRow icon={Feather} iconName="award" label="Service" value={seba.seba_name} />
            <InfoRow icon={Feather} iconName="hash" label="Beddha IDs" value={seba.beddha_id.join(', ')} />
          </View>
        ))}
      </SectionCard>
    </ScrollView>
  );

  const renderTabContent = () => {
    if (activeTab === 'overview') return renderOverview();
    if (activeTab === 'family') return renderFamily();
    return renderDetails();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4c1d95" />
      <LinearGradient colors={['#4c1d95', '#6366f1']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20, top: 50 }}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.profileHeader}>
          {profile.profile_photo_url ? (
            <Image source={{ uri: profile.profile_photo_url }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Feather name="user" size={40} color="#fff" />
            </View>
          )}
          <Text style={styles.profileName}>
            {profile.first_name} {profile.middle_name} {profile.last_name}
          </Text>
          <Text style={styles.profileAlias}>({profile.alias_name})</Text>
          <Text style={styles.profileId}>{profile.pratihari_id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(profile.pratihari_status) }]}>
            <Text style={styles.statusText}>{getStatusText(profile.pratihari_status)}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.tabNavigation}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, activeTab === tab.id && styles.activeTabButton]}
            onPress={() => setActiveTab(tab.id)}
          >
            <tab.icon name={tab.iconName} size={20} color={activeTab === tab.id ? '#6366f1' : '#94a3b8'} />
            <Text style={[styles.tabButtonText, activeTab === tab.id && styles.activeTabButtonText]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.contentContainer}>
        {renderTabContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '500',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10b981',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  profileAlias: {
    fontSize: 16,
    color: '#e2e8f0',
    marginTop: 4,
  },
  profileId: {
    fontSize: 14,
    color: '#cbd5e1',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  activeTabButton: {
    backgroundColor: '#f1f5f9',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
    marginLeft: 6,
  },
  activeTabButtonText: {
    color: '#6366f1',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    marginTop: 20,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  sectionContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  familyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  familyMember: {
    alignItems: 'center',
    marginBottom: 16,
    width: '30%',
  },
  familyImageContainer: {
    marginBottom: 8,
  },
  familyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ec4899',
  },
  familyImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ec4899',
    backgroundColor: '#fdf2f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  familyName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  familyRelation: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  idCardItem: {
    marginBottom: 8,
  },
  sebaItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  actionsSection: {
    marginBottom: 20,
  },
  actionsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
});