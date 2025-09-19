import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import CheckBox from '@react-native-community/checkbox';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';
import { base_url } from '../../../App';

import FormCard from './FormCard';
import AnimatedInput from './AnimatedInput';
import CustomButton from './CustomButton';
import { useFormContext } from './FormContext';

const PersonalDetails = ({ handleNextTab }) => {
    const { setIsLoading } = useFormContext();

    // State variables
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
    const [dob, setDob] = useState(null);
    const [isDateOpen, setDateOpen] = useState(false);
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
    const [userPhoto_source, setUserPhoto_source] = useState(null);
    const [user_photo, setUser_photo] = useState('Select Image');
    const [dateOfJoinTempleSeba, setDateOfJoinTempleSeba] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isYearPickerVisible, setYearPickerVisible] = useState(false);
    const [sebaYear, setSebaYear] = useState(null);
    const [dateRemember, setDateRemember] = useState(null);
    const [personalDetailsErrors, setPersonalDetailsErrors] = useState({});

    // Generate a list of years (Last 75 years)
    const years = Array.from({ length: 75 }, (_, i) => new Date().getFullYear() - i);

    const selectUserPhoto = async () => {
        const options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const source = response.assets[0]
                setUserPhoto_source(source);
                setUser_photo(response.assets[0].fileName);
            }
        });
    };

    const selectHealthCardPhoto = async () => {
        const options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const source = response.assets[0]
                setHelthCardPhoto_source(source);
                setHelthCardPhoto(response.assets[0].fileName);
            }
        });
    };

    const handleMobileChange = (value) => {
        setMobileNumber(value);
        if (isSameAsMobile) {
            setWhatsappNumber(value);
        }
    };

    const handleCheckboxToggle = (newValue) => {
        setIsSameAsMobile(newValue);
        if (newValue) {
            setWhatsappNumber(mobileNumber);
        } else {
            setWhatsappNumber('');
        }
    };

    const validateProfileFields = () => {
        const newErrors = {};

        if (!firstName) newErrors.firstName = 'First Name is required';
        if (!lastName) newErrors.lastName = 'Last Name is required';

        if (!mobileNumber) {
            newErrors.mobileNumber = 'Mobile Number is required';
        } else if (!/^\d{10}$/.test(mobileNumber)) {
            newErrors.mobileNumber = 'Enter a valid 10-digit Mobile Number';
        }

        if (!helthCardNumber) newErrors.helthCardNumber = 'Health Card Number is required';
        if (!helthCardPhoto_source) newErrors.helthCardPhoto_source = 'Health Card Photo is required';
        if (!userPhoto_source) newErrors.userPhoto_source = 'User Photo is required';

        setPersonalDetailsErrors(newErrors);
        setTimeout(() => setPersonalDetailsErrors({}), 5000);

        return Object.keys(newErrors).length === 0;
    };

    const SavePersonalDetails = async () => {
        if (!validateProfileFields()) return;

        setIsLoading(true);
        const token = await AsyncStorage.getItem('storeAccesstoken');
        const formData = new FormData();
        formData.append('first_name', firstName);
        formData.append('middle_name', middleName);
        formData.append('last_name', lastName);
        formData.append('alias_name', alias);
        formData.append('email', emailId);
        formData.append('whatsapp_no', whatsappNumber);
        formData.append('phone_no', mobileNumber);
        formData.append('date_of_birth', moment(dob).format('YYYY-MM-DD'));
        formData.append('blood_group', bloodGroup);
        formData.append('healthcard_no', helthCardNumber);
        if (helthCardPhoto_source) {
            formData.append('healthcard_photo', {
                uri: helthCardPhoto_source.uri,
                type: helthCardPhoto_source.type,
                name: helthCardPhoto_source.fileName,
            });
        }
        formData.append('joining_date', moment(dateOfJoinTempleSeba).format('YYYY-MM-DD'));
        formData.append('joining_year', sebaYear);
        if (userPhoto_source) {
            formData.append('original_photo', {
                uri: userPhoto_source.uri,
                type: userPhoto_source.type,
                name: userPhoto_source.fileName,
            });
        }

        try {
            const response = await fetch(base_url + "api/save-profile", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            const text = await response.text();
            console.log("Raw response:", text);

            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                console.error("Response was not valid JSON", err);
                return;
            }

            if (response.ok) {
                console.log('Personal Details saved successfully', data);
                handleNextTab('family');
            } else {
                console.log("Error: ", data.message || 'Failed to save Personal Details. Please try again.');
            }
        } catch (error) {
            console.error("Network request failed: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Animatable.View
                animation="fadeInDown"
                duration={600}
                style={styles.header}
            >
                <Text style={styles.title}>Personal Details</Text>
                <View style={styles.titleUnderline} />
            </Animatable.View>

            <FormCard delay={200}>
                <AnimatedInput
                    label="First Name*"
                    value={firstName}
                    onChangeText={setFirstName}
                    error={personalDetailsErrors.firstName}
                    delay={300}
                />

                <AnimatedInput
                    label="Middle Name (Optional)"
                    value={middleName}
                    onChangeText={setMiddleName}
                    delay={350}
                />

                <AnimatedInput
                    label="Last Name*"
                    value={lastName}
                    onChangeText={setLastName}
                    error={personalDetailsErrors.lastName}
                    delay={400}
                />

                <AnimatedInput
                    label="Alias"
                    value={alias}
                    onChangeText={setAlias}
                    delay={450}
                />

                {/* Date of Birth */}
                <Animatable.View animation="fadeInUp" duration={600} delay={500}>
                    <Text style={styles.label}>Date Of Birth</Text>
                    <TouchableOpacity onPress={() => setDateOpen(true)} style={styles.dateInput}>
                        <TextInput
                            style={styles.dateText}
                            value={dob ? moment(dob).format('DD-MM-YYYY') : ''}
                            editable={false}
                            placeholder="Select Date Of Birth"
                            placeholderTextColor={'#999'}
                        />
                        <AntDesign name="calendar" size={20} color="#051b65" />
                    </TouchableOpacity>
                </Animatable.View>

                <DatePicker
                    modal
                    mode="date"
                    open={isDateOpen}
                    date={dob || new Date()}
                    onConfirm={(date) => {
                        setDateOpen(false);
                        setDob(date);
                    }}
                    onCancel={() => {
                        setDateOpen(false);
                    }}
                    maximumDate={new Date()}
                />

                <AnimatedInput
                    label="Email (Optional)"
                    value={emailId}
                    onChangeText={setEmailId}
                    keyboardType="email-address"
                    delay={550}
                />

                <AnimatedInput
                    label="Mobile Number*"
                    value={mobileNumber}
                    onChangeText={handleMobileChange}
                    keyboardType="phone-pad"
                    maxLength={10}
                    error={personalDetailsErrors.mobileNumber}
                    delay={600}
                />

                {/* Checkbox */}
                <Animatable.View
                    animation="fadeInUp"
                    duration={600}
                    delay={650}
                    style={styles.checkboxContainer}
                >
                    <CheckBox
                        value={isSameAsMobile}
                        onValueChange={handleCheckboxToggle}
                        tintColors={{ true: '#051b65', false: '#888' }}
                    />
                    <Text style={styles.checkboxLabel}>
                        WhatsApp number is same as mobile number
                    </Text>
                </Animatable.View>

                <AnimatedInput
                    label="WhatsApp Number (Optional)"
                    value={whatsappNumber}
                    onChangeText={setWhatsappNumber}
                    keyboardType="phone-pad"
                    maxLength={10}
                    editable={!isSameAsMobile}
                    delay={700}
                />

                {/* Blood Group */}
                <Animatable.View animation="fadeInUp" duration={600} delay={750}>
                    <Text style={styles.label}>Blood Group</Text>
                    <DropDownPicker
                        open={openBloodGroup}
                        value={bloodGroup}
                        items={bloodGroupOptions}
                        setOpen={setOpenBloodGroup}
                        setValue={setBloodGroup}
                        setItems={setBloodGroupOptions}
                        placeholder='Select Blood Group'
                        placeholderStyle={{ color: '#999' }}
                        containerStyle={styles.dropdownContainer}
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownList}
                        listMode="SCROLLVIEW"
                    />
                </Animatable.View>

                <AnimatedInput
                    label="Health Card Number*"
                    value={helthCardNumber}
                    onChangeText={setHelthCardNumber}
                    error={personalDetailsErrors.helthCardNumber}
                    delay={800}
                />

                {/* Health Card Image */}
                <Animatable.View animation="fadeInUp" duration={600} delay={850}>
                    <Text style={styles.label}>Health Card Image*</Text>
                    <TouchableOpacity style={styles.imagePicker} onPress={selectHealthCardPhoto}>
                        <Text style={styles.imagePickerText}>{helthCardPhoto}</Text>
                        <View style={styles.chooseButton}>
                            <Text style={styles.chooseButtonText}>Choose File</Text>
                        </View>
                    </TouchableOpacity>
                    {personalDetailsErrors.helthCardPhoto_source && (
                        <Text style={styles.errorText}>{personalDetailsErrors.helthCardPhoto_source}</Text>
                    )}
                </Animatable.View>

                {/* User Photo */}
                <Animatable.View animation="fadeInUp" duration={600} delay={900}>
                    <Text style={styles.label}>User Photo*</Text>
                    <TouchableOpacity style={styles.imagePicker} onPress={selectUserPhoto}>
                        <Text style={styles.imagePickerText}>{user_photo}</Text>
                        <View style={styles.chooseButton}>
                            <Text style={styles.chooseButtonText}>Choose File</Text>
                        </View>
                    </TouchableOpacity>
                    {personalDetailsErrors.userPhoto_source && (
                        <Text style={styles.errorText}>{personalDetailsErrors.userPhoto_source}</Text>
                    )}
                </Animatable.View>

                {/* Date of Join Temple Seba */}
                <Animatable.View animation="fadeInUp" duration={600} delay={950}>
                    <TouchableOpacity
                        onPress={() => (dateRemember ? setYearPickerVisible(true) : setDatePickerVisibility(true))}
                        style={styles.dateInput}
                    >
                        <TextInput
                            style={styles.dateText}
                            value={dateRemember ? (sebaYear ? sebaYear.toString() : '') : (dateOfJoinTempleSeba ? moment(dateOfJoinTempleSeba).format('DD-MM-YYYY') : '')}
                            editable={false}
                            placeholder="Year of seba / joining seba"
                            placeholderTextColor={'#999'}
                        />
                        <AntDesign name="calendar" size={20} color="#051b65" />
                    </TouchableOpacity>
                </Animatable.View>

                {/* Date Picker (Full Date) */}
                <DatePicker
                    modal
                    mode="date"
                    open={isDatePickerVisible}
                    date={dateOfJoinTempleSeba || new Date()}
                    onConfirm={(date) => {
                        setDatePickerVisibility(false);
                        setDateOfJoinTempleSeba(date);
                    }}
                    onCancel={() => {
                        setDatePickerVisibility(false);
                    }}
                    maximumDate={new Date()}
                />

                {/* Year Picker Modal */}
                <Modal visible={isYearPickerVisible} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <Animatable.View
                            animation="slideInUp"
                            duration={500}
                            style={styles.modalContent}
                        >
                            <Text style={styles.modalTitle}>Select Year</Text>
                            <FlatList
                                data={years}
                                keyExtractor={(item) => item.toString()}
                                style={styles.yearList}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSebaYear(item);
                                            setYearPickerVisible(false);
                                        }}
                                        style={styles.yearItem}
                                    >
                                        <Text style={styles.yearText}>{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <TouchableOpacity
                                onPress={() => setYearPickerVisible(false)}
                                style={styles.modalCloseButton}
                            >
                                <Text style={styles.modalCloseButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </Animatable.View>
                    </View>
                </Modal>

                {/* Date Remember Checkbox */}
                <Animatable.View
                    animation="fadeInUp"
                    duration={600}
                    delay={1000}
                    style={styles.checkboxContainer}
                >
                    <CheckBox
                        disabled={false}
                        value={dateRemember}
                        onValueChange={(newValue) => {
                            setDateRemember(newValue);
                            setDateOfJoinTempleSeba(null);
                            setSebaYear(null);
                        }}
                        tintColors={{ true: '#051b65', false: '#757473' }}
                    />
                    <Text style={styles.checkboxLabel}>Do not remember the date</Text>
                </Animatable.View>
            </FormCard>

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Next"
                    onPress={SavePersonalDetails}
                    style={styles.nextButton}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        color: '#051b65',
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
    },
    titleUnderline: {
        width: 120,
        height: 4,
        backgroundColor: '#051b65',
        borderRadius: 2,
    },
    label: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#e8e8e8',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 16,
    },
    dateText: {
        flex: 1,
        color: '#333',
        fontSize: 16,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
    },
    checkboxLabel: {
        marginLeft: 8,
        color: '#666',
        fontSize: 14,
        flex: 1,
    },
    dropdownContainer: {
        marginBottom: 16,
    },
    dropdown: {
        backgroundColor: '#fff',
        borderColor: '#e8e8e8',
        borderWidth: 2,
        borderRadius: 12,
        minHeight: 50,
    },
    dropdownList: {
        backgroundColor: '#fff',
        borderColor: '#e8e8e8',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    imagePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#e8e8e8',
        borderRadius: 12,
        paddingLeft: 16,
        paddingVertical: 4,
        marginBottom: 16,
    },
    imagePickerText: {
        flex: 1,
        color: '#666',
        fontSize: 14,
        paddingVertical: 12,
    },
    chooseButton: {
        backgroundColor: '#051b65',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    chooseButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '85%',
        maxHeight: '70%',
        borderRadius: 20,
        padding: 20,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#051b65',
        textAlign: 'center',
        marginBottom: 20,
    },
    yearList: {
        maxHeight: 300,
    },
    yearItem: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 2,
        backgroundColor: '#f8f9ff',
        borderRadius: 10,
        alignItems: 'center',
    },
    yearText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#051b65',
    },
    modalCloseButton: {
        marginTop: 20,
        padding: 12,
        backgroundColor: '#e96a01',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalCloseButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        color: '#ff4757',
        fontSize: 12,
        marginTop: -12,
        marginBottom: 8,
        marginLeft: 4,
    },
    buttonContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    nextButton: {
        width: '60%',
    },
});

export default PersonalDetails;