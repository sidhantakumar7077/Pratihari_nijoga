import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import DrawerModal from '../../Component/DrawerModal';

const Index = () => {

    const navigation = useNavigation();
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const openModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);

    return (
        <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
            <DrawerModal visible={isModalVisible} navigation={navigation} onClose={closeModal} />
            <View style={{ width: '100%', alignItems: 'center', paddingVertical: 10, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 13, elevation: 5 }}>
                <View style={{ width: '90%', alignSelf: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#000', fontSize: 17 }}>Hey, <Text style={{ color: 'red', fontSize: 20, fontWeight: 'bold', textTransform: 'capitalize', textShadowColor: '#000', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>Sidhanta</Text></Text>
                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity style={{ marginLeft: 8 }} onPress={openModal}>
                            <Octicons name="three-bars" color={'#000'} size={28} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Index

const styles = StyleSheet.create({})