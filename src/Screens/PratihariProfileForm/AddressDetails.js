import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RadioForm from 'react-native-simple-radio-button';
import * as Animatable from 'react-native-animatable';
import { base_url } from '../../../App';

import FormCard from './FormCard';
import AnimatedInput from './AnimatedInput';
import CustomButton from './CustomButton';
import { useFormContext } from './FormContext';

const AddressDetails = ({ handleNextTab }) => {
    const { setIsLoading } = useFormContext();

    // Present Address State
    const [present_address, setPresent_address] = useState('');
    const [present_sahi, setPresent_sahi] = useState('');
    const [present_post, setPresent_post] = useState('');
    const [present_PS, setPresent_PS] = useState('');
    const [present_district, setPresent_district] = useState('');
    const [present_state, setPresent_state] = useState('');
    const [present_country, setPresent_country] = useState('');
    const [present_pincode, setPresent_pincode] = useState('');
    const [present_landmark, setPresent_landmark] = useState('');

    // Permanent Address State
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

        setAddressDetailsErrors(newErrors);
        setTimeout(() => setAddressDetailsErrors({}), 5000);

        return Object.keys(newErrors).length === 0;
    };

    const saveAddressDetails = async () => {
        if (!validateAddressFields()) return;

        setIsLoading(true);
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

        formData.append('same_as_permanent_address', isPermanentSameAsPresent);

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
                handleNextTab('occupation');
            } else {
                console.log("Error: ", data.message || 'Failed to save Address Details. Please try again.');
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
                <Text style={styles.title}>Address Details</Text>
                <View style={styles.titleUnderline} />
            </Animatable.View>

            {/* Present Address */}
            <FormCard delay={200} gradient>
                <Text style={styles.sectionTitle}>Present Address</Text>
                
                <View style={styles.inputRow}>
                    <AnimatedInput
                        label="Sahi*"
                        value={present_sahi}
                        onChangeText={setPresent_sahi}
                        error={addressDetailsErrors.present_sahi}
                        delay={250}
                        style={styles.halfWidth}
                    />
                    <AnimatedInput
                        label="Post Office*"
                        value={present_post}
                        onChangeText={setPresent_post}
                        error={addressDetailsErrors.present_post}
                        delay={300}
                        style={styles.halfWidth}
                    />
                </View>

                <AnimatedInput
                    label="Landmark*"
                    value={present_landmark}
                    onChangeText={setPresent_landmark}
                    error={addressDetailsErrors.present_landmark}
                    delay={350}
                />

                <View style={styles.inputRow}>
                    <AnimatedInput
                        label="Police Station*"
                        value={present_PS}
                        onChangeText={setPresent_PS}
                        error={addressDetailsErrors.present_PS}
                        delay={400}
                        style={styles.halfWidth}
                    />
                    <AnimatedInput
                        label="District*"
                        value={present_district}
                        onChangeText={setPresent_district}
                        error={addressDetailsErrors.present_district}
                        delay={450}
                        style={styles.halfWidth}
                    />
                </View>

                <View style={styles.inputRow}>
                    <AnimatedInput
                        label="State*"
                        value={present_state}
                        onChangeText={setPresent_state}
                        error={addressDetailsErrors.present_state}
                        delay={500}
                        style={styles.halfWidth}
                    />
                    <AnimatedInput
                        label="Pincode*"
                        value={present_pincode}
                        onChangeText={setPresent_pincode}
                        keyboardType="numeric"
                        maxLength={6}
                        error={addressDetailsErrors.present_pincode}
                        delay={550}
                        style={styles.halfWidth}
                    />
                </View>

                <AnimatedInput
                    label="Country*"
                    value={present_country}
                    onChangeText={setPresent_country}
                    error={addressDetailsErrors.present_country}
                    delay={600}
                />

                <AnimatedInput
                    label="Full Address*"
                    value={present_address}
                    onChangeText={setPresent_address}
                    error={addressDetailsErrors.present_address}
                    delay={650}
                />
            </FormCard>

            {/* Same as Present Address Option */}
            <FormCard delay={700}>
                <Animatable.View
                    animation="fadeInUp"
                    duration={600}
                    delay={750}
                >
                    <Text style={styles.questionText}>
                        Is permanent address same as present address?
                    </Text>
                    <RadioForm
                        radio_props={[
                            { label: 'Yes', value: true },
                            { label: 'No', value: false }
                        ]}
                        initial={isPermanentSameAsPresent ? 0 : 1}
                        formHorizontal={true}
                        labelHorizontal={true}
                        buttonColor={'#051b65'}
                        selectedButtonColor={'#051b65'}
                        animation={true}
                        onPress={(value) => setIsPermanentSameAsPresent(value)}
                        style={styles.radioContainer}
                    />
                </Animatable.View>
            </FormCard>

            {/* Permanent Address */}
            {!isPermanentSameAsPresent && (
                <FormCard delay={800} gradient>
                    <Text style={styles.sectionTitle}>Permanent Address</Text>
                    
                    <View style={styles.inputRow}>
                        <AnimatedInput
                            label="Sahi*"
                            value={permanent_sahi}
                            onChangeText={setPermanent_sahi}
                            error={addressDetailsErrors.permanent_sahi}
                            delay={850}
                            style={styles.halfWidth}
                        />
                        <AnimatedInput
                            label="Post Office*"
                            value={permanent_post}
                            onChangeText={setPermanent_post}
                            error={addressDetailsErrors.permanent_post}
                            delay={900}
                            style={styles.halfWidth}
                        />
                    </View>

                    <AnimatedInput
                        label="Landmark*"
                        value={permanent_landmark}
                        onChangeText={setPermanent_landmark}
                        error={addressDetailsErrors.permanent_landmark}
                        delay={950}
                    />

                    <View style={styles.inputRow}>
                        <AnimatedInput
                            label="Police Station*"
                            value={permanent_PS}
                            onChangeText={setPermanent_PS}
                            error={addressDetailsErrors.permanent_PS}
                            delay={1000}
                            style={styles.halfWidth}
                        />
                        <AnimatedInput
                            label="District*"
                            value={permanent_district}
                            onChangeText={setPermanent_district}
                            error={addressDetailsErrors.permanent_district}
                            delay={1050}
                            style={styles.halfWidth}
                        />
                    </View>

                    <View style={styles.inputRow}>
                        <AnimatedInput
                            label="State*"
                            value={permanent_state}
                            onChangeText={setPermanent_state}
                            error={addressDetailsErrors.permanent_state}
                            delay={1100}
                            style={styles.halfWidth}
                        />
                        <AnimatedInput
                            label="Pincode*"
                            value={permanent_pincode}
                            onChangeText={setPermanent_pincode}
                            keyboardType="numeric"
                            maxLength={6}
                            error={addressDetailsErrors.permanent_pincode}
                            delay={1150}
                            style={styles.halfWidth}
                        />
                    </View>

                    <AnimatedInput
                        label="Country*"
                        value={permanent_country}
                        onChangeText={setPermanent_country}
                        error={addressDetailsErrors.permanent_country}
                        delay={1200}
                    />

                    <AnimatedInput
                        label="Full Address*"
                        value={permanent_address}
                        onChangeText={setPermanent_address}
                        error={addressDetailsErrors.permanent_address}
                        delay={1250}
                    />
                </FormCard>
            )}

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Previous"
                    onPress={() => handleNextTab('id_card')}
                    variant="secondary"
                    style={styles.button}
                />
                <CustomButton
                    title="Next"
                    onPress={saveAddressDetails}
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
        width: 100,
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
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '48%',
    },
    questionText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'center',
    },
    radioContainer: {
        justifyContent: 'space-around',
        marginVertical: 10,
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

export default AddressDetails;