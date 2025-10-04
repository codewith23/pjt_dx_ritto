import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
}

interface AuthData {
  users: User[];
}

const DEMO_USER_EMAIL = 'demo@example.com';
const DEMO_USER_PASSWORD = 'password123';

const getAuthData = (): AuthData => {
  try {
    const data = localStorage.getItem('authData');
    return data ? JSON.parse(data) : { users: [] };
  } catch (error) {
    console.error("Failed to parse auth data from localStorage", error);
    return { users: [] };
  }
};

const saveAuthData = (data: AuthData) => {
  try {
    localStorage.setItem('authData', JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save auth data to localStorage", error);
  }
};

const setupDemoUser = () => {
  try {
    const authData = getAuthData();
    const userExists = authData.users.some(u => u.email === DEMO_USER_EMAIL);

    if (!userExists) {
      const userPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
      const demoUser = {
        id: crypto.randomUUID(),
        email: DEMO_USER_EMAIL,
      };
      
      authData.users.push(demoUser);
      userPasswords[demoUser.id] = DEMO_USER_PASSWORD;

      saveAuthData(authData);
      localStorage.setItem('userPasswords', JSON.stringify(userPasswords));
      console.log('Demo user has been created.');
    }
  } catch (error) {
    console.error('Failed to set up demo user:', error);
  }
};


// This is a simplified auth hook for demonstration.
// In a real app, use a proper auth library and server-side validation with hashed passwords.
const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Setup demo user on initial application load if it doesn't exist
    setupDemoUser();

    try {
      const savedUser = sessionStorage.getItem('currentUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
    } finally {
        setLoading(false);
    }
  }, []);

  const login = (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      const { users } = getAuthData();
      const userPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
      const user = users.find(u => u.email === email);
      
      if (user && userPasswords[user.id] === password) {
        const userToSave = { id: user.id, email: user.email };
        setCurrentUser(userToSave);
        sessionStorage.setItem('currentUser', JSON.stringify(userToSave));
        resolve(userToSave);
      } else {
        setTimeout(() => reject(new Error('メールアドレスまたはパスワードが正しくありません。')), 500);
      }
    });
  };

  const signup = (email: string, password: string): Promise<User> => {
      return new Promise((resolve, reject) => {
          const authData = getAuthData();
          const userPasswords = JSON.parse(localStorage.getItem('userPasswords') || '{}');

          if (authData.users.some(u => u.email === email)) {
              return setTimeout(() => reject(new Error('このメールアドレスは既に使用されています。')), 500);
          }

          const newUser: User = {
              id: crypto.randomUUID(),
              email,
          };
          
          authData.users.push(newUser);
          userPasswords[newUser.id] = password; // Storing password in plain text for demo purposes

          saveAuthData(authData);
          localStorage.setItem('userPasswords', JSON.stringify(userPasswords));
          
          setCurrentUser(newUser);
          sessionStorage.setItem('currentUser', JSON.stringify(newUser));
          resolve(newUser);
      });
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
  };

  return { currentUser, login, signup, logout, loading };
};

export default useAuth;