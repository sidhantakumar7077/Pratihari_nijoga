import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

/**
 * @typedef {Object} FormCardProps
 * @property {React.ReactNode} children
 * @property {import('react-native').ViewStyle} [style]
 * @property {boolean} [gradient]
 * @property {number} [delay]
 * @property {'default' | 'elevated' | 'glass'} [variant]
 */

/**
 * @param {FormCardProps} props
 */
const FormCard = ({
    children,
    style,
    gradient = false,
    delay = 0,
    variant = 'default'
}) => {
    const getCardStyle = () => {
        switch (variant) {
            case 'elevated':
                return styles.elevatedCard;
            case 'glass':
                return styles.glassCard;
            default:
                return styles.defaultCard;
        }
    };

    const CardComponent = gradient ? LinearGradient : View;
    const cardProps = gradient
        ? {
            colors: ['#FFFFFF', '#F8FAFC', '#FFFFFF'],
            start: { x: 0, y: 0 },
            end: { x: 1, y: 1 },
        }
        : {};

    return (
        <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={delay}
            style={[styles.cardContainer, style]}
        >
            <CardComponent {...cardProps} style={[getCardStyle(), styles.card]}>
                <View style={styles.cardContent}>
                    {children}
                </View>
                {/* Decorative elements */}
                <View style={styles.decorativeTop} />
                <View style={styles.decorativeBottom} />
            </CardComponent>
        </Animatable.View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        marginVertical: 12,
        marginHorizontal: 16,
    },
    card: {
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
    },
    defaultCard: {
        backgroundColor: '#FFFFFF',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.8)',
    },
    elevatedCard: {
        backgroundColor: '#FFFFFF',
        elevation: 16,
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.1)',
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    cardContent: {
        padding: 24,
        zIndex: 1,
    },
    decorativeTop: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(99, 102, 241, 0.05)',
        transform: [{ translateX: 50 }, { translateY: -50 }],
    },
    decorativeBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(236, 72, 153, 0.05)',
        transform: [{ translateX: -40 }, { translateY: 40 }],
    },
});

export default FormCard;