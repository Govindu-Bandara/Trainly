import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme, Card, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Trash2, Save } from 'lucide-react-native';
import { addCustomPlan } from '../../redux/planSlice';

const PlanBuilder = ({ route, navigation }) => {
  const { selectedExercise } = route.params || {};
  const [planTitle, setPlanTitle] = useState('');
  const [exercises, setExercises] = useState(selectedExercise ? [{
    id: '1',
    name: selectedExercise.name,
    sets: 3,
    reps: 12,
    rest: '60s'
  }] : []);
  const theme = useTheme();
  const dispatch = useDispatch();

  const addExercise = () => {
    setExercises([...exercises, {
      id: Date.now().toString(),
      name: '',
      sets: 3,
      reps: 12,
      rest: '60s'
    }]);
  };

  const removeExercise = (id) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const updateExercise = (id, field, value) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const savePlan = () => {
    if (!planTitle.trim()) {
      alert('Error', 'Please enter a plan title');
      return;
    }

    if (exercises.length === 0) {
      alert('Error', 'Please add at least one exercise');
      return;
    }

    const newPlan = {
      id: Date.now().toString(),
      title: planTitle,
      exercises: exercises,
      createdAt: new Date().toISOString(),
    };

    dispatch(addCustomPlan(newPlan));
    alert('Success', 'Workout plan saved successfully!');
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <Card style={{ margin: 16 }}>
        <Card.Content>
          <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: theme.colors.onSurface, marginBottom: 8 }}>
            Build Workout Plan
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Create your custom workout routine
          </Text>
        </Card.Content>
      </Card>

      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        {/* Plan Title */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Content>
            <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.onSurface, marginBottom: 12 }}>
              Plan Title
            </Text>
            <TextInput
              placeholder="Enter plan title (e.g., Leg Day Routine)"
              value={planTitle}
              onChangeText={setPlanTitle}
              mode="outlined"
            />
          </Card.Content>
        </Card>

        {/* Exercises */}
        <Card>
          <Card.Content>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
                Exercises ({exercises.length})
              </Text>
              <Button
                mode="contained"
                onPress={addExercise}
                icon={Plus}
                compact
              >
                Add Exercise
              </Button>
            </View>

            {exercises.map((exercise, index) => (
              <Card key={exercise.id} style={{ backgroundColor: theme.colors.surfaceVariant, marginBottom: 12 }}>
                <Card.Content>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
                      Exercise {index + 1}
                    </Text>
                    <Button
                      mode="text"
                      onPress={() => removeExercise(exercise.id)}
                      icon={Trash2}
                      textColor={theme.colors.error}
                      compact
                    >
                      Remove
                    </Button>
                  </View>

                  {/* Exercise Name */}
                  <TextInput
                    placeholder="Exercise name"
                    value={exercise.name}
                    onChangeText={(value) => updateExercise(exercise.id, 'name', value)}
                    mode="outlined"
                    style={{ marginBottom: 12 }}
                  />

                  {/* Sets and Reps */}
                  <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4 }}>
                        Sets
                      </Text>
                      <TextInput
                        placeholder="3"
                        value={exercise.sets.toString()}
                        onChangeText={(value) => updateExercise(exercise.id, 'sets', parseInt(value) || 0)}
                        keyboardType="numeric"
                        mode="outlined"
                        style={{ textAlign: 'center' }}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4 }}>
                        Reps
                      </Text>
                      <TextInput
                        placeholder="12"
                        value={exercise.reps.toString()}
                        onChangeText={(value) => updateExercise(exercise.id, 'reps', value)}
                        mode="outlined"
                        style={{ textAlign: 'center' }}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4 }}>
                        Rest
                      </Text>
                      <TextInput
                        placeholder="60s"
                        value={exercise.rest}
                        onChangeText={(value) => updateExercise(exercise.id, 'rest', value)}
                        mode="outlined"
                        style={{ textAlign: 'center' }}
                      />
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Save Button */}
      <Card style={{ margin: 16 }}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={savePlan}
            icon={Save}
            contentStyle={{ paddingVertical: 8 }}
          >
            Save Workout Plan
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

export default PlanBuilder;