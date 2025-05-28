import { StyleSheet, Text, View, Modal, Button, TouchableWithoutFeedback, TouchableOpacity, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

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
                            <TouchableOpacity onPress={() => { onClose() }} style={styles.drawerCell}>
                                <Feather name="user" color={'#fff'} size={22} />
                                <Text style={styles.drawerLable}>Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { onClose() }} style={styles.drawerCell}>
                                <AntDesign name="infocirlceo" color={'#fff'} size={22} />
                                <Text style={styles.drawerLable}>Terms Of Use</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { onClose() }} style={styles.drawerCell}>
                                <Feather name="lock" color={'#fff'} size={22} />
                                <Text style={styles.drawerLable}>Privacy Policy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { onClose() }} style={styles.drawerCell}>
                                <AntDesign name="contacts" color={'#fff'} size={22} />
                                <Text style={styles.drawerLable}>Contact Us</Text>
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