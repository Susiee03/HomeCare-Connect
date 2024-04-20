import React, { useState } from 'react';
import { View, Text, Alert, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function LocalNotification() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

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

  const scheduleNotification = async (selectedDate) => {
    const havePermission = await verifyPermission();
    if (!havePermission) {
      Alert.alert('You need to give permission for notification');
      return;
    }
  
    // 检查选择的时间是否晚于当前时间
    const now = new Date();
    if (selectedDate <= now) {
      // 如果选择的时间不晚于当前时间，提示用户重新选择
      Alert.alert('Invalid Time', 'Please choose a future time for the notification.');
      return;
    }
  
    // 如果时间有效，继续调度通知
    const trigger = new Date(selectedDate);
    trigger.setSeconds(0);
  
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Check New Task',
        body: 'We have a new task for you',
      },
      trigger: trigger,
    });
  
    setDate(selectedDate); // 更新状态以反映用户的选择
    setShowPicker(false); // 关闭时间选择器
  }
  
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios'); 
  

    const now = new Date();
    if (currentDate <= now) {

      Alert.alert('Invalid Time', 'Please choose a future time.');
      return;
    }

    Alert.alert(
      "Confirm Notification Time",
      `Are you sure you want to schedule the notification for ${currentDate.toLocaleString()}?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => scheduleNotification(currentDate) }
      ],
      { cancelable: true }
    );
  }
  

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={() => setShowPicker(true)}  style={styles.button}>
      <Text style={styles.buttonText}>Schedule Notification</Text>
      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}
      </TouchableOpacity>
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