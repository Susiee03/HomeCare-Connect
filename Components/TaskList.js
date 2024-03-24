import { FlatList, View, Text , StyleSheet, Pressable} from 'react-native';
import Label from './Label'
import Card from "./Card";
import { Ionicons } from "@expo/vector-icons";
//import { userActivities } from '../ActivityContext'; //
import PressableArea from '../Components/PressableArea'
//import {database} from '../firebase/firebaseSetup'
import { collection, onSnapshot, where, orderBy, query, QuerySnapshot } from "firebase/firestore";
import { useEffect, useState } from 'react';

export default function TaskList({pageName, navigation}) {

    useEffect(() => {
      let q;
      if (pageName === "Published Tasks") {
        q = query(collection(database, "tasks"));
      } else if (pageName === "Tasks Accepted") {
        q = query(
          collection(database, "activities"),
          where("accept", "==", true)
        );
      }
      onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.empty) {
          setActivityList([]);
        } else {
          let activities = [];
          querySnapshot.forEach((doc) => {
            activities.push({ ...doc.data(), id: doc.id });
          });
          setTaskList(tasks);
        }
      });
    }, [])
    const [taskList, setTaskList] = useState([]);


    return (
        <FlatList
          contentContainerStyle={{ alignItems: "center" }}
          data={taskList}
          renderItem={({ item }) => {
            return (
              <PressableArea
                key={item.id}
                areaPressed={() => {
                  navigation.navigate("Edit", { activity: item, pageName: pageName });
                }}
                customizedStyle={[styles.container, styles.pressableAreaCustom]}
              >
                
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Label content={item.value} style = {{textAlign: "left"}} />
                </View> 
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end'}}>
                      {item.special === true  && (
                        <Ionicons name="warning" size={25} color="yellow"
                        style={{ marginRight: 1 }} />
                      )}
                   
                
                    <Card customizedStyle={{ justifyContent: 'center', marginRight: 5}}>
                      <Label
                          content={item.timestamp }
                          customizedStyle={{ color: "black" }}
                      />
                    </Card>
                    <Card customizedStyle={{ width: 65, justifyContent: 'center'}}>
                      <Label
                          content={`${item.min.toString()} mins`}
                          customizedStyle={{ color: "black", fontSize: 14}}
                      />
                    </Card>
                  </View>
              </PressableArea>
            );
          }}
        />
      );
  };



const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: 350,
    paddingHorizontal: 20,
    marginTop: 10, 
    marginBottom: 10,
    height: 50, 
    backgroundColor: "rgb(60,61,132)", 
    borderRadius: 10, 
    alignItems: "center",
    
  },

})