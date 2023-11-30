import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios'; 
import { auth } from '../../../firebaseConfig';

const BirthdayScreen = ({ navigation }) => {
  const [birthday, setBirthday] = useState('');

  const formatBirthday = (text) => {
    const newText = text.replace(/[^0-9]/g, ''); 
  
    if (newText.length <= 2) {
      return newText;
    }
    if (newText.length <= 4) {
      return `${newText.slice(0, 2)}/${newText.slice(2)}`;
    }
    const formattedText = `${newText.slice(0, 2)}/${newText.slice(2, 4)}/${newText.slice(4, 8)}`;
    return formattedText;
  };
  
  const handleNext = async () => {
    if (!birthday) {
      Alert.alert("Error", "Please enter your birthday");
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const functionUrl = "https://us-central1-friendsapp-76f42.cloudfunctions.net/updateUserProfile";

      await axios.post(functionUrl, { 
        userId, 
        data: { birthday } 
      });

      navigation.navigate('CountryScreen'); 
    } catch (error) {
      Alert.alert("Error", "Failed to save data: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's your birthday?</Text>
      <TextInput
        style={styles.input}
        placeholder="dd/mm/yyyy"
        value={birthday}
        onChangeText={(text) => setBirthday(formatBirthday(text))}
        keyboardType="numeric"
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

export default BirthdayScreen;
