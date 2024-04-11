import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import Label from "../Components/Label";
import DropDownPicker from 'react-native-dropdown-picker';
import PressableArea from "../Components/PressableArea";
import { publishTask, updateTask } from '../Firebase/FirebaseHelper';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

export default function PostingTask({ navigation, route }) {
  const [taskId, setTaskId] = useState(null);
  const [cost, setCost] = useState("");
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Daily Cleaning', value: 'Daily Cleaning'},
    {label: 'Deep Cleaning', value: 'Deep Cleaning'},
    {label: 'Move Out Cleaning', value: 'Move Out Cleaning'},
    {label: 'Pet Cleaning', value: 'Pet Cleaning'},
  ]);
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setSelectedLocation(currentLocation.coords);
    })();

    if (route.params?.task) {
      const task = route.params.task;
      setTaskId(task.id);
      setTitle(task.title);
      setValue(task.taskType);
      setCost(task.cost.toString());
      setAddress(task.address);
    }
  }, [route.params?.task]);

  const handleSave = () => {
    if (cost === "" || value === null || parseFloat(cost) < 0 || title === "" || !selectedLocation) {
      Alert.alert("Invalid input", "Please check your input values and select a location.");
      return;
    }
    const taskData = {
      title: title,
      taskType: value,
      cost: parseFloat(cost),
      address: address,
      location: selectedLocation,
    };

    if (taskId) {
      updateTask(taskId, taskData)
        .then(() => {
          navigation.goBack();
        })
        .catch((error) => {
          console.error("Update Task Error:", error);
          Alert.alert("Error", "There was a problem updating the task");
        });
    } else {
      publishTask(taskData)
        .then(() => {
          navigation.goBack();
        })
        .catch((error) => {
          console.error("Publish Task Error:", error);
          Alert.alert("Error", "There was a problem publishing the task");
        });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Label content="Type" customizedStyle={styles.labelStyle} />
      <DropDownPicker open={open} value={value} items={items} setOpen={setOpen} setValue={setValue} setItems={setItems} style={styles.dropDownPicker} containerStyle={styles.dropDownContainer} />
      <Label content="Title" customizedStyle={styles.labelStyle} />
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      <Label content="Cost" customizedStyle={styles.labelStyle} />
      <TextInput style={styles.input} value={cost} onChangeText={setCost} keyboardType="numeric" />
      <Label content="Address" customizedStyle={styles.labelStyle} />
      <TextInput style={styles.input} value={address} onChangeText={setAddress} />
      {location && (
        <MapView style={styles.map} initialRegion={{...location, latitudeDelta: 0.0922, longitudeDelta: 0.0421}} onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}>
          {selectedLocation && (<Marker coordinate={selectedLocation} />)}
        </MapView>
      )}
      <View style={styles.rowContainer}>
        <PressableArea customizedStyle={styles.pressableCancelCustom} areaPressed={() => navigation.goBack()}><Label content="Cancel" customizedStyle={styles.buttonLabel} /></PressableArea>
        <PressableArea customizedStyle={styles.pressableSubmitCustom} areaPressed={handleSave}><Label content="Save" customizedStyle={styles.buttonLabel} /></PressableArea>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(154,150,221)",
    padding: 20,
  },
  input: {
    height: 40,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "white",
  },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  pressableCancelCustom: {
    backgroundColor: "red",
    borderRadius: 5,
    padding: 10,
  },
  pressableSubmitCustom: {
    backgroundColor: "blue",
    borderRadius: 5,
    padding: 10,
  },
  buttonLabel: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  labelStyle: {
    marginTop: 20,
    color: "rgb(60,61,132)",
    fontWeight: "bold",
  },
  dropDownPicker: {
    backgroundColor: "rgb(144, 142, 179)",
  },
  dropDownContainer: {
    zIndex: 5000,
    marginBottom: 20,
  }
});
