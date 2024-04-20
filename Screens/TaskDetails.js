import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { auth } from '../Firebase/FirebaseSetup'; 
import { acceptTask, finishTask } from '../Firebase/FirebaseHelper';
import PressableArea from '../Components/PressableArea';
import CommonStyles from '../Components/CommonStyles';
import Label from '../Components/Label';

const TaskDetails = ({ route }) => {
  const { task } = route.params;

  const [buttonLabel, setButtonLabel] = useState('');
  const [action, setAction] = useState(() => () => {});

  useEffect(() => {
    const currentUserUid = auth.currentUser.uid;
    if (task.publisherId === currentUserUid) {
      if (task.status === 'in progress') {
        setButtonLabel('Finish Task');
        console.log(task.id)
        setAction(() => () => finishTask(task.id).then(() => {
          Alert.alert('Success', 'Task closed and moved to history successfully');
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
    action()
      .then(() => {
        
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
        console.error('Error executing task action:', error);
      });
  };
  const backgroundColorChoose = buttonLabel === 'Not accepted yet' || buttonLabel === 'Accepted' ? "grey" : "blue";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      <Text>Type: {task.taskType}</Text>
      <Text>Cost: ${task.cost}</Text>
      <Text>Address: {task.address}</Text>
      <Text>Status: {task.status}</Text>
      {task.acceptorId && <Text>Accepted By: {task.acceptorId}</Text>}
      
        <PressableArea
              customizedStyle={{  
                marginTop: 50, 
                marginLeft: 100,
                width: 120, 
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
      {/* <Button
        title={buttonLabel}
        onPress={handlePress}
        disabled={buttonLabel === 'Not accepted yet' || buttonLabel === 'Accepted'}
      /> */}
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
 
});

export default TaskDetails;
