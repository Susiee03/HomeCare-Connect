import React, { useState } from 'react';
import { View, Text, Alert, Platform, StyleSheet, Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import PressableArea from './PressableArea';
import CommonStyles from './CommonStyles';
import Label from './Label';

export default function LocalNotification() {
  async function verifyPermission() {
    try {
      const status = await Notifications.getPermissionsAsync();
      if (status.granted) {
        return true;
      }
      const permissionResponse = await Notifications.requestPermissionsAsync();
      return permissionResponse.granted;
    } catch (err) {
      console.log(err);
    }
  }
  
  const scheduleNotificationHandler = async () => {
    try {
      const hasPermission = await verifyPermission();

      if (!hasPermission) {
        Alert.alert("You need to give permission to send notifications");
        return;
      }

      const schedulingResult = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time to check new tasks!",
          body: "Don’t forget to check new tasks!",
        },
        trigger: {
          hour: 10,
          minute: 0,
          repeats: true,
        },
      });

      Alert.alert(
        "Notification Set!",
        "You will be reminded daily to check new tasks."
      );
    } catch (err) {
      console.error("Schedule notification error", err);
    }
  };

  return (
    <View style={styles.buttonContainer}>
      <PressableArea 
        areaPressed={scheduleNotificationHandler}
        customizedStyle={[CommonStyles.pressableSaveCustom, {width: 180}]}>
      <Label
       content="Schedule Notification"
         customizedStyle={CommonStyles.normalLabel}
       />
      </PressableArea>
    </View>
  );
}
const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff', 
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});