import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { base_url } from '../../../App';

const Index = (props) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(false);
    const [pratihariData, setPratihariData] = useState(null);

    const getProfileById = async () => {
        setLoading(true);
        try {
            const { id } = props.route.params; // Assuming 'id' is the parameter you want
            const response = await fetch(`${base_url}api/get-profile-by-id/${id}`, {
                method: 'GET',
            });

            const result = await response.json();
            // console.log("Profile fetch result:", result);

            if (result.success) {
                setPratihariData(result.data);
            } else {
                console.warn('Failed to load profile');
            }
        } catch (error) {
            console.log('API Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            getProfileById();
        }
    }, [isFocused]);

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Page Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Pratihari Profile</Text>
            </View>

            {/* Main Body */}
            <View style={{ flex: 1, padding: 16 }}>
            </View>
        </SafeAreaView>
    );
};

export default Index;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#051b65',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: '#eee',
        elevation: 2,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 10,
    },
});