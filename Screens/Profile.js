import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../Firebase/FirebaseSetup";

export default function Profile() {
  return (
    <View>
      <Text>{auth.currentUser.uid}</Text>
      <Text>{auth.currentUser.email}</Text>
    </View>
  );
}

