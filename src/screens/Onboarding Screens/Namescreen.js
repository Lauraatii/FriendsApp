import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { auth } from '../../../firebaseConfig';
import axios from 'axios'; 

const NameScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    if (name) {
      setIsLoading(true);
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
      setIsLoading(false);
    } else {
      Alert.alert("Error", "Please enter your name");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          editable={!isLoading}
        />
        <TouchableOpacity style={styles.button} onPress={handleNext} disabled={isLoading}>
          {isLoading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={styles.buttonText}>Next</Text>
            )}       
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
    // alignItems: 'center',
    // padding: 20,
    // backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 190,
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

export default NameScreen;
