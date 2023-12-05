import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from "/Users/computer/Desktop/FriendApp/firebaseConfig.js";
import { useNavigation } from '@react-navigation/native';


const allCategories = [
  'Introverts 🤫', 'Extroverts 🤗', 'Adventurers 🚵', 'Artists 🎨', 'Techies 💻',
  'Foodies 🍔', 'Travelers ✈️', 'Bookworms 📚', 'Fitness Buffs 🏋️‍♀️', 'Movie Buffs 🎬',
  'Gamers 🎮', 'Musicians 🎵', 'Photographers 📸', 'Writers ✍️', 'Scientists 🔬',
  'Eco-Friendly Living 🌱', 'DIY Projects 🛠️', 'Yoga Enthusiasts 🧘‍♀️', "Language Learners 🗣️",
  "Pet Lovers 🐾", "Volunteering & Social Impact 💖",
];

const HomeScreen = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [exploreCategories, setExploreCategories] = useState([]);
  const navigation = useNavigation();

  const handleCategoryPress = (category) => {
    // Navigate to new screen with the selected category
    navigation.navigate('CategoryProfiles', { category });
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const db = getFirestore();
      const userRef = doc(db, "users", auth.currentUser.uid);

      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userCategories = docSnap.data().categories || [];
          setSelectedCategories(userCategories);
          setExploreCategories(allCategories.filter(cat => !userCategories.includes(cat)));
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => handleCategoryPress(item)}
    >
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Categories</Text>
        <FlatList
          data={selectedCategories}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />
        <Text style={styles.subTitle}>Explore More Categories</Text>
        <FlatList
          data={exploreCategories}
          renderItem={renderItem}
          keyExtractor={(item, index) => 'explore_' + index}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FFCB37',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 150,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#FFCB37',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 5,
    width: '45%',
    elevation: 5, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  itemText: {
    color: '#000',
    fontSize: 18,
  },
  subTitle: {
    fontSize: 22, 
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default HomeScreen;
