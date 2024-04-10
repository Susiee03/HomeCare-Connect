import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import React, { useState,  useEffect, useRef } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase/FirebaseSetup";
import { NavigationContainer, useNavigationContainerRef, } from "@react-navigation/native";
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
  const responseListener = useRef();
  const notificationListener = useRef();
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUserLoggedIn(!!user);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("notification listener ", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("push notification");
        if (navigationRef.current) {
          //navigationRef.current.navigate("MainTabs", { screen: "Post" });
          console.log("push notification")
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
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