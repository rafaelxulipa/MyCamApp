import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Modal, Image } from 'react-native';

import { Camera } from 'expo-camera';

import { FontAwesome } from "@expo/vector-icons";
 
export default function App() {

  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const camRef = useRef(null)
  const [capturedPhoto, setCapuredPhoto] = useState(null)
  const [open, setOpen] = useState(false)
  

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === "granted");
    }) ();
  }, [])

  if(hasPermission === null){
    return <View/>;
  }

  if(hasPermission === false){
    return <Text>Acesso negado</Text>;
  }

  async function takePicture(){
    if(camRef){
      const data = await camRef.current.takePictureAsync();
      setCapuredPhoto(data.uri)
      setOpen(true)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera style = {styles.camera} type = {type} ref={camRef} >
      <View style={styles.contentButton}>
          <TouchableOpacity
            style={styles.buttonFlip}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <FontAwesome name="exchange" size={23} color="red" ></FontAwesome>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonCamera} onPress={takePicture} >
            <FontAwesome name="camera" size={23} color="#FFFFFF" ></FontAwesome>
          </TouchableOpacity>
        </View>
      </Camera>
      {capturedPhoto && (
      <Modal
        animationType="slide"
        transparent={true}
        visible={open}
      >
        <View style={styles.contentModal}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={()=>{setOpen(false)}}
          >
            <FontAwesome name="close" size={50} color="#ffffff" ></FontAwesome>
          </TouchableOpacity>
          
            <Image style={styles.imgPhoto} source={{uri: capturedPhoto}} ></Image>
        </View>
      </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    
  },
  camera: {
    width:"100%",
    height: "100%",
  },
  buttonFlip: {
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: "flex-end"
    
  },
  contentButton: {
   flex: 1,
   backgroundColor: "transparent",
   flexDirection: "row",
  },
  buttonFlip:{
    position: 'absolute',
    bottom: 50,
    left: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"#ffffff",
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  buttonCamera:{
    position: 'absolute',
    bottom: 50,
    right: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"red",
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  contentModal:{
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    margin: 20,
  },
  closeButton:{
    position: "absolute",
    top: 10,
    left: 2,
    margin: 10,
  },
  imgPhoto:{
    width: "100%",
    height: 400,
    borderRadius: 30,
  }, 
});
