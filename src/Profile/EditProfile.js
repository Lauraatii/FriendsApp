import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from "/Users/computer/Desktop/FriendApp/firebaseConfig.js";

const allCategories = [
  'Introverts 🤫', 'Extroverts 🤗', 'Adventurers 🚵', 'Artists 🎨', 'Techies 💻',
  'Foodies 🍔', 'Travelers ✈️', 'Bookworms 📚', 'Fitness Buffs 🏋️‍♀️', 'Movie Buffs 🎬',
  'Gamers 🎮', 'Musicians 🎵', 'Photographers 📸', 'Writers ✍️', 'Scientists 🔬'
];

const EditProfile = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: '',
    bio: '',
    profilePicture: '',
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

  const handleImageChange = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.cancelled) {
      const selectedImageUri = result.uri;
      setUserData({ ...userData, profilePicture: selectedImageUri });
    }
  };
  const toggleCategory = (category) => {
    setUserData(prevData => {
      const updatedCategories = prevData.categories.includes(category)
        ? prevData.categories.filter(cat => cat !== category)
        : [...prevData.categories, category];

      return { ...prevData, categories: updatedCategories };
    });
  };

  const handleSave = async () => {
    // Check if userData.profilePicture is defined and is a string
  if (userData.profilePicture && typeof userData.profilePicture === 'string' && userData.profilePicture.startsWith('file://')) {
    // Only upload if a new image has been picked
    const imageUrl = await uploadImage(userData.profilePicture);
    userData.profilePicture = imageUrl;
  }

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

  const uploadImage = async (uri) => {
    const blob = await (await fetch(uri)).blob();
    const storage = getStorage();
    const imageName = `profile_${auth.currentUser.uid}`;
    const imageRef = ref(storage, `profilePictures/${imageName}`);

    await uploadBytes(imageRef, blob);
    return getDownloadURL(imageRef);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
      <TouchableOpacity onPress={handleImageChange}>
          <Image 
            source={{ uri: userData.profilePicture || 'https://via.placeholder.com/150' }} 
            style={styles.profilePic} 
          />
          <View style={styles.iconOverlay}>
            <Icon name="pencil" size={30} color="#FFCB37" />
          </View>
        </TouchableOpacity>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={userData.name}
          onChangeText={(text) => setUserData({ ...userData, name: text })}
        />
        <Text style={styles.label}>About you</Text>
        <TextInput
          style={styles.input}
          placeholder="Bio"
          value={userData.bio}
          onChangeText={(text) => setUserData({ ...userData, bio: text })}
          multiline
        />
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesContainer}>
          {allCategories.map(category => (
            <TouchableOpacity 
              key={category} 
              style={userData.categories.includes(category) ? styles.selectedCategory : styles.categoryBubble}
              onPress={() => toggleCategory(category)}
            >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
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
    top: 20,
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryBubble: {
    backgroundColor: '#e7e7e7',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  selectedCategory: {
    backgroundColor: '#5967EB',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  categoryText: {
    color: '#000',
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: "6%",  
    marginTop: 5,
    marginBottom: 5,
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  iconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: "#fff7d9",
    padding: 10,
    borderRadius: 50,
  },
});

export default EditProfile;
