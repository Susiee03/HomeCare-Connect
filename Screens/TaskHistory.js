import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet, Button } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../Firebase/FirebaseSetup';
import { useNavigation } from '@react-navigation/native';

export default function TaskHistory() {
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.log('No user logged in');
      return;
    }

    const tasksRef = collection(db, 'taskHistory');
    const acceptorQuery = query(tasksRef, where('acceptorId', '==', userId));
    const publisherQuery = query(tasksRef, where('publisherId', '==', userId));

    // Create a single listener that handles both queries
    const handleSnapshot = (querySnapshot, type) => {
      const fetchedTasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: type // Either 'Accepted' or 'Published'
      }));

      setTasks(prevTasks => {
        // Create a map to avoid duplicates
        const tasksMap = new Map(prevTasks.map(task => [task.id, task]));

        // Update or add new tasks
        fetchedTasks.forEach(task => tasksMap.set(task.id, { ...tasksMap.get(task.id), ...task }));

        // Convert the map back to an array
        return Array.from(tasksMap.values());
      });
    };

    const unsubscribeAccepted = onSnapshot(acceptorQuery, snapshot => handleSnapshot(snapshot, 'Accepted'), error => {
      console.error('Failed to fetch accepted tasks:', error);
    });

    const unsubscribePublished = onSnapshot(publisherQuery, snapshot => handleSnapshot(snapshot, 'Published'), error => {
      console.error('Failed to fetch published tasks:', error);
    });

    // Cleanup function
    return () => {
      unsubscribeAccepted();
      unsubscribePublished();
    };
  }, []);

  const handleReviewPress = (taskId) => {
    navigation.navigate("Review", { taskId: taskId });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tasks History</Text>
      {tasks.map((task) => (
        <View key={task.id} style={styles.taskContainer}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text>Type: {task.type}</Text>
          <Text>Cost: {task.cost}</Text>
          <Text>Address: {task.address}</Text>
          <Text>Status: {task.status}</Text>
          {task.type === 'Published' && (
            task.hasReview ? (
              <Button
                title="Review"
                onPress={() => navigation.navigate("DisplayReview", { taskId: task.id })}
              />
            ) : (
              <Button
                title="Write Review"
                onPress={() => handleReviewPress(task.id)}
              />
            )
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
});
