import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import React, { useState,  useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase/FirebaseSetup";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./Screens/Login";
import Signup from "./Screens/Signup";
import PostingTask from './Screens/PostingTask';
import {Ionicons} from "@expo/vector-icons";
import Drawer from "./Navigation/Drawer";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async function (notification) {
    //marking the function async will make it always return a resolved promise
    // you could use the info about incoming notification and do different behaviour for different notifications
    return {
      shouldShowAlert: true,
    };
  },
});
export default function App() {

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUserLoggedIn(!!user);
    });

    return unsubscribe;
  }, []);

  const Stack = createNativeStackNavigator();

  //console.log(auth)
  if (isUserLoggedIn) {
  return (
  
    <NavigationContainer>
      <Stack.Navigator>
        
          <Stack.Screen
            name="Home"
            component={Drawer}
            options={{ headerShown: false }}
          />

      </Stack.Navigator>
    </NavigationContainer>
  );
  } 
  else {
    return (
      <NavigationContainer>
      <Stack.Navigator>
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="PostingTask" component={PostingTask} />
          </>
      </Stack.Navigator>
    </NavigationContainer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});