import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const flashIcons = {
  on: "flash",
  off: "flash-off",
  auto: "flash-auto",
};

export default function CameraControls({
  onChangeCamera, // callback de changement de caméra
  onTakePicture, // callback de prise d'une photo
  onToggleRecord, // callback de démarrage/arrêt un enregistrement video
  isRecording, // Statut de l'enregistrement
  onToggleFlash, // callback de changement de statut du flash
  flashMode, // Mode du flash
}) {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.subContainer}>
        <TouchableOpacity style={styles.button} onPress={onChangeCamera}>
          <MaterialCommunityIcons
            name="camera-switch-outline"
            size={25}
            color="#00AADD"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.captureButton]}
          onPress={onTakePicture}
        >
          <MaterialCommunityIcons name="camera" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.captureButton,
            isRecording ? styles.recording : null,
          ]}
          onPress={onToggleRecord}
        >
          <MaterialCommunityIcons name="record" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onToggleFlash}>
          <MaterialCommunityIcons
            name={flashIcons[flashMode] ?? "flash"}
            size={25}
            color="#00AADD"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 40,
    backgroundColor: "transparent",
  },
  subContainer: {
    backgroundColor: "#FFFFFFAA",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
  },
  button: {
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 50,
  },
  captureButton: {
    borderColor: "#AE1212",
    padding: 20,
    position: "relative",
    bottom: 30,
    backgroundColor: "#00AADD",
  },
  recording: {
    backgroundColor: "#DD0000",
  },
});
