import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { base_url } from '../../../App';

export default function UpcomingPali() {

  const navigation = useNavigation();
  const [events, setEvents] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = await AsyncStorage.getItem('storeAccesstoken');
      const response = await fetch(`${base_url}api/pratihari-seba-dates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.status && typeof data.data === 'object') {
        setEvents(data.data);

        const marks = {};
        Object.keys(data.data).forEach(date => {
          marks[date] = {
            marked: true,
            dotColor: '#f59e0b',
          };
        });

        const today = moment().format('YYYY-MM-DD');
        if (data.data[today]) {
          marks[today] = {
            ...marks[today],
            selected: true,
            selectedColor: '#667eea',
            selectedTextColor: '#ffffff',
          };
        }

        setMarkedDates(marks);
        setSelectedDate(today);
      } else {
        console.warn('Unexpected data format:', data);
      }
    } catch (error) {
      console.log('Error fetching events:', error);
    }
  };

  const onDayPress = (day) => {
    const date = day.dateString;
    setSelectedDate(date);

    const updated = { ...markedDates };
    Object.keys(updated).forEach(k => {
      delete updated[k].selected;
      delete updated[k].selectedColor;
      delete updated[k].selectedTextColor;
    });

    updated[date] = {
      ...(updated[date] || {}),
      selected: true,
      selectedColor: '#667eea',
      selectedTextColor: '#ffffff',
    };

    setMarkedDates(updated);
  };

  const renderEventCard = ({ item }) => (
    <View style={styles.eventCard}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.eventGradient}>
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle}>{item.seba}</Text>
          <Text style={styles.eventSubtitle}>🕒 {item.time} | ID: {item.beddha_id}</Text>
        </View>
      </LinearGradient>
    </View>
  );

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
          <Text style={styles.headerTitle}>Upcoming Pali</Text>
        </View>
        <Text style={styles.headerSubtitle}>View upcoming Pali events and schedules</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.calendarWrapper}>
          <Calendar
            onDayPress={onDayPress}
            markedDates={markedDates}
            theme={{
              backgroundColor: '#f8fafc',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#94a3b8',
              selectedDayBackgroundColor: '#667eea',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#10b981',
              dayTextColor: '#1e293b',
              textDisabledColor: '#cbd5e1',
              dotColor: '#667eea',
              selectedDotColor: '#ffffff',
              arrowColor: '#667eea',
              monthTextColor: '#1e293b',
              textMonthFontWeight: '700',
              textDayFontWeight: '600',
              textDayHeaderFontWeight: '600',
              textMonthFontSize: 20,
              textDayFontSize: 16,
              textDayHeaderFontSize: 14,
            }}
            style={styles.calendar}
            enableSwipeMonths
          />
        </View>

        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>
            Events for {moment(selectedDate).format('dddd, MMMM D')}
          </Text>

          {events[selectedDate]?.length > 0 ? (
            <FlatList
              data={events[selectedDate]}
              renderItem={renderEventCard}
              scrollEnabled={false}
              keyExtractor={(_, i) => i.toString()}
              contentContainerStyle={{ paddingBottom: 30 }}
            />
          ) : (
            <View style={styles.noEventsContainer}>
              <Text style={styles.noEventsText}>No events scheduled</Text>
              <Text style={styles.noEventsSubtext}>Enjoy your peaceful day 🌿</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e2e8f0',
    marginTop: 6,
  },
  scrollContainer: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#f8fafc',
  },
  calendarWrapper: {
    marginTop: 15,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  calendar: {
    borderRadius: 16,
    padding: 10,
  },
  eventsSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  eventCard: {
    marginBottom: 14,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    backgroundColor: '#fff',
  },
  eventGradient: {
    padding: 16,
  },
  eventContent: {
    flexDirection: 'column',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  eventSubtitle: {
    fontSize: 14,
    color: '#e2e8f0',
    marginTop: 6,
  },
  noEventsContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 8,
  },
  noEventsSubtext: {
    fontSize: 14,
    color: '#94a3b8',
  },
});
