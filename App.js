import React from "react";
import Home from "./screen/Home";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from "react-native";
import { StatusBar } from "expo-status-bar";

LogBox.ignoreLogs(['Key "cancelled" in the image picker']);

export default function App() {
  return (
    <NavigationContainer>
      <Home />
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
