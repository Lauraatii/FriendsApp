import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios'; 
import { auth } from '../../../firebaseConfig'; 

const ProfilePictureScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const handleNext = async () => {
    // if (!image) {
    //   Alert.alert("Error", "Please select an image");
    //   return;
    // }
  
    try {
      const userId = auth.currentUser.uid;
      const storage = getStorage();
      const imageRef = ref(storage, `profilePictures/${userId}`);
  
      const response = await fetch(image);
      const blob = await response.blob();
      console.log('Blob size:', blob.size);

  
      await uploadBytes(imageRef, blob);
  
      const imageUrl = await getDownloadURL(imageRef);
  
      const functionUrl = "https://us-central1-friendsapp-76f42.cloudfunctions.net/updateUserProfile";
      await axios.post(functionUrl, {
        userId,
        data: { profilePicture: imageUrl }
      });
  
      navigation.navigate('MeetingPreferenceScreen');
    } catch (error) {
      console.error("Failed to upload image:", error, error.request);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a Profile Picture</Text>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {image ? (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        ) : (
          <Text style={styles.imagePickerText}>+</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imagePicker: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e7e7e7',
    marginBottom: 20,
  },
  imagePickerText: {
    fontSize: 50,
    color: '#999',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    width: '80%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ProfilePictureScreen;
