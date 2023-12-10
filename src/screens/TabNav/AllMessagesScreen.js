import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import { auth } from "/Users/computer/Desktop/FriendApp/firebaseConfig.js";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useMessagesContext } from './MessagesContext';

const AllMessagesScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const db = getFirestore();
  const currentUserID = auth.currentUser.uid;
  const convoImage = require('../../assets/images/convo.png'); 
  const { setUnreadMessagesCount } = useMessagesContext();

  useEffect(() => {
    fetchConversations();
  }, []);

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

        const unreadCountQuery = query(
          collection(db, 'messages'),
          where('userIdsCombined', '==', [currentUserID, recipientId].sort().join('_')),
          where('isRead', '==', false),
          where('userIds', 'array-contains', currentUserID)
        );
        const unreadCountSnapshot = await getDocs(unreadCountQuery);
        const unreadCount = unreadCountSnapshot.size;

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
            unreadCount,
            ...data
          });
        }
      }
    }
    setConversations(fetchedConversations);
    setRefreshing(false);
    updateUnreadMessagesCount();
  };

  const updateUnreadMessagesCount = async () => {
    const unreadMessagesQuery = query(
      collection(db, 'messages'),
      where('userIds', 'array-contains', currentUserID),
      where('isRead', '==', false)
    );
  
    const unreadSnapshot = await getDocs(unreadMessagesQuery);
    const unreadCount = unreadSnapshot.size;
    setUnreadMessagesCount(unreadCount);
  };

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
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
      <Icon name="angle-right" size={20} color="#5967EB" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Icon name="plus" size={24} color="#5967EB" onPress={() => {/* Navigate to new conversation screen */}} />
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginVertical: 5,
    marginHorizontal: 10,
    elevation: 1,
    shadowRadius: 2,
    shadowOpacity: 0.1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#31456A',
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessageText: {
    fontSize: 14,
    color: '#686868',
    marginTop: 4,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#686868',
    textAlign: 'center',
  },
  unreadBadge: {
    backgroundColor: 'red',
    borderRadius: 12,
    padding: 4,
    position: 'absolute',
    right: 15,
    top: 10
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 12,
  },
});

export default AllMessagesScreen;
