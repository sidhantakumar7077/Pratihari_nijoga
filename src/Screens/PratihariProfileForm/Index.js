import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { base_url } from '../../../App';

import PersonalDetails from './PersonalDetails';
import FamilyDetails from './FamilyDetails';
import IdCardDetails from './IdCardDetails';
import AddressDetails from './AddressDetails';
import OccupationDetails from './OccupationDetails';
import SebaDetails from './SebaDetails';
import SocialMediaDetails from './SocialMediaDetails';
import TabNavigation from './TabNavigation';
import FormHeader from './FormHeader';
import { FormProvider } from './FormContext';

const Index = () => {
    
    const tabs = [
        { key: 'personal', label: 'Personal', icon: 'account' },
        { key: 'family', label: 'Family', icon: 'account-supervisor' },
        { key: 'id_card', label: 'ID Card', icon: 'id-card' },
        { key: 'address', label: 'Address', icon: 'map-marker' },
        { key: 'occupation', label: 'Occupation', icon: 'account-tie' },
        { key: 'seba', label: 'Seba', icon: 'bank' },
        { key: 'social', label: 'Social Media', icon: 'web' },
    ];

    const [activeTab, setActiveTab] = useState('personal');
    const navigation = useNavigation();
    const flatListRef = useRef(null);


    const getPratihariStatus = async () => {
        const token = await AsyncStorage.getItem('storeAccesstoken');
        try {
            const response = await fetch(`${base_url}api/pratihari/status`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                console.log("Failed to fetch Pratihari status");
                return;
            }

            const result = await response.json();
            console.log("Pratihari Status Result:", result);

            if (result?.empty_tables && result.empty_tables.length > 0) {
                switch (result.empty_tables[0]) {
                    case 'profile':
                        setActiveTab('personal');
                        break;
                    case 'family':
                        setActiveTab('family');
                        break;
                    case 'id_card':
                        setActiveTab('id_card');
                        break;
                    case 'address':
                        setActiveTab('address');
                        break;
                    case 'occupation':
                        setActiveTab('occupation');
                        break;
                    case 'seba':
                        setActiveTab('seba');
                        break;
                    case 'social_media':
                        setActiveTab('social');
                        break;
                    default:
                        navigation.navigate('Home');
                        break;
                }
            } else {
                navigation.navigate('Home');
            }

        } catch (error) {
            console.error("Error fetching Pratihari status:", error);
        }
    };

    useEffect(() => {
        getPratihariStatus();
    }, []);

    const scrollToActiveTab = (index) => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                index,
                animated: true,
                viewPosition: 0.5,
            });
        }
    };

    const handleNextTab = (nextTab) => {
        const nextTabIndex = tabs.findIndex((tab) => tab.key === nextTab);
        setActiveTab(nextTab);
        scrollToActiveTab(nextTabIndex);
    };

    const renderTabContent = () => {
        const commonProps = {
            handleNextTab,
            activeTab,
            tabs,
            navigation
        };

        switch (activeTab) {
            case 'personal':
                return <PersonalDetails {...commonProps} />;
            case 'family':
                return <FamilyDetails {...commonProps} />;
            case 'id_card':
                return <IdCardDetails {...commonProps} />;
            case 'address':
                return <AddressDetails {...commonProps} />;
            case 'occupation':
                return <OccupationDetails {...commonProps} />;
            case 'seba':
                return <SebaDetails {...commonProps} />;
            case 'social':
                return <SocialMediaDetails {...commonProps} />;
            default:
                return <PersonalDetails {...commonProps} />;
        }
    };

    return (
        <FormProvider>
            <LinearGradient
                colors={['#F8FAFC', '#EFF6FF', '#F0F9FF']}
                style={styles.container}
            >
                <View style={styles.safeArea}>
                    <FormHeader />
                    <TabNavigation
                        tabs={tabs}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        flatListRef={flatListRef}
                        scrollToActiveTab={scrollToActiveTab}
                    />
                    <Animatable.View
                        key={activeTab}
                        animation="fadeInRight"
                        duration={600}
                        style={styles.contentContainer}
                    >
                        {renderTabContent()}
                    </Animatable.View>
                </View>
            </LinearGradient>
        </FormProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
    },
});

export default Index;