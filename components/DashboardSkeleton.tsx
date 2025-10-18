import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Top row with large box on left and smaller box on right */}
      <div className="flex gap-6">
        {/* Large rectangular box on the left */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <div className="h-6 bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 bg-slate-700 rounded animate-pulse w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-700 rounded animate-pulse w-4/5"></div>
                <div className="h-4 bg-slate-700 rounded animate-pulse w-3/5"></div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Smaller box on the right */}
        <div className="w-80">
          <Card>
            <CardHeader>
              <div className="h-5 bg-slate-700 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-slate-700 rounded animate-pulse"></div>
                <div className="h-3 bg-slate-700 rounded animate-pulse w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Medium-height box spanning full width */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-slate-700 rounded animate-pulse w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-slate-700 rounded animate-pulse"></div>
        </CardContent>
      </Card>

      {/* Two-column grid with three cards each */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={`left-${i}`}>
              <CardHeader>
                <div className="h-5 bg-slate-700 rounded animate-pulse"></div>
                <div className="h-3 bg-slate-700 rounded animate-pulse w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-3 bg-slate-700 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-slate-700 rounded animate-pulse w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={`right-${i}`}>
              <CardHeader>
                <div className="h-5 bg-slate-700 rounded animate-pulse"></div>
                <div className="h-3 bg-slate-700 rounded animate-pulse w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-3 bg-slate-700 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-slate-700 rounded animate-pulse w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
