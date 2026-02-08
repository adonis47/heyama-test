'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice';

export function HeroSection() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <section className="relative py-16 lg:py-24">
      <div className="-z-10 absolute inset-0 overflow-hidden">
        <div className="-top-40 -right-40 absolute bg-primary-200 opacity-30 blur-3xl rounded-full w-80 h-80" />
        <div className="-bottom-40 -left-40 absolute bg-primary-300 opacity-20 blur-3xl rounded-full w-80 h-80" />
      </div>

      <div className="mx-auto max-w-4xl text-center animate-fade-in">
        <h1 className="mb-6 font-bold text-secondary-900 text-4xl md:text-6xl">
          Manage Your Objects
          <span className="block bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 mt-2 text-transparent">
            With Beautiful Images
          </span>
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-secondary-600 text-lg md:text-xl">
          Create, organize, and share your objects with our intuitive platform. Upload images, add
          descriptions, and access your collection from anywhere.
        </p>

        <div className="flex sm:flex-row flex-col justify-center gap-4 mb-16">
          {isAuthenticated ? (
            <Link href="#objects">
              <Button size="lg" className="w-full sm:w-auto">
                Go to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          )}
          {!isAuthenticated && (
            <Link href="#objects">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Browse Objects
              </Button>
            </Link>
          )}
        </div>

        <div className="gap-8 grid md:grid-cols-3">
          <div className="bg-white/50 backdrop-blur-sm p-6 border border-secondary-100 rounded-2xl">
            <h3 className="mb-2 font-semibold text-secondary-900">Easy Upload</h3>
            <p className="text-secondary-500 text-sm">
              Drag and drop your images for instant upload to the cloud.
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 border border-secondary-100 rounded-2xl">
            <h3 className="mb-2 font-semibold text-secondary-900">Realtime Sync</h3>
            <p className="text-secondary-500 text-sm">
              Changes sync instantly across all your devices.
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm p-6 border border-secondary-100 rounded-2xl">
            <h3 className="mb-2 font-semibold text-secondary-900">Secure Storage</h3>
            <p className="text-secondary-500 text-sm">
              Your data is encrypted and securely stored in the cloud.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
