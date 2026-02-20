import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import StackNavigator from './src/navigation/StackNavigator';
import { store } from './src/store/store';
import { ThemeProvider } from './src/constants/ThemeContext';
import { LoaderProvider } from './src/constants/LoaderContext';
import { Alert, Platform } from 'react-native';
import { MenuProvider } from './src/constants/MenuContext';
import { TaskProvider } from './src/constants/TaskContext';
import { PendingProvider } from './src/constants/PendingContext';
import { UserProvider } from './src/constants/UserContext';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import RNLocation from 'react-native-location'


const App = () => {
 

   /* ------------------ App Startup Logic ------------------ */
  useEffect(() => {
    configureLocation();
    configurePushNotification();
    createNotificationChannel();
    requestUserPermission();

    const unsubscribeOnMessage = messaging().onMessage(
      async remoteMessage => {
        PushNotification.localNotification({
          channelId: 'background-location',
          title: 'New Notification',
          message: remoteMessage.notification?.body || '',
        });
      }
    );

    const unsubscribeOnOpen = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log(
          'Opened from background:',
          remoteMessage.notification
        );
      }
    );

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Opened from quit state:',
          remoteMessage.notification
        );
      }
    });

     // 🔄 FCM TOKEN REFRESH HANDLER (ADD HERE)
  const unsubscribeTokenRefresh = messaging().onTokenRefresh(
  async token => {
    try {
      const email = await AsyncStorage.getItem('secondaryEmail');
      const lastToken = await AsyncStorage.getItem('lastFcmToken');

      // 🚫 No user or same token → do nothing
      if (!email || token === lastToken) {
        return;
      }

      // 💾 Save new token locally
      await AsyncStorage.setItem('lastFcmToken', token);

      // 📡 Send updated token to backend
      await axios.post('https://app.nexis365.com/api/update-fcm', {
        email,
        fcmToken: token,
      });

      console.log('🔄 FCM token refreshed & saved');
    } catch (error) {
      console.log('❌ Failed to update refreshed FCM token', error);
    }
  }
);


    return () => {
      unsubscribeOnMessage();
      unsubscribeOnOpen();
      unsubscribeTokenRefresh();
    };
  }, []);

  /* ------------------ Location Config ------------------ */
  const configureLocation = () => {
    RNLocation.configure({
      distanceFilter: 100,
      desiredAccuracy: {
        ios: 'best',
        android: 'balancedPowerAccuracy',
      },
      androidProvider: 'auto',
      interval: 5000,
      fastestInterval: 10000,
      maxWaitTime: 5000,
      allowsBackgroundLocationUpdates: true,
      activityType: 'other',
      pausesLocationUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: false,
    });
  };

  /* ------------------ Push Notification ------------------ */
  const configurePushNotification = () => {
    PushNotification.configure({
      onNotification: notification => {
        console.log('[LOCAL NOTIFICATION]', notification);
      },
      requestPermissions: Platform.OS === 'ios',
    });
  };

  const createNotificationChannel = () => {
    PushNotification.createChannel(
      {
        channelId: 'background-location',
        channelName: 'Background Tracking Alerts',
        channelDescription: 'Background location & push alerts',
        importance: 4,
        vibrate: true,
      },
      created =>
        console.log(
          `🔔 Notification channel created: ${created}`
        )
    );
  };

  /* ------------------ Firebase Permission ------------------ */
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission:', authStatus);
        console.log('Notification permission granted');
    } else {
      Alert.alert('Permission denied', 'Notifications disabled');
    }
  };


  return (
    <SafeAreaProvider>
      <UserProvider>
        <MenuProvider>
          <TaskProvider>
            <PendingProvider>
              <Provider store={store}>
                <ThemeProvider>
                  <LoaderProvider>
                    <NavigationContainer>
                      <StackNavigator />
                    </NavigationContainer>
                  </LoaderProvider>
                </ThemeProvider>
              </Provider>
            </PendingProvider>
          </TaskProvider>
        </MenuProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
};

export default App;