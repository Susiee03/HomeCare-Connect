import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
//import { signOut } from "../firebase/auth";
import Home from "../Screens/Home";
import TaskDetails from "../Screens/TaskDetails";
import Notification from "../Components/LocalNotification"
import Review from "../Screens/Review";
import PublishedTasks from "../Screens/PublishedTasks";
import AcceptedTasks from "../Screens/AcceptedTasks";
import DisplayReview from "../Screens/DisplayReview";
import BottomTabNavigator from "./BottomTab";
import PostingTask from "../Screens/PostingTask";
import CommonStyles from "../Components/CommonStyles";

const Stack = createStackNavigator();

const StackNavigator = ({ navigation }) => {


  return (
    <Stack.Navigator
    
    >
      <Stack.Screen
        name="HomeScreen"
        component={BottomTabNavigator}
        options={{
           headerShown: false 
        }}
      />

 
      <Stack.Screen
        name="TaskDetails"
        component={TaskDetails}
        options={{
          title: "TaskDetails",
          headerLeft: () => (
            <TouchableOpacity
              onPress={()=> {navigation.goBack()}}
              style={{ paddingLeft: 20 }}
            >
              <Ionicons name="arrow-back-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
        }}
      /> 

      <Stack.Screen
        name="Review"
        component={Review}
        options={{
          title: "Review",
          headerLeft: () => (
            <TouchableOpacity
              onPress={()=> {navigation.goBack()}}
              style={{ paddingLeft: 20 }}
            >
              <Ionicons name="arrow-back-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
        }}
      />  
      <Stack.Screen
        name="DisplayReview"
        component={DisplayReview}
        options={{
          title: "Review",
          headerLeft: () => (
            <TouchableOpacity
              onPress={()=> {navigation.goBack()}}
              style={{ paddingLeft: 20 }}
            >
              <Ionicons name="arrow-back-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
        }}
      />  

    </Stack.Navigator>
  );
};

export default StackNavigator;
