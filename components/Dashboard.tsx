import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, FileText, MessageSquare } from 'lucide-react';
import { AnalysisData } from '../mock-data';

interface DashboardProps {
  data: AnalysisData;
}

export default function Dashboard({ data }: DashboardProps) {
  const getSentimentColor = (sentiment: 'Bullish' | 'Bearish') => {
    return sentiment === 'Bullish' ? 'text-green-600' : 'text-red-600';
  };

  const getBadgeVariant = (sentiment: 'Positive' | 'Negative' | 'Neutral') => {
    switch (sentiment) {
      case 'Negative':
        return 'destructive';
      case 'Positive':
        return 'default';
      case 'Neutral':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Overall Sentiment and Score */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          {data.overall_sentiment === 'Bullish' ? (
            <TrendingUp className="h-6 w-6 text-green-600" />
          ) : (
            <TrendingDown className="h-6 w-6 text-red-600" />
          )}
          <h1 className={`text-3xl font-bold ${getSentimentColor(data.overall_sentiment as 'Bullish' | 'Bearish')}`}>
            {data.overall_sentiment}
          </h1>
        </div>
        <p className="text-2xl font-semibold text-gray-700">
          Score: {data.score}/100
        </p>
      </div>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{data.summary}</p>
        </CardContent>
      </Card>

      {/* Topical Sentiment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Topical Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {data.topics.map((topic, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">{topic.topic}:</span>
                <Badge variant={getBadgeVariant(topic.sentiment as 'Positive' | 'Negative' | 'Neutral')}>
                  {topic.sentiment}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quotes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bullish Quotes */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-green-600 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Bullish Quotes
          </h2>
          <div className="space-y-3">
            {data.quotes.bullish.map((quote, index) => (
              <Card key={index} className="border-l-4 border-l-green-500">
                <CardContent className="pt-4">
                  <p className="text-gray-700 italic">"{quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bearish Quotes */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-red-600 flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Bearish Quotes
          </h2>
          <div className="space-y-3">
            {data.quotes.bearish.map((quote, index) => (
              <Card key={index} className="border-l-4 border-l-red-500">
                <CardContent className="pt-4">
                  <p className="text-gray-700 italic">"{quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}