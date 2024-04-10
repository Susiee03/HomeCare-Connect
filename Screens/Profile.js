import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from "react-native";
import { auth, db } from "../Firebase/FirebaseSetup";
import { signOut } from "firebase/auth";
import { getUserByEmail, updateUserByEmail, deleteUserFromDB } from "../Firebase/UserInformation"; 
import ImageManager from "../Components/ImageManager";
import { Ionicons } from "@expo/vector-icons";
import Notification from "../Components/LocalNotification";
import LocalNotification from "../Components/LocalNotification";
import { testPushNotification } from "../Components/PushNotification";

const DEFAULT_AVATAR_URI = "assets/download.png";

const Profile = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState(auth.currentUser?.email || ""); 
  const [rating, setRating] = useState("");
  const [avatarUri, setAvatarUri] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (email) {
        const userData = await getUserByEmail(email);
        if (userData) {
          setUsername(userData.username || "");
          setPhoneNumber(userData.phoneNumber || "");
          setAddress(userData.address || "");
          setRating(userData.rating || "No orders yet");
        } else {
          console.log("No such user found with the email:", email);
        }
      }
    };

    fetchUserData();
  }, [email]);

  const handleUpdateProfile = async () => {
    if (email) {
      try {
        await updateUserByEmail(email, {
          username,
          phoneNumber,
          address,
          avatarUri,
        });
        Alert.alert("Profile Updated", "Your profile has been updated successfully.");
      } catch (error) {
        console.error("Error updating profile:", error);
        Alert.alert("Update Error", "There was an error updating your profile.");
      }
    }
  };


  const handleDeleteProfile = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {

              // Assuming deleteUserFromDB is a function that deletes the user data from Firestore
              await deleteUserFromDB(email);
              Alert.alert("Account Deleted", "Your account has been successfully deleted.");
  

              navigation.navigate('Home');
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert("Deletion Error", "There was an error deleting your account.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  


  const handleLogout = () => {
    Alert.alert(
      "Confirm Sign Out",
      "Are you sure you want to sign out?",
      [
        {
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
    <View style={styles.container}>
      <Text style={styles.headerText}>User Profile</Text>
      <View style={styles.avatarContainer}>
        <ImageManager receiveImageURI={(uri) => setAvatarUri(uri)} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.text}>Username</Text>
        <TextInput 
          placeholder="Username" 
          value={username} 
          onChangeText={setUsername} 
          style={styles.input}
        /> 
        <Text style={styles.text}>Phone Number</Text>
        <TextInput 
          placeholder="Phone Number" 
          value={phoneNumber} 
          onChangeText={setPhoneNumber} 
          style={styles.input}
        />
        <Text style={styles.text}>Address</Text>
        <TextInput 
          placeholder="Address" 
          value={address} 
          onChangeText={setAddress} 
          style={styles.input}
        />
        <Text style={styles.text}>Email</Text>
        <TextInput 
          placeholder="Email" 
          value={email} 
          style={styles.input}
          editable={false}
        />
        <Text style={styles.text}>Rating</Text>
        <TextInput 
          placeholder="Rating" 
          value={rating} 
          style={styles.input}
          editable={false}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Update Profile" onPress={handleUpdateProfile} color="#007bff" />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Delete User" onPress={handleDeleteProfile} color="red" />
      </View>
      <LocalNotification />
      <View>
      <Button
        title="Send Push Notification"
        onPress={testPushNotification}
      />
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginTop: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  text: {
    color: "#5611A1", 
    fontSize: 16, 
    alignSelf: 'flex-start', 
    marginLeft: 20, 
  },
});

export default Profile;