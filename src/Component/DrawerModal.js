import {
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Image,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const menuItems = [
    { icon: <FontAwesome name="user" size={20} color="#fff" />, label: 'Profile', route: 'Profile', bgColor: '#3B82F6' },
    { icon: <AntDesign name="clockcircleo" size={20} color="#fff" />, label: 'Upcoming Pali', route: 'UpcomingPali', bgColor: '#10B981' },
    { icon: <FontAwesome name="history" size={20} color="#fff" />, label: 'Pali History', route: 'PaliHistory', bgColor: '#F59E0B' },
    { icon: <AntDesign name="notification" size={20} color="#fff" />, label: 'Notice', route: 'Notice', bgColor: '#EF4444' },
    { icon: <Feather name="share-2" size={20} color="#fff" />, label: 'Social Media', route: 'SocialMedia', bgColor: '#8B5CF6' },
    { icon: <Feather name="users" size={20} color="#fff" />, label: 'Committee', route: 'Committee', bgColor: '#EC4899' },
    { icon: <MaterialCommunityIcons name="file-document-outline" size={20} color="#fff" />, label: 'Application', route: 'Application', bgColor: '#06B6D4' },
];

const DrawerModal = ({ visible, onClose, profileDetails }) => {
    const navigation = useNavigation();

    const handleNavigation = (route) => {
        onClose();
        navigation.navigate(route);
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.drawerContainer}>
                            {/* Header with Profile */}
                            <LinearGradient colors={['#4c1d95', '#6366f1']} style={styles.header}>
                                {/* <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <Feather name="x" size={24} color="#fff" />
                                </TouchableOpacity> */}

                                <View style={styles.profileSection}>
                                    <View style={styles.avatarPlaceholder}>
                                        {profileDetails?.profile_photo_url ? (
                                            <Image
                                                source={{ uri: profileDetails?.profile_photo_url }}
                                                style={styles.avatarImage}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <FontAwesome name="user" size={20} color="#fff" />
                                        )}
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                        <Text style={styles.userName}>{profileDetails?.first_name}</Text>
                                        <Text style={styles.userEmail}>{profileDetails?.phone_no}</Text>
                                    </View>
                                </View>
                            </LinearGradient>

                            {/* Menu Items */}
                            <ScrollView showsVerticalScrollIndicator={false} style={styles.menuContainer}>
                                {menuItems.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.menuItem}
                                        onPress={() => handleNavigation(item.route)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>{item.icon}</View>
                                        <Text style={styles.menuLabel}>{item.label}</Text>
                                        <Text style={styles.arrow}>›</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Footer */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Version 1.0.0</Text>
                                <Text style={styles.footerSubtext}>Made with ❤️ for Pratihari Nijog by {'\n'}Unitor Technology Pvt Ltd</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default DrawerModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    drawerContainer: {
        width: screenWidth * 0.75,
        height: screenHeight,
        backgroundColor: '#fff',
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
        overflow: 'hidden',
        elevation: 10,
    },
    header: {
        paddingTop: 0,
        paddingBottom: 30,
        paddingHorizontal: 25,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 18,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    userName: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    userEmail: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
    },
    menuContainer: {
        paddingTop: 15,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingLeft: 10,
        paddingRight: 20,
        marginHorizontal: 10,
        backgroundColor: '#f9fafb',
        borderRadius: 10,
        marginBottom: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        flex: 1,
    },
    arrow: {
        fontSize: 18,
        color: '#9CA3AF',
    },
    footer: {
        padding: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 13,
        color: '#9CA3AF',
    },
    footerSubtext: {
        fontSize: 13,
        color: '#D1D5DB',
        marginTop: 4,
        textAlign: 'center',
    },
});
