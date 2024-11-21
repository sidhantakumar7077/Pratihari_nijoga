import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList, TextInput, Image, Modal } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
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
const image1 = require('../../assets/images/slideImg1.jpeg');
const image2 = require('../../assets/images/slideImg2.jpeg');
const image3 = require('../../assets/images/slideImg4.jpeg');

const Index = () => {

    const images = [image1, image2, image3];

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
    const [dateOfJoinTempleSeba, setDateOfJoinTempleSeba] = useState('');

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
    const [dateOpen, setDateOpen] = useState(false);
    const [educational_qualification, setEducational_qualification] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [userPhoto_source, setUserPhoto_source] = useState(null);
    const [user_photo, setUser_photo] = useState('Select Image');

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
    const [isSpouseFamilyModal, setIsSpouseFamilyModal] = useState(false);
    const openSpouseFamilyModal = () => setIsSpouseFamilyModal(true);
    const closeSpouseFamilyModal = () => setIsSpouseFamilyModal(false);
    const [isUnderCommunity, setIsUnderCommunity] = useState(false);
    const [spouseName, setSpouseName] = useState('');
    const [spousePhoto_source, setSpousePhoto_source] = useState(null);
    const [spouse_photo, setSpouse_photo] = useState('Select Image');
    const [childrenFields, setChildrenFields] = useState([
        { name: '', dob: null, gender: null, image: 'Select Image' },
    ]);
    const [childrenDOBOpen, setChildrenDOBOpen] = useState(false);

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
            <View style={{ height: 50, marginBottom: 15 }}>
                <FlatList
                    ref={flatListRef}
                    data={tabs}
                    keyExtractor={(item) => item.key}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {tabs.findIndex(tab => tab.key === item.key) !== 0 && (
                                <View style={{ width: 50, height: 3, backgroundColor: activeTab === item.key || tabs.findIndex(tab => tab.key === item.key) < tabs.findIndex(tab => tab.key === activeTab) ? '#c9170a' : '#919090' }} />
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
                    <View style={styles.cardBox}>
                        <ScrollView style={{ flex: 1 }}>
                            {/* Mobile Number Input */}
                            <Text style={[styles.label, (isFocused === 'mobileNumber' || mobileNumber !== '') && styles.focusedLabel]}>Mobile Number</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'mobileNumber' || mobileNumber !== '') && styles.focusedInput]}
                                value={mobileNumber}
                                onChangeText={(text) => setMobileNumber(text)}
                                onFocus={() => setIsFocused('mobileNumber')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Email Id Input */}
                            <Text style={[styles.label, (isFocused === 'emailId' || emailId !== '') && styles.focusedLabel]}>Email Id</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'emailId' || emailId !== '') && styles.focusedInput]}
                                value={emailId}
                                onChangeText={(text) => setEmailId(text)}
                                onFocus={() => setIsFocused('emailId')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Health Card Number Input */}
                            <Text style={[styles.label, (isFocused === 'helthCardNumber' || helthCardNumber !== '') && styles.focusedLabel]}>Health Card Number</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'helthCardNumber' || helthCardNumber !== '') && styles.focusedInput]}
                                value={helthCardNumber}
                                onChangeText={(text) => setHelthCardNumber(text)}
                                onFocus={() => setIsFocused('helthCardNumber')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Temple Id Input */}
                            <Text style={[styles.label, (isFocused === 'templeId' || templeId !== '') && styles.focusedLabel]}>Temple Id</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'templeId' || templeId !== '') && styles.focusedInput]}
                                value={templeId}
                                onChangeText={(text) => setTempleId(text)}
                                onFocus={() => setIsFocused('templeId')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Date Of Join Temple Seba Input */}
                            <Text style={[styles.label, (isFocused === 'dateOfJoinTempleSeba' || dateOfJoinTempleSeba !== '') && styles.focusedLabel]}>Date Of Join Temple Seba</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'dateOfJoinTempleSeba' || dateOfJoinTempleSeba !== '') && styles.focusedInput]}
                                value={dateOfJoinTempleSeba}
                                onChangeText={(text) => setDateOfJoinTempleSeba(text)}
                                onFocus={() => setIsFocused('dateOfJoinTempleSeba')}
                                onBlur={() => setIsFocused(null)}
                            />
                        </ScrollView>
                        {/* Submit Button */}
                        <TouchableOpacity onPress={() => handleNextTab('id_card')}>
                            <LinearGradient colors={['#c9170a', '#f0837f']} style={styles.submitButton}>
                                <Text style={styles.submitText}>Next</Text>
                                <Fontisto name="arrow-right" size={20} color="#fff" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
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
                                    <View style={{ width: '30%', flexDirection: 'row', marginBottom: 8 }}>
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
                                <Text style={[styles.label, (focusedField === `idProofNumber${index}` || field.idProofNumber !== '') && styles.focusedLabel]}>ID Proof Number</Text>
                                <TextInput
                                    style={[styles.input, (focusedField === `idProofNumber${index}` || field.idProofNumber !== '') && styles.focusedInput]}
                                    value={field.idProofNumber}
                                    onChangeText={(text) => {
                                        const updatedFields = [...fields];
                                        updatedFields[index].idProofNumber = text;
                                        setFields(updatedFields);
                                    }}
                                    onFocus={() => setFocusedField(`idProofNumber${index}`)}
                                    onBlur={() => setFocusedField(null)}
                                />

                                {/* ID Proof Image Picker */}
                                <Text style={[styles.label, field.idProofImage !== 'Select Image' && styles.focusedLabel]}>ID Proof Image</Text>
                                <TouchableOpacity style={[styles.filePicker, { marginTop: 5 }]} onPress={() => selectIdProofImage(index)}>
                                    <TextInput
                                        style={{ width: '70%', color: '#000' }}
                                        editable={false}
                                        value={field.idProofImage}
                                        placeholderTextColor="#000"
                                    />
                                    <View style={styles.chooseBtn}>
                                        <Text style={styles.chooseBtnText}>Choose File</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                        {/* Submit Button */}
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => handleNextTab('Official')} style={{ width: '49%' }}>
                                <LinearGradient colors={['#208a20', '#95de95']} style={styles.submitButton}>
                                    <Fontisto name="arrow-left" size={20} color="#fff" />
                                    <Text style={styles.submitText}>Previous</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleNextTab('personal')} style={{ width: '49%' }}>
                                <LinearGradient colors={['#c9170a', '#f0837f']} style={styles.submitButton}>
                                    <Text style={styles.submitText}>Next</Text>
                                    <Fontisto name="arrow-right" size={20} color="#fff" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                }
                {activeTab === 'personal' &&
                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.cardBox}>
                            {/* First Name Input */}
                            <Text style={[styles.label, (isFocused === 'firstName' || firstName !== '') && styles.focusedLabel]}>First Name</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'firstName' || firstName !== '') && styles.focusedInput]}
                                value={firstName}
                                onChangeText={(text) => setFirstName(text)}
                                onFocus={() => setIsFocused('firstName')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Last Name Input */}
                            <Text style={[styles.label, (isFocused === 'lastName' || lastName !== '') && styles.focusedLabel]}>Last Name</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'lastName' || lastName !== '') && styles.focusedInput]}
                                value={lastName}
                                onChangeText={(text) => setLastName(text)}
                                onFocus={() => setIsFocused('lastName')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Date Of Birth Input */}
                            <Text style={[styles.label, (dob !== null) && styles.focusedLabel]}>DOB</Text>
                            <TouchableOpacity onPress={() => setDateOpen(true)} style={[styles.datePickerStyle, (dob !== null) && { marginTop: 14 }]}>
                                <Text style={{ color: '#000', width: '90%' }}>{dob ? moment(dob).format("DD/MM/YYYY") : null}</Text>
                                <Fontisto name="date" size={dob !== null ? 22 : 19} color={dob !== null ? '#56ab2f' : "#161c19"} />
                            </TouchableOpacity>
                            <View style={{ backgroundColor: dob !== null ? '#56ab2f' : '#757473', width: '100%', height: dob !== null ? 2 : 0.7, marginBottom: 30 }} />
                            <View>
                                <DatePicker
                                    modal
                                    mode="date"
                                    open={dateOpen}
                                    date={dob || new Date()}
                                    onConfirm={(data) => {
                                        setDateOpen(false)
                                        setDob(data)
                                    }}
                                    onCancel={() => {
                                        setDateOpen(false);
                                    }}
                                />
                            </View>
                            {/* Educational Qualification Input */}
                            <Text style={[styles.label, (isFocused === 'educational_qualification' || educational_qualification !== '') && styles.focusedLabel]}>Educational Qualification</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'educational_qualification' || educational_qualification !== '') && styles.focusedInput]}
                                value={educational_qualification}
                                onChangeText={(text) => setEducational_qualification(text)}
                                onFocus={() => setIsFocused('educational_qualification')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Blood Group Input */}
                            <Text style={[styles.label, (isFocused === 'bloodGroup' || bloodGroup !== '') && styles.focusedLabel]}>Blood Group</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'bloodGroup' || bloodGroup !== '') && styles.focusedInput]}
                                value={bloodGroup}
                                onChangeText={(text) => setBloodGroup(text)}
                                onFocus={() => setIsFocused('bloodGroup')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* User Photo Input */}
                            <Text style={[styles.label, (user_photo !== 'Select Image') && styles.focusedLabel]}>User Photo</Text>
                            <TouchableOpacity style={[styles.filePicker, { marginTop: 10 }]} onPress={selectUserPhoto}>
                                <TextInput
                                    style={styles.filePickerText}
                                    editable={false}
                                    placeholder={user_photo}
                                    placeholderTextColor={'#000'}
                                />
                                <View style={styles.chooseBtn}>
                                    <Text style={styles.chooseBtnText}>Choose File</Text>
                                </View>
                            </TouchableOpacity>
                            {/* Add more For Language Entry */}
                            <Text style={[styles.label, { marginTop: 20 }]}>Languages</Text>
                            {languages.map((language, index) => (
                                <View key={index} style={{ width: '100%' }}>
                                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        {/* Language Input */}
                                        <TextInput
                                            style={[styles.input, { width: '40%', marginRight: 10, height: 40 }, (isFocused === `language${index}` || language.lang !== '') && styles.focusedInput]}
                                            value={language.lang}
                                            onChangeText={(text) => {
                                                const updatedFields = [...languages];
                                                updatedFields[index].lang = text;
                                                setLanguages(updatedFields);
                                            }}
                                            placeholder="Language"
                                            placeholderTextColor={'#6b6b6b'}
                                        />
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
                                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                        {index === languages.length - 1 &&
                                            <TouchableOpacity style={{ marginRight: 20 }} onPress={() => setLanguages([...languages, { lang: '', read: null, write: null, speak: null }])}>
                                                <AntDesign name="plussquare" color="#016a59" size={40} />
                                            </TouchableOpacity>
                                        }
                                        {index > 0 &&
                                            <TouchableOpacity onPress={() => setLanguages(languages.filter((_, i) => i !== index))}>
                                                <AntDesign name="minussquare" color="#c41414" size={40} />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                            ))}
                        </View>
                        {/* Submit Button */}
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ width: '49%' }} onPress={() => handleNextTab('id_card')}>
                                <LinearGradient colors={['#208a20', '#95de95']} style={styles.submitButton}>
                                    <Fontisto name="arrow-left" size={20} color="#fff" />
                                    <Text style={styles.submitText}>Previous</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: '49%' }} onPress={() => handleNextTab('family')}>
                                <LinearGradient colors={['#c9170a', '#f0837f']} style={styles.submitButton}>
                                    <Text style={styles.submitText}>Next</Text>
                                    <Fontisto name="arrow-right" size={20} color="#fff" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                }
                {activeTab === 'family' &&
                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.cardBox}>
                            {/* Father's Name Input */}
                            <Text style={[styles.label, (isFocused === 'fatherName' || fatherName !== '') && styles.focusedLabel]}>Father's Name</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'fatherName' || fatherName !== '') && styles.focusedInput]}
                                value={fatherName}
                                onChangeText={(text) => setFatherName(text)}
                                onFocus={() => setIsFocused('fatherName')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Father's Photo Input */}
                            <Text style={[styles.label, (fathers_photo !== 'Select Image') && styles.focusedLabel]}>Father's Photo</Text>
                            <TouchableOpacity style={[styles.filePicker, { marginTop: 10 }]} onPress={() => selectParentsImage('father')}>
                                <TextInput
                                    style={styles.filePickerText}
                                    editable={false}
                                    placeholder={fathers_photo}
                                    placeholderTextColor={'#000'}
                                />
                                <View style={styles.chooseBtn}>
                                    <Text style={styles.chooseBtnText}>Choose File</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.cardBox}>
                            {/* Mother's Name Input */}
                            <Text style={[styles.label, (isFocused === 'motherName' || motherName !== '') && styles.focusedLabel]}>Mother's Name</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'motherName' || motherName !== '') && styles.focusedInput]}
                                value={motherName}
                                onChangeText={(text) => setMotherName(text)}
                                onFocus={() => setIsFocused('motherName')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Mother's Photo Input */}
                            <Text style={[styles.label, (mothers_photo !== 'Select Image') && styles.focusedLabel]}>Mother's Photo</Text>
                            <TouchableOpacity style={[styles.filePicker, { marginTop: 10 }]} onPress={() => selectParentsImage('mother')}>
                                <TextInput
                                    style={styles.filePickerText}
                                    editable={false}
                                    placeholder={mothers_photo}
                                    placeholderTextColor={'#000'}
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
                                initial={-1}
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
                                    <Text style={[styles.label, (isFocused === 'spouseName' || spouseName !== '') && styles.focusedLabel]}>Spouse Name</Text>
                                    <TextInput
                                        style={[styles.input, (isFocused === 'spouseName' || spouseName !== '') && styles.focusedInput]}
                                        value={spouseName}
                                        onChangeText={(text) => setSpouseName(text)}
                                        onFocus={() => setIsFocused('spouseName')}
                                        onBlur={() => setIsFocused(null)}
                                    />
                                    {/* Spouse Photo Input */}
                                    <Text style={[styles.label, (spouse_photo !== 'Select Image') && styles.focusedLabel]}>Spouse Photo</Text>
                                    <TouchableOpacity style={[styles.filePicker, { marginTop: 10 }]} onPress={() => selectParentsImage('spouse')}>
                                        <TextInput
                                            style={styles.filePickerText}
                                            editable={false}
                                            placeholder={spouse_photo}
                                            placeholderTextColor={'#000'}
                                        />
                                        <View style={styles.chooseBtn}>
                                            <Text style={styles.chooseBtnText}>Choose File</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={openSpouseFamilyModal} style={{ paddingHorizontal: 20, paddingVertical: 10, alignSelf: 'flex-end', backgroundColor: '#c9170a', borderRadius: 5 }}>
                                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>Family Details</Text>
                                    </TouchableOpacity>
                                    <Modal
                                        animationType="slide"
                                        transparent={true}
                                        visible={isSpouseFamilyModal}
                                        onRequestClose={closeSpouseFamilyModal}
                                    >
                                        <View style={styles.centeredView}>
                                            <View style={styles.modalView}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                                                    <Text style={styles.modalText}>Spouse Family Details</Text>
                                                    <Fontisto name="close-a" size={18} color="#000" onPress={closeSpouseFamilyModal} />
                                                </View>
                                                <View style={{ width: '100%' }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                                        <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', marginBottom: 5 }}>Is Under Community</Text>
                                                        <CheckBox
                                                            disabled={false}
                                                            value={isUnderCommunity}
                                                            onValueChange={(newValue) => setIsUnderCommunity(newValue)}
                                                            tintColors={{ true: '#56ab2f', false: '#757473' }}
                                                        />
                                                    </View>
                                                    {isUnderCommunity ?
                                                        <View style={{ width: '100%', borderWidth: 0.5, borderColor: '#000', padding: 10, borderRadius: 10 }}>
                                                            {/* Father's Name Input */}
                                                            <Text style={[styles.label, (isFocused === 'fatherName' || fatherName !== '') && styles.focusedLabel]}>Father's Name</Text>
                                                            <TextInput
                                                                style={[styles.input, (isFocused === 'fatherName' || fatherName !== '') && styles.focusedInput]}
                                                                value={fatherName}
                                                                onChangeText={(text) => setFatherName(text)}
                                                                onFocus={() => setIsFocused('fatherName')}
                                                                onBlur={() => setIsFocused(null)}
                                                            />
                                                            {/* Father's Photo Input */}
                                                            <Text style={[styles.label, (fathers_photo !== 'Select Image') && styles.focusedLabel]}>Father's Photo</Text>
                                                            <TouchableOpacity style={[styles.filePicker, { marginTop: 10 }]} onPress={() => selectParentsImage('father')}>
                                                                <TextInput
                                                                    style={styles.filePickerText}
                                                                    editable={false}
                                                                    placeholder={fathers_photo}
                                                                    placeholderTextColor={'#000'}
                                                                />
                                                                <View style={styles.chooseBtn}>
                                                                    <Text style={styles.chooseBtnText}>Choose File</Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                        :
                                                        <View style={{ width: '100%', borderWidth: 0.5, borderColor: '#000', padding: 10, borderRadius: 10 }}>
                                                            {/* Father's Name Input */}
                                                            <Text style={[styles.label, (isFocused === 'fatherName' || fatherName !== '') && styles.focusedLabel]}>Father's Name</Text>
                                                            <TextInput
                                                                style={[styles.input, (isFocused === 'fatherName' || fatherName !== '') && styles.focusedInput]}
                                                                value={fatherName}
                                                                onChangeText={(text) => setFatherName(text)}
                                                                onFocus={() => setIsFocused('fatherName')}
                                                                onBlur={() => setIsFocused(null)}
                                                            />
                                                            {/* Father's Photo Input */}
                                                            <Text style={[styles.label, (fathers_photo !== 'Select Image') && styles.focusedLabel]}>Father's Photo</Text>
                                                            <TouchableOpacity style={[styles.filePicker, { marginTop: 10 }]} onPress={() => selectParentsImage('father')}>
                                                                <TextInput
                                                                    style={styles.filePickerText}
                                                                    editable={false}
                                                                    placeholder={fathers_photo}
                                                                    placeholderTextColor={'#000'}
                                                                />
                                                                <View style={styles.chooseBtn}>
                                                                    <Text style={styles.chooseBtnText}>Choose File</Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                    </Modal>
                                </>
                            }
                        </View>
                        {marrital_status === 'married' &&
                            <View style={styles.cardBox}>
                                {/* Children Fields */}
                                {childrenFields.map((child, index) => (
                                    <View key={index} style={{ width: '100%', marginBottom: 20 }}>
                                        {/* Child Name Input */}
                                        <Text style={[styles.label, (isFocused === `childName${index}` || child.name !== '') && styles.focusedLabel]}>Child Name</Text>
                                        <TextInput
                                            style={[styles.input, (isFocused === `childName${index}` || child.name !== '') && styles.focusedInput]}
                                            value={child.name}
                                            onChangeText={(text) => {
                                                const updatedFields = [...childrenFields];
                                                updatedFields[index].name = text;
                                                setChildrenFields(updatedFields);
                                            }}
                                            onFocus={() => setIsFocused(`childName${index}`)}
                                            onBlur={() => setIsFocused(null)}
                                        />
                                        {/* Child DOB Input */}
                                        <Text style={[styles.label, (child.dob !== null) && styles.focusedLabel]}>Child DOB</Text>
                                        <TouchableOpacity onPress={() => setChildrenDOBOpen(index)} style={[styles.datePickerStyle, (child.dob !== null) && { marginTop: 14 }]}>
                                            <Text style={{ color: '#000', width: '90%' }}>{child.dob ? moment(child.dob).format("DD/MM/YYYY") : null}</Text>
                                            <Fontisto name="date" size={child.dob !== null ? 22 : 19} color={child.dob !== null ? '#56ab2f' : "#161c19"} />
                                        </TouchableOpacity>
                                        <View style={{ backgroundColor: child.dob !== null ? '#56ab2f' : '#757473', width: '100%', height: child.dob !== null ? 2 : 0.7, marginBottom: 20 }} />
                                        <View>
                                            <DatePicker
                                                modal
                                                mode="date"
                                                open={childrenDOBOpen === index}
                                                date={child.dob || new Date()}
                                                onConfirm={(data) => {
                                                    const updatedFields = [...childrenFields];
                                                    updatedFields[index].dob = data;
                                                    setChildrenFields(updatedFields);
                                                    setChildrenDOBOpen(false);
                                                }}
                                                onCancel={() => {
                                                    setChildrenDOBOpen(false);
                                                }}
                                            />
                                        </View>
                                        {/* Select Child Gender */}
                                        <Text style={[styles.label, (isFocused === `gender${index}` || child.gender !== null) && styles.focusedLabel]}>Select Child</Text>
                                        <DropDownPicker
                                            items={[
                                                { label: 'Male', value: 'male' },
                                                { label: 'Female', value: 'female' },
                                                { label: 'Other', value: 'other' },
                                            ]}
                                            open={isFocused === `gender${index}`}
                                            value={child.gender}
                                            setOpen={() => setIsFocused(isFocused === `gender${index}` ? null : `gender${index}`)}
                                            setValue={(callback) => {
                                                const updatedFields = [...childrenFields];
                                                updatedFields[index].gender = callback(child.gender);
                                                setChildrenFields(updatedFields);
                                            }}
                                            containerStyle={{ marginTop: 10, marginBottom: 20, width: '100%' }}
                                            style={[styles.input, (isFocused === `gender${index}` || null) && styles.focusedInput]}
                                            dropDownContainerStyle={{ backgroundColor: '#fafafa' }}
                                        />
                                        {/* Child Image Picker */}
                                        <Text style={[styles.label, child.image !== 'Select Image' && styles.focusedLabel]}>Child Image</Text>
                                        <TouchableOpacity style={[styles.filePicker, { marginTop: 5 }]} onPress={() => selectChildrenImage(index)}>
                                            <TextInput
                                                style={{ width: '70%', color: '#000' }}
                                                editable={false}
                                                value={child.image}
                                                placeholderTextColor="#000"
                                            />
                                            <View style={styles.chooseBtn}>
                                                <Text style={styles.chooseBtnText}>Choose File</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                {/* Add More Child Button */}
                                <TouchableOpacity style={styles.addButton} onPress={() => setChildrenFields([...childrenFields, { name: '', dob: null }])}>
                                    <AntDesign name="plussquare" color="#016a59" size={40} />
                                </TouchableOpacity>
                            </View>
                        }
                        {/* Submit Button */}
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ width: '49%' }} onPress={() => handleNextTab('personal')}>
                                <LinearGradient colors={['#208a20', '#95de95']} style={styles.submitButton}>
                                    <Fontisto name="arrow-left" size={20} color="#fff" />
                                    <Text style={styles.submitText}>Previous</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: '49%' }} onPress={() => handleNextTab('address')}>
                                <LinearGradient colors={['#c9170a', '#f0837f']} style={styles.submitButton}>
                                    <Text style={styles.submitText}>Next</Text>
                                    <Fontisto name="arrow-right" size={20} color="#fff" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                }
                {activeTab === 'address' &&
                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.cardBox}>
                            {/* Present Address Input */}
                            <Text style={[styles.label, (isFocused === 'present_address' || present_address !== '') && styles.focusedLabel]}>Present Address</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'present_address' || present_address !== '') && styles.focusedInput]}
                                value={present_address}
                                onChangeText={(text) => setPresent_address(text)}
                                onFocus={() => setIsFocused('present_address')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Present Landmark Input */}
                            <Text style={[styles.label, (isFocused === 'present_landmark' || present_landmark !== '') && styles.focusedLabel]}>Present Landmark</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'present_landmark' || present_landmark !== '') && styles.focusedInput]}
                                value={present_landmark}
                                onChangeText={(text) => setPresent_landmark(text)}
                                onFocus={() => setIsFocused('present_landmark')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Present Post Input */}
                            <Text style={[styles.label, (isFocused === 'present_post' || present_post !== '') && styles.focusedLabel]}>Present Post</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'present_post' || present_post !== '') && styles.focusedInput]}
                                value={present_post}
                                onChangeText={(text) => setPresent_post(text)}
                                onFocus={() => setIsFocused('present_post')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Present District Input */}
                            <Text style={[styles.label, (isFocused === 'present_district' || present_district !== '') && styles.focusedLabel]}>Present District</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'present_district' || present_district !== '') && styles.focusedInput]}
                                value={present_district}
                                onChangeText={(text) => setPresent_district(text)}
                                onFocus={() => setIsFocused('present_district')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Present State Input */}
                            <Text style={[styles.label, (isFocused === 'present_state' || present_state !== '') && styles.focusedLabel]}>Present State</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'present_state' || present_state !== '') && styles.focusedInput]}
                                value={present_state}
                                onChangeText={(text) => setPresent_state(text)}
                                onFocus={() => setIsFocused('present_state')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Present Pincode Input */}
                            <Text style={[styles.label, (isFocused === 'present_pincode' || present_pincode !== '') && styles.focusedLabel]}>Present Pincode</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'present_pincode' || present_pincode !== '') && styles.focusedInput]}
                                value={present_pincode}
                                onChangeText={(text) => setPresent_pincode(text)}
                                onFocus={() => setIsFocused('present_pincode')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Present Country Input */}
                            <Text style={[styles.label, (isFocused === 'present_country' || present_country !== '') && styles.focusedLabel]}>Present Country</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'present_country' || present_country !== '') && styles.focusedInput]}
                                value={present_country}
                                onChangeText={(text) => setPresent_country(text)}
                                onFocus={() => setIsFocused('present_country')}
                                onBlur={() => setIsFocused(null)}
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
                            <View style={styles.cardBox}>
                                {/* Permanent Address Input */}
                                <Text style={[styles.label, (isFocused === 'permanent_address' || permanent_address !== '') && styles.focusedLabel]}>Permanent Address</Text>
                                <TextInput
                                    style={[styles.input, (isFocused === 'permanent_address' || permanent_address !== '') && styles.focusedInput]}
                                    value={permanent_address}
                                    onChangeText={(text) => setPermanent_address(text)}
                                    onFocus={() => setIsFocused('permanent_address')}
                                    onBlur={() => setIsFocused(null)}
                                />
                                {/* Permanent Landmark Input */}
                                <Text style={[styles.label, (isFocused === 'permanent_landmark' || permanent_landmark !== '') && styles.focusedLabel]}>Permanent Landmark</Text>
                                <TextInput
                                    style={[styles.input, (isFocused === 'permanent_landmark' || permanent_landmark !== '') && styles.focusedInput]}
                                    value={permanent_landmark}
                                    onChangeText={(text) => setPermanent_landmark(text)}
                                    onFocus={() => setIsFocused('permanent_landmark')}
                                    onBlur={() => setIsFocused(null)}
                                />
                                {/* Permanent Post Input */}
                                <Text style={[styles.label, (isFocused === 'permanent_post' || permanent_post !== '') && styles.focusedLabel]}>Permanent Post</Text>
                                <TextInput
                                    style={[styles.input, (isFocused === 'permanent_post' || permanent_post !== '') && styles.focusedInput]}
                                    value={permanent_post}
                                    onChangeText={(text) => setPermanent_post(text)}
                                    onFocus={() => setIsFocused('permanent_post')}
                                    onBlur={() => setIsFocused(null)}
                                />
                                {/* Permanent District Input */}
                                <Text style={[styles.label, (isFocused === 'permanent_district' || permanent_district !== '') && styles.focusedLabel]}>Permanent District</Text>
                                <TextInput
                                    style={[styles.input, (isFocused === 'permanent_district' || permanent_district !== '') && styles.focusedInput]}
                                    value={permanent_district}
                                    onChangeText={(text) => setPermanent_district(text)}
                                    onFocus={() => setIsFocused('permanent_district')}
                                    onBlur={() => setIsFocused(null)}
                                />
                                {/* Permanent State Input */}
                                <Text style={[styles.label, (isFocused === 'permanent_state' || permanent_state !== '') && styles.focusedLabel]}>Permanent State</Text>
                                <TextInput
                                    style={[styles.input, (isFocused === 'permanent_state' || permanent_state !== '') && styles.focusedInput]}
                                    value={permanent_state}
                                    onChangeText={(text) => setPermanent_state(text)}
                                    onFocus={() => setIsFocused('permanent_state')}
                                    onBlur={() => setIsFocused(null)}
                                />
                                {/* Permanent Pincode Input */}
                                <Text style={[styles.label, (isFocused === 'permanent_pincode' || permanent_pincode !== '') && styles.focusedLabel]}>Permanent Pincode</Text>
                                <TextInput
                                    style={[styles.input, (isFocused === 'permanent_pincode' || permanent_pincode !== '') && styles.focusedInput]}
                                    value={permanent_pincode}
                                    onChangeText={(text) => setPermanent_pincode(text)}
                                    onFocus={() => setIsFocused('permanent_pincode')}
                                    onBlur={() => setIsFocused(null)}
                                />
                                {/* Permanent Country Input */}
                                <Text style={[styles.label, (isFocused === 'permanent_country' || permanent_country !== '') && styles.focusedLabel]}>Permanent Country</Text>
                                <TextInput
                                    style={[styles.input, (isFocused === 'permanent_country' || permanent_country !== '') && styles.focusedInput]}
                                    value={permanent_country}
                                    onChangeText={(text) => setPermanent_country(text)}
                                    onFocus={() => setIsFocused('permanent_country')}
                                    onBlur={() => setIsFocused(null)}
                                />
                            </View>
                        }
                        {/* Submit Button */}
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ width: '49%' }} onPress={() => handleNextTab('family')}>
                                <LinearGradient colors={['#208a20', '#95de95']} style={styles.submitButton}>
                                    <Fontisto name="arrow-left" size={20} color="#fff" />
                                    <Text style={styles.submitText}>Previous</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: '49%' }} onPress={() => handleNextTab('bank')}>
                                <LinearGradient colors={['#c9170a', '#f0837f']} style={styles.submitButton}>
                                    <Text style={styles.submitText}>Next</Text>
                                    <Fontisto name="arrow-right" size={20} color="#fff" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                }
                {activeTab === 'bank' &&
                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.cardBox}>
                            {/* Bank Name Input */}
                            <Text style={[styles.label, (isFocused === 'bankName' || bankName !== '') && styles.focusedLabel]}>Bank Name</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'bankName' || bankName !== '') && styles.focusedInput]}
                                value={bankName}
                                keyboardType="default"
                                onChangeText={(text) => setBankName(text)}
                                onFocus={() => setIsFocused('bankName')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Branch Name Input */}
                            <Text style={[styles.label, (isFocused === 'branchName' || branchName !== '') && styles.focusedLabel]}>Branch Name</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'branchName' || branchName !== '') && styles.focusedInput]}
                                value={branchName}
                                keyboardType="default"
                                onChangeText={(text) => setBranchName(text)}
                                onFocus={() => setIsFocused('branchName')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* IFSC Code Input */}
                            <Text style={[styles.label, (isFocused === 'ifscCode' || ifscCode !== '') && styles.focusedLabel]}>IFSC Code</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'ifscCode' || ifscCode !== '') && styles.focusedInput]}
                                value={ifscCode}
                                autoCapitalize='characters'
                                keyboardType='default'
                                onChangeText={(text) => setIfscCode(text)}
                                onFocus={() => setIsFocused('ifscCode')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Account Number Input */}
                            <Text style={[styles.label, (isFocused === 'accountNumber' || accountNumber !== '') && styles.focusedLabel]}>Account Number</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'accountNumber' || accountNumber !== '') && styles.focusedInput]}
                                value={accountNumber}
                                keyboardType='numeric'
                                onChangeText={(text) => setAccountNumber(text)}
                                onFocus={() => setIsFocused('accountNumber')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Account Holder Name Input */}
                            <Text style={[styles.label, (isFocused === 'accountHolderName' || accountHolderName !== '') && styles.focusedLabel]}>Account Holder Name</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'accountHolderName' || accountHolderName !== '') && styles.focusedInput]}
                                value={accountHolderName}
                                keyboardType='default'
                                onChangeText={(text) => setAccountHolderName(text)}
                                onFocus={() => setIsFocused('accountHolderName')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* UPI Input Field */}
                            <Text style={[styles.label, (isFocused === 'upi' || upi !== '') && styles.focusedLabel]}>UPI</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'upi' || upi !== '') && styles.focusedInput]}
                                value={upi}
                                keyboardType='default'
                                autoCapitalize="none"
                                onChangeText={(text) => setUpi(text)}
                                onFocus={() => setIsFocused('upi')}
                                onBlur={() => setIsFocused(null)}
                            />
                        </View>
                        {/* Submit Button */}
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ width: '49%' }} onPress={() => handleNextTab('address')}>
                                <LinearGradient colors={['#208a20', '#95de95']} style={styles.submitButton}>
                                    <Fontisto name="arrow-left" size={20} color="#fff" />
                                    <Text style={styles.submitText}>Previous</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: '49%' }} onPress={() => handleNextTab('social')}>
                                <LinearGradient colors={['#c9170a', '#f0837f']} style={styles.submitButton}>
                                    <Text style={styles.submitText}>Next</Text>
                                    <Fontisto name="arrow-right" size={20} color="#fff" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                }
                {activeTab === 'social' &&
                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.cardBox}>
                            {/* Facebook URL Input */}
                            <Text style={[styles.label, (isFocused === 'facebook_url' || facebook_url !== '') && styles.focusedLabel]}>Facebook URL</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'facebook_url' || facebook_url !== '') && styles.focusedInput]}
                                value={facebook_url}
                                onChangeText={(text) => setFacebook_url(text)}
                                onFocus={() => setIsFocused('facebook_url')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Twitter URL Input */}
                            <Text style={[styles.label, (isFocused === 'twitter_url' || twitter_url !== '') && styles.focusedLabel]}>Twitter URL</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'twitter_url' || twitter_url !== '') && styles.focusedInput]}
                                value={twitter_url}
                                onChangeText={(text) => setTwitter_url(text)}
                                onFocus={() => setIsFocused('twitter_url')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Instagram URL Input */}
                            <Text style={[styles.label, (isFocused === 'instagram_url' || instagram_url !== '') && styles.focusedLabel]}>Instagram URL</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'instagram_url' || instagram_url !== '') && styles.focusedInput]}
                                value={instagram_url}
                                onChangeText={(text) => setInstagram_url(text)}
                                onFocus={() => setIsFocused('instagram_url')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Linkedin URL Input */}
                            <Text style={[styles.label, (isFocused === 'linkedin_url' || linkedin_url !== '') && styles.focusedLabel]}>Linkedin URL</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'linkedin_url' || linkedin_url !== '') && styles.focusedInput]}
                                value={linkedin_url}
                                onChangeText={(text) => setLinkedin_url(text)}
                                onFocus={() => setIsFocused('linkedin_url')}
                                onBlur={() => setIsFocused(null)}
                            />
                            {/* Youtube URL Input */}
                            <Text style={[styles.label, (isFocused === 'youtube_url' || youtube_url !== '') && styles.focusedLabel]}>Youtube URL</Text>
                            <TextInput
                                style={[styles.input, (isFocused === 'youtube_url' || youtube_url !== '') && styles.focusedInput]}
                                value={youtube_url}
                                onChangeText={(text) => setYoutube_url(text)}
                                onFocus={() => setIsFocused('youtube_url')}
                                onBlur={() => setIsFocused(null)}
                            />
                        </View>
                        {/* Submit Button */}
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ width: '49%' }} onPress={() => handleNextTab('bank')}>
                                <LinearGradient colors={['#208a20', '#95de95']} style={styles.submitButton}>
                                    <Fontisto name="arrow-left" size={20} color="#fff" />
                                    <Text style={styles.submitText}>Previous</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: '49%' }} onPress={() => navigation.navigate('Home')}>
                                <LinearGradient colors={['#c9170a', '#f0837f']} style={styles.submitButton}>
                                    <Text style={styles.submitText}>Next</Text>
                                    <Fontisto name="arrow-right" size={20} color="#fff" />
                                </LinearGradient>
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
        padding: 15,
        backgroundColor: '#cfd1cf',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        padding: 15,
        backgroundColor: '#c9170a',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
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
        width: '93%',
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
        marginBottom: 30,
        color: '#000',
    },
    focusedInput: {
        height: 50,
        borderBottomColor: '#56ab2f',
        borderBottomWidth: 2
    },
    submitButton: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 12,
        paddingVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        elevation: 3,
        marginVertical: 10,
    },
    submitText: {
        color: '#fff',
        fontSize: 20,
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
