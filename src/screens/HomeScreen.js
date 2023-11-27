import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const HomeScreen = ({ navigation, route }) => {
  // Placeholder data - replace with actual data from the route or state
  const categories = route.params?.selectedCategories || ['Introverts', 'Extroverts', 'Adventurers'];

  // Function to render each item in the carousel
  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Categories</Text>

      <Carousel
        data={categories}
        renderItem={renderItem}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={300}
      />

      {/* Add more content or navigation options here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 50,
    alignItems: 'center',
  },
  itemText: {
    color: 'white',
    fontSize: 20,
  },
});

export default HomeScreen;
