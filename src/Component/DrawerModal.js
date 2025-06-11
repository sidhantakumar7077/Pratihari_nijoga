import { StyleSheet, Text, View, Modal, Button, TouchableWithoutFeedback, TouchableOpacity, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const DrawerModal = ({ visible, onClose }) => {

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    return (
        <View>
            <Modal
                visible={visible}
                animationType="none"
                transparent={true}
                onRequestClose={onClose}
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={styles.variantModalContainer}>
                            <View style={{ width: '100%', height: 60, backgroundColor: '#051b65' }}>
                                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '500', paddingLeft: 20, paddingTop: 15 }}>Pratihari Nijog</Text>
                            </View>
                            <TouchableOpacity onPress={() => { onClose(); navigation.navigate('Profile') }} style={styles.drawerCell}>
                                <FontAwesome name="user-circle-o" color={'#fff'} size={22} />
                                <Text style={styles.drawerLable}>Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { onClose(); navigation.navigate('UpcomingPali') }} style={styles.drawerCell}>
                                {/* <AntDesign name="infocirlceo" color={'#fff'} size={22} /> */}
                                <Image source={require('../assets/images/timeicon.png')} style={{ width: 24, height: 24 }} />
                                <Text style={styles.drawerLable}>Upcoming Pali</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { onClose(); navigation.navigate('PaliHistory') }} style={styles.drawerCell}>
                                {/* <Feather name="lock" color={'#fff'} size={22} /> */}
                                <Image source={require('../assets/images/panji.png')} style={{ width: 22, height: 22 }} />
                                <Text style={styles.drawerLable}>Pali History</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { onClose(); navigation.navigate('Notice') }} style={styles.drawerCell}>
                                {/* <AntDesign name="contacts" color={'#fff'} size={22} /> */}
                                <Image source={require('../assets/images/news.png')} style={{ width: 22, height: 22 }} />
                                <Text style={styles.drawerLable}>Notice</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { onClose(); navigation.navigate('SocialMedia') }} style={styles.drawerCell}>
                                {/* <AntDesign name="contacts" color={'#fff'} size={22} /> */}
                                <Image source={require('../assets/images/socialMedia.png')} style={{ width: 25, height: 25 }} />
                                <Text style={styles.drawerLable}>Social Media</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { onClose(); navigation.navigate('Committee') }} style={styles.drawerCell}>
                                {/* <AntDesign name="contacts" color={'#fff'} size={22} /> */}
                                <Image source={require('../assets/images/nijog.png')} style={{ width: 25, height: 25 }} />
                                <Text style={styles.drawerLable}>Committee</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { onClose(); navigation.navigate('Application') }} style={styles.drawerCell}>
                                {/* <AntDesign name="contacts" color={'#fff'} size={22} /> */}
                                <Image source={require('../assets/images/task.png')} style={{ width: 24, height: 24 }} />
                                <Text style={styles.drawerLable}>Application</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.drawerCell}>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.drawerCell}>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.drawerCell}>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.drawerCell}>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.drawerCell}>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.drawerCell}>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.drawerCell}>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.drawerCell}>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.drawerCell}>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    )
}

export default DrawerModal

const styles = StyleSheet.create({
    variantModalContainer: {
        width: '70%',
        height: '100%',
        left: 0,
        backgroundColor: '#fff',
        bottom: 0,
        position: 'absolute',
        alignSelf: 'center',
    },
    drawerCell: {
        width: '100%',
        height: 60,
        backgroundColor: '#e38539',
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20
    },
    drawerLable: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: 0.6,
        marginLeft: 15
    }
})