import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../../../firebaseConfig';
import axios from 'axios'; 

const BioScreen = ({ navigation }) => {
  const [bio, setBio] = useState('');

  const handleNext = async () => {
    if (bio) {
      try {
        const userId = auth.currentUser.uid;
        const functionUrl = "https://us-central1-friendsapp-76f42.cloudfunctions.net/updateUserProfile";
        console.log("Current User UID:", userId);
        console.log("Request data:", { userId, data: { bio } });
        await axios.post(functionUrl, { 
          userId, 
          data: { bio } 
        });

        navigation.navigate('LoadingScreen'); 
      } catch (error) {
        Alert.alert("Error", "Failed to save data: " + error.message);
      }
    } else {
      Alert.alert("Error", "Please enter your bio");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Bio</Text>
        <TextInput
          style={styles.input}
          placeholder="Tell us about yourself"
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={4}
        />
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    height: 100,
    textAlignVertical: 'top', // This ensures text starts from the top in multiline TextInput
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

export default BioScreen;
