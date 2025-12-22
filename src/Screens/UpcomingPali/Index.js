import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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

  const TODAY = moment().format('YYYY-MM-DD');
  const INITIAL_MONTH_KEY = moment().format('YYYY-MM'); // e.g. "2025-12"

  const [events, setEvents] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(TODAY);

  // This controls which month events show in the FlatList
  const [visibleMonthKey, setVisibleMonthKey] = useState(INITIAL_MONTH_KEY);

  // Build calendar marks:
  // - Event dates: round border
  // - Today's date: different border color (even if not selected)
  // - Selected date: filled round background
  const buildMarks = (eventsByDate, selected) => {
    const marks = {};

    Object.keys(eventsByDate || {}).forEach((date) => {
      const isToday = date === TODAY;

      marks[date] = {
        customStyles: {
          container: {
            width: 34,
            height: 34,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: isToday ? '#10b981' : '#f59e0b',
            borderRadius: 999,
            backgroundColor: 'transparent',
          },
          text: {
            color: '#1e293b',
            fontWeight: '600',
          },
        },
      };
    });

    // Always highlight selected date (even if no events)
    if (selected) {
      marks[selected] = {
        ...(marks[selected] || {}),
        customStyles: {
          container: {
            width: 34,
            height: 34,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: '#667eea',
            backgroundColor: '#667eea',
            borderRadius: 999,
          },
          text: {
            color: '#ffffff',
            fontWeight: '700',
          },
        },
      };
    }

    return marks;
  };

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

        setSelectedDate(TODAY);
        setVisibleMonthKey(moment(TODAY).format('YYYY-MM'));
        setMarkedDates(buildMarks(data.data, TODAY));
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
    setMarkedDates(buildMarks(events, date));
  };

  const onMonthChange = (m) => {
    // m = { year: 2025, month: 12, ... }
    const monthKey = `${m.year}-${String(m.month).padStart(2, '0')}`;
    setVisibleMonthKey(monthKey);
  };

  // Flatten ONLY visible month events into a single FlatList dataset with date headers
  const monthEventsList = useMemo(() => {
    const rows = [];

    const dates = Object.keys(events || {})
      .filter((date) => date.startsWith(visibleMonthKey)) // "YYYY-MM"
      .sort((a, b) => a.localeCompare(b));

    dates.forEach((date) => {
      const dayEvents = events[date];
      if (!Array.isArray(dayEvents) || dayEvents.length === 0) return;

      rows.push({ type: 'header', id: `h-${date}`, date });

      dayEvents.forEach((ev, idx) => {
        rows.push({
          type: 'event',
          id: `e-${date}-${idx}`,
          date,
          ...ev,
        });
      });
    });

    return rows;
  }, [events, visibleMonthKey]);

  const renderRow = ({ item }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.dateHeader}>
          <Text style={styles.dateHeaderText}>
            {moment(item.date).format('dddd, MMMM D, YYYY')}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.eventCard}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.eventGradient}>
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle}>{item.seba}</Text>
            <Text style={styles.eventSubtitle}>
              🕒 {item.time} | Beddha: {item.beddha_id}
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const visibleMonthLabel = useMemo(() => {
    // visibleMonthKey: "YYYY-MM"
    return moment(`${visibleMonthKey}-01`).format('MMMM YYYY');
  }, [visibleMonthKey]);

  return (
    <View style={styles.safeArea}>
      <LinearGradient colors={['#4c1d95', '#6366f1']} style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upcoming Pali</Text>
        </View>
        <Text style={styles.headerSubtitle}>View upcoming Pali events and schedules</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.calendarWrapper}>
          <Calendar
            markingType="custom"
            onDayPress={onDayPress}
            onMonthChange={onMonthChange}
            markedDates={markedDates}
            theme={{
              backgroundColor: '#f8fafc',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#94a3b8',
              todayTextColor: '#10b981',
              dayTextColor: '#1e293b',
              textDisabledColor: '#cbd5e1',
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
          <Text style={styles.sectionTitle}>Events in {visibleMonthLabel}</Text>

          {monthEventsList.length > 0 ? (
            <FlatList
              data={monthEventsList}
              renderItem={renderRow}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: 30 }}
            />
          ) : (
            <View style={styles.noEventsContainer}>
              <Text style={styles.noEventsText}>No events scheduled</Text>
              <Text style={styles.noEventsSubtext}>in {visibleMonthLabel}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },

  header: {
    paddingTop: 10,
    paddingBottom: 40,
    paddingHorizontal: 20,
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

  dateHeader: {
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  dateHeaderText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
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
    marginTop: 4,
  },

  selectedInfo: {
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  selectedInfoText: {
    fontSize: 13,
    color: '#64748b',
  },
});