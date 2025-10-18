'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError('');
    setSuccessMessage('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else {
          setSuccessMessage('check your email for the confirmation link!');
          // Don't call onSuccess immediately for sign up as user needs to confirm email
          setTimeout(() => {
            handleClose();
          }, 2000);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else {
          onSuccess();
          handleClose();
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-lg p-6 w-full max-w-md mx-4">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-mono font-bold text-white mb-2">
            {isSignUp ? 'create account' : 'welcome back!'}
          </h2>
          <p className="text-zinc-400 font-mono">
            {isSignUp 
              ? 'sign up to save your analysis history' 
              : 'sign in to access your saved analyses'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-mono font-medium text-zinc-300 mb-2">
              Email
            </label>
            <div className="relative font-mono">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="email"
                placeholder="enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-mono font-medium text-zinc-300 mb-2">
              Password
            </label>
            <div className="relative font-mono">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 font-mono bg-zinc-600 hover:bg-zinc-700 disabled:bg-zinc-600 text-white font-medium rounded-md transition-colors"
          >
            {loading ? 'Loading...' : (isSignUp ? 'create account' : 'sign in')}
          </button>
        </form>

        {/* Messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md">
            <p className="text-red-400 font-mono text-sm">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 bg-emerald-900/50 border border-emerald-700 rounded-md">
            <p className="text-emerald-400 font-mono text-sm">{successMessage}</p>
          </div>
        )}

        {/* Toggle Between Sign In/Sign Up */}
        <div className="mt-6 text-center font-mono">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setSuccessMessage('');
            }}
            className="text-zinc-400 hover:text-white text-sm transition-colors"
          >
            {isSignUp 
              ? 'already have an account? sign in' 
              : "don't have an account? sign up"
            }
          </button>
        </div>
      </div>
    </div>
  );
}
