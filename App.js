import { Rowdies_300Light, Rowdies_400Regular, Rowdies_700Bold, useFonts } from '@expo-google-fonts/rowdies';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { Platform, Text } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider, useDispatch, useSelector } from 'react-redux';

// Import store and slices
import { setFavourites } from './src/redux/favouritesSlice';
import { setCustomPlans, setPredefinedPlans } from './src/redux/planSlice';
import { store } from './src/redux/store';
import { setTheme } from './src/redux/themeSlice';
import { setUser } from './src/redux/userSlice';

// Import utilities and API
import { authAPI } from './src/api/authAPI';
import { predefinedPlans } from './src/utils/dummyPlans';

// Import screens
import CardioSummary from './src/screens/Cardio/CardioSummary';
import CardioTracker from './src/screens/Cardio/CardioTracker';
import Favourites from './src/screens/Favourites';
import HomeScreen from './src/screens/HomeScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import LoginScreen from './src/screens/LoginScreen';
import Profile from './src/screens/Profile';
import RegisterScreen from './src/screens/RegisterScreen';

// Import Workout screens
import ExerciseDetail from './src/screens/Workout/ExerciseDetail';
import PlanBuilder from './src/screens/Workout/PlanBuilder';
import WorkoutList from './src/screens/Workout/WorkoutList';
import WorkoutSelection from './src/screens/Workout/WorkoutSelection';
import WorkoutSetSelection from './src/screens/Workout/WorkoutSetSelection';
import WorkoutSession from './src/screens/Workout/WorkoutSession';
import WorkoutComplete from './src/screens/Workout/WorkoutComplete';

// Import icons
import { Activity, Dumbbell, Heart, Home, User } from 'lucide-react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Define themes for React Native Paper
const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#3B82F6',
    secondary: '#6366F1',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    accent: '#F59E0B',
    error: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
  },
  fonts: {
    ...(MD3LightTheme.fonts || {}),
    bold: Platform.select({
      web: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      default: 'System',
    }),
  },
};

const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#60A5FA',
    secondary: '#818CF8',
    background: '#0F172A',
    surface: '#1E293B',
    accent: '#FBBF24',
    error: '#FCA5A5',
    warning: '#FCD34D',
    success: '#6EE7B7',
  },
  fonts: {
    ...(MD3DarkTheme.fonts || {}),
    bold: Platform.select({
      web: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      default: 'System',
    }),
  },
};

// Custom Tab Bar Label Component
const CustomTabLabel = ({ focused, color, children }) => (
  <Text style={{
    color: color,
    fontSize: 12,
    fontWeight: focused ? '600' : '400',
    marginBottom: 4,
    textAlign: 'center',
  }}>
    {children}
  </Text>
);

function TabNavigator() {
  const { isDarkMode } = useSelector(state => state.theme);
  const theme = isDarkMode ? DarkTheme : LightTheme;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'HomeTab') {
            return <Home color={color} size={size} />;
          } else if (route.name === 'WorkoutTab') {
            return <Dumbbell color={color} size={size} />;
          } else if (route.name === 'CardioTab') {
            return <Activity color={color} size={size} />;
          } else if (route.name === 'FavouritesTab') {
            return <Heart color={color} size={size} />;
          } else if (route.name === 'ProfileTab') {
            return <User color={color} size={size} />;
          }
        },
        tabBarLabel: ({ focused, color, children }) => (
          <CustomTabLabel focused={focused} color={color}>
            {children}
          </CustomTabLabel>
        ),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="WorkoutTab" 
        component={WorkoutStack}
        options={{ title: 'Strength Training' }}
      />
      <Tab.Screen 
        name="CardioTab" 
        component={CardioStack}
        options={{ title: 'Cardio' }}
      />
      <Tab.Screen 
        name="FavouritesTab" 
        component={FavouritesStack}
        options={{ title: 'Favorites' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontWeight: 'normal',
        },
      }}
    >
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ExerciseDetail" 
        component={ExerciseDetail}
        options={{ 
          headerShown: true,
          title: 'Exercise Details',
        }}
      />
      <Stack.Screen 
        name="WorkoutSession" 
        component={WorkoutSession}
        options={{ 
          headerShown: true,
          title: 'Workout Session',
        }}
      />
      <Stack.Screen 
        name="WorkoutComplete" 
        component={WorkoutComplete}
        options={{ 
          headerShown: true,
          title: 'Workout Complete',
        }}
      />
    </Stack.Navigator>
  );
}

function WorkoutStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontWeight: 'normal',
        },
      }}
    >
      <Stack.Screen 
        name="WorkoutList" 
        component={WorkoutList}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="WorkoutSelection" 
        component={WorkoutSelection}
        options={({ route }) => ({ 
          headerShown: true,
          title: route.params?.equipmentType === 'with' ? 'Equipment Workout' : 'Bodyweight Workout',
        })}
      />
      <Stack.Screen 
        name="WorkoutSetSelection" 
        component={WorkoutSetSelection}
        options={{ 
          headerShown: true,
          title: 'Choose Workout Set',
        }}
      />
      <Stack.Screen 
        name="ExerciseDetail" 
        component={ExerciseDetail}
        options={{ 
          headerShown: true,
          title: 'Exercise Details',
        }}
      />
      <Stack.Screen 
        name="WorkoutSession" 
        component={WorkoutSession}
        options={{ 
          headerShown: true,
          title: 'Workout Session',
        }}
      />
      <Stack.Screen 
        name="WorkoutComplete" 
        component={WorkoutComplete}
        options={{ 
          headerShown: true,
          title: 'Workout Complete',
        }}
      />
      <Stack.Screen 
        name="PlanBuilder" 
        component={PlanBuilder}
        options={{ 
          headerShown: true,
          title: 'Build Workout Plan',
        }}
      />
    </Stack.Navigator>
  );
}

function CardioStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontWeight: 'normal',
        },
      }}
    >
      <Stack.Screen 
        name="CardioTracker" 
        component={CardioTracker}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CardioSummary" 
        component={CardioSummary}
        options={{ 
          headerShown: true,
          title: 'Workout Summary',
        }}
      />
    </Stack.Navigator>
  );
}

function FavouritesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontWeight: 'normal',
        },
      }}
    >
      <Stack.Screen 
        name="Favourites" 
        component={Favourites}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ExerciseDetail" 
        component={ExerciseDetail}
        options={{ 
          headerShown: true,
          title: 'Exercise Details',
        }}
      />
      <Stack.Screen 
        name="WorkoutSession" 
        component={WorkoutSession}
        options={{ 
          headerShown: true,
          title: 'Workout Session',
        }}
      />
      <Stack.Screen 
        name="WorkoutComplete" 
        component={WorkoutComplete}
        options={{ 
          headerShown: true,
          title: 'Workout Complete',
        }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontWeight: 'normal',
        },
      }}
    >
      <Stack.Screen 
        name="Profile" 
        component={Profile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: {
          fontWeight: 'normal',
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ 
          headerShown: true,
          title: 'Create Account',
        }}
      />
    </Stack.Navigator>
  );
}

function AppContent() {
  const { isAuthenticated } = useSelector(state => state.user);
  const { isDarkMode } = useSelector(state => state.theme);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  // Load Rowdies font
  let [fontsLoaded] = useFonts({
    Rowdies_300Light,
    Rowdies_400Regular,
    Rowdies_700Bold,
  });

  const theme = isDarkMode ? DarkTheme : LightTheme;
  
  // Navigation theme
  const navigationTheme = {
    dark: isDarkMode,
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.onSurface,
      border: theme.colors.outline,
      notification: theme.colors.error,
    },
    fonts: theme.fonts || {},
  };

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Load theme preference
      const themePreference = await AsyncStorage.getItem('theme');
      if (themePreference) {
        dispatch(setTheme(JSON.parse(themePreference)));
      }

      // Load user data
      const userData = await authAPI.getStoredUser();
      if (userData) {
        dispatch(setUser(userData));
      }

      // Load favourites
      const favouritesData = await AsyncStorage.getItem('favourites');
      if (favouritesData) {
        dispatch(setFavourites(JSON.parse(favouritesData)));
      }

      // Load custom plans
      const customPlansData = await AsyncStorage.getItem('customPlans');
      if (customPlansData) {
        dispatch(setCustomPlans(JSON.parse(customPlansData)));
      }

      // Set predefined plans
      dispatch(setPredefinedPlans(predefinedPlans));

    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      // Minimum 2-second loading time
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  // Show loading screen while fonts are loading or app is initializing
  if (!fontsLoaded || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          screenOptions={{
            headerTitleStyle: {
              fontWeight: 'normal',
            },
          }}
        >
          {!isAuthenticated ? (
            <Stack.Screen 
              name="Auth" 
              component={AuthStack}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen 
              name="Main" 
              component={TabNavigator}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <ReduxProvider store={store}>
      <AppContent />
    </ReduxProvider>
  );
}