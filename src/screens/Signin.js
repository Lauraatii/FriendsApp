import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle sign in
  const handleSignIn = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsLoading(false);
        // Alert.alert("Success", "Signed in successfully!");
        navigation.replace("Main");
      })
      .catch(error => {
        setIsLoading(false);
        Alert.alert("Error", error.message);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

<TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={isLoading}>
          {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
        </TouchableOpacity>

        <Text style={styles.linkText}>
          Don't have an account?{" "}
          <Text style={styles.signUpLink} onPress={() => navigation.navigate('Signup')}>
            Sign Up
          </Text>
        </Text>
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
        backgroundColor: '#FFCB37',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 40,  
        marginTop: 15,
      },
      buttonText: {
        color: 'black',
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
      linkText: {
        marginTop: 15,
        color: 'black',
        textAlign: 'center',
        fontSize: 16,
      },
      signUpLink: {
        color: '#FFCB37', 
        fontWeight: 'bold',
      },
});

export default SignIn;
