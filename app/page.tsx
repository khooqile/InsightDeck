// src/app/page.tsx
"use client";
import React, { useState, useMemo } from "react";
import type { AnalysisData } from "../mock-data";
import IlluminatingGrid from "../components/IlluminatingGrid";
import FileUploader from "../components/FileUploader";
import DashboardSkeleton from "../components/DashboardSkeleton";
import AuthModal from "../components/AuthModal";
import HistoryPage from "../components/HistoryPage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AnalysisPage from "../components/AnalysisPage"; 
// Assuming deletePdfFromHistory is now available in pdfHistory
import { addPdfToHistory, deletePdfFromHistory } from "@/lib/pdfHistory"; 
import { useAuth } from "@/contexts/AuthContext";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { ArrowLeft } from "lucide-react"; 

export default function HomePage() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [guestAnalysisResult, setGuestAnalysisResult] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false); 
  
  const [isAnalysisSaved, setIsAnalysisSaved] = useState(false); 
  // NEW STATE: To store the ID of the history item for deletion
  const [historyItemId, setHistoryItemId] = useState<string | null>(null); 
  
  const { user, loading: authLoading } = useAuth();

  const [currentFileName, setCurrentFileName] = useState<string | null>(null);

  const [text] = useTypewriter({
    words: ["from a 50-page report, to a 50-second insight."],
    loop: 1,
    typeSpeed: 50,
    delaySpeed: 5000,
  });

  const titleFromData = useMemo(() => {
    return currentFileName || null;
  }, [currentFileName]);
  
  const currentAnalysisResult = analysisData || guestAnalysisResult;
  const isGuestResult = !!guestAnalysisResult;


  const handleFileUpload = async (file: File) => {
    setCurrentFileName(file?.name ?? null);

    setIsLoading(true);
    setError(null);
    setAnalysisData(null);
    setGuestAnalysisResult(null);
    setShowAnalysis(false);
    
    // Reset saved status and ID on new upload
    setIsAnalysisSaved(false); 
    setHistoryItemId(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("You must be signed in to analyze documents.");
        }
        throw new Error("Request failed");
      }

      const data = await response.json();

      if (user) {
        setAnalysisData(data);
      } else {
        setGuestAnalysisResult(data);
      }
      
      setShowAnalysis(true); 

    } catch (err: any) {
      setError(err.message || "Failed to analyze the document.");
      setCurrentFileName(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // NEW: Combined function to toggle save/unsave
  const handleToggleHistorySave = async () => {
    if (!user || !currentFileName) {
        // Should not happen for logged in users
        setError("Cannot save without user or file context.");
        return;
    }
    
    setError(null);

    if (isAnalysisSaved && historyItemId) {
        // UNSAVE ACTION (Delete)
        const result = await deletePdfFromHistory(historyItemId);
        if (result.success) {
            setIsAnalysisSaved(false);
            setHistoryItemId(null);
            console.log("Analysis successfully unsaved.");
        } else {
            setError("Failed to unsave analysis from history.");
        }
    } else {
        // SAVE ACTION (Add)
        const result = await addPdfToHistory(currentFileName, user.id);
        if (result.success && result.historyItemId) {
            setIsAnalysisSaved(true);
            setHistoryItemId(result.historyItemId);
            console.log("Analysis successfully saved to history!");
        } else {
            setError("Failed to save analysis to history.");
        }
    }
  };


  const handleSuccessfulAuth = async () => {
    if (guestAnalysisResult && user) {
      try {
        const fileNameToSave = currentFileName || "Guest Analysis"; 
        
        // Save action on guest auth success
        const result = await addPdfToHistory(fileNameToSave, user.id); 
        
        setAnalysisData(guestAnalysisResult);
        setGuestAnalysisResult(null);
        
        if (result.success && result.historyItemId) {
            setIsAnalysisSaved(true);
            setHistoryItemId(result.historyItemId);
        } else {
            // Handle save failure after auth
            console.error("Failed to save guest analysis after login.");
            setIsAnalysisSaved(false);
            setHistoryItemId(null);
        }
        
      } catch (error) {
        console.error("Error saving guest analysis:", error);
      }
    }
  };

  const handleBackToUploader = () => {
    setAnalysisData(null);
    setGuestAnalysisResult(null);
    setCurrentFileName(null);
    setError(null);
    setIsLoading(false);
    setShowAnalysis(false);
    
    // Reset saved status and ID when leaving analysis page
    setIsAnalysisSaved(false);
    setHistoryItemId(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const onViewHistory = () => setShowHistory(true);
  const showHistoryLink = !!user;

  if (showHistory) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header onAuthModalOpen={() => setIsAuthModalOpen(true)} onViewHistory={onViewHistory} showHistoryLink={false} />
        <div className="flex-1 py-16 pt-20">
          <HistoryPage onBack={() => setShowHistory(false)} />
        </div>
        <Footer />
      </div>
    );
  }
  
  if (showAnalysis && currentAnalysisResult) {
    return (
      <div className="min-h-screen flex flex-col">
          <IlluminatingGrid />
          <Header onAuthModalOpen={() => setIsAuthModalOpen(true)} onViewHistory={onViewHistory} showHistoryLink={showHistoryLink} />
          
          <div className="flex-1 py-16 pt-20 z-10">
              <AnalysisPage
                  data={currentAnalysisResult}
                  isGuestResult={isGuestResult}
                  fileName={titleFromData}
                  onBack={handleBackToUploader}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                  // PASS NEW TOGGLE HANDLER
                  onToggleSave={handleToggleHistorySave} 
                  isSaved={isAnalysisSaved}
              />
              {/* Show history save error if any */}
              {error && (
                <p className="mt-4 text-center text-red-500 font-medium">{error}</p>
              )}
          </div>

          <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={handleSuccessfulAuth} />
          <Footer />
      </div>
    );
  }
  
  // Uploader/Loading View
  return (
    <div className="min-h-screen flex flex-col">
      <IlluminatingGrid />

      <Header onAuthModalOpen={() => setIsAuthModalOpen(true)} onViewHistory={onViewHistory} showHistoryLink={showHistoryLink} />

      <div className="pointer-events-none flex flex-col items-center py-16 pt-40 flex-1 z-10">
        
        <div className="pointer-events-auto text-center mb-12">
          <p className="text-2xl font-mono text-zinc-400">
            <span>{text}</span>
            <Cursor cursorColor="#a1a1aa" />
          </p>
        </div>

        <div className="pointer-events-auto w-full max-w-2xl flex flex-col items-center">
          {isLoading ? (
            <DashboardSkeleton 
            />
          ) : (
            <>
              <FileUploader onFileUpload={handleFileUpload} loading={isLoading} />
              {error && <p className="mt-6 text-red-500 font-medium">{error}</p>}
            </>
          )}
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={handleSuccessfulAuth} />

      <Footer />
    </div>
  );
}