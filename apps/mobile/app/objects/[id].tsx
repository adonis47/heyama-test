import { View, Text, Image, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Trash2, Calendar } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { useGetObjectQuery, useDeleteObjectMutation } from '../../src/store/api/objectsApi';
import { RootState } from '../../src/store';

export default function ObjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { data: object, isLoading, error } = useGetObjectQuery(id);
  const [deleteObject, { isLoading: isDeleting }] = useDeleteObjectMutation();

  const handleDelete = () => {
    Alert.alert(
      'Delete Object',
      'Are you sure you want to delete this object?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteObject(id);
            router.back();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (error || !object) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <Text className="text-red-600 mb-4">Object not found</Text>
        <Pressable onPress={() => router.back()} className="bg-primary-500 px-6 py-3 rounded-xl">
          <Text className="text-white font-semibold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const isOwner = isAuthenticated && user?._id === object.ownerId;

  return (
    <ScrollView className="flex-1 bg-white">
      <Image
        source={{ uri: object.imageUrl }}
        className="w-full aspect-square"
        resizeMode="cover"
      />

      <View className="p-6">
        <View className="flex-row items-start justify-between mb-4">
          <Text className="text-2xl font-bold text-secondary-900 flex-1 mr-4">
            {object.title}
          </Text>
          {isOwner && (
            <Pressable
              onPress={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 p-3 rounded-xl"
            >
              <Trash2 size={20} color="#ffffff" />
            </Pressable>
          )}
        </View>

        <View className="flex-row items-center gap-2 mb-6">
          <Calendar size={16} color="#64748b" />
          <Text className="text-secondary-500">
            {new Date(object.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        <Text className="text-lg font-semibold text-secondary-900 mb-2">
          Description
        </Text>
        <Text className="text-secondary-600 leading-6">
          {object.description}
        </Text>
      </View>
    </ScrollView>
  );
}
