import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList, TextInput, Image, Modal, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { Calendar } from 'react-native-calendars';
// import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import CheckBox from '@react-native-community/checkbox';
import DropDownPicker from 'react-native-dropdown-picker';
import RadioForm from 'react-native-simple-radio-button';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import Fontisto from 'react-native-vector-icons/Fontisto';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Swiper from 'react-native-swiper';
import { base_url } from '../../../App';

// images
const image1 = require('../../assets/images/slideImg5.jpg');
const image2 = require('../../assets/images/slideImg6.jpg');
const image3 = require('../../assets/images/slideImg7.webp');

const Index = () => {

    const images = [image3, image2, image1];

    const tabs = [
        { key: 'personal', label: 'Personal', icon: 'account' },
        { key: 'family', label: 'Family', icon: 'account-supervisor' },
        { key: 'id_card', label: 'ID Card', icon: 'id-card' },
        { key: 'address', label: 'Address', icon: 'map-marker' },
        { key: 'occupation', label: 'Occupation', icon: 'account-tie' },
        { key: 'seba', label: 'Seba', icon: 'bank' },
        { key: 'social', label: 'Social Media', icon: 'web' },
    ];
    const [activeTab, setActiveTab] = useState('id_card');
    const [isFocused, setIsFocused] = useState(null);
    const navigation = useNavigation();

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

    const saveIdCardDetails = async () => {
        const token = await AsyncStorage.getItem('storeAccesstoken');
        const formData = new FormData();
        fields.forEach((field, index) => {
            formData.append(`id_type[${index}]`, field.idProof);
            formData.append(`id_number[${index}]`, field.idProofNumber);
            if (field.idProofImage) {
                formData.append(`id_photo[${index}]`, {
                    uri: field.idProofImage.uri,
                    type: field.idProofImage.type,
                    name: field.idProofImage.fileName,
                });
            }
        });

        console.log("ID Card Data", formData._parts);
        return;

        try {
            const response = await fetch(base_url + "api/save-idcard", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Accept": "application/json",
                },
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                console.log('ID Card Details saved successfully', data);
                setActiveTab('address');
            } else {
                console.log("Error: ", data.message || 'Failed to save ID Card Details. Please try again.');
            }
        } catch (error) {
            console.error("Network request failed: ", error);
        }
    };

    // Personal Information
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [alias, setAlias] = useState('');
    const [emailId, setEmailId] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [helthCardNumber, setHelthCardNumber] = useState('');
    const [dob, setDob] = useState(null);
    const [isDateOpen, setDateOpen] = useState(false);
    const openDobPicker = () => { setDateOpen(true) };
    const closeDobPicker = () => { setDateOpen(false) };
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
    const [userPhoto_source, setUserPhoto_source] = useState(null);
    const [user_photo, setUser_photo] = useState('Select Image');
    const [dateOfJoinTempleSeba, setDateOfJoinTempleSeba] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isYearPickerVisible, setYearPickerVisible] = useState(false);
    const [dateRemember, setDateRemember] = useState(null);
    const [personalDetailsErrors, setPersonalDetailsErrors] = useState({});
    // Generate a list of years (Last 75 years)
    const years = Array.from({ length: 75 }, (_, i) => new Date().getFullYear() - i);

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

    const validateProfileFields = () => {
        const newErrors = {};

        if (!firstName) newErrors.firstName = 'First Name is required';
        if (!middleName) newErrors.middleName = 'Middle Name is required';
        if (!lastName) newErrors.lastName = 'Last Name is required';
        if (!alias) newErrors.alias = 'Alias is required';

        // Phone Number Validation (10 digits only)
        if (!mobileNumber) {
            newErrors.mobileNumber = 'Mobile Number is required';
        } else if (!/^\d{10}$/.test(mobileNumber)) {
            newErrors.mobileNumber = 'Enter a valid 10-digit Mobile Number';
        }

        if (!whatsappNumber) {
            newErrors.whatsappNumber = 'Whatsapp Number is required';
        } else if (!/^\d{10}$/.test(whatsappNumber)) {
            newErrors.whatsappNumber = 'Enter a valid 10-digit Whatsapp Number';
        }

        if (!dob) newErrors.dob = 'Date of Birth is required';
        if (!bloodGroup) newErrors.bloodGroup = 'Blood Group is required';
        if (!helthCardNumber) newErrors.helthCardNumber = 'Health Card Number is required';
        if (!userPhoto_source) newErrors.userPhoto_source = 'User Photo is required';
        if (!dateOfJoinTempleSeba) newErrors.dateOfJoinTempleSeba = 'Date of Joining Temple Seba is required';

        // Set errors and clear them after 5 seconds
        setPersonalDetailsErrors(newErrors);
        setTimeout(() => setPersonalDetailsErrors({}), 5000);

        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };

    const SavePersonalDetails = async () => {
        if (!validateProfileFields()) return;

        const token = await AsyncStorage.getItem('storeAccesstoken');
        const formData = new FormData();
        formData.append('first_name', firstName);
        formData.append('middle_name', middleName);
        formData.append('last_name', lastName);
        formData.append('alias_name', alias);
        formData.append('email', emailId);
        formData.append('phone_no', mobileNumber);
        formData.append('whatsapp_no', whatsappNumber);
        formData.append('date_of_birth', moment(dob).format('YYYY-MM-DD'));
        formData.append('blood_group', bloodGroup);
        formData.append('healthcard_no', helthCardNumber);
        formData.append('joining_date', moment(dateOfJoinTempleSeba).format('YYYY-MM-DD'));
        if (userPhoto_source) {
            formData.append('user_photo', {
                uri: userPhoto_source.uri,
                type: userPhoto_source.type,
                name: userPhoto_source.fileName,
            });
        }
        // console.log("Profile Data", formData);
        // return;

        try {
            const response = await fetch(base_url + "api/save-profile", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Personal Details saved successfully', data);
                setActiveTab('family');
            } else {
                console.log("Error: ", data.message || 'Failed to save Personal Details. Please try again.');
            }
        } catch (error) {
            console.error("Network request failed: ", error);
            // alert("Network request failed. Please check your internet connection and try again.");
        }
    };

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
    // const [addSpouseFamilyDetails, setAddSpouseFamilyDetails] = useState(false);
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
    const [isChildDobOpen, setIsChildDobOpen] = useState(false);
    const [selectedChildIndex, setSelectedChildIndex] = useState(null);

    const openChildDobPicker = (index) => {
        setSelectedChildIndex(index);
        setIsChildDobOpen(true);
    };

    const closeChildDobPicker = () => {
        setIsChildDobOpen(false);
        setSelectedChildIndex(null);
    };

    const handleChildDobChange = (date) => {
        const updatedChildrenFields = [...childrenFields];
        updatedChildrenFields[selectedChildIndex].dob = date;
        setChildrenFields(updatedChildrenFields);
        closeChildDobPicker();
    };

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

    const saveFamilyDetails = async () => {
        const token = await AsyncStorage.getItem('storeAccesstoken');
        const formData = new FormData();
        formData.append('father_name', fatherName);
        formData.append('mother_name', motherName);
        if (fathersPhoto_source) {
            formData.append('father_photo', {
                uri: fathersPhoto_source.uri,
                type: fathersPhoto_source.type,
                name: fathersPhoto_source.fileName,
            });
        }
        if (mothersPhoto_source) {
            formData.append('mother_photo', {
                uri: mothersPhoto_source.uri,
                type: mothersPhoto_source.type,
                name: mothersPhoto_source.fileName,
            });
        }
        formData.append('marital_status', marrital_status);
        if(marrital_status === 'married') {
            formData.append('spouse_name', spouseName);
            if (spousePhoto_source) {
                formData.append('spouse_photo', {
                    uri: spousePhoto_source.uri,
                    type: spousePhoto_source.type,
                    name: spousePhoto_source.fileName,
                });
            }
        }

        try {
            const response = await fetch(base_url + "api/save-family", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Family Details saved successfully', data);
                setActiveTab('id_card');
            } else {
                console.log("Error: ", data.message || 'Failed to save Family Details. Please try again.');
            }
        } catch (error) {
            console.error("Network request failed: ", error);
        }
    };

    // Address Information
    const [present_address, setPresent_address] = useState('');
    const [present_sahi, setPresent_sahi] = useState('');
    const [present_post, setPresent_post] = useState('');
    const [present_PS, setPresent_PS] = useState('');
    const [present_district, setPresent_district] = useState('');
    const [present_state, setPresent_state] = useState('');
    const [present_country, setPresent_country] = useState('');
    const [present_pincode, setPresent_pincode] = useState('');
    const [present_landmark, setPresent_landmark] = useState('');
    const [isPermanentSameAsPresent, setIsPermanentSameAsPresent] = useState(true);
    const [permanent_address, setPermanent_address] = useState('');
    const [permanent_sahi, setPermanent_sahi] = useState('');
    const [permanent_post, setPermanent_post] = useState('');
    const [permanent_PS, setPermanent_PS] = useState('');
    const [permanent_district, setPermanent_district] = useState('');
    const [permanent_state, setPermanent_state] = useState('');
    const [permanent_country, setPermanent_country] = useState('');
    const [permanent_pincode, setPermanent_pincode] = useState('');
    const [permanent_landmark, setPermanent_landmark] = useState('');
    const [addressDetailsErrors, setAddressDetailsErrors] = useState({});

    const validateAddressFields = () => {
        const newErrors = {};

        if (!present_address) newErrors.present_address = 'Present Address is required';
        if (!present_sahi) newErrors.present_sahi = 'Present Sahi is required';
        if (!present_post) newErrors.present_post = 'Present Post is required';
        if (!present_PS) newErrors.present_PS = 'Present Police Station is required';
        if (!present_district) newErrors.present_district = 'Present District is required';
        if (!present_state) newErrors.present_state = 'Present State is required';
        if (!present_country) newErrors.present_country = 'Present Country is required';
        if (!present_pincode) newErrors.present_pincode = 'Present Pincode is required';
        if (!present_landmark) newErrors.present_landmark = 'Present Landmark is required';
        if (!isPermanentSameAsPresent) {
            if (!permanent_address) newErrors.permanent_address = 'Permanent Address is required';
            if (!permanent_sahi) newErrors.permanent_sahi = 'Permanent Sahi is required';
            if (!permanent_post) newErrors.permanent_post = 'Permanent Post is required';
            if (!permanent_PS) newErrors.permanent_PS = 'Permanent Police Station is required';
            if (!permanent_district) newErrors.permanent_district = 'Permanent District is required';
            if (!permanent_state) newErrors.permanent_state = 'Permanent State is required';
            if (!permanent_country) newErrors.permanent_country = 'Permanent Country is required';
            if (!permanent_pincode) newErrors.permanent_pincode = 'Permanent Pincode is required';
            if (!permanent_landmark) newErrors.permanent_landmark = 'Permanent Landmark is required';
        }

        // Set errors and clear them after 5 seconds
        setAddressDetailsErrors(newErrors);
        setTimeout(() => setAddressDetailsErrors({}), 5000);

        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };

    const saveAddressDetails = async () => {
        if (!validateAddressFields()) return;

        const token = await AsyncStorage.getItem('storeAccesstoken');
        const formData = new FormData();
        formData.append('sahi', present_sahi);
        formData.append('post', present_post);
        formData.append('police_station', present_PS);
        formData.append('district', present_district);
        formData.append('state', present_state);
        formData.append('country', present_country);
        formData.append('pincode', present_pincode);
        formData.append('landmark', present_landmark);
        formData.append('address', present_address);

        formData.append('differentAsPermanent', isPermanentSameAsPresent);

        formData.append('per_address', permanent_address);
        formData.append('per_sahi', permanent_sahi);
        formData.append('per_post', permanent_post);
        formData.append('per_police_station', permanent_PS);
        formData.append('per_district', permanent_district);
        formData.append('per_state', permanent_state);
        formData.append('per_country', permanent_country);
        formData.append('per_pincode', permanent_pincode);
        formData.append('per_landmark', permanent_landmark);

        try {
            const response = await fetch(base_url + "api/save-address", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Address Details saved successfully', data);
                setActiveTab('occupation');
            } else {
                console.log("Error: ", data.message || 'Failed to save Address Details. Please try again.');
            }
        } catch (error) {
            console.error("Network request failed: ", error);
        }
    };

    // Occupation Information
    const [occupationType, setOccupationType] = useState('');
    const [extraCuricularActivity, setExtraCuricularActivity] = useState(['']); // Initialize with one field
    const [occupationDetailsErrors, setOccupationDetailsErrors] = useState({});

    const addMoreExtraCuricularFields = () => {
        setExtraCuricularActivity([...extraCuricularActivity, '']); // Add a new empty field
    };

    const removeExtraCuricularFields = (index) => {
        const updatedFields = extraCuricularActivity.filter((_, i) => i !== index);
        setExtraCuricularActivity(updatedFields);
    };

    const validateOccupationFields = () => {
        const newErrors = {};

        if (!occupationType) newErrors.occupationType = 'Occupation Type is required';

        // Validate each extra-curricular activity separately
        const extraErrors = extraCuricularActivity.map(activity => activity ? '' : 'This field is required');

        // If any field has an error, set the errors
        if (extraErrors.some(error => error)) {
            newErrors.extraCuricularActivity = extraErrors;
        }

        // Set errors and clear them after 5 seconds
        setOccupationDetailsErrors(newErrors);
        setTimeout(() => setOccupationDetailsErrors({}), 5000);

        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };

    const saveOccupationDetails = async () => {
        if (!validateOccupationFields()) return;

        const token = await AsyncStorage.getItem('storeAccesstoken');
        const formData = new FormData();
        formData.append('occupation', occupationType);
        extraCuricularActivity.forEach((activity, index) => {
            formData.append(`extra_activity[${index}]`, activity);
        });

        // console.log("saveOccupationDetails", formData);
        // return;

        try {
            const response = await fetch(base_url + "api/save-occupation", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Occupation Details saved successfully', data);
                setActiveTab('seba');
            } else {
                console.log("Error: ", data.message || 'Failed to save Occupation Details. Please try again.');
            }
        } catch (error) {
            console.error("Network request failed: ", error);
        }
    };

    // Bank Information
    // const [bankName, setBankName] = useState('');
    // const [branchName, setBranchName] = useState('');
    // const [ifscCode, setIfscCode] = useState('');
    // const [accountNumber, setAccountNumber] = useState('');
    // const [accountHolderName, setAccountHolderName] = useState('');
    // const [upi, setUpi] = useState('');

    // Seba Information
    const [sebaTypeOpen, setSebaTypeOpen] = useState(false);
    const [sebaType, setSebaType] = useState(null);
    const [sebaTypeList, setSebaTypeList] = useState([
        { label: 'Seba Type 1', value: 'seba1' },
        { label: 'Seba Type 2', value: 'seba2' },
    ]);

    const [sebaDetails, setSebaDetails] = useState([
        {
            id: 1,
            name: 'seba1',
            bedha: [
                { id: 1, name: 'bedha1' },
                { id: 2, name: 'bedha2' },
                { id: 3, name: 'bedha3' },
            ]
        },
        {
            id: 2,
            name: 'seba2',
            bedha: [
                { id: 4, name: 'bedha4' },
                { id: 5, name: 'bedha5' },
                { id: 6, name: 'bedha6' },
                { id: 7, name: 'bedha7' },
            ]
        },
        {
            id: 3,
            name: 'seba3',
            bedha: [
                { id: 8, name: 'bedha8' },
                { id: 9, name: 'bedha9' },
                { id: 10, name: 'bedha10' },
                { id: 11, name: 'bedha11' },
                { id: 12, name: 'bedha12' },
            ]
        }
    ]);

    // Social Media
    const [facebook_url, setFacebook_url] = useState('');
    const [twitter_url, setTwitter_url] = useState('');
    const [instagram_url, setInstagram_url] = useState('');
    const [linkedin_url, setLinkedin_url] = useState('');
    const [youtube_url, setYoutube_url] = useState('');

    const saveSocialMediaDetails = async () => {
        const token = await AsyncStorage.getItem('storeAccesstoken');
        const socialMediaData = {
            facebook: facebook_url,
            instagram: instagram_url,
            youtube: youtube_url,
            twitter: twitter_url,
            linkedin: linkedin_url
        };

        try {
            const response = await fetch(base_url + "api/save-socialmedia", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(socialMediaData),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Social Media Details saved successfully', data);
                // Handle success (e.g., navigate to the next tab or show a success message)
                navigation.navigate('ThankYouPage');
            } else {
                console.log("Error: ", data.message || 'Failed to save Social Media Details. Please try again.');
            }
        } catch (error) {
            console.error("Network request failed: ", error);
            // alert("Network request failed. Please check your internet connection and try again.");
        }
    };

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
                {activeTab === 'personal' && (
                    <View style={{ flex: 1 }}>
                        <View style={{ alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>Personal Details</Text>
                            <Image source={require('../../assets/images/element1.png')} style={{ width: 140, height: 15 }} />
                        </View>
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
                                {personalDetailsErrors.firstName && <Text style={styles.errorText}>{personalDetailsErrors.firstName}</Text>}
                                {/* Middle Name Input */}
                                <FloatingLabelInput
                                    label="Middle Name"
                                    value={middleName}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setMiddleName(value)}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {personalDetailsErrors.middleName && <Text style={styles.errorText}>{personalDetailsErrors.middleName}</Text>}
                                {/* Last Name Input */}
                                <FloatingLabelInput
                                    label="Last Name"
                                    value={lastName}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setLastName(value)}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {personalDetailsErrors.lastName && <Text style={styles.errorText}>{personalDetailsErrors.lastName}</Text>}
                                {/* Alias Input */}
                                <FloatingLabelInput
                                    label="Alias"
                                    value={alias}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setAlias(value)}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {personalDetailsErrors.alias && <Text style={styles.errorText}>{personalDetailsErrors.alias}</Text>}
                                {/* DOB Input */}
                                <Text style={[styles.label, (focusedField === 'dob' || dob !== null) && styles.focusedLabel]}>Date Of Birth</Text>
                                <TouchableOpacity onPress={openDobPicker}>
                                    <TextInput
                                        style={{ color: '#000', borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, paddingLeft: 18, borderRadius: 10, marginVertical: 12 }}
                                        value={dob ? moment(dob).format('DD-MM-YYYY') : ''}
                                        editable={false}
                                        placeholder="Date Of Birth"
                                        placeholderTextColor={'#4d6285'}
                                    />
                                    <AntDesign name="calendar" size={25} color="#4d6285" style={{ position: 'absolute', right: 20, top: 22 }} />
                                </TouchableOpacity>
                                <Modal animationType="slide" transparent={true} visible={isDateOpen} onRequestClose={closeDobPicker}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                                        <View style={{ width: '90%', padding: 20, backgroundColor: 'white', borderRadius: 10, elevation: 5 }}>
                                            <Calendar
                                                onDayPress={(day) => {
                                                    setDob(new Date(day.timestamp));
                                                    setDateOpen(false);
                                                }}
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
                                {personalDetailsErrors.dob && <Text style={styles.errorText}>{personalDetailsErrors.dob}</Text>}
                                {/* Email Input */}
                                <FloatingLabelInput
                                    label="Email (Optional)"
                                    value={emailId}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setEmailId(value)}
                                    keyboardType="email-address"
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {/* Mobile Number Input */}
                                <FloatingLabelInput
                                    label="Mobile Number"
                                    value={mobileNumber}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setMobileNumber(value)}
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {personalDetailsErrors.mobileNumber && <Text style={styles.errorText}>{personalDetailsErrors.mobileNumber}</Text>}
                                {/* Whatsapp Number Input */}
                                <FloatingLabelInput
                                    label="Whatsapp Number"
                                    value={whatsappNumber}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setWhatsappNumber(value)}
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {personalDetailsErrors.whatsappNumber && <Text style={styles.errorText}>{personalDetailsErrors.whatsappNumber}</Text>}
                                {/* Date Of Birth Input */}
                                {/* <TouchableOpacity onPress={openDobPicker}>
                                    <TextInput
                                        style={{ color: '#000', borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, paddingLeft: 18, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                        value={dob ? moment(dob).format('DD-MM-YYYY') : ''}
                                        editable={false}
                                        placeholder="Date Of Birth"
                                        placeholderTextColor={'#4d6285'}
                                    />
                                    <AntDesign name="calendar" size={25} color="#4d6285" style={{ position: 'absolute', right: 20, top: 22 }} />
                                </TouchableOpacity>
                                <Modal animationType="slide" transparent={true} visible={isDateOpen} onRequestClose={closeDobPicker}>
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
                                </Modal> */}
                                {/* Educational Qualification Input */}
                                {/* <FloatingLabelInput
                                label="Educational Qualification"
                                value={educational_qualification}
                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setEducational_qualification(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                /> */}
                                {/* Blood Group Input */}
                                <Text style={[styles.label, { marginBottom: 10 }, (focusedField === 'bloodGroup' || bloodGroup !== null) && styles.focusedLabel]}>Blood Group</Text>
                                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                                    <DropDownPicker
                                        open={openBloodGroup}
                                        value={bloodGroup}
                                        items={bloodGroupOptions}
                                        setOpen={setOpenBloodGroup}
                                        setValue={setBloodGroup}
                                        setItems={setBloodGroupOptions}
                                        placeholder='Select Blood Group'
                                        placeholderStyle={{ color: '#4d6285' }}
                                        containerStyle={{ width: '100%', marginTop: 5 }}
                                        style={[styles.input, (focusedField === 'bloodGroup' || bloodGroup !== null) && styles.focusedInput]}
                                        dropDownContainerStyle={{ backgroundColor: '#fafafa', zIndex: 999 }}
                                        dropDownDirection='BOTTOM'
                                        listMode="SCROLLVIEW"
                                    />
                                </View>
                                {personalDetailsErrors.bloodGroup && <Text style={styles.errorText}>{personalDetailsErrors.bloodGroup}</Text>}
                                {/* Helth Card Number Input */}
                                <FloatingLabelInput
                                    label="Helth Card Number"
                                    value={helthCardNumber}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setHelthCardNumber(value)}
                                    keyboardType="default"
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {personalDetailsErrors.helthCardNumber && <Text style={styles.errorText}>{personalDetailsErrors.helthCardNumber}</Text>}
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
                                {personalDetailsErrors.userPhoto_source && <Text style={styles.errorText}>{personalDetailsErrors.userPhoto_source}</Text>}
                                {/* Add more For Language Entry */}
                                {/* <Text style={[styles.label, { marginTop: 0 }]}>Languages</Text> */}
                                {/* {languages.map((language, index) => (
                                <View key={index} style={{ width: '100%' }}>
                                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        Language Input
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
                                        Read Checkbox
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
                                        Write Checkbox
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
                                        Speak Checkbox
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
                                                <Text style={{ color: '#fff', fontSize: 14 }}>Add More</Text>
                                            </TouchableOpacity>
                                        }
                                        {index > 0 &&
                                            <TouchableOpacity style={{ backgroundColor: '#ba111e', padding: 10, borderRadius: 6 }} onPress={() => setLanguages(languages.filter((_, i) => i !== index))}>
                                                <Text style={{ color: '#fff', fontSize: 14 }}>Remove</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                                ))} */}
                                {/* Date Of Join Temple Seba Input */}
                                <TouchableOpacity onPress={() => (dateRemember ? setYearPickerVisible(true) : setDatePickerVisibility(true))}>
                                    <TextInput style={{ color: '#000', borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, paddingLeft: 18, borderRadius: 10, marginVertical: 12 }}
                                        value={dateOfJoinTempleSeba ? moment(dateOfJoinTempleSeba).format(dateRemember ? 'YYYY' : 'DD-MM-YYYY') : ''}
                                        editable={false}
                                        placeholder="Year of sadhi bandha / joining seba"
                                        placeholderTextColor={'#4d6285'}
                                    />
                                    <AntDesign name="calendar" size={25} color="#4d6285" style={{ position: 'absolute', right: 20, top: 22 }} />
                                </TouchableOpacity>
                                {personalDetailsErrors.dateOfJoinTempleSeba && <Text style={styles.errorText}>{personalDetailsErrors.dateOfJoinTempleSeba}</Text>}

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
                                {/* Year Picker (Custom Modal) */}
                                <Modal visible={isYearPickerVisible} transparent animationType="fade">
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                        <View style={{ backgroundColor: 'white', width: 320, borderRadius: 15, padding: 20, elevation: 10 }}>

                                            {/* Header */}
                                            <View style={{ alignItems: 'center', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
                                                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333' }}>Select Year</Text>
                                            </View>

                                            {/* Year List */}
                                            <FlatList
                                                data={years}
                                                keyExtractor={(item) => item.toString()}
                                                style={{ maxHeight: 250, marginTop: 10 }}
                                                showsVerticalScrollIndicator={false}
                                                renderItem={({ item }) => (
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setDateOfJoinTempleSeba(new Date(item, 0, 1));
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
                                                        }}>
                                                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4d6285' }}>{item}</Text>
                                                    </TouchableOpacity>
                                                )}
                                            />

                                            {/* Buttons */}
                                            <TouchableOpacity
                                                onPress={() => setYearPickerVisible(false)}
                                                style={{
                                                    marginTop: 15,
                                                    padding: 12,
                                                    backgroundColor: '#FF4D4D',
                                                    borderRadius: 10,
                                                    alignItems: 'center',
                                                    shadowColor: '#000',
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.3,
                                                    shadowRadius: 4,
                                                    elevation: 3,
                                                }}>
                                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>
                                {/* Checkbox */}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <CheckBox
                                        disabled={false}
                                        value={dateRemember}
                                        onValueChange={(newValue) => {
                                            setDateRemember(newValue);
                                            setDateOfJoinTempleSeba(null); // Reset value when switching
                                        }}
                                        tintColors={{ true: '#56ab2f', false: '#757473' }}
                                    />
                                    <Text style={{ fontSize: 16, marginRight: 10, color: '#757473' }}>Date Not Remembered</Text>
                                </View>
                            </View>
                            {/* Submit Button */}
                            <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                <TouchableOpacity
                                    onPress={SavePersonalDetails}
                                    style={{ width: '45%', backgroundColor: '#c9170a', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 50, paddingVertical: 10, marginVertical: 15 }}
                                >
                                    <Text style={styles.submitText}>Next</Text>
                                    <Fontisto name="arrow-right" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                )}
                {activeTab === 'family' && (
                    <View style={{ flex: 1 }}>
                        <View style={{ alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>Family Details</Text>
                            <Image source={require('../../assets/images/element1.png')} style={{ width: 120, height: 15 }} />
                        </View>
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
                                        {/* <Text style={{ color: '#000', fontSize: 17, fontWeight: 'bold', marginBottom: 10 }}>Spouse Family Detail's</Text>
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
                                        <>
                                        <FloatingLabelInput
                                            label="Spouse Father's Name"
                                            value={spouseFatherName}
                                            customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                            labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                            onChangeText={value => setSpouseFatherName(value)}
                                            containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                        />
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
                                        </> */}
                                    </>
                                }
                            </View>
                            {marrital_status === 'married' &&
                                <>
                                    <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold', marginLeft: 16, marginVertical: 5 }}>Children's Details</Text>
                                    {childrenFields.map((child, index) => (
                                        <View key={index} style={styles.cardBox}>
                                            <View style={{ width: '100%' }}>
                                                <View style={{ width: '100%' }}>
                                                    <FloatingLabelInput
                                                        label="Child Name"
                                                        value={child.name}
                                                        customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                                        labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                                        onChangeText={(text) => {
                                                            const updatedChildrenFields = [...childrenFields];
                                                            updatedChildrenFields[index].name = text;
                                                            setChildrenFields(updatedChildrenFields);
                                                        }}
                                                        containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10, width: '100%' }}
                                                    />
                                                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                                                        <View style={{ width: '45%' }}>
                                                            <Text style={[styles.label, (focusedField === `dob${index}` || child.dob !== null) && styles.focusedLabel]}>Child DOB</Text>
                                                            <TouchableOpacity onPress={() => openChildDobPicker(index)}>
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
                                                                    const updatedChildrenFields = [...childrenFields];
                                                                    updatedChildrenFields[index].gender = callback(updatedChildrenFields[index].gender);
                                                                    setChildrenFields(updatedChildrenFields);
                                                                }}
                                                                containerStyle={{ width: '100%', marginTop: 10 }}
                                                                dropDownContainerStyle={{ backgroundColor: '#fafafa' }}
                                                                listMode='SCROLLVIEW'
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
                                                                    onDayPress={(day) => handleChildDobChange(new Date(day.timestamp))}
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
                                                        <TouchableOpacity style={{ marginRight: 20 }} onPress={() => setChildrenFields([...childrenFields, { name: '', dob: null, gender: null, image: 'Select Image' }])}>
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
                                    ))}
                                </>
                            }
                            {/* Submit Button */}
                            <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                <TouchableOpacity onPress={() => handleNextTab('personal')} style={{ width: '45%', backgroundColor: '#208a20', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 50, paddingVertical: 10, marginVertical: 15 }}>
                                    <Fontisto name="arrow-left" size={20} color="#fff" />
                                    <Text style={styles.submitText}>Previous</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleNextTab('id_card')} style={{ width: '45%', backgroundColor: '#c9170a', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 50, paddingVertical: 10, marginVertical: 15 }}>
                                    <Text style={styles.submitText}>Next</Text>
                                    <Fontisto name="arrow-right" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                )}
                {activeTab === 'id_card' && (
                    <View style={{ flex: 1 }}>
                        <View style={{ alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>ID Card Details</Text>
                            <Image source={require('../../assets/images/element1.png')} style={{ width: 130, height: 15 }} />
                        </View>
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
                                            listMode='SCROLLVIEW'
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
                                        keyboardType="name-phone-pad"
                                        // maxLength={field.idProof === 'pan' ? 10 : 12}
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
                                <TouchableOpacity onPress={() => handleNextTab('family')} style={{ width: '45%', backgroundColor: '#208a20', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 50, paddingVertical: 10, marginVertical: 15 }}>
                                    <Fontisto name="arrow-left" size={20} color="#fff" />
                                    <Text style={styles.submitText}>Previous</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={saveIdCardDetails} style={{ width: '45%', backgroundColor: '#c9170a', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 50, paddingVertical: 10, marginVertical: 15 }}>
                                    <Text style={styles.submitText}>Next</Text>
                                    <Fontisto name="arrow-right" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                )}
                {activeTab === 'address' && (
                    <View style={{ flex: 1 }}>
                        <View style={{ alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>Address</Text>
                            <Image source={require('../../assets/images/element1.png')} style={{ width: 90, height: 10 }} />
                        </View>
                        <ScrollView style={{ flex: 1 }}>
                            <View style={styles.cardBox}>
                                {/* Present Sahi */}
                                <FloatingLabelInput
                                    label="Present Sahi"
                                    value={present_sahi}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setPresent_sahi(value)}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {addressDetailsErrors.present_sahi && <Text style={styles.errorText}>{addressDetailsErrors.present_sahi}</Text>}
                                {/* Present Landmark Input */}
                                <FloatingLabelInput
                                    label="Present Landmark"
                                    value={present_landmark}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setPresent_landmark(value)}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {addressDetailsErrors.present_landmark && <Text style={styles.errorText}>{addressDetailsErrors.present_landmark}</Text>}
                                {/* Present Post Input */}
                                <FloatingLabelInput
                                    label="Present Post"
                                    value={present_post}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setPresent_post(value)}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {addressDetailsErrors.present_post && <Text style={styles.errorText}>{addressDetailsErrors.present_post}</Text>}
                                {/* Present Police station */}
                                <FloatingLabelInput
                                    label="Present Police Station"
                                    value={present_PS}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setPresent_PS(value)}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {addressDetailsErrors.present_PS && <Text style={styles.errorText}>{addressDetailsErrors.present_PS}</Text>}
                                {/* Present District Input */}
                                <FloatingLabelInput
                                    label="Present District"
                                    value={present_district}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setPresent_district(value)}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {addressDetailsErrors.present_district && <Text style={styles.errorText}>{addressDetailsErrors.present_district}</Text>}
                                {/* Present State Input */}
                                <FloatingLabelInput
                                    label="Present State"
                                    value={present_state}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setPresent_state(value)}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {addressDetailsErrors.present_state && <Text style={styles.errorText}>{addressDetailsErrors.present_state}</Text>}
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
                                {addressDetailsErrors.present_pincode && <Text style={styles.errorText}>{addressDetailsErrors.present_pincode}</Text>}
                                {/* Present Country Input */}
                                <FloatingLabelInput
                                    label="Present Country"
                                    value={present_country}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setPresent_country(value)}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {addressDetailsErrors.present_country && <Text style={styles.errorText}>{addressDetailsErrors.present_country}</Text>}
                                {/* Present Address Input */}
                                <FloatingLabelInput
                                    label="Present Address"
                                    value={present_address}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setPresent_address(value)}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {addressDetailsErrors.present_address && <Text style={styles.errorText}>{addressDetailsErrors.present_address}</Text>}
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
                                    {/* Permanent Sahi */}
                                    <FloatingLabelInput
                                        label="Permanent Sahi"
                                        value={permanent_sahi}
                                        customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                        labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                        onChangeText={value => setPermanent_sahi(value)}
                                        containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                    />
                                    {addressDetailsErrors.permanent_sahi && <Text style={styles.errorText}>{addressDetailsErrors.permanent_sahi}</Text>}
                                    {/* Permanent Landmark Input */}
                                    <FloatingLabelInput
                                        label="Permanent Landmark"
                                        value={permanent_landmark}
                                        customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                        labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                        onChangeText={value => setPermanent_landmark(value)}
                                        containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                    />
                                    {addressDetailsErrors.permanent_landmark && <Text style={styles.errorText}>{addressDetailsErrors.permanent_landmark}</Text>}
                                    {/* Permanent Post Input */}
                                    <FloatingLabelInput
                                        label="Permanent Post"
                                        value={permanent_post}
                                        customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                        labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                        onChangeText={value => setPermanent_post(value)}
                                        containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                    />
                                    {addressDetailsErrors.permanent_post && <Text style={styles.errorText}>{addressDetailsErrors.permanent_post}</Text>}
                                    {/* Permanent Police station */}
                                    <FloatingLabelInput
                                        label="Permanent Police Station"
                                        value={permanent_PS}
                                        customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                        labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                        onChangeText={value => setPermanent_PS(value)}
                                        containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                    />
                                    {addressDetailsErrors.permanent_PS && <Text style={styles.errorText}>{addressDetailsErrors.permanent_PS}</Text>}
                                    {/* Permanent District Input */}
                                    <FloatingLabelInput
                                        label="Permanent District"
                                        value={permanent_district}
                                        customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                        labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                        onChangeText={value => setPermanent_district(value)}
                                        containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                    />
                                    {addressDetailsErrors.permanent_district && <Text style={styles.errorText}>{addressDetailsErrors.permanent_district}</Text>}
                                    {/* Permanent State Input */}
                                    <FloatingLabelInput
                                        label="Permanent State"
                                        value={permanent_state}
                                        customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                        labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                        onChangeText={value => setPermanent_state(value)}
                                        containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                    />
                                    {addressDetailsErrors.permanent_state && <Text style={styles.errorText}>{addressDetailsErrors.permanent_state}</Text>}
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
                                    {addressDetailsErrors.permanent_pincode && <Text style={styles.errorText}>{addressDetailsErrors.permanent_pincode}</Text>}
                                    {/* Permanent Country Input */}
                                    <FloatingLabelInput
                                        label="Permanent Country"
                                        value={permanent_country}
                                        customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                        labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                        onChangeText={value => setPermanent_country(value)}
                                        containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                    />
                                    {addressDetailsErrors.permanent_country && <Text style={styles.errorText}>{addressDetailsErrors.permanent_country}</Text>}
                                    {/* Permanent Address Input */}
                                    <FloatingLabelInput
                                        label="Permanent Address"
                                        value={permanent_address}
                                        customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                        labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                        onChangeText={value => setPermanent_address(value)}
                                        containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                    />
                                    {addressDetailsErrors.permanent_address && <Text style={styles.errorText}>{addressDetailsErrors.permanent_address}</Text>}
                                </View>
                            }
                            {/* Submit Button */}
                            <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                <TouchableOpacity onPress={() => handleNextTab('id_card')} style={{ width: '45%', backgroundColor: '#208a20', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 50, paddingVertical: 10, marginVertical: 15 }}>
                                    <Fontisto name="arrow-left" size={20} color="#fff" />
                                    <Text style={styles.submitText}>Previous</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={saveAddressDetails} style={{ width: '45%', backgroundColor: '#c9170a', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 50, paddingVertical: 10, marginVertical: 15 }}>
                                    <Text style={styles.submitText}>Next</Text>
                                    <Fontisto name="arrow-right" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                )}
                {activeTab === 'occupation' && (
                    <View style={{ flex: 1 }}>
                        <View style={{ alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>Occupation Details</Text>
                            <Image source={require('../../assets/images/element1.png')} style={{ width: 160, height: 15 }} />
                        </View>
                        <ScrollView style={{ flex: 1 }}>
                            <View style={styles.cardBox}>
                                {/* Occupatio Type */}
                                <FloatingLabelInput
                                    label="Occupatio Type"
                                    value={occupationType}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setOccupationType(value)}
                                    containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                />
                                {occupationDetailsErrors.occupationType && <Text style={styles.errorText}>{occupationDetailsErrors.occupationType}</Text>}
                                {/* Extra Curicular Activity */}
                                {extraCuricularActivity.map((field, index) => (
                                    <View key={index} style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ width: '70%' }}>
                                            <FloatingLabelInput
                                                label="Extra Curricular Activity"
                                                value={field}
                                                customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                                onChangeText={(value) => {
                                                    const updatedFields = [...extraCuricularActivity];
                                                    updatedFields[index] = value;
                                                    setExtraCuricularActivity(updatedFields);
                                                }}
                                                containerStyles={{
                                                    borderWidth: 0.5,
                                                    borderColor: '#353535',
                                                    backgroundColor: '#ffffff',
                                                    padding: 10,
                                                    borderRadius: 10,
                                                    marginVertical: 12,
                                                }}
                                            />
                                            {/* Show error for the specific field */}
                                            {occupationDetailsErrors.extraCuricularActivity?.[index] && (
                                                <Text style={styles.errorText}>{occupationDetailsErrors.extraCuricularActivity[index]}</Text>
                                            )}
                                        </View>
                                        {/* Add & Remove Buttons */}
                                        <View style={{ width: '30%', flexDirection: 'row' }}>
                                            {/* Remove Button (Hidden for first index) */}
                                            {index > 0 && (
                                                <TouchableOpacity onPress={() => removeExtraCuricularFields(index)} style={{ marginLeft: 5 }}>
                                                    <AntDesign name="minussquare" color="#c41414" size={40} />
                                                </TouchableOpacity>
                                            )}

                                            {/* Add More Button (Only on the last item) */}
                                            {index === extraCuricularActivity.length - 1 && (
                                                <TouchableOpacity style={{ marginLeft: 5 }} onPress={addMoreExtraCuricularFields}>
                                                    <AntDesign name="plussquare" color="#016a59" size={40} />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </View>
                            {/* Submit Button */}
                            <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                <TouchableOpacity onPress={() => handleNextTab('address')} style={{ width: '45%', backgroundColor: '#208a20', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 50, paddingVertical: 10, marginVertical: 15 }}>
                                    <Fontisto name="arrow-left" size={20} color="#fff" />
                                    <Text style={styles.submitText}>Previous</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={saveOccupationDetails} style={{ width: '45%', backgroundColor: '#c9170a', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 50, paddingVertical: 10, marginVertical: 15 }}>
                                    <Text style={styles.submitText}>Next</Text>
                                    <Fontisto name="arrow-right" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                )}
                {activeTab === 'seba' && (
                    <View style={{ flex: 1 }}>
                        <View style={{ alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>Seba Details</Text>
                            <Image source={require('../../assets/images/element1.png')} style={{ width: 110, height: 10 }} />
                        </View>
                        <ScrollView style={{ flex: 1 }}>
                            <View style={styles.cardBox}>
                                {/* Seba Type Dropdown */}
                                <Text style={[styles.label, (focusedField === 'sebaType' || sebaType !== null) && styles.focusedLabel]}>Seba Type</Text>
                                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                                    <DropDownPicker
                                        open={focusedField === 'sebaType'}
                                        value={sebaType}
                                        items={sebaTypeList}
                                        setOpen={() => setFocusedField(focusedField === 'sebaType' ? null : 'sebaType')}
                                        setValue={(callback) => setSebaType(callback(sebaType))}
                                        placeholder='Select Seba Type'
                                        placeholderStyle={{ color: '#4d6285' }}
                                        containerStyle={{ width: '100%', marginTop: 5 }}
                                        style={[styles.input, (focusedField === 'sebaType' || sebaType !== null) && styles.focusedInput]}
                                        dropDownContainerStyle={{ backgroundColor: '#fafafa', zIndex: 999 }}
                                    />
                                </View>
                            </View>
                            {/* Submit Button */}
                            <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                <TouchableOpacity onPress={() => handleNextTab('occupation')} style={{ width: '45%', backgroundColor: '#208a20', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 50, paddingVertical: 10, marginVertical: 15 }}>
                                    <Fontisto name="arrow-left" size={20} color="#fff" />
                                    <Text style={styles.submitText}>Previous</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleNextTab('social')} style={{ width: '45%', backgroundColor: '#c9170a', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 50, paddingVertical: 10, marginVertical: 15 }}>
                                    <Text style={styles.submitText}>Next</Text>
                                    <Fontisto name="arrow-right" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                )}
                {activeTab === 'social' && (
                    <View style={{ flex: 1 }}>
                        <View style={{ alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ color: '#000', fontSize: 18, fontWeight: 'bold' }}>Social Media</Text>
                            <Image source={require('../../assets/images/element1.png')} style={{ width: 110, height: 10 }} />
                        </View>
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
                                {/* Instagram URL Input */}
                                <FloatingLabelInput
                                    label="Instagram URL"
                                    value={instagram_url}
                                    customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={value => setInstagram_url(value)}
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
                                <TouchableOpacity onPress={() => handleNextTab('seba')} style={{ width: '45%', backgroundColor: '#208a20', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 50, paddingVertical: 10, marginVertical: 15 }}>
                                    <Fontisto name="arrow-left" size={20} color="#fff" />
                                    <Text style={styles.submitText}>Previous</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={saveSocialMediaDetails} style={{ width: '45%', backgroundColor: '#c9170a', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 50, paddingVertical: 10, marginVertical: 15 }}>
                                    <Text style={styles.submitText}>Next</Text>
                                    <Fontisto name="arrow-right" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                )}
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
        color: '#c80100',
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
        borderRadius: 50,
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
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -8,
        marginBottom: 5,
    },
});
