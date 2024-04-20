import React, { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet, Image } from "react-native";
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
          setLoaded(true); 
        } catch (error) {
          console.error("Error fetching location:", error);
          setLoaded(true); 
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
  
    const getWeatherIcon = () => {
      if (weatherData) {
        switch (weatherData.weather[0].main) {
          case "Clear":
            return require('../assets/sunny.png');
          case "Clouds":
            return require('../assets/cloud.png');
          case "Rain":
            return require('../assets/rain.png');
          default:
            return null;
        }
      }
      return null;
    };

    return (
      <View style={styles.weatherContainer}>
        {weatherData && loaded ? (
          <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, alignItems: 'flex-left' }}>
              <Image source={getWeatherIcon()} style={{ width: 80, height: 80 }} />
              </View>
              <Text >{weatherData.weather[0].main === "Clear" ? "Sunny" : weatherData.weather[0].main} {'\n'}
                     {weatherData.main.temp}˚C {'\n'}
                    {weatherData.main.humidity}% humidity {'\n'}
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
