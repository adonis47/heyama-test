import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { store } from '../src/store';
import '../global.css';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f8fafc' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/signin"
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Sign In',
          }}
        />
        <Stack.Screen
          name="auth/signup"
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Sign Up',
          }}
        />
        <Stack.Screen
          name="objects/create"
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTitle: 'Create Object',
          }}
        />
        <Stack.Screen
          name="objects/[id]"
          options={{
            headerShown: true,
            headerTitle: 'Object Details',
          }}
        />
      </Stack>
    </Provider>
  );
}
