import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const BirthdayScreen = ({ navigation }) => {
  const [birthday, setBirthday] = useState('');

  const handleNext = () => {
    // Add validation or processing for the birthday here if needed
    navigation.navigate('CountryScreen'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's your birthday?</Text>
      <TextInput
        style={styles.input}
        placeholder="dd/mm/yyyy"
        value={birthday}
        onChangeText={setBirthday}
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
