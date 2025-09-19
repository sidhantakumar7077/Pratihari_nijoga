import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Platform,
    Modal,
    FlatList,
    ToastAndroid,
    ActivityIndicator
} from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CheckBox from '@react-native-community/checkbox';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { base_url } from '../../../App';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';

const Social = (props) => {

    const navigation = useNavigation();
    const [focusedField, setFocusedField] = useState(null);
    const [loading, setLoading] = useState(false);

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
                    <Text style={styles.headerTitle}>Edit Social Media</Text>
                </View>
                <Text style={styles.headerSubtitle}>Update your social media information.</Text>
            </LinearGradient>

            <ScrollView style={styles.scrollContainer}>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Social;

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
    formContainer: {
        flex: 1,
        marginTop: -20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#f8fafc',
    },
    cardBox: {
        flex: 1,
        width: '95%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 10,
        borderRadius: 10,
    },
    label: {
        color: '#757473',
        fontSize: 16,
    },
    focusedLabel: {
        color: '#e96a01',
        fontSize: 16,
        fontWeight: '500'
    },
    focusedInput: {
        height: 50,
        borderBottomColor: '#56ab2f',
        borderBottomWidth: 1
    },
    submitButton: {
        backgroundColor: '#051b65',
        width: '60%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 50,
        paddingVertical: 10,
        marginVertical: 10,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,  // Spacing for the button text
        marginBottom: 2,
        marginHorizontal: 10
    },
    filePicker: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    filePickerText: {
        width: '70%',
        height: 45,
        lineHeight: 45,
        color: '#000',
    },
    chooseBtn: {
        backgroundColor: '#bbb',
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    chooseBtnText: {
        color: '#fff',
        fontWeight: '500',
    },
    errorText: {
        color: '#e96a01',
        fontSize: 12,
        marginTop: -8,
        marginBottom: 5,
    },
})