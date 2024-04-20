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
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import PressableArea from '../Components/PressableArea';
import CommonStyles from '../Components/CommonStyles';
import Label from '../Components/Label';

const Profile = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState(auth.currentUser?.email || ""); 
  const [rating, setRating] = useState("");
  const [avatarUri, setAvatarUri] = useState("");
  const [location, setLocation] = useState(null);
  const [userUid, setUserUid] = useState(auth.currentUser?.uid || auth.userUid);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

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
          setIsUpdatingAvatar(false);
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

  const locateCurrentPosition = async (selectedCoords) => {
    if (!selectedCoords) {
      // Get the current location if selectedCoords is not provided
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      selectedCoords = location.coords;
    }
  
    // Update the selected location
    setSelectedLocation(selectedCoords);
  
    // Reverse geocode to get the address
    let addresses = await Location.reverseGeocodeAsync(selectedCoords);
    if (addresses.length > 0) {
      setAddress(`${addresses[0].street}, ${addresses[0].city}, ${addresses[0].region}, ${addresses[0].country}`);
    }
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

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      });
    };
    
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
    <View style={styles.container}>
      {isUpdatingAvatar || !avatarUri ? (
        <ImageManager receiveImageURI={(uri) => {
          setAvatarUri(uri);
          setIsUpdatingAvatar(false);
        }} />
      ) : (
        <>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <TouchableOpacity 
            style={styles.cameraIcon} 
            onPress={() => setIsUpdatingAvatar(true)}
          >
            <Ionicons name="camera" size={24} color="white" />
          </TouchableOpacity>
        </>
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
        <Text style={styles.text}>Email</Text>
        <TextInput 
          placeholder="Email" 
          value={email} 
          style={styles.input}
          editable={false}
        />
        <Text style={styles.text}>Address</Text>
        <View style={styles.addressContainer}>
        <TextInput style={[styles.input, styles.addressInput]} placeholder="Address" value={address} onChangeText={setAddress} />
        <MaterialIcons name="my-location" size={24} style={styles.locationIcon} onPress={() => locateCurrentPosition(selectedLocation)} />
      </View>
      {location && (
        <>
        <MapView style={styles.map} initialRegion={{ latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }} onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}>
          {selectedLocation && <Marker coordinate={selectedLocation}
          onPress={() => locateCurrentPosition(selectedLocation)} />}
        </MapView>
        </>
      )}

      </View>
      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleUpdateProfile} style={styles.button} >
        <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.columnContainer}>
        <PressableArea
                customizedStyle={CommonStyles.pressableSaveCustom}
              
                areaPressed={handleUpdateProfile}
                
              >
            <Label
                content="Update Profile"
                  customizedStyle={CommonStyles.normalLabel}
                          />
          </PressableArea>
          <LocalNotification />
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
  button: {
    backgroundColor: '#007bff', 
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    marginTop: 10,
  },
  avatarContainer: {
    marginBottom: 20,
    alignItems: 'center',
    position: 'relative', // This makes it a reference point for absolute positioning
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute', // Position absolutely within avatarContainer
    right: 0, // Align to the right edge of avatarContainer
    top: 0, // Align to the top edge of avatarContainer
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Optional: Darken the icon background slightly
    borderRadius: 12, // Circular background
    padding: 6, // Padding around the icon for better touch area
  },
  text: {
    color: "#007bff", 
    fontSize: 16, 
    alignSelf: 'flex-start', 
    marginLeft: 10, 
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  addressInput: {
    flex: 1,
    marginRight: 10, // ensures space between text input and icon
  },
  locationIcon: {
    padding: 10,
    backgroundColor: '#ccc', // Example background color
    borderRadius: 10,
  },
  map: {
    width: '100%',
    height: 200, // Example height
  },
  columnContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default Profile;