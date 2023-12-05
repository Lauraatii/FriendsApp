import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const CategoryProfiles = ({ route, navigation }) => {
  const { category } = route.params;
  const [profiles, setProfiles] = useState([]);

  const calculateAge = (birthday) => {
    if (!birthday) return '';
    const [day, month, year] = birthday.split("/").map(num => parseInt(num, 10));
    const birthdayDate = new Date(year, month - 1, day);
    const ageDifMs = Date.now() - birthdayDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
  

  useEffect(() => {
    const fetchProfiles = async () => {
      const db = getFirestore();
      const q = query(collection(db, 'users'), where('categories', 'array-contains', category));

      try {
        const querySnapshot = await getDocs(q);
        const fetchedProfiles = [];
        querySnapshot.forEach((doc) => {
          fetchedProfiles.push({ id: doc.id, ...doc.data() });
        });
        setProfiles(fetchedProfiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, [category]);

  const handleProfilePress = (userId) => {
    // Navigate to user profile screen
    navigation.navigate('UserProfile', { userId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.profileContainer} onPress={() => handleProfilePress(item.id)}>
      <Image
        source={{ uri: item.profilePicture || 'https://via.placeholder.com/150' }}
        style={styles.profilePic}
      />
      <View style={styles.profileInfo}>
        <Text style={styles.nameAge}>
          {item.name}{item.birthday ? `, ${calculateAge(item.birthday)}` : ''}
        </Text>
        <Text style={styles.subText}>📍 {item.country}</Text>
        <Text numberOfLines={2} style={styles.bioText}>{item.bio}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Profiles in ${category}`}</Text>
      <FlatList
        data={profiles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff7d9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
  },
  profileInfo: {
    flex: 1,
  },
  nameAge: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
    color: 'gray',
  },
  bioText: {
    fontSize: 14,
    color: 'black',
    marginTop: 5,
  },
});

export default CategoryProfiles;
