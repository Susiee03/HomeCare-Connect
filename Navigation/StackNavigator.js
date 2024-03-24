import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
//import { signOut } from "../firebase/auth";
import Home from "../Screens/Home";
import TaskDetails from "../Screens/TaskDetails";
import Notification from "../Screens/Notification"
import PostingTask from "../Screens/PostingTask";
import Review from "../Screens/Review";
import Profile from "../Screens/Profile";
import TaskHistory from "../Screens/TaskHistory";
import PublishedTasks from "../Screens/PublishedTasks";
import AcceptedTasks from "../Screens/AcceptedTasks";

const Stack = createStackNavigator();

const StackNavigator = ({ navigation }) => {
  
  const handleBackPress = () => {
    console.log("go back")
    if (navigation.canGoBack()) {
        console.log("can go back")
      navigation.goBack();
    } else {
        console.log("cant go back")
      navigation.navigate("Home");
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Notification")}
            style={{ paddingRight: 20 }}
          >
            <Ionicons name="notifications" size={24} color="black" />
          </TouchableOpacity>
        ),
        headerRightContainerStyle: {
          padding: 10,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: "Home",
        }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{
          title: "Notification",
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
      {/* <Stack.Screen
        name="TaskHistory"
        component={TaskHistory}
        options={{
          title: "Task History",
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
        name="PublishedTask"
        component={PublishedTasks}
        options={{
          title: "Published Tasks",
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleBackPress}
              style={{ paddingLeft: 20 }}
            >
              <Ionicons name="arrow-back-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Accepted Tasks"
        component={AcceptedTasks}
        options={{
          title: "AcceptedTasks",
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleBackPress}
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
              onPress={handleBackPress}
              style={{ paddingLeft: 20 }}
            >
              <Ionicons name="arrow-back-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Posting Task"
        component={PostingTask}
        options={{
          title: "Posting Task",
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleBackPress}
              style={{ paddingLeft: 20 }}
            >
              <Ionicons name="arrow-back-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
        }}
      /> */}
 
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          title: "Profile",
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleBackPress}
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
