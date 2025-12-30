import React, { useEffect } from 'react';
import { View, Platform } from 'react-native';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import {
    getMessaging,
    onMessage,
    onNotificationOpenedApp,
    getInitialNotification,
} from '@react-native-firebase/messaging';

const CHANNEL_ID = 'default-channel-id';

async function ensureChannel() {
    // Only needed on Android
    if (Platform.OS !== 'android') return CHANNEL_ID;

    // Safe to call multiple times
    return notifee.createChannel({
        id: CHANNEL_ID,
        name: 'Default Channel',
        description: 'A default channel',
        importance: AndroidImportance.HIGH,
    });
}

const Notification = ({ onOpenNotification }) => {
    // Create channel once (Android)
    useEffect(() => {
        ensureChannel().catch(console.error);
    }, []);

    // Foreground FCM message -> display notification using Notifee
    useEffect(() => {
        const unsubscribe = onMessage(getMessaging(), async remoteMessage => {
            console.log('FCM foreground message:', JSON.stringify(remoteMessage));

            const channelId = await ensureChannel();

            await notifee.displayNotification({
                title: (remoteMessage.notification && remoteMessage.notification.title) || '',
                body: (remoteMessage.notification && remoteMessage.notification.body) || '',
                data: remoteMessage.data || {},
                android: {
                    channelId,
                    pressAction: { id: 'default' },
                },
            });
        });

        return unsubscribe;
    }, []);

    // User taps a Notifee notification while app is in foreground
    useEffect(() => {
        const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
            if (type === EventType.PRESS && onOpenNotification) {
                onOpenNotification({
                    type: 'local-foreground',
                    title: detail?.notification?.title,
                    message: detail?.notification?.body,
                    data: detail?.notification?.data,
                });
            }
        });

        return unsubscribe;
    }, [onOpenNotification]);

    // User taps an OS-delivered FCM notification (background)
    useEffect(() => {
        const unsubscribeOpened = onNotificationOpenedApp(getMessaging(), remoteMessage => {
            console.log('Opened from background by FCM:', remoteMessage?.notification);

            if (!remoteMessage || !onOpenNotification) return;

            onOpenNotification({
                type: 'remote-background',
                title: remoteMessage.notification?.title,
                message: remoteMessage.notification?.body,
                data: remoteMessage.data,
            });
        });

        return unsubscribeOpened;
    }, [onOpenNotification]);

    // User taps notification when app was quit (FCM + Notifee)
    useEffect(() => {
        // Quit state - FCM
        getInitialNotification(getMessaging()).then(remoteMessage => {
            if (!remoteMessage || !onOpenNotification) return;

            console.log('Opened from quit by FCM:', remoteMessage.notification);

            onOpenNotification({
                type: 'remote-quit',
                title: remoteMessage.notification?.title,
                message: remoteMessage.notification?.body,
                data: remoteMessage.data,
            });
        });

        // Quit state - Notifee (if displayed via Notifee)
        notifee.getInitialNotification().then(initial => {
            if (!initial || !onOpenNotification) return;

            console.log('Opened from quit by Notifee:', initial.notification);

            onOpenNotification({
                type: 'local-quit',
                title: initial?.notification?.title,
                message: initial?.notification?.body,
                data: initial?.notification?.data,
            });
        });
    }, [onOpenNotification]);

    return <View />;
};

export default Notification;