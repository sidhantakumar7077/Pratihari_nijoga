import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Linking,
    RefreshControl,
    StatusBar,
    Animated
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { base_url } from '../../../App';

const IconCard = ({ icon, label, value, onPress, isLink }) => {
    if (!value) return null;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            style={styles.infoCard}
        >
            <View style={styles.iconLabelContainer}>
                <View style={styles.iconBox}>
                    <Feather name={icon} size={18} color="#6366f1" />
                </View>
                <View>
                    <Text style={styles.infoLabel}>{label}</Text>
                    <Text style={[styles.infoValue, isLink && { color: '#6366f1' }]}>
                        {value}
                    </Text>
                </View>
            </View>
            {onPress && (
                <Feather name="external-link" size={16} color="#94a3b8" />
            )}
        </TouchableOpacity>
    );
};

const Section = ({ title, icon, children }) => (
    <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
            <Feather name={icon} size={18} color="#6366f1" />
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View>{children}</View>
    </View>
);

export default function PratihariProfile() {
    const navigation = useNavigation();
    const route = useRoute();
    const id = route.params?.pratihari_id || null;
    const [pratihariData, setPratihariData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];

    const fetchProfile = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await fetch(`${base_url}api/get-profile-by-id/${id}`);
            const result = await response.json();
            if (result.success) {
                setPratihariData(result.data);
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }).start();
            }
        } catch (error) {
            console.error('Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchProfile().then(() => setRefreshing(false));
    };

    const profile = pratihariData?.profile || {};
    const family = pratihariData?.family || {};
    const address = pratihariData?.address || {};
    const occupation = pratihariData?.occupation?.[0] || {};
    const social = pratihariData?.socialMedia?.[0] || {};

    const fullName = `${profile.first_name || ''} ${profile.middle_name || ''} ${profile.last_name || ''}`.trim();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4c1d95" />
            <LinearGradient colors={['#4c1d95', '#6366f1']} style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Pratihari Profile</Text>
                </View>
                <Text style={styles.headerSubtitle}>
                    {fullName || 'No Name'} ({profile.phone_no || 'No Phone'})
                </Text>
            </LinearGradient>

            <ScrollView
                style={styles.body}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <Animated.View style={{ opacity: fadeAnim, padding: 16 }}>
                    <View style={styles.profileCenter}>
                        {profile.profile_photo_url ? (
                            <Image source={{ uri: profile.profile_photo_url }} style={styles.avatar} />
                        ) : (
                            <Ionicons name="person-circle-outline" size={120} color="#cbd5e1" />
                        )}
                        <Text style={styles.name}>{fullName}</Text>
                        {profile.alias_name && <Text style={styles.alias}>"{profile.alias_name}"</Text>}
                    </View>

                    <Section title="Personal Info" icon="user">
                        <IconCard icon="mail" label="Email" value={profile.email} onPress={() => Linking.openURL(`mailto:${profile.email}`)} isLink />
                        <IconCard icon="phone" label="Phone" value={profile.phone_no} onPress={() => Linking.openURL(`tel:${profile.phone_no}`)} isLink />
                        <IconCard icon="message-circle" label="WhatsApp" value={profile.whatsapp_no} onPress={() => Linking.openURL(`https://wa.me/${profile.whatsapp_no}`)} isLink />
                    </Section>

                    {(family.father_name || family.mother_name || family.spouse_name) && (
                        <Section title="Family" icon="users">
                            <IconCard icon="user" label="Father" value={family.father_name} />
                            <IconCard icon="user" label="Mother" value={family.mother_name} />
                            <IconCard icon="user" label="Spouse" value={family.spouse_name} />
                        </Section>
                    )}

                    {Object.keys(address).length > 0 && (
                        <Section title="Address" icon="map-pin">
                            <IconCard icon="map-pin" label="Address" value={address.address} />
                            <IconCard icon="map-pin" label="Sahi" value={address.sahi} />
                            <IconCard icon="map-pin" label="Landmark" value={address.landmark} />
                            <IconCard icon="map-pin" label="Post" value={address.post} />
                            <IconCard icon="map-pin" label="District" value={address.district} />
                            <IconCard icon="map-pin" label="State" value={address.state} />
                            <IconCard icon="map-pin" label="Pincode" value={address.pincode} />
                            <IconCard icon="map-pin" label="Country" value={address.country} />
                        </Section>
                    )}

                    {occupation?.occupation_type && (
                        <Section title="Occupation" icon="briefcase">
                            <IconCard icon="briefcase" label="Type" value={occupation.occupation_type} />
                            <IconCard icon="briefcase" label="Extra Activity" value={occupation.extra_activity} />
                        </Section>
                    )}

                    {Object.keys(social).length > 0 && (
                        <Section title="Social Media" icon="external-link">
                            {Object.entries(social).map(([key, value]) => {
                                if (key.endsWith('_url') && value) {
                                    const label = key.replace('_url', '').replace(/_/g, ' ');
                                    return (
                                        <IconCard
                                            key={key}
                                            icon="external-link"
                                            label={label.charAt(0).toUpperCase() + label.slice(1)}
                                            value={value}
                                            onPress={() => Linking.openURL(value)}
                                            isLink
                                        />
                                    );
                                }
                                return null;
                            })}
                        </Section>
                    )}
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    header: { paddingTop: 20, paddingBottom: 40, paddingHorizontal: 16 },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginLeft: 10,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#e2e8f0',
        marginTop: 8,
    },
    backButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        borderRadius: 20,
    },
    body: {
        flex: 1,
        backgroundColor: '#f8fafc',
        marginTop: -20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    profileCenter: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        borderColor: '#fff',
        marginBottom: 10,
    },
    name: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1e293b',
    },
    alias: {
        color: '#6366f1',
        fontStyle: 'italic',
        fontSize: 16,
    },
    idText: {
        fontSize: 14,
        color: '#64748b',
    },
    sectionCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 14,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
    },
    infoCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderColor: '#e5e7eb',
    },
    iconLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    iconBox: {
        backgroundColor: '#e0e7ff',
        padding: 8,
        borderRadius: 10,
    },
    infoLabel: {
        fontSize: 13,
        color: '#64748b',
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e293b',
    },
});
