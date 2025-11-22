import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, Alert, ScrollView, Dimensions, Animated } from 'react-native';
import { Text, Button, useTheme, Card, ActivityIndicator } from 'react-native-paper';
import * as Location from 'expo-location';
import { Play, Pause, Square, MapPin, Navigation, Locate, Home } from 'lucide-react-native';
import { calculateDistance, formatDistance } from '../../utils/distance';
import { calculateCaloriesBurned, calculatePace } from '../../utils/calorieCalc';
import { isWeb } from '../../utils/platformUtils';

// Safe Map component imports with fallback
let MapView, Marker, Polyline;
let mapsAvailable = false;

try {
  if (!isWeb) {
    const ReactNativeMaps = require('react-native-maps');
    MapView = ReactNativeMaps.default;
    Marker = ReactNativeMaps.Marker;
    Polyline = ReactNativeMaps.Polyline;
    mapsAvailable = true;
  }
} catch (error) {
  console.warn('React Native Maps not available:', error);
  mapsAvailable = false;
}

const { width: screenWidth } = Dimensions.get('window');
const ACTIVITY_BUTTON_WIDTH = 120;
const SELECTED_ACTIVITY_WIDTH = 160;

const activities = [
  { id: 'running', name: 'Running', outdoor: true, icon: '🏃' },
  { id: 'walking', name: 'Walking', outdoor: true, icon: '🚶' },
  { id: 'cycling', name: 'Cycling', outdoor: true, icon: '🚴' },
  { id: 'indoor_running', name: 'Treadmill', outdoor: false, icon: '🏃‍♂️' },
];

const CardioTracker = ({ navigation }) => {
  const [activity, setActivity] = useState('running');
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [location, setLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [timer, setTimer] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [pausedTime, setPausedTime] = useState(0);
  const [gpsStatus, setGpsStatus] = useState('initializing');
  const [indoorSpeed, setIndoorSpeed] = useState(8); // km/h for indoor running
  const theme = useTheme();
  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);
  const scaleAnimations = useRef(
    activities.reduce((acc, act) => {
      acc[act.id] = new Animated.Value(act.id === 'running' ? 1 : 0.9);
      return acc;
    }, {})
  ).current;

  const isIndoorActivity = activity === 'indoor_running';

  // Request location permissions and get initial location (only for outdoor activities)
  useEffect(() => {
    if (!isIndoorActivity) {
      initializeLocation();
    } else {
      setGpsStatus('ready'); // Indoor activities don't need GPS
    }
    
    // Cleanup on unmount
    return () => {
      cleanupTracking();
    };
  }, [isIndoorActivity]);

  // Auto-scroll to selected activity and animate scale
  useEffect(() => {
    const activityIndex = activities.findIndex(a => a.id === activity);
    if (scrollViewRef.current && activityIndex !== -1) {
      const scrollPosition = activityIndex * ACTIVITY_BUTTON_WIDTH - (screenWidth - ACTIVITY_BUTTON_WIDTH) / 2;
      scrollViewRef.current.scrollTo({
        x: Math.max(0, scrollPosition),
        animated: true,
      });
    }

    // Animate scales
    activities.forEach(act => {
      Animated.spring(scaleAnimations[act.id], {
        toValue: act.id === activity ? 1.1 : 0.9,
        tension: 300,
        friction: 20,
        useNativeDriver: true,
      }).start();
    });
  }, [activity]);

  const initializeLocation = async () => {
    try {
      setGpsStatus('initializing');
      
      if (isWeb) {
        // Web fallback with mock location
        const mockLocation = {
          coords: {
            latitude: 37.7749,
            longitude: -122.4194,
            accuracy: 10,
            altitude: 0,
            altitudeAccuracy: 0,
            heading: 0,
            speed: 0,
          },
          timestamp: Date.now(),
        };
        setLocation(mockLocation);
        setRouteCoordinates([mockLocation.coords]);
        setGpsStatus('ready');
        return;
      }

      // Check if location services are enabled
      const hasServices = await Location.hasServicesEnabledAsync();
      if (!hasServices) {
        setGpsStatus('error');
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services to use GPS tracking.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Request permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setGpsStatus('denied');
        Alert.alert(
          'Location Permission Required',
          'This app needs location permissions to track your cardio workouts. Please enable location permissions in your settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Location.openSettings() }
          ]
        );
        return;
      }

      // Get initial location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setLocation(currentLocation);
      setRouteCoordinates([currentLocation.coords]);
      setGpsStatus('ready');
      
    } catch (error) {
      console.error('Error initializing location:', error);
      setGpsStatus('error');
      
      Alert.alert(
        'Location Error',
        'Unable to access your location. Please check your settings and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const cleanupTracking = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    if (locationSubscription) {
      if (isWeb) {
        clearInterval(locationSubscription);
      } else {
        locationSubscription.remove();
      }
      setLocationSubscription(null);
    }
  };

  const startTracking = async () => {
    if (!isIndoorActivity && gpsStatus !== 'ready' && !isWeb) {
      Alert.alert(
        'GPS Not Ready',
        'Please wait for GPS signal or check location permissions.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsTracking(true);
    setIsPaused(false);
    const trackingStartTime = Date.now() - pausedTime;
    setStartTime(trackingStartTime);
    setPausedTime(0);

    // Start timer
    const timerInterval = setInterval(() => {
      if (!isPaused) {
        setDuration(Math.floor((Date.now() - trackingStartTime) / 1000));
        
        // Calculate indoor distance based on time and speed
        if (isIndoorActivity && !isPaused) {
          const hours = duration / 3600;
          const newDistance = indoorSpeed * hours;
          setDistance(newDistance);
        }
      }
    }, 1000);
    setTimer(timerInterval);

    if (isIndoorActivity) {
      // Indoor activities don't need GPS tracking
      return;
    }

    if (isWeb) {
      // Web simulation for outdoor activities
      const webTimer = setInterval(() => {
        if (!isPaused && isTracking) {
          const newLocation = {
            coords: {
              latitude: 37.7749 + (Math.random() - 0.5) * 0.01,
              longitude: -122.4194 + (Math.random() - 0.5) * 0.01,
              accuracy: 10,
              altitude: 0,
              altitudeAccuracy: 0,
              heading: 0,
              speed: 0,
            },
            timestamp: Date.now(),
          };
          updateLocation(newLocation);
        }
      }, 2000);
      setLocationSubscription(webTimer);
    } else {
      // Real GPS tracking for mobile outdoor activities
      try {
        const sub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (newLocation) => {
            if (!isPaused && isTracking) {
              updateLocation(newLocation);
            }
          }
        );
        setLocationSubscription(sub);
      } catch (error) {
        console.error('Error starting location tracking:', error);
        Alert.alert('Tracking Error', 'Failed to start GPS tracking.');
      }
    }
  };

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
    setRouteCoordinates(prev => {
      const newCoords = [...prev, newLocation.coords];
      
      // Calculate distance if we have at least 2 points
      if (newCoords.length > 1) {
        const lastCoord = newCoords[newCoords.length - 2];
        const newDistance = calculateDistance(
          lastCoord.latitude,
          lastCoord.longitude,
          newLocation.coords.latitude,
          newLocation.coords.longitude
        );
        // Only add distance if it's reasonable (filter GPS jumps)
        if (newDistance < 0.1) {
          setDistance(prev => prev + newDistance);
        }
      }
      
      return newCoords;
    });
  };

  const pauseTracking = () => {
    setIsPaused(true);
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    if (locationSubscription && !isWeb && !isIndoorActivity) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  };

  const resumeTracking = () => {
    setIsPaused(false);
    setPausedTime(Date.now() - startTime - duration);
    startTracking();
  };

  const stopTracking = () => {
    setIsTracking(false);
    setIsPaused(false);
    
    cleanupTracking();

    // Calculate final metrics
    const calories = calculateCaloriesBurned(activity, duration, 70, distance);
    const pace = calculatePace(distance, duration);

    if (duration > 0) {
      navigation.navigate('CardioSummary', {
        activity,
        distance,
        duration,
        calories,
        pace,
        routeCoordinates: isIndoorActivity ? [] : routeCoordinates,
        startLocation: isIndoorActivity ? null : routeCoordinates[0],
        endLocation: isIndoorActivity ? null : routeCoordinates[routeCoordinates.length - 1],
        isIndoor: isIndoorActivity,
      });
    }

    // Reset state
    setDistance(0);
    setDuration(0);
    if (!isIndoorActivity) {
      setRouteCoordinates(location ? [location.coords] : []);
    }
  };

  const retryGPS = () => {
    initializeLocation();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleActivitySelect = (activityId) => {
    setActivity(activityId);
    const activityData = activities.find(a => a.id === activityId);
    if (activityData?.outdoor && gpsStatus !== 'ready') {
      initializeLocation();
    }
  };

  const renderGPSStatus = () => {
    if (isIndoorActivity) {
      return (
        <View style={styles.statusContainer}>
          <Home color={theme.colors.primary} size={32} />
          <Text variant="bodyMedium" style={{ color: theme.colors.primary, marginTop: 8, textAlign: 'center' }}>
            Indoor Mode Active{'\n'}No GPS Required
          </Text>
        </View>
      );
    }

    switch (gpsStatus) {
      case 'initializing':
        return (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
              Acquiring GPS signal...
            </Text>
          </View>
        );
      case 'ready':
        return (
          <View style={styles.statusContainer}>
            <Locate color={theme.colors.primary} size={32} />
            <Text variant="bodyMedium" style={{ color: theme.colors.primary, marginTop: 8 }}>
              GPS Ready - Start tracking!
            </Text>
          </View>
        );
      case 'error':
        return (
          <View style={styles.statusContainer}>
            <Locate color={theme.colors.error} size={32} />
            <Text variant="bodyMedium" style={{ color: theme.colors.error, marginTop: 8, textAlign: 'center' }}>
              GPS Error{'\n'}Check location services
            </Text>
            <Button mode="outlined" onPress={retryGPS} style={{ marginTop: 12 }}>
              Retry
            </Button>
          </View>
        );
      case 'denied':
        return (
          <View style={styles.statusContainer}>
            <Locate color={theme.colors.error} size={32} />
            <Text variant="bodyMedium" style={{ color: theme.colors.error, marginTop: 8, textAlign: 'center' }}>
              Location Permission Required{'\n'}Enable in settings
            </Text>
            <Button mode="outlined" onPress={retryGPS} style={{ marginTop: 12 }}>
              Grant Permission
            </Button>
          </View>
        );
      default:
        return null;
    }
  };

  const renderIndoorControls = () => {
    if (!isIndoorActivity) return null;

    return (
      <Card style={styles.indoorControls}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
            Treadmill Speed
          </Text>
          <View style={styles.speedControls}>
            <Button
              mode="outlined"
              onPress={() => setIndoorSpeed(prev => Math.max(1, prev - 1))}
              disabled={isTracking}
            >
              -
            </Button>
            <View style={styles.speedDisplay}>
              <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
                {indoorSpeed}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                km/h
              </Text>
            </View>
            <Button
              mode="outlined"
              onPress={() => setIndoorSpeed(prev => prev + 1)}
              disabled={isTracking}
            >
              +
            </Button>
          </View>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}>
            Adjust based on your treadmill speed
          </Text>
        </Card.Content>
      </Card>
    );
  };

  const renderActivitySelector = () => (
    <Card style={styles.activitySelector}>
      <Card.Content style={styles.activityCardContent}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activityScrollContent}
          decelerationRate="normal"
          scrollEventThrottle={16}
        >
          {activities.map((act) => {
            const isSelected = activity === act.id;
            const buttonWidth = isSelected ? SELECTED_ACTIVITY_WIDTH : ACTIVITY_BUTTON_WIDTH;
            
            return (
              <Animated.View 
                key={act.id} 
                style={[
                  styles.activityButtonContainer,
                  { 
                    width: buttonWidth,
                    transform: [{ scale: scaleAnimations[act.id] }]
                  }
                ]}
              >
                <Button
                  mode={isSelected ? 'contained' : 'outlined'}
                  onPress={() => handleActivitySelect(act.id)}
                  style={[
                    styles.activityButton,
                    isSelected && styles.activeActivityButton,
                    { height: isSelected ? 100 : 80 }
                  ]}
                  contentStyle={styles.activityButtonContent}
                  disabled={isTracking}
                >
                  <View style={styles.activityButtonInner}>
                    <Text style={[
                      styles.activityIcon,
                      { fontSize: isSelected ? 32 : 24 }
                    ]}>
                      {act.icon}
                    </Text>
                    <Text 
                      style={[
                        styles.activityText,
                        { 
                          color: isSelected ? theme.colors.onPrimary : theme.colors.onSurface,
                          fontSize: isSelected ? 14 : 12,
                          fontWeight: isSelected ? '700' : '600'
                        }
                      ]}
                      numberOfLines={isSelected ? 2 : 1}
                    >
                      {act.name}
                    </Text>
                    {isSelected && (
                      <Text 
                        style={[
                          styles.activitySubtitle,
                          { color: theme.colors.onPrimary }
                        ]}
                        numberOfLines={1}
                      >
                        {act.outdoor ? 'Outdoor GPS Tracking' : 'Indoor Treadmill'}
                      </Text>
                    )}
                  </View>
                </Button>
              </Animated.View>
            );
          })}
        </ScrollView>
      </Card.Content>
    </Card>
  );

  const renderMap = () => {
    if (isIndoorActivity) {
      return (
        <View style={[styles.mapFallback, { backgroundColor: theme.colors.surfaceVariant }]}>
          <View style={styles.fallbackContent}>
            <Home color={theme.colors.primary} size={64} />
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginBottom: 8, textAlign: 'center' }}>
              Treadmill Running
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
              Track your treadmill workout{'\n'}No GPS required
            </Text>
            {isTracking && (
              <View style={styles.webStats}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Speed: {indoorSpeed} km/h
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Distance: {formatDistance(distance)}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Time: {formatTime(duration)}
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    }

    if (isWeb || !mapsAvailable || !location) {
      return (
        <View style={[styles.mapFallback, { backgroundColor: theme.colors.surfaceVariant }]}>
          {gpsStatus !== 'ready' && !isWeb ? (
            renderGPSStatus()
          ) : (
            <View style={styles.fallbackContent}>
              <Text variant="displayMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16 }}>
                🗺️
              </Text>
              <Text variant="titleLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8, textAlign: 'center' }}>
                {isTracking ? 'Tracking Your Route...' : 'Ready to Start'}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
                {isWeb 
                  ? 'GPS simulation active - real tracking available on mobile' 
                  : 'GPS Ready - Start your workout!'
                }
              </Text>
              
              {isTracking && (
                <View style={styles.webStats}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Distance: {formatDistance(distance)}
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Time: {formatTime(duration)}
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    Calories: {calculateCaloriesBurned(activity, duration, 70, distance)}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      );
    }

    // Render actual map for mobile outdoor activities
    return (
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Start Marker */}
        {routeCoordinates.length > 0 && (
          <Marker
            coordinate={routeCoordinates[0]}
            title="Start Point"
          >
            <View style={[styles.markerContainer, { backgroundColor: 'green' }]}>
              <Navigation size={16} color="white" />
            </View>
          </Marker>
        )}

        {/* Route Polyline */}
        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={theme.colors.primary}
            strokeWidth={4}
          />
        )}
      </MapView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Activity Selector */}
      {renderActivitySelector()}

      {/* Indoor Controls */}
      {renderIndoorControls()}

      {/* Map View */}
      <View style={styles.mapContainer}>
        {renderMap()}
      </View>

      {/* Stats Card */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={[styles.statValue, { color: theme.colors.onSurface }]}>
                {formatDistance(distance)}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Distance</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={[styles.statValue, { color: theme.colors.onSurface }]}>
                {formatTime(duration)}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Time</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineMedium" style={[styles.statValue, { color: theme.colors.onSurface }]}>
                {calculateCaloriesBurned(activity, duration, 70, distance)}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Calories</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Control Buttons */}
      <Card style={styles.controlsCard}>
        <Card.Content>
          <View style={styles.controlsRow}>
            {!isTracking ? (
              <Button
                mode="contained"
                onPress={startTracking}
                icon={Play}
                contentStyle={styles.buttonContent}
                style={styles.mainButton}
                disabled={!isIndoorActivity && gpsStatus !== 'ready' && !isWeb}
                loading={!isIndoorActivity && gpsStatus === 'initializing'}
              >
                {!isIndoorActivity && gpsStatus === 'initializing' ? 'Waiting for GPS...' : 'Start Workout'}
              </Button>
            ) : (
              <>
                {isPaused ? (
                  <Button
                    mode="contained"
                    onPress={resumeTracking}
                    icon={Play}
                    contentStyle={styles.buttonContent}
                    style={styles.mainButton}
                  >
                    Resume
                  </Button>
                ) : (
                  <Button
                    mode="contained"
                    onPress={pauseTracking}
                    icon={Pause}
                    buttonColor={theme.colors.secondary}
                    contentStyle={styles.buttonContent}
                    style={styles.mainButton}
                  >
                    Pause
                  </Button>
                )}
                <Button
                  mode="contained"
                  onPress={stopTracking}
                  icon={Square}
                  buttonColor={theme.colors.error}
                  contentStyle={styles.buttonContent}
                  style={styles.stopButton}
                >
                  Stop
                </Button>
              </>
            )}
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activitySelector: {
    margin: 16,
    marginBottom: 8,
  },
  activityCardContent: {
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  activityScrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  activityButtonContainer: {
    paddingHorizontal: 4,
  },
  activityButton: {
    width: '100%',
  },
  activeActivityButton: {
    borderWidth: 2,
  },
  activityButtonContent: {
    height: '100%',
  },
  activityButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  activityIcon: {
    marginBottom: 4,
  },
  activityText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  activitySubtitle: {
    fontSize: 10,
    opacity: 0.8,
    marginTop: 2,
    textAlign: 'center',
  },
  indoorControls: {
    margin: 16,
    marginTop: 0,
  },
  speedControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  speedDisplay: {
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackContent: {
    alignItems: 'center',
    padding: 20,
  },
  statusContainer: {
    alignItems: 'center',
    padding: 20,
  },
  webStats: {
    marginTop: 20,
    alignItems: 'center',
    gap: 4,
  },
  markerContainer: {
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsCard: {
    margin: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontWeight: 'bold',
  },
  controlsCard: {
    margin: 16,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonContent: {
    flexDirection: 'row-reverse',
    height: 48,
  },
  mainButton: {
    flex: 2,
  },
  stopButton: {
    flex: 1,
  },
});

export default CardioTracker;