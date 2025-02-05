import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
            <Text style={styles.subtitle}>Your submission has been received successfully.</Text>
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
        backgroundColor: '#ff5722',
        padding: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
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
