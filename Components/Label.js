import { View, Text } from "react-native";
import React from "react";

const Label = ({ content, customizedStyle }) => {
  return (
    <>
      <Text
        style={[{color: "white", fontWeight: "bold", textAlign: "center"}, customizedStyle]}
      >
        {content}
      </Text>
    </>
  );
};

export default Label;