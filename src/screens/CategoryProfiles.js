import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Animated, Modal, ScrollView, Button, ActivityIndicator } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { auth } from '../../firebaseConfig';

const CategoryProfiles = ({ route, navigation }) => {
  const { category } = route.params;
  const [profiles, setProfiles] = useState([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedCountries, setSelectedCountries] = useState(new Set());
  const [selectedAgeRange, setSelectedAgeRange] = useState({ min: 0, max: 100 });
  const scaleAnim = useRef(new Animated.Value(1)).current; 
  const [isLoading, setIsLoading] = useState(true);

  const countries = ["", "Denmark", "USA", "Canada", "UK", "Australia", "Germany", "France", "Italy", "Spain", "Japan", "China", "India", "Brazil", "Mexico", "South Africa", "Other"];

  const calculateAge = (birthday) => {
    if (!birthday) return '';
    const [day, month, year] = birthday.split("/").map(num => parseInt(num, 10));
    const birthdayDate = new Date(year, month - 1, day);
    const ageDifMs = Date.now() - birthdayDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const toggleCountrySelection = (country) => {
    const newSelectedCountries = new Set(selectedCountries);
    if (newSelectedCountries.has(country)) {
      newSelectedCountries.delete(country);
    } else {
      newSelectedCountries.add(country);
    }
    setSelectedCountries(newSelectedCountries);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchProfiles = async () => {
      const db = getFirestore();
      let queries = [where('categories', 'array-contains', category)];

      if (selectedGender) {
        queries.push(where('gender', '==', selectedGender));
      }

      if (selectedCountries.size > 0) {
        queries.push(where('country', 'in', Array.from(selectedCountries)));
      }

      const q = query(collection(db, 'users'), ...queries);

      try {
        const querySnapshot = await getDocs(q);
        const fetchedProfiles = [];
        querySnapshot.forEach((doc) => {
          const profileData = doc.data();
          const age = calculateAge(profileData.birthday);
          if (doc.id !== auth.currentUser.uid && age >= selectedAgeRange.min && age <= selectedAgeRange.max) {
            fetchedProfiles.push({ id: doc.id, ...profileData });
          }
        });
        setProfiles(fetchedProfiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
      setIsLoading(false);
    };

    fetchProfiles();
  }, [category, selectedGender, selectedCountries, selectedAgeRange]);

  const applyFilters = () => {
    setFilterModalVisible(false);
    fetchProfiles();
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FFCB37" />
      </View>
    );
  }

  const handleProfilePress = (userId) => {
    navigation.navigate('ProfileView', { userId });
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
        <Image
          source={{ uri: item.profilePicture || 'https://via.placeholder.com/150' }}
          style={styles.profilePic}
        />
        <Text style={styles.nameAge}>
          {item.name}{item.birthday ? `, ${calculateAge(item.birthday)}` : ''}
        </Text>
        <Text style={styles.subText}>📍 {item.country}</Text>
        <Text numberOfLines={2} style={styles.bioText}>{item.bio}</Text>
        <TouchableOpacity style={styles.messageButton} onPress={() => handleSendMessage(item.id)}>
          <Icon name="comment" size={20} color="#fff" />
          <Text style={styles.messageButtonText}>Chat</Text>
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );

  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isFilterModalVisible}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
        <TouchableOpacity style={styles.closeButton} onPress={() => setFilterModalVisible(false)}>
          <Icon name="times" size={24} color="#000" />
        </TouchableOpacity>
            <Text style={styles.modalText}>Filter Options</Text>
            {/* Gender filter */}
            <View style={styles.filterOptions}>
              <Text style={styles.filterLabel}>Gender:</Text>
              <TouchableOpacity 
            style={[styles.option, selectedGender === 'male' && styles.selectedOption]} 
            onPress={() => setSelectedGender('male')}
          >
            <Text 
              style={[
                styles.optionText, 
                selectedGender === 'male' && styles.selectedOptionText
              ]}
            >
              Male 💁🏽‍♂️
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.option, selectedGender === 'female' && styles.selectedOption]} 
            onPress={() => setSelectedGender('female')}
          >
            <Text 
              style={[
                styles.optionText, 
                selectedGender === 'female' && styles.selectedOptionText
              ]}
            >
              Female 💁🏽‍♀️
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.option, selectedGender === '' && styles.selectedOption]} 
            onPress={() => setSelectedGender('')}
          >
            <Text 
              style={[
                styles.optionText, 
                selectedGender === '' && styles.selectedOptionText
              ]}
            >
              Everyone 🌍
            </Text>
          </TouchableOpacity>
            </View>
            {/* Country filter */}
            <View style={styles.filterOptions}>
              <Text style={styles.filterLabel}>Countries:</Text>
              {countries.map((country, index) => (
                <TouchableOpacity 
                key={index} 
                style={[
                  styles.option, 
                  selectedCountries.has(country) && styles.selectedOption
                ]} 
                onPress={() => toggleCountrySelection(country)}
              >
                <Text 
                  style={[
                    styles.optionText, 
                    selectedCountries.has(country) && styles.selectedOptionText
                  ]}
                >
                  {country || "Any Country"}
                </Text>
              </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Profiles in ${category}`}</Text>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setFilterModalVisible(true)}
      >
        <Icon name="sliders-h" size={24} color="#5967EB" />
      </TouchableOpacity>
      {renderFilterModal()}
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
    color: '#333',
    marginBottom: 20,
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
    marginBottom: 10,
    padding: 15,
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
  filterButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    padding: 1,
    zIndex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical: 10,
    width: '100%',
  },
  option: {
    backgroundColor: '#EAEAEA',
    borderRadius: 20,
    padding: 10,
    margin: 5,
  },
  selectedOption: {
    backgroundColor: '#5967EB',
  },
  optionText: {
    color: '#000',
  },
  filterLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#31456A',
    marginBottom: 5,
    marginLeft: 10,
    paddingVertical: 10,
  },
  applyButton: {
    backgroundColor: '#5967EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fff7d9',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    maxHeight: '70%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedOptionText: {
    color: 'white',
  },
});

export default CategoryProfiles;
