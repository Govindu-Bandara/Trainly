import React from 'react';
import { View } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, Moon, Sun } from 'lucide-react-native';
import { toggleTheme } from '../redux/themeSlice';

const Header = () => {
  const theme = useTheme();
  const { isDarkMode } = useSelector(state => state.theme);
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const getUserDisplayName = () => {
    if (!user) return '';
    
    // Try to get full name first
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    
    // Fall back to username
    return user.username || '';
  };

  const getWelcomeMessage = () => {
    const displayName = getUserDisplayName();
    if (displayName) {
      return `Welcome, ${displayName}! 👋`;
    }
    return 'Welcome back! 👋';
  };

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.surface, elevation: 2 }}>
      <View style={{ flex: 1, marginLeft: 16 }}>
        <Text style={{ 
          fontSize: 24, 
          fontFamily: 'Rowdies_700Bold',
          color: theme.colors.primary,
        }}>
          Trainly
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {getWelcomeMessage()}
        </Text>
      </View>
      
      <Appbar.Action 
        icon={() => isDarkMode ? 
          <Sun size={24} color={theme.colors.onSurface} /> : 
          <Moon size={24} color={theme.colors.onSurface} />
        }
        onPress={() => dispatch(toggleTheme())}
      />
      <Appbar.Action 
        icon={() => <Bell size={24} color={theme.colors.onSurface} />}
        onPress={() => {}} 
      />
    </Appbar.Header>
  );
};

export default Header;