'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// FIX 1: Add the required props to the interface
interface HeaderProps {
  onAuthModalOpen: () => void;
  onViewHistory: () => void;
  showHistoryLink: boolean;
}

export default function Header({ onAuthModalOpen, onViewHistory, showHistoryLink }: HeaderProps) {
  const { user } = useAuth();

  const handleSignOut = async () => {
    // Assuming you handle the redirection in your AuthContext's signOut
    await supabase.auth.signOut();
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-zinc-900 font-mono z-50 px-6 py-2">
      <div className="flex justify-between items-center">
        
        {/* FIX 2: Left Side - HISTORY BUTTON (Conditional) */}
        <div className="flex-1 flex justify-start">
          {showHistoryLink && user ? (
            <button
              onClick={onViewHistory}
              // FIX 3: Apply the same style as the user's email: text-zinc-400 text-sm
              className="text-zinc-400 font-mono hover:text-zinc-300 text-sm transition-colors"
            >
              history
            </button>
          ) : (
            // Keep this empty div for balance when the button is hidden
            <div /> 
          )}
        </div>
        
        {/* Center - InsightDeck Title (No changes) */}
        <div className="flex-1 flex justify-center">
          <h1 className="text-xl font-mono text-gray-200 font-medium">
            InsightDeck
          </h1>
        </div>
        
        {/* Right Side - Authentication Button (No major functional changes) */}
        <div className="flex-1 flex justify-end">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-zinc-400 text-sm">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 font-mono bg-zinc-700 hover:bg-zinc-800 text-white text-sm font-medium rounded-md transition-colors"
              >
                sign out
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthModalOpen}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-800 text-white text-sm font-medium rounded-md transition-colors"
            >
              sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}