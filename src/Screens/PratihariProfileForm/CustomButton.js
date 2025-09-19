import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

/**
 * @typedef {Object} CustomButtonProps
 * @property {string} title
 * @property {() => void} onPress
 * @property {object} [style]
 * @property {'primary' | 'secondary' | 'outline' | 'ghost'} [variant]
 * @property {boolean} [loading]
 * @property {boolean} [disabled]
 * @property {'small' | 'medium' | 'large'} [size]
 * @property {React.ReactNode} [icon]
 */
import PropTypes from 'prop-types';

const CustomButton = ({
    title,
    onPress,
    style,
    variant = 'primary',
    loading = false,
    disabled = false,
    size = 'medium',
    icon
}) => {
const getButtonColors = () => {
    if (disabled) return ['#E5E7EB', '#D1D5DB'];
    
    switch (variant) {
        case 'primary':
            return ['#6366F1', '#8B5CF6', '#A855F7'];
        case 'secondary':
            return ['#EC4899', '#F97316', '#EF4444'];
        case 'outline':
            return ['#FFFFFF', '#F9FAFB'];
        case 'ghost':
            return ['transparent', 'transparent'];
        default:
            return ['#6366F1', '#8B5CF6'];
    }
};

    const getTextColor = () => {
        if (disabled) return '#9CA3AF';
        if (variant === 'outline' || variant === 'ghost') return '#374151';
        return '#FFFFFF';
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return { paddingVertical: 12, paddingHorizontal: 20 };
            case 'large':
                return { paddingVertical: 18, paddingHorizontal: 36 };
            default:
                return { paddingVertical: 16, paddingHorizontal: 28 };
        }
    };

    return (
        <Animatable.View
            animation="fadeInUp"
            duration={600}
            style={[styles.buttonContainer, style]}
        >
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                style={[
                    styles.button,
                    variant === 'outline' && styles.outlineButton,
                    disabled && styles.disabledButton
                ]}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={getButtonColors()}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.gradient, getSizeStyles()]}
                >
                    <View style={styles.buttonContent}>
                        {loading ? (
                            <ActivityIndicator 
                                size="small" 
                                color={getTextColor()} 
                                style={styles.loader}
                            />
                        ) : (
                            <>
                                {icon && <View style={styles.iconContainer}>{icon}</View>}
                                <Text style={[styles.buttonText, { color: getTextColor() }]}>
                                    {title}
                                </Text>
                            </>
                        )}
                    </View>
                    {!disabled && !loading && (
                        <View style={styles.shimmer} />
                    )}
                </LinearGradient>
            </TouchableOpacity>
        </Animatable.View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    button: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    outlineButton: {
        borderWidth: 2,
        borderColor: '#6366F1',
    },
    disabledButton: {
        opacity: 0.6,
        elevation: 2,
        shadowOpacity: 0.05,
    },
    gradient: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    iconContainer: {
        marginRight: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    loader: {
        marginHorizontal: 8,
    },
    shimmer: {
        position: 'absolute',
        top: 0,
        left: -100,
        width: 100,
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        transform: [{ skewX: '-20deg' }],
        transform: [{ skewX: '-20deg' }],
    },
});

CustomButton.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    style: PropTypes.object,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    icon: PropTypes.node,
};

export default CustomButton;