import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { collection, getDocs, onSnapshot } from 'firebase/firestore'; 
import { db } from '../Firebase/FirebaseSetup';
import Weather from "../Components/Weather"

export default function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const tasksCollectionRef = collection(db, 'publishedTasks');

    const unsubscribe = onSnapshot(tasksCollectionRef, (querySnapshot) => {
      const tasksList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Weather />
      <Text style={styles.title}>Published Tasks</Text>
      {tasks.map((task) => (
        <View key={task.id} style={styles.taskContainer}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text>Type: {task.taskType}</Text>
          <Text>Cost: {task.cost}</Text>
          <Text>Address: {task.address}</Text>
          <Text>Status: {task.status}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
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
});
