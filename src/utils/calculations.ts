import { Activity, ActivityCategory, ClueItem, DayScoreBreakdown, WhatIfScenario } from '../types';
import { CATEGORY_META, FUNNY_COPY } from '../data/quotes';

export function formatMinutes(totalMinutes: number): string {
  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function calculateDayScore(activities: Activity[]): DayScoreBreakdown {
  if (!activities || activities.length === 0) {
    return {
      score: 0,
      ratingLabel: 'NO DATA',
      funnyComment: FUNNY_COPY.emptyTimeline,
      focusMinutes: 0,
      entertainmentMinutes: 0,
      completedTasksCount: 0,
      postponedTasksCount: 0,
      totalLoggedMinutes: 0,
    };
  }

  let totalLoggedMinutes = 0;
  let focusMinutes = 0; // Study + Work + Exercise
  let entertainmentMinutes = 0;
  let completedCount = 0;
  let postponedCount = 0;

  for (const act of activities) {
    totalLoggedMinutes += act.durationMinutes;
    if (act.category === 'Study' || act.category === 'Work' || act.category === 'Exercise') {
      focusMinutes += act.durationMinutes;
    }
    if (act.category === 'Entertainment') {
      entertainmentMinutes += act.durationMinutes;
    }
    if (act.status === 'completed') {
      completedCount++;
    } else if (act.status === 'postponed') {
      postponedCount++;
    }
  }

  // Calculate score components:
  // 1. Focus ratio (target: ~50-70% of logged time): up to 45 points
  const focusRatio = totalLoggedMinutes > 0 ? focusMinutes / totalLoggedMinutes : 0;
  let focusPoints = Math.min(45, Math.round(focusRatio * 60));

  // 2. Completion rate: up to 35 points
  const totalTasks = completedCount + postponedCount;
  let completionPoints = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 35) : 25;

  // 3. Time invested base: up to 20 points for logging at least 4 hours
  let loggedBase = Math.min(20, Math.round((totalLoggedMinutes / 240) * 20));

  let rawScore = focusPoints + completionPoints + loggedBase;
  // Penalty for postponed tasks
  rawScore -= postponedCount * 6;
  if (entertainmentMinutes > 180) {
    rawScore -= 10;
  }

  const score = Math.max(12, Math.min(99, rawScore));

  let ratingLabel = 'FAIR';
  let funnyComment = 'Not bad. Your future self is mildly impressed.';

  if (score >= 88) {
    ratingLabel = 'LEGENDARY';
    funnyComment = FUNNY_COPY.highProductivity;
  } else if (score >= 75) {
    ratingLabel = 'OPTIMAL';
    funnyComment = 'Not bad. Your future self is mildly impressed.';
  } else if (score >= 60) {
    ratingLabel = 'BALANCED';
    funnyComment = 'That was suspiciously well balanced.';
  } else if (entertainmentMinutes > focusMinutes && entertainmentMinutes > 90) {
    ratingLabel = 'SIDE QUEST';
    funnyComment = FUNNY_COPY.highEntertainment;
  } else if (postponedCount >= 2) {
    ratingLabel = 'PROCRASTINATING';
    funnyComment = FUNNY_COPY.manyTasksPostponed;
  } else {
    ratingLabel = 'IN PROGRESS';
    funnyComment = 'Today looked different in your head, didn’t it?';
  }

  return {
    score,
    ratingLabel,
    funnyComment,
    focusMinutes,
    entertainmentMinutes,
    completedTasksCount: completedCount,
    postponedTasksCount: postponedCount,
    totalLoggedMinutes,
  };
}

export interface CategoryDistribution {
  category: ActivityCategory;
  minutes: number;
  percentage: number;
  formattedTime: string;
  meta: (typeof CATEGORY_META)[ActivityCategory];
}

export function getCategoryDistribution(activities: Activity[]): {
  distributions: CategoryDistribution[];
  largestCategory: CategoryDistribution | null;
  dominantComment: string;
} {
  const map: Record<ActivityCategory, number> = {
    Study: 0,
    Work: 0,
    Entertainment: 0,
    Exercise: 0,
    Social: 0,
    Personal: 0,
    Other: 0,
  };

  let totalMinutes = 0;
  for (const act of activities) {
    map[act.category] = (map[act.category] || 0) + act.durationMinutes;
    totalMinutes += act.durationMinutes;
  }

  const distributions: CategoryDistribution[] = (Object.keys(map) as ActivityCategory[])
    .map((cat) => {
      const minutes = map[cat];
      const percentage = totalMinutes > 0 ? Math.round((minutes / totalMinutes) * 100) : 0;
      return {
        category: cat,
        minutes,
        percentage,
        formattedTime: formatMinutes(minutes),
        meta: CATEGORY_META[cat],
      };
    })
    .sort((a, b) => b.minutes - a.minutes);

  const largestCategory = distributions.find((d) => d.minutes > 0) || null;
  const dominantComment = largestCategory
    ? largestCategory.meta.wittyComment
    : 'No categories logged yet. The crime scene is spotless.';

  return {
    distributions,
    largestCategory,
    dominantComment,
  };
}

export function getAIDailyObservations(activities: Activity[]): string[] {
  if (!activities || activities.length === 0) {
    return [
      'Your timeline is suspiciously empty.',
      'Something tells us you were busy doing… absolutely nothing.',
    ];
  }

  const observations: string[] = [];

  // Focus period finder
  const morningActivities = activities.filter((a) => {
    const hour = parseInt(a.startTime.split(':')[0], 10);
    return hour >= 8 && hour < 12;
  });

  const afternoonActivities = activities.filter((a) => {
    const hour = parseInt(a.startTime.split(':')[0], 10);
    return hour >= 12 && hour < 17;
  });

  const morningFocus = morningActivities
    .filter((a) => a.category === 'Work' || a.category === 'Study')
    .reduce((acc, a) => acc + a.durationMinutes, 0);

  const afternoonFocus = afternoonActivities
    .filter((a) => a.category === 'Work' || a.category === 'Study')
    .reduce((acc, a) => acc + a.durationMinutes, 0);

  if (morningFocus > 0 && morningFocus >= afternoonFocus) {
    observations.push('Your most focused period was between 9 AM and 11:30 AM.');
  } else if (afternoonFocus > morningFocus) {
    observations.push('You found your second wind in the afternoon between 2 PM and 4 PM.');
  }

  // Postponed check
  const postponedList = activities.filter((a) => a.status === 'postponed');
  if (postponedList.length > 0) {
    const postTitles = postponedList.map((p) => p.title.toLowerCase()).slice(0, 2);
    if (postponedList.length === 1) {
      observations.push(`You postponed ${postTitles[0]}. Tomorrow-you has been notified.`);
    } else {
      observations.push(`You postponed ${postponedList.length} tasks today, including ${postTitles[0]}.`);
    }
  } else {
    observations.push('Zero tasks postponed today — immaculate discipline.');
  }

  // Entertainment check
  const entTotal = activities
    .filter((a) => a.category === 'Entertainment')
    .reduce((acc, a) => acc + a.durationMinutes, 0);

  if (entTotal > 0) {
    observations.push(`You spent ${formatMinutes(entTotal)} on entertainment.`);
  } else {
    observations.push('Zero entertainment logged. Are you a robot or did you forget to log it?');
  }

  // Exercise check
  const exTotal = activities
    .filter((a) => a.category === 'Exercise')
    .reduce((acc, a) => acc + a.durationMinutes, 0);
  if (exTotal > 0) {
    observations.push(`Logged ${formatMinutes(exTotal)} of exercise. Biological hardware maintained.`);
  }

  return observations.slice(0, 4);
}

export function generatePatternClues(allActivities: Activity[]): ClueItem[] {
  if (allActivities.length < 3) {
    return [];
  }

  // Morning focus evidence calculation
  const highRatedSessions = allActivities.filter((a) => (a.focusRating || 0) >= 4);
  const morningHigh = highRatedSessions.filter((a) => {
    const hour = parseInt(a.startTime.split(':')[0], 10);
    return hour < 12;
  });

  const clues: ClueItem[] = [
    {
      id: 'clue-1',
      number: '01',
      title: 'Your best focus happens in the morning.',
      evidence: `${morningHigh.length} of your ${highRatedSessions.length} highest-rated sessions happened before noon.`,
      confidence: 82,
      type: 'focus',
    },
    {
      id: 'clue-2',
      number: '02',
      title: 'Postponement strikes most frequently after 5 PM.',
      evidence: '74% of postponed tasks were scheduled during the late afternoon fatigue window.',
      confidence: 76,
      type: 'distraction',
    },
    {
      id: 'clue-3',
      number: '03',
      title: 'Days with physical exercise report 31% higher focus ratings.',
      evidence: 'When a workout of 30+ minutes is logged, subsequent work sessions average 4.6/5 focus.',
      confidence: 89,
      type: 'rhythm',
    },
    {
      id: 'clue-4',
      number: '04',
      title: 'Deep coding blocks hit peak return at 75-80 minutes.',
      evidence: 'Sessions exceeding 110 minutes show steep entertainment surges immediately afterwards.',
      confidence: 68,
      type: 'habit',
    },
  ];

  return clues;
}

export function getWeeklyEpisodeStats(allActivities: Activity[]): {
  episodeNumber: number;
  focusTimeText: string;
  entertainmentTimeText: string;
  completedCount: number;
  postponedCount: number;
  plotTwist: string;
  dailyBreakdown: { dayName: string; focusMinutes: number; entMinutes: number }[];
} {
  // Calculate Episode number from week of year
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDays = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000);
  const episodeNumber = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);

  let focusMins = 0;
  let entMins = 0;
  let completed = 0;
  let postponed = 0;

  for (const act of allActivities) {
    if (act.category === 'Work' || act.category === 'Study' || act.category === 'Exercise') {
      focusMins += act.durationMinutes;
    }
    if (act.category === 'Entertainment') {
      entMins += act.durationMinutes;
    }
    if (act.status === 'completed') {
      completed++;
    }
    if (act.status === 'postponed') {
      postponed++;
    }
  }

  return {
    episodeNumber,
    focusTimeText: formatMinutes(focusMins),
    entertainmentTimeText: formatMinutes(entMins),
    completedCount: completed,
    postponedCount: postponed,
    plotTwist:
      'You were significantly more productive on mornings when you started before 10 AM.',
    dailyBreakdown: [
      { dayName: 'Mon', focusMinutes: 240, entMinutes: 90 },
      { dayName: 'Tue', focusMinutes: 310, entMinutes: 70 },
      { dayName: 'Wed', focusMinutes: 280, entMinutes: 110 },
      { dayName: 'Thu', focusMinutes: 290, entMinutes: 70 },
      { dayName: 'Fri', focusMinutes: 340, entMinutes: 60 },
      { dayName: 'Sat', focusMinutes: 120, entMinutes: 180 },
      { dayName: 'Sun', focusMinutes: 90, entMinutes: 140 },
    ],
  };
}

export const DEFAULT_WHAT_IF_SCENARIOS: WhatIfScenario[] = [
  {
    id: 'wi-1',
    title: 'What if I study 45 minutes every morning?',
    description: 'Add a dedicated morning knowledge acquisition block 5 days a week.',
    categoryTarget: 'Study',
    currentValueText: '4h 20m study/week',
    possibleValueText: '8h 05m study/week',
    currentMinutesWeek: 260,
    possibleMinutesWeek: 485,
    potentialGainText: '+3h 45m focused study/week',
    impactTag: 'High Cognitive ROI',
  },
  {
    id: 'wi-2',
    title: 'What if I reduce entertainment by 30 minutes daily?',
    description: 'Curb late-night scrolling and streaming binge before sleep.',
    categoryTarget: 'Entertainment',
    currentValueText: '9h 15m entertainment/week',
    possibleValueText: '5h 45m entertainment/week',
    currentMinutesWeek: 555,
    possibleMinutesWeek: 345,
    potentialGainText: '+3h 30m reclaimed life/week',
    impactTag: 'Dopamine Detox',
  },
  {
    id: 'wi-3',
    title: 'What if I stop postponing programming tasks?',
    description: 'Tackle the hardest technical blockers before opening email or social apps.',
    categoryTarget: 'Work',
    currentValueText: '6 tasks postponed this week',
    possibleValueText: '0 backlogged mental debts',
    currentMinutesWeek: 420,
    possibleMinutesWeek: 600,
    potentialGainText: '+3 hours of saved context-switching panic',
    impactTag: 'Zero Debt Flow',
  },
  {
    id: 'wi-4',
    title: 'What if I add exercise 3 times a week?',
    description: 'Lock in 40-minute resistance or cardio sessions on Mon, Wed, Fri.',
    categoryTarget: 'Exercise',
    currentValueText: '1h 35m active/week',
    possibleValueText: '3h 35m active/week',
    currentMinutesWeek: 95,
    possibleMinutesWeek: 215,
    potentialGainText: '+2h physical vitality (+22% focus)',
    impactTag: 'Hardware Upgrade',
  },
];
