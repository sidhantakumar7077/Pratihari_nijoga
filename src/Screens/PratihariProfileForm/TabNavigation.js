import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

const TabNavigation = ({
    tabs,
    activeTab,
    setActiveTab,
    flatListRef,
    scrollToActiveTab
}) => {
    const isTabCompleted = (tabKey, activeTabKey) => {
        const activeIndex = tabs.findIndex(tab => tab.key === activeTabKey);
        const tabIndex = tabs.findIndex(tab => tab.key === tabKey);
        return tabIndex < activeIndex;
    };

    const isTabActive = (tabKey) => activeTab === tabKey;

    return (
        <View style={styles.tabContainer}>
            <FlatList
                ref={flatListRef}
                data={tabs}
                keyExtractor={(item) => item.key}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabListContainer}
                renderItem={({ item, index }) => {
                    const isActive = isTabActive(item.key);
                    const isCompleted = isTabCompleted(item.key, activeTab);
                    
                    return (
                        <View style={styles.tabItemContainer}>
                            {index !== 0 && (
                                <View style={styles.connectorContainer}>
                                    <LinearGradient
                                        colors={isActive || isCompleted ? ['#6366F1', '#8B5CF6'] : ['#E5E7EB', '#D1D5DB']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.connector}
                                    />
                                </View>
                            )}
                            <Animatable.View
                                animation={isActive ? 'pulse' : undefined}
                                duration={1500}
                                iterationCount={isActive ? 'infinite' : 1}
                                style={styles.tabWrapper}
                            >
                                <TouchableOpacity
                                    onPress={() => setActiveTab(item.key)}
                                    style={styles.tabButton}
                                    activeOpacity={0.8}
                                >
                                    {isActive ? (
                                        <LinearGradient
                                            colors={['#6366F1', '#8B5CF6', '#A855F7']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.activeTab}
                                        >
                                            <View style={styles.tabContent}>
                                                <MaterialCommunityIcons
                                                    name={item.icon}
                                                    size={24}
                                                    color="#FFFFFF"
                                                />
                                                <Text style={styles.activeTabText}>{item.label}</Text>
                                            </View>
                                            <View style={styles.activeTabGlow} />
                                        </LinearGradient>
                                    ) : (
                                        <View style={[
                                            styles.inactiveTab,
                                            isCompleted && styles.completedTab
                                        ]}>
                                            <View style={styles.tabContent}>
                                                <MaterialCommunityIcons
                                                    name={isCompleted ? 'check-circle' : item.icon}
                                                    size={22}
                                                    color={isCompleted ? '#10B981' : '#6B7280'}
                                                />
                                                <Text style={[
                                                    styles.inactiveTabText,
                                                    isCompleted && styles.completedTabText
                                                ]}>
                                                    {item.label}
                                                </Text>
                                            </View>
                                            {isCompleted && (
                                                <View style={styles.completedIndicator} />
                                            )}
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </Animatable.View>
                        </View>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        paddingVertical: 24,
        paddingHorizontal: 16,
        backgroundColor: '#F8FAFC',
    },
    tabListContainer: {
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    tabItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    connectorContainer: {
        marginHorizontal: 8,
    },
    connector: {
        width: 32,
        height: 4,
        borderRadius: 2,
    },
    tabWrapper: {
        alignItems: 'center',
    },
    tabButton: {
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    activeTab: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        minWidth: 100,
        position: 'relative',
        overflow: 'hidden',
    },
    inactiveTab: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 18,
        paddingVertical: 14,
        minWidth: 95,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        position: 'relative',
    },
    completedTab: {
        borderColor: '#10B981',
        backgroundColor: '#F0FDF4',
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    activeTabText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
        marginTop: 6,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    inactiveTabText: {
        color: '#6B7280',
        fontSize: 11,
        fontWeight: '600',
        marginTop: 5,
        textAlign: 'center',
    },
    completedTabText: {
        color: '#10B981',
        fontWeight: '700',
    },
    activeTabGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
    },
    completedIndicator: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#10B981',
    },
});

export default TabNavigation;