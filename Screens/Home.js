import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet, Dimensions } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { db } from '../Firebase/FirebaseSetup';
import Weather from "../Components/Weather";
import TaskCard from "../Components/TaskCard"


export default function Home({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();

    const unsubscribe = onSnapshot(collection(db, 'publishedTasks'), (querySnapshot) => {
      const tasksList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksList);
    });

    return () => unsubscribe();
  }, []);

  const handleViewDetails = (task) => {
    navigation.navigate('TaskDetails', { task });
  };

  return (
    <View style={styles.container}>
      <Weather />
      <Text style={styles.title}>Nearby Tasks</Text>
      {region && (
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {tasks.map((task) => (
            <Marker
              key={task.id}
              coordinate={{ latitude: task.location.latitude, longitude: task.location.longitude }}
              title={task.title}
              description={`Type: ${task.taskType} Cost: ${task.cost}`}
            />
          ))}
        </MapView>
      )}
      <ScrollView style={styles.scrollContainer}>
        {/* {tasks.map((task) => (
          <View key={task.id} style={styles.taskContainer}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text>Type: {task.taskType}</Text>
            <Text>Cost: {task.cost}</Text>
            <Text>Address: {task.address}</Text>
            <Text>Status: {task.status}</Text>
            <View style={styles.detailButton}>
              <Text style={styles.detailButtonText} onPress={() => handleViewDetails(task)}>Details</Text>
            </View>
          </View>
        ))} */}

        {tasks.map((task) => (
          <TaskCard key={task.id} 
                    task={task} 
                    handleViewDetails={() => handleViewDetails(task)} 
                    showPressableArea={true}
          />

        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: 300,
    width: Dimensions.get('window').width,
  },
  scrollContainer: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailButton: {
    marginTop: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  detailButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});
