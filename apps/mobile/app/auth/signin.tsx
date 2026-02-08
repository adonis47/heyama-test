import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSigninMutation } from '../../src/store/api/authApi';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../src/store/slices/authSlice';

export default function SigninScreen() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [signin, { isLoading }] = useSigninMutation();
  
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await signin({ email, password }).unwrap();
      router.back();
    } catch (err: any) {
      setError(err?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-1 p-6 justify-center">
        <Text className="text-3xl font-bold text-secondary-900 mb-2">
          Welcome Back
        </Text>
        <Text className="text-secondary-500 mb-8">
          Sign in to your account
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

        <View className="mb-6">
          <Text className="text-secondary-700 font-medium mb-2">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
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
            <Text className="text-white font-semibold text-base">Sign In</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.replace('/auth/signup')}>
          <Text className="text-center text-secondary-600">
            Don't have an account?{' '}
            <Text className="text-primary-500 font-medium">Sign Up</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
