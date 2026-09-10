import { DailyReplayQuote, ActivityCategory } from '../types';

export const REPLAY_QUOTES: DailyReplayQuote[] = [
  { id: 'q1', text: 'Your calendar remembers what your brain conveniently forgets.' },
  { id: 'q2', text: 'Future you is currently taking notes.' },
  { id: 'q3', text: 'Small progress still counts. Your spreadsheet agrees.' },
  { id: 'q4', text: 'Motivation is unreliable. Data is nosy.' },
  { id: 'q5', text: 'Today looked different in your head, didn’t it?' },
  { id: 'q6', text: 'You cannot argue with your own timeline.' },
  { id: 'q7', text: 'Your habits leave fingerprints.' },
  { id: 'q8', text: 'Plot twist: you actually had more time than you thought.' },
  { id: 'q9', text: 'Your day has receipts.' },
  { id: 'q10', text: 'Time flies. Thankfully, we installed CCTV.' },
];

export const CATEGORY_META: Record<
  ActivityCategory,
  {
    iconName: string;
    emoji: string;
    color: string;
    glowClass: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    wittyComment: string;
    defaultMicroCopy: string;
  }
> = {
  Study: {
    iconName: 'BookOpen',
    emoji: '📚',
    color: '#38BDF8', // Cyan
    glowClass: 'shadow-cyan-500/20',
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    badgeBorder: 'border-cyan-500/30',
    badgeText: 'text-cyan-400',
    wittyComment: 'Academic weapon detected.',
    defaultMicroCopy: 'Your brain has officially logged overtime.',
  },
  Work: {
    iconName: 'Briefcase',
    emoji: '💼',
    color: '#818CF8', // Indigo
    glowClass: 'shadow-indigo-500/20',
    badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    badgeBorder: 'border-indigo-500/30',
    badgeText: 'text-indigo-400',
    wittyComment: 'Someone was suspiciously responsible today.',
    defaultMicroCopy: 'Future developer behavior detected.',
  },
  Entertainment: {
    iconName: 'Tv',
    emoji: '🍿',
    color: '#F43F5E', // Rose
    glowClass: 'shadow-rose-500/20',
    badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    badgeBorder: 'border-rose-500/30',
    badgeText: 'text-rose-400',
    wittyComment: 'Okay… that escalated quickly.',
    defaultMicroCopy: 'That was not a break. That was a side quest.',
  },
  Exercise: {
    iconName: 'Dumbbell',
    emoji: '⚡',
    color: '#10B981', // Emerald
    glowClass: 'shadow-emerald-500/20',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    badgeBorder: 'border-emerald-500/30',
    badgeText: 'text-emerald-400',
    wittyComment: 'Respectfully, your muscles have entered the chat.',
    defaultMicroCopy: 'Biological hardware upgraded.',
  },
  Social: {
    iconName: 'Users',
    emoji: '💬',
    color: '#F59E0B', // Amber
    glowClass: 'shadow-amber-500/20',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-400',
    wittyComment: 'Apparently, you have friends.',
    defaultMicroCopy: 'Human connection quotient verified.',
  },
  Personal: {
    iconName: 'Heart',
    emoji: '☕',
    color: '#A855F7', // Purple
    glowClass: 'shadow-purple-500/20',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    badgeBorder: 'border-purple-500/30',
    badgeText: 'text-purple-400',
    wittyComment: 'Self-care mode engaged. No apologies.',
    defaultMicroCopy: 'Technically productive. Emotionally necessary.',
  },
  Other: {
    iconName: 'Sparkles',
    emoji: '✨',
    color: '#94A3B8', // Slate
    glowClass: 'shadow-slate-500/20',
    badgeBg: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    badgeBorder: 'border-slate-500/30',
    badgeText: 'text-slate-400',
    wittyComment: 'A mysterious blend of miscellaneous adventures.',
    defaultMicroCopy: 'Logged into the cosmic ledger.',
  },
};

export const FUNNY_COPY = {
  taskCompleted: 'Boom. One less thing haunting your brain.',
  taskPostponed: 'Moved to tomorrow. Tomorrow-you has been notified.',
  manyTasksCompleted: 'Look at you, actually getting things done.',
  manyTasksPostponed: 'Your to-do list has trust issues.',
  highEntertainment: 'Netflix called. It wants its employee back.',
  highProductivity: 'Okay, productivity monster. We see you.',
  emptyTimeline: 'Your timeline is suspiciously empty.',
  emptyTimelineSub: 'Something tells us you were busy doing… absolutely nothing.',
  firstActivityAdded: 'And so the evidence begins.',
  weeklyInsightsOpened: 'Time to investigate where your week disappeared.',
  highStudy: 'Your brain has officially logged overtime.',
  longEntertainment: 'That was not a break. That was a side quest.',
  consistentDays: 'Consistency detected. This is getting serious.',
  missingDays: 'Your timeline has entered witness protection.',
  whatIfBanner: 'Let’s play the dangerous game of ‘what if I actually did it?’',
};
