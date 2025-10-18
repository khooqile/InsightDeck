'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, PdfHistory } from '@/lib/supabase';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Calendar } from 'lucide-react';

interface HistoryPageProps {
  onBack: () => void;
}

export default function HistoryPage({ onBack }: HistoryPageProps) {
  const { user } = useAuth();
  const [history, setHistory] = useState<PdfHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('pdf_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('analyzed_at', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
      } else {
        setHistory(data || []);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Analysis
        </button>
        <h2 className="text-2xl font-bold text-white mb-2">PDF Analysis History</h2>
        <p className="text-zinc-400">Your previously analyzed documents</p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-zinc-400 mt-2">Loading history...</p>
        </div>
      ) : history.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-700">
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">No analysis history found</p>
            <p className="text-zinc-500 text-sm mt-1">
              Upload and analyze your first PDF to see it here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id} className="bg-zinc-900/50 border-zinc-700 hover:border-zinc-600 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-emerald-500" />
                    <div>
                      <h3 className="text-white font-medium">{item.pdf_name}</h3>
                      <div className="flex items-center gap-1 text-zinc-400 text-sm">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(item.analyzed_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
