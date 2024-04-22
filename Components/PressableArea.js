import { StyleSheet, Pressable } from "react-native";
import React from "react";


export default function PressableArea ({ areaPressed, children, customizedStyle, disabled }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={areaPressed}
      style={({ pressed }) => {
        return [customizedStyle, pressed && styles.pressedStyle];
      }}
    >
      {children}
    </Pressable>
  );
};


const styles = StyleSheet.create({
  pressedStyle: {
    opacity: 0.5,
  },
});