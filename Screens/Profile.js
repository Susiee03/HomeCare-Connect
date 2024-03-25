import React from "react";
import { TouchableOpacity, View, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../Firebase/FirebaseSetup";
import { signOut } from "firebase/auth";

export default function Profile({navigation}) {
  const handleLogout = () => {
    Alert.alert(
      "Confirm Sign Out",
      "Are you sure you want to sign out?",
      [{
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          onPress: () => signOut(auth),
        },
      ],
      { cancelable: false }
    );
  };

  
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 10 }}>
          <Ionicons name="log-out" size={24} color="grey" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);


  return (
    <View>
      <Text>{auth.currentUser.uid}</Text>
      <Text>{auth.currentUser.email}</Text>
    </View>
  );
}

