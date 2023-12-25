import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const SettingsScreen = ({ navigation }) => {
  const handleSettingOptionPress = (option) => {
    console.log(`Selected setting: ${option}`);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.option} 
        onPress={() => handleSettingOptionPress('Account')}>
        <Text style={styles.optionText}>Account</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.option} 
        onPress={() => handleSettingOptionPress('Notifications')}>
        <Text style={styles.optionText}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.option} 
        onPress={() => handleSettingOptionPress('Privacy')}>
        <Text style={styles.optionText}>Privacy</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  option: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 18,
  },
});

export default SettingsScreen;
