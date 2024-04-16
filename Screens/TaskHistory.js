import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet, Button } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../Firebase/FirebaseSetup';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

export default function TaskHistory() {
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation(); // Hook to get the navigation object

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.log('No user logged in');
      return;
    }

    const q = query(collection(db, 'taskHistory'), where('publisherId', '==', userId));
    const z = query(collection(db, 'taskHistory'), where('acceptorId', '==', userId));

    const unsubscribeAccepted = onSnapshot(q, (querySnapshot) => {
      const acceptedTasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'Accepted' // Distinguish task types
      }));
      setTasks(prevTasks => [...prevTasks, ...acceptedTasks]);
    }, error => {
      console.error('Failed to fetch accepted tasks:', error);
    });

    const unsubscribePublished = onSnapshot(z, (querySnapshot) => {
      const publishedTasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'Published' // Distinguish task types
      }));
      setTasks(prevTasks => [...prevTasks, ...publishedTasks]);
    }, error => {
      console.error('Failed to fetch published tasks:', error);
    });

    // Cleanup function
    return () => {
      unsubscribeAccepted();
      unsubscribePublished();
    };
  }, []);

  const handleReviewPress = (taskId) => {
    // Navigate to the Review screen with the taskId as a parameter
    navigation.navigate("Review", {
      taskId: taskId,
    });
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