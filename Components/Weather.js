import React, { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet, Image } from "react-native";
import * as Location from "expo-location";
import { WEATHER_API_KEY } from "@env";

export default function Weather() {
    const [location, setLocation] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [loaded, setLoaded] = useState(false);

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
          <View style={styles.weatherDetails}>
            <Image source={getWeatherIcon()} style={styles.weatherIcon} />
            <View style={styles.weatherText}>
              <Text style={styles.weatherMain}>{weatherData.weather[0].main === "Clear" ? "Sunny" : weatherData.weather[0].main}</Text>
              <View style={styles.temperatureHumidity}>
                <Text style={styles.temperature}>{weatherData.main.temp}˚C</Text>
                <Text style={styles.humidity}>{weatherData.main.humidity}% humidity</Text>
              </View>
            </View>
          </View>
        ) : (
          <Text>Loading weather data...</Text>
        )}
      </View>
    );    
}

const styles = StyleSheet.create({
  weatherContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  weatherDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    width: 30,
    height: 30,
  },
  weatherText: {
    marginLeft: 8,
  },
  weatherMain: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  temperatureHumidity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperature: {
    fontSize: 14,
    marginRight: 4,
  },
  humidity: {
    fontSize: 14,
  },
  
});
