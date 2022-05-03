import React from "react";
import { View, StyleSheet } from "react-native";

export default function FaceTracker({ top, left, height, width }) {
  return <View style={[styles.tracker, { top, left, height, width }]}></View>;
}

const styles = StyleSheet.create({
  tracker: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#00AADD",
    borderRadius: 20,
  },
});
