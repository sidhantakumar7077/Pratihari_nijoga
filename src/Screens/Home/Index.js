import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ImageBackground, ScrollView, BackHandler, ToastAndroid } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';
import { base_url } from '../../../App';
import DrawerModal from "../../Component/DrawerModal";

// images
// const image1 = require('../../assets/images/slideImg5.jpg');
// const image2 = require('../../assets/images/slideImg6.jpg');
const image3 = require('../../assets/images/slideImg7.webp');

const Index = () => {

    const menuData = [
        { id: 1, lable: 'Daily Niti', image: require('../../assets/images/timeicon.png'), backgroundColor: '#f3daf7' },
        { id: 2, lable: 'Special Niti', image: require('../../assets/images/specialneeti.png'), backgroundColor: '#fcdee9' },
        { id: 3, lable: 'Panji', image: require('../../assets/images/panji.png'), backgroundColor: '#d7f7f4' },
        { id: 4, lable: 'Nijog', image: require('../../assets/images/nijog.png'), backgroundColor: '#e7f7d7' },
        { id: 5, lable: 'News', image: require('../../assets/images/news.png'), backgroundColor: '#f7f4da' },
        { id: 6, lable: 'Task', image: require('../../assets/images/task.png'), backgroundColor: '#f5e1e1' },
    ];

    const images = [image3, image3, image3];

    const backPressCount = useRef(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const closeDrawer = () => { setIsDrawerOpen(false); };
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    useEffect(() => {
        const backAction = () => {
            if (backPressCount.current === 0) {
                backPressCount.current += 1;
                ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
                setTimeout(() => {
                    backPressCount.current = 0;
                }, 2000); // Reset after 2 seconds
                return true;
            } else if (backPressCount.current === 1) {
                BackHandler.exitApp(); // Exit app
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, []);

    const [profileDetails, setProfileDetails] = useState(null);

    const getProfileDetails = async () => {
        try {
            const response = await fetch(base_url + 'api/pratihari-profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AsyncStorage.getItem('storeAccesstoken')}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                // console.log('Profile details fetched successfully', data);
                setProfileDetails(data);
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
                    <TouchableOpacity style={styles.searchBox}>
                        <Ionicons name="search" size={20} color="#fff" />
                        <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 7 }}>Search</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={{ marginRight: 20, backgroundColor: '#fff', borderRadius: 50, height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="notifications" size={20} color="#051b65" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsDrawerOpen(true)} style={{ marginRight: 10, borderRadius: 50, height: 36, width: 36, alignItems: 'center', justifyContent: 'center' }}>
                            <Feather name="menu" size={30} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>{profileDetails?.profile?.first_name} {profileDetails?.profile?.middle_name} {profileDetails?.profile?.last_name}, </Text>
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>{profileDetails?.profile?.alias_name ? profileDetails?.profile?.alias_name : profileDetails?.profile?.phone_no}</Text>
                    </View>
                    <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                        {/* <ImageBackground source={require('../../assets/images/fame2.png')} style={{ height: 140, width: 150, resizeMode: 'contain', padding: 25 }}> */}
                        <View style={{ height: 165, width: 165, resizeMode: 'contain', padding: 25 }}>
                            <View style={{ height: '100%', width: '100%', borderRadius: 10 }}>
                                {profileDetails?.profile?.profile_photo_url &&
                                    <Image
                                        source={{ uri: profileDetails?.profile?.profile_photo_url }}
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
                            <Text style={{ fontWeight: 'bold', color: '#E91E63' }}>⚠️ Note:</Text> You can access all the features of this app after your account is approved by the Pratihari Nijog Office.
                        </Text>
                    </View>
                    <View style={styles.menuSection}>
                        <FlatList
                            data={menuData}
                            numColumns={2}
                            scrollEnabled={false}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={{ width: '48%', marginRight: 10, marginVertical: 8, backgroundColor: item.backgroundColor, padding: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={item.image} style={{ height: 40, width: 40, resizeMode: 'contain' }} />
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 10, color: '#c9170a' }}>{item.lable}</Text>
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
        // backgroundColor: 'red',
        alignSelf: 'center',
        marginTop: 10,
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