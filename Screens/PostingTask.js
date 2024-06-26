import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import Label from "../Components/Label";
import DropDownPicker from 'react-native-dropdown-picker';
import PressableArea from "../Components/PressableArea";
import { publishTask, updateTask } from '../Firebase/FirebaseHelper';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import CommonStyles from "../Components/CommonStyles"
import Color from "../Components/Color"

export default function PostingTask({ navigation, route }) {
  const [taskId, setTaskId] = useState(null);
  const [cost, setCost] = useState("");
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Daily Cleaning', value: 'Daily Cleaning' },
    { label: 'Deep Cleaning', value: 'Deep Cleaning' },
    { label: 'Move Out Cleaning', value: 'Move Out Cleaning' },
    { label: 'Pet Cleaning', value: 'Pet Cleaning' },
  ]);
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (route.params?.task) {
      const task = route.params.task;
      setTaskId(task.id);
      setTitle(task.title);
      setValue(task.taskType);
      setCost(task.cost.toString());
      setAddress(task.address);
      setSelectedLocation(task.location);
    } else {
      setTaskId(null);
      setTitle("");
      setValue(null);
      setCost("");
      setAddress("");
      setSelectedLocation(null);
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
    }
  }, [route.params?.task]);

  const handleSave = () => {
    if (cost === "" || value === null || parseFloat(cost) < 0 || title === "" || !selectedLocation) {
      Alert.alert("Invalid input", "Please check your input values and select a location.");
      return;
    }
    const taskData = {
      title,
      taskType: value,
      cost: parseFloat(cost),
      address,
      location: selectedLocation,
    };

    if (taskId) {
      updateTask(taskId, taskData)
        .then(navigation.goBack())
        .catch(error => Alert.alert("Error", "There was a problem updating the task"));
    } else {
      publishTask(taskData)
        .then(navigation.goBack())
        .catch(error => Alert.alert("Error", "There was a problem publishing the task"));
    }
  };

  const locateCurrentPosition = async (selectedCoords) => {
    if (!selectedCoords) {
      // Get the current location if selectedCoords is not provided
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      selectedCoords = location.coords;
    }
  
    // Update the selected location
    setSelectedLocation(selectedCoords);
  
    // Reverse geocode to get the address
    let addresses = await Location.reverseGeocodeAsync(selectedCoords);
    if (addresses.length > 0) {
      setAddress(`${addresses[0].street}, ${addresses[0].city}, ${addresses[0].region}, ${addresses[0].country}`);
    }
  };
  

  return (
    <View style={styles.container}>
      <DropDownPicker open={open} value={value} items={items} setOpen={setOpen} setValue={setValue} setItems={setItems} style={styles.dropDownPicker} />
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Cost" keyboardType="numeric" value={cost} onChangeText={setCost} />
      <View style={styles.addressContainer}>
        <TextInput style={[styles.input, styles.addressInput]} placeholder="Address" value={address} onChangeText={setAddress} />
        <MaterialIcons name="my-location" size={24} style={styles.locationIcon} onPress={() => locateCurrentPosition(selectedLocation)} />
      </View>
      {location && (
        <>
        <MapView style={styles.map} initialRegion={{ latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }} onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}>
          {selectedLocation && <Marker coordinate={selectedLocation}
          onPress={() => locateCurrentPosition(selectedLocation)} />}
        </MapView>
        </>
      )}
       <View style={styles.rowContainer}>
          <PressableArea
            customizedStyle={CommonStyles.pressableSaveCustom}
              areaPressed={handleSave}
              >
              <Label
                  content="Save"
                    customizedStyle={CommonStyles.normalLabel}
                            />
          </PressableArea>
          <PressableArea
              customizedStyle={CommonStyles.pressableCancelCustom}
              areaPressed={() => {
                    navigation.goBack();
                    }}
              >
              <Label
                  content="Cancel"
                  customizedStyle={CommonStyles.normalLabel}
                            />
          </PressableArea>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  addressInput: {
    flex: 1,
  },
  locationIcon: {
    marginLeft: 10,
  },
  dropDownPicker: {
    marginBottom: 20,
  },
  map: {
    height: 250,
    marginBottom: 20,
  },

  halfContainer: {
    marginTop: 80,
    width: '90%', 
    backgroundColor: Color.backgroundColor,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
