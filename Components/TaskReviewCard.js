import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PressableArea from './PressableArea';
import CommonStyles from './CommonStyles';
import Label from './Label';

const TaskReviewCard = ({ task, navigation }) => {
  const handlePress = () => {
    if (task.hasReview) {
      navigation.navigate("DisplayReview", { taskId: task.id });
    } else {
      navigation.navigate("Review", { taskId: task.id });
    }
  };

  return (
    <View style={styles.cardWrapper}>
        <View style={styles.container}>
        <Text style={styles.title}>{task.title}</Text>
        <Text>Type: {task.type}</Text>
        <Text>Cost: {task.cost}</Text>
        <Text>Address: {task.address}</Text>
        <Text>Status: {task.status}</Text>
        {/* <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>
            {task.hasReview ? "Review" : "Write Review"}
            </Text>
        </TouchableOpacity> */}
        <PressableArea
              customizedStyle={CommonStyles.pressableSaveCustom}
              areaPressed={handlePress}
            >
            <Label
              content={task.hasReview ? "Review" : "Write Review"}
                customizedStyle={CommonStyles.normalLabel}
                        />
            </PressableArea>
        </View>
    </View>
  );
};

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
});

export default TaskReviewCard;
