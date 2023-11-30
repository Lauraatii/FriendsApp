import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { auth } from '../../../firebaseConfig';

const MeetingPreferenceScreen = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleNext = async () => {
    if (!selectedOption) {
      Alert.alert("Error", "Please select an option");
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const functionUrl = "https://us-central1-friendsapp-76f42.cloudfunctions.net/updateUserProfile";

      await axios.post(functionUrl, { 
        userId, 
        data: { meetingPreference: selectedOption } 
      });

      navigation.navigate('CategoriesScreen'); 
    } catch (error) {
      Alert.alert("Error", "Failed to save data: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who do you want to meet?</Text>

      <TouchableOpacity 
        style={[styles.option, selectedOption === 'male' && styles.selectedOption]} 
        onPress={() => setSelectedOption('male')}
      >
        <Text style={styles.optionText}>Male</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.option, selectedOption === 'female' && styles.selectedOption]} 
        onPress={() => setSelectedOption('female')}
      >
        <Text style={styles.optionText}>Female</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.option, selectedOption === 'everyone' && styles.selectedOption]} 
        onPress={() => setSelectedOption('everyone')}
      >
        <Text style={styles.optionText}>Everyone</Text>
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

export default MeetingPreferenceScreen;
