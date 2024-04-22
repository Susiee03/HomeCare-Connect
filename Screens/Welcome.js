import { View, Text, Button, StyleSheet, Image, ImageBackground } from 'react-native'
import React from 'react'
import PressableArea from '../Components/PressableArea';
import CommonStyles from '../Components/CommonStyles';


export default function Welcome({navigation}) {
  return (
    <ImageBackground source={require('../assets/pxfuel.jpg')}
    style={styles.background}
    resizeMode="cover"
        >
      <Text style={styles.title}>HomeCare Connect</Text>
      <Text style={styles.slogan}>Find the all-in-one solution for household services.</Text>
      <View style={styles.buttonContainer}>
          <PressableArea
            areaPressed={()=>{navigation.navigate("Login")}}
            customizedStyle={styles.buttonView}
          >
            <Text style={styles.buttonText}>Login</Text>
          </PressableArea>
          <PressableArea
            areaPressed={()=>{navigation.navigate("Signup")}}
            customizedStyle={styles.buttonView}
          >
            <Text style={styles.buttonText}>Signup</Text>
          </PressableArea>
        </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
    background: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
      },
    container: {
        flex: 1,
        // textAlign: 'center',
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    title: {
        marginTop: 100,
        fontSize: 48,
        fontWeight: 800,
        textAlign: 'center',
    },
    slogan: {
        width: 250,
        textAlign: 'center',
        marginTop: 30,
        fontSize: 20,
    },
    button: {
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        margin: 10,
        width: 300,
    },
    buttonText: {
        fontSize: 20,
        color: "black",
        fontWeight: "bold",
      },
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
    },
    buttonView: {
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        width: "100%",
    },
      

})