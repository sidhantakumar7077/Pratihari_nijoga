import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';
import { base_url } from '../../../App';

import FormCard from './FormCard';
import AnimatedInput from './AnimatedInput';
import CustomButton from './CustomButton';
import { useFormContext } from './FormContext';

const IdCardDetails = ({ handleNextTab }) => {
    const { setIsLoading } = useFormContext();

    const [fields, setFields] = useState([
        { idProof: null, idProofNumber: '', idProofImage: 'Select Image', uri: null, type: null },
    ]);
    const [focusedField, setFocusedField] = useState(null);
    const [idCardDetailsErrors, setIdCardDetailsErrors] = useState({});

    const idProofOptions = [
        { label: 'Aadhaar Card', value: 'aadhar' },
        { label: 'PAN Card', value: 'pan' },
        { label: 'Voter ID', value: 'voter' },
        { label: 'Driving License', value: 'driving' },
        { label: 'Passport', value: 'passport' },
    ];

    const selectIdProofImage = (index) => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                selectionLimit: 1,
            },
            (response) => {
                if (!response.didCancel && response.assets) {
                    const { fileName, type, uri } = response.assets[0];
                    const updatedFields = [...fields];
                    updatedFields[index].idProofImage = fileName || 'Image Selected';
                    updatedFields[index].uri = uri;
                    updatedFields[index].type = type;
                    setFields(updatedFields);
                }
            }
        );
    };

    const addMoreFields = () => {
        setFields([
            ...fields,
            { idProof: null, idProofNumber: '', idProofImage: 'Select Image', uri: null, type: null },
        ]);
    };

    const removeFields = (index) => {
        const updatedFields = fields.filter((_, i) => i !== index);
        setFields(updatedFields);
    };

    const validateFields = () => {
        const newErrors = {};

        fields.forEach((field, index) => {
            if (!field.idProof) newErrors[`idProof${index}`] = 'ID Proof Type is required';
            if (!field.idProofNumber) newErrors[`idProofNumber${index}`] = 'ID Proof Number is required';
            if (!field.uri) newErrors[`idProofImage${index}`] = 'ID Proof Image is required';
        });

        setIdCardDetailsErrors(newErrors);
        setTimeout(() => setIdCardDetailsErrors({}), 5000);
        return Object.keys(newErrors).length === 0;
    };

    const saveIdCardDetails = async () => {
        if (!validateFields()) return;

        setIsLoading(true);
        const token = await AsyncStorage.getItem('storeAccesstoken');
        const formData = new FormData();
        fields.forEach((field, index) => {
            formData.append(`id_type[${index}]`, field.idProof);
            formData.append(`id_number[${index}]`, field.idProofNumber);
            if (field.uri) {
                formData.append(`id_photo[${index}]`, {
                    uri: field.uri,
                    type: field.type,
                    name: field.idProofImage,
                });
            }
        });

        try {
            const response = await fetch(base_url + "api/save-idcard", {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                console.log('ID Card Details saved successfully', data);
                handleNextTab('address');
            } else {
                console.log("Error: ", data.message || 'Failed to save ID Card Details. Please try again.');
            }
        } catch (error) {
            console.error("Network request failed: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderImagePicker = (field, index, error) => (
        <View>
            <Text style={styles.label}>ID Proof Image*</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={() => selectIdProofImage(index)}>
                <Text style={styles.imagePickerText}>{field.idProofImage}</Text>
                <View style={styles.chooseButton}>
                    <Text style={styles.chooseButtonText}>Choose File</Text>
                </View>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Animatable.View
                animation="fadeInDown"
                duration={600}
                style={styles.header}
            >
                <Text style={styles.title}>ID Card Details</Text>
                <View style={styles.titleUnderline} />
            </Animatable.View>

            {fields.map((field, index) => (
                <FormCard key={index} delay={200 + index * 100} gradient>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>ID Proof {index + 1}</Text>
                        <View style={styles.cardActions}>
                            {index === fields.length - 1 && (
                                <TouchableOpacity
                                    style={styles.addButton}
                                    onPress={addMoreFields}
                                >
                                    <AntDesign name="plussquare" color="#051b65" size={28} />
                                </TouchableOpacity>
                            )}
                            {index > 0 && (
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => removeFields(index)}
                                >
                                    <AntDesign name="minussquare" color="#e96a01" size={28} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <Animatable.View
                        animation="fadeInUp"
                        duration={600}
                        delay={300 + index * 100}
                    >
                        <Text style={styles.label}>Select ID Proof Type*</Text>
                        <DropDownPicker
                            items={idProofOptions}
                            placeholder='Choose ID Proof Type'
                            placeholderStyle={{ color: '#999' }}
                            open={focusedField === `idProof${index}`}
                            value={field.idProof}
                            setOpen={() => setFocusedField(focusedField === `idProof${index}` ? null : `idProof${index}`)}
                            setValue={(callback) => {
                                const updatedFields = [...fields];
                                updatedFields[index].idProof = callback(field.idProof);
                                setFields(updatedFields);
                            }}
                            containerStyle={styles.dropdownContainer}
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownList}
                            listMode='SCROLLVIEW'
                            zIndex={1000 - index}
                        />
                        {idCardDetailsErrors[`idProof${index}`] && (
                            <Text style={styles.errorText}>{idCardDetailsErrors[`idProof${index}`]}</Text>
                        )}
                    </Animatable.View>

                    <AnimatedInput
                        label="ID Proof Number*"
                        value={field.idProofNumber}
                        onChangeText={(value) => {
                            const updatedFields = [...fields];
                            updatedFields[index].idProofNumber = value;
                            setFields(updatedFields);
                        }}
                        keyboardType="default"
                        error={idCardDetailsErrors[`idProofNumber${index}`]}
                        delay={400 + index * 100}
                    />

                    <Animatable.View
                        animation="fadeInUp"
                        duration={600}
                        delay={500 + index * 100}
                    >
                        {renderImagePicker(field, index, idCardDetailsErrors[`idProofImage${index}`])}
                    </Animatable.View>
                </FormCard>
            ))}

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Previous"
                    onPress={() => handleNextTab('family')}
                    variant="secondary"
                    style={styles.button}
                />
                <CustomButton
                    title="Next"
                    onPress={saveIdCardDetails}
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
        width: 140,
        height: 4,
        backgroundColor: '#051b65',
        borderRadius: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        color: '#051b65',
        fontSize: 18,
        fontWeight: '600',
    },
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addButton: {
        marginLeft: 12,
        padding: 8,
    },
    removeButton: {
        marginLeft: 8,
        padding: 8,
    },
    label: {
        color: '#333',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    dropdownContainer: {
        marginBottom: 16,
        zIndex: 1000,
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
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderRadius: 12,
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

export default IdCardDetails;