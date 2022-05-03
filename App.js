import React, { useState, useEffect, useRef, useReducer } from "react";
import { StyleSheet, Text, View, Dimensions, Platform } from "react-native";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import * as MediaLibrary from "expo-media-library";
import Loading from "./components/Loading";
import CameraControls from "./components/CameraControls";
import FaceTracker from "./components/FaceTracker";
import RequestPremissions from "./components/RequestPermissions";

export default function App() {
  /* Variables d'état */
  const [hasPermissions, setHasPermissions] = useState(null); // Permissions camera et media library
  const [type, setType] = useState(Camera.Constants.Type.back); // Type de caméra
  const [faces, setFaces] = useState([]); // Visages
  const [isRecording, toggleRecording] = useReducer((state) => !state, false); // Statut de l'enregistrement
  const [flashMode, toggleFlashMode] = useReducer((state) => {
    switch (state) {
      case "auto":
        return "on";
      case "on":
        return "off";
      case "off":
        return "auto";
    }
  }, "auto"); // Mode du flash
  const [ratio, setRatio] = useState("4:3"); // Ratio de l'image

  /* Refs */
  const camera = useRef(null); // Camera

  /* Effet de bord au premier rendu du composant */
  useEffect(() => {
    requestPermissions();
  }, []);

  /*** Fonctions ***/

  /* Demande des permissions */
  async function requestPermissions() {
    try {
      // Demande des permissions
      const permissions = await Promise.all(
        Camera.requestCameraPermissionsAsync(),
        Camera.requestMicrophonePermissionsAsync(),
        MediaLibrary.requestPermissionsAsync()
      );

      // Boucle sur les permissions pour vérifier le statut de chacune
      for (let { granted } of Object.values(permissions)) {
        if (granted === false) {
          setHasPermissions(false);
          return;
        }
      }

      setHasPermissions(true);
    } catch (e) {
      console.log(e);
    }
  }

  /* Récupération du meilleur ratio d'image */
  const getBestRatio = async () => {
    if (Platform.OS !== "android") {
      return;
    }

    try {
      // Récupération des ratios disponibles
      const ratios = await camera.current.getSupportedRatiosAsync();

      // Récupération des dimension de l'écran
      const { width, height } = Dimensions.get("window");
      const screenRatio = height / width;

      // Détermination du meilleur ratio
      if (screenRatio > 2 && ratios.includes("20:9")) {
        setRatio("20:9");
      } else if (screenRatio > 1.5 && ratio.includes("16:9")) {
        setRatio("16:9");
      }
    } catch (e) {
      console.log(e);
    }
  };

  /* Photo */
  const takePicture = async () => {
    try {
      const picture = await camera.current.takePictureAsync();
      MediaLibrary.saveToLibraryAsync(picture.uri);
    } catch (e) {
      console.log(e);
    }
  };

  /* Demarrage d'un enregistrement video */
  const startRecordingVideo = async () => {
    try {
      toggleRecording();
      const video = await camera.current.recordAsync();
      MediaLibrary.saveToLibraryAsync(video.uri);
    } catch (e) {
      console.log(e);
    }
  };

  /* Arrêt d'un enregistrement video */
  const stopRecordingVideo = () => {
    toggleRecording();
    camera.current.stopRecording();
  };

  /* Rendu des traceurs de visage */
  const renderFacesTrackers = () =>
    faces.map((face, index) => (
      <FaceTracker
        key={index}
        top={face.bounds.origin.y}
        left={face.bounds.origin.x}
        height={face.bounds.size.height}
        width={face.bounds.size.width}
      />
    ));

  /*** Rendu ***/

  /* Chargement */
  if (hasPermissions === null) {
    return <Loading />;
  }

  /* Permissions refusées */
  if (hasPermissions === false) {
    return <RequestPremissions />;
  }

  /* Permissions acceptées */
  return (
    <View style={styles.container}>
      <Camera
        ratio={ratio}
        onCameraReady={getBestRatio}
        ref={camera}
        style={styles.camera}
        type={type}
        flashMode={flashMode}
        onFacesDetected={({ faces }) => setFaces(faces)}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
          minDetectionInterval: 200,
          tracking: true,
        }}
      >
        <CameraControls
          onChangeCamera={() =>
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            )
          }
          onTakePicture={takePicture}
          onToggleRecord={
            isRecording ? stopRecordingVideo : startRecordingVideo
          }
          isRecording={isRecording}
          onToggleFlash={toggleFlashMode}
          flashMode={flashMode}
        />
      </Camera>
      {renderFacesTrackers()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
