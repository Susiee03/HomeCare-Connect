import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../Firebase/FirebaseSetup'; 

export default function AcceptedTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const userId = auth.currentUser?.uid; 
    if (!userId) {
      console.log('No user logged in');
      return;
    }


    const q = query(collection(db, 'acceptedTasks'), where('acceptorId', '==', userId));


    const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
      <Text style={styles.title}>Accepted Tasks</Text>
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
