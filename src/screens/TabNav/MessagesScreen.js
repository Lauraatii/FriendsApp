import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { getFirestore, collection, addDoc, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { auth } from "/Users/computer/Desktop/FriendApp/firebaseConfig.js";
import moment from 'moment';

const MessagesScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef();
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
        msgs.unshift({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [currentUserID, recipientId]);

  const sendMessage = async (message) => {
    if (!message) return;
  
    const userIdsCombined = [currentUserID, recipientId].sort().join('_');
  
    await addDoc(collection(db, 'messages'), {
      userIds: [currentUserID, recipientId],
      userIdsCombined, 
      text: message,
      createdAt: new Date(),
    });
  
    setNewMessage('');
  };

  const formatDate = (timestamp) => {
    const date = moment(timestamp.toDate());
    if (moment().diff(date, 'days') < 1) {
      return 'Today';
    } else if (moment().diff(date, 'days') < 2) {
      return 'Yesterday';
    } else {
      return date.format('MMM Do');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.messageBubble, 
      item.userIds[0] === currentUserID ? styles.sentMessage : styles.receivedMessage
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageDate}>{formatDate(item.createdAt)}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        inverted
        contentContainerStyle={styles.messagesList}
      />
      <TouchableOpacity onPress={() => flatListRef.current?.scrollToOffset({ animated: true, offset: 0 })} style={styles.scrollToBottomButton}>
        <Text style={styles.scrollToBottomText}>↓</Text>
      </TouchableOpacity>
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  messageBubble: {
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '80%',
  },
  sentMessage: {
    backgroundColor: '#FFCB37',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#E0E0E0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  messageDate: {
    fontSize: 12,
    color: '#686868',
    marginTop: 5,
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
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
  },
  messageInput: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    marginRight: 10,
    borderRadius: 5,
  },
  scrollToBottomButton: {
    position: 'absolute',
    right: 20,
    bottom: 70,
    backgroundColor: '#5967EB',
    borderRadius: 20,
    padding: 8,
  },
  scrollToBottomText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MessagesScreen;
