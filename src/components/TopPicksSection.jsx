import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { TrendingUp, Star, Clock, Dumbbell } from 'lucide-react-native';
import { exerciseAPI } from '../api/exerciseAPI';

const TopPicksSection = ({ navigation }) => {
  const theme = useTheme();
  const [topPicks, setTopPicks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTopPicks();
  }, []);

  const loadTopPicks = async () => {
    try {
      setIsLoading(true);
      const workoutSets = await exerciseAPI.getTopPicks();
      setTopPicks(workoutSets);
    } catch (error) {
      console.error('Error loading top picks:', error);
      // Fallback to some default workout sets
      setTopPicks(getFallbackTopPicks());
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackTopPicks = () => {
    return [
      {
        id: 'top-pick-1',
        setName: 'Full Body Blast',
        exercises: [
          { name: 'Push-ups', sets: 3, reps: '12-15' },
          { name: 'Bodyweight Squats', sets: 3, reps: '15-20' },
          { name: 'Plank', sets: 3, reps: '30s' },
          { name: 'Lunges', sets: 3, reps: '10-12' }
        ],
        totalExercises: 4,
        estimatedTime: 20,
        muscle: 'full',
        difficulty: 'beginner',
        equipmentType: 'without'
      },
      {
        id: 'top-pick-2',
        setName: 'Upper Body Strength',
        exercises: [
          { name: 'Push-ups', sets: 4, reps: '8-12' },
          { name: 'Tricep Dips', sets: 3, reps: '10-15' },
          { name: 'Plank', sets: 3, reps: '45s' },
          { name: 'Shoulder Taps', sets: 3, reps: '20' }
        ],
        totalExercises: 4,
        estimatedTime: 25,
        muscle: 'upper',
        difficulty: 'intermediate',
        equipmentType: 'without'
      },
      {
        id: 'top-pick-3',
        setName: 'Core Crusher',
        exercises: [
          { name: 'Plank', sets: 3, reps: '45s' },
          { name: 'Russian Twists', sets: 3, reps: '20' },
          { name: 'Leg Raises', sets: 3, reps: '15' },
          { name: 'Mountain Climbers', sets: 3, reps: '30s' }
        ],
        totalExercises: 4,
        estimatedTime: 18,
        muscle: 'core',
        difficulty: 'intermediate',
        equipmentType: 'without'
      }
    ];
  };

  const startWorkout = (workoutSet) => {
    navigation.navigate('WorkoutSession', {
      equipmentType: workoutSet.equipmentType || 'without',
      muscle: workoutSet.muscle || 'full',
      difficulty: workoutSet.difficulty || 'beginner',
      workoutSet: workoutSet
    });
  };

  if (isLoading) {
    return (
      <Card style={{ margin: 8 }}>
        <Card.Content>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
              Top Picks
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Star color={theme.colors.warning} size={16} fill={theme.colors.warning} />
              <TrendingUp color={theme.colors.onSurfaceVariant} size={20} />
            </View>
          </View>
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 12 }}>
              Loading top workouts...
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  }

  if (topPicks.length === 0) {
    return (
      <Card style={{ margin: 8 }}>
        <Card.Content>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
              Top Picks
            </Text>
            <TrendingUp color={theme.colors.onSurfaceVariant} size={20} />
          </View>
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <TrendingUp color={theme.colors.onSurfaceVariant} size={48} />
            <Text style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 12, marginBottom: 16 }}>
              No workout sets available.{'\n'}Check back later for new workouts!
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={{ margin: 8 }}>
      <Card.Content>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
            Top Picks
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Star color={theme.colors.warning} size={16} fill={theme.colors.warning} />
            <TrendingUp color={theme.colors.onSurfaceVariant} size={20} />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 12, paddingRight: 16 }}>
            {topPicks.map((workoutSet, index) => (
              <TouchableOpacity 
                key={workoutSet.id} 
                onPress={() => startWorkout(workoutSet)}
                activeOpacity={0.8}
              >
                <Card style={{ width: 200, backgroundColor: theme.colors.surfaceVariant }}>
                  <Card.Content>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <View style={{ 
                        backgroundColor: theme.colors.primary, 
                        borderRadius: 12, 
                        width: 24, 
                        height: 24, 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginRight: 8
                      }}>
                        <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                          {index + 1}
                        </Text>
                      </View>
                      <Text 
                        variant="labelSmall" 
                        style={{ 
                          color: theme.colors.onSurfaceVariant, 
                          textTransform: 'capitalize',
                          flex: 1
                        }}
                        numberOfLines={1}
                      >
                        {workoutSet.muscle || 'full body'}
                      </Text>
                    </View>
                    
                    <Text 
                      variant="titleMedium" 
                      style={{ 
                        color: theme.colors.onSurface, 
                        marginBottom: 8, 
                        fontWeight: 'bold',
                        lineHeight: 22
                      }}
                      numberOfLines={2}
                    >
                      {workoutSet.setName || `Workout ${index + 1}`}
                    </Text>

                    {/* Exercise Preview */}
                    <View style={{ marginBottom: 12 }}>
                      {workoutSet.exercises.slice(0, 2).map((exercise, exIndex) => (
                        <Text 
                          key={exIndex}
                          variant="bodySmall" 
                          style={{ 
                            color: theme.colors.onSurfaceVariant,
                            marginBottom: 2
                          }}
                          numberOfLines={1}
                        >
                          • {exercise.name}
                        </Text>
                      ))}
                      {workoutSet.exercises.length > 2 && (
                        <Text 
                          variant="bodySmall" 
                          style={{ 
                            color: theme.colors.onSurfaceVariant,
                            fontStyle: 'italic'
                          }}
                        >
                          +{workoutSet.exercises.length - 2} more exercises
                        </Text>
                      )}
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Dumbbell size={14} color={theme.colors.onSurfaceVariant} />
                        <Text 
                          variant="labelSmall" 
                          style={{ 
                            color: theme.colors.onSurfaceVariant,
                            marginLeft: 4
                          }}
                        >
                          {workoutSet.totalExercises} ex
                        </Text>
                      </View>
                      
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Clock size={14} color={theme.colors.onSurfaceVariant} />
                        <Text 
                          variant="labelSmall" 
                          style={{ 
                            color: theme.colors.onSurfaceVariant,
                            marginLeft: 4
                          }}
                        >
                          {workoutSet.estimatedTime}m
                        </Text>
                      </View>
                    </View>

                    <View style={{ marginTop: 8 }}>
                      <Text 
                        variant="labelSmall" 
                        style={{ 
                          color: theme.colors.primary,
                          textTransform: 'capitalize',
                          fontWeight: '500'
                        }}
                      >
                        {workoutSet.difficulty} • {workoutSet.equipmentType === 'with' ? 'Equipment' : 'Bodyweight'}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Card.Content>
    </Card>
  );
};

export default TopPicksSection;