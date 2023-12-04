import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Alert, Platform } from 'react-native';
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
  
    console.log("Image Picker Result:", result);
  
    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri);
      console.log("Selected image URI:", selectedImageUri);
    }
  };  

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        console.log("Blob conversion successful");
        resolve(xhr.response);
      };
      xhr.onerror = (e) => {
        console.error("Blob conversion error:", e);
        reject(e);
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  };
  

  const handleNext = async () => {
    if (!image) {
      // Uncomment the below line if you want to enforce image selection
      // Alert.alert("Error", "Please select an image");
      // return;
    } else {
      try {
        const userId = auth.currentUser.uid;
        console.log("User ID:", userId); // Log User ID

        const storage = getStorage();
        const imageRef = ref(storage, `profilePictures/${userId}`);

        console.log("Uploading image:", image); // Log image being uploaded
        const blob = await uriToBlob(image);

        await uploadBytes(imageRef, blob);
        console.log("Image uploaded"); // Log after upload
        const imageUrl = await getDownloadURL(imageRef);
        console.log("Image URL:", imageUrl); // Log the URL

        const functionUrl = "https://us-central1-friendsapp-76f42.cloudfunctions.net/updateUserProfile";
        await axios.post(functionUrl, {
          userId,
          data: { profilePicture: imageUrl }
        });
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }

    navigation.navigate('MeetingPreferenceScreen');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Add a Profile Picture</Text>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text style={styles.imagePickerText}>+</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
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
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  imagePickerText: {
    fontSize: 50,
    color: '#999',
  },
  button: {
    backgroundColor: '#FFCB37',
    padding: 15,
    borderRadius: 8,
    width: '80%',
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ProfilePictureScreen;
