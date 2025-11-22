// src/screens/Workout/WorkoutList.jsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Button, useTheme, Card } from 'react-native-paper';
import { Dumbbell, User } from 'lucide-react-native';

const WorkoutList = ({ navigation }) => {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <View style={{ padding: 16, backgroundColor: theme.colors.surface }}>
        <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface, marginBottom: 8 }}>
          Strength Training
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Choose your workout type
        </Text>
      </View>

      {/* Workout Type Selection */}
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.onSurface, marginBottom: 16 }}>
          Start a Workout
        </Text>
        
        <View style={{ gap: 16 }}>
          {/* With Equipment Card */}
          <Card>
            <Card.Content style={{ alignItems: 'center', padding: 24 }}>
              <Dumbbell size={48} color={theme.colors.primary} />
              <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.onSurface, marginTop: 16, marginBottom: 8, textAlign: 'center' }}>
                With Equipment
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginBottom: 20 }}>
                Barbells, dumbbells, machines
              </Text>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('WorkoutSelection', { equipmentType: 'with' })}
                style={{ width: '100%' }}
              >
                Get Started
              </Button>
            </Card.Content>
          </Card>

          {/* Body Only Card */}
          <Card>
            <Card.Content style={{ alignItems: 'center', padding: 24 }}>
              <User size={48} color={theme.colors.primary} />
              <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.onSurface, marginTop: 16, marginBottom: 8, textAlign: 'center' }}>
                Without Equipment
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginBottom: 20 }}>
                No equipment needed
              </Text>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('WorkoutSelection', { equipmentType: 'without' })}
                style={{ width: '100%' }}
              >
                Get Started
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

export default WorkoutList;