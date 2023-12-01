import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator} from 'react-native';

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Main'); 
    }, 2000); 
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Finding new friends...</Text>
      <ActivityIndicator size="large" color="#007bff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default LoadingScreen;
