import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../Firebase/FirebaseSetup';

export default function PublishedTasks({ navigation }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchPublishedTasks = async () => {
  
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.log('No user logged in');
        return;
      }

      
      
      const q = query(
        collection(db, 'publishedTasks'),
        where('publisherId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const userTasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(userTasks);
    };

    fetchPublishedTasks().catch(console.error);
  }, []);

  const handleAddTask = () => {
    navigation.navigate('PostingTask');
  };

  const handlePressDetail = (task) => {
   
    navigation.navigate('PostingTask', { task });
  };

 
  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <TouchableOpacity 
        style={styles.detailButton} 
        onPress={() => handlePressDetail(item)}
      >
        <Text style={styles.detailButtonText}>Detail</Text>
      </TouchableOpacity>
      
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
    fontSize: 20,
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
  detailButton: {
    marginTop: 5,
    padding: 10,
    backgroundColor: 'lightblue', 
    borderRadius: 5,
   
  },
  detailButtonText: {
    color: 'white',
    textAlign: 'center',
   
  },
 
});


