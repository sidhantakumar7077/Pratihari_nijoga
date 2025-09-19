import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as Animatable from 'react-native-animatable';
import { base_url } from '../../../App';

import FormCard from './FormCard';
import AnimatedInput from './AnimatedInput';
import CustomButton from './CustomButton';
import { useFormContext } from './FormContext';

const OccupationDetails = ({ handleNextTab }) => {
    const { setIsLoading } = useFormContext();

    const [occupationType, setOccupationType] = useState('');
    const [extraCuricularActivity, setExtraCuricularActivity] = useState(['']);
    const [occupationDetailsErrors, setOccupationDetailsErrors] = useState({});

    const addMoreExtraCuricularFields = () => {
        setExtraCuricularActivity([...extraCuricularActivity, '']);
    };

    const removeExtraCuricularFields = (index) => {
        const updatedFields = extraCuricularActivity.filter((_, i) => i !== index);
        setExtraCuricularActivity(updatedFields);
    };

    const validateOccupationFields = () => {
        const newErrors = {};

        if (!occupationType) newErrors.occupationType = 'Occupation Type is required';

        const extraErrors = extraCuricularActivity.map(activity => 
            activity.trim() ? '' : 'This field is required'
        );

        if (extraErrors.some(error => error)) {
            newErrors.extraCuricularActivity = extraErrors;
        }

        setOccupationDetailsErrors(newErrors);
        setTimeout(() => setOccupationDetailsErrors({}), 5000);

        return Object.keys(newErrors).length === 0;
    };

    const saveOccupationDetails = async () => {
        if (!validateOccupationFields()) return;

        setIsLoading(true);
        const token = await AsyncStorage.getItem('storeAccesstoken');
        const formData = new FormData();
        formData.append('occupation', occupationType);
        extraCuricularActivity.forEach((activity, index) => {
            formData.append(`extra_activity[${index}]`, activity);
        });

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
                handleNextTab('seba');
            } else {
                console.log("Error: ", data.message || 'Failed to save Occupation Details. Please try again.');
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
                <Text style={styles.title}>Occupation Details</Text>
                <View style={styles.titleUnderline} />
            </Animatable.View>

            <FormCard delay={200} gradient>
                <Text style={styles.sectionTitle}>Professional Information</Text>
                
                <AnimatedInput
                    label="Occupation Type*"
                    value={occupationType}
                    onChangeText={setOccupationType}
                    error={occupationDetailsErrors.occupationType}
                    delay={300}
                />

                <Text style={styles.activitySectionTitle}>Extra Curricular Activities</Text>
                
                {extraCuricularActivity.map((activity, index) => (
                    <Animatable.View
                        key={index}
                        animation="fadeInUp"
                        duration={600}
                        delay={400 + index * 100}
                        style={styles.activityContainer}
                    >
                        <View style={styles.activityRow}>
                            <View style={styles.activityInput}>
                                <AnimatedInput
                                    label={`Activity ${index + 1}*`}
                                    value={activity}
                                    onChangeText={(value) => {
                                        const updatedFields = [...extraCuricularActivity];
                                        updatedFields[index] = value;
                                        setExtraCuricularActivity(updatedFields);
                                    }}
                                    error={occupationDetailsErrors.extraCuricularActivity?.[index]}
                                />
                            </View>
                            <View style={styles.activityActions}>
                                {index === extraCuricularActivity.length - 1 && (
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={addMoreExtraCuricularFields}
                                    >
                                        <AntDesign name="plussquare" color="#051b65" size={32} />
                                        <Text style={styles.actionButtonText}>Add</Text>
                                    </TouchableOpacity>
                                )}
                                {index > 0 && (
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => removeExtraCuricularFields(index)}
                                    >
                                        <AntDesign name="minussquare" color="#e96a01" size={32} />
                                        <Text style={styles.actionButtonText}>Remove</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </Animatable.View>
                ))}

                <View style={styles.infoBox}>
                    <AntDesign name="infocirlce" color="#051b65" size={20} />
                    <Text style={styles.infoText}>
                        Add all your extra-curricular activities, hobbies, and interests that showcase your personality.
                    </Text>
                </View>
            </FormCard>

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Previous"
                    onPress={() => handleNextTab('address')}
                    variant="secondary"
                    style={styles.button}
                />
                <CustomButton
                    title="Next"
                    onPress={saveOccupationDetails}
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
        width: 160,
        height: 4,
        backgroundColor: '#051b65',
        borderRadius: 2,
    },
    sectionTitle: {
        color: '#051b65',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    activitySectionTitle: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 16,
        textAlign: 'center',
    },
    activityContainer: {
        marginBottom: 12,
    },
    activityRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    activityInput: {
        flex: 1,
        marginRight: 12,
    },
    activityActions: {
        paddingTop: 20,
        alignItems: 'center',
    },
    actionButton: {
        alignItems: 'center',
        marginBottom: 8,
        padding: 4,
    },
    actionButtonText: {
        color: '#666',
        fontSize: 10,
        marginTop: 4,
        fontWeight: '500',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f0f4ff',
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#051b65',
    },
    infoText: {
        flex: 1,
        color: '#666',
        fontSize: 14,
        marginLeft: 12,
        lineHeight: 20,
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

export default OccupationDetails;