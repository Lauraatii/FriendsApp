import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, Modal } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProfileView = ({ route, navigation }) => {
  const { userId } = route.params;
  const [userData, setUserData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);


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
      const userRef = doc(db, 'users', userId);

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
  }, [userId]);

  const handleSendMessage = () => {
    navigation.navigate('MessagesScreen', { recipientId: userId });
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={toggleModal}>
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{ uri: userData?.profilePicture || 'https://via.placeholder.com/150' }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </View>
      </Modal>

      <View style={styles.container}>
      <TouchableOpacity onPress={toggleModal}>
        <Image
          source={{ uri: userData?.profilePicture || 'https://via.placeholder.com/150' }}
          style={styles.profilePic}
        />
        </TouchableOpacity>
        <Text style={styles.nameAge}>
          {userData?.name}{userData?.birthday ? `, ${calculateAge(userData.birthday)}` : ''}
        </Text>
        <Text style={styles.subText}>📍 {userData?.country}</Text>

        <View style={styles.aboutMeCard}>
          <Text style={styles.infoTitle}>About</Text>
          <Text style={styles.infoText}>{userData?.bio}</Text>

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

        <TouchableOpacity style={styles.messageButton} onPress={handleSendMessage}>
          <Icon name="comment" size={20} color="#fff" />
          <Text style={styles.messageButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#fff',
      },
      container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 210,
        backgroundColor: '#fff',
      },
      profilePic: {
        width: 150,
        height: 150,
        borderRadius: 100,
        borderWidth: 4,
        borderColor: '#FFCB37',
        marginBottom: 15,
      },
      nameAge: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
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
      categoryBubble: {
        backgroundColor: '#5967EB',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 0,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        top: 5,
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
        backgroundColor: '#fff7d9', 
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
        messageButton: {
            backgroundColor: '#5967EB',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 12,
            borderRadius: 30,
            marginTop: 10,
            width: '90%',
        },
        messageButtonText: {
            color: '#fff',
            marginLeft: 5,
            fontSize: 16,
        },
        modalView: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
        modalImage: {
          width: '80%',
          height: '80%',
          borderRadius: 20,
        },
        modalCloseButton: {
          position: 'absolute',
          top: 50,
          right: 30,
        },
});

export default ProfileView;
