import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { useGetObjectsQuery } from '../../src/store/api/objectsApi';
import { useWebSocket } from '../../src/hooks/use-websocket';
import { RootState } from '../../src/store';

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data, isLoading, refetch, isFetching } = useGetObjectsQuery({ page: 1, limit: 20 });

  useWebSocket();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-secondary-50">
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text className="mt-4 text-secondary-500">Loading objects...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-secondary-50">
      <FlatList
        data={data?.items || []}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={{ padding: 12 }}
        columnWrapperStyle={{ gap: 12 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-12">
            <Text className="text-secondary-500 text-center">No objects yet.</Text>
            {isAuthenticated && (
              <Pressable
                onPress={() => router.push('/objects/create')}
                className="bg-primary-500 mt-4 px-6 py-3 rounded-xl"
              >
                <Text className="font-semibold text-white">Create Your First Object</Text>
              </Pressable>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Link href={`/objects/${item._id}`} asChild>
            <Pressable className="flex-1 bg-white shadow-sm rounded-2xl overflow-hidden">
              <Image
                source={{ uri: item.imageUrl }}
                className="w-full aspect-square"
                resizeMode="cover"
              />
              <View className="p-3">
                <Text className="mb-1 font-semibold text-secondary-900" numberOfLines={1}>
                  {item.title}
                </Text>
                {item.owner && (
                  <Text className="mb-2 text-secondary-400 text-xs">by {item.owner.email}</Text>
                )}
                <Text className="text-secondary-500 text-sm" numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
            </Pressable>
          </Link>
        )}
      />

      {isAuthenticated && (
        <Pressable
          onPress={() => router.push('/objects/create')}
          className="right-6 bottom-6 absolute justify-center items-center bg-primary-500 shadow-lg rounded-full w-14 h-14"
        >
          <Plus size={24} color="#ffffff" />
        </Pressable>
      )}
    </View>
  );
}
