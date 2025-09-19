import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

const FormHeader = () => {
    return (
        <LinearGradient
            colors={['#6366F1', '#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerContainer}
        >
            <View style={styles.headerContent}>
                <Animatable.View
                    animation="bounceIn"
                    duration={1200}
                    style={styles.logoContainer}
                >
                    <View style={styles.logoWrapper}>
                        <Animatable.Image
                            animation="pulse"
                            iterationCount="infinite"
                            duration={3000}
                            source={require('../../assets/images/icon876.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <View style={styles.logoGlow} />
                    </View>
                </Animatable.View>
                
                <Animatable.View
                    animation="fadeInUp"
                    duration={1000}
                    delay={500}
                    style={styles.titleContainer}
                >
                    <Text style={styles.title}>Registration Form</Text>
                    <Text style={styles.subtitle}>Complete your profile in simple steps</Text>
                </Animatable.View>
            </View>
            
            {/* Decorative elements */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
            <View style={styles.decorativeCircle3} />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        paddingVertical: 40,
        paddingHorizontal: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    headerContent: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    logoContainer: {
        marginBottom: 20,
    },
    logoWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        zIndex: 2,
    },
    logoGlow: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        zIndex: 1,
    },
    titleContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        fontWeight: '400',
    },
    decorativeCircle1: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    decorativeCircle2: {
        position: 'absolute',
        bottom: -30,
        left: -30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    decorativeCircle3: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
});

export default FormHeader;