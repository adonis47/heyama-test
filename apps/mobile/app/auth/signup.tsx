import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSignupMutation } from '../../src/store/api/authApi';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../src/store/slices/authSlice';

export default function SignupScreen() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [signup, { isLoading }] = useSignupMutation();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      await signup({ email, password }).unwrap();
      router.back();
    } catch (err: any) {
      setError(err?.data?.message || 'An error occurred');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerClassName="flex-grow p-6 justify-center">
        <Text className="text-3xl font-bold text-secondary-900 mb-2">
          Create Account
        </Text>
        <Text className="text-secondary-500 mb-8">
          Join Heyama today
        </Text>

        {error ? (
          <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <Text className="text-red-600">{error}</Text>
          </View>
        ) : null}

        <View className="mb-4">
          <Text className="text-secondary-700 font-medium mb-2">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            className="w-full bg-secondary-50 border border-secondary-200 rounded-xl px-4 py-3 text-secondary-900"
          />
        </View>

        <View className="mb-4">
          <Text className="text-secondary-700 font-medium mb-2">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            secureTextEntry
            className="w-full bg-secondary-50 border border-secondary-200 rounded-xl px-4 py-3 text-secondary-900"
          />
        </View>

        <View className="mb-6">
          <Text className="text-secondary-700 font-medium mb-2">Confirm Password</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry
            className="w-full bg-secondary-50 border border-secondary-200 rounded-xl px-4 py-3 text-secondary-900"
          />
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={isLoading}
          className="w-full bg-primary-500 py-4 rounded-xl items-center mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-semibold text-base">Create Account</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.replace('/auth/signin')}>
          <Text className="text-center text-secondary-600">
            Already have an account?{' '}
            <Text className="text-primary-500 font-medium">Sign In</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
