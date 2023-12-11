import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

const FirstScreen = ({ navigation }) => {
  return (
    <ImageBackground 
      source={require('../assets/images/logo-friendApp.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}></Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.buttonText}>Create an account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 220,
    textAlign: 'center',
    color: '#FFCB37',
  },
  buttonContainer: {
    marginBottom: 120,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    height: 50,
    backgroundColor: '#FFCB37',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 40,
    marginTop: 10,
    width: '80%',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default FirstScreen;
