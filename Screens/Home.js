import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseSetup';
import { acceptTask } from '../Firebase/FirebaseHelper';

export default function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'publishedTasks'), (querySnapshot) => {
      const tasksList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksList);
    });

    return () => unsubscribe(); // 清理订阅
  }, []);

  const handleAcceptTask = async (taskId) => {
    try {
      await acceptTask(taskId);
      alert('Task accepted successfully!');
    } catch (error) {
      console.error('Error accepting task', error);
      alert('Failed to accept task');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Published Tasks</Text>
      {tasks.map((task) => (
        <View key={task.id} style={styles.taskContainer}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text>Type: {task.taskType}</Text>
          <Text>Cost: {task.cost}</Text>
          <Text>Address: {task.address}</Text>
          <Text>Status: {task.status}</Text>
          {task.status === 'in progress' ? (
            <View style={styles.acceptedButton}>
              <Text style={styles.acceptButtonText}>Accepted</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleAcceptTask(task.id)}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          )}
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
  acceptButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50', // Green background
    padding: 10,
    borderRadius: 5,
  },
  acceptedButton: {
    marginTop: 10,
    backgroundColor: '#cccccc', // Grey background, indicating the task is already accepted
    padding: 10,
    borderRadius: 5,
  },
  acceptButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});
