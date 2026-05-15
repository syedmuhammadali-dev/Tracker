import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert, Platform } from 'react-native';

export const NotificationService = {
  async requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      await this.getToken();
    }
  },

  async getToken() {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) return;

      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        // Save token to Firestore
        await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .update({
            fcmToken: fcmToken,
            lastTokenUpdate: firestore.FieldValue.serverTimestamp(),
          });
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  },

  setupListeners() {
    // 1. Foreground messages
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert(
        remoteMessage.notification?.title || 'Notification',
        remoteMessage.notification?.body || ''
      );
    });

    // 2. Background/Quit state messages (Handled in index.js for quit state)
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification caused app to open from background state:', remoteMessage.notification);
    });

    // 3. Initial notification (Quit state)
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage.notification);
        }
      });

    return unsubscribe;
  },
};
