'use client';

import { useSelector } from 'react-redux';
import { ObjectsList } from '@/components/objects/objects-list';
import { HeroSection } from '@/components/home/hero-section';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

export default function HomePage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <div className="space-y-12">
      {!isAuthenticated && <HeroSection />}
      {isAuthenticated && <ObjectsList />}
    </div>
  );
}
