import { Clock, Dumbbell, Heart, Play } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip, Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { exerciseAPI } from '../../api/exerciseAPI';
import { setError } from '../../redux/exerciseSlice';
import { addWorkoutToFavourites, removeWorkoutFromFavourites } from '../../redux/favouritesSlice';

const WorkoutSetSelection = ({ route, navigation }) => {
  const { equipmentType, muscle, difficulty, workoutSets: passedWorkoutSets } = route.params || {};
  const [workoutSets, setWorkoutSets] = useState(passedWorkoutSets || []);
  const [isLoading, setIsLoading] = useState(!passedWorkoutSets);
  const [selectedSet, setSelectedSet] = useState(null);
  
  const theme = useTheme();
  const dispatch = useDispatch();
  const { favouriteWorkouts } = useSelector(state => state.favourites);

  useEffect(() => {
    if (!passedWorkoutSets) {
      loadWorkoutSets();
    }
  }, []);

  const loadWorkoutSets = async () => {
    try {
      setIsLoading(true);
      const sets = await exerciseAPI.getExercisesByEquipment(muscle, difficulty, equipmentType);
      setWorkoutSets(sets);
    } catch (error) {
      console.error('Error loading workout sets:', error);
      dispatch(setError('Failed to load workout sets. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const isWorkoutFavourite = (workoutId) => {
    return favouriteWorkouts.some(workout => workout.id === workoutId);
  };

  const toggleFavourite = (workoutSet) => {
    if (isWorkoutFavourite(workoutSet.id)) {
      dispatch(removeWorkoutFromFavourites(workoutSet.id));
    } else {
      // include context (equipmentType, muscle, difficulty) so favourites show full info
      const favouritePayload = {
        ...workoutSet,
        equipmentType,
        muscle,
        difficulty,
      };
      dispatch(addWorkoutToFavourites(favouritePayload));
    }
  };

  const startWorkout = (workoutSet) => {
    navigation.navigate('WorkoutSession', {
      equipmentType,
      muscle,
      difficulty,
      workoutSet
    });
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16, color: theme.colors.onSurfaceVariant }}>Loading workout sets...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.onSurface, marginBottom: 16 }}>
          Available Workout Sets ({workoutSets.length})
        </Text>

        {workoutSets.map((workoutSet, index) => (
          <TouchableOpacity 
            key={workoutSet.id}
            onPress={() => setSelectedSet(selectedSet?.id === workoutSet.id ? null : workoutSet)}
            activeOpacity={0.8}
          >
            <Card style={{ 
              marginBottom: 16, 
              borderColor: selectedSet?.id === workoutSet.id ? theme.colors.primary : 'transparent',
              borderWidth: selectedSet?.id === workoutSet.id ? 2 : 0
            }}>
              <Card.Content>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.onSurface, marginBottom: 4 }}>
                      {workoutSet.setName || `Workout Set ${index + 1}`}
                    </Text>
                    {workoutSet.setDescription && (
                      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                        {workoutSet.setDescription}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => toggleFavourite(workoutSet)}>
                    <Heart 
                      size={24} 
                      color={isWorkoutFavourite(workoutSet.id) ? '#EF4444' : theme.colors.onSurfaceVariant}
                      fill={isWorkoutFavourite(workoutSet.id) ? '#EF4444' : 'transparent'}
                    />
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Dumbbell size={16} color={theme.colors.onSurfaceVariant} />
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
                      {workoutSet.totalExercises} exercises
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Clock size={16} color={theme.colors.onSurfaceVariant} />
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
                      {workoutSet.estimatedTime} min
                    </Text>
                  </View>
                  <Chip 
                    mode="outlined" 
                    compact
                    style={{ backgroundColor: theme.colors.surfaceVariant }}
                    textStyle={{ fontSize: 12 }}
                  >
                    {workoutSet.setFocus || 'Standard'}
                  </Chip>
                </View>

                {selectedSet?.id === workoutSet.id && (
                  <View style={{ marginTop: 12 }}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface, marginBottom: 8 }}>
                      Exercises:
                    </Text>
                    {workoutSet.exercises.map((exercise, exIndex) => (
                      <View key={exercise.id} style={{ 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        paddingVertical: 8,
                        borderBottomWidth: exIndex < workoutSet.exercises.length - 1 ? 1 : 0,
                        borderBottomColor: theme.colors.outline
                      }}>
                        <View style={{ 
                          backgroundColor: theme.colors.primary, 
                          borderRadius: 12, 
                          width: 24, 
                          height: 24, 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          marginRight: 12
                        }}>
                          <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                            {exIndex + 1}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                            {exercise.name}
                          </Text>
                          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                            {exercise.sets} sets × {exercise.reps}
                          </Text>
                        </View>
                      </View>
                    ))}
                    
                    <Button
                      mode="contained"
                      onPress={() => startWorkout(workoutSet)}
                      icon={Play}
                      style={{ marginTop: 16 }}
                      contentStyle={{ flexDirection: 'row-reverse' }}
                    >
                      Start This Workout
                    </Button>
                  </View>
                )}
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}

        {workoutSets.length === 0 && (
          <Card style={{ marginBottom: 16 }}>
            <Card.Content style={{ alignItems: 'center', paddingVertical: 32 }}>
              <Dumbbell size={48} color={theme.colors.onSurfaceVariant} />
              <Text variant="titleLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 16, marginBottom: 8, textAlign: 'center' }}>
                No Workouts Available
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginBottom: 20 }}>
                Try selecting different muscle group or difficulty level
              </Text>
              <Button 
                mode="outlined" 
                onPress={() => navigation.goBack()}
              >
                Go Back
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

export default WorkoutSetSelection;