'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X, ImageIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useCreateObjectMutation } from '@/store/api/objectsApi';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export default function CreateObjectPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [createObject, { isLoading }] = useCreateObjectMutation();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!imageFile) {
      setError('Please select an image');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('image', imageFile);

      await createObject(formDataToSend).unwrap();
      addToast('Object created successfully!', 'success');
      router.push('/');
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to create object';
      setError(errorMessage);
      addToast(errorMessage, 'error');
    }
  };

  return (
    <div className="mx-auto py-8 max-w-2xl">
      <Card variant="elevated" className="animate-slide-up">
        <CardHeader>
          <h1 className="font-bold text-secondary-900 text-2xl">Create New Object</h1>
          <p className="text-secondary-500">Add a new object with an image to your collection</p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 p-3 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block mb-2 font-medium text-secondary-700 text-sm">Image</label>

              {imagePreview ? (
                <div className="relative bg-secondary-100 rounded-xl aspect-video overflow-hidden">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="top-3 right-3 absolute bg-red-500 hover:bg-red-600 p-2 rounded-full text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col justify-center items-center bg-secondary-50 hover:bg-primary-50 border-2 border-secondary-300 hover:border-primary-400 border-dashed rounded-xl aspect-video transition-colors cursor-pointer"
                >
                  <div className="bg-secondary-100 mb-4 p-4 rounded-full">
                    <ImageIcon className="w-8 h-8 text-secondary-400" />
                  </div>
                  <p className="font-medium text-secondary-600">Click to upload image</p>
                  <p className="mt-1 text-secondary-400 text-sm">PNG, JPG, WebP up to 5MB</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <Input
              label="Title"
              placeholder="Enter a title for your object"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              maxLength={200}
            />

            <Textarea
              label="Description"
              placeholder="Describe your object..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
              maxLength={2000}
            />

            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" isLoading={isLoading}>
                <Upload className="mr-2 w-4 h-4" />
                Create Object
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
