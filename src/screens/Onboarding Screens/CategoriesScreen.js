import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import { auth } from '../../../firebaseConfig';

const CategoriesScreen = ({ navigation }) => {
  const categories = [
    'Introverts 🤫', 
    'Extroverts 🤗', 
    'Adventurers 🚵', 
    'Artists 🎨', 
    'Techies 💻',
    'Foodies 🍔', 
    'Travelers ✈️', 
    'Bookworms 📚', 
    'Fitness Buffs 🏋️‍♀️', 
    'Movie Buffs 🎬',
    'Gamers 🎮', 
    'Musicians 🎵', 
    'Photographers 📸', 
    'Writers ✍️', 
    'Scientists 🔬',     
    'Eco-Friendly Living 🌱', 
    'DIY Projects 🛠️', 
    'Yoga Enthusiasts 🧘‍♀️', 
    "Language Learners 🗣️",
    "Pet Lovers 🐾", 
    "Volunteering & Social Impact 💖",
    ];
  
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleSelectCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(item => item !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleNext = async () => {
    try {
      const userId = auth.currentUser.uid;
      const functionUrl = "https://us-central1-friendsapp-76f42.cloudfunctions.net/updateUserProfile";

      await axios.post(functionUrl, { 
        userId, 
        data: { categories: selectedCategories } 
      });

      navigation.navigate('BioScreen'); 
    } catch (error) {
      Alert.alert("Error", "Failed to save data: " + error.message);
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={[styles.option, selectedCategories.includes(item) && styles.selectedOption]} 
      onPress={() => handleSelectCategory(item)}
    >
      <Text style={styles.optionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
    <View style={styles.container}>
      <Text style={styles.title}>Select Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item}
        numColumns={2} 
        columnWrapperStyle={styles.row}
        scrollEnabled={false} 
      />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
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
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  option: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    flex: 1,
    margin: 5,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#FDDA64',
  },
  optionText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  button: {
    backgroundColor: '#FFCB37',
    padding: 15,
    borderRadius: 8,
    marginTop: 0,
    marginBottom: 70,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default CategoriesScreen;
