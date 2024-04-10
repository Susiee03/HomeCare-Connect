import { View, Button, Alert } from "react-native";
import React from "react";
import * as Notifications from "expo-notifications";

export default function Notification() {
  async function verifyPermission() {
    try {
      const status = await Notifications.getPermissionsAsync();
      console.log(status);
      if (status.granted) {
        return true;
      }

      //     // ask for permission
      const permissionResponse = await Notifications.requestPermissionsAsync();
      return permissionResponse.granted;
    } catch (err) {
      console.log(err);
    }
  }
  async function localNotificationHandler() {
    // use await/async and try/catch
    try {
      const havePermission = await verifyPermission();
      if (!havePermission) {
        Alert.alert("You need to give permission for notification");
        return;
      }

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "New Task",
          body: "We have new task for you",
        },
        trigger: { seconds: 3 },
      });
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <View>
      <Button
        title="Remind me to check out new tasks"
        onPress={localNotificationHandler}
      />
    </View>
  );
}
