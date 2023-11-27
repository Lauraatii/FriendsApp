import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Pressable } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Email validation
  const onChangeEmail = (text) => {
    setEmail(text);
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    setEmailValid(emailPattern.test(text));
  };

  // Password validation
  const onChangePassword = (text) => {
    setPassword(text);
    setPasswordValid(text.length >= 6);
  };

  // Handle sign up
  const handleSignUp = () => {
    setFormSubmitted(true);
    if (!emailValid || !passwordValid) {
      Alert.alert("Error", "Invalid email or password");
      return;
    }

    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsLoading(false);
        navigation.navigate("NameScreen");
      })
      .catch(error => {
        setIsLoading(false);
        Alert.alert("Error", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={[styles.input, (!emailValid && formSubmitted) && styles.errorInput]}
        placeholder="Email"
        value={email}
        onChangeText={onChangeEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {(!emailValid && formSubmitted) && <Text style={styles.errorText}>Invalid email address</Text>}

      <TextInput
        style={[styles.input, (!passwordValid && formSubmitted) && styles.errorInput]}
        placeholder="Password"
        value={password}
        onChangeText={onChangePassword}
        secureTextEntry
      />
      {(!passwordValid && formSubmitted) && <Text style={styles.errorText}>Password must be at least 6 characters</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
        {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>
      <Text style={styles.signInText} onPress={() => navigation.navigate('SignIn')}>
        Already have an account? Sign In
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 400,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
    marginHorizontal: 40,  
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 40,  
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  errorInput: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    marginTop: -10,
    textAlign: 'center',
  },
  signInText: {
    marginTop: 20,
    color: '#007bff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default Signup;
