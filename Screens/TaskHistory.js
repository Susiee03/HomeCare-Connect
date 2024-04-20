import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../Firebase/FirebaseSetup';
import { useNavigation } from '@react-navigation/native';
import PressableArea from '../Components/PressableArea';
import CommonStyles from '../Components/CommonStyles';
import Label from '../Components/Label';
import TaskReviewCard from '../Components/TaskReviewCard';



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

  const ReviewButton = ({ task, navigation }) => {
    const handlePress = () => {
      if (task.hasReview) {
        navigation.navigate("DisplayReview", { taskId: task.id });
      } else {
        navigation.navigate("Review", { taskId: task.id }); // Assuming you have such a screen
      }
    };
  
    if (!task.hasReview && task.type !== 'Published') {
      return (
        <TouchableOpacity style={styles.disabledButton} disabled={true}>
          <Text style={styles.disabledButtonText}>Waiting for Poster's Review</Text>
        </TouchableOpacity>
      );
    }
  
    return (
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>
          {task.hasReview ? "Review" : "Write Review"}
        </Text>
      </TouchableOpacity>
    );
  };
  


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tasks History</Text>
      {tasks.map((task) => (
        // <View key={task.id} style={styles.taskContainer}>
        //   <Text style={styles.taskTitle}>{task.title}</Text>
        //   <Text>Type: {task.type}</Text>
        //   <Text>Cost: {task.cost}</Text>
        //   <Text>Address: {task.address}</Text>
        //   <Text>Status: {task.status}</Text>
        //   <ReviewButton task={task} navigation={navigation} />
        // </View>
        <TaskReviewCard key={task.id} task={task} navigation={navigation} />

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
  button: {
    backgroundColor: '#007bff', 
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc', 
    padding: 10,
    borderRadius: 5,
  },
  disabledButtonText: {
    color: 'gray',
    textAlign: 'center',
  }
});

