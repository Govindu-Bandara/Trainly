import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

// Mock user database for development
const mockUsers = [
  {
    id: 15,
    username: 'kminchelle',
    password: '0lelplR',
    email: 'kminchelle@qq.com',
    firstName: 'Jeanne',
    lastName: 'Halvorson',
    gender: 'female',
    image: 'https://robohash.org/autquiaut.png',
  },
  {
    id: 1,
    username: 'emilys',
    password: 'emilyspass',
    email: 'emily@example.com',
    firstName: 'Emily',
    lastName: 'Johnson',
    gender: 'female',
    image: 'https://robohash.org/emily.png',
  }
];

export const authAPI = {
  login: async (username, password) => {
    try {
      console.log('Attempting login with:', { username, password });
      
      return await authAPI.mockLogin(username, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Real API login
  realLogin: async (username, password) => {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username: username.trim(),
      password: password.trim(),
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
    
    if (response.data && response.data.token) {
      const userData = {
        ...response.data,
        // Store additional security info
        loginTimestamp: Date.now(),
      };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }
    throw new Error('Login failed');
  },

  // Mock login for development
  mockLogin: async (username, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user = mockUsers.find(u => 
      u.username === username.trim() && u.password === password
    );
    
    if (user) {
      const userData = {
        ...user,
        token: `mock_jwt_${user.id}_${Date.now()}`,
        loginTimestamp: Date.now(),
        // Remove password from stored data
        password: undefined
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }
    
    throw new Error('Invalid credentials');
  },

  register: async (userData) => {
    try {
      console.log('Attempting registration:', userData);
      
      // For development, use mock registration
      return await authAPI.mockRegister(userData);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  mockRegister: async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if username already exists
    const existingUser = mockUsers.find(u => u.username === userData.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }
    
    // Check if email already exists
    const existingEmail = mockUsers.find(u => u.email === userData.email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }
    
    // Create new user
    const newUser = {
      id: Math.max(...mockUsers.map(u => u.id)) + 1,
      username: userData.username,
      password: userData.password, // In real app, this would be hashed
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      gender: 'other',
      image: `https://robohash.org/${userData.username}.png`,
    };
    
    // Add to mock database (in real app, this would be a backend call)
    mockUsers.push(newUser);
    
    // Auto-login after registration
    const loginData = {
      ...newUser,
      token: `mock_jwt_${newUser.id}_${Date.now()}`,
      loginTimestamp: Date.now(),
      password: undefined
    };
    
    await AsyncStorage.setItem('user', JSON.stringify(loginData));
    return loginData;
  },

  logout: async () => {
    try {
      // Clear all user-related data
      await AsyncStorage.multiRemove([
        'user',
        'favourites', 
        'customPlans',
        'theme'
      ]);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getStoredUser: async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (!userJson) return null;
      
      const user = JSON.parse(userJson);
      
      // Check if token is still valid (mock expiration check)
      const tokenAge = Date.now() - (user.loginTimestamp || 0);
      const tokenMaxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
      
      if (tokenAge > tokenMaxAge) {
        // Token expired, force logout
        await AsyncStorage.removeItem('user');
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('Get stored user error:', error);
      await AsyncStorage.removeItem('user'); // Clear corrupted data
      return null;
    }
  },

  // Security: Clear all sensitive data
  clearSensitiveData: async () => {
    try {
      await AsyncStorage.multiRemove([
        'user',
        'favourites',
        'customPlans'
      ]);
    } catch (error) {
      console.error('Clear sensitive data error:', error);
    }
  },

  logout: async () => {
  try {
    console.log('Starting logout process...');
    
    // Clear all user-related data from storage
    await AsyncStorage.multiRemove([
      'user',
      'favourites', 
      'customPlans',
      'theme' // Optional: keep theme preference if you want
    ]);
    
    console.log('Logout successful - all data cleared');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    // Even if storage fails, we should consider logout successful
    // to prevent users from being stuck
    return true;
  }
 },
};