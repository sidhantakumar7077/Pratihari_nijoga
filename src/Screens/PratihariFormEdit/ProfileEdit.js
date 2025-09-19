import React, { useEffect, useState, useMemo } from 'react';
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
    ActivityIndicator,
} from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { useNavigation } from '@react-navigation/native';
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

/**
 * Helpers
 */
const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());

// VERY defensive date parsing to avoid RangeError
const safeParseDate = (input) => {
    if (!input) return null;

    // If it's already a Date
    if (input instanceof Date) return isValidDate(input) ? input : null;

    // Try YYYY-MM-DD strictly
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
        const [y, m, d] = input.split('-').map((v) => parseInt(v, 10));
        const date = new Date(Date.UTC(y, m - 1, d));
        return isValidDate(date) ? date : null;
    }

    // Try ISO
    const iso = new Date(input);
    if (isValidDate(iso)) return iso;

    // Try numeric epoch (seconds or ms)
    if (/^\d+$/.test(String(input))) {
        const num = Number(input);
        const ms = num < 1e12 ? num * 1000 : num;
        const d = new Date(ms);
        return isValidDate(d) ? d : null;
    }

    // Try moment fallback with strict parse on common formats
    const m = moment(input, ['YYYY-MM-DD', moment.ISO_8601], true);
    if (m.isValid()) return m.toDate();

    return null;
};

const fileFromAsset = (asset, fallbackName = 'upload.jpg') => {
    if (!asset?.uri) return null;
    return {
        uri: Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', ''),
        type: asset.type || 'image/jpeg',
        name: asset.fileName || fallbackName,
    };
};

const ProfileEdit = (props) => {
    const navigation = useNavigation();

    // UI state
    const [focusedField, setFocusedField] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form state
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [alias, setAlias] = useState('');
    const [emailId, setEmailId] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [isSameAsMobile, setIsSameAsMobile] = useState(false);
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [helthCardNumber, setHelthCardNumber] = useState('');

    const [helthCardPhoto_source, setHelthCardPhoto_source] = useState(null);
    const [helthCardPhoto, setHelthCardPhoto] = useState('Select Image');

    const [userPhoto_source, setUserPhoto_source] = useState(null);
    const [user_photo, setUser_photo] = useState('Select Image');

    const [dob, setDob] = useState(null);
    const [isDateOpen, setDateOpen] = useState(false);

    const [educational_qualification, setEducational_qualification] = useState('');

    const [openBloodGroup, setOpenBloodGroup] = useState(false);
    const [bloodGroup, setBloodGroup] = useState(null);
    const [bloodGroupOptions, setBloodGroupOptions] = useState([
        { label: 'A+', value: 'A+' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B-', value: 'B-' },
        { label: 'O+', value: 'O+' },
        { label: 'O-', value: 'O-' },
        { label: 'AB+', value: 'AB+' },
        { label: 'AB-', value: 'AB-' },
    ]);

    const [dateOfJoinTempleSeba, setDateOfJoinTempleSeba] = useState(null);
    const [sebaYear, setSebaYear] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isYearPickerVisible, setYearPickerVisible] = useState(false);
    const [dateRemember, setDateRemember] = useState(false);

    const [personalDetailsErrors, setPersonalDetailsErrors] = useState({});

    // Years (last 75)
    const years = useMemo(
        () => Array.from({ length: 75 }, (_, i) => new Date().getFullYear() - i),
        []
    );

    /**
     * Image pickers (modern API)
     */
    const pickOneImage = async () => {
        const res = await launchImageLibrary({
            mediaType: 'photo',
            selectionLimit: 1,
            includeBase64: false,
        });
        if (res?.didCancel) return null;
        if (res?.errorCode) {
            console.log('ImagePicker Error: ', res.errorMessage || res.errorCode);
            return null;
        }
        return res?.assets?.[0] || null;
    };

    const selectUserPhoto = async () => {
        const asset = await pickOneImage();
        if (!asset) return;
        setUserPhoto_source(asset);
        setUser_photo(asset.fileName || 'profile.jpg');
    };

    const selectHealthCardPhoto = async () => {
        const asset = await pickOneImage();
        if (!asset) return;
        setHelthCardPhoto_source(asset);
        setHelthCardPhoto(asset.fileName || 'healthcard.jpg');
    };

    /**
     * Inputs
     */
    const handleMobileChange = (value) => {
        const onlyDigits = value.replace(/[^\d]/g, '');
        setMobileNumber(onlyDigits);
        if (isSameAsMobile) setWhatsappNumber(onlyDigits);
    };

    const handleCheckboxToggle = (newValue) => {
        setIsSameAsMobile(newValue);
        if (newValue) setWhatsappNumber(mobileNumber);
        else setWhatsappNumber('');
    };

    const isValidEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

    /**
     * Validation
     */
    const validateProfileFields = () => {
        const newErrors = {};

        if (!firstName) newErrors.firstName = 'First Name is required';
        if (!lastName) newErrors.lastName = 'Last Name is required';

        if (!mobileNumber) {
            newErrors.mobileNumber = 'Mobile Number is required';
        } else if (!/^\d{10}$/.test(mobileNumber)) {
            newErrors.mobileNumber = 'Enter a valid 10-digit Mobile Number';
        }

        if (emailId && !isValidEmail(emailId)) {
            newErrors.emailId = 'Enter a valid email address';
        }

        if (!helthCardNumber) newErrors.helthCardNumber = 'Health Card Number is required';
        if (!helthCardPhoto_source?.uri)
            newErrors.helthCardPhoto_source = 'Health Card Photo is required';
        if (!userPhoto_source?.uri) newErrors.userPhoto_source = 'User Photo is required';

        setPersonalDetailsErrors(newErrors);
        setTimeout(() => setPersonalDetailsErrors({}), 5000);

        return Object.keys(newErrors).length === 0;
    };

    /**
     * Submit
     */
    const SavePersonalDetails = async () => {
        if (!validateProfileFields()) return;

        setLoading(true);

        const token = await AsyncStorage.getItem('storeAccesstoken');
        const formData = new FormData();

        formData.append('first_name', firstName);
        formData.append('middle_name', middleName);
        formData.append('last_name', lastName);
        formData.append('alias_name', alias);
        if (emailId) formData.append('email', emailId);
        if (whatsappNumber) formData.append('whatsapp_no', whatsappNumber);
        formData.append('phone_no', mobileNumber);
        if (isValidDate(dob)) formData.append('date_of_birth', moment(dob).format('YYYY-MM-DD'));
        if (bloodGroup) formData.append('blood_group', bloodGroup);
        formData.append('healthcard_no', helthCardNumber);

        const healthFile = fileFromAsset(helthCardPhoto_source, 'healthcard.jpg');
        if (healthFile) formData.append('healthcard_photo', healthFile);

        // Joining date/year
        if (dateRemember) {
            if (sebaYear) {
                formData.append('joining_year', String(sebaYear));
                // Optional: also send a normalized date if your backend expects it
                // formData.append('joining_date', `${sebaYear}-01-01`);
            }
        } else if (isValidDate(dateOfJoinTempleSeba)) {
            formData.append('joining_date', moment(dateOfJoinTempleSeba).format('YYYY-MM-DD'));
        }

        const profileFile = fileFromAsset(userPhoto_source, 'profile.jpg');
        if (profileFile) formData.append('profile_photo', profileFile);

        try {
            const response = await fetch(`${base_url}api/save-profile`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Let RN set the multipart boundary
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                ToastAndroid.show('Personal Details saved successfully', ToastAndroid.SHORT);
                navigation.goBack();
            } else {
                console.log('Error: ', data.message || 'Failed to save Personal Details. Please try again.');
            }
        } catch (error) {
            console.error('Network request failed: ', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Prefill from route params (defensive)
     */
    useEffect(() => {
        const { data } = props.route?.params || {};

        if (data) {
            setFirstName(data.first_name || '');
            setMiddleName(data.middle_name || '');
            setLastName(data.last_name || '');
            setAlias(data.alias_name || '');
            setEmailId(data.email || '');
            setMobileNumber((data.phone_no || '').replace(/[^\d]/g, ''));
            setWhatsappNumber((data.whatsapp_no || '').replace(/[^\d]/g, ''));
            setHelthCardNumber(data.healthcard_no || '');
            setBloodGroup(data.blood_group || null);

            const parsedDob = safeParseDate(data.date_of_birth);
            if (parsedDob) setDob(parsedDob);

            // Year-only value from backend if present
            const jy = Number(data.joining_year);
            setSebaYear(Number.isFinite(jy) ? jy : null);
            if (data.joining_year) setDateRemember(true);

            // Joining date
            const parsedJoin = safeParseDate(data.joining_date);
            if (parsedJoin) {
                setDateOfJoinTempleSeba(parsedJoin);

                // Heuristic: if backend stored year-only as 01-01 but *originally* user picked only year,
                // you can set dateRemember true by inspecting a separate flag if you have one.
                // As a fallback, enable this heuristic only if backend didn't literally send "-01-01" string.
                if (
                    parsedJoin.getUTCDate() === 1 &&
                    parsedJoin.getUTCMonth() === 0 &&
                    typeof data.joining_date === 'string' &&
                    !data.joining_date.includes('-01-01') &&
                    !data.joining_date.includes('-1-1')
                ) {
                    setDateRemember(true);
                }
            }

            // Preload images (URI only; type/name will be defaulted)
            if (data.profile_photo) {
                setUser_photo(String(data.profile_photo).split('/').pop() || 'profile.jpg');
                setUserPhoto_source({ uri: data.profile_photo });
            }
            if (data.healthcard_photo) {
                setHelthCardPhoto(String(data.healthcard_photo).split('/').pop() || 'healthcard.jpg');
                setHelthCardPhoto_source({ uri: data.healthcard_photo });
            }

            if (data.whatsapp_no && data.whatsapp_no === data.phone_no) {
                setIsSameAsMobile(true);
            }
        }
    }, [props.route?.params]);

    /**
     * Render
     */
    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#4c1d95', '#6366f1']} style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                </View>
                <Text style={styles.headerSubtitle}>Update your personal information</Text>
            </LinearGradient>

            <ScrollView style={styles.scrollContainer}>
                <View style={{ flex: 1, marginTop: 15 }}>
                    <View style={styles.cardBox}>
                        {/* First Name */}
                        <FloatingLabelInput
                            label="First Name*"
                            value={firstName}
                            customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                            labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                            onChangeText={setFirstName}
                            containerStyles={styles.floatingContainer}
                        />
                        {personalDetailsErrors.firstName && <Text style={styles.errorText}>{personalDetailsErrors.firstName}</Text>}

                        {/* Middle Name */}
                        <FloatingLabelInput
                            label="Middle Name (Optional)"
                            value={middleName}
                            customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                            labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                            onChangeText={setMiddleName}
                            containerStyles={styles.floatingContainer}
                        />

                        {/* Last Name */}
                        <FloatingLabelInput
                            label="Last Name*"
                            value={lastName}
                            customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                            labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                            onChangeText={setLastName}
                            containerStyles={styles.floatingContainer}
                        />
                        {personalDetailsErrors.lastName && <Text style={styles.errorText}>{personalDetailsErrors.lastName}</Text>}

                        {/* Alias */}
                        <FloatingLabelInput
                            label="Alias"
                            value={alias}
                            customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                            labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                            onChangeText={setAlias}
                            containerStyles={styles.floatingContainer}
                        />

                        {/* DOB */}
                        <Text style={[styles.label, (focusedField === 'dob' || dob !== null) && styles.focusedLabel]}>
                            Date Of Birth
                        </Text>
                        <TouchableOpacity onPress={() => setDateOpen(true)}>
                            <TextInput
                                style={styles.dateTextInput}
                                value={isValidDate(dob) ? moment(dob).format('DD-MM-YYYY') : ''}
                                editable={false}
                                placeholder="Date Of Birth"
                                placeholderTextColor={'#4d6285'}
                            />
                            <AntDesign name="calendar" size={25} color="#4d6285" style={styles.calendarIcon} />
                        </TouchableOpacity>
                        <DatePicker
                            modal
                            mode="date"
                            open={isDateOpen}
                            date={isValidDate(dob) ? dob : new Date()}
                            onConfirm={(date) => {
                                setDateOpen(false);
                                setDob(date);
                            }}
                            onCancel={() => setDateOpen(false)}
                            maximumDate={new Date()}
                        />

                        {/* Email */}
                        <FloatingLabelInput
                            label="Email (Optional)"
                            value={emailId}
                            customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                            labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                            onChangeText={setEmailId}
                            keyboardType="email-address"
                            containerStyles={styles.floatingContainer}
                        />
                        {personalDetailsErrors.emailId && <Text style={styles.errorText}>{personalDetailsErrors.emailId}</Text>}

                        {/* Mobile (read-only as per your original) */}
                        <FloatingLabelInput
                            label="Mobile Number*"
                            value={mobileNumber}
                            editable={false}
                            customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                            labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                            onChangeText={handleMobileChange}
                            keyboardType="phone-pad"
                            maxLength={10}
                            containerStyles={styles.floatingContainer}
                        />
                        {personalDetailsErrors.mobileNumber && <Text style={styles.errorText}>{personalDetailsErrors.mobileNumber}</Text>}

                        {/* WhatsApp same as mobile */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                            <CheckBox value={isSameAsMobile} onValueChange={handleCheckboxToggle} tintColors={{ true: '#e96a01', false: '#888' }} />
                            <Text style={styles.checkboxLabel}>WhatsApp number is same as mobile number</Text>
                        </View>

                        {/* WhatsApp Number */}
                        <FloatingLabelInput
                            label="Whatsapp Number (Optional)"
                            value={whatsappNumber}
                            editable={!isSameAsMobile}
                            customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                            labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                            onChangeText={(v) => setWhatsappNumber(v.replace(/[^\d]/g, ''))}
                            keyboardType="phone-pad"
                            maxLength={10}
                            containerStyles={styles.floatingContainer}
                        />

                        {/* Blood Group */}
                        <Text style={[styles.label, { marginBottom: 10 }, (focusedField === 'bloodGroup' || bloodGroup !== null) && styles.focusedLabel]}>
                            Blood Group
                        </Text>
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                            <DropDownPicker
                                open={openBloodGroup}
                                value={bloodGroup}
                                items={bloodGroupOptions}
                                setOpen={setOpenBloodGroup}
                                setValue={setBloodGroup}
                                setItems={setBloodGroupOptions}
                                placeholder="Select Blood Group"
                                placeholderStyle={{ color: '#4d6285' }}
                                containerStyle={{ width: '100%', marginTop: 5 }}
                                style={[styles.input, (focusedField === 'bloodGroup' || bloodGroup !== null) && styles.focusedInput]}
                                dropDownContainerStyle={{ backgroundColor: '#fafafa', zIndex: 999 }}
                                dropDownDirection="BOTTOM"
                                listMode="SCROLLVIEW"
                            />
                        </View>

                        {/* Health Card Number */}
                        <FloatingLabelInput
                            label="Health Card Number*"
                            value={helthCardNumber}
                            customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                            labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                            onChangeText={setHelthCardNumber}
                            keyboardType="default"
                            containerStyles={styles.floatingContainer}
                        />
                        {personalDetailsErrors.helthCardNumber && <Text style={styles.errorText}>{personalDetailsErrors.helthCardNumber}</Text>}

                        {/* Health Card Image */}
                        <Text style={[styles.label, helthCardPhoto !== 'Select Image' && styles.focusedLabel]}>Health Card Image*</Text>
                        <TouchableOpacity style={[styles.filePicker, { marginTop: 10 }]} onPress={selectHealthCardPhoto}>
                            <TextInput style={styles.filePickerText} editable={false} placeholder={helthCardPhoto} placeholderTextColor={'#4d6285'} />
                            <View style={styles.chooseBtn}>
                                <Text style={styles.chooseBtnText}>Choose File</Text>
                            </View>
                        </TouchableOpacity>
                        {personalDetailsErrors.helthCardPhoto_source && <Text style={styles.errorText}>{personalDetailsErrors.helthCardPhoto_source}</Text>}

                        {/* User Photo */}
                        <Text style={[styles.label, user_photo !== 'Select Image' && styles.focusedLabel]}>User Photo*</Text>
                        <TouchableOpacity style={[styles.filePicker, { marginTop: 10 }]} onPress={selectUserPhoto}>
                            <TextInput style={styles.filePickerText} editable={false} placeholder={user_photo} placeholderTextColor={'#4d6285'} />
                            <View style={styles.chooseBtn}>
                                <Text style={styles.chooseBtnText}>Choose File</Text>
                            </View>
                        </TouchableOpacity>
                        {personalDetailsErrors.userPhoto_source && <Text style={styles.errorText}>{personalDetailsErrors.userPhoto_source}</Text>}

                        {/* Joining Date / Year */}
                        <TouchableOpacity onPress={() => (dateRemember ? setYearPickerVisible(true) : setDatePickerVisibility(true))}>
                            <TextInput
                                style={styles.dateTextInput}
                                value={
                                    dateRemember
                                        ? sebaYear
                                            ? String(sebaYear)
                                            : ''
                                        : isValidDate(dateOfJoinTempleSeba)
                                            ? moment(dateOfJoinTempleSeba).format('DD-MM-YYYY')
                                            : ''
                                }
                                editable={false}
                                placeholder="Year of seba / joining seba"
                                placeholderTextColor={'#4d6285'}
                            />
                            <AntDesign name="calendar" size={25} color="#4d6285" style={styles.calendarIcon} />
                        </TouchableOpacity>

                        {/* Full Date Picker */}
                        <DatePicker
                            modal
                            mode="date"
                            open={isDatePickerVisible}
                            date={isValidDate(dateOfJoinTempleSeba) ? dateOfJoinTempleSeba : new Date()}
                            onConfirm={(date) => {
                                setDatePickerVisibility(false);
                                setDateOfJoinTempleSeba(date);
                            }}
                            onCancel={() => setDatePickerVisibility(false)}
                            maximumDate={new Date()}
                        />

                        {/* Year Picker */}
                        <Modal visible={isYearPickerVisible} transparent animationType="fade">
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                <View style={{ backgroundColor: 'white', width: 320, borderRadius: 15, padding: 20, elevation: 10 }}>
                                    <View style={{ alignItems: 'center', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333' }}>Select Year</Text>
                                    </View>

                                    <FlatList
                                        data={years}
                                        keyExtractor={(item) => item.toString()}
                                        style={{ maxHeight: 250, marginTop: 10 }}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setSebaYear(item);
                                                    setYearPickerVisible(false);
                                                }}
                                                style={{
                                                    paddingVertical: 12,
                                                    marginVertical: 4,
                                                    backgroundColor: '#f8f8f8',
                                                    borderRadius: 10,
                                                    alignItems: 'center',
                                                    shadowColor: '#000',
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.2,
                                                    shadowRadius: 3,
                                                    elevation: 3,
                                                }}
                                            >
                                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4d6285' }}>{item}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />

                                    <TouchableOpacity
                                        onPress={() => setYearPickerVisible(false)}
                                        style={{
                                            marginTop: 15,
                                            padding: 12,
                                            backgroundColor: '#051b65',
                                            borderRadius: 10,
                                            alignItems: 'center',
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.3,
                                            shadowRadius: 4,
                                            elevation: 3,
                                        }}
                                    >
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        {/* Remember only year */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <CheckBox
                                disabled={false}
                                value={!!dateRemember}
                                onValueChange={(newValue) => {
                                    setDateRemember(newValue);
                                    setDateOfJoinTempleSeba(null);
                                    setSebaYear(null);
                                }}
                                tintColors={{ true: '#e96a01', false: '#757473' }}
                            />
                            <Text style={{ fontSize: 16, marginRight: 10, color: '#757473' }}>Do not remember the date</Text>
                        </View>
                    </View>

                    {/* Submit */}
                    <TouchableOpacity style={styles.submitButton} onPress={SavePersonalDetails} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.submitText}>Save Changes</Text>
                                <Ionicons name="checkmark" size={20} color="#fff" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileEdit;

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
        fontWeight: '500',
    },
    input: {
        height: 50,
        borderWidth: 0.5,
        borderColor: '#353535',
        backgroundColor: '#ffffff',
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    focusedInput: {
        height: 50,
        borderBottomColor: '#56ab2f',
        borderBottomWidth: 1,
    },
    floatingContainer: {
        borderWidth: 0.5,
        borderColor: '#353535',
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 10,
        marginVertical: 12,
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
        letterSpacing: 1,
        marginBottom: 2,
        marginHorizontal: 10,
    },
    filePicker: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
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
    dateTextInput: {
        color: '#000',
        borderWidth: 0.5,
        borderColor: '#353535',
        backgroundColor: '#ffffff',
        padding: 10,
        paddingLeft: 18,
        borderRadius: 10,
        marginVertical: 12,
    },
    calendarIcon: {
        position: 'absolute',
        right: 20,
        top: 22,
    },
});