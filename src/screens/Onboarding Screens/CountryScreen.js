import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { auth } from '../../../firebaseConfig';

const CountryScreen = ({ navigation }) => {
  const [selectedCountry, setSelectedCountry] = useState();

  const countries = ["", "Denmark", "USA", "Canada", "UK", "Australia", "Germany", "France", "Italy", "Spain", "Japan", "China", "India", "Brazil", "Mexico", "South Africa", "Other"]; 

  const handleNext = async () => {
    if (!selectedCountry) {
      Alert.alert("Error", "Please select a country");
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const functionUrl = "https://us-central1-friendsapp-76f42.cloudfunctions.net/updateUserProfile";

      await axios.post(functionUrl, { 
        userId, 
        data: { country: selectedCountry } 
      });

      navigation.navigate('ProfilePictureScreen'); 
    } catch (error) {
      Alert.alert("Error", "Failed to save data: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select your country</Text>
      <Picker
        selectedValue={selectedCountry}
        onValueChange={(itemValue) => setSelectedCountry(itemValue)}
        style={styles.picker}
      >
        {countries.map((country, index) => (
          <Picker.Item key={index} label={country === "" ? "Select a country" : country} value={country} />
        ))}
      </Picker>
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
  picker: {
    width: '100%',
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

export default CountryScreen;
