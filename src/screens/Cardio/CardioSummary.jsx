import React from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { Text, Button, useTheme, Card } from 'react-native-paper';
import { CheckCircle, Share, Download, MapPin, Navigation } from 'lucide-react-native';
import { formatDistance } from '../../utils/distance';
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

const CardioSummary = ({ route, navigation }) => {
  const { activity, distance, duration, calories, pace, routeCoordinates, startLocation, endLocation } = route.params;
  const theme = useTheme();

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate map region that fits the entire route
  const getMapRegion = () => {
    if (!routeCoordinates || routeCoordinates.length === 0) return null;

    let minLat = routeCoordinates[0].latitude;
    let maxLat = routeCoordinates[0].latitude;
    let minLng = routeCoordinates[0].longitude;
    let maxLng = routeCoordinates[0].longitude;

    routeCoordinates.forEach(coord => {
      minLat = Math.min(minLat, coord.latitude);
      maxLat = Math.max(maxLat, coord.latitude);
      minLng = Math.min(minLng, coord.longitude);
      maxLng = Math.max(maxLng, coord.longitude);
    });

    const latitudeDelta = (maxLat - minLat) * 1.2; // 20% padding
    const longitudeDelta = (maxLng - minLng) * 1.2;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latitudeDelta, 0.01), // Minimum delta
      longitudeDelta: Math.max(longitudeDelta, 0.01),
    };
  };

  const mapRegion = getMapRegion();

  const renderMap = () => {
    if (isWeb || !mapsAvailable || !mapRegion) {
      return (
        <View style={[styles.mapFallback, { backgroundColor: theme.colors.surfaceVariant }]}>
          <View style={styles.fallbackContent}>
            <Text variant="displayMedium" style={{ color: theme.colors.primary, marginBottom: 16 }}>
              🗺️
            </Text>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginBottom: 8, textAlign: 'center' }}>
              Workout Route
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
              {isWeb 
                ? 'Route visualization available on mobile devices' 
                : 'Your workout route has been recorded'
              }
            </Text>
            {routeCoordinates && routeCoordinates.length > 0 && (
              <View style={styles.routeInfo}>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Route Points: {routeCoordinates.length}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Distance: {formatDistance(distance)}
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    }

    // Render actual map for mobile
    return (
      <MapView
        style={styles.summaryMap}
        region={mapRegion}
        scrollEnabled={true}
        zoomEnabled={true}
      >
        {/* Start Marker */}
        {startLocation && (
          <Marker coordinate={startLocation} title="Start Point">
            <View style={[styles.markerContainer, { backgroundColor: 'green' }]}>
              <Navigation size={16} color="white" />
            </View>
          </Marker>
        )}

        {/* End Marker */}
        {endLocation && (
          <Marker coordinate={endLocation} title="End Point">
            <View style={[styles.markerContainer, { backgroundColor: 'red' }]}>
              <MapPin size={16} color="white" />
            </View>
          </Marker>
        )}

        {/* Route Polyline */}
        {routeCoordinates.length > 1 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={theme.colors.primary}
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Card style={[styles.headerCard, { backgroundColor: theme.colors.primaryContainer }]}>
        <Card.Content>
          <View style={styles.headerContent}>
            <CheckCircle color={theme.colors.primary} size={32} />
            <View>
              <Text variant="headlineSmall" style={[styles.headerTitle, { color: theme.colors.onPrimaryContainer }]}>
                Workout Complete!
              </Text>
              <Text variant="bodyMedium" style={[styles.headerSubtitle, { color: theme.colors.onPrimaryContainer }]}>
                {activity ? activity.replace('_', ' ').toUpperCase() : 'WORKOUT'}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Route Map */}
        <Card style={styles.card}>
          <Card.Content style={styles.mapCardContent}>
            {renderMap()}
          </Card.Content>
        </Card>

        {/* Main Stats */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Workout Summary
            </Text>
            
            <View style={styles.mainStats}>
              <View style={styles.statColumn}>
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
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Duration</Text>
                </View>
              </View>
              
              <View style={styles.statColumn}>
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={[styles.statValue, { color: theme.colors.onSurface }]}>
                    {calories || 0}
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Calories</Text>
                </View>
                <View style={styles.statItem}>
                  <Text variant="headlineMedium" style={[styles.statValue, { color: theme.colors.onSurface }]}>
                    {pace || '0:00'}
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Avg Pace</Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Detailed Stats */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Session Details
            </Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Activity Type:</Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, textTransform: 'capitalize' }}>
                  {activity ? activity.replace('_', ' ') : 'Workout'}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Route Points:</Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                  {routeCoordinates ? routeCoordinates.length : 0}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Average Speed:</Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                  {pace || '0:00'}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Calories/Min:</Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                  {duration > 0 ? (calories / (duration / 60)).toFixed(1) : '0.0'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Action Buttons */}
      <Card style={styles.actionCard}>
        <Card.Content>
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('CardioTracker')}
              style={styles.doneButton}
            >
              New Workout
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('HomeTab')}
              style={styles.homeButton}
            >
              Home
            </Button>
            
            <View style={styles.iconButtons}>
              <Button
                mode="outlined"
                icon={Share}
                onPress={() => {
                  // Share functionality
                  console.log('Share workout');
                }}
                compact
              />
              <Button
                mode="outlined"
                icon={Download}
                onPress={() => {
                  // Download functionality
                  console.log('Download workout data');
                }}
                compact
              />
            </View>
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
  headerCard: {
    margin: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  headerSubtitle: {
    textTransform: 'capitalize',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
  mapCardContent: {
    padding: 0,
    overflow: 'hidden',
  },
  summaryMap: {
    height: 200,
    borderRadius: 8,
  },
  mapFallback: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  fallbackContent: {
    alignItems: 'center',
    padding: 20,
  },
  routeInfo: {
    marginTop: 12,
    alignItems: 'center',
    gap: 4,
  },
  markerContainer: {
    padding: 6,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  mainStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statColumn: {
    flex: 1,
  },
  statItem: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statValue: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionCard: {
    margin: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  doneButton: {
    flex: 2,
  },
  homeButton: {
    flex: 1,
  },
  iconButtons: {
    flexDirection: 'row',
    gap: 8,
  },
});

export default CardioSummary;