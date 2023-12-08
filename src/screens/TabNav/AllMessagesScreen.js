import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import { auth } from "/Users/computer/Desktop/FriendApp/firebaseConfig.js";

const AllMessagesScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const db = getFirestore();
  const currentUserID = auth.currentUser.uid;
  const convoImage = require('../../assets/images/convo.png'); 

  // Function to fetch conversations
  const fetchConversations = async () => {
    setRefreshing(true);
    const uniqueRecipientIds = new Set();
    const fetchedConversations = [];
    const conversationsQuery = query(collection(db, 'messages'), where('userIds', 'array-contains', currentUserID));
    const querySnapshot = await getDocs(conversationsQuery);

    for (const messageDoc of querySnapshot.docs) {
      const data = messageDoc.data();
      const recipientId = data.userIds.find(id => id !== currentUserID);

      if (recipientId && !uniqueRecipientIds.has(recipientId)) {
        uniqueRecipientIds.add(recipientId);

        const [recipientSnap, lastMessageSnapshot] = await Promise.all([
          getDoc(doc(db, 'users', recipientId)),
          getDocs(query(
            collection(db, 'messages'),
            where('userIdsCombined', '==', [currentUserID, recipientId].sort().join('_')),
            orderBy('createdAt', 'desc'),
            limit(1)
          ))
        ]);

        if (recipientSnap.exists() && !lastMessageSnapshot.empty) {
          const recipientData = recipientSnap.data();
          const lastMessageData = lastMessageSnapshot.docs[0].data();

          fetchedConversations.push({
            id: messageDoc.id,
            recipientId,
            recipientName: recipientData.name, 
            recipientImage: recipientData.profilePicture,
            lastMessage: lastMessageData.text,
            ...data
          });
        }
      }
    }

    setConversations(fetchedConversations);
    setRefreshing(false);
  };

  // useEffect to fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Function to render each item
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('MessagesScreen', { recipientId: item.recipientId })}
      style={styles.conversationCard}
    >
      <Image 
        source={{ uri: item.recipientImage || 'https://via.placeholder.com/150' }} 
        style={styles.profilePic} 
      />
      <View style={styles.textContainer}>
        <Text style={styles.nameText}>{item.recipientName || 'Unknown'}</Text>
        <Text style={styles.lastMessageText}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  // Main component return
  return (
    <View style={styles.container}>
      {conversations.length > 0 ? (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchConversations} />
          }
        />
      ) : (
        <View style={styles.emptyStateContainer}>
          <Image source={convoImage} style={styles.emptyStateImage} />
          <Text style={styles.emptyStateText}>No messages yet, start a conversation!</Text>
        </View>
      )}
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lastMessageText: {
    fontSize: 14,
    color: '#686868',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyStateText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#686868',
  },
});

export default AllMessagesScreen;
