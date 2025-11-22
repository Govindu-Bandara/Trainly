import React from 'react';
import { View, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Text } from 'react-native-paper';
import { Activity, Dumbbell } from 'lucide-react-native';
import Header from '../components/Header';
import QuoteSection from '../components/QuoteSection';
import CategoryCard from '../components/CategoryCard';
import FavoritesSection from '../components/FavoritesSection';
import TopPicksSection from '../components/TopPicksSection';

export default function HomeScreen({ navigation }) {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header />
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 8 }}>
          {/* Quote Section */}
          <View style={{ marginBottom: 24 }}>
            <QuoteSection />
          </View>

          {/* Categories */}
          <View style={{ marginBottom: 24 }}>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, marginBottom: 16, marginHorizontal: 8 }}>
              Workout Categories
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
              <CategoryCard
                title="Cardio"
                description="Boost your heart rate and burn calories"
                imageUrl="https://images.unsplash.com/photo-1552674605-db6ffd4facb5"
                icon={<Activity color={theme.colors.onPrimary} size={20} />}
                onPress={() => navigation.navigate('CardioTab')}
              />
              <CategoryCard
                title="Strength Training"
                description="Build strength with targeted programs"
                imageUrl="https://images.unsplash.com/photo-1558611848-73f7eb4001a1"
                icon={<Dumbbell color={theme.colors.onPrimary} size={20} />}
                onPress={() => navigation.navigate('WorkoutTab')}
              />
            </View>
          </View>

          {/* Favorites */}
          <View style={{ marginBottom: 24 }}>
            <FavoritesSection navigation={navigation} />
          </View>

          {/* Top Picks */}
          <View>
            <TopPicksSection navigation={navigation} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}