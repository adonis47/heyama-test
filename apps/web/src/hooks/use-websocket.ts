'use client';

import { useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { objectsApi } from '@/store/api/objectsApi';

let socket: Socket | null = null;

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

export function useWebSocket(): Socket | null {
  const dispatch = useDispatch();

  const invalidateObjects = useCallback(() => {
    dispatch(objectsApi.util.invalidateTags([{ type: 'Object', id: 'LIST' }]));
  }, [dispatch]);

  useEffect(() => {
    if (!socket) {
      socket = io(WS_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
      });

      socket.on('connect', () => {
        console.log('WebSocket connected');
      });

      socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
      });
    }

    const handleObjectCreated = (data: { object: any }) => {
      console.log('Object created:', data.object);
      invalidateObjects();
    };

    const handleObjectDeleted = (data: { objectId: string }) => {
      console.log('Object deleted:', data.objectId);
      invalidateObjects();
    };

    socket.on('object.created', handleObjectCreated);
    socket.on('object.deleted', handleObjectDeleted);

    return () => {
      socket?.off('object.created', handleObjectCreated);
      socket?.off('object.deleted', handleObjectDeleted);
    };
  }, [invalidateObjects]);

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
