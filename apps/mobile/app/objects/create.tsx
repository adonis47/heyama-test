import { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X, Upload } from 'lucide-react-native';
import { useCreateObjectMutation } from '../../src/store/api/objectsApi';

export default function CreateObjectScreen() {
  const router = useRouter();
  const [createObject, { isLoading }] = useCreateObjectMutation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [error, setError] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError('Camera permission is required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      setError('Please fill in all fields');
      return;
    }

    if (!image) {
      setError('Please select an image');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('image', {
        uri: image.uri,
        type: image.mimeType || 'image/jpeg',
        name: image.fileName || 'photo.jpg',
      } as any);

      await createObject(formData).unwrap();
      router.back();
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to create object');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerClassName="p-6">
        {error ? (
          <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <Text className="text-red-600">{error}</Text>
          </View>
        ) : null}

        {/* Image Picker */}
        <Text className="text-secondary-700 font-medium mb-2">Image</Text>
        {image ? (
          <View className="relative mb-4">
            <Image
              source={{ uri: image.uri }}
              className="w-full aspect-square rounded-2xl"
              resizeMode="cover"
            />
            <Pressable
              onPress={() => setImage(null)}
              className="absolute top-3 right-3 bg-red-500 p-2 rounded-full"
            >
              <X size={16} color="#ffffff" />
            </Pressable>
          </View>
        ) : (
          <View className="flex-row gap-3 mb-4">
            <Pressable
              onPress={pickImage}
              className="flex-1 bg-secondary-100 py-6 rounded-xl items-center"
            >
              <Upload size={24} color="#64748b" />
              <Text className="text-secondary-600 mt-2">Gallery</Text>
            </Pressable>
            <Pressable
              onPress={takePhoto}
              className="flex-1 bg-secondary-100 py-6 rounded-xl items-center"
            >
              <Camera size={24} color="#64748b" />
              <Text className="text-secondary-600 mt-2">Camera</Text>
            </Pressable>
          </View>
        )}

        {/* Title */}
        <View className="mb-4">
          <Text className="text-secondary-700 font-medium mb-2">Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter a title"
            maxLength={200}
            className="w-full bg-secondary-50 border border-secondary-200 rounded-xl px-4 py-3 text-secondary-900"
          />
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="text-secondary-700 font-medium mb-2">Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your object..."
            multiline
            numberOfLines={4}
            maxLength={2000}
            textAlignVertical="top"
            className="w-full bg-secondary-50 border border-secondary-200 rounded-xl px-4 py-3 text-secondary-900 min-h-[120px]"
          />
        </View>

        {/* Submit */}
        <Pressable
          onPress={handleSubmit}
          disabled={isLoading}
          className="w-full bg-primary-500 py-4 rounded-xl items-center"
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white font-semibold text-base">Create Object</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
