import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { getFirestore, collection, addDoc, query, where, orderBy, limit, onSnapshot, doc, getDoc, updateDoc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from "/Users/computer/Desktop/FriendApp/firebaseConfig.js";
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useMessagesContext } from './MessagesContext'; // Importing the context hook

const MessagesScreen = ({ route }) => {
  const [messageSections, setMessageSections] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipientProfile, setRecipientProfile] = useState({ name: '', photoUrl: 'https://via.placeholder.com/150' });
  const db = getFirestore();
  const storage = getStorage();
  const currentUserID = auth.currentUser.uid;
  const recipientId = route.params?.recipientId;
  const { setUnreadMessagesCount } = useMessagesContext();

  useEffect(() => {
    const fetchRecipientProfile = async () => {
      try {
        const recipientSnap = await getDoc(doc(db, 'users', recipientId));
        if (recipientSnap.exists()) {
          const recipientData = recipientSnap.data();
          setRecipientProfile({
            name: recipientData.name || '',
            photoUrl: recipientData.profilePicture || 'https://via.placeholder.com/150'
          });
        }
      } catch (error) {
        console.error("Error fetching recipient profile:", error);
      }
    };

    fetchRecipientProfile();

    const userIdsCombined = [currentUserID, recipientId].sort().join('_');
    const q = query(collection(db, 'messages'), where('userIdsCombined', '==', userIdsCombined), orderBy('createdAt'), limit(50));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      groupMessagesByDate(msgs);
      updateUnreadCount();
    });

    return () => unsubscribe();
  }, [currentUserID, recipientId]);

  const groupMessagesByDate = (messages) => {
    const grouped = messages.reduce((acc, message) => {
      const date = moment(message.createdAt.toDate()).format('YYYY-MM-DD');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {});

    const sections = Object.keys(grouped).map(date => ({
      title: formatDateForSection(moment(date, 'YYYY-MM-DD')),
      data: grouped[date]
    }));

    setMessageSections(sections);
  };

  const formatDateForSection = (momentDate) => {
    if (moment().isSame(momentDate, 'day')) {
      return 'Today';
    } else if (moment().subtract(1, 'days').isSame(momentDate, 'day')) {
      return 'Yesterday';
    } else {
      return momentDate.format('MMM Do, YYYY');
    }
  };

  const sendMessage = async (message, imageUrl = null) => {
    if (!message && !imageUrl) return;

    const userIdsCombined = [currentUserID, recipientId].sort().join('_');
    const messageData = {
      userIds: [currentUserID, recipientId],
      userIdsCombined,
      text: message || '',
      createdAt: new Date(),
      isRead: false
    };

    if (imageUrl) {
      messageData.imageUrl = imageUrl;
    }

    await addDoc(collection(db, 'messages'), messageData);
    setNewMessage('');
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      uploadImage(selectedImageUri);
    }
  };

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = (e) => {
        reject(new Error('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  };

  const uploadImage = async (uri) => {
    try {
      const blob = await uriToBlob(uri);
      const imageRef = ref(storage, `chatImages/${currentUserID}_${Date.now()}`);
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);
      sendMessage('', imageUrl); 
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
// Mark messages as read and update unread count
const markMessagesAsRead = async () => {
  const unreadMessagesQuery = query(
    collection(db, 'messages'),
    where('userIdsCombined', '==', [currentUserID, recipientId].sort().join('_')),
    where('isRead', '==', false),
    where('userIds', 'array-contains', recipientId) 
  );

  const unreadSnapshot = await getDocs(unreadMessagesQuery);
  unreadSnapshot.forEach((doc) => {
    updateDoc(doc.ref, { isRead: true });
  });
};
const updateUnreadCount = async () => {
  await markMessagesAsRead();
  fetchUnreadMessagesCount();
};

const fetchUnreadMessagesCount = async () => {
  const unreadMessagesQuery = query(
    collection(db, 'messages'),
    where('userIds', 'array-contains', currentUserID),
    where('isRead', '==', false)
  );

  const unreadSnapshot = await getDocs(unreadMessagesQuery);
  const unreadCount = unreadSnapshot.size;
  setUnreadMessagesCount(unreadCount);
};

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageBubble, 
      item.userIds[0] === currentUserID ? styles.sentMessage : styles.receivedMessage
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.header}>
        <Image source={{ uri: recipientProfile.photoUrl }} style={styles.profileImage} />
        <Text style={styles.profileName}>{recipientProfile.name}</Text>
      </View>
      <SectionList
        sections={messageSections}
        keyExtractor={(item, index) => item.id + index}
        renderItem={renderMessage}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.messageInputContainer}>
      <TouchableOpacity onPress={pickImage} style={styles.attachmentIcon}>
        <Icon name="paperclip" size={24} color="#5967EB" />
      </TouchableOpacity>
        <TextInput
          style={styles.messageInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={() => sendMessage(newMessage)} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 20,
    left:10
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  messageBubble: {
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    marginHorizontal: 10,
  },
  sentMessage: {
    backgroundColor: '#FFCB37',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#E0E0E0',
  },
  messageText: {
    fontSize: 16,
  },
  sectionHeader: {
    alignItems: 'center',
    marginVertical: 10,
  },
  sectionHeaderText: {
    fontSize: 14,
    color: '#686868',
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#5967EB',
    alignItems: 'center',
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 50 : 10,
    paddingHorizontal: 20,
  },
  attachmentIcon: {
    marginRight: 10,
  },
  messageInput: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    marginRight: 10,
    borderRadius: 5,
  },
  messagesList: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
});

export default MessagesScreen;
