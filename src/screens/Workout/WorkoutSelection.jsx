import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Button, useTheme, Card, Chip, ActivityIndicator } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { exerciseAPI } from '../../api/exerciseAPI';
import { setLoading, setError } from '../../redux/exerciseSlice';

const WorkoutSelection = ({ route, navigation }) => {
  const { equipmentType } = route.params || {};
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const theme = useTheme();
  const dispatch = useDispatch();

  const muscleGroups = [
    { id: 'chest', name: 'Chest' },
    { id: 'back', name: 'Back' },
    { id: 'legs', name: 'Legs' },
    { id: 'shoulders', name: 'Shoulders' },
    { id: 'biceps', name: 'Biceps' },
    { id: 'triceps', name: 'Triceps' },
    { id: 'abdominals', name: 'Abs' },
  ];

  const difficultyLevels = [
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  const handleStartWorkout = async () => {
    if (selectedMuscle && selectedDifficulty) {
      setIsLoading(true);
      try {
        const workoutSets = await exerciseAPI.getExercisesByEquipment(
          selectedMuscle, 
          selectedDifficulty, 
          equipmentType
        );
        
        if (workoutSets.length > 0) {
          // Navigate to WorkoutSetSelection instead of directly to WorkoutSession
          navigation.navigate('WorkoutSetSelection', {
            equipmentType,
            muscle: selectedMuscle,
            difficulty: selectedDifficulty,
            workoutSets: workoutSets // Pass all workout sets
          });
        } else {
          dispatch(setError('No exercises found for your selection. Please try different options.'));
        }
      } catch (error) {
        console.error('Error starting workout:', error);
        dispatch(setError('Failed to load workout. Please try again.'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <Card style={{ margin: 16 }}>
        <Card.Content>
          <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: theme.colors.onSurface, marginBottom: 4 }}>
            Build Your Workout
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {equipmentType === 'with' ? 'With Equipment' : 'Body Only'}
          </Text>
        </Card.Content>
      </Card>

      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        {/* Muscle Group Selection */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.onSurface, marginBottom: 12 }}>
              1. Target Muscle Group
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {muscleGroups.map(muscle => (
                <Chip
                  key={muscle.id}
                  selected={selectedMuscle === muscle.id}
                  onPress={() => setSelectedMuscle(muscle.id)}
                  mode={selectedMuscle === muscle.id ? 'flat' : 'outlined'}
                  style={{ marginBottom: 8 }}
                >
                  {muscle.name}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Difficulty Selection */}
        {selectedMuscle && (
          <Card style={{ marginBottom: 16 }}>
            <Card.Content>
              <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.onSurface, marginBottom: 12 }}>
                2. Your Experience Level
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {difficultyLevels.map(level => (
                  <Chip
                    key={level.id}
                    selected={selectedDifficulty === level.id}
                    onPress={() => setSelectedDifficulty(level.id)}
                    mode={selectedDifficulty === level.id ? 'flat' : 'outlined'}
                    style={{ marginBottom: 8 }}
                  >
                    {level.name}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Start Workout Button */}
        {selectedMuscle && selectedDifficulty && (
          <Card style={{ marginBottom: 32 }}>
            <Card.Content>
              {isLoading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
              ) : (
                <>
                  <Button
                    mode="contained"
                    onPress={handleStartWorkout}
                    style={{ marginBottom: 8 }}
                    contentStyle={{ paddingVertical: 8 }}
                    disabled={isLoading}
                  >
                    View Workout Sets
                  </Button>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
                    {selectedMuscle} • {selectedDifficulty} • {equipmentType === 'with' ? 'Equipment' : 'Bodyweight'}
                  </Text>
                </>
              )}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

export default WorkoutSelection;