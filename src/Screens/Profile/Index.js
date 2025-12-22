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
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { base_url } from '../../../App';
import Feather from 'react-native-vector-icons/Feather';

const InfoRow = ({ icon: Icon, label, value, iconName, iconColor = '#6366f1', rightContent = null }) => (
  <View style={styles.infoRow}>
    <View style={[styles.infoIcon, { backgroundColor: iconColor + '15' }]}>
      <Icon name={iconName} size={18} color={iconColor} />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || 'N/A'}</Text>
    </View>
    {rightContent}
  </View>
);

const SectionCard = ({ title, icon: Icon, iconName, children, gradient = ['#6366f1', '#8b5cf6'], onEditPress }) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <LinearGradient colors={gradient} style={styles.sectionIconContainer}>
          <Icon name={iconName} size={20} color="#fff" />
        </LinearGradient>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {title !== 'Seba' && (
        <TouchableOpacity onPress={() => onEditPress?.(title)}>
          <Feather name="edit" size={20} color="#94a3b8" />
        </TouchableOpacity>
      )}
    </View>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const FamilyMember = ({ name, relation, imageUrl, onImagePress }) => (
  <TouchableOpacity style={styles.familyMember} onPress={() => imageUrl && onImagePress(imageUrl)}>
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
  </TouchableOpacity>
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

export default function Index() {

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const mounted = useRef(true);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const [healthCardImageModal, setHealthCardImageModal] = useState(false);
  const [healthCardImageUrl, setHealthCardImageUrl] = useState('');

  const [familyImageModal, setFamilyImageModal] = useState(false);
  const [selectedFamilyImageUrl, setSelectedFamilyImageUrl] = useState('');

  const [idCardImageModal, setIdCardImageModal] = useState(false);
  const [selectedIdCardImageUrl, setSelectedIdCardImageUrl] = useState('');

  useEffect(() => {
    mounted.current = true;

    if (isFocused) {
      (async () => {
        try {
          const token = await AsyncStorage.getItem('storeAccesstoken');
          const res = await fetch(`${base_url}api/get-all-pratihari-profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const json = await res.json();
          if (mounted.current && json.success) {
            setProfileData(json.data);
            console.log("Profile Data:", json.data.sebaDetails);
          }
        } catch (e) {
          console.error(e);
        } finally {
          if (mounted.current) setLoading(false);
        }
      })();
    }
    return () => {
      mounted.current = false;
    };
  }, [isFocused]);

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

  const getSectionData = (section) => {
    switch (section) {
      case 'Personal Info':
        return profile;
      case 'Address':
        return address;
      case 'Family Members':
        return family;
      case 'Seba':
        return sebaDetails;
      case 'ID Cards':
        return idcard;
      case 'Occupation':
        return occupation;
      default:
        return {};
    }
  };

  const handleEditPress = (section) => {
    const dataToSend = getSectionData(section);

    let screenName = '';
    switch (section) {
      case 'Personal Info':
        screenName = 'ProfileEdit';
        break;
      case 'Address':
        screenName = 'Address';
        break;
      case 'Family Members':
      case 'Family':
        screenName = 'Familly';
        break;
      case 'Seba':
        screenName = 'SebaEdit';
        break;
      case 'ID Cards':
        screenName = 'IDCard';
        break;
      case 'Occupation':
        screenName = 'Occupation';
        break;
      case 'Social':
        screenName = 'Social';
        break;
      default:
        return;
    }

    navigation.navigate(screenName, {
      section,
      data: dataToSend,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'pending': return 'Pending Approval';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  const tabs = [
    { id: 'overview', title: 'Personal', icon: Feather, iconName: 'user' },
    { id: 'family', title: 'Family', icon: Feather, iconName: 'heart' },
    { id: 'details', title: 'Profession', icon: Feather, iconName: 'briefcase' },
  ];

  const renderOverview = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <SectionCard title="Personal Info" icon={Feather} iconName="user" onEditPress={() => handleEditPress('Personal Info')}>
        <InfoRow icon={Feather} iconName="mail" label="Email" value={profile.email} />
        <InfoRow icon={Feather} iconName="phone" label="Phone" value={profile.phone_no} iconColor="#10b981" />
        <InfoRow icon={Feather} iconName="message-circle" label="WhatsApp" value={profile.whatsapp_no} iconColor="#25d366" />
        <InfoRow icon={Feather} iconName="calendar" label="Date of Birth" value={profile.date_of_birth} iconColor="#f59e0b" />
        <InfoRow icon={Feather} iconName="droplet" label="Blood Group" value={profile.blood_group} iconColor="#ef4444" />
        {profile.joining_date && <InfoRow icon={Feather} iconName="clock" label="Joining Date" value={profile.joining_date} iconColor="#8b5cf6" />}
        {profile.joining_year && !profile.joining_date && <InfoRow icon={Feather} iconName="clock" label="Joining Year" value={profile.joining_year} iconColor="#8b5cf6" />}
        <InfoRow
          icon={Feather}
          iconName="credit-card"
          label="Health Card"
          value={profile.healthcard_no}
          iconColor="#ef4444"
          rightContent={
            profile.healthcard_photo ? (
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => {
                  setHealthCardImageUrl(profile.healthcard_photo);
                  setHealthCardImageModal(true);
                }}
              >
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      </SectionCard>

      <Modal
        visible={healthCardImageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setHealthCardImageModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Image
              source={{ uri: healthCardImageUrl }}
              style={styles.modalImage}
              resizeMode="contain"
            />
            <TouchableOpacity onPress={() => setHealthCardImageModal(false)} style={styles.modalCloseButton}>
              <Feather name="x" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SectionCard title="Address" icon={Feather} iconName="map-pin" gradient={['#10b981', '#059669']} onEditPress={() => handleEditPress('Address')}>
        <Text style={styles.addressSubHeading}>Current Address :</Text>
        <InfoRow icon={Feather} iconName="map-pin" label="Address" value={address.address} />
        <InfoRow icon={Feather} iconName="map" label="Sahi" value={address.sahi} />
        <InfoRow icon={Feather} iconName="map" label="Landmark" value={address.landmark} />
        <InfoRow icon={Feather} iconName="map" label="Post" value={address.post} />
        <InfoRow icon={Feather} iconName="map" label="District" value={address.district} />
        <InfoRow icon={Feather} iconName="map" label="Police Station" value={address.police_station} />
        <InfoRow icon={Feather} iconName="map" label="Pincode" value={address.pincode} />
        <InfoRow icon={Feather} iconName="map" label="State" value={address.state} />
        <InfoRow icon={Feather} iconName="map" label="Country" value={address.country} />

        <Text style={styles.addressSubHeading}>Permanent Address :</Text>
        {address.same_as_permanent_address === 0 ? (
          <>
            <InfoRow icon={Feather} iconName="map-pin" label="Address" value={address.per_address} />
            <InfoRow icon={Feather} iconName="map" label="Sahi" value={address.per_sahi} />
            <InfoRow icon={Feather} iconName="map" label="Landmark" value={address.per_landmark} />
            <InfoRow icon={Feather} iconName="map" label="Post" value={address.per_post} />
            <InfoRow icon={Feather} iconName="map" label="District" value={address.per_district} />
            <InfoRow icon={Feather} iconName="map" label="Police Station" value={address.per_police_station} />
            <InfoRow icon={Feather} iconName="map" label="Pincode" value={address.per_pincode} />
            <InfoRow icon={Feather} iconName="map" label="State" value={address.per_state} />
            <InfoRow icon={Feather} iconName="map" label="Country" value={address.per_country} />
          </>
        ) : (
          <Text style={styles.sameAddressNote}>Same as current address</Text>
        )}
      </SectionCard>

      <View style={styles.actionsSection}>
        <Text style={styles.actionsSectionTitle}>Quick Actions</Text>
        {/* <ActionCard title="Edit Profile" subtitle="Update info" icon={Feather} iconName="edit" color="#6366f1" />
        <ActionCard title="Settings" subtitle="Preferences" icon={Feather} iconName="settings" color="#10b981" /> */}
        <ActionCard title="Sign Out" subtitle="Logout" icon={Feather} iconName="log-out" color="#ef4444" onPress={() => setLogoutModalVisible(true)} />
      </View>

      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.confirmModal}>
            <Feather name="log-out" size={36} color="#ef4444" style={{ marginBottom: 16 }} />
            <Text style={styles.confirmTitle}>Log out</Text>
            <Text style={styles.confirmMessage}>Are you sure you want to log out of your account?</Text>

            <View style={styles.confirmButtonGroup}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.cancelButton]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={[styles.confirmButtonText, { color: '#374151' }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmButton, styles.logoutButton]}
                onPress={async () => {
                  setLogoutModalVisible(false);
                  await AsyncStorage.clear();
                  navigation.replace('NewLogin');
                }}
              >
                <Text style={styles.confirmButtonText}>Yes, Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );

  const renderFamily = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <SectionCard title="Family Members" icon={Feather} iconName="users" onEditPress={() => handleEditPress('Family Members')}>
        <View style={styles.familyGrid}>
          <FamilyMember name={family.father_name} relation="Father" imageUrl={family.father_photo_url} onImagePress={(url) => { setSelectedFamilyImageUrl(url); setFamilyImageModal(true); }} />
          <FamilyMember name={family.mother_name} relation="Mother" imageUrl={family.mother_photo_url} onImagePress={(url) => { setSelectedFamilyImageUrl(url); setFamilyImageModal(true); }} />
          {family.maritial_status === 'married' && (
            <FamilyMember name={family.spouse_name} relation="Spouse" imageUrl={family.spouse_photo_url} onImagePress={(url) => { setSelectedFamilyImageUrl(url); setFamilyImageModal(true); }} />
          )}
        </View>
        <InfoRow icon={Feather} iconName="heart" label="Marital Status" value={family.maritial_status} iconColor="#ec4899" />
        {Array.isArray(family.children) && family.children.length > 0 && (
          <>
            <Text style={styles.childrenTitle}>Children</Text>
            <View style={styles.familyGrid}>
              {family.children.map((child, index) => (
                <FamilyMember
                  key={child.id}
                  name={child.children_name}
                  relation={`${child.gender === 'male' ? 'Son' : 'Daughter'} (DOB: ${child.date_of_birth})`}
                  imageUrl={child.photo_url}
                  onImagePress={(url) => {
                    if (url) {
                      setSelectedFamilyImageUrl(url);
                      setFamilyImageModal(true);
                    }
                  }}
                />
              ))}
            </View>
          </>
        )}
      </SectionCard>

      <Modal
        visible={familyImageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setFamilyImageModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Image
              source={{ uri: selectedFamilyImageUrl }}
              style={styles.modalImage}
              resizeMode="contain"
            />
            <TouchableOpacity onPress={() => setFamilyImageModal(false)} style={styles.modalCloseButton}>
              <Feather name="x" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );

  const renderDetails = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* <SectionCard title="Seba" icon={Feather} iconName="award" gradient={['#f59e0b', '#d97706']}>
        {sebaDetails.map((seba, i) => (
          <View key={i}>
            <InfoRow icon={Feather} iconName="award" label={seba.seba_name} value={seba.beddha_id.join(', ')} />
          </View>
        ))}
      </SectionCard> */}
      <SectionCard title="ID Cards" icon={Feather} iconName="credit-card" gradient={['#8b5cf6', '#7c3aed']} onEditPress={() => handleEditPress('ID Cards')}>
        {idcard.map((item, i) => (
          <InfoRow
            key={i}
            icon={Feather}
            iconName="credit-card"
            label={item.id_type}
            value={item.id_number}
            rightContent={
              item.id_photo ? (
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => {
                    setSelectedIdCardImageUrl(item.id_photo);
                    setIdCardImageModal(true);
                  }}
                >
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              ) : null
            }
          />
        ))}
      </SectionCard>
      <SectionCard title="Occupation" icon={Feather} iconName="briefcase" gradient={['#f59e0b', '#d97706']} onEditPress={() => handleEditPress('Occupation')}>
        {occupation.map((occ, i) => (
          <View key={i}>
            <InfoRow icon={Feather} iconName="briefcase" label="Type" value={occ.occupation_type} />
            <InfoRow icon={Feather} iconName="activity" label="Activities" value={occ.extra_activity} />
          </View>
        ))}
      </SectionCard>

      <Modal
        visible={idCardImageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setIdCardImageModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Image
              source={{ uri: selectedIdCardImageUrl }}
              style={styles.modalImage}
              resizeMode="contain"
            />
            <TouchableOpacity onPress={() => setIdCardImageModal(false)} style={styles.modalCloseButton}>
              <Feather name="x" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );

  const renderTabContent = () => {
    if (activeTab === 'overview') return renderOverview();
    if (activeTab === 'family') return renderFamily();
    return renderDetails();
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4c1d95', '#6366f1']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20, top: 20 }}>
          <Feather name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.profileHeader}>
          {profile.profile_photo ? (
            <Image source={{ uri: profile.profile_photo }} style={styles.profileImage} />
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
    paddingTop: 20,
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
    marginHorizontal: 12,
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
    paddingHorizontal: 15,
  },
  healthCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'center',
    marginLeft: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 20,
  },
  addressSubHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  sameAddressNote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6b7280',
    marginTop: 6,
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
    justifyContent: 'space-between',
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
  childrenTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    marginTop: 8,
    marginLeft: 8,
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
  confirmModal: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
  },
  confirmMessage: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});