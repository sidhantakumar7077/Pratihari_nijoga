import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { base_url } from '../../../App';

import FormCard from './FormCard';
import AnimatedInput from './AnimatedInput';
import CustomButton from './CustomButton';
import { useFormContext } from './FormContext';

const SocialMediaDetails = ({ handleNextTab, navigation }) => {
    const { setIsLoading } = useFormContext();

    const [facebook_url, setFacebook_url] = useState('');
    const [twitter_url, setTwitter_url] = useState('');
    const [instagram_url, setInstagram_url] = useState('');
    const [linkedin_url, setLinkedin_url] = useState('');
    const [youtube_url, setYoutube_url] = useState('');

    const socialMediaPlatforms = [
        {
            name: 'Facebook',
            value: facebook_url,
            onChange: setFacebook_url,
            placeholder: 'https://facebook.com/yourprofile',
            icon: 'facebook',
            color: '#1877F2',
            delay: 300,
        },
        {
            name: 'Instagram',
            value: instagram_url,
            onChange: setInstagram_url,
            placeholder: 'https://instagram.com/yourprofile',
            icon: 'instagram',
            color: '#E4405F',
            delay: 350,
        },
        {
            name: 'X (Twitter)',
            value: twitter_url,
            onChange: setTwitter_url,
            placeholder: 'https://x.com/yourprofile',
            icon: 'twitter',
            color: '#000000',
            delay: 400,
        },
        {
            name: 'LinkedIn',
            value: linkedin_url,
            onChange: setLinkedin_url,
            placeholder: 'https://linkedin.com/in/yourprofile',
            icon: 'linkedin',
            color: '#0A66C2',
            delay: 450,
        },
        {
            name: 'YouTube',
            value: youtube_url,
            onChange: setYoutube_url,
            placeholder: 'https://youtube.com/c/yourchannel',
            icon: 'youtube',
            color: '#FF0000',
            delay: 500,
        },
    ];

    const saveSocialMediaDetails = async () => {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('storeAccesstoken');
        const socialMediaData = {
            facebook: facebook_url,
            instagram: instagram_url,
            youtube: youtube_url,
            twitter: twitter_url,
            linkedin: linkedin_url
        };

        try {
            const response = await fetch(base_url + "api/save-socialmedia", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(socialMediaData),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Social Media Details saved successfully', data);
                navigation.navigate('ThankYouPage');
            } else {
                console.log("Error: ", data.message || 'Failed to save Social Media Details. Please try again.');
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
                <Text style={styles.title}>Social Media</Text>
                <View style={styles.titleUnderline} />
                <Text style={styles.subtitle}>
                    Connect your social media profiles (optional)
                </Text>
            </Animatable.View>

            <FormCard delay={200} gradient>
                <View style={styles.instructionBox}>
                    <AntDesign name="infocirlce" color="#051b65" size={20} />
                    <Text style={styles.instructionText}>
                        Add your social media profiles to help others connect with you. All fields are optional.
                    </Text>
                </View>

                {socialMediaPlatforms.map((platform) => (
                    <Animatable.View
                        key={platform.name}
                        animation="fadeInUp"
                        duration={600}
                        delay={platform.delay}
                        style={styles.platformContainer}
                    >
                        <View style={styles.platformHeader}>
                            <MaterialCommunityIcons
                                name={platform.icon}
                                size={24}
                                color={platform.color}
                            />
                            <Text style={styles.platformName}>{platform.name}</Text>
                        </View>
                        
                        <AnimatedInput
                            label={`${platform.name} URL`}
                            value={platform.value}
                            onChangeText={platform.onChange}
                            keyboardType="url"
                            delay={platform.delay + 50}
                        />
                        
                        {platform.value && (
                            <Text style={styles.previewText}>
                                Preview: {platform.value}
                            </Text>
                        )}
                    </Animatable.View>
                ))}

                <Animatable.View
                    animation="fadeInUp"
                    duration={600}
                    delay={600}
                    style={styles.tipBox}
                >
                    <MaterialCommunityIcons name="lightbulb-outline" size={20} color="#e96a01" />
                    <Text style={styles.tipText}>
                        <Text style={styles.tipTitle}>Pro Tip: </Text>
                        Make sure your social media profiles are public or professional to maximize networking opportunities.
                    </Text>
                </Animatable.View>
            </FormCard>

            {/* Progress Summary */}
            <Animatable.View
                animation="fadeInUp"
                duration={600}
                delay={700}
                style={styles.progressCard}
            >
                <Text style={styles.progressTitle}>🎉 You're Almost Done!</Text>
                <Text style={styles.progressText}>
                    This is the final step. Click "Complete" to finish your registration.
                </Text>
                <View style={styles.progressBar}>
                    <View style={styles.progressFill} />
                </View>
                <Text style={styles.progressPercentage}>100%</Text>
            </Animatable.View>

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Previous"
                    onPress={() => handleNextTab('seba')}
                    variant="secondary"
                    style={styles.button}
                />
                <CustomButton
                    title="Complete"
                    onPress={saveSocialMediaDetails}
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
        width: 120,
        height: 4,
        backgroundColor: '#051b65',
        borderRadius: 2,
        marginBottom: 8,
    },
    subtitle: {
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
    },
    instructionBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f0f4ff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#051b65',
    },
    instructionText: {
        flex: 1,
        color: '#666',
        fontSize: 14,
        marginLeft: 12,
        lineHeight: 20,
    },
    platformContainer: {
        marginBottom: 20,
        padding: 16,
        backgroundColor: '#f8f9ff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e8ecff',
    },
    platformHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    platformName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 12,
    },
    previewText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        fontStyle: 'italic',
    },
    tipBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fff5e6',
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#e96a01',
    },
    tipText: {
        flex: 1,
        color: '#666',
        fontSize: 14,
        marginLeft: 12,
        lineHeight: 20,
    },
    tipTitle: {
        fontWeight: '600',
        color: '#e96a01',
    },
    progressCard: {
        backgroundColor: '#e8f5e8',
        borderRadius: 16,
        padding: 20,
        marginVertical: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    progressTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2E7D32',
        marginBottom: 8,
        textAlign: 'center',
    },
    progressText: {
        fontSize: 14,
        color: '#4CAF50',
        textAlign: 'center',
        marginBottom: 16,
    },
    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginBottom: 8,
        overflow: 'hidden',
    },
    progressFill: {
        width: '100%',
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 4,
    },
    progressPercentage: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2E7D32',
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

export default SocialMediaDetails;