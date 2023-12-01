import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const MessagesScreen = ({ navigation }) => {
  // Placeholder data
  const messages = [
    { id: '1', title: 'Message 1' },
    { id: '2', title: 'Message 2' },
    // Add more messages here
  ];

  const renderItem = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.messageText}>{item.title}</Text>
      {/* Add more message details here */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  messageContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  messageText: {
    fontSize: 18,
  },
  // Add more styles as needed
});

export default MessagesScreen;
