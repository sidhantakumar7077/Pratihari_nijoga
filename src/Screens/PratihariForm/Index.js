import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList, TextInput, Image, Modal, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { Calendar } from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import CheckBox from '@react-native-community/checkbox';
import DropDownPicker from 'react-native-dropdown-picker';
import RadioForm from 'react-native-simple-radio-button';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Swiper from 'react-native-swiper';

// images
const image1 = require('../../assets/images/slideImg5.jpg');
const image2 = require('../../assets/images/slideImg6.jpg');
const image3 = require('../../assets/images/slideImg7.webp');

const Index = () => {

    const images = [image3, image2, image1];

    const tabs = [
        { key: 'Official', label: 'Official', icon: 'account-tie' },
        { key: 'id_card', label: 'ID Card', icon: 'id-card' },
        { key: 'personal', label: 'Personal', icon: 'account' },
        { key: 'family', label: 'Family', icon: 'account-supervisor' },
        { key: 'address', label: 'Address', icon: 'map-marker' },
        { key: 'bank', label: 'Bank', icon: 'bank' },
        { key: 'social', label: 'Social Media', icon: 'web' },
    ];
    const [activeTab, setActiveTab] = useState('Official');
    const [isFocused, setIsFocused] = useState(null);
    const navigation = useNavigation();

    // Official Information
    const [mobileNumber, setMobileNumber] = useState('');
    const [emailId, setEmailId] = useState('');
    const [helthCardNumber, setHelthCardNumber] = useState('');
    const [templeId, setTempleId] = useState('');
    const [dateOfJoinTempleSeba, setDateOfJoinTempleSeba] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const openDatePicker = () => { setDatePickerVisibility(true) };
    const closeDatePicker = () => { setDatePickerVisibility(false) };

    const handleDayPress = (day) => {
        setDateOfJoinTempleSeba(new Date(day.dateString));
        closeDatePicker();
    };

    // ID Card Information
    const [fields, setFields] = useState([
        { idProof: null, idProofNumber: '', idProofImage: 'Select Image' },
    ]);
    const [focusedField, setFocusedField] = useState(null);

    const selectIdProofImage = (index) => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                selectionLimit: 1,
            },
            (response) => {
                if (!response.didCancel && response.assets) {
                    const { fileName } = response.assets[0];
                    const updatedFields = [...fields];
                    updatedFields[index].idProofImage = fileName || 'Image Selected';
                    setFields(updatedFields);
                }
            }
        );
    };

    const addMoreFields = () => {
        setFields([
            ...fields,
            { idProof: null, idProofNumber: '', idProofImage: 'Select Image' },
        ]);
    };

    const removeFields = (index) => {
        const updatedFields = fields.filter((_, i) => i !== index);
        setFields(updatedFields);
    };

    // Personal Information
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState(null);
    const [isDateOpen, setDateOpen] = useState(false);
    const openDobPicker = () => { setDateOpen(true) };
    const closeDobPicker = () => { setDateOpen(false) };
    const [educational_qualification, setEducational_qualification] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [userPhoto_source, setUserPhoto_source] = useState(null);
    const [user_photo, setUser_photo] = useState('Select Image');

    const handleDObOpen = (day) => {
        setDob(new Date(day.dateString));
        closeDobPicker();
    };

    // Handle document upload using react-native-image-picker
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
                // console.log("selected User Photo-=-=", response.assets[0])
            }
        });
    };

    const [languages, setLanguages] = useState([
        { lang: '', read: null, write: null, speak: null },
    ])

    // Family Information
    const [fatherName, setFatherName] = useState('');
    const [motherName, setMotherName] = useState('');
    const [fathersPhoto_source, setFathersPhoto_source] = useState(null);
    const [fathers_photo, setFathers_photo] = useState('Select Image');
    const [mothersPhoto_source, setMothersPhoto_source] = useState(null);
    const [mothers_photo, setMothers_photo] = useState('Select Image');
    const [marrital_status, setMarrital_status] = useState(null);
    const maritalStatusOptions = [
        { label: 'Single', value: 'single' },
        { label: 'Married', value: 'married' },
    ];
    const [addSpouseFamilyDetails, setAddSpouseFamilyDetails] = useState(false);
    const [spouseName, setSpouseName] = useState('');
    const [spousePhoto_source, setSpousePhoto_source] = useState(null);
    const [spouse_photo, setSpouse_photo] = useState('Select Image');
    const [isUnderCommunity, setIsUnderCommunity] = useState(false);
    const [spouseFatherName, setSpouseFatherName] = useState('');
    const [spouseFathersPhoto_source, setSpouseFathersPhoto_source] = useState(null);
    const [spouseFathers_photo, setSpouseFathers_photo] = useState('Select Image');
    const [childrenFields, setChildrenFields] = useState([
        { name: '', dob: null, gender: null, image: 'Select Image' },
    ]);
    const [isChildDobOpen, setChildDobOpen] = useState(false);
    const openChildDobPicker = () => { setChildDobOpen(true) };
    const closeChildDobPicker = () => { setChildDobOpen(false) };

    // Handle Parents Image Upload using react-native-image-picker
    const selectParentsImage = async (type) => {
        const options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        }
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const source = response.assets[0]
                if (type === 'father') {
                    setFathersPhoto_source(source);
                    setFathers_photo(response.assets[0].fileName);
                } else if (type === 'mother') {
                    setMothersPhoto_source(source);
                    setMothers_photo(response.assets[0].fileName);
                } else if (type === 'spouse') {
                    setSpousePhoto_source(source);
                    setSpouse_photo(response.assets[0].fileName);
                }
            }
        });
    };
    // Handle Children Image Upload using react-native-image-picker
    const selectChildrenImage = async (index) => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                selectionLimit: 1,
            },
            (response) => {
                if (!response.didCancel && response.assets) {
                    const { fileName } = response.assets[0];
                    const updatedFields = [...childrenFields];
                    updatedFields[index].image = fileName || 'Image Selected';
                    setChildrenFields(updatedFields);
                }
            }
        );
    }

    // Address Information
    const [present_address, setPresent_address] = useState('');
    const [present_post, setPresent_post] = useState('');
    const [present_district, setPresent_district] = useState('');
    const [present_state, setPresent_state] = useState('');
    const [present_country, setPresent_country] = useState('');
    const [present_pincode, setPresent_pincode] = useState('');
    const [present_landmark, setPresent_landmark] = useState('');
    const [isPermanentSameAsPresent, setIsPermanentSameAsPresent] = useState(true);
    const [permanent_address, setPermanent_address] = useState('');
    const [permanent_post, setPermanent_post] = useState('');
    const [permanent_district, setPermanent_district] = useState('');
    const [permanent_state, setPermanent_state] = useState('');
    const [permanent_country, setPermanent_country] = useState('');
    const [permanent_pincode, setPermanent_pincode] = useState('');
    const [permanent_landmark, setPermanent_landmark] = useState('');

    // Bank Information
    const [bankName, setBankName] = useState('');
    const [branchName, setBranchName] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [upi, setUpi] = useState('');

    // Social Media
    const [facebook_url, setFacebook_url] = useState('');
    const [twitter_url, setTwitter_url] = useState('');
    const [instagram_url, setInstagram_url] = useState('');
    const [linkedin_url, setLinkedin_url] = useState('');
    const [youtube_url, setYoutube_url] = useState('');

    const flatListRef = React.useRef(null);

    const scrollToActiveTab = (index) => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                index,
                animated: true,
                viewPosition: 0.5, // Align the selected tab in the middle
            });
        }
    };

    const handleNextTab = (nextTab) => {
        const nextTabIndex = tabs.findIndex((tab) => tab.key === nextTab);
        setActiveTab(nextTab);
        scrollToActiveTab(nextTabIndex);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <View style={styles.swiperContainer}>
                <Swiper
                    showsButtons={false}
                    autoplay={false}
                    autoplayTimeout={3}
                    dotStyle={styles.dotStyle}
                    activeDotStyle={styles.activeDotStyle}
                    paginationStyle={{ bottom: 10 }}
                >
                    {images.map((image, index) => (
                        <Image
                            key={index}
                            source={image}  // Use local image source
                            style={styles.sliderImage}
                            resizeMode="cover"
                        />
                    ))}
                </Swiper>
            </View>
            <View style={{ height: 50, marginBottom: 15, marginHorizontal: 10 }}>
                <FlatList
                    ref={flatListRef}
                    data={tabs}
                    keyExtractor={(item) => item.key}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {tabs.findIndex(tab => tab.key === item.key) !== 0 && (
                                <View style={{ width: 55, height: 3, backgroundColor: activeTab === item.key || tabs.findIndex(tab => tab.key === item.key) < tabs.findIndex(tab => tab.key === activeTab) ? '#c9170a' : '#919090' }} />
                            )}
                            <View
                                style={activeTab === item.key ? styles.activeTab : (tabs.findIndex(tab => tab.key === item.key) < tabs.findIndex(tab => tab.key === activeTab) ? styles.activeTab : styles.tab)}
                                onPress={() => setActiveTab(item.key)}
                            >
                                <MaterialCommunityIcons name={item.icon} size={20} color={activeTab === item.key || tabs.findIndex(tab => tab.key === item.key) < tabs.findIndex(tab => tab.key === activeTab) ? '#fff' : '#000'} />
                                <Text style={activeTab === item.key || tabs.findIndex(tab => tab.key === item.key) < tabs.findIndex(tab => tab.key === activeTab) ? styles.activeTabText : styles.tabText}>{item.label}</Text>
                            </View>
                        </View>
                    )}
                />
            </View>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                {activeTab === 'Official' &&
                    <ScrollView style={styles.cardBox}>
                        <View style={{ flex: 1 }}>
                            {/* Mobile Number Input */}
                            <FloatingLabelInput
                                label="Mobile Number"
                                value={mobileNumber}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                maxLength={10}
                                keyboardType="phone-pad"
                                onChangeText={value => setMobileNumber(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Email Id Input */}
                            <FloatingLabelInput
                                label="Email Id"
                                value={emailId}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                keyboardType="email-address"
                                onChangeText={value => setEmailId(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Health Card Number Input */}
                            <FloatingLabelInput
                                label="Health Card Number"
                                value={helthCardNumber}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                keyboardType="numeric"
                                onChangeText={value => setHelthCardNumber(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Temple ID Input */}
                            <FloatingLabelInput
                                label="Temple ID"
                                value={templeId}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                keyboardType="numeric"
                                onChangeText={value => setTempleId(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Date Of Join Temple Seba Input */}
                            <TouchableOpacity onPress={openDatePicker}>
                                <TextInput
                                    style={{ color: '#000', borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, paddingLeft: 18, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                    value={dateOfJoinTempleSeba ? moment(dateOfJoinTempleSeba).format('DD-MM-YYYY') : ''}
                                    editable={false}
                                    placeholder="Date Of Joining Temple Seba"
                                    placeholderTextColor={'#4d6285'}
                                />
                                <AntDesign name="calendar" size={25} color="#4d6285" style={{ position: 'absolute', right: 20, top: 22 }} />
                            </TouchableOpacity>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={isDatePickerVisible}
                                onRequestClose={closeDatePicker}
                            >
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                    <View style={{ width: '90%', padding: 20, backgroundColor: 'white', borderRadius: 10, elevation: 5 }}>
                                        <Calendar
                                            onDayPress={handleDayPress}
                                            markedDates={{
                                                [moment(dateOfJoinTempleSeba).format('YYYY-MM-DD')]: {
                                                    selected: true,
                                                    marked: true,
                                                    selectedColor: 'blue'
                                                }
                                            }}
                                        />
                                    </View>
                                </View>
                            </Modal>
                        </View>
                        {/* Submit Button */}
                        <TouchableOpacity style={styles.submitButton} onPress={() => handleNextTab('id_card')}>
                            <Text style={styles.submitText}>Next</Text>
                            <Fontisto name="arrow-right" size={20} color="#fff" />
                        </TouchableOpacity>
                    </ScrollView>
                }
                {activeTab === 'id_card' &&
                    <ScrollView style={{ flex: 1 }}>
                        {fields.map((field, index) => (
                            <View key={index} style={styles.cardBox}>
                                {/* Select ID Proof Dropdown */}
                                <Text style={[styles.label, (focusedField === `idProof${index}` || field.idProof !== null) && styles.focusedLabel]}>Select ID Proof</Text>
                                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                                    <DropDownPicker
                                        items={[
                                            { label: 'Aadhar Card', value: 'aadhar' },
                                            { label: 'PAN Card', value: 'pan' },
                                            { label: 'Voter ID', value: 'voter' },
                                            { label: 'Driving License', value: 'driving' },
                                        ]}
                                        placeholder='Select ID Proof'
                                        placeholderStyle={{ color: '#4d6285' }}
                                        open={focusedField === `idProof${index}`}
                                        value={field.idProof}
                                        setOpen={() => setFocusedField(focusedField === `idProof${index}` ? null : `idProof${index}`)}
                                        setValue={(callback) => {
                                            const updatedFields = [...fields];
                                            updatedFields[index].idProof = callback(field.idProof);
                                            setFields(updatedFields);
                                        }}
                                        containerStyle={{ marginTop: 20, width: '70%' }}
                                        style={[styles.input, (focusedField === `idProof${index}` || field.idProof !== null) && styles.focusedInput]}
                                        dropDownContainerStyle={{ backgroundColor: '#fafafa' }}
                                    />
                                    <View style={{ width: '30%', flexDirection: 'row' }}>
                                        {index > 0 && (
                                            <TouchableOpacity onPress={() => removeFields(index)} style={{ marginLeft: 5 }}>
                                                <AntDesign name="minussquare" color="#c41414" size={40} />
                                            </TouchableOpacity>
                                        )}
                                        {/* Add More Button */}
                                        {index === fields.length - 1 &&
                                            <TouchableOpacity style={[styles.addButton, { marginLeft: 5 }]} onPress={addMoreFields}>
                                                <AntDesign name="plussquare" color="#016a59" size={40} />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>

                                {/* ID Proof Number Input */}
                                <FloatingLabelInput
                                    label="ID Proof Number"
                                    value={field.idProofNumber}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    keyboardType="numeric"
                                    onChangeText={value => {
                                        const updatedFields = [...fields];
                                        updatedFields[index].idProofNumber = value;
                                        setFields(updatedFields);
                                    }}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />

                                {/* ID Proof Image Picker */}
                                <Text style={[styles.label, field.idProofImage !== 'Select Image' && styles.focusedLabel]}>ID Proof Image</Text>
                                <TouchableOpacity style={[styles.filePicker, { marginTop: 5 }]} onPress={() => selectIdProofImage(index)}>
                                    <TextInput
                                        style={{ width: '70%', color: '#4d6285' }}
                                        editable={false}
                                        value={field.idProofImage}
                                    />
                                    <View style={styles.chooseBtn}>
                                        <Text style={styles.chooseBtnText}>Choose File</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                        {/* Submit Button */}
                        <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                            <TouchableOpacity onPress={() => handleNextTab('Official')} style={{ width: '45%', backgroundColor: '#208a20', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 6, paddingVertical: 10, marginVertical: 15 }}>
                                <Fontisto name="arrow-left" size={20} color="#fff" />
                                <Text style={styles.submitText}>Previous</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleNextTab('personal')} style={{ width: '45%', backgroundColor: '#c9170a', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 6, paddingVertical: 10, marginVertical: 15 }}>
                                <Text style={styles.submitText}>Next</Text>
                                <Fontisto name="arrow-right" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                }
                {activeTab === 'personal' &&
                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.cardBox}>
                            {/* First Name Input */}
                            <FloatingLabelInput
                                label="First Name"
                                value={firstName}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setFirstName(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Last Name Input */}
                            <FloatingLabelInput
                                label="Last Name"
                                value={lastName}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setLastName(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Date Of Birth Input */}
                            <TouchableOpacity onPress={openDobPicker}>
                                <TextInput
                                    style={{ color: '#000', borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, paddingLeft: 18, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                    value={dob ? moment(dob).format('DD-MM-YYYY') : ''}
                                    editable={false}
                                    placeholder="Date Of Birth"
                                    placeholderTextColor={'#4d6285'}
                                />
                                <AntDesign name="calendar" size={25} color="#4d6285" style={{ position: 'absolute', right: 20, top: 22 }} />
                            </TouchableOpacity>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={isDateOpen}
                                onRequestClose={closeDobPicker}
                            >
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                    <View style={{ width: '90%', padding: 20, backgroundColor: 'white', borderRadius: 10, elevation: 5 }}>
                                        <Calendar
                                            onDayPress={handleDObOpen}
                                            markedDates={{
                                                [moment(dob).format('YYYY-MM-DD')]: {
                                                    selected: true,
                                                    marked: true,
                                                    selectedColor: 'blue'
                                                }
                                            }}
                                        />
                                    </View>
                                </View>
                            </Modal>
                            {/* Educational Qualification Input */}
                            <FloatingLabelInput
                                label="Educational Qualification"
                                value={educational_qualification}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setEducational_qualification(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Blood Group Input */}
                            <FloatingLabelInput
                                label="Blood Group"
                                value={bloodGroup}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setBloodGroup(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* User Photo Input */}
                            <Text style={[styles.label, user_photo !== 'Select Image' && styles.focusedLabel]}>User Photo</Text>
                            <TouchableOpacity style={[styles.filePicker, { marginTop: 10 }]} onPress={selectUserPhoto}>
                                <TextInput
                                    style={styles.filePickerText}
                                    editable={false}
                                    placeholder={user_photo}
                                    placeholderTextColor={'#4d6285'}
                                />
                                <View style={styles.chooseBtn}>
                                    <Text style={styles.chooseBtnText}>Choose File</Text>
                                </View>
                            </TouchableOpacity>
                            {/* Add more For Language Entry */}
                            <Text style={[styles.label, { marginTop: 0 }]}>Languages</Text>
                            {languages.map((language, index) => (
                                <View key={index} style={{ width: '100%' }}>
                                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        {/* Language Input */}
                                        <View style={{ width: '45%' }}>
                                            <FloatingLabelInput
                                                label="Language"
                                                value={language.lang}
                                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                                onChangeText={(text) => {
                                                    const updatedFields = [...languages];
                                                    updatedFields[index].lang = text;
                                                    setLanguages(updatedFields);
                                                }}
                                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10, width: '100%' }}
                                            />
                                        </View>
                                        {/* Read Checkbox */}
                                        <View style={{ alignItems: 'center' }}>
                                            <CheckBox
                                                disabled={false}
                                                value={language.read}
                                                onValueChange={(newValue) => {
                                                    const updatedFields = [...languages];
                                                    updatedFields[index].read = newValue;
                                                    setLanguages(updatedFields);
                                                }}
                                                tintColors={{ true: '#56ab2f', false: '#757473' }}
                                            />
                                            <Text style={{ fontSize: 16, marginRight: 10, color: '#757473' }}>Read</Text>
                                        </View>
                                        {/* Write Checkbox */}
                                        <View style={{ alignItems: 'center' }}>
                                            <CheckBox
                                                disabled={false}
                                                value={language.write}
                                                onValueChange={(newValue) => {
                                                    const updatedFields = [...languages];
                                                    updatedFields[index].write = newValue;
                                                    setLanguages(updatedFields);
                                                }}
                                                tintColors={{ true: '#56ab2f', false: '#757473' }}
                                            />
                                            <Text style={{ fontSize: 16, marginRight: 10, color: '#757473' }}>Write</Text>
                                        </View>
                                        {/* Speak Checkbox */}
                                        <View style={{ alignItems: 'center' }}>
                                            <CheckBox
                                                disabled={false}
                                                value={language.speak}
                                                onValueChange={(newValue) => {
                                                    const updatedFields = [...languages];
                                                    updatedFields[index].speak = newValue;
                                                    setLanguages(updatedFields);
                                                }}
                                                tintColors={{ true: '#56ab2f', false: '#757473' }}
                                            />
                                            <Text style={{ fontSize: 16, marginRight: 10, color: '#757473' }}>Speak</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 5 }}>
                                        {index === languages.length - 1 &&
                                            <TouchableOpacity style={{ backgroundColor: '#1e7836', padding: 10, borderRadius: 6, marginRight: 20 }} onPress={() => setLanguages([...languages, { lang: '', read: null, write: null, speak: null }])}>
                                                {/* <AntDesign name="plussquare" color="#016a59" size={40} /> */}
                                                <Text style={{ color: '#fff', fontSize: 14 }}>Add More</Text>
                                            </TouchableOpacity>
                                        }
                                        {index > 0 &&
                                            <TouchableOpacity style={{ backgroundColor: '#ba111e', padding: 10, borderRadius: 6 }} onPress={() => setLanguages(languages.filter((_, i) => i !== index))}>
                                                {/* <AntDesign name="minussquare" color="#c41414" size={40} /> */}
                                                <Text style={{ color: '#fff', fontSize: 14 }}>Remove</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                            ))}
                        </View>
                        {/* Submit Button */}
                        <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                            <TouchableOpacity onPress={() => handleNextTab('id_card')} style={{ width: '45%', backgroundColor: '#208a20', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 6, paddingVertical: 10, marginVertical: 15 }}>
                                <Fontisto name="arrow-left" size={20} color="#fff" />
                                <Text style={styles.submitText}>Previous</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleNextTab('family')} style={{ width: '45%', backgroundColor: '#c9170a', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 6, paddingVertical: 10, marginVertical: 15 }}>
                                <Text style={styles.submitText}>Next</Text>
                                <Fontisto name="arrow-right" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                }
                {activeTab === 'family' &&
                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.cardBox}>
                            {/* Father's Name Input */}
                            <FloatingLabelInput
                                label="Father's Name"
                                value={fatherName}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setFatherName(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Father's Photo Input */}
                            <Text style={[styles.label, (fathers_photo !== 'Select Image') && styles.focusedLabel]}>Father's Photo</Text>
                            <TouchableOpacity style={[styles.filePicker, { marginTop: 10 }]} onPress={() => selectParentsImage('father')}>
                                <TextInput
                                    style={styles.filePickerText}
                                    editable={false}
                                    placeholder={fathers_photo}
                                    placeholderTextColor={'#4d6285'}
                                />
                                <View style={styles.chooseBtn}>
                                    <Text style={styles.chooseBtnText}>Choose File</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.cardBox}>
                            {/* Mother's Name Input */}
                            <FloatingLabelInput
                                label="Mother's Name"
                                value={motherName}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setMotherName(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Mother's Photo Input */}
                            <Text style={[styles.label, (mothers_photo !== 'Select Image') && styles.focusedLabel]}>Mother's Photo</Text>
                            <TouchableOpacity style={[styles.filePicker, { marginTop: 10 }]} onPress={() => selectParentsImage('mother')}>
                                <TextInput
                                    style={styles.filePickerText}
                                    editable={false}
                                    placeholder={mothers_photo}
                                    placeholderTextColor={'#4d6285'}
                                />
                                <View style={styles.chooseBtn}>
                                    <Text style={styles.chooseBtnText}>Choose File</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.cardBox}>
                            {/* Marrital Status Input */}
                            <Text style={[styles.label, (marrital_status !== null) && styles.focusedLabel]}>Marrital Status</Text>
                            <RadioForm
                                radio_props={maritalStatusOptions}
                                initial={0}
                                formHorizontal={true}
                                labelHorizontal={true}
                                buttonColor={'#56ab2f'}
                                selectedButtonColor={'#56ab2f'}
                                animation={true}
                                onPress={(value) => setMarrital_status(value)}
                                style={{ justifyContent: 'space-around', marginTop: 10, marginBottom: marrital_status === 'married' ? 20 : 0 }}
                            />
                            {marrital_status === 'married' &&
                                <>
                                    {/* Spouse Name Input */}
                                    <FloatingLabelInput
                                        label="Spouse Name"
                                        value={spouseName}
                                        customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                        labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                        onChangeText={value => setSpouseName(value)}
                                        containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                    />
                                    {/* Spouse Photo Input */}
                                    <Text style={[styles.label, (spouse_photo !== 'Select Image') && styles.focusedLabel]}>Spouse Photo</Text>
                                    <TouchableOpacity style={[styles.filePicker, { marginTop: 10 }]} onPress={() => selectParentsImage('spouse')}>
                                        <TextInput
                                            style={styles.filePickerText}
                                            editable={false}
                                            placeholder={spouse_photo}
                                            placeholderTextColor={'#4d6285'}
                                        />
                                        <View style={styles.chooseBtn}>
                                            <Text style={styles.chooseBtnText}>Choose File</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={{color: '#000', fontSize: 17, fontWeight: 'bold', marginBottom: 10}}>Spouse Family Detail's</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ color: '#000', fontSize: 16, marginRight: 20 }}>Is Under community</Text>
                                        <Switch
                                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                                            thumbColor={'#f4f3f4'}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={() => setAddSpouseFamilyDetails(!addSpouseFamilyDetails)}
                                            value={addSpouseFamilyDetails}
                                        />
                                    </View>
                                    {/* {addSpouseFamilyDetails && */}
                                        <>
                                            {/* Spouse Father's Name Input */}
                                            <FloatingLabelInput
                                                label="Spouse Father's Name"
                                                value={spouseFatherName}
                                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                                onChangeText={value => setSpouseFatherName(value)}
                                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                            />
                                            {/* Spouse Father's Photo Input */}
                                            <Text style={[styles.label, (spouseFathers_photo !== 'Select Image') && styles.focusedLabel]}>Spouse Father's Photo</Text>
                                            <TouchableOpacity style={[styles.filePicker, { marginTop: 10 }]} onPress={() => selectParentsImage('spouseFather')}>
                                                <TextInput
                                                    style={styles.filePickerText}
                                                    editable={false}
                                                    placeholder={spouseFathers_photo}
                                                    placeholderTextColor={'#4d6285'}
                                                />
                                                <View style={styles.chooseBtn}>
                                                    <Text style={styles.chooseBtnText}>Choose File</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </>
                                    {/* } */}
                                </>
                            }
                        </View>
                        {marrital_status === 'married' &&
                            childrenFields.map((child, index) => (
                                <View key={index} style={styles.cardBox}>
                                    <View style={{ width: '100%' }}>
                                        <View style={{ width: '100%' }}>
                                            {/* Child Name Input */}
                                            <FloatingLabelInput
                                                label="Child Name"
                                                value={child.name}
                                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                                onChangeText={(text) => {
                                                    const updatedFields = [...childrenFields];
                                                    updatedFields[index].name = text;
                                                    setChildrenFields(updatedFields);
                                                }}
                                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10, width: '100%' }}
                                            />
                                            {/* Child Dob Field */}
                                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                                                <View style={{ width: '45%' }}>
                                                    <Text style={[styles.label, (focusedField === `dob${index}` || child.dob !== null) && styles.focusedLabel]}>Child DOB</Text>
                                                    <TouchableOpacity onPress={openChildDobPicker}>
                                                        <TextInput
                                                            style={{ color: '#000', borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, paddingLeft: 18, borderRadius: 8, borderRadius: 10, marginTop: 10 }}
                                                            value={child.dob ? moment(child.dob).format('DD-MM-YYYY') : ''}
                                                            editable={false}
                                                            placeholder="Child DOB"
                                                            placeholderTextColor={'#4d6285'}
                                                        />
                                                        <AntDesign name="calendar" size={25} color="#353535" style={{ position: 'absolute', right: 20, top: 22 }} />
                                                    </TouchableOpacity>
                                                </View>
                                                {/* Child Gender Dropdown */}
                                                <View style={{ width: '50%' }}>
                                                    <Text style={[styles.label, (focusedField === `gender${index}` || child.gender !== null) && styles.focusedLabel]}>Gender</Text>
                                                    <DropDownPicker
                                                        items={[
                                                            { label: 'Male', value: 'male' },
                                                            { label: 'Female', value: 'female' },
                                                            { label: 'Other', value: 'other' },
                                                        ]}
                                                        placeholder='Child Gender'
                                                        placeholderStyle={{ color: '#4d6285' }}
                                                        open={focusedField === `gender${index}`}
                                                        value={child.gender}
                                                        setOpen={() => setFocusedField(focusedField === `gender${index}` ? null : `gender${index}`)}
                                                        setValue={(callback) => {
                                                            const updatedFields = [...childrenFields];
                                                            updatedFields[index].gender = callback(child.gender);
                                                            setChildrenFields(updatedFields);
                                                        }}
                                                        containerStyle={{ width: '100%', marginTop: 10 }}
                                                        dropDownContainerStyle={{ backgroundColor: '#fafafa' }}
                                                    />
                                                </View>
                                            </View>
                                            <Modal
                                                animationType="slide"
                                                transparent={true}
                                                visible={isChildDobOpen}
                                                onRequestClose={closeChildDobPicker}
                                            >
                                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                                    <View style={{ width: '90%', padding: 20, backgroundColor: 'white', borderRadius: 10, elevation: 5 }}>
                                                        <Calendar
                                                            onDayPress={(day) => {
                                                                const updatedFields = [...childrenFields];
                                                                updatedFields[index].dob = day.dateString;
                                                                setChildrenFields(updatedFields);
                                                                closeChildDobPicker();
                                                            }}
                                                            markedDates={{
                                                                [moment(child.dob).format('YYYY-MM-DD')]: {
                                                                    selected: true,
                                                                    marked: true,
                                                                    selectedColor: 'blue'
                                                                }
                                                            }}
                                                        />
                                                    </View>
                                                </View>
                                            </Modal>
                                            {/* Child Image Picker */}
                                            <Text style={[styles.label, child.image !== 'Select Image' && styles.focusedLabel]}>Child Image</Text>
                                            <TouchableOpacity style={[styles.filePicker, { marginTop: 10 }]} onPress={() => selectChildrenImage(index)}>
                                                <TextInput
                                                    style={styles.filePickerText}
                                                    editable={false}
                                                    placeholder={child.image}
                                                    placeholderTextColor={'#4d6285'}
                                                />
                                                <View style={styles.chooseBtn}>
                                                    <Text style={styles.chooseBtnText}>Choose File</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                            {index === childrenFields.length - 1 &&
                                                <TouchableOpacity style={{ marginRight: 20 }} onPress={() => setChildrenFields([...childrenFields, { name: '', image: 'Select Image' }])}>
                                                    <AntDesign name="plussquare" color="#016a59" size={40} />
                                                </TouchableOpacity>
                                            }
                                            {index > 0 &&
                                                <TouchableOpacity onPress={() => setChildrenFields(childrenFields.filter((_, i) => i !== index))}>
                                                    <AntDesign name="minussquare" color="#c41414" size={40} />
                                                </TouchableOpacity>
                                            }
                                        </View>
                                    </View>
                                </View>
                            ))
                        }
                        {/* Submit Button */}
                        <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                            <TouchableOpacity onPress={() => handleNextTab('personal')} style={{ width: '45%', backgroundColor: '#208a20', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 6, paddingVertical: 10, marginVertical: 15 }}>
                                <Fontisto name="arrow-left" size={20} color="#fff" />
                                <Text style={styles.submitText}>Previous</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleNextTab('address')} style={{ width: '45%', backgroundColor: '#c9170a', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 6, paddingVertical: 10, marginVertical: 15 }}>
                                <Text style={styles.submitText}>Next</Text>
                                <Fontisto name="arrow-right" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                }
                {activeTab === 'address' &&
                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.cardBox}>
                            {/* Present Address Input */}
                            <FloatingLabelInput
                                label="Present Address"
                                value={present_address}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setPresent_address(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Present Landmark Input */}
                            <FloatingLabelInput
                                label="Present Landmark"
                                value={present_landmark}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setPresent_landmark(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Present Post Input */}
                            <FloatingLabelInput
                                label="Present Post"
                                value={present_post}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setPresent_post(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Present District Input */}
                            <FloatingLabelInput
                                label="Present District"
                                value={present_district}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setPresent_district(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Present State Input */}
                            <FloatingLabelInput
                                label="Present State"
                                value={present_state}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setPresent_state(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Present Pincode Input */}
                            <FloatingLabelInput
                                label="Present Pincode"
                                value={present_pincode}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                keyboardType="numeric"
                                onChangeText={value => setPresent_pincode(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Present Country Input */}
                            <FloatingLabelInput
                                label="Present Country"
                                value={present_country}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setPresent_country(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                        </View>
                        {/* Is Permanent Same As Present Address */}
                        <View style={{ width: '90%', alignSelf: 'center' }}>
                            <Text style={{ color: '#757473', fontSize: 16 }}>Is permanent address is same as present address?</Text>
                            <View style={{ width: '50%', marginTop: 10 }}>
                                <RadioForm
                                    radio_props={[{ label: 'Yes', value: true }, { label: 'No', value: false }]}
                                    initial={isPermanentSameAsPresent ? 0 : 1}
                                    formHorizontal={true}
                                    labelHorizontal={true}
                                    buttonColor={'#56ab2f'}
                                    selectedButtonColor={'#56ab2f'}
                                    animation={true}
                                    onPress={(value) => setIsPermanentSameAsPresent(value)}
                                    style={{ justifyContent: 'space-between' }}
                                />
                            </View>
                        </View>
                        {!isPermanentSameAsPresent &&
                            <View style={[styles.cardBox, { marginTop: 10 }]}>
                                {/* Permanent Address Input */}
                                <FloatingLabelInput
                                    label="Permanent Address"
                                    value={permanent_address}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setPermanent_address(value)}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {/* Permanent Landmark Input */}
                                <FloatingLabelInput
                                    label="Permanent Landmark"
                                    value={permanent_landmark}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setPermanent_landmark(value)}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {/* Permanent Post Input */}
                                <FloatingLabelInput
                                    label="Permanent Post"
                                    value={permanent_post}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setPermanent_post(value)}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {/* Permanent District Input */}
                                <FloatingLabelInput
                                    label="Permanent District"
                                    value={permanent_district}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setPermanent_district(value)}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {/* Permanent State Input */}
                                <FloatingLabelInput
                                    label="Permanent State"
                                    value={permanent_state}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setPermanent_state(value)}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {/* Permanent Pincode Input */}
                                <FloatingLabelInput
                                    label="Permanent Pincode"
                                    value={permanent_pincode}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    keyboardType="numeric"
                                    onChangeText={value => setPermanent_pincode(value)}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {/* Permanent Country Input */}
                                <FloatingLabelInput
                                    label="Permanent Country"
                                    value={permanent_country}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setPermanent_country(value)}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                            </View>
                        }
                        {/* Submit Button */}
                        <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                            <TouchableOpacity onPress={() => handleNextTab('family')} style={{ width: '45%', backgroundColor: '#208a20', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 6, paddingVertical: 10, marginVertical: 15 }}>
                                <Fontisto name="arrow-left" size={20} color="#fff" />
                                <Text style={styles.submitText}>Previous</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleNextTab('bank')} style={{ width: '45%', backgroundColor: '#c9170a', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 6, paddingVertical: 10, marginVertical: 15 }}>
                                <Text style={styles.submitText}>Next</Text>
                                <Fontisto name="arrow-right" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                }
                {activeTab === 'bank' &&
                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.cardBox}>
                            {/* Bank Name Input */}
                            <FloatingLabelInput
                                label="Bank Name"
                                value={bankName}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setBankName(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Bank Branch Input */}
                            <FloatingLabelInput
                                label="Bank Branch"
                                value={branchName}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setBranchName(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Bank Account Number Input */}
                            <FloatingLabelInput
                                label="Bank Account Number"
                                value={accountNumber}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                keyboardType="numeric"
                                onChangeText={value => setAccountNumber(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* IFSC Code Input */}
                            <FloatingLabelInput
                                label="IFSC Code"
                                value={ifscCode}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setIfscCode(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Account Holder Name Input  */}
                            <FloatingLabelInput
                                label="Account Holder Name"
                                value={accountHolderName}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setAccountHolderName(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* UPI Input */}
                            <FloatingLabelInput
                                label="UPI"
                                value={upi}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setUpi(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                        </View>
                        {/* Submit Button */}
                        <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                            <TouchableOpacity onPress={() => handleNextTab('address')} style={{ width: '45%', backgroundColor: '#208a20', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 6, paddingVertical: 10, marginVertical: 15 }}>
                                <Fontisto name="arrow-left" size={20} color="#fff" />
                                <Text style={styles.submitText}>Previous</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleNextTab('social')} style={{ width: '45%', backgroundColor: '#c9170a', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 6, paddingVertical: 10, marginVertical: 15 }}>
                                <Text style={styles.submitText}>Next</Text>
                                <Fontisto name="arrow-right" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                }
                {activeTab === 'social' &&
                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.cardBox}>
                            {/* Facebook URL Input */}
                            <FloatingLabelInput
                                label="Facebook URL"
                                value={facebook_url}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setFacebook_url(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Twitter URL Input */}
                            <FloatingLabelInput
                                label="Twitter URL"
                                value={twitter_url}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setTwitter_url(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Instagram URL Input */}
                            <FloatingLabelInput
                                label="Instagram URL"
                                value={instagram_url}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setInstagram_url(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* LinkedIn URL Input */}
                            <FloatingLabelInput
                                label="LinkedIn URL"
                                value={linkedin_url}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setLinkedin_url(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {/* Youtube URL Input */}
                            <FloatingLabelInput
                                label="Youtube URL"
                                value={youtube_url}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setYoutube_url(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                        </View>
                        {/* Submit Button */}
                        <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                            <TouchableOpacity onPress={() => handleNextTab('bank')} style={{ width: '45%', backgroundColor: '#208a20', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 6, paddingVertical: 10, marginVertical: 15 }}>
                                <Fontisto name="arrow-left" size={20} color="#fff" />
                                <Text style={styles.submitText}>Previous</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ width: '45%', backgroundColor: '#c9170a', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 6, paddingVertical: 10, marginVertical: 15 }}>
                                <Text style={styles.submitText}>Next</Text>
                                <Fontisto name="arrow-right" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                }
            </View>
        </SafeAreaView>
    );
};

export default Index;

const styles = StyleSheet.create({
    tab: {
        // padding: 15,
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#cfd1cf',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        // padding: 15,
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#c9170a',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#434543',
        marginLeft: 5,
    },
    activeTabText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 5,
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
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    label: {
        color: '#757473',
        fontSize: 16,
    },
    focusedLabel: {
        color: '#56ab2f',
        fontSize: 16,
        fontWeight: '500'
    },
    input: {
        height: 25,
        borderBottomWidth: 0.7,
        borderBottomColor: '#757473',
        marginBottom: 20,
        color: '#000',
    },
    focusedInput: {
        height: 50,
        borderBottomColor: '#56ab2f',
        borderBottomWidth: 1
    },
    submitButton: {
        backgroundColor: '#c9170a',
        width: '60%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 6,
        paddingVertical: 10,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.3,
        // elevation: 3,
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
    datePickerStyle: {
        width: '100%',
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    swiperContainer: {
        // backgroundColor: 'red',
        width: '100%',
        alignSelf: 'center',
        marginBottom: 20,
        overflow: 'hidden', // Ensures child elements respect border radius
        height: 190, // Set height for the Swiper
    },
    dotStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        width: 10,
        height: 10,
        borderRadius: 5,
        margin: 3,
    },
    activeDotStyle: {
        backgroundColor: '#fff',
        width: 20,
        height: 10,
        borderRadius: 5,
        margin: 3,
    },
    sliderImage: {
        width: '100%', // Fill the entire Swiper container
        height: '100%', // Fill the entire Swiper container
        // borderRadius: 10, // Rounded corners
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        elevation: 5,
    },
    modalText: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
