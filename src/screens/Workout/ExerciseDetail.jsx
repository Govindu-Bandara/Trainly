import { Heart, Play, Plus, Share2 } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Card, Chip, Divider, Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { addExerciseToFavourites, removeExerciseFromFavourites } from '../../redux/favouritesSlice';

const ExerciseDetail = ({ route, navigation }) => {
  const { exercise } = route.params;
  const [isExpanded, setIsExpanded] = useState(false);
  const { favouriteExercises } = useSelector(state => state.favourites);
  const theme = useTheme();
  const dispatch = useDispatch();

  const isFavourite = favouriteExercises.some(fav => fav.id === exercise.id);

  const toggleFavourite = () => {
    if (isFavourite) {
      dispatch(removeExerciseFromFavourites(exercise.id));
    } else {
      dispatch(addExerciseToFavourites(exercise));
    }
  };

  const shareExercise = async () => {
    // Share functionality would go here
    console.log('Share exercise:', exercise.name);
  };

  const addToPlan = () => {
    navigation.navigate('PlanBuilder', { selectedExercise: exercise });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header Image Placeholder */}
      <Card style={{ margin: 16 }}>
        <Card.Cover 
          source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b' }} 
          style={{ height: 200 }}
        />
      </Card>

      {/* Exercise Info */}
      <View style={{ padding: 16 }}>
        <Card>
          <Card.Content>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: theme.colors.onSurface, flex: 1, marginRight: 16 }}>
                {exercise.name}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button
                  mode="outlined"
                  icon={() => <Heart color={isFavourite ? theme.colors.error : theme.colors.onSurface} size={18} />}
                  onPress={toggleFavourite}
                  compact
                  buttonColor={isFavourite ? theme.colors.errorContainer : undefined}
                  textColor={isFavourite ? theme.colors.onErrorContainer : undefined}
                />
                <Button
                  mode="outlined"
                  icon={() => <Share2 color={theme.colors.onSurfaceVariant} size={18} />}
                  onPress={shareExercise}
                  compact
                />
              </View>
            </View>

            {/* Exercise Meta */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              <Chip mode="flat" buttonColor={theme.colors.primaryContainer}>
                {exercise.muscle}
              </Chip>
              <Chip mode="flat" buttonColor={theme.colors.secondaryContainer}>
                {exercise.equipment}
              </Chip>
              <Chip mode="flat" buttonColor={theme.colors.tertiaryContainer}>
                {exercise.difficulty}
              </Chip>
            </View>

            <Divider style={{ marginBottom: 16 }} />

            {/* Instructions */}
            <View style={{ marginBottom: 16 }}>
              <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.onSurface, marginBottom: 12 }}>
                Instructions
              </Text>
              <Text 
                variant="bodyMedium" 
                style={{ color: theme.colors.onSurfaceVariant, lineHeight: 24 }}
                numberOfLines={isExpanded ? undefined : 4}
              >
                {exercise.instructions || 'No instructions available for this exercise.'}
              </Text>
              {exercise.instructions && exercise.instructions.length > 200 && (
                <Button
                  mode="text"
                  onPress={() => setIsExpanded(!isExpanded)}
                  style={{ alignSelf: 'flex-start', marginTop: 8 }}
                >
                  {isExpanded ? 'Show Less' : 'Read More'}
                </Button>
              )}
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button
                mode="contained"
                onPress={addToPlan}
                icon={Plus}
                style={{ flex: 1 }}
                contentStyle={{ flexDirection: 'row-reverse' }}
              >
                Add to Plan
              </Button>
              
              <Button
                mode="outlined"
                icon={Play}
                style={{ flex: 1 }}
                contentStyle={{ flexDirection: 'row-reverse' }}
              >
                Demo
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Related Exercises */}
        <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.onSurface, marginTop: 24, marginBottom: 16 }}>
          Related Exercises
        </Text>
        
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {[1, 2, 3].map((item) => (
            <Card key={item} style={{ flex: 1 }}>
              <Card.Cover 
                source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b' }} 
                style={{ height: 80 }}
              />
              <Card.Content style={{ padding: 12 }}>
                <Text variant="bodyMedium" style={{ textAlign: 'center', fontWeight: 'bold', color: theme.colors.onSurface }}>
                  Related {item}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ExerciseDetail;