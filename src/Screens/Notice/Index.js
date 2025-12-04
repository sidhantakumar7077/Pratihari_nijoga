import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    RefreshControl,
    Modal,
} from 'react-native';
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
    const [selectedImage, setSelectedImage] = useState(null); // full image modal

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
                setNotices(res.data || []);
                console.log('Notices fetched successfully:', res.data);
            } else {
                console.error('Failed to fetch notices:', res.data);
                setNotices([]);
            }
        } catch (error) {
            console.error('Error fetching notices:', error);
            setNotices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            getNotices();
        }
    }, [isFocused]);

    const renderItem = ({ item }) => {
        const imageUrl = item.notice_photo
            ? `${base_url}storage/${item.notice_photo}` // tweak if your API returns full URL
            : null;

        const isNew = moment().diff(moment(item.created_at), 'days') <= 3;

        return (
            <View style={styles.noticeCardShadow}>
                <LinearGradient
                    colors={['#eef2ff', '#fdf2ff']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.noticeCard}
                >
                    {/* Left accent stripe */}
                    <View style={styles.leftAccent} />

                    {/* Main content row: image + text */}
                    <View style={styles.noticeContent}>
                        <View style={styles.noticeRow}>
                            {/* Image on left (if exists) */}
                            {imageUrl && (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => setSelectedImage(imageUrl)}
                                >
                                    <Image
                                        source={{ uri: imageUrl }}
                                        style={styles.noticeThumb}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            )}

                            {/* Text on right */}
                            <View
                                style={[
                                    styles.noticeTextContainer,
                                    !imageUrl && { marginLeft: 0 }, // no extra margin when no image
                                ]}
                            >
                                {/* Title + icon */}
                                <View style={styles.titleRow}>
                                    <Text style={styles.noticeTitle} numberOfLines={2}>
                                        {item.notice_name}
                                    </Text>
                                    <Ionicons
                                        name="notifications-outline"
                                        size={18}
                                        color="#4c1d95"
                                        style={{ marginLeft: 6 }}
                                    />
                                </View>

                                {/* Date + NEW badge */}
                                <View style={styles.metaRow}>
                                    <Ionicons name="calendar-outline" size={14} color="#6366f1" />
                                    <Text style={styles.noticeDate}>
                                        {moment(item.created_at).format('DD MMM YYYY')}
                                    </Text>
                                    {isNew && (
                                        <View style={styles.badgeNew}>
                                            <Text style={styles.badgeNewText}>NEW</Text>
                                        </View>
                                    )}
                                </View>

                                {/* Description */}
                                {!!item.description && (
                                    <Text style={styles.noticeDesc} numberOfLines={3}>
                                        {item.description}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>
                </LinearGradient>
            </View>
        );
    };

    return (
        <View style={styles.safeArea}>
            {/* Header */}
            <LinearGradient colors={['#4c1d95', '#6366f1']} style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" marginRight={10} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notices</Text>
                </View>
                <Text style={styles.headerSubtitle}>
                    Stay updated with the latest notices and announcements
                </Text>
            </LinearGradient>

            {/* Body */}
            <View style={styles.scrollContainer}>
                {loading && notices.length === 0 ? (
                    <View style={styles.centerMessage}>
                        <Text style={styles.messageText}>Loading notices...</Text>
                    </View>
                ) : !loading && notices.length === 0 ? (
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
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={getNotices} />
                    }
                />
            </View>

            {/* Full image modal */}
            <Modal
                visible={!!selectedImage}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedImage(null)}
            >
                <View style={styles.imageModalOverlay}>
                    <TouchableOpacity
                        style={styles.imageModalClose}
                        onPress={() => setSelectedImage(null)}
                        activeOpacity={0.9}
                    >
                        <Ionicons name="close" size={26} color="#fff" />
                    </TouchableOpacity>

                    {selectedImage && (
                        <Image
                            source={{ uri: selectedImage }}
                            style={styles.fullImage}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </Modal>
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f1f5f9',
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

    /* Card styling */
    noticeCardShadow: {
        marginVertical: 8,
        borderRadius: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
        backgroundColor: 'transparent',
    },
    noticeCard: {
        flexDirection: 'row',
        borderRadius: 18,
        overflow: 'hidden',
    },
    leftAccent: {
        width: 5,
        backgroundColor: '#4c1d95',
    },
    noticeContent: {
        flex: 1,
        padding: 14,
    },
    noticeRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    noticeThumb: {
        width: 70,
        height: 70,
        borderRadius: 10,
        backgroundColor: '#e5e7eb',
    },
    noticeTextContainer: {
        flex: 1,
        marginLeft: 10,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    noticeTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    noticeDate: {
        fontSize: 12,
        color: '#6b7280',
        marginLeft: 4,
    },
    badgeNew: {
        marginLeft: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: '#fee2e2',
    },
    badgeNewText: {
        fontSize: 10,
        color: '#b91c1c',
        fontWeight: '700',
    },
    noticeDesc: {
        marginTop: 6,
        fontSize: 14,
        color: '#4b5563',
        lineHeight: 20,
    },

    centerMessage: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
    },
    messageText: {
        fontSize: 16,
        color: '#9ca3af',
    },

    /* Full image modal */
    imageModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageModalClose: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
        padding: 6,
    },
    fullImage: {
        width: '95%',
        height: '80%',
    },
});