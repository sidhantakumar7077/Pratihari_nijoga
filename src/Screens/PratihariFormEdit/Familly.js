import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Modal,
    FlatList,
    ToastAndroid,
    ActivityIndicator
} from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RadioForm from 'react-native-simple-radio-button';
import CheckBox from '@react-native-community/checkbox';
import DatePicker from 'react-native-date-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { base_url } from '../../../App';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';

const Familly = (props) => {

    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const [focusedField, setFocusedField] = useState(null);
    const [loading, setLoading] = useState(false);

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
        { name: '', dob: null, gender: null, image: 'Select Image', uri: null, type: null },
    ]);
    const [isChildDobOpen, setIsChildDobOpen] = useState(false);
    const [selectedChildIndex, setSelectedChildIndex] = useState(null);
    const [familyDetailsErrors, setFamilyDetailsErrors] = useState({});

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
                    updatedFields[index].uri = response.assets[0].uri;
                    updatedFields[index].type = response.assets[0].type;
                    setChildrenFields(updatedFields);
                }
            }
        );
    }

    const validateFamilyFields = () => {
        const newErrors = {};

        if (!fatherName) newErrors.fatherName = 'Father Name is required';
        if (!motherName) newErrors.motherName = 'Mother Name is required';
        if (!fathersPhoto_source) newErrors.fathersPhoto_source = 'Father Photo is required';
        if (!mothersPhoto_source) newErrors.mothersPhoto_source = 'Mother Photo is required';
        if (!marrital_status) newErrors.marrital_status = 'Marital Status is required';
        if (marrital_status === 'married') {
            if (!spouseName) newErrors.spouseName = 'Spouse Name is required';
            if (!spousePhoto_source) newErrors.spousePhoto_source = 'Spouse Photo is required';
            // if (childrenFields?.length > 0 && childrenFields[0]?.name) {
            //     childrenFields.forEach((child, index) => {
            //         if (!child.name) newErrors[`childName${index}`] = 'Child Name is required';
            //         if (!child.dob) newErrors[`childDob${index}`] = 'Child Date of Birth is required';
            //         if (!child.gender) newErrors[`childGender${index}`] = 'Child Gender is required';
            //         if (!child.uri) newErrors[`childImage${index}`] = 'Child Image is required';
            //     });
            // }
        }

        // Set errors and clear them after 5 seconds
        setFamilyDetailsErrors(newErrors);
        setTimeout(() => setFamilyDetailsErrors({}), 5000);

        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };

    const saveFamilyDetails = async () => {
        setLoading(true);

        // if (!validateFamilyFields()) return;
        const token = await AsyncStorage.getItem('storeAccesstoken');
        const formData = new FormData();
        formData.append('father_name', fatherName);
        formData.append('mother_name', motherName);
        if (fathersPhoto_source?.uri) {
            formData.append('father_photo', {
                uri: Platform.OS === 'android' ? fathersPhoto_source.uri : fathersPhoto_source.uri.replace('file://', ''),
                type: fathersPhoto_source.type || 'image/jpeg',
                name: fathersPhoto_source.fileName || 'father_photo.jpg',
            });
        }
        if (mothersPhoto_source?.uri) {
            formData.append('mother_photo', {
                uri: Platform.OS === 'android' ? mothersPhoto_source.uri : mothersPhoto_source.uri.replace('file://', ''),
                type: mothersPhoto_source.type || 'image/jpeg',
                name: mothersPhoto_source.fileName || 'mother_photo.jpg',
            });
        }
        formData.append('marital_status', marrital_status);
        if (marrital_status === 'married') {
            formData.append('spouse_name', spouseName);
            if (spousePhoto_source?.uri) {
                formData.append('spouse_photo', {
                    uri: Platform.OS === 'android' ? spousePhoto_source.uri : spousePhoto_source.uri.replace('file://', ''),
                    type: spousePhoto_source.type || 'image/jpeg',
                    name: spousePhoto_source.fileName || 'spouse_photo.jpg',
                });
            }
            if (childrenFields?.length > 0 && childrenFields[0]?.name) {
                childrenFields.forEach((child, index) => {
                    formData.append(`children_name[${index}]`, child.name);
                    formData.append(`children_dob[${index}]`, child.dob ? moment(child.dob).format('YYYY-MM-DD') : '');
                    formData.append(`children_gender[${index}]`, child.gender);
                    if (child.uri) {
                        formData.append(`children_photo[${index}]`, {
                            uri: child.uri,
                            type: child.type,
                            name: child.image,
                        });
                    }
                });
            }
        }

        // console.log("Family Data", formData._parts);
        // return;

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
                navigation.goBack();
                ToastAndroid.show('Family Details saved successfully', ToastAndroid.SHORT);
                // setActiveTab('id_card');
                // handleNextTab('id_card');
            } else {
                console.log("Error: ", data.message || 'Failed to save Family Details. Please try again.');
            }
        } catch (error) {
            console.error("Network request failed: ", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const { data } = props.route.params || {};
        if (data) {
            setFatherName(data.father_name || '');
            setMotherName(data.mother_name || '');
            setMarrital_status(data.maritial_status || null);
            setSpouseName(data.spouse_name || '');

            if (data.father_photo_url) {
                setFathers_photo(data.father_photo_url.split('/').pop());
                setFathersPhoto_source({ uri: data.father_photo_url });
            }
            if (data.mother_photo_url) {
                setMothers_photo(data.mother_photo_url.split('/').pop());
                setMothersPhoto_source({ uri: data.mother_photo_url });
            }
            if (data.spouse_photo_url) {
                setSpouse_photo(data.spouse_photo_url.split('/').pop());
                setSpousePhoto_source({ uri: data.spouse_photo_url });
            }

            if (data.children && data.children.length > 0) {
                const childrenFormatted = data.children.map((child) => ({
                    name: child.children_name || '',
                    dob: child.date_of_birth ? new Date(child.date_of_birth) : null,
                    gender: child.gender || null,
                    ...(child.photo_url && {
                        image: child.photo_url.split('/').pop(),
                        uri: { uri: child.photo_url }
                    })
                }));
                setChildrenFields(childrenFormatted);
                console.log("Children Fields: ", childrenFormatted);
            }
        }
    }, []);

    return (
        <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom, }]}>
            <LinearGradient
                colors={['#4c1d95', '#6366f1']}
                style={styles.header}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" marginRight={10} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Family</Text>
                </View>
                <Text style={styles.headerSubtitle}>Update your family information</Text>
            </LinearGradient>

            <ScrollView style={styles.scrollContainer}>
                <View style={{ flex: 1, marginTop: 15 }}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.cardBox}>
                            {/* Father's Name Input */}
                            <FloatingLabelInput
                                label="Father's Name"
                                value={fatherName}
                                customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setFatherName(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {familyDetailsErrors.fatherName && <Text style={styles.errorText}>{familyDetailsErrors.fatherName}</Text>}
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
                            {familyDetailsErrors.fathersPhoto_source && <Text style={styles.errorText}>{familyDetailsErrors.fathersPhoto_source}</Text>}
                        </View>
                        <View style={styles.cardBox}>
                            {/* Mother's Name Input */}
                            <FloatingLabelInput
                                label="Mother's Name"
                                value={motherName}
                                customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={value => setMotherName(value)}
                                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                            />
                            {familyDetailsErrors.motherName && <Text style={styles.errorText}>{familyDetailsErrors.motherName}</Text>}
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
                            {familyDetailsErrors.mothersPhoto_source && <Text style={styles.errorText}>{familyDetailsErrors.mothersPhoto_source}</Text>}
                        </View>
                        <View style={styles.cardBox}>
                            {/* Marrital Status Input */}
                            <Text style={[styles.label, (marrital_status !== null) && styles.focusedLabel]}>Marrital Status</Text>
                            <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: marrital_status === 'married' ? 20 : 0 }}>
                                {maritalStatusOptions.map((option, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setMarrital_status(option.value);
                                            // console.log("Selected Marital Status: ", option.value);
                                        }}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            marginRight: 40, // space between buttons
                                        }}
                                    >
                                        <Ionicons
                                            name={marrital_status === option.value ? 'radio-button-on' : 'radio-button-off'}
                                            size={22}
                                            color={'#e96a01'}
                                        />
                                        <Text style={{ marginLeft: 8, fontSize: 16, color: '#000' }}>{option.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {marrital_status === 'married' &&
                                <>
                                    {/* Spouse Name Input */}
                                    <FloatingLabelInput
                                        label="Spouse Name"
                                        value={spouseName}
                                        customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                                        labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                        onChangeText={value => setSpouseName(value)}
                                        containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
                                    />
                                    {familyDetailsErrors.spouseName && <Text style={styles.errorText}>{familyDetailsErrors.spouseName}</Text>}
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
                                    {familyDetailsErrors.spousePhoto_source && <Text style={styles.errorText}>{familyDetailsErrors.spousePhoto_source}</Text>}
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
                                                    customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
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
                                                        <DatePicker
                                                            modal
                                                            mode="date"
                                                            open={isChildDobOpen && selectedChildIndex === index}
                                                            date={child.dob || new Date()}
                                                            onConfirm={(date) => handleChildDobChange(date)}
                                                            onCancel={closeChildDobPicker}
                                                            maximumDate={new Date()}
                                                        />
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
                                                        <AntDesign name="plussquare" color="#e96a01" size={40} />
                                                    </TouchableOpacity>
                                                }
                                                {index > 0 &&
                                                    <TouchableOpacity onPress={() => setChildrenFields(childrenFields.filter((_, i) => i !== index))}>
                                                        <AntDesign name="minussquare" color="#051b65" size={40} />
                                                    </TouchableOpacity>
                                                }
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </>
                        }
                        {/* Submit Button */}
                        <TouchableOpacity style={styles.submitButton} onPress={saveFamilyDetails} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <>
                                    <Text style={styles.submitText}>Save Changes</Text>
                                    <Ionicons name="checkmark" size={20} color="#fff" />
                                </>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
}

export default Familly;

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