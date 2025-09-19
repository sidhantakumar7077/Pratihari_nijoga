import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import Collapsible from 'react-native-collapsible';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { base_url } from '../../../App';

import FormCard from './FormCard';
import CustomButton from './CustomButton';
import { useFormContext } from './FormContext';

const SebaDetails = ({ handleNextTab }) => {
    const { setIsLoading } = useFormContext();

    const [sebaDetails, setSebaDetails] = useState([]);
    const [activeSections, setActiveSections] = useState([]);
    const [selectedBedhas, setSelectedBedhas] = useState({});

    // Fetch Seba and Bedha details
    useEffect(() => {
        const fetchSebaAndBedhas = async () => {
            try {
                const response = await fetch(`${base_url}api/beddhas`);
                const data = await response.json();
                if (response.ok) {
                    setSebaDetails(data.data);
                    // Auto-expand first section
                    if (data.data.length > 0) {
                        setActiveSections([data.data[0].id]);
                    }
                } else {
                    console.error('Failed to fetch Seba and Bedhas:', data.message);
                }
            } catch (error) {
                console.error('Network request failed:', error);
            }
        };

        fetchSebaAndBedhas();
    }, []);

    const toggleSection = (sebaId) => {
        setActiveSections((prevSections) =>
            prevSections.includes(sebaId)
                ? prevSections.filter((id) => id !== sebaId)
                : [...prevSections, sebaId]
        );
    };

    const toggleBedhaSelection = (bedhaId) => {
        setSelectedBedhas((prevSelected) => ({
            ...prevSelected,
            [bedhaId]: !prevSelected[bedhaId],
        }));
    };

    const getSelectedBedhasForSeba = (sebaId) => {
        return sebaDetails
            .find(seba => seba.id === sebaId)
            ?.bedha?.filter(bedha => selectedBedhas[bedha.id])?.length || 0;
    };

    const saveSebaDetails = async () => {
        setIsLoading(true);
        const token = await AsyncStorage.getItem('storeAccesstoken');

        // Organize selected Bedhas under their respective Seba
        const sebaBedhaMap = {};
        sebaDetails.forEach((seba) => {
            const selectedBedhaIds = seba.bedha
                .filter((bedha) => selectedBedhas[bedha.id])
                .map((bedha) => {
                    const parts = bedha.id.split('_');
                    return parts[parts.length - 1];
                });

            if (selectedBedhaIds.length > 0) {
                sebaBedhaMap[seba.id] = selectedBedhaIds;
            }
        });

        // Extract seba_ids and beddha_id mapping
        const sebaIds = Object.keys(sebaBedhaMap).map(Number);
        const bedhaIdMapping = {};
        sebaIds.forEach((sebaId) => {
            bedhaIdMapping[sebaId] = sebaBedhaMap[sebaId];
        });

        // Construct the payload
        const sebaData = {
            nijoga_type: "4",
            seba_id: sebaIds,
            beddha_id: bedhaIdMapping,
        };

        try {
            const response = await fetch(base_url + "api/save-seba", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(sebaData),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Seba Details saved successfully', data);
                handleNextTab('social');
            } else {
                console.log("Error: ", data.message || 'Failed to save Seba Details. Please try again.');
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
                <Text style={styles.title}>Seba Details</Text>
                <View style={styles.titleUnderline} />
            </Animatable.View>

            <FormCard delay={200}>
                <View style={styles.instructionBox}>
                    <AntDesign name="infocirlce" color="#051b65" size={20} />
                    <Text style={styles.instructionText}>
                        Select the seba categories you're interested in, then choose specific bedhas from each category.
                    </Text>
                </View>

                {sebaDetails.map((seba, index) => {
                    const isActive = activeSections.includes(seba.id);
                    const selectedCount = getSelectedBedhasForSeba(seba.id);
                    
                    return (
                        <Animatable.View
                            key={seba.id}
                            animation="fadeInUp"
                            duration={600}
                            delay={300 + index * 100}
                            style={styles.sebaCard}
                        >
                            <TouchableOpacity
                                onPress={() => toggleSection(seba.id)}
                                style={styles.sebaHeader}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={isActive ? ['#051b65', '#0d2d8a'] : ['#f8f9ff', '#e8ecff']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.sebaHeaderGradient}
                                >
                                    <View style={styles.sebaHeaderContent}>
                                        <Text style={[
                                            styles.sebaHeaderText,
                                            isActive && styles.sebaHeaderTextActive
                                        ]}>
                                            {seba.name}
                                        </Text>
                                        <View style={styles.sebaHeaderRight}>
                                            {selectedCount > 0 && (
                                                <View style={styles.selectedBadge}>
                                                    <Text style={styles.selectedBadgeText}>{selectedCount}</Text>
                                                </View>
                                            )}
                                            <AntDesign
                                                name={isActive ? 'up' : 'down'}
                                                size={18}
                                                color={isActive ? '#fff' : '#051b65'}
                                                style={styles.expandIcon}
                                            />
                                        </View>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>

                            <Collapsible collapsed={!isActive}>
                                <Animatable.View
                                    animation="fadeInUp"
                                    duration={400}
                                    style={styles.bedhaContainer}
                                >
                                    {seba.bedha.map((bedha, bedhaIndex) => (
                                        <Animatable.View
                                            key={bedha.id}
                                            animation="fadeInRight"
                                            duration={300}
                                            delay={bedhaIndex * 50}
                                            style={styles.bedhaItem}
                                        >
                                            <TouchableOpacity
                                                style={[
                                                    styles.bedhaCheckbox,
                                                    selectedBedhas[bedha.id] && styles.bedhaCheckboxSelected
                                                ]}
                                                onPress={() => toggleBedhaSelection(bedha.id)}
                                                activeOpacity={0.8}
                                            >
                                                <CheckBox
                                                    value={selectedBedhas[bedha.id] || false}
                                                    onValueChange={() => toggleBedhaSelection(bedha.id)}
                                                    tintColors={{ true: '#051b65', false: '#ccc' }}
                                                />
                                                <Text style={[
                                                    styles.bedhaText,
                                                    selectedBedhas[bedha.id] && styles.bedhaTextSelected
                                                ]}>
                                                    {bedha.name}
                                                </Text>
                                            </TouchableOpacity>
                                        </Animatable.View>
                                    ))}
                                </Animatable.View>
                            </Collapsible>
                        </Animatable.View>
                    );
                })}

                {Object.keys(selectedBedhas).some(key => selectedBedhas[key]) && (
                    <Animatable.View
                        animation="fadeInUp"
                        duration={600}
                        style={styles.summaryBox}
                    >
                        <Text style={styles.summaryTitle}>Selected Seba Summary</Text>
                        <Text style={styles.summaryText}>
                            {Object.keys(selectedBedhas).filter(key => selectedBedhas[key]).length} bedhas selected
                        </Text>
                    </Animatable.View>
                )}
            </FormCard>

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Previous"
                    onPress={() => handleNextTab('occupation')}
                    variant="secondary"
                    style={styles.button}
                />
                <CustomButton
                    title="Next"
                    onPress={saveSebaDetails}
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
        width: 110,
        height: 4,
        backgroundColor: '#051b65',
        borderRadius: 2,
    },
    instructionBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f0f4ff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
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
    sebaCard: {
        marginBottom: 12,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    sebaHeader: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    sebaHeaderGradient: {
        borderRadius: 16,
    },
    sebaHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    sebaHeaderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#051b65',
        flex: 1,
    },
    sebaHeaderTextActive: {
        color: '#fff',
    },
    sebaHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedBadge: {
        backgroundColor: '#e96a01',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 8,
    },
    selectedBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    expandIcon: {
        marginLeft: 8,
    },
    bedhaContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    bedhaItem: {
        marginVertical: 4,
    },
    bedhaCheckbox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#f8f9ff',
        borderWidth: 1,
        borderColor: '#e8ecff',
    },
    bedhaCheckboxSelected: {
        backgroundColor: '#e8ecff',
        borderColor: '#051b65',
    },
    bedhaText: {
        marginLeft: 12,
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    bedhaTextSelected: {
        fontWeight: '600',
        color: '#051b65',
    },
    summaryBox: {
        backgroundColor: '#e8f5e8',
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2E7D32',
        marginBottom: 4,
    },
    summaryText: {
        fontSize: 14,
        color: '#4CAF50',
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

export default SebaDetails;