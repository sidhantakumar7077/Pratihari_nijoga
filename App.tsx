import { StyleSheet, Text, View, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';

// SplashScreen
import SplashScreen from './src/Screens/SplashScreen/Index'

// No Internet Page
import NoInternet from './src/Screens/NoInternet/Index'

// Auth
import Register from './src/Screens/Auth/Register.js';
import Login from './src/Screens/Auth/Login.js'
import Otp from './src/Screens/Auth/OTP.js'

// Pages
import Home from './src/Screens/Home/Index'
import PratihariForm from './src/Screens/PratihariForm/Index.js'
import ThankYouPage from './src/Screens/ThankYouPage/Index.js'
import MessageScreen from './src/Screens/MessageScreen/Index.js'

const Stack = createNativeStackNavigator();

// export const base_url = "http://pratiharinijog.mandirparikrama.com/";
export const base_url = "http://pratiharinijog.mandirparikrama.com/";

const App = () => {

  const [showSplash, setShowSplash] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [access_token, setAccess_token] = useState<string | null>(null);

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

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem('storeAccesstoken');
      setAccess_token(token);
      console.log("access_token-=-=-=-=-=-=-", token);
    };

    getToken();

    setTimeout(() => {
      setShowSplash(false);
    }, 3000);
  }, []);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#051b65" barStyle="light-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {showSplash ? (<Stack.Screen name="SplashScreen" component={SplashScreen} options={{ presentation: 'modal', animationTypeForReplace: 'push', animation: 'slide_from_right' }} />) : null}
        {!isConnected ? (
          <Stack.Screen name="NoInternet" component={NoInternet} />
        ) : (
          <>
            {access_token ? <Stack.Screen name="PratihariForm" component={PratihariForm} /> : <Stack.Screen name="Login" component={Login} />}
            {!access_token ? <Stack.Screen name="PratihariForm" component={PratihariForm} /> : <Stack.Screen name="Login" component={Login} />}
            <Stack.Screen name="Otp" component={Otp} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ThankYouPage" component={ThankYouPage} />
            <Stack.Screen name="MessageScreen" component={MessageScreen} />
            <Stack.Screen name="Home" component={Home} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App