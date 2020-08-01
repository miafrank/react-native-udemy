import React, { useEffect } from 'react';
import { StyleSheet, Text, Button, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  useEffect(() => {
    Permissions.getAsync(Permissions.NOTIFICATIONS)
      .then((statusObj) => {
        if (statusObj.status !== 'granted') {
          return Permissions.askAsync(Permissions.NOTIFICATIONS);
        }
        return statusObj;
      })
      .then((statusObj) => {
        if (statusObj.status !== 'granted') {
          return;
        }
      });
  }, []);

  useEffect(() => {
    // Define function from background notification
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => console.log(response)
    );

    const foregroundSubscription = Notifications.addNotificationResponseReceivedListener(
      (notification) => {
        console.log(notification);
      }
    );
    // Clean up function for React to close subscription if component not mounted
    return () => {
      backgroundSubscription.remove();
      foregroundSubscription.remove();
    };
  }, []);
  const triggerNotificationHandler = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'My first local notification',
        body: 'This is the first local notification we are sending',
      },
      trigger: {
        seconds: 5,
      },
    });
  };
  return (
    <View style={styles.container}>
      <Button
        title='Trigger Notification'
        onPress={triggerNotificationHandler}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
