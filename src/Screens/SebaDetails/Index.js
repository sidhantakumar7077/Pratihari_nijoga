import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { base_url } from '../../../App';

const SAMPLE = [
    { beddha_id: ['1', '2', '3'], id: 37, seba_id: '1', seba_name: 'Badadwara' },
    { beddha_id: ['3', '4', '5'], id: 38, seba_id: '2', seba_name: 'Dakhini' },
    { beddha_id: ['2', '3', '4'], id: 39, seba_id: '6', seba_name: 'Dwara Ghara Pratihari' },
    { beddha_id: ['1', '2', '3'], id: 41, seba_id: '1', seba_name: 'Badadwara' },
];

// ---- helpers ----
const joinUrl = (base, path) => {
    if (!base) return path;
    if (base.endsWith('/')) return base + path.replace(/^\//, '');
    return base + '/' + path.replace(/^\//, '');
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

const normalizeRow = (row, idx) => ({
    id: row?.id ?? idx,
    seba_id: String(row?.seba_id ?? ''),
    seba_name: String(row?.seba_name ?? ''),
    beddha_id: Array.isArray(row?.beddha_id)
        ? row.beddha_id.map((x) => String(x))
        : typeof row?.beddha_id === 'string'
            ? row.beddha_id.split(',').map((x) => x.trim())
            : [],
});

const Index = (props) => {

    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const mounted = useRef(false);

    const [query, setQuery] = useState('');
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchData = async (opts = { showLoader: true }) => {
        try {
            if (opts.showLoader) setLoading(true);
            setErrorMsg('');

            const token = await AsyncStorage.getItem('storeAccesstoken');
            const url = joinUrl(base_url, 'api/get-all-pratihari-profile');

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            const parsed = await parseResponseSafely(res);

            if (!mounted.current) return;

            if (!res.ok) {
                let msg = `Failed to load data (status ${res.status})`;
                if (parsed.kind === 'json' && parsed.data?.message) {
                    msg = parsed.data.message;
                } else if (parsed.kind === 'text') {
                    const preview = String(parsed.data).replace(/\s+/g, ' ').slice(0, 140);
                    msg = `${msg}. ${preview}`;
                }
                setErrorMsg(msg);
                // fallback to sample so page stays usable
                setRows(SAMPLE);
                return;
            }

            // Expecting shape: { success: true, data: { sebaDetails: [...] } }
            let payload = parsed.kind === 'json' ? parsed.data : null;
            const list = payload?.data?.sebaDetails;

            if (Array.isArray(list) && list.length) {
                const normalized = list.map(normalizeRow);
                setRows(normalized);
            } else {
                // No rows from server; still keep UI alive with empty
                setRows([]);
            }
        } catch (e) {
            if (!mounted.current) return;
            console.error('Fetch seba details error:', e);
            setErrorMsg('Network error. Please try again.');
            // Optional: light fallback
            setRows(SAMPLE);
        } finally {
            if (!mounted.current) return;
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        mounted.current = true;
        if (isFocused) {
            fetchData({ showLoader: true });
        }
        return () => {
            mounted.current = false;
        };
    }, [isFocused]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData({ showLoader: false });
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((r) => {
            const name = (r.seba_name || '').toLowerCase();
            const sid = String(r.seba_id || '').toLowerCase();
            return name.includes(q) || sid.includes(q);
        });
    }, [rows, query]);

    const renderChip = (text, idx) => (
        <View key={`${text}-${idx}`} style={styles.chip}>
            <Text style={styles.chipText}>Beddha {text}</Text>
        </View>
    );

    const renderCard = ({ item }) => (
        <View style={styles.card}>
            <LinearGradient colors={['#eef2ff', '#faf5ff']} style={styles.cardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.iconBadge}>
                        <Ionicons name="ribbon" size={18} color="#4f46e5" />
                    </View>
                    <Text style={styles.cardTitle}>{item.seba_name || '-'}</Text>
                </View>
                <View style={styles.idPill}>
                    <Text style={styles.idPillText}>Seba ID: {item.seba_id ?? '-'}</Text>
                </View>
            </LinearGradient>

            <View style={styles.cardBody}>
                {/* <Text style={styles.subLabel}>Beddha IDs</Text> */}
                <View style={styles.chipWrap}>
                    {(item.beddha_id || []).map((b, i) => renderChip(b, i))}
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.safeArea}>
            {/* Header */}
            <LinearGradient colors={['#4c1d95', '#6366f1']} style={styles.header}>
                <View style={styles.headerRow}>
                    <Ionicons name="arrow-back" size={24} color="#fff" onPress={() => navigation.goBack()} />
                    <Text style={styles.headerTitle}>Seba Details</Text>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.headerIconBtn} onPress={() => fetchData({ showLoader: true })}>
                            <Ionicons name="refresh" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.headerSubtitle}>Browse all seba & their beddha mappings</Text>

                {/* Search */}
                <View style={styles.searchWrap}>
                    <Ionicons name="search" size={18} color="#6b7280" style={{ marginRight: 8 }} />
                    <TextInput
                        placeholder="Search by seba name or id…"
                        placeholderTextColor="#9ca3af"
                        value={query}
                        onChangeText={setQuery}
                        style={styles.searchInput}
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')}>
                            <Ionicons name="close-circle" size={18} color="#9ca3af" />
                        </TouchableOpacity>
                    )}
                </View>
            </LinearGradient>

            {/* Content */}
            <View style={styles.content}>
                {loading ? (
                    <View style={styles.loaderWrap}>
                        <ActivityIndicator size="large" color="#4c1d95" />
                        <Text style={{ marginTop: 10, color: '#6b7280' }}>Loading seba details…</Text>
                    </View>
                ) : errorMsg ? (
                    <ScrollView
                        contentContainerStyle={styles.errorWrap}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    >
                        <Ionicons name="warning-outline" size={28} color="#b91c1c" />
                        <Text style={styles.errorTitle}>Couldn’t load data</Text>
                        <Text style={styles.errorSubtitle}>{errorMsg}</Text>
                        <TouchableOpacity style={styles.retryBtn} onPress={() => fetchData({ showLoader: true })}>
                            <Text style={styles.retryBtnText}>Try again</Text>
                        </TouchableOpacity>
                    </ScrollView>
                ) : filtered.length === 0 ? (
                    <ScrollView
                        contentContainerStyle={styles.emptyState}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    >
                        <View style={styles.emptyIconCircle}>
                            <Ionicons name="documents-outline" size={28} color="#6b7280" />
                        </View>
                        <Text style={styles.emptyTitle}>No matches found</Text>
                        <Text style={styles.emptySubtitle}>Try a different search term.</Text>
                    </ScrollView>
                ) : (
                    <FlatList
                        data={filtered}
                        keyExtractor={(item, idx) => String(item.id ?? idx)}
                        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
                        renderItem={renderCard}
                        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                )}
            </View>
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc' },
    header: {
        paddingTop: 12,
        paddingBottom: 24,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerTitle: { color: '#fff', fontSize: 26, fontFamily: 'Poppins-Bold' },
    headerActions: { flexDirection: 'row', gap: 10 },
    headerIconBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12 },
    headerSubtitle: { color: '#e2e8f0', fontSize: 14, marginTop: 6, textAlign: 'center' },
    searchWrap: {
        marginTop: 14,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 12,
        // paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.35)',
    },
    searchInput: { flex: 1, color: '#111827', fontSize: 15 },
    content: { flex: 1, marginTop: -12 },
    loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    errorWrap: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 },
    errorTitle: { marginTop: 6, fontSize: 16, fontWeight: '800', color: '#111827' },
    errorSubtitle: { marginTop: 2, fontSize: 13, color: '#6b7280', textAlign: 'center' },
    retryBtn: { marginTop: 12, backgroundColor: '#051b65', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12 },
    retryBtnText: { color: '#fff', fontWeight: '700', letterSpacing: 0.3 },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    cardHeader: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eef2ff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconBadge: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#e0e7ff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    cardTitle: { fontSize: 16, color: '#111827', fontWeight: '700' },
    idPill: { backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
    idPillText: { color: '#0f172a', fontSize: 12, fontWeight: '600' },
    cardBody: { paddingHorizontal: 14, paddingVertical: 12 },
    subLabel: {
        color: '#6b7280',
        fontSize: 12,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        fontWeight: '700',
    },
    chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
        backgroundColor: '#ecfeff',
        borderWidth: 1,
        borderColor: '#cffafe',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    chipText: { color: '#155e75', fontWeight: '700', fontSize: 12, letterSpacing: 0.3 },
    cardFooter: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    primaryBtn: {
        backgroundColor: '#051b65',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    primaryBtnText: { color: '#fff', fontWeight: '700', letterSpacing: 0.3 },
    secondaryBtn: {
        backgroundColor: '#f8fafc',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    secondaryBtnText: { color: '#111827', fontWeight: '700', letterSpacing: 0.3 },
    emptyState: { paddingHorizontal: 16, paddingTop: 40, alignItems: 'center' },
    emptyIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 999,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    emptyTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
    emptySubtitle: { fontSize: 13, color: '#6b7280', marginTop: 4 },
});