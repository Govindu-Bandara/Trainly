import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Button, useTheme, Card, ProgressBar } from 'react-native-paper';
import { Play, Pause, CheckCircle, SkipForward } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { completeExercise } from '../../redux/exerciseSlice';

const WorkoutSession = ({ route, navigation }) => {
  const { equipmentType, muscle, difficulty, workoutSet } = route.params || {};
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [workoutStartTime] = useState(Date.now());
  const [totalWorkoutTime, setTotalWorkoutTime] = useState(0);
  
  const theme = useTheme();
  const dispatch = useDispatch();
  const timerRef = useRef(null);
  const workoutTimerRef = useRef(null);

  const exercises = workoutSet?.exercises || [];
  const currentExercise = exercises[currentExerciseIndex];
  const isBodyweight = equipmentType === 'without';
  const totalSets = currentExercise?.sets || 1;

  useEffect(() => {
    // Start workout timer
    workoutTimerRef.current = setInterval(() => {
      setTotalWorkoutTime(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (workoutTimerRef.current) {
        clearInterval(workoutTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const startExercise = () => {
    if (isBodyweight) {
      setTimeLeft(currentExercise.duration);
    } else {
      setTimeLeft(0);
    }
    setIsActive(true);
  };

  const startRestPeriod = () => {
    const restTime = parseInt(currentExercise.rest) || 60;
    setTimeLeft(restTime);
    setIsResting(true);
    setIsActive(true);
  };

  const handleTimerComplete = () => {
    setIsActive(false);
    
    if (isResting) {
      setIsResting(false);
      if (currentSet < totalSets) {
        setCurrentSet(currentSet + 1);
      } else {
        completeCurrentExercise();
      }
    } else if (isBodyweight) {
      if (currentSet < totalSets) {
        startRestPeriod();
      } else {
        completeCurrentExercise();
      }
    }
  };

  const completeCurrentExercise = () => {
    const exerciseId = currentExercise.id || currentExercise.name;
    setCompletedExercises(prev => [...prev, exerciseId]);
    dispatch(completeExercise({ exerciseId, workoutId: workoutSet.id }));
    
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet(1);
      setIsActive(false);
      setIsResting(false);
    } else {
      const finalTime = Math.round(totalWorkoutTime / 60);
      if (workoutTimerRef.current) {
        clearInterval(workoutTimerRef.current);
      }
      navigation.navigate('WorkoutComplete', {
        exercisesCompleted: exercises.length,
        workoutType: `${muscle} ${difficulty}`,
        equipmentType,
        totalTime: finalTime,
        workoutSet,
        actualTime: totalWorkoutTime
      });
    }
  };

  const completeSet = () => {
    if (currentSet < totalSets) {
      startRestPeriod();
    } else {
      completeCurrentExercise();
    }
  };

  const skipRest = () => {
    setIsActive(false);
    setIsResting(false);
    if (currentSet < totalSets) {
      setCurrentSet(currentSet + 1);
    } else {
      completeCurrentExercise();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatWorkoutTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = (currentExerciseIndex + 1) / exercises.length;

  if (!currentExercise) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <Text variant="titleLarge">No exercises found</Text>
        <Button onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Progress Header */}
      <Card style={{ margin: 16 }}>
        <Card.Content>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
              Exercise {currentExerciseIndex + 1} of {exercises.length}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {formatWorkoutTime(totalWorkoutTime)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {muscle} • {difficulty}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Set {currentSet}/{totalSets}
            </Text>
          </View>
          <ProgressBar 
            progress={progress} 
            style={{ height: 8, borderRadius: 4 }}
            color={theme.colors.primary}
          />
        </Card.Content>
      </Card>

      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        {/* Current Exercise */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content style={{ alignItems: 'center' }}>
            <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface, marginBottom: 16, textAlign: 'center' }}>
              {currentExercise.name}
            </Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 24 }}>
              <View style={{ alignItems: 'center' }}>
                <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                  {currentSet}/{totalSets}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Sets
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                  {isBodyweight ? currentExercise.duration + 's' : currentExercise.reps}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  {isBodyweight ? 'Duration' : 'Reps'}
                </Text>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                  {currentExercise.rest}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Rest
                </Text>
              </View>
            </View>

            {/* Timer Display */}
            {(isActive && timeLeft > 0) && (
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                  {isResting ? 'Rest Time' : isBodyweight ? 'Exercise Time' : 'Time Remaining'}
                </Text>
                <Text variant="displayMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                  {formatTime(timeLeft)}
                </Text>
              </View>
            )}

            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginBottom: 24, lineHeight: 24 }}>
              {currentExercise.instructions}
            </Text>

            {/* Control Buttons */}
            <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
              {!isActive && !isResting && (
                <Button
                  mode="contained"
                  onPress={isBodyweight ? startExercise : completeSet}
                  icon={isBodyweight ? Play : CheckCircle}
                  style={{ flex: 1 }}
                  contentStyle={{ flexDirection: 'row-reverse' }}
                >
                  {isBodyweight ? 'Start Exercise' : 'Complete Set'}
                </Button>
              )}
              
              {isActive && isResting && (
                <Button
                  mode="contained"
                  onPress={skipRest}
                  icon={SkipForward}
                  style={{ flex: 1 }}
                  contentStyle={{ flexDirection: 'row-reverse' }}
                >
                  Skip Rest
                </Button>
              )}
              
              {isActive && !isResting && isBodyweight && (
                <Button
                  mode="outlined"
                  onPress={() => setIsActive(false)}
                  icon={Pause}
                  style={{ flex: 1 }}
                  contentStyle={{ flexDirection: 'row-reverse' }}
                >
                  Pause
                </Button>
              )}
              
              <Button
                mode={isActive ? "contained" : "outlined"}
                onPress={completeCurrentExercise}
                icon={CheckCircle}
                style={{ flex: 1 }}
                contentStyle={{ flexDirection: 'row-reverse' }}
              >
                Complete
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Complete Button */}
        <Button
          mode="text"
          onPress={() => {
            Alert.alert(
              'Complete Workout',
              'Are you sure you want to complete the workout early?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Complete', onPress: () => {
                  const finalTime = Math.round(totalWorkoutTime / 60);
                  if (workoutTimerRef.current) {
                    clearInterval(workoutTimerRef.current);
                  }
                  navigation.navigate('WorkoutComplete', {
                    exercisesCompleted: currentExerciseIndex + 1,
                    workoutType: `${muscle} ${difficulty}`,
                    equipmentType,
                    totalTime: finalTime,
                    workoutSet,
                    completedEarly: true,
                    actualTime: totalWorkoutTime
                  });
                }}
              ]
            );
          }}
          style={{ marginBottom: 32 }}
        >
          Complete Workout Early
        </Button>
      </ScrollView>
    </View>
  );
};

export default WorkoutSession;