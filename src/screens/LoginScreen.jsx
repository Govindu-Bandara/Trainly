import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, User as UserIcon, Lock } from 'lucide-react-native';
import { setUser, setLoading } from '../redux/userSlice';
import { authAPI } from '../api/authAPI';

const LoginScreen = ({ navigation, route }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();
  const dispatch = useDispatch();

  // Auto-fill from registration
  useEffect(() => {
    if (route.params?.prefillUsername) {
      setUsername(route.params.prefillUsername);
    }
    if (route.params?.prefillPassword) {
      setPassword(route.params.prefillPassword);
    }
  }, [route.params]);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setError('');
    setIsLoggingIn(true);
    dispatch(setLoading(true));

    try {
      const userData = await authAPI.login(username, password);
      dispatch(setUser(userData));
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid username or password. Please try again.');
    } finally {
      setIsLoggingIn(false);
      dispatch(setLoading(false));
    }
  };

  const useDemoCredentials = () => {
    setUsername('kminchelle');
    setPassword('0lelplR');
    setError('');
  };

  const clearError = () => {
    setError('');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 16 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* App Header */}
      <View style={{ alignItems: 'center', marginBottom: 48 }}>
        <Text
          style={{
            fontSize: 48,
            fontFamily: 'Rowdies_700Bold',
            color: theme.colors.primary,
            marginBottom: 8,
            textAlign: 'center',
          }}
        >
          Trainly
        </Text>
        <Text
          variant="titleLarge"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          Your Fitness Companion
        </Text>
      </View>

      {/* Login Section */}
      <View style={{ marginBottom: 32 }}>
        <Text
          variant="headlineMedium"
          style={{
            fontWeight: 'bold',
            color: theme.colors.onSurface,
            marginBottom: 24,
            textAlign: 'center',
          }}
        >
          Welcome Back
        </Text>

        {error ? (
          <View
            style={{
              backgroundColor: theme.colors.errorContainer,
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <Text
              style={{ color: theme.colors.onErrorContainer, textAlign: 'center' }}
            >
              {error}
            </Text>
          </View>
        ) : null}

        {/* Username */}
        <TextInput
          label="Username"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            clearError();
          }}
          mode="outlined"
          left={<TextInput.Icon icon={() => <UserIcon size={20} />} />}
          style={{ marginBottom: 16 }}
          autoCapitalize="none"
          disabled={isLoggingIn}
        />

        {/* Password */}
        <TextInput
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            clearError();
          }}
          mode="outlined"
          secureTextEntry={!showPassword}
          left={<TextInput.Icon icon={() => <Lock size={20} />} />}
          right={
            <TextInput.Icon
              icon={() => (showPassword ? <EyeOff size={20} /> : <Eye size={20} />)}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          style={{ marginBottom: 24 }}
          disabled={isLoggingIn}
        />

        {/* Login Button */}
        <Button
          mode="contained"
          onPress={handleLogin}
          loading={isLoggingIn}
          disabled={isLoggingIn}
          style={{ marginBottom: 16 }}
          contentStyle={{ paddingVertical: 8 }}
        >
          {isLoggingIn ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Demo Credentials */}
        <Button
          mode="outlined"
          onPress={useDemoCredentials}
          contentStyle={{ paddingVertical: 8 }}
          disabled={isLoggingIn}
          style={{ marginBottom: 16 }}
        >
          Use Demo Credentials
        </Button>

        {/* Register Link */}
        <View style={{ alignItems: 'center' }}>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Don't have an account?{' '}
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.primary, fontWeight: 'bold' }}
              onPress={() => navigation.navigate('Register')}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </View>

      {/* Demo Info */}
      <View
        style={{
          backgroundColor: theme.colors.surfaceVariant,
          padding: 16,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
        >
          Demo: kminchelle / 0lelplR or emilys / emilyspass
        </Text>
      </View>

      {/* Footer */}
      <View style={{ alignItems: 'center' }}>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
        >
          By signing in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;