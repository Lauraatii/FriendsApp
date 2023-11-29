import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../../../firebaseConfig';
import axios from 'axios'; 


const GenderScreen = ({ navigation }) => {
  const [selectedGender, setSelectedGender] = useState(null);

  const handleNext = async () => {
    if (!selectedGender) {
      Alert.alert("Error", "Please select a gender");
      return;
    }
  
    try {
      const userId = auth.currentUser.uid;
      const functionUrl = "https://us-central1-friendsapp-76f42.cloudfunctions.net/updateUserProfile";
  
      await axios.post(functionUrl, { 
        userId, 
        data: { gender: selectedGender }  
      });
  
      navigation.navigate('BirthdayScreen'); 
    } catch (error) {
      Alert.alert("Error", "Failed to save data: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select your gender</Text>

      <TouchableOpacity 
        style={[styles.option, selectedGender === 'male' && styles.selectedOption]} 
        onPress={() => setSelectedGender('male')}
      >
        <Text style={styles.optionText}>Male 👨</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.option, selectedGender === 'female' && styles.selectedOption]} 
        onPress={() => setSelectedGender('female')}
      >
        <Text style={styles.optionText}>Female 👩</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.option, selectedGender === 'other' && styles.selectedOption]} 
        onPress={() => setSelectedGender('other')}
      >
        <Text style={styles.optionText}>Other 🦄</Text>
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
  option: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    width: '80%',
  },
  selectedOption: {
    backgroundColor: '#007bff',
  },
  optionText: {
    textAlign: 'center',
    fontWeight: 'bold',
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

export default GenderScreen;
