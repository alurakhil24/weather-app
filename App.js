import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Loader from "./Loader";
import axios from "axios";
import * as Location from "expo-location";
import Weather from "./Weather";

const API_KEY = "241051bf13976dd3ddf8b8d9f247255e";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [weather, setWeather] = useState({ temp: 0, condition: "" });
  useEffect(() => {
    const geoLocation = async () => {
      try {
        const permissionsGranted = await Location.requestPermissionsAsync();
        if (permissionsGranted.status === "granted") {
          const {
            coords: { latitude, longitude },
          } = await Location.getCurrentPositionAsync();
          // Send to API and get weather
          const {
            data: {
              main: { temp },
              weather,
            },
          } = await axios.get(
            `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          setIsLoading(false);
          setWeather({
            temp: temp,
            condition: weather[0]?.main,
          });
        }
      } catch {
        console.log("error");
      }
    };
    geoLocation();
  }, []);
  return isLoading ? (
    <Loader />
  ) : (
    <Weather temp={Math.round(weather?.temp)} condition={weather?.condition} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "black",
  },
  yellowView: {
    flex: 3,
    backgroundColor: "yellow",
  },
  blueView: {
    flex: 1,
    backgroundColor: "blue",
  },
});
