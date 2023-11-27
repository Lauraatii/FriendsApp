import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const GenderScreen = ({ navigation }) => {
  const [selectedGender, setSelectedGender] = useState(null);

  const handleNext = () => {
    // Pass the selected gender to the next screen or handle it as needed
    navigation.navigate('BirthdayScreen', { selectedGender }); // Replace 'NextScreenName' with the actual name of your next screen
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
