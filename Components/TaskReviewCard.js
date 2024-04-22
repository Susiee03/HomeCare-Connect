import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PressableArea from './PressableArea';
import CommonStyles from './CommonStyles';
import Label from './Label';

const TaskReviewCard = ({ task, navigation }) => {
  // const handlePress = () => {
  //   if (task.hasReview) {
  //     navigation.navigate("DisplayReview", { taskId: task.id });
  //   } else {
  //     navigation.navigate("Review", { taskId: task.id });
  //   }
  // };
  const handlePress = () => {
    if (task.hasReview) {
      navigation.navigate("DisplayReview", { taskId: task.id });
    } else {
      navigation.navigate("Review", { taskId: task.id }); // Assuming you have such a screen
    }
  };

  // if (!task.hasReview && task.type !== 'Published') {
  //   return (
  //     <View style={styles.cardContainer}>
  //       <View style={styles.contentContainer}>
  //         <Text style={styles.taskTitle}>{task.title}</Text>
  //         <Text>Type: {task.type}</Text>
  //         <Text>Cost: {task.cost}</Text>
  //         <Text>Address: {task.address}</Text>
  //         <Text>Status: {task.status}</Text>
  //       </View>
  //       <View style={styles.actionContainer}>
  //         <Label content="Waiting for Poster's Review" customizedStyle={styles.waitingLabel} />
  //       </View>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>{task.title}</Text>
        <Text>Type: {task.type}</Text>
        <Text>Cost: {task.cost}</Text>
        <Text>Address: {task.address}</Text>
        <Text>Status: {task.status}</Text>
        {/* </View> */}
      {/* <View style={styles.actionContainer}> */}
        {!task.hasReview && task.type !== 'Published' ? (
          <Label content="Waiting for Poster's Review" customizedStyle={{marginTop: 5 ,     
            color: "grey",
            fontWeight: "bold",
            fontSize: 16,}} />
        ) : (
          <PressableArea areaPressed={handlePress} customizedStyle={CommonStyles.pressableSaveCustom}>
            <Label content={task.hasReview ? "Review" : "Write Review"} customizedStyle={CommonStyles.normalLabel} />
          </PressableArea>
        )}
      </View>
      
    </View>
  );
};
  //   <PressableArea areaPressed={handlePress} customizedStyle={styles.cardContainer} disabled={!task.hasReview && task.type !== 'Published'}>
  //   <View style={styles.contentContainer}>
  //     <Text style={styles.taskTitle}>{task.title}</Text>
  //     <Text>Type: {task.type}</Text>
  //     <Text>Cost: {task.cost}</Text>
  //     <Text>Address: {task.address}</Text>
  //     <Text>Status: {task.status}</Text>
  //   </View>
  //   <View style={styles.actionContainer}>
  //     <Label content={task.hasReview ? "Review" : "Write Review"} customizedStyle={styles.reviewLabel} />
  //   </View>
  // </PressableArea>
//   );
// };

const styles = StyleSheet.create({
    cardWrapper: {
        borderWidth: 2,
        borderColor: 'blue', // Blue border color
        borderRadius: 8,
        overflow: 'hidden', // Ensure the border is not clipped
        marginHorizontal: 10, 
        marginBottom: 10,
    },
    container: {
        backgroundColor: '#ffffff',
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    button: {
        marginTop: 8,
        backgroundColor: '#007bff',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    // cardContainer: {
    //   flexDirection: 'row',
    //   justifyContent: 'space-between',
    //   alignItems: 'center',
    //   padding: 10,
    //   borderWidth: 1,
    //   borderColor: 'black',
    //   borderRadius: 5,
    //   marginBottom: 10,
    // },
    // contentContainer: {
    //   flex: 1,
    // },
    // actionContainer: {
    //   marginLeft: 10,
    // },
    // taskTitle: {
    //   fontWeight: 'bold',
    //   marginBottom: 5,
    // },
    // waitingLabel: {
    //   color: 'gray',
    //   fontStyle: 'italic',
    // },
    // reviewLabel: {
    //   color: 'white',
    //   fontWeight: 'bold',
    //   textAlign: 'center',
    //   backgroundColor: 'blue',
    //   paddingVertical: 5,
    //   paddingHorizontal: 10,
    //   borderRadius: 5,
    // },
  
});

export default TaskReviewCard;
