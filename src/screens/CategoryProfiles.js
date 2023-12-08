import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const CategoryProfiles = ({ route, navigation }) => {
  const { category } = route.params;
  const [profiles, setProfiles] = useState([]);
  const scaleAnim = useRef(new Animated.Value(1)).current; 

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
    navigation.navigate('UserProfile', { userId });
  };

  const handleSendMessage = (userId) => {
    navigation.navigate('MessagesScreen', { recipientId: userId });
  };
  

  const handleProfileInteraction = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => { handleProfilePress(item.id); handleProfileInteraction(); }}>
      <Animated.View style={[styles.profileCard, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.cardContent}>
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
          <TouchableOpacity style={styles.messageButton} onPress={() => handleSendMessage(item.id)}>
            <Icon name="comment" size={20} color="#fff" />
            <Text style={styles.messageButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5967EB',
    marginBottom: 15,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    marginBottom: 20,
    padding: 20,
    alignItems: 'center',
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  profileInfo: {
    alignItems: 'center',
  },
  nameAge: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#31456A',
  },
  subText: {
    fontSize: 16,
    color: '#6877AD',
    marginBottom: 10,
  },
  bioText: {
    fontSize: 16,
    color: '#31456A',
    textAlign: 'center',
    marginBottom: 15,
  },
  messageButton: {
    backgroundColor: '#5967EB',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 30,
    marginTop: 10,
  },
  messageButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
  },
});

export default CategoryProfiles;
