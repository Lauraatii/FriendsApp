import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { auth } from '../../../firebaseConfig';

const CountryScreen = ({ navigation }) => {
  const [selectedCountry, setSelectedCountry] = useState();

  const countries = ["", "Denmark", "USA", "Canada", "UK", "Australia", "Germany", "France", "Italy", "Spain", "Japan", "China", "India", "Brazil", "Mexico", "South Africa", "Other"]; 

  const handleNext = async () => {
    if (!selectedCountry) {
      Alert.alert("Error", "Please select your current country");
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
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
      <Text style={styles.title}>Select your current country</Text>
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
  picker: {
    width: '100%',
    marginBottom: 20,
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

export default CountryScreen;
