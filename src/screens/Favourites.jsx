// src/screens/Favourites.jsx

import { Clock, Dumbbell, Heart } from 'lucide-react-native';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { removeWorkoutFromFavourites } from '../redux/favouritesSlice';

const Favourites = ({ navigation }) => {
  const { favouriteWorkouts } = useSelector(state => state.favourites);
  const theme = useTheme();
  const dispatch = useDispatch();

  const removeWorkout = (workoutId, workoutName) => {
    Alert.alert(
      'Remove from Favorites',
      `Are you sure you want to remove "${workoutName}" from your favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => dispatch(removeWorkoutFromFavourites(workoutId)),
        },
      ]
    );
  };

  // ------------------------
  // EMPTY FAVORITES SCREEN
  // ------------------------
  if (!favouriteWorkouts || favouriteWorkouts.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Heart color={theme.colors.onSurfaceVariant} size={70} />
          <Text
            variant="headlineSmall"
            style={{ marginTop: 16, color: theme.colors.onSurfaceVariant, fontWeight: 'bold' }}>
            No Favorites Yet
          </Text>

          <Text
            variant="bodyMedium"
            style={{ marginTop: 8, marginBottom: 16, color: theme.colors.onSurfaceVariant, textAlign: 'center', paddingHorizontal: 16 }}>
            Start adding workouts to your favorites from the workout section.
          </Text>

          <Button
            mode="contained"
            icon={Dumbbell}
            onPress={() => navigation.navigate('WorkoutTab')}>
            Browse Workouts
          </Button>
        </View>
      </View>
    );
  }

  // ------------------------
  // FAVORITES LIST SCREEN
  // ------------------------
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>

      {/* HEADER */}
      <View style={{ paddingHorizontal: 20, marginTop: 40 }}>
        <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
          Favorites
        </Text>

        <Text variant="bodyMedium" style={{ marginTop: 4, color: theme.colors.onSurfaceVariant }}>
          {favouriteWorkouts.length} workout{favouriteWorkouts.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* LIST */}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {favouriteWorkouts.map((workout, index) => (
          <TouchableOpacity
            key={workout.id}
            onPress={() => navigation.navigate('WorkoutSession', { workoutSet: workout })}
            activeOpacity={0.9}
            style={{ marginBottom: 20 }}
          >
            <Card
              style={{
                backgroundColor: theme.colors.surfaceVariant,
                borderRadius: 20,
                paddingVertical: 16,
                paddingHorizontal: 16,
                elevation: 0,
              }}
            >
              {/* TOP ROW */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                
                {/* Number + Title */}
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: theme.colors.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 14,
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>
                      {index + 1}
                    </Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {workout.muscle || 'Full Body'}
                    </Text>

                    <Text
                      variant="titleMedium"
                      numberOfLines={1}
                      style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                      {workout.setName || workout.name}
                    </Text>
                  </View>
                </View>

                {/* REMOVE */}
                <TouchableOpacity
                  onPress={() => removeWorkout(workout.id, workout.setName || workout.name)}
                  style={{ padding: 6 }}
                >
                  <Heart size={24} color={theme.colors.error} fill={theme.colors.error} />
                </TouchableOpacity>
              </View>

              {/* EXERCISE PREVIEW */}
              <View style={{ marginTop: 12 }}>
                {(workout.exercises || []).slice(0, 2).map((ex, i) => (
                  <Text
                    key={i}
                    variant="bodySmall"
                    numberOfLines={1}
                    style={{ color: theme.colors.onSurfaceVariant, marginBottom: 2 }}
                  >
                    • {ex.name}
                  </Text>
                ))}

                {workout.exercises?.length > 2 && (
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }}>
                    + {workout.exercises.length - 2} more exercises
                  </Text>
                )}
              </View>

              {/* STATS */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 16,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Dumbbell size={18} color={theme.colors.onSurfaceVariant} />
                  <Text style={{ marginLeft: 6, color: theme.colors.onSurfaceVariant }}>
                    {workout.totalExercises ?? workout.exercises?.length ?? '--'} ex
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Clock size={18} color={theme.colors.onSurfaceVariant} />
                  <Text style={{ marginLeft: 6, color: theme.colors.onSurfaceVariant }}>
                    {workout.estimatedTime ?? '--'}m
                  </Text>
                </View>
              </View>

              {/* Difficulty + Equipment */}
              <View style={{ marginTop: 12 }}>
                <Text
                  variant="labelSmall"
                  style={{
                    color: theme.colors.primary,
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}
                >
                  {workout.difficulty} • {workout.equipmentType === 'with' ? 'Equipment' : 'Bodyweight'}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Favourites;
