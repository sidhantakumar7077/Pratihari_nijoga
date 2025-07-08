import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { base_url } from '../../../App';

const Index = () => {

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#4c1d95', '#6366f1']}
        style={styles.header}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" marginRight={10} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pali History</Text>
        </View>
        <Text style={styles.headerSubtitle}>Explore the history of Pali events</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer}>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Index

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#e2e8f0',
    marginTop: 8,
  },
  scrollContainer: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#f8fafc',
  },
})