import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Assuming you're using Ionicons for icons

export default function PublishedTasks({ navigation }) {
  const handleAddTask = () => {
    // Navigate to the PostingTask page
    navigation.navigate("PostingTask");
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{ flex: 1 }}>
        <Text>Published Tasks</Text>
      </View>
      <TouchableOpacity onPress={handleAddTask} style={{ marginRight: 10 }}>
        <Ionicons name="add" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
}


