import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../../../firebaseConfig';
import axios from 'axios'; 


const NameScreen = ({ navigation }) => {
  const [name, setName] = useState('');

  const handleNext = async () => {
    if (name) {
      try {
        const userId = auth.currentUser.uid;
        const functionUrl = "https://us-central1-friendsapp-76f42.cloudfunctions.net/updateUserProfile";
        console.log("Current User UID:", auth.currentUser.uid);
        console.log("Request data:", { userId, data: { name } });
        await axios.post(functionUrl, { 
          userId, 
          data: { name } 
        });
        

      navigation.navigate('GenderScreen');
  } catch (error) {
      Alert.alert("Error", "Failed to save data: " + error.message);
  }
} else {
  Alert.alert("Error", "Please enter your name");
}
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default NameScreen;
