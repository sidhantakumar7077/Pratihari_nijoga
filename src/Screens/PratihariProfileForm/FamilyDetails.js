import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import CheckBox from '@react-native-community/checkbox';
import DropDownPicker from 'react-native-dropdown-picker';
import RadioForm from 'react-native-simple-radio-button';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';
import { base_url } from '../../../App';

import FormCard from './FormCard';
import AnimatedInput from './AnimatedInput';
import CustomButton from './CustomButton';
import { useFormContext } from './FormContext';

const FamilyDetails = ({ handleNextTab }) => {
    const { setIsLoading } = useFormContext();

    // State variables
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
    const [spouseName, setSpouseName] = useState('');
    const [spousePhoto_source, setSpousePhoto_source] = useState(null);
    const [spouse_photo, setSpouse_photo] = useState('Select Image');
    const [childrenFields, setChildrenFields] = useState([
        { name: '', dob: null, gender: null, image: 'Select Image', uri: null, type: null },
    ]);
    const [isChildDobOpen, setIsChildDobOpen] = useState(false);
    const [selectedChildIndex, setSelectedChildIndex] = useState(null);
    const [focusedField, setFocusedField] = useState(null);
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

    const selectParentsImage = async (type) => {
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
                const source = response.assets[0];
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
    };

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
        }

        setFamilyDetailsErrors(newErrors);
        setTimeout(() => setFamilyDetailsErrors({}), 5000);

        return Object.keys(newErrors).length === 0;
    };

    const saveFamilyDetails = async () => {
        if (!validateFamilyFields()) return;

        setIsLoading(true);
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
        if (marrital_status === 'married') {
            formData.append('spouse_name', spouseName);
            if (spousePhoto_source) {
                formData.append('spouse_photo', {
                    uri: spousePhoto_source.uri,
                    type: spousePhoto_source.type,
                    name: spousePhoto_source.fileName,
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
                handleNextTab('id_card');
            } else {
                console.log("Error: ", data.message || 'Failed to save Family Details. Please try again.');
            }
        } catch (error) {
            console.error("Network request failed: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderImagePicker = (label, filename, onPress, error, delay = 0) => (
        <Animatable.View animation="fadeInUp" duration={600} delay={delay}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={onPress}>
                <Text style={styles.imagePickerText}>{filename}</Text>
                <View style={styles.chooseButton}>
                    <Text style={styles.chooseButtonText}>Choose File</Text>
                </View>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </Animatable.View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Animatable.View
                animation="fadeInDown"
                duration={600}
                style={styles.header}
            >
                <Text style={styles.title}>Family Details</Text>
                <View style={styles.titleUnderline} />
            </Animatable.View>

            {/* Father's Details */}
            <FormCard delay={200} gradient>
                <Text style={styles.sectionTitle}>Father's Information</Text>
                <AnimatedInput
                    label="Father's Name*"
                    value={fatherName}
                    onChangeText={setFatherName}
                    error={familyDetailsErrors.fatherName}
                    delay={300}
                />
                {renderImagePicker(
                    "Father's Photo*",
                    fathers_photo,
                    () => selectParentsImage('father'),
                    familyDetailsErrors.fathersPhoto_source,
                    350
                )}
            </FormCard>

            {/* Mother's Details */}
            <FormCard delay={400} gradient>
                <Text style={styles.sectionTitle}>Mother's Information</Text>
                <AnimatedInput
                    label="Mother's Name*"
                    value={motherName}
                    onChangeText={setMotherName}
                    error={familyDetailsErrors.motherName}
                    delay={450}
                />
                {renderImagePicker(
                    "Mother's Photo*",
                    mothers_photo,
                    () => selectParentsImage('mother'),
                    familyDetailsErrors.mothersPhoto_source,
                    500
                )}
            </FormCard>

            {/* Marital Status */}
            <FormCard delay={600}>
                <Text style={styles.sectionTitle}>Marital Information</Text>
                <Animatable.View animation="fadeInUp" duration={600} delay={650}>
                    <Text style={styles.label}>Marital Status*</Text>
                    <RadioForm
                        radio_props={maritalStatusOptions}
                        initial={marrital_status === 'married' ? 1 : 0}
                        formHorizontal={true}
                        labelHorizontal={true}
                        buttonColor={'#051b65'}
                        selectedButtonColor={'#051b65'}
                        animation={true}
                        onPress={(value) => setMarrital_status(value)}
                        style={styles.radioContainer}
                    />
                    {familyDetailsErrors.marrital_status && (
                        <Text style={styles.errorText}>{familyDetailsErrors.marrital_status}</Text>
                    )}
                </Animatable.View>

                {marrital_status === 'married' && (
                    <>
                        <AnimatedInput
                            label="Spouse Name*"
                            value={spouseName}
                            onChangeText={setSpouseName}
                            error={familyDetailsErrors.spouseName}
                            delay={700}
                        />
                        {renderImagePicker(
                            "Spouse Photo*",
                            spouse_photo,
                            () => selectParentsImage('spouse'),
                            familyDetailsErrors.spousePhoto_source,
                            750
                        )}
                    </>
                )}
            </FormCard>

            {/* Children Details */}
            {marrital_status === 'married' && (
                <FormCard delay={800}>
                    <Text style={styles.sectionTitle}>Children's Details</Text>
                    {childrenFields.map((child, index) => (
                        <Animatable.View
                            key={index}
                            animation="fadeInUp"
                            duration={600}
                            delay={850 + index * 100}
                            style={styles.childContainer}
                        >
                            <AnimatedInput
                                label={`Child ${index + 1} Name`}
                                value={child.name}
                                onChangeText={(text) => {
                                    const updatedChildrenFields = [...childrenFields];
                                    updatedChildrenFields[index].name = text;
                                    setChildrenFields(updatedChildrenFields);
                                }}
                                delay={900 + index * 100}
                            />

                            <View style={styles.childRow}>
                                <View style={styles.childHalfWidth}>
                                    <Text style={styles.label}>Date of Birth</Text>
                                    <TouchableOpacity
                                        onPress={() => openChildDobPicker(index)}
                                        style={styles.dateInput}
                                    >
                                        <TextInput
                                            style={styles.dateText}
                                            value={child.dob ? moment(child.dob).format('DD-MM-YYYY') : ''}
                                            editable={false}
                                            placeholder="Select DOB"
                                            placeholderTextColor={'#999'}
                                        />
                                        <AntDesign name="calendar" size={18} color="#051b65" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.childHalfWidth}>
                                    <Text style={styles.label}>Gender</Text>
                                    <DropDownPicker
                                        items={[
                                            { label: 'Male', value: 'male' },
                                            { label: 'Female', value: 'female' },
                                            { label: 'Other', value: 'other' },
                                        ]}
                                        placeholder='Select Gender'
                                        placeholderStyle={{ color: '#999' }}
                                        open={focusedField === `gender${index}`}
                                        value={child.gender}
                                        setOpen={() => setFocusedField(focusedField === `gender${index}` ? null : `gender${index}`)}
                                        setValue={(callback) => {
                                            const updatedChildrenFields = [...childrenFields];
                                            updatedChildrenFields[index].gender = callback(updatedChildrenFields[index].gender);
                                            setChildrenFields(updatedChildrenFields);
                                        }}
                                        containerStyle={styles.genderDropdown}
                                        style={styles.dropdown}
                                        dropDownContainerStyle={styles.dropdownList}
                                        listMode='SCROLLVIEW'
                                    />
                                </View>
                            </View>

                            {renderImagePicker(
                                "Child Photo",
                                child.image,
                                () => selectChildrenImage(index),
                                null,
                                0
                            )}

                            <View style={styles.childActions}>
                                {index === childrenFields.length - 1 && (
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => setChildrenFields([...childrenFields, { name: '', dob: null, gender: null, image: 'Select Image', uri: null, type: null }])}
                                    >
                                        <AntDesign name="plussquare" color="#051b65" size={32} />
                                        <Text style={styles.actionButtonText}>Add Child</Text>
                                    </TouchableOpacity>
                                )}
                                {index > 0 && (
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => setChildrenFields(childrenFields.filter((_, i) => i !== index))}
                                    >
                                        <AntDesign name="minussquare" color="#e96a01" size={32} />
                                        <Text style={styles.actionButtonText}>Remove</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </Animatable.View>
                    ))}
                </FormCard>
            )}

            <DatePicker
                modal
                mode="date"
                open={isChildDobOpen && selectedChildIndex !== null}
                date={selectedChildIndex !== null && childrenFields[selectedChildIndex]?.dob || new Date()}
                onConfirm={handleChildDobChange}
                onCancel={closeChildDobPicker}
                maximumDate={new Date()}
            />

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Previous"
                    onPress={() => handleNextTab('personal')}
                    variant="secondary"
                    style={styles.button}
                />
                <CustomButton
                    title="Next"
                    onPress={saveFamilyDetails}
                    style={styles.button}
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
    sectionTitle: {
        color: '#051b65',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    label: {
        color: '#333',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
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
    radioContainer: {
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    childContainer: {
        backgroundColor: '#f8f9ff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e8ecff',
    },
    childRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    childHalfWidth: {
        width: '48%',
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#e8e8e8',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    dateText: {
        flex: 1,
        color: '#333',
        fontSize: 14,
    },
    genderDropdown: {
        width: '100%',
    },
    dropdown: {
        backgroundColor: '#fff',
        borderColor: '#e8e8e8',
        borderWidth: 2,
        borderRadius: 10,
        minHeight: 40,
    },
    dropdownList: {
        backgroundColor: '#fff',
        borderColor: '#e8e8e8',
        elevation: 5,
    },
    childActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
    },
    actionButton: {
        alignItems: 'center',
        marginHorizontal: 16,
    },
    actionButtonText: {
        color: '#666',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    errorText: {
        color: '#ff4757',
        fontSize: 12,
        marginTop: -12,
        marginBottom: 8,
        marginLeft: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    button: {
        width: '45%',
    },
});

export default FamilyDetails;