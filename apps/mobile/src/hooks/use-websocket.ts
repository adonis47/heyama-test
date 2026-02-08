'use client';

import { useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import Constants from 'expo-constants';
import { objectsApi } from '../store/api/objectsApi';

const WS_URL = Constants.expoConfig?.extra?.wsUrl || 'http://localhost:3001';

export function useWebSocket() {
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);

  const invalidateObjects = useCallback(() => {
    dispatch(objectsApi.util.invalidateTags([{ type: 'Object', id: 'LIST' }]));
  }, [dispatch]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(WS_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
      });

      socketRef.current.on('connect', () => {
        console.log('WebSocket connected');
      });

      socketRef.current.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
      });
    }

    const socket = socketRef.current;

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
      socket.off('object.created', handleObjectCreated);
      socket.off('object.deleted', handleObjectDeleted);
    };
  }, [invalidateObjects]);

  return socketRef.current;
}
