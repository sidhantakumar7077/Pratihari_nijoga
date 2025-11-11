import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ToastAndroid,
    ActivityIndicator,
    Image,
    Platform,
} from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { base_url } from '../../../App';

const SAVE_URL = 'api/save-idcard';

const joinUrl = (base, path) => {
    if (!base) return path;
    if (base.endsWith('/')) return base + path.replace(/^\//, '');
    return base + '/' + path.replace(/^\//, '');
};

const fileFromAsset = (asset) => {
    if (!asset?.uri) return null;
    return {
        uri: Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', ''),
        type: asset.type || 'image/jpeg',
        name: asset.fileName || 'id_photo.jpg',
    };
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

const idProofItems = [
    { label: 'Aadhar Card', value: 'aadhar' },
    { label: 'PAN Card', value: 'pan' },
    { label: 'Voter ID', value: 'voter' },
    { label: 'Driving License', value: 'driving' },
];

const IDCard = (props) => {

    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    // ---- Form state ----
    const [fields, setFields] = useState([
        { idProof: null, idProofNumber: '', idProofImage: 'Select Image', uri: null, type: null },
    ]);
    // one "open" controller per-row for DropDownPicker
    const [openRow, setOpenRow] = useState(null);
    const [idCardDetailsErrors, setIdCardDetailsErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // ---- Image Picker ----
    const pickOneImage = async () => {
        const res = await launchImageLibrary({
            mediaType: 'photo',
            selectionLimit: 1,
            includeBase64: false,
        });
        if (res?.didCancel) return null;
        if (res?.errorCode) {
            console.log('ImagePicker Error: ', res.errorMessage || res.errorCode);
            return null;
        }
        return res?.assets?.[0] || null;
    };

    const selectIdProofImage = async (index) => {
        const asset = await pickOneImage();
        if (!asset) return;
        setFields((prev) => {
            const next = [...prev];
            next[index] = {
                ...next[index],
                idProofImage: asset.fileName || 'id_photo.jpg',
                uri: asset.uri,
                type: asset.type || 'image/jpeg',
            };
            return next;
        });
    };

    const addMoreFields = () => {
        setFields((prev) => [
            ...prev,
            { idProof: null, idProofNumber: '', idProofImage: 'Select Image', uri: null, type: null },
        ]);
    };

    const removeFields = (index) => {
        setFields((prev) => {
            if (prev.length === 1) return prev;
            const next = prev.filter((_, i) => i !== index);
            // close drop-down if its row got removed
            if (openRow === index) setOpenRow(null);
            return next;
        });
    };

    // ---- Validation ----
    const validateFields = () => {
        const newErrors = {};
        fields.forEach((field, index) => {
            if (!field.idProof) newErrors[`idProof${index}`] = 'ID Proof Type is required';
            if (!field.idProofNumber?.trim()) newErrors[`idProofNumber${index}`] = 'ID Proof Number is required';
            if (!field.uri) newErrors[`idProofImage${index}`] = 'ID Proof Image is required';
        });
        setIdCardDetailsErrors(newErrors);
        setTimeout(() => setIdCardDetailsErrors({}), 5000);
        return Object.keys(newErrors).length === 0;
    };

    // ---- Save ----
    const saveIdCardDetails = async () => {
        if (!validateFields()) return;

        setLoading(true);
        const token = await AsyncStorage.getItem('storeAccesstoken');
        const formData = new FormData();

        fields.forEach((field, index) => {
            formData.append(`id_type[${index}]`, field.idProof);
            formData.append(`id_number[${index}]`, field.idProofNumber.trim());
            if (field.uri) {
                const file = fileFromAsset({ uri: field.uri, type: field.type, fileName: field.idProofImage });
                if (file) {
                    formData.append(`id_photo[${index}]`, file);
                }
            }
        });

        const url = joinUrl(base_url, SAVE_URL);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    // don't set Content-Type; RN will set multipart boundary
                },
                body: formData,
            });

            const parsed = await parseResponseSafely(response);

            if (response.ok) {
                ToastAndroid.show('ID Card Details saved successfully', ToastAndroid.SHORT);
                navigation.goBack();
            } else {
                let msg = 'Failed to save ID Card Details';
                if (parsed.kind === 'json' && parsed.data?.message) {
                    msg = parsed.data.message;
                } else if (parsed.kind === 'text') {
                    const preview = String(parsed.data).replace(/\s+/g, ' ').slice(0, 140);
                    msg = `${msg}. Server said: ${preview}`;
                } else {
                    msg = `${msg}. Status: ${response.status}`;
                }
                ToastAndroid.show(msg, ToastAndroid.LONG);
            }
        } catch (error) {
            console.error('Network request failed: ', error);
            ToastAndroid.show('Network error. Please try again.', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };

    // ---- Prefill (optional) ----
    // Accepts an array of existing ID card rows from route params: [{id_type:'pan', id_number:'...', id_photo:'https://...'}, ...]
    useEffect(() => {
        const { data } = props.route?.params || {};
        if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((row) => ({
                idProof: row.id_type ?? null,
                idProofNumber: row.id_number ?? '',
                idProofImage: row.id_photo ? String(row.id_photo).split('/').pop() : 'Select Image',
                uri: row.id_photo || null, // preload as remote URI; you can choose to leave as null if server needs a re-upload
                type: null, // unknown from URL; will set when user picks a new one
            }));
            setFields(mapped);
        }
    }, [props.route?.params]);

    return (
        <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <LinearGradient colors={['#4c1d95', '#6366f1']} style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit ID Card</Text>
                </View>
                <Text style={styles.headerSubtitle}>Update your ID card information</Text>
            </LinearGradient>

            <ScrollView style={styles.scrollContainer}>
                <View style={{ flex: 1, paddingTop: 15 }}>
                    <View style={{ alignItems: 'center', marginBottom: 8 }}>
                        <Text style={{ color: '#000', fontSize: 18, fontFamily: 'Lora-BoldItalic' }}>ID Card Details</Text>
                        <Image
                            source={require('../../assets/images/element1.png')}
                            style={{ width: 130, height: 15 }}
                            resizeMode="contain"
                        />
                    </View>

                    {fields.map((field, index) => (
                        <View key={`idrow-${index}`} style={styles.cardBox}>
                            {/* Select ID Proof Dropdown */}
                            <Text style={[styles.label, (openRow === index || field.idProof !== null) && styles.focusedLabel]}>
                                Select ID Proof
                            </Text>
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                                <DropDownPicker
                                    items={idProofItems}
                                    placeholder="Select ID Proof"
                                    placeholderStyle={{ color: '#4d6285' }}
                                    open={openRow === index}
                                    setOpen={(isOpen) => setOpenRow(isOpen ? index : null)}
                                    value={field.idProof}
                                    setValue={(fn) => {
                                        const newVal = fn(field.idProof);
                                        setFields((prev) => {
                                            const next = [...prev];
                                            next[index].idProof = newVal;
                                            return next;
                                        });
                                    }}
                                    containerStyle={{ marginTop: 20, width: '70%' }}
                                    style={[styles.input, (openRow === index || field.idProof !== null) && styles.focusedInput]}
                                    dropDownContainerStyle={{ backgroundColor: '#fafafa', zIndex: 999 }}
                                    listMode="SCROLLVIEW"
                                />

                                <View style={{ width: '30%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    {index > 0 && (
                                        <TouchableOpacity onPress={() => removeFields(index)} style={{ marginLeft: 5 }}>
                                            <AntDesign name="minussquare" color="#e96a01" size={37} />
                                        </TouchableOpacity>
                                    )}
                                    {index === fields.length - 1 && (
                                        <TouchableOpacity style={{ marginLeft: 5 }} onPress={addMoreFields}>
                                            <AntDesign name="plussquare" color="#051b65" size={37} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                            {idCardDetailsErrors[`idProof${index}`] && (
                                <Text style={styles.errorText}>{idCardDetailsErrors[`idProof${index}`]}</Text>
                            )}

                            {/* ID Proof Number */}
                            <FloatingLabelInput
                                label="ID Proof Number"
                                value={field.idProofNumber}
                                customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                                onChangeText={(value) =>
                                    setFields((prev) => {
                                        const next = [...prev];
                                        next[index].idProofNumber = value;
                                        return next;
                                    })
                                }
                                autoCapitalize="characters" // PAN/Voter often uppercase
                                containerStyles={styles.floatingContainer}
                            />
                            {idCardDetailsErrors[`idProofNumber${index}`] && (
                                <Text style={styles.errorText}>{idCardDetailsErrors[`idProofNumber${index}`]}</Text>
                            )}

                            {/* ID Proof Image */}
                            <Text style={[styles.label, field.idProofImage !== 'Select Image' && styles.focusedLabel]}>
                                ID Proof Image
                            </Text>
                            <TouchableOpacity style={[styles.filePicker, { marginTop: 5 }]} onPress={() => selectIdProofImage(index)}>
                                <TextInput
                                    style={{ width: '70%', color: '#4d6285' }}
                                    editable={false}
                                    value={field.idProofImage}
                                />
                                <View style={styles.chooseBtn}>
                                    <Text style={styles.chooseBtnText}>Choose File</Text>
                                </View>
                            </TouchableOpacity>
                            {idCardDetailsErrors[`idProofImage${index}`] && (
                                <Text style={styles.errorText}>{idCardDetailsErrors[`idProofImage${index}`]}</Text>
                            )}
                        </View>
                    ))}

                    {/* Submit buttons */}
                    <View
                        style={{
                            width: '95%',
                            alignSelf: 'center',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{ width: '45%', backgroundColor: '#e96a01', borderRadius: 50, paddingVertical: 10, marginVertical: 15, alignItems: 'center' }}
                            disabled={loading}
                        >
                            <Text style={styles.submitText}>Previous</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={saveIdCardDetails}
                            style={{ width: '45%', backgroundColor: '#051b65', borderRadius: 50, paddingVertical: 10, marginVertical: 15, alignItems: 'center' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.submitText}>Next</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default IDCard;

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
    label: {
        color: '#757473',
        fontSize: 16,
    },
    focusedLabel: {
        color: '#e96a01',
        fontSize: 16,
        fontWeight: '500',
    },
    input: {
        height: 50,
        borderWidth: 0.5,
        borderColor: '#353535',
        backgroundColor: '#ffffff',
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    focusedInput: {
        height: 50,
        borderBottomColor: '#56ab2f',
        borderBottomWidth: 1,
    },
    floatingContainer: {
        borderWidth: 0.5,
        borderColor: '#353535',
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 10,
        marginVertical: 12,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 2,
        marginHorizontal: 10,
    },
    filePicker: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    chooseBtn: {
        backgroundColor: '#bbb',
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    chooseBtnText: {
        color: '#fff',
        fontWeight: '500',
    },
    errorText: {
        color: '#e96a01',
        fontSize: 12,
        marginTop: -8,
        marginBottom: 5,
    },
});