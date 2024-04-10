import React, { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet } from "react-native";
import * as Location from "expo-location";
import {WEATHER_API_KEY} from "@env"
 
export default function Weather() {
    const [location, setLocation] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [loaded, setLoaded] = useState(false); // Set loaded to false initially
  
    useEffect(() => {
      const fetchData = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }
  
        try {
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
          setLoaded(true); // Set loaded to true after obtaining location
        } catch (error) {
          console.error("Error fetching location:", error);
          setLoaded(true); // Set loaded to true even in case of error
        }
      };
  
      fetchData();
    }, []); 
  
    useEffect(() => {
      if (!location || !loaded) return; 
  
      async function fetchWeatherData(location) {
        let lat = location.coords.latitude;
        let long = location.coords.longitude;
        const API = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${WEATHER_API_KEY}&units=metric`;
  
        try {
          const response = await fetch(API);
          if (response.status === 200) {
            const data = await response.json();
            //console.log(data)
            setWeatherData(data);
          } else {
            setWeatherData(null);
          }
        } catch (error) {
          console.error("Error fetching weather data:", error);
          setWeatherData(null);
        }
      }
  
      fetchWeatherData(location);
    }, [location, loaded]); 
  
    return (
      <View style={styles.weatherContainer}>
        {weatherData && loaded ? (
          <>
            <View >
              <Text >Current Weather summary: 
                    You are at {weatherData.name}, it is {weatherData.weather[0].main} now, current temparature is {weatherData.main.temp}˚, 
                    humidity is {weatherData.main.humidity}%.
              </Text>
            </View>
          </>
        ) : (
          <Text>Loading weather data...</Text>
        )}
      </View>
    );
  }


const styles = StyleSheet.create({
    weatherContainer: {
        //flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

});
