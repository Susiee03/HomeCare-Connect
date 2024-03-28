import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { auth, db } from "../Firebase/FirebaseSetup";
import { signOut } from "firebase/auth";
import { getUserByEmail, updateUserByEmail } from "../Firebase/UserInformation"; 
import ImageManager from "../Components/ImageManager";

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

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>User Profile</Text>
      <ImageManager receiveImageURI={(uri) => setAvatarUri(uri)} />
      {avatarUri ? (
        <Image
          source={{ uri: avatarUri }}
          style={styles.avatar}
        />
      ) : null}
      <View style={styles.inputContainer}>
        <TextInput 
          placeholder="Username" 
          value={username} 
          onChangeText={setUsername} 
          style={styles.input}
        />
        <TextInput 
          placeholder="Phone Number" 
          value={phoneNumber} 
          onChangeText={setPhoneNumber} 
          style={styles.input}
        />
        <TextInput 
          placeholder="Address" 
          value={address} 
          onChangeText={setAddress} 
          style={styles.input}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Update Profile" onPress={handleUpdateProfile} color="#007bff" />
      </View>
      <Text style={styles.infoText}>Email: {email}</Text>
      <Text style={styles.infoText}>Rating: {rating}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Sign Out" onPress={handleLogout} color="#dc3545" />
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
});

export default Profile;