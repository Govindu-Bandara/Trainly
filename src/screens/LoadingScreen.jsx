import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import { useFonts, Rowdies_300Light, Rowdies_400Regular, Rowdies_700Bold } from '@expo-google-fonts/rowdies';

const LoadingScreen = () => {
  const theme = useTheme();
  const spinValue = new Animated.Value(0);
  const [showContent, setShowContent] = useState(false);

  // Load Rowdies font
  let [fontsLoaded] = useFonts({
    Rowdies_300Light,
    Rowdies_400Regular,
    Rowdies_700Bold,
  });

  // Animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // 4-second delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Show a simple loading screen if fonts aren't loaded yet
  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.primary }}>Loading fonts...</Text>
      </View>
    );
  }

  if (!showContent) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Lottie Animation */}
        <View style={styles.animationContainer}>
          <LottieView
            source={require('../../assets/animations/loading_logo.json')}
            autoPlay
            loop
            style={styles.animation}
            resizeMode="cover"
          />
        </View>
        
        {/* App Name with Rowdies Font - No Shadow */}
        <View style={styles.titleContainer}>
          <Text 
            style={[
              styles.appNameRowdies,
              { 
                color: 'navy',
              }
            ]}
          >
            Trainly
          </Text>
          <View style={[styles.underline, { backgroundColor: theme.colors.accent }]} />
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  animationContainer: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appNameRowdies: {
    fontSize: 52,
    fontFamily: 'Rowdies_700Bold',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: 8,
    // Shadow properties removed for clean look
  },
  underline: {
    width: 80,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  loadingText: {
    textAlign: 'center',
    opacity: 0.8,
    fontSize: 16,
    letterSpacing: 0.5,
    fontFamily: 'Rowdies_300Light',
  },
});

export default LoadingScreen;