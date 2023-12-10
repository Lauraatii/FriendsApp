import React, { createContext, useState, useContext } from 'react';

const MessagesContext = createContext();

export const useMessagesContext = () => useContext(MessagesContext);

export const MessagesProvider = ({ children }) => {
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  return (
    <MessagesContext.Provider value={{ unreadMessagesCount, setUnreadMessagesCount }}>
      {children}
    </MessagesContext.Provider>
  );
};
