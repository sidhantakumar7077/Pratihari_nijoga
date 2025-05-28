import React, { useState, useEffect } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, ActivityIndicator, PermissionsAndroid, Platform, KeyboardAvoidingView, Keyboard, ScrollView } from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { useNavigation } from '@react-navigation/native';
import { base_url } from '../../../App';

const Login = () => {

    const navigation = useNavigation();
    const [phone, setPhone] = useState('+91');
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

    const pressHandler = async () => {
        setIsLoading(true);
        // const strippedPhone = phone.replace(/^\+91/, '');
        try {
            const phoneRegex = /^\+91\d{10}$/;
            if (phone === "" || !phoneRegex.test(phone)) {
                setErrorMessage('Please enter a valid phone number');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
                setIsLoading(false);
                return;
            }

            const response = await fetch(base_url + 'api/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: phone }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('OTP sent successfully', data);
                let phone_orderId = {
                    phone: phone,
                    order_id: data.order_id
                }
                navigation.navigate('Otp', phone_orderId);
            } else {
                // Handle error response
                setErrorMessage(data.message || 'Failed to send OTP. Please try again.');
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 5000);
            }
        } catch (error) {
            setErrorMessage('Failed to send OTP. Please try again.');
            setShowError(true);
            console.log("Error", error);
            setTimeout(() => {
                setShowError(false);
            }, 5000);
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
                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                    <Image source={require('../../assets/images/icon876.png')} style={{ height: 350, width: 350, resizeMode: 'contain' }} />
                </View>
                <View style={styles.footer}>
                    <Text style={{ fontSize: 18, fontFamily: 'okra', fontWeight: '600', color: '#353535', fontWeight: 'bold' }}>Welcome</Text>
                    <Text style={{ fontSize: 15, fontFamily: 'okra', fontWeight: '600', color: '#353535', marginBottom: 18, }}>Login to continue</Text>
                    <FloatingLabelInput
                        label="Phone Number"
                        value={phone}
                        customLabelStyles={{ colorFocused: '#051b65', fontSizeFocused: 14 }}
                        labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                        maxLength={13}
                        keyboardType="phone-pad"
                        onChangeText={value => {
                            if (value.length >= 4 || value.startsWith('+91')) {
                                setPhone(value);
                            } else {
                                setPhone('+91');
                            }
                        }}
                        containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, marginHorizontal: 50, borderRadius: 100 }}
                    />
                    {showError && <Text style={styles.errorText}>{errorMessage}</Text>}
                </View>
                <View style={styles.bottom}>
                    {isLoading ? (
                        <View style={{}}>
                            <ActivityIndicator size="large" color="#051b65" />
                        </View>
                    ) : (
                        <>
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
    );
};

export default Login;

const styles = StyleSheet.create({
    footer: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: 10,
        marginTop: 10,
    },
    ifNotRegistered: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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
        flex: 1,
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
});
