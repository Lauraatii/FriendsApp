import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { getFirestore, collection, addDoc, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { auth } from "/Users/computer/Desktop/FriendApp/firebaseConfig.js"; // Import auth

const MessagesScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const db = getFirestore();
  const currentUserID = auth.currentUser.uid;
  const recipientId = route.params?.recipientId; 


  useEffect(() => {
    const userIdsCombined = [currentUserID, recipientId].sort().join('_');

    const q = query(
      collection(db, 'messages'), 
      where('userIdsCombined', '==', userIdsCombined),
      orderBy('createdAt', 'desc'), 
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [currentUserID, recipientId]);

  const sendMessage = async (message) => {
    if (!message) return;
  
    // Ensure the IDs are in a consistent order
    const userIdsCombined = [currentUserID, recipientId].sort().join('_');
  
    await addDoc(collection(db, 'messages'), {
      userIds: [currentUserID, recipientId],
      userIdsCombined, 
      text: message,
      createdAt: new Date(),
    });
  
    setNewMessage('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.messageCard}>
            <Text style={styles.messageText}>{item.text}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
      <View style={styles.messageInputContainer}>
        <TextInput
          style={styles.messageInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        <TouchableOpacity onPress={() => sendMessage(newMessage)} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageCard: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
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
    marginBottom: 150,
  },
  messageInput: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    marginRight: 10,
    borderRadius: 5,
  },
});

export default MessagesScreen;
