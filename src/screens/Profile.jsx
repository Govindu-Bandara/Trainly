import { Activity, Heart, LogOut, Settings, User } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Card, Dialog, Portal, Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { authAPI } from '../api/authAPI';
import { clearUser } from '../redux/userSlice';

const Profile = ({ navigation }) => {
  const { user } = useSelector(state => state.user);
  const { favouriteExercises, favouriteWorkouts } = useSelector(state => state.favourites);
  const theme = useTheme();
  const dispatch = useDispatch();
  
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const showLogoutDialog = () => setLogoutVisible(true);
  const hideLogoutDialog = () => setLogoutVisible(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      console.log('Starting logout process...');
      
      // Call the logout API
      await authAPI.logout();
      
      // Clear user from Redux store
      dispatch(clearUser());
      
      console.log('Logout successful');
      
      // The navigation will automatically handle going back to login screen
      // because of the conditional rendering in App.js based on isAuthenticated
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local state
      dispatch(clearUser());
    } finally {
      setIsLoggingOut(false);
      hideLogoutDialog();
    }
  };

  const stats = [
    {
      icon: <Heart color={theme.colors.primary} size={20} />,
      label: 'Favorite Workouts',
      value: favouriteWorkouts?.length ?? 0,
      color: theme.colors.primaryContainer,
    },
    {
      icon: <Activity color={theme.colors.tertiary} size={20} />,
      label: 'Workouts This Week',
      value: '3',
      color: theme.colors.tertiaryContainer,
    },
  ];

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        {/* Header */}
        <Card style={{ margin: 16 }}>
          <Card.Content>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
                Profile
              </Text>
              <Button
                mode="outlined"
                onPress={showLogoutDialog}
                icon={LogOut}
                buttonColor={theme.colors.errorContainer}
                textColor={theme.colors.onErrorContainer}
                compact
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Logging Out...' : 'Logout'}
              </Button>
            </View>

            {/* User Info */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ 
                width: 80, 
                height: 80, 
                backgroundColor: theme.colors.primary, 
                borderRadius: 40, 
                justifyContent: 'center', 
                alignItems: 'center',
                marginRight: 16 
              }}>
                <User color="#fff" size={32} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  @{user?.username}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                  {user?.email}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Stats */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {stats.map((stat, index) => (
              <Card 
                key={index}
                style={{ flex: 1, backgroundColor: stat.color }}
              >
                <Card.Content>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    {stat.icon}
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: theme.colors.onSurface }}>
                      {stat.value}
                    </Text>
                  </View>
                  <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    {stat.label}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <Card style={{ marginHorizontal: 16, marginBottom: 24 }}>
          <Card.Content style={{ padding: 0 }}>
            <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.onSurface, padding: 16 }}>
              Quick Actions
            </Text>
            
            <Button
              mode="text"
              onPress={() => navigation.navigate('FavouritesTab', { screen: 'Favourites' })}
              icon={() => <Heart color={theme.colors.primary} size={18} />}
              contentStyle={{ justifyContent: 'flex-start', paddingVertical: 16 }}
              style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.outline }}
            >
              My Favorites ({favouriteWorkouts?.length ?? 0})
            </Button>

            <Button
              mode="text"
              icon={Settings}
              contentStyle={{ justifyContent: 'flex-start', paddingVertical: 16 }}
              onPress={() => {
                // Navigate to settings screen or show a message
                console.log('Navigate to settings');
              }}
            >
              Settings
            </Button>
          </Card.Content>
        </Card>

        {/* Recent Activity */}
        <Card style={{ marginHorizontal: 16, marginBottom: 32 }}>
          <Card.Content>
            <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.onSurface, marginBottom: 16 }}>
              Recent Activity
            </Text>
            
            <Text style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', paddingVertical: 32 }}>
              No recent activity
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Logout Confirmation Dialog */}
      <Portal>
        <Dialog visible={logoutVisible} onDismiss={hideLogoutDialog}>
          <Dialog.Title>Logout</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to logout?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideLogoutDialog} disabled={isLoggingOut}>
              Cancel
            </Button>
            <Button 
              onPress={handleLogout} 
              mode="contained" 
              buttonColor={theme.colors.error}
              loading={isLoggingOut}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Logging Out...' : 'Logout'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default Profile;