import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, onSnapshot } from 'firebase/firestore'; // 导入onSnapshot
import { db, auth } from '../Firebase/FirebaseSetup';
import { deleteTask } from '../Firebase/FirebaseHelper';
import CommonStyles from "../Components/CommonStyles"
import Label from '../Components/Label';
import PressableArea from "../Components/PressableArea"

export default function PublishedTasks({ navigation }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.log('No user logged in');
      return;
    }

    const q = query(
      collection(db, 'publishedTasks'),
      where('publisherId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userTasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(userTasks);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTask = () => {
    navigation.navigate("PostingTask")
  };

  const handlePressDetail = (task) => {
    navigation.navigate('PostingTask', { task });
  };


  const handleDeleteTask = async (taskId) => {
    // Display an alert to confirm deletion
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              // Call the deleteTask function if user presses Delete
              await deleteTask(taskId);
              console.log(`Task deleted with ID: ${taskId}`);
            } catch (error) {
              console.error("Error deleting task", error);
            }
          },
          style: "destructive" 
        }
      ],
      { cancelable: true } // Allow the user to dismiss the alert by tapping outside
    );
  };
  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.title}</Text>

      <View style={styles.rowContainer}>
        <PressableArea
          customizedStyle={CommonStyles.pressableSaveCustom}
            areaPressed={() => handlePressDetail(item)}
            >
            <Label
                content="Edit"
                  customizedStyle={CommonStyles.normalLabel}
                          />
        </PressableArea>
        <PressableArea
            customizedStyle={CommonStyles.pressableCancelCustom}
            areaPressed={() => handleDeleteTask(item.id)}
            >
            <Label
                content="Delete"
                customizedStyle={CommonStyles.normalLabel}
                          />
        </PressableArea>
      </View>
    </View>
  );

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Published Tasks</Text>
        </View>
        <TouchableOpacity onPress={handleAddTask} style={{ marginRight: 10 }}>
          <Ionicons name="add" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 10,
  },
  taskItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
