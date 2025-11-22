import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Button, useTheme, Card, Divider } from 'react-native-paper';
import { CheckCircle, Home, Activity, Award, Clock } from 'lucide-react-native';

const WorkoutComplete = ({ route, navigation }) => {
  const { 
    exercisesCompleted, 
    workoutType, 
    equipmentType, 
    totalTime,
    workoutSet,
    completedEarly,
    actualTime
  } = route.params || {};
  
  const theme = useTheme();

  const calculateCalories = (timeMinutes, difficulty) => {
    const baseCalories = {
      beginner: 5,
      intermediate: 7,
      advanced: 9
    };
    const multiplier = baseCalories[difficulty] || 6;
    return Math.round(timeMinutes * multiplier);
  };

  const formatDetailedTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };

  const difficulty = workoutType?.split(' ')[1] || 'intermediate';
  const calories = calculateCalories(totalTime || 25, difficulty);
  const displayTime = actualTime ? formatDetailedTime(actualTime) : `${totalTime || 25} minutes`;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Success Header */}
      <Card style={{ margin: 16, backgroundColor: theme.colors.primaryContainer }}>
        <Card.Content style={{ alignItems: 'center', paddingVertical: 32 }}>
          <CheckCircle size={64} color={theme.colors.primary} />
          <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onPrimaryContainer, marginTop: 16, marginBottom: 8 }}>
            Workout Complete!
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center' }}>
            {completedEarly ? 'Workout completed early - great effort!' : 'Great job completing your workout!'}
          </Text>
        </Card.Content>
      </Card>

      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        {/* Workout Summary */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.onSurface, marginBottom: 16 }}>
              Workout Summary
            </Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 }}>
              <View style={{ alignItems: 'center' }}>
                <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                  {exercisesCompleted || 0}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Exercises
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Clock size={16} color={theme.colors.primary} style={{ marginRight: 4 }} />
                  <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                    {totalTime || 25}
                  </Text>
                </View>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Minutes
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                  {calories}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Calories
                </Text>
              </View>
            </View>

            <View style={{ alignItems: 'center', marginBottom: 8 }}>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Actual time: {displayTime}
              </Text>
            </View>

            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
              {workoutType || 'Strength Training'} • {equipmentType === 'with' ? 'Equipment' : 'Bodyweight'}
            </Text>
          </Card.Content>
        </Card>

        {/* Completed Exercises */}
        {workoutSet?.exercises && (
          <Card style={{ marginBottom: 16 }}>
            <Card.Content>
              <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface, marginBottom: 12 }}>
                Exercises Completed
              </Text>
              {workoutSet.exercises.slice(0, exercisesCompleted).map((exercise, index) => (
                <View key={exercise.id || index}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
                    <View style={{ flex: 1 }}>
                      <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                        {exercise.name}
                      </Text>
                      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                        {exercise.sets} sets × {exercise.reps}
                      </Text>
                    </View>
                    <Award size={20} color={theme.colors.primary} />
                  </View>
                  {index < exercisesCompleted - 1 && <Divider />}
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('HomeTab')}
            icon={Home}
            style={{ flex: 1 }}
            contentStyle={{ flexDirection: 'row-reverse' }}
          >
            Home
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('WorkoutList')}
            icon={Activity}
            style={{ flex: 1 }}
            contentStyle={{ flexDirection: 'row-reverse' }}
          >
            New Workout
          </Button>
        </View>

        {/* Motivation */}
        <Card style={{ marginBottom: 32 }}>
          <Card.Content>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', fontStyle: 'italic' }}>
              "The only bad workout is the one that didn't happen."
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

export default WorkoutComplete;