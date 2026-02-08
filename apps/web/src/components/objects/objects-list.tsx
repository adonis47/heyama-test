'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Eye, Loader2, WifiOff, RefreshCw, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGetObjectsQuery, useDeleteObjectMutation } from '@/store/api/objectsApi';
import { useWebSocket } from '@/hooks/use-websocket';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ObjectGridSkeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';

const ITEMS_PER_PAGE = 12;

export function ObjectsList() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { addToast } = useToast();
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<any[]>([]);
  const { data, isLoading, error, isFetching, refetch } = useGetObjectsQuery({
    page,
    limit: ITEMS_PER_PAGE,
  });
  const [deleteObject, { isLoading: isDeleting }] = useDeleteObjectMutation();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useWebSocket();

  useEffect(() => {
    if (data?.items) {
      if (page === 1) {
        setAllItems(data.items);
      } else {
        setAllItems((prev) => {
          const existingIds = new Set(prev.map((item) => item._id));
          const newItems = data.items.filter((item) => !existingIds.has(item._id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [data, page]);

  const hasMore = data ? page * ITEMS_PER_PAGE < data.total : false;

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore, isFetching]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this object?')) {
      try {
        await deleteObject(id).unwrap();
        setAllItems((prev) => prev.filter((item) => item._id !== id));
        addToast('Object deleted successfully!', 'success');
      } catch (err: any) {
        const errorMessage = err?.data?.message || 'Failed to delete object';
        addToast(errorMessage, 'error');
      }
    }
  };

  const handleRefresh = useCallback(() => {
    setPage(1);
    setAllItems([]);
    refetch();
  }, [refetch]);

  if (isLoading && page === 1) {
    return (
      <section id="objects" className="py-8">
        <h2 className="mb-8 font-bold text-secondary-900 text-2xl">Recent Objects</h2>
        <ObjectGridSkeleton count={8} />
      </section>
    );
  }

  if (error) {
    return (
      <section id="objects" className="py-8">
        <div className="py-12 text-center">
          <div className="inline-flex justify-center items-center bg-red-100 mb-4 rounded-full w-16 h-16">
            <WifiOff className="w-8 h-8 text-red-500" />
          </div>
          <p className="mb-4 text-red-600">Error loading objects. Please try again.</p>
          <Button onClick={handleRefresh} variant="secondary">
            <RefreshCw className="mr-2 w-4 h-4" />
            Retry
          </Button>
        </div>
      </section>
    );
  }

  if (!allItems.length) {
    return (
      <section id="objects" className="py-8">
        <h2 className="mb-8 font-bold text-secondary-900 text-2xl">Recent Objects</h2>
        <div className="py-12 text-secondary-500 text-center">
          <p className="mb-4">No objects yet. Be the first to create one!</p>
          {isAuthenticated && (
            <Link href="/objects/create">
              <Button>Create Object</Button>
            </Link>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="objects" className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-bold text-secondary-900 text-2xl">My Objects</h2>
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Link href="/objects/create">
              <Button variant="primary" size="sm">
                <Plus className="mr-2 w-4 h-4" />
                Add Object
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isFetching}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <span className="text-secondary-500 text-sm">
            {data?.total || allItems.length} objects
          </span>
        </div>
      </div>

      <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allItems.map((object) => (
          <Card
            key={object._id}
            variant="elevated"
            className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={object.imageUrl}
                alt={object.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Actions overlay */}
              <div className="right-4 bottom-4 left-4 absolute flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link href={`/objects/${object._id}`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Eye className="mr-1 w-4 h-4" />
                    View
                  </Button>
                </Link>
                {isAuthenticated && user?._id === object.ownerId && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(object._id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <CardContent>
              <h3 className="mb-1 font-semibold text-secondary-900 truncate">{object.title}</h3>
              <p className="text-secondary-500 text-sm line-clamp-2">{object.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isFetching && page > 1 && (
          <div className="flex items-center gap-2 text-secondary-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading more...
          </div>
        )}
        {!hasMore && allItems.length > 0 && (
          <p className="text-secondary-400 text-sm">You've reached the end</p>
        )}
      </div>
    </section>
  );
}
