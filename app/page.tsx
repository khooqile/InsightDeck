"use client";
import React, { useState } from 'react';
import type { AnalysisData } from '../mock-data';
import IlluminatingGrid from '../components/IlluminatingGrid';
import FileUploader from '../components/FileUploader';
import Dashboard from '../components/Dashboard';
import DashboardSkeleton from '../components/DashboardSkeleton';
import Auth from '../components/Auth';
import AuthModal from '../components/AuthModal';
import HistoryPage from '../components/HistoryPage';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { addPdfToHistory } from '@/lib/pdfHistory';
import { supabase } from '@/lib/supabase';
// 1. Import the typewriter components
import { useTypewriter, Cursor } from 'react-simple-typewriter';

export default function HomePage() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [guestAnalysisResult, setGuestAnalysisResult] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();

  // 2. Set up the typewriter hook
  const [text] = useTypewriter({
    words: ['from a 50-page report to a 50-second insight.'],
    loop: 1, // Type once
    typeSpeed: 50,
    delaySpeed: 5000
  });


  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setAnalysisData(null);
    setGuestAnalysisResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();
      
      if (user) {
        setAnalysisData(data);
        await addPdfToHistory(file.name, user.id);
      } else {
        setGuestAnalysisResult(data);
      }
    } catch (err) {
      setError('Failed to analyze the document.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulAuth = async () => {
    if (guestAnalysisResult && user) {
      try {
        await addPdfToHistory('Guest Analysis', user.id);
        setAnalysisData(guestAnalysisResult);
        setGuestAnalysisResult(null);
      } catch (error) {
        console.error('Error saving guest analysis:', error);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (showHistory) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header onAuthModalOpen={() => setIsAuthModalOpen(true)} />
        <div className="flex-1 py-16 pt-20">
          <HistoryPage onBack={() => setShowHistory(false)} />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header onAuthModalOpen={() => setIsAuthModalOpen(true)} />

      <div className="flex flex-col items-center py-16 pt-40 flex-1">
        <div className="text-center mb-12">
          {/* 3. Update the JSX to use the animated text and cursor */}
          <p className="text-2xl font-mono text-zinc-400">
            <span>{text}</span>
            <Cursor cursorColor='#a1a1aa' />
          </p>
          {user && (
            <div className="mt-4 flex items-center justify-center">
              <button
                onClick={() => setShowHistory(true)}
                className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
              >
                View History
              </button>
            </div>
          )}
        </div>
        <div className="w-full max-w-2xl flex flex-col items-center">
        {isLoading ? (
          <DashboardSkeleton />
        ) : analysisData ? (
          <Dashboard data={analysisData} />
        ) : guestAnalysisResult ? (
          <>
            <Dashboard data={guestAnalysisResult} />
            <div className="mt-8 p-6 bg-zinc-900/50 border border-zinc-700 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
                Sign up to save your analysis history
              </h3>
              <p className="text-zinc-400 mb-4">
                Create an account to save this analysis and access your history anytime.
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md transition-colors"
              >
                Save to Account
              </button>
            </div>
          </>
        ) : (
          <>
            <FileUploader onFileUpload={handleFileUpload} loading={isLoading} />
            {error && (
              <p className="mt-6 text-red-500 font-medium">{error}</p>
            )}
          </>
        )}
        </div>
      </div>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleSuccessfulAuth}
      />
      
      <Footer />
    </div>
  );
}