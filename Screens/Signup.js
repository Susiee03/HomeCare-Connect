import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase/FirebaseSetup";
import { writeUserToDB } from "../Firebase/UserInformation";
import { registerForPushNotificationsAsync } from "../Components/PushNotification";
 

export default function Signup({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loginHandler = () => {
    navigation.replace("Login");
  };

  const signupHandler = async() => {
    if (!email || !password || !confirmPassword) {
        Alert.alert("Fill the information as required")
        return
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
  }
    try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
      
        console.log(userCred)

        const pushToken = await registerForPushNotificationsAsync();

        console.log(pushToken);

        const userData = {
          email: userCred.user.email,
          pushToken: pushToken,
          userUid: userCred.user.uid,
        };
        console.log(userData)
        await writeUserToDB(userData); 

    } catch (error){
      if (error.code === "auth/invalid-email") {
        alert("Invalid email");
      } else if (error.code === "auth/email-already-in-use") {
        alert("Email already in use");
      } else if (error.code === "auth/weak-password") {
        alert("Password must be at least 6 characters");
      }
      else {
        console.log(error.code)
      }

    }
  }

  return (
    <ImageBackground source={require('../assets/sunny.png')} style={styles.background}>
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(changedText) => {
          setEmail(changedText);
        }}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        placeholder="Password"
        value={password}
        onChangeText={(changedText) => {
          setPassword(changedText);
        }}
      />
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(changedText) => {
          setConfirmPassword(changedText);
        }}
      />
      <Button title="Register" onPress={signupHandler} />
      <Button title="Already Registered? Login" onPress={loginHandler} />
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "stretch",
    justifyContent: "center",
  },
  input: {
    borderColor: "#552055",
    borderWidth: 2,
    width: "90%",
    margin: 5,
    padding: 5,
  },
  label: {
    marginLeft: 10,
  },
});
  