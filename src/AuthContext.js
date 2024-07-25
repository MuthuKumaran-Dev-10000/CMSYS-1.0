import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig'; // Adjust the path if needed
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const sanitizedEmail = user.email.replace('.', ',');
        const userRef = ref(db, `users/${sanitizedEmail}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setCurrentUser({
            email: user.email,
            role: userData.role
          });
        } else {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
