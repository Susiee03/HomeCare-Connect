import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground, SafeAreaView } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase/FirebaseSetup";
import { writeUserToDB } from "../Firebase/UserInformation";
import { registerForPushNotificationsAsync } from "../Components/PushNotification";
import PressableArea from "../Components/PressableArea";
import CommonStyles from "../Components/CommonStyles";

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

//   return (
//     <ImageBackground source={require('../assets/sunny.png')} style={styles.background}>
//     <View style={styles.container}>
//       <Text style={styles.label}>Email</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={(changedText) => {
//           setEmail(changedText);
//         }}
//       />
//       <Text style={styles.label}>Password</Text>
//       <TextInput
//         style={styles.input}
//         secureTextEntry={true}
//         placeholder="Password"
//         value={password}
//         onChangeText={(changedText) => {
//           setPassword(changedText);
//         }}
//       />
//       <Text style={styles.label}>Confirm Password</Text>
//       <TextInput
//         style={styles.input}
//         secureTextEntry={true}
//         placeholder="Confirm Password"
//         value={confirmPassword}
//         onChangeText={(changedText) => {
//           setConfirmPassword(changedText);
//         }}
//       />
//       <Button title="Register" onPress={signupHandler} />
//       <Button title="Already Registered? Login" onPress={loginHandler} />
//     </View>
//     </ImageBackground>
//   );
// }

return (
  <ImageBackground source={require('../assets/pxfuel.jpg')}
  style={styles.background}
  resizeMode="cover"
      >
  <SafeAreaView style={styles.container}>
    <View style={styles.headerContainer}>
      <Text style={styles.header}>HomeCare Connect</Text>
    </View>
      <View >
        <Text style={styles.text}>Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={email}
            autoCapitalize="none"
            onChangeText={(emailInput) => {
              setEmail(emailInput);
            }}
          />
        </View>
      
      <View >
        <Text style={styles.text}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={password}
            secureTextEntry={true}
            autoCapitalize="none"
            onChangeText={(numberInput) => {
              setPassword(numberInput);
            }}
          />
        </View>
      </View>

      <View >
        <Text style={styles.text}>confirm Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            secureTextEntry={true}
            autoCapitalize="none"
            onChangeText={(numberInput) => {
              setConfirmPassword(numberInput);
            }}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <PressableArea
          areaPressed={signupHandler}
          customizedStyle={styles.buttonView}
        >
          <Text style={styles.buttonText}>Signup</Text>
        </PressableArea>
        <PressableArea
          areaPressed={loginHandler}
          customizedStyle={styles.buttonView}
        >
          <Text style={styles.buttonText}>Already register? Login</Text>
        </PressableArea>
      </View>
    </View>
  </SafeAreaView>
</ImageBackground>
);
}

const styles = StyleSheet.create({
background: {
  flex: 1, 
  justifyContent: 'center', 
  alignItems: 'center', 
},
container: {
  flex: 1,
},

headerContainer: {
  flex: 2,
  alignItems: "center",
  justifyContent: "center",
},

header: {
  fontSize: 25,
},

middleContainer: {
  flex: 5,
},

inputContainer: {
  alignItems: "center",
},

text: {
  fontSize: 18,
  marginLeft: "13%",
  marginTop: 5,
},

input: {
  borderBottomWidth: 1,
  width: "75%",
  margin: 18,
  marginBottom: 20,
  fontSize: 18,
},

buttonContainer: {
  alignItems: "center",
  justifyContent: "center",
  padding: 40,
},

itemContainer: {
  margin: 10,
},

buttonText: {
  fontSize: 20,
  color: "black",
  fontWeight: "bold",
},

buttonView: [
  CommonStyles.lightGreenBackground,
  {
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: "100%",
    marginVertical: 10,
  },
],
});
