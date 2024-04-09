import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Alert } from 'react-native';
import Label from "../Components/Label";
import DropDownPicker from 'react-native-dropdown-picker';
import PressableArea from "../Components/PressableArea";
import { publishTask, updateTask } from '../Firebase/FirebaseHelper';

export default function PostingTask({ navigation, route }) {
  const [taskId, setTaskId] = useState(null);
  const [cost, setCost] = useState("");
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Daily Cleaning', value: 'Daily Cleaning'},
    {label: 'Deep Cleaning', value: 'Deep Cleaning'},
    {label: 'Move Out Cleaning', value: 'Move Out Cleaning'},
    {label: 'Pet Cleaning', value: 'Pet Cleaning'},
  ]);
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (route.params?.task) {
      const task = route.params.task;
      setTaskId(task.id);
      setTitle(task.title);
      setValue(task.taskType);
      setCost(task.cost.toString());
      setAddress(task.address);
    }
  }, [route.params?.task]);

  const handleSave = () => {
    if (cost === "" || value === null || parseFloat(cost) < 0 || title === "") {
      Alert.alert("Invalid input", "Please check your input values", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
      return;
    }
    const taskData = {
      title: title,
      taskType: value, 
      cost: parseFloat(cost),
      address: address,
    };

    if (taskId) {
      updateTask(taskId, taskData)
        .then(() => {
          navigation.goBack();
        })
        .catch((error) => {
          console.error("Update Task Error:", error);
          Alert.alert("Error", "There was a problem updating the task");
        });
    } else {
      publishTask(taskData)
        .then(() => {
          navigation.goBack();
        })
        .catch((error) => {
          console.error("Publish Task Error:", error);
          Alert.alert("Error", "There was a problem publishing the task");
        });
    }
  };

  return (
    <View style={styles.container}>  
        <View style={styles.label}>
        <Label
            content="Type"
            customizedStyle={{
              color: "rgb(60,61,132)",
              fontWeight: "bold",
              fontSize: 16,
              marginTop: 20, textAlign: "left"}
            }
        />
        
        <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            style={{ backgroundColor:  "rgb(144, 142, 179)" }} 
            containerStyle={ { zIndex: 5000 }}
        />

          <Label
                content="Title "
                customizedStyle={ {
                marginTop: 20,
                 textAlign: "left",
                  color: "rgb(60,61,132)",
                  fontWeight: "bold",
                  fontSize: 16,
                
              }
            }
            />
            <TextInput
                style={styles.input}
                value={title}
                autoCapitalize="none"
                onChangeText={setTitle}
            />

            <Label
                content="Cost "
                customizedStyle={ {
                marginTop: 20,
                 textAlign: "left",
                  color: "rgb(60,61,132)",
                  fontWeight: "bold",
                  fontSize: 16,
                
              }
            }
            />
            <TextInput
                style={styles.input}
                value={cost}
                autoCapitalize="none"
                onChangeText={setCost}
            />

            <Label
                content="Address"
                customizedStyle={ {
                    marginTop: 20, 
                    textAlign: "left",
                    color: "rgb(60,61,132)",
                    fontWeight: "bold",
                    fontSize: 16,
                  
                }
              }
                />
            <TextInput style={styles.input}
                value={address}
                autoCapitalize="none"
                onChangeText={setAddress} >
            </TextInput>



        <View style={styles.rowContainer}>  
            <PressableArea 
                customizedStyle={styles.pressableCancelCustom}
                areaPressed={() => {
                        navigation.goBack();
                    }}  
                     >  
                <Label
                    content="Cancel"
                    customizedStyle={
                        {marginTop: 5,     
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 16,}
                        }
                /> 
            </PressableArea>
            <PressableArea 
                  customizedStyle={styles.pressableSubmitCustom}
                  areaPressed = {() => {
                    if (cost === "" || value === null || parseFloat(cost) < 0 || title === "") {
                      Alert.alert("Invalid input", "Please check your input values", [
                        { text: "OK", onPress: () => console.log("OK Pressed") },
                      ]);
                      return;
                    }
                    const taskData = {
                      title: title,
                      taskType: value, 
                      cost: parseFloat(cost),
                      address: address,
                    };
                    publishTask(taskData).then(() => {
                      navigation.goBack();
                    }).catch((error) => {
                      console.error("Publish Task Error:", error);
                      Alert.alert("Error", "There was a problem publishing the task");
                    });
                  }}
                >
                <Label
                    content="Save"
                    customizedStyle={
                      {marginTop: 5,     
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 16,}
                      }
                /> 
            </PressableArea>
            </View>
        </View>
    </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(154,150,221)",
    width: '100%', 
  },
  label: {
      fontSize: 18,
      marginBottom: 10,
      marginTop: 30,
      paddingHorizontal: 10,
  },
  input: {
    height: 40,
    margin: 2,
    borderWidth: 2,
    borderRadius: 10, 
    padding: 10,
    color: "rgb(60,61,132)",
},
rowContainer: {
  marginTop: 90,
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
},

pressableCancelCustom: { 
    marginTop: 30, 
    width: 120, 
    height: 40,
    width: 120,
    height: 30,
    backgroundColor:  "red",
    borderRadius: 5, 
  },


pressableSubmitCustom: 
  { marginTop: 30, width: 120, height: 40, 
    width: 120,
    height: 30,
    backgroundColor:  "blue",
    borderRadius: 5,},


})