import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from "/Users/computer/Desktop/FriendApp/firebaseConfig.js";

const EditProfile = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: '',
    bio: '',
    categories: [],
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const db = getFirestore();
      const userRef = doc(db, 'users', auth.currentUser.uid);

      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          Alert.alert('No user data found');
        }
      } catch (error) {
        Alert.alert('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    const db = getFirestore();
    const userRef = doc(db, 'users', auth.currentUser.uid);

    try {
      await updateDoc(userRef, userData);
      Alert.alert('Profile Updated', 'Your profile has been successfully updated.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={userData.name}
          onChangeText={(text) => setUserData({ ...userData, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Bio"
          value={userData.bio}
          onChangeText={(text) => setUserData({ ...userData, bio: text })}
          multiline
        />
        {/* Add TextInput for categories or other fields as needed */}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#FFCB37',
    padding: 12,
    borderRadius: 25,
    width: '90%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  // ... other styles from ProfileScreen ...
});

export default EditProfile;
