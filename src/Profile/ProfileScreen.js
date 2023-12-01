import React, { useState, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, Button, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from "/Users/computer/Desktop/FriendApp/firebaseConfig.js";
import { signOut } from 'firebase/auth';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);

  const parseDate = (str) => {
    const [day, month, year] = str.split("/");
    return new Date(year, month - 1, day);
  };

  const calculateAge = (birthday) => {
    const birthdayDate = parseDate(birthday);
    const ageDifMs = Date.now() - birthdayDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }; 

  const renderCategory = ({ item }) => (
    <View style={styles.categoryBubble}>
      <Text style={styles.categoryText}>{item}</Text>
    </View>
  );

  useEffect(() => {
    const fetchUserData = async () => {
      const db = getFirestore();
      const userRef = doc(db, 'users', auth.currentUser.uid);

      try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log('No user data found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => {
            signOut(auth).then(() => {
              // Sign-out successful.
              console.log("User signed out");
              navigation.navigate('SignIn'); // Navigate to Sign-In screen after sign out
            }).catch((error) => {
              // An error happened.
              console.error("Sign out error:", error);
            });
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Image
          source={{ uri: userData?.profilePicture || 'https://via.placeholder.com/150' }}
          style={styles.profilePic}
        />
        <Text style={styles.nameAge}>
          {userData?.name}{userData?.birthday ? `, ${calculateAge(userData.birthday)}` : ''}
        </Text>
        <Text style={styles.subText}>📍 {userData?.country}</Text>

        <View style={styles.aboutMeCard}>
          <Text style={styles.infoTitle}>About Me</Text>
          <Text style={styles.infoText}>Gender: {userData?.gender}</Text>
          <Text style={styles.infoText}>Interested in: {userData?.meetingPreference}</Text>

          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>Categories:</Text>
            <FlatList 
              data={userData?.categories}
              renderItem={renderCategory}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={() => { /* Navigate to Edit Profile */ }}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('SettingsScreen')}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

        <Button title="Sign Out" onPress={handleSignOut} color="#d9534f" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#007bff',
    marginBottom: 15,
  },
  nameAge: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  infoSection: {
    width: '90%',
    alignItems: 'center', 
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 25,
    width: '90%',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingsButton: {
    backgroundColor: 'gray',
    padding: 12,
    borderRadius: 25,
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryBubble: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 0,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    padding: 5,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'center',
  },
  aboutMeCard: {
    backgroundColor: '#eef2f5', 
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },

  categoryContainer: {
    marginTop: 10,
  },
});

export default ProfileScreen;
