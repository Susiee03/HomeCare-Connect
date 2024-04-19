import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from "react-native";
import { auth, db, storage } from "../Firebase/FirebaseSetup";
import { signOut } from "firebase/auth";
import { getUserByEmail, updateUserByEmail, deleteUserFromDB } from "../Firebase/UserInformation"; 
import ImageManager from "../Components/ImageManager";
import { Ionicons } from "@expo/vector-icons";
import Notification from "../Components/LocalNotification";
import LocalNotification from "../Components/LocalNotification";
import { testPushNotification } from "../Components/PushNotification";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
          setAvatarUri(userData.avatarUri || "");
        } else {
          console.log("No such user found with the email:", email);
        }
      }
    };

    fetchUserData();
  }, [email]);

  const handleUpdateProfile = async () => {
    let finalAvatarUri = avatarUri; // 默认使用当前的avatarUri
  
    if (email && avatarUri && avatarUri.startsWith("file://")) {
      // 如果avatarUri是本地文件的URI，先上传到Firebase Storage
      try {
        const uploadUri = await getImageData(avatarUri); // 上传图片并获取URL
        finalAvatarUri = uploadUri; // 使用上传后的URL
      } catch (error) {
        console.error("Error uploading avatar image:", error);
        Alert.alert("Upload Error", "There was an error uploading your avatar.");
        return; // 如果上传失败，终止更新操作
      }
    }
  
    // 更新用户资料，使用finalAvatarUri作为用户头像的URL
    try {
      await updateUserByEmail(email, {
        username,
        phoneNumber,
        address,
        avatarUri: finalAvatarUri,
      });
      Alert.alert("Profile Updated", "Your profile has been updated successfully.");
      setAvatarUri(finalAvatarUri); // 更新组件状态以反映新的头像URL
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Update Error", "There was an error updating your profile.");
    }
  };
  

  async function getImageData(uri) {
    try {
      const response = await fetch(uri);
      const imageBlob = await response.blob();
      const imageName = uri.substring(uri.lastIndexOf("/") + 1);
      const imageRef = ref(storage, `images/${imageName}`);
      console.log('imageName:', imageName); // 确保imageName有值
      console.log('imageRef:', imageRef); // 确保imageRef不是undefined
      const uploadResult = await uploadBytes(imageRef, imageBlob);
      console.log('uploadResult:', uploadResult); // 确保uploadResult有效
      const downloadURL = await getDownloadURL(uploadResult.ref); // 获取并返回图片的URL
      console.log('Download URL:', downloadURL); 
      return downloadURL;
    } catch (err) {
      console.log(err);
      throw err; // 将错误抛出，以便调用函数可以捕获并处理
    }
  }
  
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
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatar}
            />
          ) : (
            <ImageManager receiveImageURI={(uri) => setAvatarUri(uri)} />
          )}
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