import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TextInput, ViewStyle } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

/**
 * @typedef {Object} AnimatedInputProps
 * @property {string} label
 * @property {string} value
 * @property {(text: string) => void} onChangeText
 * @property {string=} error
 * @property {object=} style
 * @property {string=} keyboardType
 * @property {number=} maxLength
 * @property {boolean=} editable
 * @property {number=} delay
 * @property {boolean=} multiline
 * @property {number=} numberOfLines
 * @property {string=} placeholder
 */

const AnimatedInput = ({
    label,
    value,
    onChangeText,
    error,
    style,
    keyboardType = 'default',
    maxLength,
    editable = true,
    delay = 0,
    multiline = false,
    numberOfLines = 1,
    placeholder
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
    const shakeAnimation = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: isFocused || value ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isFocused, value]);

    React.useEffect(() => {
        if (error) {
            Animated.sequence([
                Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
                Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
                Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
                Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
            ]).start();
        }
    }, [error]);

    const labelStyle = {
        position: 'absolute',
        left: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 16],
        }),
        top: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [18, -8],
        }),
        fontSize: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [16, 12],
        }),
        color: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['#9CA3AF', isFocused ? '#6366F1' : '#374151'],
        }),
        backgroundColor: '#ffffff',
        paddingHorizontal: 4,
        zIndex: 1,
    };

    return (
        <Animatable.View
            animation="fadeInUp"
            duration={600}
            delay={delay}
            style={[styles.container, style]}
        >
            <Animated.View
                style={[
                    styles.inputContainer,
                    isFocused && styles.focusedContainer,
                    error && styles.errorContainer,
                    { transform: [{ translateX: shakeAnimation }] }
                ]}
            >
                <LinearGradient
                    colors={isFocused ? ['#F3F4F6', '#FFFFFF'] : ['#FFFFFF', '#F9FAFB']}
                    style={styles.gradientBackground}
                >
                    <Animated.Text style={labelStyle}>
                        {label}
                    </Animated.Text>
                    <TextInput
                        value={value}
                        onChangeText={onChangeText}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        keyboardType={keyboardType}
                        maxLength={maxLength}
                        editable={editable}
                        multiline={multiline}
                        numberOfLines={numberOfLines}
                        placeholder={placeholder}
                        placeholderTextColor="#9CA3AF"
                        style={[
                            styles.textInput,
                            multiline && styles.multilineInput,
                            !editable && styles.disabledInput
                        ]}
                    />
                    {isFocused && (
                        <View style={styles.focusIndicator} />
                    )}
                </LinearGradient>
            </Animated.View>
            {error && (
                <Animatable.View
                    animation="fadeInUp"
                    duration={300}
                    style={styles.errorContainer2}
                >
                    <View style={styles.errorIcon}>
                        <Text style={styles.errorIconText}>!</Text>
                    </View>
                    <Text style={styles.errorText}>
                        {error}
                    </Text>
                </Animatable.View>
            )}
        </Animatable.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
    },
    inputContainer: {
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    focusedContainer: {
        borderColor: '#6366F1',
        elevation: 4,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    errorContainer: {
        borderColor: '#EF4444',
        elevation: 4,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    gradientBackground: {
        paddingHorizontal: 16,
        paddingVertical: 18,
        position: 'relative',
    },
    textInput: {
        fontSize: 16,
        color: '#111827',
        paddingTop: 8,
        paddingBottom: 0,
        minHeight: 24,
        fontWeight: '500',
    },
    multilineInput: {
        minHeight: 80,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    disabledInput: {
        color: '#9CA3AF',
        backgroundColor: 'transparent',
    },
    focusIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#6366F1',
    },
    errorContainer2: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginLeft: 4,
    },
    errorIcon: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#EF4444',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
    },
    errorIconText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        fontWeight: '500',
        flex: 1,
    },
});

export default AnimatedInput;