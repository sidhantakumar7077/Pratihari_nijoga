import React, { useState, useEffect } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, TouchableOpacity, ActivityIndicator, PermissionsAndroid, Platform } from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { useNavigation } from '@react-navigation/native';
import { base_url } from '../../../App';

const Register = () => {

    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('+91');
    const [helthCardNumber, setHelthCardNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
            <ImageBackground source={require('../../assets/images/Login_BG.png')} style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                    <Image source={require('../../assets/images/whitelogo.png')} style={{ height: 130, width: 130, resizeMode: 'contain' }} />
                </View>
                <View style={styles.footer}>
                    {/* <Text style={{ fontSize: 18, fontFamily: 'okra', fontWeight: '600', color: '#fff', fontWeight: 'bold' }}>Welcome</Text>
                    <Text style={{ fontSize: 15, fontFamily: 'okra', fontWeight: '600', color: '#fff', marginBottom: 18, }}>Login to continue</Text> */}
                    <FloatingLabelInput
                        label="Phone Number"
                        value={phone}
                        customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
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
                    <FloatingLabelInput
                        label="Full Name"
                        value={name}
                        customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                        labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                        keyboardType="default"
                        onChangeText={value => setName(value)}
                        containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, marginHorizontal: 50, borderRadius: 100 }}
                    />
                    <FloatingLabelInput
                        label="Email Id"
                        value={email}
                        customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                        labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                        keyboardType="email-address"
                        onChangeText={value => setEmail(value)}
                        containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, marginHorizontal: 50, borderRadius: 100 }}
                    />
                    <FloatingLabelInput
                        label="Health Card Number"
                        value={helthCardNumber}
                        customLabelStyles={{ colorFocused: '#c80100', fontSizeFocused: 14 }}
                        labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                        keyboardType="default"
                        onChangeText={value => setHelthCardNumber(value)}
                        containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, marginHorizontal: 50, borderRadius: 100 }}
                    />
                    {showError && <Text style={styles.errorText}>{errorMessage}</Text>}
                </View>
                <View style={styles.bottom}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#c80100" />
                    ) : (
                        <TouchableOpacity onPress={() => navigation.navigate('Otp')} style={styles.button}>
                            <Text style={styles.buttonText}>SUBMIT</Text>
                        </TouchableOpacity>
                    )}
                    <View style={styles.ifNotRegistered}>
                        <Text style={{ color: '#000', fontSize: 16, fontFamily: 'Titillium Web' }}>Already Registered?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={{ color: '#c9170a', fontSize: 16, fontFamily: 'Titillium Web', fontWeight: 'bold', marginLeft: 5 }}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

export default Register;

const styles = StyleSheet.create({
    footer: {
        height: 260,
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
        marginBottom: 20,
        backgroundColor: '#c80100',
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
        color: 'red',
        marginTop: 10,
        fontSize: 14,
    },
});
