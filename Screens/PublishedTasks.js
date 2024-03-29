import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../Firebase/FirebaseSetup';

export default function PublishedTasks({ navigation }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchPublishedTasks = async () => {
      // 确保用户已登录并获取用户ID
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
    // 这里我们假设你想要传递整个任务对象到PostingTask页面
    // 请确保PostingTask页面能够处理传入的任务数据
    navigation.navigate('PostingTask', { task });
  };

  // 使用 FlatList 来渲染列表项
  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <TouchableOpacity 
        style={styles.detailButton} 
        onPress={() => handlePressDetail(item)}
      >
        <Text style={styles.detailButtonText}>Detail</Text>
      </TouchableOpacity>
      {/* 在这里添加更多想要显示的任务细节 */}
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
    backgroundColor: 'lightblue', // 选择一个适合你应用的颜色
    borderRadius: 5,
    // 可以添加更多的样式以匹配你的应用主题
  },
  detailButtonText: {
    color: 'white',
    textAlign: 'center',
    // 添加更多样式以匹配你的应用主题
  },
  // 添加更多样式来定制你的 UI
});


