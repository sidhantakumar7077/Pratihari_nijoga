import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, BackHandler } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';

const Index = () => {

    const navigation = useNavigation();
    const animationRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (animationRef.current) {
                animationRef.current.play(); // Restart animation
            }
        }, 5000); // Run every 10 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    useEffect(() => {
        const backAction = () => {
            // Prevent back button
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove(); // Clean up
    }, []);

    return (
        <View style={styles.container}>
            {/* Celebration Animation */}
            <LottieView
                ref={animationRef}
                source={require('../../assets/lottie/thankYou.json')} // Ensure the file path is correct
                autoPlay
                loop={false}
                style={styles.animation}
            />

            {/* Thank You Message */}
            <Text style={styles.title}>Thank You!</Text>
            <Text style={styles.subtitle}>Your submission has been received successfully. Please contact Pratihari Nijog office for further information.</Text>
            {/* Approved Information Text */}
            <View style={{
                backgroundColor: '#fff5f5',
                padding: 12,
                borderRadius: 10,
                borderLeftWidth: 4,
                borderLeftColor: '#F06292',
                marginTop: 15,
                marginHorizontal: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 4,
            }}>
                <Text style={{
                    fontSize: 16,
                    color: '#444',
                    lineHeight: 24,
                    textAlign: 'justify',
                }}>
                    <Text style={{ fontWeight: 'bold', color: '#E91E63' }}>⚠️ Note:</Text> You can login to the app after your account is approved by the Pratihari Nijog Office.
                </Text>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.button}>
                <Text style={styles.buttonText}>Go to Home</Text>
            </TouchableOpacity>

        </View>
    );
};

// Styles
const styles = {
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    animation: {
        width: 200,
        height: 200,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#051b65',
        padding: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10,
    },
};

export default Index;
