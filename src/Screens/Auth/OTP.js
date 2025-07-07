import React, { useState, useEffect } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Keyboard, ScrollView } from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { base_url } from '../../../App';

const OTP = (props) => {

    const navigation = useNavigation();
    const [otp, setOtp] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        if (otp.length === 6) {
            pressHandler();
        }
    }, [otp]);

    // const pressHandler = async () => {
    //     let platformName = DeviceInfo.getSystemName();
    //     let deviceModel = DeviceInfo.getModel();
    //     setIsLoading(true);
    //     try {
    //         if (otp === "" || otp.length != 6) {
    //             setErrorMessage('Please enter a valid OTP');
    //             setShowError(true);
    //             setTimeout(() => {
    //                 setShowError(false);
    //             }, 5000);
    //             setIsLoading(false);
    //             return;
    //         }

    //         const formData = new FormData();
    //         formData.append('orderId', props.route.params.order_id);
    //         formData.append('otp', otp);
    //         formData.append('phoneNumber', props.route.params.phone);
    //         formData.append('device_id', '1234567890');
    //         formData.append('platform', platformName);
    //         formData.append('device_model', deviceModel);

    //         // console.log("formData", formData);
    //         // return;

    //         const response = await fetch(base_url + "api/verify-otp", {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'multipart/form-data'
    //             },
    //             body: formData,
    //         });
    //         const data = await response.json();
    //         if (response.ok) {
    //             console.log('Login successfully', data);
    //             await AsyncStorage.setItem('storeAccesstoken', data.token);
    //             navigation.replace('PratihariForm');
    //         } else {
    //             // Handle error response
    //             console.log("Error-=-=1 ", data.message || 'Failed to Login. Please try again.');
    //             setErrorMessage(data.message || 'Failed to Login. Please try again.');
    //             setShowError(true);
    //             setTimeout(() => {
    //                 setShowError(false);
    //             }, 5000);
    //         }
    //     } catch (error) {
    //         setErrorMessage('Failed to Login. Please try again.--');
    //         setShowError(true);
    //         console.log("Error-=-=", error);
    //         setTimeout(() => {
    //             setShowError(false);
    //         }, 5000);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    const pressHandler = async () => {
        setIsLoading(true);
        try {
            if (otp === "" || otp.length !== 6) {
                setErrorMessage('Please enter a valid OTP');
                setShowError(true);
                setTimeout(() => setShowError(false), 5000);
                setIsLoading(false);
                return;
            }

            const formData = {
                otp: otp,
                phone: props.route.params.phone,
            };

            const response = await fetch(`${base_url}api/verify-otp`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json', // ✅ Corrected for JSON body
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful', data);
                await AsyncStorage.setItem('storeAccesstoken', data.token);
                navigation.replace('PratihariForm');
            } else {
                console.log("Error: ", data.message || 'Failed to Login. Please try again.');
                setErrorMessage(data.message || 'Failed to Login. Please try again.');
                setShowError(true);
                setTimeout(() => setShowError(false), 5000);
            }
        } catch (error) {
            console.log("API Error: ", error);
            setErrorMessage('Failed to Login. Please try again.');
            setShowError(true);
            setTimeout(() => setShowError(false), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                scrollEnabled={keyboardVisible}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                    <Image source={require('../../assets/images/icon876.png')} style={{ height: 350, width: 350, resizeMode: 'contain' }} />
                </View>
                <View style={styles.footer}>
                    {/* <Text style={{ fontSize: 18, fontFamily: 'okra', fontWeight: '600', color: '#353535', fontWeight: 'bold' }}>Enter OTP For Login</Text> */}
                    <Text style={{ fontSize: 16, fontFamily: 'okra', fontWeight: 'semibold', color: '#353535', marginBottom: 18, }}>Enter OTP For Login</Text>
                    <FloatingLabelInput
                        label="OTP"
                        value={otp}
                        customLabelStyles={{ colorFocused: '#051b65', fontSizeFocused: 14 }}
                        labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                        maxLength={6}
                        keyboardType="numeric"
                        onChangeText={value => setOtp(value)}
                        containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, marginHorizontal: 50, borderRadius: 100 }}
                    />
                    {/* {showError && <Text style={styles.errorText}>{errorMessage}</Text>} */}
                </View>
                <View style={styles.bottom}>
                    {isLoading ? (
                        <View style={{ marginBottom: 230 }}>
                            <ActivityIndicator size="large" color="#051b65" />
                        </View>
                    ) : (
                        <>
                            {showError && <Text style={styles.errorText}>{errorMessage}</Text>}
                            <TouchableOpacity onPress={pressHandler} style={styles.button}>
                                <Text style={styles.buttonText}>SUBMIT</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
                <View style={styles.footerWave}>
                    <Image
                        source={require('../../assets/images/bg987.png')}
                        style={{ width: '100%', height: '100%', marginTop: 10 }}
                        resizeMode="contain"
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default OTP

const styles = StyleSheet.create({
    footer: {
        // flex: 0.3,
        height: 135,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: 10,
        marginTop: 10,
    },

    textInput: {
        fontSize: 18,
        color: '#353535',
        marginVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#cacaca',
        fontFamily: 'Titillium Web',
    },
    bottom: {
        flex: 0.5,
        backgroundColor: 'transparent',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        padding: 10,
        height: 45,
        width: 150,
        // marginBottom: 230,
        backgroundColor: '#051b65',
        //padding: 10,
        borderRadius: 100,
        alignItems: 'center',
        shadowOffset: { height: 10, width: 10 },
        shadowOpacity: 0.6,
        shadowColor: 'black',
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#ffffff',
        fontFamily: 'Titillium Web',
    },
    errorText: {
        color: '#051b65',
        marginBottom: 15,
        fontSize: 14,
    },
    footerWave: {
        width: '100%',
        height: 78,
        zIndex: -1,
    },
})