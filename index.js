/**
 * @format
 */

import React from 'react';
import { AppRegistry } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import App from './App';
import { name as appName } from './app.json';

const Root = () => (
    <SafeAreaProvider>
        <SafeAreaView
            style={{ flex: 1, backgroundColor: '#4c1d95' }} // change bg if you want
            edges={['top', 'bottom']}                       // protect top & bottom
        >
            <App />
        </SafeAreaView>
    </SafeAreaProvider>
);

AppRegistry.registerComponent(appName, () => Root);
// AppRegistry.registerComponent(appName, () => App);
