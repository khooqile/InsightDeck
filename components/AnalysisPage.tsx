// src/components/AnalysisPage.tsx
'use client';

import React from 'react';
import type { AnalysisData } from '../mock-data';
import Dashboard from '../components/Dashboard';
import { ArrowLeft, Save, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AnalysisPageProps {
  data: AnalysisData;
  isGuestResult: boolean;
  fileName: string | null;
  onBack: () => void;
  onOpenAuthModal: () => void;
  // NEW/UPDATED PROP: Single handler for toggling save state
  onToggleSave: () => void; 
  isSaved: boolean; 
}

const truncate = (s: string | undefined | null, n = 48) => {
    if (!s) return "";
    return s.length > n ? s.slice(0, n - 1) + "…" : s;
};


export default function AnalysisPage({
  data,
  isGuestResult,
  fileName,
  onBack,
  onOpenAuthModal,
  onToggleSave, // Use the new toggle handler
  isSaved,
}: AnalysisPageProps) {
  const { user } = useAuth();
  
  const title = truncate(fileName) || "Document Analysis";
  
  // Explicit save feature visible only for logged-in users who aren't guests
  const showSaveFeature = user && !isGuestResult;

  // Define button content and style based on save state
  const buttonContent = isSaved ? (
    <>
      <Check className="h-4 w-4" />
      saved to history!
    </>
  ) : (
    <>
      <Save className="h-4 w-4" />
      save to history
    </>
  );

  const buttonClasses = isSaved
    ? "flex items-center gap-2 text-emerald-500 hover:text-red-400 transition-colors font-medium group" // Added hover to indicate it's clickable to unsave
    : "flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors font-medium"; 

  const unsaveTooltip = isSaved ? "Unsave from History" : undefined;
    
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        
        {/* HEADER ROW: Back button on Left, Save button on Right */}
        <div className="mb-6 flex justify-between items-start">
            {/* Back to Uploader Button (Left) */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                back to uploader
            </button>
            
            {/* Save/Unsave to History Button (Right) */}
            {showSaveFeature && (
                <button
                    onClick={onToggleSave} // Always call the toggle handler
                    className={buttonClasses}
                    title={unsaveTooltip} // Show tooltip for unsave action
                >
                    {buttonContent}
                </button>
            )}
        </div>

        {/* TITLE BLOCK (Centered) */}
        <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-semibold font-mono text-white">
                {title}
            </h2>
            <p className="mt-1 text-sm font-mono text-zinc-400">
                analysis
            </p>
        </div>
      </div>

      <div className="pointer-events-auto w-full flex flex-col items-center">
        {/* The main dashboard/results view */}
        <Dashboard data={data} />

        {/* Guest sign-up prompt */}
        {isGuestResult && !user && (
            <div className="mt-8 p-6 bg-zinc-900/50 border border-zinc-700 rounded-lg text-center w-full">
                <h3 className="text-xl font-semibold text-white mb-2">Sign up to save your analysis</h3>
                <p className="text-zinc-400 mb-4">
                    create an account to save this analysis and access your history anytime.
                </p>
                <button
                    onClick={onOpenAuthModal}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-lg text-white font-medium rounded-md transition-colors shadow-lg"
                >
                    save to account
                </button>
            </div>
        )}
      </div>
    </div>
  );
}