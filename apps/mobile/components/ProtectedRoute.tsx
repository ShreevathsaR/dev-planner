import { useAuthContext } from '@/lib/authContext';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isAuthenticated } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';

    console.log('Route protection check:', {
      user: !!user,
      isAuthenticated,
      emailVerified: user?.emailVerified,
      segments: segments[0],
    });

    if (isAuthenticated && inAuthGroup) {
      router.replace('/(app)/');
    } else if (!isAuthenticated && inAppGroup) {
      router.replace('/(auth)/sign-in');
    } else if (!user && !inAuthGroup && !inAppGroup) {
      router.replace('/(auth)');
    } else if (isAuthenticated && !inAuthGroup && !inAppGroup) {
      router.replace('/(app)/');
    }
  }, [user, isAuthenticated, segments, isLoading, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
          Loading...
        </Text>
      </View>
    );
  }

  return <>{children}</>;
};