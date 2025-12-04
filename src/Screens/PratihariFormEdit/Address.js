import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  FlatList,
  ToastAndroid,
  ActivityIndicator
} from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RadioForm from 'react-native-simple-radio-button';
import { base_url } from '../../../App';
import LinearGradient from 'react-native-linear-gradient';

const Address = (props) => {

  const navigation = useNavigation();
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);

  const [present_address, setPresent_address] = useState('');
  const [present_sahi, setPresent_sahi] = useState('');
  const [present_post, setPresent_post] = useState('');
  const [present_PS, setPresent_PS] = useState('');
  const [present_district, setPresent_district] = useState('');
  const [present_state, setPresent_state] = useState('');
  const [present_country, setPresent_country] = useState('');
  const [present_pincode, setPresent_pincode] = useState('');
  const [present_landmark, setPresent_landmark] = useState('');
  const [isPermanentSameAsPresent, setIsPermanentSameAsPresent] = useState(true);
  const [permanent_address, setPermanent_address] = useState('');
  const [permanent_sahi, setPermanent_sahi] = useState('');
  const [permanent_post, setPermanent_post] = useState('');
  const [permanent_PS, setPermanent_PS] = useState('');
  const [permanent_district, setPermanent_district] = useState('');
  const [permanent_state, setPermanent_state] = useState('');
  const [permanent_country, setPermanent_country] = useState('');
  const [permanent_pincode, setPermanent_pincode] = useState('');
  const [permanent_landmark, setPermanent_landmark] = useState('');
  const [addressDetailsErrors, setAddressDetailsErrors] = useState({});

  const validateAddressFields = () => {
    const newErrors = {};

    if (!present_address) newErrors.present_address = 'Present Address is required';
    if (!present_sahi) newErrors.present_sahi = 'Present Sahi is required';
    if (!present_post) newErrors.present_post = 'Present Post is required';
    if (!present_PS) newErrors.present_PS = 'Present Police Station is required';
    if (!present_district) newErrors.present_district = 'Present District is required';
    if (!present_state) newErrors.present_state = 'Present State is required';
    if (!present_country) newErrors.present_country = 'Present Country is required';
    if (!present_pincode) newErrors.present_pincode = 'Present Pincode is required';
    if (!present_landmark) newErrors.present_landmark = 'Present Landmark is required';
    if (!isPermanentSameAsPresent) {
      if (!permanent_address) newErrors.permanent_address = 'Permanent Address is required';
      if (!permanent_sahi) newErrors.permanent_sahi = 'Permanent Sahi is required';
      if (!permanent_post) newErrors.permanent_post = 'Permanent Post is required';
      if (!permanent_PS) newErrors.permanent_PS = 'Permanent Police Station is required';
      if (!permanent_district) newErrors.permanent_district = 'Permanent District is required';
      if (!permanent_state) newErrors.permanent_state = 'Permanent State is required';
      if (!permanent_country) newErrors.permanent_country = 'Permanent Country is required';
      if (!permanent_pincode) newErrors.permanent_pincode = 'Permanent Pincode is required';
      if (!permanent_landmark) newErrors.permanent_landmark = 'Permanent Landmark is required';
    }

    // Set errors and clear them after 5 seconds
    setAddressDetailsErrors(newErrors);
    setTimeout(() => setAddressDetailsErrors({}), 5000);

    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const saveAddressDetails = async () => {
    // if (!validateAddressFields()) return;
    setLoading(true);

    const token = await AsyncStorage.getItem('storeAccesstoken');
    const formData = new FormData();
    formData.append('sahi', present_sahi);
    formData.append('post', present_post);
    formData.append('police_station', present_PS);
    formData.append('district', present_district);
    formData.append('state', present_state);
    formData.append('country', present_country);
    formData.append('pincode', present_pincode);
    formData.append('landmark', present_landmark);
    formData.append('address', present_address);

    formData.append('same_as_permanent_address', isPermanentSameAsPresent);

    formData.append('per_address', permanent_address);
    formData.append('per_sahi', permanent_sahi);
    formData.append('per_post', permanent_post);
    formData.append('per_police_station', permanent_PS);
    formData.append('per_district', permanent_district);
    formData.append('per_state', permanent_state);
    formData.append('per_country', permanent_country);
    formData.append('per_pincode', permanent_pincode);
    formData.append('per_landmark', permanent_landmark);

    try {
      const response = await fetch(base_url + "api/save-address", {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        // console.log('Address Details saved successfully', data);
        ToastAndroid.show('Address Details saved successfully', ToastAndroid.SHORT);
        navigation.goBack();
        // setActiveTab('occupation');
        // handleNextTab('occupation');
      } else {
        // console.log("Error: ", data.message || 'Failed to save Address Details. Please try again.');
        ToastAndroid.show(data.message || 'Failed to save Address Details. Please try again.', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Network request failed: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { data } = props.route.params || {};
    if (data) {
      setPresent_address(data.address || '');
      setPresent_sahi(data.sahi || '');
      setPresent_post(data.post || '');
      setPresent_PS(data.police_station || '');
      setPresent_district(data.district || '');
      setPresent_state(data.state || '');
      setPresent_country(data.country || '');
      setPresent_pincode(data.pincode || '');
      setPresent_landmark(data.landmark || '');

      setPermanent_address(data.per_address || '');
      setPermanent_sahi(data.per_sahi || '');
      setPermanent_post(data.per_post || '');
      setPermanent_PS(data.per_police_station || '');
      setPermanent_district(data.per_district || '');
      setPermanent_state(data.per_state || '');
      setPermanent_country(data.per_country || '');
      setPermanent_pincode(data.per_pincode || '');
      setPermanent_landmark(data.per_landmark || '');

      // Ensure boolean for checkbox
      setIsPermanentSameAsPresent(data.same_as_permanent_address === 1 || data.same_as_permanent_address === true);
    }
  }, []);

  return (
    <View style={styles.safeArea}>
      <LinearGradient
        colors={['#4c1d95', '#6366f1']}
        style={styles.header}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" marginRight={10} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Address</Text>
        </View>
        <Text style={styles.headerSubtitle}>Update your address information</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer}>
        <View style={{ flex: 1, marginTop: 15 }}>
          <View style={styles.cardBox}>
            {/* Present Sahi */}
            <FloatingLabelInput
              label="Present Sahi"
              value={present_sahi}
              customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
              labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
              onChangeText={value => setPresent_sahi(value)}
              containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
            />
            {addressDetailsErrors.present_sahi && <Text style={styles.errorText}>{addressDetailsErrors.present_sahi}</Text>}
            {/* Present Landmark Input */}
            <FloatingLabelInput
              label="Present Landmark"
              value={present_landmark}
              customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
              labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
              onChangeText={value => setPresent_landmark(value)}
              containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
            />
            {addressDetailsErrors.present_landmark && <Text style={styles.errorText}>{addressDetailsErrors.present_landmark}</Text>}
            {/* Present Post Input */}
            <FloatingLabelInput
              label="Present Post"
              value={present_post}
              customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
              labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
              onChangeText={value => setPresent_post(value)}
              containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
            />
            {addressDetailsErrors.present_post && <Text style={styles.errorText}>{addressDetailsErrors.present_post}</Text>}
            {/* Present Police station */}
            <FloatingLabelInput
              label="Present Police Station"
              value={present_PS}
              customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
              labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
              onChangeText={value => setPresent_PS(value)}
              containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
            />
            {addressDetailsErrors.present_PS && <Text style={styles.errorText}>{addressDetailsErrors.present_PS}</Text>}
            {/* Present District Input */}
            <FloatingLabelInput
              label="Present District"
              value={present_district}
              customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
              labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
              onChangeText={value => setPresent_district(value)}
              containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
            />
            {addressDetailsErrors.present_district && <Text style={styles.errorText}>{addressDetailsErrors.present_district}</Text>}
            {/* Present State Input */}
            <FloatingLabelInput
              label="Present State"
              value={present_state}
              customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
              labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
              onChangeText={value => setPresent_state(value)}
              containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
            />
            {addressDetailsErrors.present_state && <Text style={styles.errorText}>{addressDetailsErrors.present_state}</Text>}
            {/* Present Pincode Input */}
            <FloatingLabelInput
              label="Present Pincode"
              value={present_pincode}
              customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
              labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
              keyboardType="numeric"
              maxLength={6}
              onChangeText={value => setPresent_pincode(value)}
              containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
            />
            {addressDetailsErrors.present_pincode && <Text style={styles.errorText}>{addressDetailsErrors.present_pincode}</Text>}
            {/* Present Country Input */}
            <FloatingLabelInput
              label="Present Country"
              value={present_country}
              customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
              labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
              onChangeText={value => setPresent_country(value)}
              containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
            />
            {addressDetailsErrors.present_country && <Text style={styles.errorText}>{addressDetailsErrors.present_country}</Text>}
            {/* Present Address Input */}
            <FloatingLabelInput
              label="Present Address"
              value={present_address}
              customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
              labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
              onChangeText={value => setPresent_address(value)}
              containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
            />
            {addressDetailsErrors.present_address && <Text style={styles.errorText}>{addressDetailsErrors.present_address}</Text>}
          </View>
          {/* Is Permanent Same As Present Address */}
          <View style={{ width: '90%', alignSelf: 'center' }}>
            <Text style={{ color: '#757473', fontSize: 16 }}>Is permanent address is same as present address?</Text>
            <View style={{ width: '50%', marginTop: 10 }}>
              <RadioForm
                radio_props={[{ label: 'Yes', value: true }, { label: 'No', value: false }]}
                initial={isPermanentSameAsPresent ? 0 : 1}
                formHorizontal={true}
                labelHorizontal={true}
                buttonColor={'#e96a01'}
                selectedButtonColor={'#e96a01'}
                animation={true}
                onPress={(value) => setIsPermanentSameAsPresent(value)}
                style={{ justifyContent: 'space-between' }}
              />
            </View>
          </View>
          {!isPermanentSameAsPresent &&
            <View style={[styles.cardBox, { marginTop: 10 }]}>
              {/* Permanent Sahi */}
              <FloatingLabelInput
                label="Permanent Sahi"
                value={permanent_sahi}
                customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                onChangeText={value => setPermanent_sahi(value)}
                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
              />
              {addressDetailsErrors.permanent_sahi && <Text style={styles.errorText}>{addressDetailsErrors.permanent_sahi}</Text>}
              {/* Permanent Landmark Input */}
              <FloatingLabelInput
                label="Permanent Landmark"
                value={permanent_landmark}
                customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                onChangeText={value => setPermanent_landmark(value)}
                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
              />
              {addressDetailsErrors.permanent_landmark && <Text style={styles.errorText}>{addressDetailsErrors.permanent_landmark}</Text>}
              {/* Permanent Post Input */}
              <FloatingLabelInput
                label="Permanent Post"
                value={permanent_post}
                customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                onChangeText={value => setPermanent_post(value)}
                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
              />
              {addressDetailsErrors.permanent_post && <Text style={styles.errorText}>{addressDetailsErrors.permanent_post}</Text>}
              {/* Permanent Police station */}
              <FloatingLabelInput
                label="Permanent Police Station"
                value={permanent_PS}
                customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                onChangeText={value => setPermanent_PS(value)}
                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
              />
              {addressDetailsErrors.permanent_PS && <Text style={styles.errorText}>{addressDetailsErrors.permanent_PS}</Text>}
              {/* Permanent District Input */}
              <FloatingLabelInput
                label="Permanent District"
                value={permanent_district}
                customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                onChangeText={value => setPermanent_district(value)}
                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
              />
              {addressDetailsErrors.permanent_district && <Text style={styles.errorText}>{addressDetailsErrors.permanent_district}</Text>}
              {/* Permanent State Input */}
              <FloatingLabelInput
                label="Permanent State"
                value={permanent_state}
                customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                onChangeText={value => setPermanent_state(value)}
                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
              />
              {addressDetailsErrors.permanent_state && <Text style={styles.errorText}>{addressDetailsErrors.permanent_state}</Text>}
              {/* Permanent Pincode Input */}
              <FloatingLabelInput
                label="Permanent Pincode"
                value={permanent_pincode}
                customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                keyboardType="numeric"
                maxLength={6}
                onChangeText={value => setPermanent_pincode(value)}
                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
              />
              {addressDetailsErrors.permanent_pincode && <Text style={styles.errorText}>{addressDetailsErrors.permanent_pincode}</Text>}
              {/* Permanent Country Input */}
              <FloatingLabelInput
                label="Permanent Country"
                value={permanent_country}
                customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                onChangeText={value => setPermanent_country(value)}
                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
              />
              {addressDetailsErrors.permanent_country && <Text style={styles.errorText}>{addressDetailsErrors.permanent_country}</Text>}
              {/* Permanent Address Input */}
              <FloatingLabelInput
                label="Permanent Address"
                value={permanent_address}
                customLabelStyles={{ colorFocused: '#e96a01', fontSizeFocused: 14 }}
                labelStyles={{ backgroundColor: '#ffffff', paddingHorizontal: 5 }}
                onChangeText={value => setPermanent_address(value)}
                containerStyles={{ borderWidth: 0.5, borderColor: '#353535', backgroundColor: '#ffffff', padding: 10, borderRadius: 8, marginVertical: 12, borderRadius: 10 }}
              />
              {addressDetailsErrors.permanent_address && <Text style={styles.errorText}>{addressDetailsErrors.permanent_address}</Text>}
            </View>
          }
          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={saveAddressDetails} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.submitText}>Save Changes</Text>
                <Ionicons name="checkmark" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export default Address

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
  formContainer: {
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
    fontWeight: '500'
  },
  focusedInput: {
    height: 50,
    borderBottomColor: '#56ab2f',
    borderBottomWidth: 1
  },
  submitButton: {
    backgroundColor: '#051b65',
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 50,
    paddingVertical: 10,
    marginVertical: 20,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,  // Spacing for the button text
    marginBottom: 2,
    marginHorizontal: 10
  },
  filePicker: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  filePickerText: {
    width: '70%',
    height: 45,
    lineHeight: 45,
    color: '#000',
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
})