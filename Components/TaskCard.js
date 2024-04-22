import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import PressableArea from './PressableArea';
import CommonStyles from './CommonStyles';
import Label from './Label';

const TaskCard = ({ task, handleViewDetails, showPressableArea }) => {

  const getShortenedAddress = (address) => {
    const addressParts = address.split(',');
    const shortenedAddress = addressParts.slice(0, 3).join(',');
    return shortenedAddress;
  };

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.cardContainer}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <View style={styles.infoDisplay}>
          <Ionicons style={styles.icon} name="list-circle-sharp" size={15} />
          <Text style={styles.text}>Type: {task.taskType}</Text>
        </View>
        <View style={styles.infoDisplay}>
          <Ionicons style={styles.icon} name="logo-usd" size={15} />
          <Text style={styles.text}>Cost: {task.cost}</Text>
        </View>
        <View style={styles.infoDisplay}>
          <Ionicons style={styles.icon} name="home" size={15} />
          <Text style={styles.text}>Address: {getShortenedAddress(task.address)}</Text>
        </View>
        <View style={styles.infoDisplay}>
          <MaterialIcons name="pending" size={15} color="black" />
          <Text style={styles.text}> Status: {task.status}</Text>
        </View>
        {showPressableArea &&
          <View style={styles.detailButtonContainer}>
            <PressableArea
              customizedStyle={CommonStyles.pressableSaveCustom}
              areaPressed={handleViewDetails}
            >
              <Label
                content="Detail"
                customizedStyle={[CommonStyles.normalLabel, { fontSize: 14 }]}
              />
            </PressableArea>
          </View>
        }
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
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 16,
    position: 'relative',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoDisplay: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    marginRight: 5,
  },
  detailButtonContainer: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
});

export default TaskCard;
