import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ImageBackground, ScrollView, BackHandler, ToastAndroid, StatusBar, Modal, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Swiper from 'react-native-swiper';
import { base_url } from '../../../App';
import DrawerModal from "../../Component/DrawerModal";
import moment from 'moment';

// images
const image1 = require('../../assets/images/slideImg5.jpg');
const image2 = require('../../assets/images/slideImg6.jpg');
const image3 = require('../../assets/images/slideImg7.webp');

const Index = () => {

    const menuData = [
        {
            id: 1,
            lable: 'Upcoming Pali',
            description: 'View upcoming Pali events and schedules',
            icon: { tag: 'Ionicons', name: 'time-outline', color: '#4c1d95' },
            backgroundColor: '#f3daf7',
            page: 'UpcomingPali'
        },
        {
            id: 2,
            lable: 'Pali History',
            description: 'Explore the history of Pali events',
            icon: { tag: 'Feather', name: 'calendar', color: '#e11d48' },
            backgroundColor: '#fcdee9',
            page: 'PaliHistory'
        },
        {
            id: 3,
            lable: 'Notice',
            description: 'Stay updated with the latest notices and announcements',
            icon: { tag: 'AntDesign', name: 'notification', color: '#0ea5e9' },
            backgroundColor: '#d7f7f4',
            page: 'Notice'
        },
        {
            id: 4,
            lable: 'Social Media',
            description: 'Check out your social media Profiles',
            icon: { tag: 'AntDesign', name: 'sharealt', color: '#f59e0b' },
            backgroundColor: '#f7f4da',
            page: 'SocialMedia'
        },
        {
            id: 5,
            lable: 'Committee',
            description: 'View the committee members and their roles',
            icon: { tag: 'AntDesign', name: 'team', color: '#16a34a' },
            backgroundColor: '#e7f7d7',
            page: 'Committee'
        },
        {
            id: 6,
            lable: 'Application',
            description: 'Apply for various services and events',
            icon: { tag: 'AntDesign', name: 'appstore1', color: '#f43f5e' },
            backgroundColor: '#f5e1e1',
            page: 'Application'
        },
    ];

    const IconMap = {
        AntDesign,
        FontAwesome,
        MaterialIcons,
        Ionicons,
        Feather
    };

    const stats = [
        { label: 'Total Events', value: '24', icon: 'calendar' },
        { label: 'Active Members', value: '156', icon: 'people' },
        { label: 'Achievements', value: '8', icon: 'trophy' },
        { label: 'Rating', value: '4.8', icon: 'star' },
    ];

    const quickActions = [
        { id: 1, title: 'Search', icon: 'search', color: '#6366f1' },
        { id: 2, title: 'Profile', icon: 'person', color: '#10b981' },
        { id: 3, title: 'Settings', icon: 'settings', color: '#f59e0b' },
        { id: 4, title: 'Help', icon: 'help-circle', color: '#ef4444' },
    ];

    const images = [image3, image2, image1];

    const insets = useSafeAreaInsets();
    const [backPressCount, setBackPressCount] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const closeDrawer = () => setIsDrawerOpen(false);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [currentSeba, setCurrentSeba] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    useEffect(() => {
        const handleBackPress = () => {
            if (backPressCount === 1) {
                BackHandler.exitApp(); // Exit the app if back button is pressed twice within 2 seconds
                return true;
            }

            ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
            setBackPressCount(1);

            const timeout = setTimeout(() => {
                setBackPressCount(0);
            }, 2000); // Reset back press count after 2 seconds

            return true; // Prevent default behavior
        };

        if (isFocused) {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

            return () => backHandler.remove(); // Cleanup the event listener when the component unmounts or navigates away
        }
    }, [backPressCount, isFocused]);

    const [profileDetails, setProfileDetails] = useState(null);
    const [rejetedReason, setRejetedReason] = useState(null);
    const [todayPratihariBedha, setTodayPratihariBedha] = useState(null);
    const [todayGochhikarBedha, setTodayGochhikarBedha] = useState(null);

    const getProfileDetails = async () => {
        try {
            const response = await fetch(base_url + 'api/get-home-page', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('storeAccesstoken')}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                // console.log('Profile details fetched successfully', data.data.profile);
                setProfileDetails(data.data.profile);
                setRejetedReason(data.data.reject_reason.reason);
                setTodayPratihariBedha(data.data.today_pratihari_beddha);
                setTodayGochhikarBedha(data.data.today_gochhikar_beddha);
            } else {
                console.log('Failed to fetch profile details', data);
            }
        } catch (error) {
            console.log('Error fetching profile details', error);
        }
    }

    // ---- FETCH & PICK CURRENT/UPCOMING ----
    const fetchSebaAndBedhas = async () => {
        try {
            const token = await AsyncStorage.getItem('storeAccesstoken');
            const res = await fetch(`${base_url}api/pratihari-seba-dates`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const text = await res.text();
            let data;
            try { data = JSON.parse(text); } catch { throw new Error(text?.slice(0, 300) || 'Non-JSON'); }

            if (data?.status && data?.data) {
                const today = moment().format('YYYY-MM-DD');
                const dates = Object.keys(data.data).sort();

                if (data.data[today]) {
                    const sebaObj = data.data[today][0]; // { seba_id, seba, beddha_id, type }
                    setCurrentSeba({ date: today, ...sebaObj }); // keep seba_id as string
                    setIsRunning(sebaObj?.seba_status === 'started');
                } else {
                    const upcoming = dates.find(d => moment(d).isAfter(moment()));
                    if (upcoming) {
                        const sebaObj = data.data[upcoming][0];
                        setCurrentSeba({ date: upcoming, ...sebaObj });
                    } else {
                        setCurrentSeba(null);
                    }
                }
            }
        } catch (e) {
            console.log('Error fetching events:', e);
        }
    };

    // ---- GENERIC AUTH POST + ENDPOINTS ----
    const apiPost = async (path, body) => {
        const token = await AsyncStorage.getItem('storeAccesstoken');
        const res = await fetch(`${base_url}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } catch { throw new Error(text?.slice(0, 300) || 'Non-JSON response'); }
        if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
        return data;
    };

    const startSeba = (payload) => apiPost('api/start-seba', payload);
    const endSeba = (payload) => apiPost('api/end-seba', payload);

    // ---- CONFIRM & EXECUTE ----
    const handleStartStopPress = () => {
        if (!currentSeba) return;
        const isToday = moment().isSame(currentSeba.date, 'day');
        if (!isToday) return;

        const willStart = currentSeba.seba_status !== 'started';
        setConfirmAction(willStart ? 'start' : 'stop');
        setConfirmVisible(true);
    };

    const confirmActionNow = async () => {
        if (!currentSeba) return;
        const { seba_id, beddha_id } = currentSeba;
        if (!seba_id || !beddha_id) return;

        setActionLoading(true);
        try {
            if (confirmAction === 'start') {
                await startSeba({ seba_id, beddha_id });
                setCurrentSeba(prev => ({ ...prev, seba_status: 'started' }));
                setIsRunning(true);
            } else {
                await endSeba({ seba_id, beddha_id });
                // backend marks completed; reflect that here
                setCurrentSeba(prev => ({ ...prev, seba_status: 'completed' }));
                setIsRunning(false);
            }
        } catch (e) {
            Alert.alert('Error', e.message);
        } finally {
            setActionLoading(false);
            setConfirmVisible(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            getProfileDetails();
            fetchSebaAndBedhas();
        }
    }, [isFocused]);

    const renderMenuItem = ({ item }) => {
        const IconComponent = IconMap[item.icon.tag];

        return (
            <TouchableOpacity
                style={[styles.menuCard, { backgroundColor: item.backgroundColor }]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate(item.page)}
            >
                <View style={[styles.menuIconContainer, { backgroundColor: item.icon.color + '20' }]}>
                    {IconComponent && (
                        <IconComponent name={item.icon.name} size={24} color={item.icon.color} />
                    )}
                </View>
                <Text style={styles.menuTitle}>{item.lable}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom, }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#4c1d95" />
            <DrawerModal visible={isDrawerOpen} onClose={closeDrawer} profileDetails={profileDetails} />
            <LinearGradient
                colors={['#4c1d95', '#6366f1', '#8b5cf6']}
                // colors={['#ff6b6b', '#feca57']}
                style={styles.headerContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Header Top Section */}
                <View style={styles.headerTop}>
                    <TouchableOpacity
                        style={styles.searchContainer}
                        onPress={() => navigation.navigate('Search')}
                    >
                        <Ionicons name="search" size={20} color="#ffffff" />
                        <Text style={styles.searchText}>Search...</Text>
                    </TouchableOpacity>
                    <View style={styles.headerActions}>
                        {/* <TouchableOpacity
                            onPress={() => navigation.navigate('Profile')}
                            style={styles.headerActionButton}
                        >
                            <FontAwesome name="user" size={20} color="#ffffff" />
                        </TouchableOpacity> */}
                        <TouchableOpacity
                            onPress={() => setIsDrawerOpen(true)}
                            style={styles.headerActionButton}
                        >
                            <Feather name="menu" size={24} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <View style={styles.profileInfo}>
                        <Text style={styles.greeting}>Welcome back,</Text>
                        <Text style={styles.userName}>
                            {profileDetails?.first_name} {profileDetails?.middle_name} {profileDetails?.last_name}
                        </Text>
                        <Text style={styles.userAlias}>
                            ({profileDetails?.alias_name ? profileDetails?.alias_name : profileDetails?.phone_no})
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.profileImageContainer} onPress={() => navigation.navigate('Profile')}>
                        {profileDetails?.profile_photo_url ? (
                            <Image
                                source={{ uri: profileDetails?.profile_photo_url }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <View style={styles.profileImagePlaceholder}>
                                <FontAwesome name="user" size={40} color="#ffffff" />
                            </View>
                        )}
                        <View style={styles.onlineIndicator} />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Main Body */}
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, marginHorizontal: 20 }}>
                    {/* Pratihari Card */}
                    <View
                        style={{
                            width: '48%',
                            height: 80,
                            backgroundColor: '#e7f7d7',
                            borderRadius: 16,
                            padding: 15,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            shadowColor: '#000',
                            shadowOpacity: 0.1,
                            shadowRadius: 6,
                            elevation: 4,
                        }}
                    >
                        <View style={{ width: '35%', alignItems: 'center' }}>
                            <Ionicons name="people" size={32} color="#16a34a" />
                        </View>
                        <View style={{ width: '60%' }}>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: '#16a34a' }}>
                                Pratihari
                            </Text>
                            <Text style={{ fontSize: 13, color: '#16a34a', marginTop: 4 }}>
                                {todayPratihariBedha || '-'}
                            </Text>
                        </View>
                    </View>

                    {/* Gochhikar Card */}
                    <View
                        style={{
                            width: '48%',
                            height: 80,
                            backgroundColor: '#d7f7f4',
                            borderRadius: 16,
                            padding: 15,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            shadowColor: '#000',
                            shadowOpacity: 0.1,
                            shadowRadius: 6,
                            elevation: 4,
                        }}
                    >
                        <View style={{ width: '35%', alignItems: 'center' }}>
                            <Feather name="users" size={32} color="#0ea5e9" />
                        </View>
                        <View style={{ width: '60%' }}>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: '#0ea5e9' }}>
                                Gochhikar
                            </Text>
                            <Text style={{ fontSize: 13, color: '#0ea5e9', marginTop: 4 }}>
                                {todayGochhikarBedha || '-'}
                            </Text>
                        </View>
                    </View>
                </View>

                {currentSeba && (
                    <View style={styles.currentEventSection}>
                        <View style={styles.currentEventCard}>
                            <LinearGradient
                                colors={['#ff6b6b', '#feca57']}
                                style={styles.currentEventGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <View style={styles.currentEventContent}>
                                    {/* Info */}
                                    <View style={styles.currentEventInfo}>
                                        <Text style={styles.currentEventTitle}>
                                            {currentSeba?.seba || 'No Seba'}
                                        </Text>
                                        {currentSeba && (
                                            <View style={styles.currentEventDetails}>
                                                <View style={styles.currentEventDetail}>
                                                    <Ionicons name="calendar-outline" size={16} color="#fff" />
                                                    <Text style={styles.currentEventDetailText}>
                                                        {moment(currentSeba.date).format('DD MMM YYYY')}
                                                    </Text>
                                                </View>
                                                <View style={styles.currentEventDetail}>
                                                    <Ionicons name="person-outline" size={16} color="#fff" />
                                                    <Text style={styles.currentEventDetailText}>
                                                        Beddha: {currentSeba.beddha_id}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>

                                    {/* Status / Button */}
                                    <View style={styles.currentEventStatus}>
                                        {currentSeba ? (
                                            moment().isSame(currentSeba.date, 'day') ? (
                                                currentSeba.seba_status === 'completed' ? (
                                                    <View style={[styles.statusBadge, { backgroundColor: 'rgba(16,185,129,0.25)' }]}>
                                                        <Text style={styles.statusText}>Completed</Text>
                                                    </View>
                                                ) : (
                                                    <TouchableOpacity
                                                        style={styles.statusBadge}
                                                        onPress={handleStartStopPress}
                                                        disabled={actionLoading}
                                                        activeOpacity={0.8}
                                                    >
                                                        {actionLoading ? (
                                                            <ActivityIndicator size="small" color="#fff" />
                                                        ) : (
                                                            <Text style={styles.statusText}>
                                                                {currentSeba.seba_status === 'started' ? 'Stop' : 'Start'}
                                                            </Text>
                                                        )}
                                                    </TouchableOpacity>
                                                )
                                            ) : (
                                                <View style={styles.statusBadge}>
                                                    <Text style={styles.statusText}>
                                                        {currentSeba.seba_status === 'started'
                                                            ? 'Started'
                                                            : currentSeba.seba_status === 'completed' || currentSeba.seba_status === 'ended'
                                                                ? 'Completed'
                                                                : 'Upcoming'}
                                                    </Text>
                                                </View>
                                            )
                                        ) : null}
                                    </View>
                                </View>
                            </LinearGradient>
                        </View>

                        {/* Confirm Modal */}
                        <Modal
                            visible={confirmVisible}
                            transparent
                            animationType="fade"
                            onRequestClose={() => setConfirmVisible(false)}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalCard}>
                                    <Text style={styles.modalTitle}>
                                        {confirmAction === 'start' ? 'Start Seba?' : 'Stop Seba?'}
                                    </Text>
                                    <Text style={styles.modalText}>
                                        {currentSeba?.seba} • {moment(currentSeba?.date).format('DD MMM YYYY')}
                                        {'\n'}Beddha: {currentSeba?.beddha_id}
                                    </Text>
                                    <View style={styles.modalButtons}>
                                        <TouchableOpacity
                                            style={[styles.modalBtn, styles.modalCancel]}
                                            onPress={() => setConfirmVisible(false)}
                                            disabled={actionLoading}
                                        >
                                            <Text style={styles.modalBtnText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.modalBtn, styles.modalConfirm]}
                                            onPress={confirmActionNow}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? (
                                                <ActivityIndicator size="small" color="#fff" />
                                            ) : (
                                                <Text style={styles.modalBtnText}>
                                                    {confirmAction === 'start' ? 'Start' : 'Stop'}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                )}

                {rejetedReason && (
                    <View style={styles.noticeSection}>
                        <View style={styles.noticeCard}>
                            <LinearGradient
                                colors={['#ff6b6b', '#feca57']}
                                style={styles.noticeGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <View style={styles.noticeContent}>
                                    <View style={styles.noticeIcon}>
                                        <Ionicons name="warning" size={24} color="#ffffff" />
                                    </View>
                                    <View style={styles.noticeTextContainer}>
                                        <Text style={styles.noticeTitle}>Important Notice</Text>
                                        <Text style={styles.noticeText}>{rejetedReason}</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </View>
                    </View>
                )}

                <View style={styles.servicesSection}>
                    {/* <Text style={styles.sectionTitle}>Featured Services</Text> */}
                    <FlatList
                        data={menuData}
                        renderItem={renderMenuItem}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        scrollEnabled={false}
                        columnWrapperStyle={styles.servicesRow}
                        contentContainerStyle={styles.servicesContainer}
                    />
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('SebaDetails')} style={styles.footerSection}>
                    <LinearGradient
                        colors={['#ff6b6b', '#feca57']}
                        style={styles.footerCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.footerTitle}>Pratihari Seba</Text>
                        <Text style={styles.footerSubtitle}>All Your Seba Details in One Place</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.heroSection}>
                    <View style={styles.swiperContainer}>
                        <Swiper
                            showsButtons={false}
                            autoplay={false}
                            autoplayTimeout={4}
                            dotStyle={styles.dotStyle}
                            activeDotStyle={styles.activeDotStyle}
                            paginationStyle={styles.paginationStyle}
                        >
                            {images.map((image, index) => (
                                <ImageBackground
                                    key={index}
                                    source={image}
                                    style={styles.sliderImage}
                                    imageStyle={styles.sliderImageStyle}
                                >
                                    <LinearGradient
                                        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
                                        style={styles.sliderOverlay}
                                    >
                                        <Text style={styles.sliderTitle}>Pratihari Seba</Text>
                                        <Text style={styles.sliderSubtitle}>Spiritual Service & Community</Text>
                                    </LinearGradient>
                                </ImageBackground>
                            ))}
                        </Swiper>
                    </View>
                </View>

                {/* <View style={styles.footerSection}>
                    <LinearGradient
                        colors={['#4c1d95', '#6366f1']}
                        style={styles.footerCard}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.footerTitle}>Pratihari Nijog</Text>
                        <Text style={styles.footerSubtitle}>Serving the Community with Devotion</Text>
                    </LinearGradient>
                </View> */}
            </ScrollView>
        </View>
    )
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    headerContainer: {
        paddingTop: 10,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 12,
    },
    searchText: {
        color: '#ffffff',
        fontSize: 16,
        marginLeft: 10,
        fontWeight: '500',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerActionButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 50,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileInfo: {
        flex: 1,
    },
    greeting: {
        color: '#e2e8f0',
        fontSize: 16,
        fontWeight: '400',
    },
    userName: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 4,
    },
    userAlias: {
        color: '#cbd5e1',
        fontSize: 14,
        fontWeight: '500',
        marginTop: 2,
    },
    subtitle: {
        color: '#cbd5e1',
        fontSize: 14,
        marginTop: 4,
    },
    profileImageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#ffffff',
    },
    profileImagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#ffffff',
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#10b981',
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    scrollContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
        paddingTop: 20,
        marginTop: -20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    heroSection: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    swiperContainer: {
        height: 200,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    sliderImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderImageStyle: {
        borderRadius: 20,
    },
    sliderOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        width: '100%',
    },
    sliderTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
    },
    sliderSubtitle: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
        marginTop: 8,
        opacity: 0.9,
    },
    dotStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        width: 10,
        height: 10,
        borderRadius: 5,
        margin: 3,
    },
    activeDotStyle: {
        backgroundColor: '#ffffff',
        width: 20,
        height: 10,
        borderRadius: 5,
        margin: 3,
    },
    paginationStyle: {
        bottom: 15,
    },
    statsSection: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 16,
    },
    statsContainer: {
        paddingRight: 20,
    },
    statCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginRight: 12,
        minWidth: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statIconContainer: {
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        padding: 8,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    statLabel: {
        fontSize: 12,
        color: '#64748b',
        textAlign: 'center',
        marginTop: 4,
        fontWeight: '500',
    },
    currentEventSection: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    currentEventCard: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    currentEventGradient: {
        padding: 20,
    },
    currentEventContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    currentEventInfo: {
        flex: 1,
    },
    currentEventTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 12,
    },
    currentEventDetails: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    currentEventDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
        marginBottom: 4,
    },
    currentEventDetailText: {
        color: '#ffffff',
        marginLeft: 5,
        fontSize: 14,
        fontWeight: '500',
    },
    currentEventStatus: {
        alignItems: 'center',
    },
    statusBadge: {
        backgroundColor: 'rgba(26, 8, 182, 0.71)',
        paddingHorizontal: 15,
        paddingVertical: 9,
        borderRadius: 12,
        marginBottom: 8,
    },
    statusText: {
        color: '#ffffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalCard: { width: '100%', maxWidth: 380, backgroundColor: '#fff', borderRadius: 16, padding: 20 },
    modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6, color: '#111827' },
    modalText: { color: '#374151', marginBottom: 16, lineHeight: 20 },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
    modalBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
    modalCancel: { backgroundColor: '#e5e7eb' },
    modalConfirm: { backgroundColor: '#10b981' }, // green; change to red for stop if you like
    modalBtnText: { color: '#111827', fontWeight: '600' },
    noticeSection: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    noticeCard: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    noticeGradient: {
        padding: 16,
    },
    noticeContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    noticeIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    noticeTextContainer: {
        flex: 1,
    },
    noticeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    noticeText: {
        fontSize: 14,
        color: '#ffffff',
        lineHeight: 20,
        opacity: 0.9,
    },
    quickActionsSection: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    quickActionsContainer: {
        paddingRight: 20,
    },
    quickActionCard: {
        borderRadius: 16,
        padding: 16,
        marginRight: 12,
        alignItems: 'center',
        minWidth: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    quickActionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickActionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1e293b',
        textAlign: 'center',
    },
    servicesSection: {
        marginHorizontal: 20,
        marginBottom: 10,
    },
    servicesContainer: {
        paddingHorizontal: 0,
    },
    servicesRow: {
        justifyContent: 'space-between',
    },
    menuCard: {
        width: '48%',
        borderRadius: 20,
        padding: 15,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        position: 'relative',
    },
    menuIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    menuIcon: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 4,
    },
    menuArrow: {
        position: 'absolute',
        top: 16,
        right: 16,
    },
    footerSection: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    footerCard: {
        borderRadius: 20,
        paddingHorizontal: 30,
        paddingVertical: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    footerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
    },
    footerSubtitle: {
        fontSize: 16,
        color: '#3e3406ff',
        marginTop: 8,
        textAlign: 'center',
    },
    footerDivider: {
        width: 60,
        height: 3,
        backgroundColor: '#6366f1',
        borderRadius: 2,
        marginVertical: 16,
    },
    footerDescription: {
        fontSize: 14,
        color: '#cbd5e1',
        textAlign: 'center',
        lineHeight: 20,
    },
})