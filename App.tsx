import { StatusBar, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { request, RESULTS, type Permission } from 'react-native-permissions';
import { getMessaging, getToken, requestPermission, AuthorizationStatus } from '@react-native-firebase/messaging';

// SplashScreen
import SplashScreen from './src/Screens/SplashScreen/Index'

// No Internet Page
import NoInternet from './src/Screens/NoInternet/Index'

// Auth
import Register from './src/Screens/Auth/Register.js';
import NewLogin from './src/Screens/Auth/NewLogin.js'
import Login from './src/Screens/Auth/Login.js'
import Otp from './src/Screens/Auth/OTP.js'

// Pages
import Home from './src/Screens/Home/Index'
import PratihariForm from './src/Screens/PratihariForm/Index.js'

// Pratihari form
import PratihariProfileForm from './src/Screens/PratihariProfileForm/Index.js';

// Edit Form
import ProfileEdit from './src/Screens/PratihariFormEdit/ProfileEdit.js';
import Familly from './src/Screens/PratihariFormEdit/Familly.js';
import Address from './src/Screens/PratihariFormEdit/Address.js';
import IDCard from './src/Screens/PratihariFormEdit/IDCard.js';
import SebaEdit from './src/Screens/PratihariFormEdit/SebaEdit.js';
import Occupation from './src/Screens/PratihariFormEdit/Occupation.js';
import Social from './src/Screens/PratihariFormEdit/Social.js';

import SebaDetails from './src/Screens/SebaDetails/Index.js';
import ThankYouPage from './src/Screens/ThankYouPage/Index.js'
import MessageScreen from './src/Screens/MessageScreen/Index.js'
import Profile from './src/Screens/Profile/Index.js'
import Search from './src/Screens/Search/Index.js'
import PratihariProfileById from './src/Screens/PratihariProfileById/Index.js'
import UpcomingPali from './src/Screens/UpcomingPali/Index.js'
import PaliHistory from './src/Screens/PaliHistory/Index.js'
import Notice from './src/Screens/Notice/Index.js'
import SocialMedia from './src/Screens/SocialMedia/Index.js'
import Committee from './src/Screens/Committee/Index.js'
import Application from './src/Screens/Application/Index.js'

const Stack = createNativeStackNavigator();

// export const base_url = "http://pratiharinijog.mandirparikrama.com/";
export const base_url = "https://pratiharinijog.mandirparikrama.com/";

const App = () => {

  const [showSplash, setShowSplash] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [access_token, setAccess_token] = useState<string | null>(null);
  const [goToHomePage, setGoToHomePage] = useState(false);

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
      // console.log("Pratihari Status Result:", result);

      if (result?.empty_tables && result.empty_tables.length > 0) {
        setGoToHomePage(false);
      } else {
        // ✅ empty_tables is empty → go to Home
        setGoToHomePage(true);
        // navigation.navigate('Home');
      }

    } catch (error) {
      console.error("Error fetching Pratihari status:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      setIsConnected(state.isConnected ?? false);
    });
    return () => {
      unsubscribe();
      // setTimeout(unsubscribe, 5000);
    }
  }, []);

  const getAccesstoken = async () => {
    const token = await AsyncStorage.getItem('storeAccesstoken');
    setAccess_token(token);
    console.log("access_token-=-=-=-=-=-=-", token);
  };

  // Request Notification Permission
  const askNotificationPermissionOnce = async () => {
    const hasAsked = await AsyncStorage.getItem('notificationPermissionAsked');
    if (hasAsked) return;

    try {
      if (Platform.OS === 'android') {
        // Android 13+ only
        if (Platform.Version >= 33) {
          const result = await request(
            'android.permission.POST_NOTIFICATIONS' as Permission
          );

          if (result !== RESULTS.GRANTED) {
            console.log('🚫 Android notification permission denied');
            await AsyncStorage.setItem('notificationPermissionAsked', 'true');
            return;
          }
        }

        console.log('✅ Android notifications enabled');
        await getToken(getMessaging());
      } else if (Platform.OS === 'ios') {
        const authStatus = await requestPermission(getMessaging());
        const enabled =
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          console.log('🚫 iOS notification permission denied');
          await AsyncStorage.setItem('notificationPermissionAsked', 'true');
          return;
        }

        console.log('✅ iOS notifications enabled');
        await getToken(getMessaging());
      }

      await AsyncStorage.setItem('notificationPermissionAsked', 'true');
    } catch (error) {
      console.log('Permission error:', error);
      await AsyncStorage.setItem('notificationPermissionAsked', 'true');
    }
  };

  useEffect(() => {
    getAccesstoken();
    askNotificationPermissionOnce();
    getPratihariStatus();

    setTimeout(() => {
      setShowSplash(false);
    }, 3000);
  }, []);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#4c1d95" barStyle="light-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {showSplash ? (<Stack.Screen name="SplashScreen" component={SplashScreen} options={{ presentation: 'modal', animationTypeForReplace: 'push', animation: 'slide_from_right' }} />) : null}
        {!isConnected ? (
          <Stack.Screen name="NoInternet" component={NoInternet} />
        ) : (
          <>
            {access_token ? <Stack.Screen name="PratihariForm" component={PratihariForm} /> : <Stack.Screen name="NewLogin" component={NewLogin} />}
            {!access_token ? <Stack.Screen name="PratihariForm" component={PratihariForm} /> : <Stack.Screen name="NewLogin" component={NewLogin} />}
            <Stack.Screen name="Otp" component={Otp} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ThankYouPage" component={ThankYouPage} />
            <Stack.Screen name="MessageScreen" component={MessageScreen} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={Profile} />
            {/* Edit Form */}
            <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
            <Stack.Screen name="Familly" component={Familly} />
            <Stack.Screen name="Address" component={Address} />
            <Stack.Screen name="IDCard" component={IDCard} />
            <Stack.Screen name="SebaEdit" component={SebaEdit} />
            <Stack.Screen name="Occupation" component={Occupation} />
            <Stack.Screen name="Social" component={Social} />

            <Stack.Screen name="SebaDetails" component={SebaDetails} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="PratihariProfileById" component={PratihariProfileById} />
            <Stack.Screen name="UpcomingPali" component={UpcomingPali} />
            <Stack.Screen name="PaliHistory" component={PaliHistory} />
            <Stack.Screen name="Notice" component={Notice} />
            <Stack.Screen name="SocialMedia" component={SocialMedia} />
            <Stack.Screen name="Committee" component={Committee} />
            <Stack.Screen name="Application" component={Application} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App