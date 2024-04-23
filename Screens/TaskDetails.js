import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../Firebase/FirebaseSetup';
import { acceptTask, finishTask } from '../Firebase/FirebaseHelper';
import PressableArea from '../Components/PressableArea';
import CommonStyles from '../Components/CommonStyles';
import Label from '../Components/Label';


const TaskDetails = ({ route }) => {
  const { task } = route.params;
  const navigation = useNavigation();
  const [buttonLabel, setButtonLabel] = useState('');
  const [action, setAction] = useState(() => () => {});

  useEffect(() => {
    const currentUserUid = auth.currentUser.uid;
    if (task.publisherId === currentUserUid) {
      if (task.status === 'in progress') {
        setButtonLabel('Finish Task');
        setAction(() => () => finishTask(task.id)
          .then(() => {
            Alert.alert('Success', 'Task closed and moved to history successfully');
            navigation.navigate('HomeScreen');
          }));
      } else if (task.status === 'closed') {
        setButtonLabel('Task Closed');
      } else {
        setButtonLabel('Not accepted yet');
      }
    } else if (task.status === 'open') {
      setButtonLabel('Accept');
      setAction(() => () => acceptTask(task.id).then(() => {
        Alert.alert('Success', 'Task accepted successfully');
        setButtonLabel('Accepted');
      }));
    } else if (task.status === 'in progress') {
      setButtonLabel('Accepted');
    } else if (task.status === 'closed') {
      setButtonLabel('Task Closed');
    }
  }, [task]);

  const handlePress = () => {
    action().catch((error) => {
      Alert.alert('Error', error.message);
    });
  };

  const backgroundColorChoose = buttonLabel === 'Not accepted yet' || buttonLabel === 'Accepted' ? "grey" : "blue";

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.cardContainer}>
        <Text style={styles.title}>{task.title}</Text>
        <Text>Type: {task.taskType}</Text>
        <Text>Cost: ${task.cost}</Text>
        <Text>Address: {task.address}</Text>
        <Text>Status: {task.status}</Text>
        {task.acceptorId && <Text>Accepted By: {task.acceptorId}</Text>}
        <PressableArea
          customizedStyle={{
            marginTop: 50,
            marginLeft: 80,
            width: 150,
            height: 40,
            backgroundColor: backgroundColorChoose,
            borderRadius: 5,
          }}
          disabled={buttonLabel === 'Not accepted yet' || buttonLabel === 'Accepted'}
          areaPressed={handlePress}
        >
          <Label
            content={buttonLabel}
            customizedStyle={[CommonStyles.normalLabel, {fontSize: 24}]}
          />
        </PressableArea>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    borderWidth: 2,
    borderColor: 'blue',
    borderRadius: 8,
    marginHorizontal: 16, 
    marginBottom: 16,
    marginTop: 20,
  },
  // container: {
  //   flex: 1,
  //   padding: 20,
  //   backgroundColor: 'white',
  // },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default TaskDetails;
