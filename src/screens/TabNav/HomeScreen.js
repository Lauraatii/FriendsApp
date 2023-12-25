import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Image, ActivityIndicator } from 'react-native';
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
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const BookwormsImage = require('../../assets/images/bookworms.png'); 
  const ScientistsImage = require('../../assets/images/sciencelover.png'); 
  const introvertsImage = require('../../assets/images/introverts.png'); 
  const artloverImage = require('../../assets/images/artlover.png'); 
  const cookingImage = require('../../assets/images/cooking.png'); 
  const movielovImage = require('../../assets/images/movielov.png'); 
  const musicImage = require('../../assets/images/music.png'); 
  const writersImage = require('../../assets/images/writers.png'); 
  const travelImage = require('../../assets/images/travel.png'); 
  const extrovertsImage = require('../../assets/images/extroverts.png'); 
  const adventurersImage = require('../../assets/images/adventurers.png'); 
  const techesImage = require('../../assets/images/teches.png'); 
  const gymImage = require('../../assets/images/gym.png'); 
  const gamersImage = require('../../assets/images/gamers.png'); 
  const photoImage = require('../../assets/images/photo.png'); 
  const ecofriendlyImage = require('../../assets/images/ecofriendly.png'); 
  const yogaImage = require('../../assets/images/yoga.png'); 
  const languageImage = require('../../assets/images/language.png'); 
  const dogImage = require('../../assets/images/dog.png'); 
  const volunteersImage = require('../../assets/images/volunteers.png'); 
  const diyImage = require('../../assets/images/diy.png'); 
  

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryProfiles', { category });
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
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
      setIsLoading(false);
    };

    fetchUserProfile();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FFCB37" />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    let categoryIcon;

    switch (item) {
      case 'Bookworms 📚':
        categoryIcon = <Image source={BookwormsImage} style={styles.categoryIcon} />;
        break;
      case 'Scientists 🔬':
        categoryIcon = <Image source={ScientistsImage} style={styles.categoryIcon} />;
        break;
        case 'Introverts 🤫':
          categoryIcon = <Image source={introvertsImage} style={styles.categoryIcon} />;
          break;
          case 'Artists 🎨':
          categoryIcon = <Image source={artloverImage} style={styles.categoryIcon} />;
          break;
          case 'Foodies 🍔':
          categoryIcon = <Image source={cookingImage} style={styles.categoryIcon} />;
          break;
          case 'Movie Buffs 🎬':
          categoryIcon = <Image source={movielovImage} style={styles.categoryIcon} />;
          break;
          case 'Musicians 🎵':
          categoryIcon = <Image source={musicImage} style={styles.categoryIcon} />;
          break;
          case 'Writers ✍️':
          categoryIcon = <Image source={writersImage} style={styles.categoryIcon} />;
          break;
          case 'Travelers ✈️':
          categoryIcon = <Image source={travelImage} style={styles.categoryIcon} />;
          break;
          case 'Extroverts 🤗':
          categoryIcon = <Image source={extrovertsImage} style={styles.categoryIcon} />;
          break;
          case 'Adventurers 🚵':
          categoryIcon = <Image source={adventurersImage} style={styles.categoryIcon} />;
          break;
          case 'Techies 💻':
          categoryIcon = <Image source={techesImage} style={styles.categoryIcon} />;
          break;
          case 'Fitness Buffs 🏋️‍♀️':
          categoryIcon = <Image source={gymImage} style={styles.categoryIcon} />;
          break;
          case 'Gamers 🎮':
          categoryIcon = <Image source={gamersImage} style={styles.categoryIcon} />;
          break;
          case 'Photographers 📸':
          categoryIcon = <Image source={photoImage} style={styles.categoryIcon} />;
          break;
          case 'Eco-Friendly Living 🌱':
          categoryIcon = <Image source={ecofriendlyImage} style={styles.categoryIcon} />;
          break;
          case 'Yoga Enthusiasts 🧘‍♀️':
          categoryIcon = <Image source={yogaImage} style={styles.categoryIcon} />;
          break;
          case 'Language Learners 🗣️':
          categoryIcon = <Image source={languageImage} style={styles.categoryIcon} />;
          break;
          case 'Pet Lovers 🐾':
          categoryIcon = <Image source={dogImage} style={styles.categoryIcon} />;
          break;
          case 'Volunteering & Social Impact 💖':
          categoryIcon = <Image source={volunteersImage} style={styles.categoryIcon} />;
          break;
          case 'DIY Projects 🛠️':
          categoryIcon = <Image source={diyImage} style={styles.categoryIcon} />;
          break;
      default:
        categoryIcon = null;
    }

    return (
      <TouchableOpacity 
        style={styles.itemContainer}
        onPress={() => handleCategoryPress(item)}
      >
        {categoryIcon}
        <Text style={styles.itemText}>{item}</Text>
      </TouchableOpacity>
    );
  };
  

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
    // backgroundColor: '#6877AD',
    backgroundColor: '#5967EB',
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
    color: '#fff',
    fontSize: 18,
  },
  subTitle: {
    fontSize: 22, 
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  categoryIcon: {
    width: 100, 
    height: 100, 
    resizeMode: 'contain', 
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default HomeScreen;
