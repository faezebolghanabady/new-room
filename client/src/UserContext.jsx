import React, { createContext, useState } from 'react';

const EmailContext = createContext(null);

export const EmailProvider = ({ children }) => {
  const [email, setEmail] = useState('');
  const [room, setRoom] = useState('');

  return (
    <EmailContext.Provider value={{ email, setEmail ,room , setRoom}}>
      {children}
    </EmailContext.Provider>
  );
};

export default EmailContext;