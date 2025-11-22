import { Eye, EyeOff, Lock, Mail, User, UserPlus } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Checkbox, Text, TextInput, useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { authAPI } from '../api/authAPI';
import { setLoading } from '../redux/userSlice';

const RegisterScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!username.trim()) newErrors.username = 'Username is required.';
    if (username && username.length < 3) newErrors.username = 'Username must be at least 3 characters long.';
    if (username && !/^[a-zA-Z0-9_]+$/.test(username)) newErrors.username = 'Username can only contain letters, numbers, and underscores.';
    if (!email.trim()) newErrors.email = 'Email is required.';
    if (email && !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email address.';
    if (!password.trim()) newErrors.password = 'Password is required.';
    if (password && password.length < 6) newErrors.password = 'Password must be at least 6 characters long.';
    if (!confirmPassword.trim()) newErrors.confirmPassword = 'Please confirm your password.';
    if (password && confirmPassword && password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    if (!agreedToTerms) newErrors.agreedToTerms = 'You must agree to the Terms of Service and Privacy Policy.';

    setErrors(newErrors);
    // clear any top-level server error when client validation runs
    setError('');

    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setError('');
    setSuccess('');
    setIsRegistering(true);
    dispatch(setLoading(true));

    try {
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
      };

      console.log('Registering user:', userData);
      await authAPI.register(userData);
      setSuccess('Registration successful! Redirecting to login...');
      
      // Redirect to login after success with pre-filled credentials
      setTimeout(() => {
        navigation.navigate('Login', { 
          prefillUsername: username.trim(), 
          prefillPassword: password.trim() 
        });
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
      dispatch(setLoading(false));
    }
  };

  const clearError = () => {
    setError('');
    setErrors({});
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 16 }}
    >
      {/* Header */}
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Text
          style={{
            fontSize: 42,
            fontFamily: 'Rowdies_700Bold',
            color: theme.colors.primary,
            marginBottom: 8,
          }}
        >
          Create Account
        </Text>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Join Trainly today!
        </Text>
      </View>

      {/* Error / Success messages */}
      {error ? (
        <View
          style={{
            backgroundColor: theme.colors.errorContainer,
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <Text style={{ color: theme.colors.onErrorContainer, textAlign: 'center' }}>{error}</Text>
        </View>
      ) : null}
      {success ? (
        <View
          style={{
            backgroundColor: '#D1FAE5', // light green background for success
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <Text style={{ color: '#065F46', textAlign: 'center' }}>{success}</Text>
        </View>
      ) : null}

      {/* Inputs */}
      {errors.firstName ? (
        <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{errors.firstName}</Text>
      ) : null}
      <TextInput
        label="First Name"
        value={firstName}
        onChangeText={(text) => {
          setFirstName(text);
          clearError();
          setErrors(prev => ({ ...prev, firstName: '' }));
        }}
        mode="outlined"
        left={<TextInput.Icon icon={User} />}
        style={{ marginBottom: 16 }}
        disabled={isRegistering}
        autoCapitalize="words"
      />
      {errors.lastName ? (
        <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{errors.lastName}</Text>
      ) : null}
      <TextInput
        label="Last Name"
        value={lastName}
        onChangeText={(text) => {
          setLastName(text);
          clearError();
          setErrors(prev => ({ ...prev, lastName: '' }));
        }}
        mode="outlined"
        left={<TextInput.Icon icon={User} />}
        style={{ marginBottom: 16 }}
        disabled={isRegistering}
        autoCapitalize="words"
      />
      {errors.username ? (
        <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{errors.username}</Text>
      ) : null}
      <TextInput
        label="Username"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          clearError();
          setErrors(prev => ({ ...prev, username: '' }));
        }}
        mode="outlined"
        left={<TextInput.Icon icon={UserPlus} />}
        style={{ marginBottom: 16 }}
        autoCapitalize="none"
        disabled={isRegistering}
        placeholder="At least 3 characters"
      />
      {errors.email ? (
        <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{errors.email}</Text>
      ) : null}
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          clearError();
          setErrors(prev => ({ ...prev, email: '' }));
        }}
        mode="outlined"
        left={<TextInput.Icon icon={Mail} />}
        style={{ marginBottom: 16 }}
        keyboardType="email-address"
        autoCapitalize="none"
        disabled={isRegistering}
        placeholder="example@email.com"
      />
      {errors.password ? (
        <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{errors.password}</Text>
      ) : null}
      <TextInput
        label="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          clearError();
          setErrors(prev => ({ ...prev, password: '' }));
        }}
        mode="outlined"
        secureTextEntry={!showPassword}
        left={<TextInput.Icon icon={Lock} />}
        right={<TextInput.Icon icon={showPassword ? EyeOff : Eye} onPress={() => setShowPassword(!showPassword)} />}
        style={{ marginBottom: 16 }}
        disabled={isRegistering}
        placeholder="At least 6 characters"
      />
      
      {/* Confirm Password */}
      {errors.confirmPassword ? (
        <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{errors.confirmPassword}</Text>
      ) : null}
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          clearError();
          setErrors(prev => ({ ...prev, confirmPassword: '' }));
        }}
        mode="outlined"
        secureTextEntry={!showConfirmPassword}
        left={<TextInput.Icon icon={Lock} />}
        right={<TextInput.Icon icon={showConfirmPassword ? EyeOff : Eye} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />}
        style={{ marginBottom: 16 }}
        disabled={isRegistering}
        placeholder="Re-enter your password"
      />

      {/* Terms Agreement */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        marginBottom: 24,
        paddingHorizontal: 4 
      }}>
        <Checkbox.Android
          status={agreedToTerms ? 'checked' : 'unchecked'}
          onPress={() => {
            setAgreedToTerms(!agreedToTerms);
            // clear the specific agreedToTerms error when toggled
            setErrors(prev => ({ ...prev, agreedToTerms: '' }));
          }}
          color={theme.colors.primary}
          disabled={isRegistering}
        />
        <Text 
          variant="bodySmall" 
          style={{ 
            color: theme.colors.onSurfaceVariant, 
            flex: 1, 
            marginLeft: 8,
            lineHeight: 20
          }}
          onPress={() => !isRegistering && setAgreedToTerms(!agreedToTerms)}
        >
          I agree to the{' '}
          <Text 
            variant="bodySmall" 
            style={{ color: theme.colors.primary, fontWeight: 'bold' }} 
          >
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text 
            variant="bodySmall" 
            style={{ color: theme.colors.primary, fontWeight: 'bold' }} 
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
      {errors.agreedToTerms ? (
        <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{errors.agreedToTerms}</Text>
      ) : null}

      {/* Register Button */}
      <Button
        mode="contained"
        onPress={handleRegister}
        loading={isRegistering}
        disabled={isRegistering || !agreedToTerms}
        style={{ marginBottom: 16 }}
        contentStyle={{ paddingVertical: 8 }}
      >
        {isRegistering ? 'Creating Account...' : 'Sign Up'}
      </Button>

      {/* Back to Login */}
      <View style={{ alignItems: 'center', marginTop: 8 }}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Already have an account?{' '}
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.primary, fontWeight: 'bold' }}
            onPress={() => navigation.navigate('Login')}
          >
            Sign In
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;