import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Index = () => {
    const navigation = useNavigation();
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

    useEffect(() => {
        setNotices(noticeData);
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.noticeCard}>
            <View style={styles.stripe} />
            <View style={styles.cardContent}>
                <Text style={styles.noticeDate}>{item.date}</Text>
                <Text style={styles.noticeTitle}>{item.title}</Text>
                <Text style={styles.noticeDesc}>{item.description}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notices</Text>
            </View>

            <FlatList
                data={notices}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            />
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
    noticeCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    stripe: {
        width: 6,
        backgroundColor: '#341551',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    cardContent: {
        flex: 1,
        padding: 14,
    },
    noticeDate: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    noticeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    noticeDesc: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
});
