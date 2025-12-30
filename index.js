/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import notifee, { AndroidImportance } from '@notifee/react-native';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';

import App from './App';
import { name as appName } from './app.json';

const CHANNEL_ID = 'default-channel-id';

async function ensureChannel() {
    // Safe to call multiple times; returns existing id if already created
    return notifee.createChannel({
        id: CHANNEL_ID,
        name: 'Default Channel',
        description: 'A default channel',
        importance: AndroidImportance.HIGH,
    });
}

// Background handler: runs when message is received in background/quit
setBackgroundMessageHandler(getMessaging(), async remoteMessage => {
    try {
        console.log('BG message:', remoteMessage);

        // If message contains `notification`, Android usually shows it automatically.
        // Avoid duplicates by not displaying again.
        if (remoteMessage && remoteMessage.notification) {
            return;
        }

        // For data-only messages, show notification manually
        const channelId = await ensureChannel();

        const title = remoteMessage?.data?.title || 'Notification';
        const body = remoteMessage?.data?.body || '';

        await notifee.displayNotification({
            title,
            body,
            data: remoteMessage?.data || {},
            android: {
                channelId,
                pressAction: { id: 'default' },
            },
        });
    } catch (e) {
        console.log('BG handler error:', e);
    }
});

const Root = () => (
    <SafeAreaProvider>
        <SafeAreaView
            style={{ flex: 1, backgroundColor: '#4c1d95' }}
            edges={['top', 'bottom']}
        >
            <App />
        </SafeAreaView>
    </SafeAreaProvider>
);

AppRegistry.registerComponent(appName, () => Root);