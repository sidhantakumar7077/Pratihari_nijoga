import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { base_url } from '../../../App';
import moment from 'moment';

const Index = () => {

    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(false);
    const [notices, setNotices] = useState([]);

    const noticeData = [
        {
            id: 1,
            title: 'General Meeting Announcement',
            description: 'A general meeting will be held on Saturday to discuss upcoming community events and plans.',
            date: '10 Jun 2025',
        },
        {
            id: 2,
            title: 'Water Supply Maintenance',
            description: 'Water supply will be interrupted from 9:00 AM to 1:00 PM due to maintenance.',
            date: '08 Jun 2025',
        },
        {
            id: 3,
            title: 'Cultural Function',
            description: 'Join us for a cultural event filled with performances and fun. All are welcome!',
            date: '05 Jun 2025',
        },
        {
            id: 4,
            title: 'Committee Formation',
            description: 'The Nijoga committee for 2025-26 has been officially formed. View the full list inside.',
            date: '01 Jun 2025',
        },
    ];

    const getNotices = async () => {
        const token = await AsyncStorage.getItem('storeAccesstoken');
        try {
            setLoading(true);
            const response = await fetch(`${base_url}api/pratihari-notice`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const res = await response.json();
            if (response.ok) {
                setLoading(false);
                setNotices(res.data);
                console.log("Notices fetched successfully:", res.data);
            } else {
                setLoading(false);
                console.error('Failed to fetch notices:', res.data);
                setNotices([]);
            }
        } catch (error) {
            setLoading(false);
            setNotices([]);
            console.error('Error fetching notices:', error);
        }
    }

    useEffect(() => {
        if (isFocused) {
            getNotices();
        }
    }, [isFocused]);

    const renderItem = ({ item }) => (
        <View style={styles.noticeCard}>
            <View style={styles.leftAccent} />
            <View style={styles.noticeContent}>
                <View style={styles.headerRow}>
                    <Text style={styles.noticeTitle}>{item.notice_name}</Text>
                    <Text style={styles.noticeDate}>
                        {moment(item.created_at).format('DD MMM YYYY')}
                    </Text>
                </View>
                <Text style={styles.noticeDesc}>{item.description}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={['#4c1d95', '#6366f1']}
                style={styles.header}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" marginRight={10} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notices</Text>
                </View>
                <Text style={styles.headerSubtitle}>Stay updated with the latest notices and announcements</Text>
            </LinearGradient>

            <View style={styles.scrollContainer}>
                {loading ? (
                    <View style={styles.centerMessage}>
                        <Text style={styles.messageText}>Loading notices...</Text>
                    </View>
                ) : notices.length === 0 ? (
                    <View style={styles.centerMessage}>
                        <Text style={styles.messageText}>No notices available at the moment.</Text>
                    </View>
                ) : null}
                <FlatList
                    style={{ flex: 1, marginTop: 10 }}
                    data={notices}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
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
    noticeCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 14,
        marginVertical: 8,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    leftAccent: {
        width: 6,
        backgroundColor: '#4b0082', // Indigo stripe
    },
    noticeContent: {
        flex: 1,
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    noticeTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
        flex: 1,
        marginRight: 10,
    },
    noticeDate: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
    },
    noticeDesc: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
    },
    centerMessage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
    },
    messageText: {
        fontSize: 16,
        color: '#999',
    },
});
