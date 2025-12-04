import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ToastAndroid,
    ActivityIndicator,
} from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { base_url } from '../../../App';

const SAVE_URL = 'api/save-occupation';

const joinUrl = (base, path) => {
    if (!base) return path;
    if (base.endsWith('/')) return base + path.replace(/^\//, '');
    return base + '/' + path.replace(/^\//, '');
};

const sanitizeActivitiesArray = (val) => {
    if (Array.isArray(val)) return val.map((s) => String(s ?? ''));
    if (typeof val === 'string') {
        if (!val.trim()) return [''];
        return val
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
    }
    return [''];
};

const parseResponseSafely = async (response) => {
    const ct = response.headers.get('content-type') || '';
    if (ct.toLowerCase().includes('application/json')) {
        try {
            const json = await response.json();
            return { kind: 'json', data: json };
        } catch { }
    }
    const text = await response.text();
    return { kind: 'text', data: text };
};

const Occupation = (props) => {

    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [occupationType, setOccupationType] = useState('');
    const [extraCuricularActivity, setExtraCuricularActivity] = useState(['']);
    const [occupationDetailsErrors, setOccupationDetailsErrors] = useState({});
    const [serverIds, setServerIds] = useState({ id: null, pratihari_id: null });

    const validateFields = () => {
        const errs = {};
        if (!occupationType?.trim()) errs.occupationType = 'Occupation Type is required';

        const perFieldErrors = [];
        extraCuricularActivity.forEach((v, idx) => {
            const trimmed = (v || '').trim();
            if (trimmed && trimmed.length < 2) perFieldErrors[idx] = 'Please enter at least 2 characters';
        });
        if (perFieldErrors.length) errs.extraCuricularActivity = perFieldErrors;

        setOccupationDetailsErrors(errs);
        setTimeout(() => setOccupationDetailsErrors({}), 5000);
        return Object.keys(errs).length === 0;
    };

    const addActivity = () => setExtraCuricularActivity((prev) => [...prev, '']);
    const removeActivity = (index) =>
        setExtraCuricularActivity((prev) => {
            if (prev.length === 1) return prev;
            const next = [...prev];
            next.splice(index, 1);
            return next;
        });

    const saveOccupationDetails = async () => {
        if (!validateFields()) return;

        setLoading(true);
        const token = await AsyncStorage.getItem('storeAccesstoken');

        // Clean activities as array (no CSV!)
        let activities = extraCuricularActivity
            .map((v) => (v || '').trim())
            .filter((v) => v.length > 0);

        // Ensure the backend receives an array even if empty,
        // so request('extra_activity') is an array, not a string/null.
        if (activities.length === 0) activities = [''];

        const formData = new FormData();
        formData.append('occupation', occupationType.trim());

        // THIS IS THE FIX: send an array
        activities.forEach((v) => {
            formData.append('extra_activity[]', v);
        });

        if (serverIds.pratihari_id) formData.append('pratihari_id', String(serverIds.pratihari_id));
        if (serverIds.id) formData.append('id', String(serverIds.id));

        const url = joinUrl(base_url, SAVE_URL);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    // Don't set Content-Type when sending FormData
                },
                body: formData,
            });

            const parsed = await parseResponseSafely(response);

            if (response.ok) {
                ToastAndroid.show('Occupation details saved successfully', ToastAndroid.SHORT);
                navigation.goBack();
            } else {
                let msg = 'Failed to save occupation details';
                if (parsed.kind === 'json' && parsed.data?.message) {
                    msg = parsed.data.message;
                } else if (parsed.kind === 'text' && parsed.data) {
                    const preview = String(parsed.data).replace(/\s+/g, ' ').slice(0, 140);
                    msg = `${msg}. Server said: ${preview}`;
                } else {
                    msg = `${msg}. Status: ${response.status}`;
                }
                ToastAndroid.show(msg, ToastAndroid.LONG);
            }
        } catch (err) {
            console.error('Network request failed: ', err);
            ToastAndroid.show('Network error. Please try again.', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };

    // Prefill from route params
    useEffect(() => {
        let { data } = props.route?.params || {};
        if (Array.isArray(data)) data = data[0];

        if (data) {
            setOccupationType(data.occupation_type || '');
            // Accept comma string from server and show as array
            setExtraCuricularActivity(sanitizeActivitiesArray(data.extra_activity || ''));
            setServerIds({
                id: data.id ?? null,
                pratihari_id: data.pratihari_id ?? null,
            });
        }
    }, [props.route?.params]);

    return (
        <View style={styles.safeArea}>
            <LinearGradient colors={['#4c1d95', '#6366f1']} style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Occupation</Text>
                </View>
                <Text style={styles.headerSubtitle}>Update your occupation.</Text>
            </LinearGradient>

            <ScrollView style={styles.scrollContainer}>
                <View style={styles.cardBox}>
                    {/* Occupation Type */}
                    <FloatingLabelInput
                        label="Occupation Type"
                        value={occupationType}
                        customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                        labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                        onChangeText={setOccupationType}
                        containerStyles={styles.floatingContainer}
                    />
                    {occupationDetailsErrors.occupationType && (
                        <Text style={styles.errorText}>{occupationDetailsErrors.occupationType}</Text>
                    )}

                    {/* Extra Curricular Activities */}
                    {extraCuricularActivity.map((field, index) => (
                        <View
                            key={`activity-${index}`}
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <View style={{ width: '70%' }}>
                                <FloatingLabelInput
                                    label="Extra Curricular Activity"
                                    value={field}
                                    customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                                    labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                    onChangeText={(value) => {
                                        const updated = [...extraCuricularActivity];
                                        updated[index] = value;
                                        setExtraCuricularActivity(updated);
                                    }}
                                    containerStyles={styles.floatingContainer}
                                />
                                {occupationDetailsErrors.extraCuricularActivity?.[index] && (
                                    <Text style={styles.errorText}>
                                        {occupationDetailsErrors.extraCuricularActivity[index]}
                                    </Text>
                                )}
                            </View>

                            <View style={{ width: '30%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                {extraCuricularActivity.length > 1 && (
                                    <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => removeActivity(index)}>
                                        <AntDesign name="minussquare" color="#e96a01" size={37} />
                                    </TouchableOpacity>
                                )}
                                {index === extraCuricularActivity.length - 1 && (
                                    <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => setExtraCuricularActivity((p) => [...p, ''])}>
                                        <AntDesign name="plussquare" color="#051b65" size={37} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Submit / Actions */}
                <View
                    style={{
                        width: '95%',
                        alignSelf: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        marginBottom: 20,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={[styles.navButton, { backgroundColor: '#e96a01' }]}
                        disabled={loading}
                    >
                        <Text style={styles.submitText}>Previous</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={saveOccupationDetails}
                        style={[styles.navButton, { backgroundColor: '#051b65' }]}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.submitText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default Occupation;

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc' },
    header: { paddingTop: 10, paddingBottom: 40, paddingHorizontal: 20 },
    headerTitle: { fontSize: 28, fontFamily: 'Poppins-Bold', color: '#ffffff' },
    headerSubtitle: { fontSize: 16, fontFamily: 'Inter-Regular', color: '#e2e8f0', marginTop: 8 },
    scrollContainer: { flex: 1, marginTop: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#f8fafc' },
    cardBox: {
        flex: 1,
        width: '95%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 10,
        borderRadius: 10,
    },
    floatingContainer: {
        borderWidth: 0.5,
        borderColor: '#353535',
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 10,
        marginVertical: 12,
    },
    submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1, marginBottom: 2, marginHorizontal: 10 },
    navButton: {
        width: '45%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 50,
        paddingVertical: 10,
        marginVertical: 15,
    },
    errorText: { color: '#e96a01', fontSize: 12, marginTop: -8, marginBottom: 5 },
});