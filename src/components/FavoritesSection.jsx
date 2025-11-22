// src/components/FavoritesSection.jsx
import { Clock, Dumbbell, Heart } from 'lucide-react-native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

const FavoritesSection = ({ navigation }) => {
  const theme = useTheme();
  const { favouriteExercises, favouriteWorkouts } = useSelector(state => state.favourites);

  if (favouriteExercises.length === 0 && (!favouriteWorkouts || favouriteWorkouts.length === 0)) {
    return (
      <Card style={{ margin: 8 }}>
        <Card.Content>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
              Favorites
            </Text>
            <Heart color={theme.colors.onSurfaceVariant} size={20} />
          </View>
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <Heart color={theme.colors.onSurfaceVariant} size={48} />
            <Text style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 12, marginBottom: 16 }}>
              No favorite exercises yet.{'\n'}Start adding some from the workout section!
            </Text>
            <Button 
              mode="outlined" 
              onPress={() => navigation.navigate('WorkoutTab')}
              icon={Dumbbell}
            >
              Browse Exercises
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={{ margin: 8 }}>
      <Card.Content>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Heart color={theme.colors.error} size={20} />
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
              Favorites
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Button mode="text" onPress={() => navigation.navigate('FavouritesTab', { screen: 'Favourites' })} compact>
              See more
            </Button>
          </View>
        </View>

        {/* Favorite Workouts - horizontal cards like TopPicks */}
        {favouriteWorkouts && favouriteWorkouts.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 12, paddingRight: 16 }}>
              {favouriteWorkouts.slice(0, 5).map((workout, index) => (
                <TouchableOpacity
                  key={workout.id}
                  onPress={() => navigation.navigate('WorkoutSession', { workoutSet: workout })}
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
                          <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{index + 1}</Text>
                        </View>
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, textTransform: 'capitalize', flex: 1 }} numberOfLines={1}>
                          {workout.muscle || 'full body'}
                        </Text>
                      </View>

                      <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 8, fontWeight: 'bold', lineHeight: 22 }} numberOfLines={2}>
                        {workout.setName || workout.name || 'Workout'}
                      </Text>

                      {/* Exercise preview (if available) */}
                      <View style={{ marginBottom: 12 }}>
                        {(workout.exercises || []).slice(0, 2).map((ex, exIndex) => (
                          <Text key={exIndex} variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 2 }} numberOfLines={1}>
                            • {ex.name}
                          </Text>
                        ))}
                        {workout.exercises && workout.exercises.length > 2 && (
                          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, fontStyle: 'italic' }}>+{workout.exercises.length - 2} more exercises</Text>
                        )}
                      </View>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Dumbbell size={14} color={theme.colors.onSurfaceVariant} />
                          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>{workout.totalExercises ?? workout.exercises?.length ?? '--'} ex</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Clock size={14} color={theme.colors.onSurfaceVariant} />
                          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>{workout.estimatedTime ?? '--'}m</Text>
                        </View>
                      </View>

                      <View style={{ marginTop: 8 }}>
                        <Text variant="labelSmall" style={{ color: theme.colors.primary, textTransform: 'capitalize', fontWeight: '500' }}>
                          {workout.difficulty} • {workout.equipmentType === 'with' ? 'Equipment' : 'Bodyweight'}
                        </Text>
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {/* Favorite Exercises - horizontal cards (compact) */}
        {favouriteExercises && favouriteExercises.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: 'bold', marginBottom: 8 }}>Favorite Exercises</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 12, paddingRight: 16 }}>
                {favouriteExercises.slice(0, 5).map((exercise, idx) => (
                  <TouchableOpacity key={exercise.id} onPress={() => navigation.navigate('ExerciseDetail', { exercise })} activeOpacity={0.8}>
                    <Card style={{ width: 160, backgroundColor: theme.colors.surfaceVariant }}>
                      <Card.Content>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                          <View style={{ backgroundColor: theme.colors.primary, borderRadius: 12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{idx + 1}</Text>
                          </View>
                          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, textTransform: 'capitalize', flex: 1 }} numberOfLines={1}>{exercise.muscle}</Text>
                        </View>
                        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 8, fontWeight: 'bold', lineHeight: 22 }} numberOfLines={2}>{exercise.name}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>{exercise.difficulty}</Text>
                          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>{exercise.equipment}</Text>
                        </View>
                      </Card.Content>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

export default FavoritesSection;