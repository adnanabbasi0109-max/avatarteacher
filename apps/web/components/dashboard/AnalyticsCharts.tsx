"use client";

import React from "react";

interface AnalyticsChartsProps {
  data?: {
    sessions: { date: string; count: number }[];
    engagement: { date: string; score: number }[];
  };
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  // Placeholder chart using CSS bars
  // In production, use Recharts for proper charts
  const mockWeekData = [
    { day: "Mon", sessions: 12, engagement: 78 },
    { day: "Tue", sessions: 18, engagement: 82 },
    { day: "Wed", sessions: 15, engagement: 75 },
    { day: "Thu", sessions: 22, engagement: 88 },
    { day: "Fri", sessions: 20, engagement: 85 },
    { day: "Sat", sessions: 8, engagement: 90 },
    { day: "Sun", sessions: 5, engagement: 72 },
  ];

  const maxSessions = Math.max(...mockWeekData.map((d) => d.sessions));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Sessions Chart */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-sm font-medium text-white mb-4">
          Sessions This Week
        </h3>
        <div className="flex items-end gap-2 h-40">
          {mockWeekData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">{d.sessions}</span>
              <div
                className="w-full rounded-t bg-blue-500/60 transition-all hover:bg-blue-500"
                style={{
                  height: `${(d.sessions / maxSessions) * 100}%`,
                  minHeight: "4px",
                }}
              />
              <span className="text-xs text-gray-600">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Chart */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-sm font-medium text-white mb-4">
          Engagement Score
        </h3>
        <div className="flex items-end gap-2 h-40">
          {mockWeekData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">{d.engagement}%</span>
              <div
                className="w-full rounded-t bg-green-500/60 transition-all hover:bg-green-500"
                style={{
                  height: `${d.engagement}%`,
                  minHeight: "4px",
                }}
              />
              <span className="text-xs text-gray-600">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
