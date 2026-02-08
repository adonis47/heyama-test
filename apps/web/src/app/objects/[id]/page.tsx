'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Calendar, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGetObjectQuery, useDeleteObjectMutation } from '@/store/api/objectsApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ObjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { data: object, isLoading, error } = useGetObjectQuery(params.id);
  const [deleteObject, { isLoading: isDeleting }] = useDeleteObjectMutation();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this object?')) {
      await deleteObject(params.id);
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-48 mb-8" />
          <div className="aspect-video bg-secondary-200 rounded-2xl mb-6" />
          <div className="h-6 bg-secondary-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-secondary-200 rounded w-full mb-2" />
          <div className="h-4 bg-secondary-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (error || !object) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
        <p className="text-red-600 mb-4">Object not found</p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    );
  }

  const isOwner = isAuthenticated && user?._id === object.ownerId;

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center text-secondary-600 hover:text-secondary-900 mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Objects
      </Link>

      <Card variant="elevated" className="overflow-hidden animate-fade-in">
        {/* Image */}
        <div className="relative aspect-video">
          <Image
            src={object.imageUrl}
            alt={object.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <CardContent className="space-y-6">
          {/* Title and Actions */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold text-secondary-900">
              {object.title}
            </h1>
            {isOwner && (
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-secondary-500 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(object.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            {(object as any).owner && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {(object as any).owner.email}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-secondary-900 mb-2">
              Description
            </h2>
            <p className="text-secondary-600 whitespace-pre-wrap">
              {object.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
