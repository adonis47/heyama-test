import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, User, Mail } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../src/store';
import { logout } from '../../src/store/slices/authSlice';

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-secondary-50 items-center justify-center p-6">
        <View className="w-20 h-20 bg-primary-100 rounded-full items-center justify-center mb-6">
          <User size={40} color="#0ea5e9" />
        </View>
        <Text className="text-xl font-semibold text-secondary-900 mb-2">
          Welcome to Heyama
        </Text>
        <Text className="text-secondary-500 text-center mb-8">
          Sign in to create and manage your objects
        </Text>

        <Pressable
          onPress={() => router.push('/auth/signin')}
          className="w-full bg-primary-500 py-4 rounded-xl items-center mb-3"
        >
          <Text className="text-white font-semibold text-base">Sign In</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/auth/signup')}
          className="w-full bg-secondary-200 py-4 rounded-xl items-center"
        >
          <Text className="text-secondary-700 font-semibold text-base">Create Account</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-secondary-50">
      <View className="bg-white p-6 mb-4">
        <View className="items-center">
          <View className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl font-bold text-primary-600">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Mail size={16} color="#64748b" />
            <Text className="text-secondary-600">{user?.email}</Text>
          </View>
        </View>
      </View>

      <View className="bg-white p-4">
        <Pressable
          onPress={handleLogout}
          className="flex-row items-center gap-3 py-3"
        >
          <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center">
            <LogOut size={20} color="#dc2626" />
          </View>
          <Text className="text-red-600 font-medium">Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}
