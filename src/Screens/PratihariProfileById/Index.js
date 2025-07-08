import React, { useState, useEffect } from 'react';
import { View, ScrollView, FlatList, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
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
            <LinearGradient
                colors={['#4c1d95', '#6366f1']}
                style={styles.header}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" marginRight={10} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Pratihari Profile</Text>
                </View>
                <Text style={styles.headerSubtitle}>
                    {/* {pratihariData ? pratihariData.full_name : 'Loading...'} */}
                    Madhab Chandra Mohapatra
                </Text>
            </LinearGradient>

            {/* Main Body */}
            <ScrollView style={styles.scrollContainer}>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Index;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        paddingTop: 10,
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: 'Poppins-Bold',
        color: '#ffffff',
    },
    headerSubtitle: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: '#e2e8f0',
        marginTop: 8,
    },
    scrollContainer: {
        flex: 1,
        marginTop: -20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#f8fafc',
    },
});