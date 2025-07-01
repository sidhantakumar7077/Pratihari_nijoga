import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ImageBackground, ScrollView, BackHandler, ToastAndroid } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';
import { base_url } from '../../../App';
import DrawerModal from "../../Component/DrawerModal";

// images
const image1 = require('../../assets/images/slideImg5.jpg');
const image2 = require('../../assets/images/slideImg6.jpg');
const image3 = require('../../assets/images/slideImg7.webp');

const Index = () => {

    const menuData = [
        { id: 1, lable: 'Upcoming Pali', image: require('../../assets/images/timeicon.png'), backgroundColor: '#f3daf7', page: 'UpcomingPali' },
        { id: 2, lable: 'Pali History', image: require('../../assets/images/panji.png'), backgroundColor: '#fcdee9', page: 'PaliHistory' },
        { id: 3, lable: 'Notice', image: require('../../assets/images/news.png'), backgroundColor: '#d7f7f4', page: 'Notice' },
        { id: 4, lable: 'Social Media', image: require('../../assets/images/socialMedia.png'), backgroundColor: '#f7f4da', page: 'SocialMedia' },
        { id: 5, lable: 'Committee', image: require('../../assets/images/nijog.png'), backgroundColor: '#e7f7d7', page: 'Committee' },
        { id: 6, lable: 'Application', image: require('../../assets/images/task.png'), backgroundColor: '#f5e1e1', page: 'Application' },
    ];

    const images = [image3, image2, image1];

    const [backPressCount, setBackPressCount] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const closeDrawer = () => setIsDrawerOpen(false);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

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
    // const [todayBedhhaData, setTodayBedhhaData] = useState(null);

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
                // setTodayBedhhaData();
            } else {
                console.log('Failed to fetch profile details', data);
            }
        } catch (error) {
            console.log('Error fetching profile details', error);
        }
    }

    useEffect(() => {
        if (isFocused) {
            getProfileDetails();
        }
    }, [isFocused]);

    return (
        <SafeAreaView style={styles.container}>
            <DrawerModal visible={isDrawerOpen} onClose={closeDrawer} />
            <View style={styles.headerPart}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 5 }}>
                    <TouchableOpacity style={styles.searchBox} onPress={() => navigation.navigate('Search')}>
                        <Ionicons name="search" size={20} color="#fff" />
                        <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 7 }}>Search</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Profile')}
                            style={{ marginRight: 20, backgroundColor: '#fff', borderRadius: 50, height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}
                        >
                            <FontAwesome name="user" size={20} color="#051b65" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsDrawerOpen(true)} style={{ marginRight: 10, borderRadius: 50, height: 36, width: 36, alignItems: 'center', justifyContent: 'center' }}>
                            <Feather name="menu" size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>{profileDetails?.first_name} {profileDetails?.middle_name} {profileDetails?.last_name}, </Text>
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>({profileDetails?.alias_name ? profileDetails?.alias_name : profileDetails?.phone_no})</Text>
                    </View>
                    <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                        {/* <ImageBackground source={require('../../assets/images/fame2.png')} style={{ height: 140, width: 150, resizeMode: 'contain', padding: 25 }}> */}
                        <View style={{ height: 165, width: 165, resizeMode: 'contain', padding: 25 }}>
                            <View style={{ height: '100%', width: '100%', borderRadius: 10 }}>
                                {profileDetails?.profile_photo_url &&
                                    <Image
                                        source={{ uri: profileDetails?.profile_photo_url }}
                                        style={{ height: '100%', width: '100%', borderRadius: 10 }}
                                        resizeMode="cover"
                                    />
                                }
                            </View>
                        </View>
                        {/* </ImageBackground> */}
                    </View>
                </View>
            </View>
            <View style={styles.bodyPart}>
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                    <View style={styles.swiperContainer}>
                        <Swiper
                            showsButtons={false}
                            autoplay={false}
                            autoplayTimeout={3}
                            dotStyle={styles.dotStyle}
                            activeDotStyle={styles.activeDotStyle}
                            paginationStyle={{ bottom: 10 }}
                        >
                            {images.map((image, index) => (
                                <Image
                                    key={index}
                                    source={image}  // Use local image source
                                    style={styles.sliderImage}
                                    resizeMode="cover"
                                />
                            ))}
                        </Swiper>
                    </View>
                    <View style={{ backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 25, borderRadius: 20, justifyContent: 'center', marginTop: 15, width: '90%', alignSelf: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 5 }, elevation: 1 }}>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ width: '90%' }}>
                                <Text style={{ fontSize: 20, fontFamily: 'FiraSans-Light', color: '#341551' }}>Pratihari Seba</Text>
                                <View style={{ backgroundColor: '#fa0000', width: 80, height: 1.5, marginVertical: 8 }}></View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Ionicons name="calendar-outline" size={16} color="#fa0000" />
                                        <Text style={{ color: '#979998', fontFamily: 'FiraSans-Medium', marginLeft: 5 }}>Start Time: </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 5, marginLeft: 20 }}>
                                        <Ionicons name="time-outline" size={16} color="#fa0000" />
                                        <Text style={{ color: '#979998', fontFamily: 'FiraSans-Medium', marginLeft: 5 }}>
                                            duration
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ width: '10%' }}>
                                <Ionicons name="chevron-forward" size={24} color="#fa0000" />
                            </View>
                        </View>
                        <View style={{ backgroundColor: 'green', width: 80, height: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 10, position: 'absolute', top: 10, right: 20 }}>
                            <Text style={{ color: '#fff', fontFamily: 'FiraSans-Medium', fontSize: 12 }}>Running</Text>
                        </View>
                    </View>
                    {/* Approved Information Text */}
                    <View style={{
                        backgroundColor: '#fff5f5',
                        padding: 12,
                        borderRadius: 10,
                        borderLeftWidth: 4,
                        borderLeftColor: '#F06292',
                        marginTop: 20,
                        marginHorizontal: 20,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        elevation: 4,
                    }}>
                        <Text style={{
                            fontSize: 16,
                            color: '#444',
                            lineHeight: 24,
                            textAlign: 'justify',
                        }}>
                            <Text style={{ fontWeight: 'bold', color: '#E91E63' }}>⚠️ Note:</Text>
                            {" " + rejetedReason}
                            {/* You can access all the features of this app after your account is approved by the Pratihari Nijog Office. */}
                        </Text>
                    </View>
                    <View style={styles.menuSection}>
                        <FlatList
                            data={menuData}
                            numColumns={2}
                            scrollEnabled={false}
                            keyExtractor={(item) => item.id.toString()}
                            columnWrapperStyle={styles.row}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.menuItem, { backgroundColor: item.backgroundColor }]}
                                    activeOpacity={0.85}
                                    onPress={() => navigation.navigate(item.page)}
                                >
                                    <Image source={item.image} style={styles.menuImage} />
                                    <Text style={styles.menuLabel}>{item.lable}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
                        <View style={{ width: '100%', height: 100, marginRight: 10, marginVertical: 8, backgroundColor: '#051b65', padding: 10, borderRadius: 10, justifyContent: 'center' }}>
                            <Text style={{ fontSize: 28, fontWeight: 'bold', marginLeft: 10, color: '#fff', textAlign: 'center' }}>Pratihari Nijog</Text>
                        </View>
                    </View>
                    <View style={styles.footerWave}>
                        <Image
                            source={require('../../assets/images/bg987.png')}
                            style={{ width: '100%', height: '100%', marginTop: 10 }}
                            resizeMode="contain"
                        />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#051b65',
    },
    headerPart: {
        width: '100%',
        height: 230,
        backgroundColor: '#051b65',
    },
    bodyPart: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    searchBox: {
        width: '50%',
        height: 40,
        backgroundColor: '#aabbf2',
        borderRadius: 20,
        alignItems: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
        paddingHorizontal: 19,
    },
    menuSection: {
        width: '90%',
        alignSelf: 'center',
        marginTop: 15,
    },
    row: {
        justifyContent: 'space-between',
    },
    menuItem: {
        width: '48%',
        aspectRatio: 1, // makes it square and consistent
        borderRadius: 16,
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    menuImage: {
        height: 50,
        width: 50,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    menuLabel: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        color: '#c9170a',
    },
    swiperContainer: {
        // backgroundColor: 'red',
        width: '90%',
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 20,
        overflow: 'hidden', // Ensures child elements respect border radius
        height: 170, // Set height for the Swiper
    },
    dotStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        width: 10,
        height: 10,
        borderRadius: 5,
        margin: 3,
    },
    activeDotStyle: {
        backgroundColor: '#fff',
        width: 20,
        height: 10,
        borderRadius: 5,
        margin: 3,
    },
    sliderImage: {
        width: '100%', // Fill the entire Swiper container
        height: '100%', // Fill the entire Swiper container
        borderRadius: 10, // Rounded corners
    },
    footerWave: {
        width: '100%',
        height: 78,
        zIndex: -1,
    },
})