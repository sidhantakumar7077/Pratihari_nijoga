import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ImageBackground, ScrollView } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';

// images
const image1 = require('../../assets/images/slideImg1.jpeg');
const image2 = require('../../assets/images/slideImg2.jpeg');
const image3 = require('../../assets/images/slideImg4.jpeg');

const Index = () => {

    const menuData = [
        { id: 1, lable: 'Section 1', image: require('../../assets/images/online-shopping.png'), backgroundColor: '#f3daf7' },
        { id: 2, lable: 'Section 2', image: require('../../assets/images/microphone.png'), backgroundColor: '#fcdee9' },
        { id: 3, lable: 'Section 3', image: require('../../assets/images/pandit.png'), backgroundColor: '#d7f7f4' },
        { id: 4, lable: 'Section 4', image: require('../../assets/images/priest.png'), backgroundColor: '#e7f7d7' },
        { id: 5, lable: 'Section 5', image: require('../../assets/images/profileAvtar.png'), backgroundColor: '#f7f4da' },
        { id: 6, lable: 'Section 6', image: require('../../assets/images/logo2.png'), backgroundColor: '#f5e1e1' },
    ];

    const images = [image1, image2, image3];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerPart}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 5 }}>
                    <TouchableOpacity style={styles.searchBox}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Search</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={{ marginRight: 20, backgroundColor: '#fff', borderRadius: 50, height: 36, width: 36, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="notifications" size={24} color="#c9170a" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginRight: 10, backgroundColor: '#fff', borderRadius: 50, height: 36, width: 36, alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome name="user" size={24} color="#c9170a" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Welcome</Text>
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>To</Text>
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Pratihari Nijog</Text>
                    </View>
                    <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                        <ImageBackground source={require('../../assets/images/fame2.png')} style={{ height: 140, width: 150, resizeMode: 'contain', padding: 25 }}>
                            <View style={{ height: '100%', width: '100%', borderRadius: 10 }}>
                                <Image source={require('../../assets/images/panda1.jpg')} style={{ height: '100%', width: '100%', resizeMode: 'cover', borderRadius: 10 }} />
                            </View>
                        </ImageBackground>
                    </View>
                </View>
            </View>
            <View style={styles.bodyPart}>
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                    <View style={styles.menuSection}>
                        <FlatList
                            data={menuData}
                            numColumns={2}
                            scrollEnabled={false}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={{ width: '48%', marginRight: 10, marginVertical: 8, backgroundColor: item.backgroundColor, padding: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={item.image} style={{ height: 50, width: 50, resizeMode: 'contain' }} />
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: '#c9170a' }}>{item.lable}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
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
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#c9170a',
    },
    headerPart: {
        width: '100%',
        height: 200,
        backgroundColor: '#c9170a',
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
        backgroundColor: '#ab6663',
        borderRadius: 20,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: 19,
    },
    menuSection: {
        width: '90%',
        // backgroundColor: 'red',
        alignSelf: 'center',
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
})