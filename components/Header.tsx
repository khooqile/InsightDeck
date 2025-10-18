'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface HeaderProps {
  onAuthModalOpen: () => void;
}

export default function Header({ onAuthModalOpen }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full bg-zinc-900 z-50 px-6 py-2">
      <div className="flex justify-between items-center">
        {/* Left Side - Empty for balance */}
        <div className="flex-1"></div>
        
        {/* Center - InsightDeck Title */}
        <div className="flex-1 flex justify-center">
          <h1 className="text-xl font-mono text-gray-200 font-medium">
            InsightDeck
          </h1>
        </div>
        
        {/* Right Side - Authentication Button */}
        <div className="flex-1 flex justify-end">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-zinc-400 text-sm">{user.email}</span>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                }}
                className="px-4 py-2 bg-zinc-700 hover:bg-zinc-800 text-white text-sm font-medium rounded-md transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthModalOpen}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-800 text-white text-sm font-medium rounded-md transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
