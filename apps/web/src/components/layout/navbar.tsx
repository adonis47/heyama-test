'use client';

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { RootState, persistor } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { baseApi } from '@/store/api/baseApi';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    persistor.purge();
  };

  return (
    <nav className="top-0 z-50 sticky bg-white/80 shadow-sm backdrop-blur-md border-secondary-200 border-b">
      <div className="mx-auto px-4 container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 font-bold text-transparent text-2xl"
          >
            Heyama
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 text-secondary-600">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden space-y-2 py-4 border-secondary-200 border-t">
            {isAuthenticated ? (
              <>
                <div className="px-2 py-2 text-secondary-600 text-sm">
                  Signed in as {user?.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="block px-2 py-2 w-full text-secondary-600 text-left"
                >
                  <LogOut className="inline mr-2 w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="block px-2 py-2 text-secondary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-2 py-2 font-medium text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
