import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";

export default function RequestPremissions() {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.text}>
        Pour utiliser l'app, vous devez autoriser l'accès à la caméra, au micro
        et à la bibliothèque photos.
      </Text>
      <TouchableOpacity onPress={() => Linking.openSettings()}>
        <Text style={styles.buttonText}>Accéder aux réglages</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 15,
    textAlign: "center",
  },
  buttonText: {
    color: "#00AADD",
    fontWeight: "bold",
  },
});
