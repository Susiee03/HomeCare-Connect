import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import React, { useState,  createContext, useContext } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PublishedTasks from './Screens/PublishedTasks';
import AcceptedTasks from './Screens/AcceptedTasks';
import Profile from './Screens/Profile';
import Home from './Screens/Home'
import {Ionicons} from "@expo/vector-icons";
import Drawer from "./Navigation/Drawer";

export default function App() {
  const Tab = createBottomTabNavigator();


  const Stack = createNativeStackNavigator();
  // function StartRender({navigation}) {
  //   return <StartScreen 
  //     navigation = {navigation}
  //   />
  // }
  //console.log(route.params.pageName)
  return (

      <NavigationContainer>
        <Stack.Navigator 
          // initialRouteName="Start"
          screenOptions={{
            //headerStyle: Styles.darkPurple,
            headerTintColor: "white",
            headerTitleAlign:"center",
          }}
          >

          <Stack.Screen
            name="Home"
            component={Drawer}
            options={{ title: "HomePage", headerBackTitleVisible: false }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    //  </ActivitiesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});