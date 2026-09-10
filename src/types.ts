export type ActivityCategory =
  | 'Study'
  | 'Work'
  | 'Entertainment'
  | 'Exercise'
  | 'Social'
  | 'Personal'
  | 'Other';

export type ActivityStatus = 'completed' | 'in-progress' | 'postponed';

export interface Activity {
  id: string;
  title: string;
  category: ActivityCategory;
  startTime: string; // "HH:MM" e.g. "09:00"
  durationMinutes: number;
  status: ActivityStatus;
  notes?: string;
  microCopy?: string;
  focusRating?: number; // 1 to 5
  date: string; // YYYY-MM-DD
}

export interface DayScoreBreakdown {
  score: number;
  ratingLabel: string;
  funnyComment: string;
  focusMinutes: number;
  entertainmentMinutes: number;
  completedTasksCount: number;
  postponedTasksCount: number;
  totalLoggedMinutes: number;
}

export interface ClueItem {
  id: string;
  number: string;
  title: string;
  evidence: string;
  confidence: number; // 0 to 100
  type: 'focus' | 'distraction' | 'rhythm' | 'habit';
}

export interface WhatIfScenario {
  id: string;
  title: string;
  description: string;
  categoryTarget: ActivityCategory;
  currentValueText: string;
  possibleValueText: string;
  currentMinutesWeek: number;
  possibleMinutesWeek: number;
  potentialGainText: string;
  impactTag: string;
}

export type NavTab = 'today' | 'timeline' | 'insights' | 'patterns' | 'history' | 'control';

export interface DailyReplayQuote {
  id: string;
  text: string;
}
