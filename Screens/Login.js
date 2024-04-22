import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, SafeAreaView, StatusBar, ImageBackground } from "react-native";
import { auth } from "../Firebase/FirebaseSetup"
import PressableArea from '../Components/PressableArea';
import Label from "../Components/Label"
import CommonStyles from '../Components/CommonStyles';

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signupHandler = () => {
    navigation.navigate("Signup");
  };
  const loginHandler = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Fields should not be empty");
        return;
      }
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCred);
    } catch (err) {
      if(err.code==="auth/invalid-email"){
        Alert.alert("User does not exist");}
      else if(err.code==="auth/wrong-password"){
        Alert.alert("Invalid password");}
      else if (err.code === "auth/invalid-credential") {
        Alert.alert("Password is invalid, make sure to enter the correct password")
      }
      console.log(err);
    }
  };

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

        <View style={styles.buttonContainer}>
          <PressableArea
            areaPressed={loginHandler}
            customizedStyle={styles.buttonView}
          >
            <Text style={styles.buttonText}>Login</Text>
          </PressableArea>
          <PressableArea
            areaPressed={signupHandler}
            customizedStyle={styles.buttonView}
          >
            <Text style={styles.buttonText}>Create An Account</Text>
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

  buttonView: {
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: "100%",
    marginVertical: 10,
  },
  
});
