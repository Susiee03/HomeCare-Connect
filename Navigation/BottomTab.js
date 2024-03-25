import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import StackNavigator from "./StackNavigator";
import TaskHistory from "../Screens/TaskHistory"
import AcceptedTasks from "../Screens/AcceptedTasks";
import PublishedTasks from "../Screens/PublishedTasks";


const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "HomeTab") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "TaskHistory") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "PublishedTasks") {
            iconName = focused ? "push" : "push";
          } 
          else if (route.name === "AcceptedTasks") {
            iconName = focused ? "checkbox" : "checkbox";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          display: "flex",
          backgroundColor: "#fff",
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={StackNavigator} 
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="TaskHistory"
        component={TaskHistory}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="PublishedTasks"
        component={PublishedTasks}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="AcceptedTasks"
        component={AcceptedTasks}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;