import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Activity, DailyReplayQuote, NavTab } from '../types';
import { generateInitialActivities, getFormattedDate } from '../data/sampleData';
import { REPLAY_QUOTES, FUNNY_COPY } from '../data/quotes';

interface ToastState {
  id: number;
  text: string;
  sub?: string;
  type?: 'default' | 'success' | 'warning';
}

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activities: Activity[];
  currentDate: string;
  setCurrentDate: (date: string) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  todayActivities: Activity[];
  addActivity: (act: Omit<Activity, 'id'>) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  postponeActivity: (id: string) => void;
  completeActivity: (id: string) => void;
  resetToSampleData: () => void;
  clearAllData: () => void;
  exportData: () => void;
  isModalOpen: boolean;
  selectedActivityForModal: Activity | null;
  openAddModal: () => void;
  openEditModal: (activity: Activity) => void;
  closeModal: () => void;
  toast: ToastState | null;
  showToast: (text: string, sub?: string, type?: 'default' | 'success' | 'warning') => void;
  currentQuote: DailyReplayQuote;
  refreshQuote: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'life_replay_activities_v2';
const THEME_KEY = 'life_replay_theme_v2';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  const [currentDate, setCurrentDate] = useState<string>(() => getFormattedDate(0));
  const [activeTab, setActiveTab] = useState<NavTab>('today');

  const [activities, setActivities] = useState<Activity[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {
          // fallback
        }
      }
    }
    return generateInitialActivities();
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivityForModal, setSelectedActivityForModal] = useState<Activity | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [currentQuote, setCurrentQuote] = useState<DailyReplayQuote>(() => {
    const randomIndex = Math.floor(Math.random() * REPLAY_QUOTES.length);
    return REPLAY_QUOTES[randomIndex];
  });

  // Save theme to localStorage and HTML attribute
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  // Persist activities
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    } catch {
      // storage full or disabled
    }
  }, [activities]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (text: string, sub?: string, type: 'default' | 'success' | 'warning' = 'default') => {
    const id = Date.now();
    setToast({ id, text, sub, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4200);
  };

  const refreshQuote = () => {
    setCurrentQuote((prev) => {
      const candidates = REPLAY_QUOTES.filter((q) => q.id !== prev.id);
      return candidates[Math.floor(Math.random() * candidates.length)];
    });
  };

  const todayActivities = useMemo(() => {
    return activities
      .filter((a) => a.date === currentDate)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [activities, currentDate]);

  const addActivity = (act: Omit<Activity, 'id'>) => {
    const newAct: Activity = {
      ...act,
      id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    };
    setActivities((prev) => [newAct, ...prev]);
    showToast('Activity Logged', FUNNY_COPY.firstActivityAdded, 'success');
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Timeline Updated', 'Changes safely etched into the record.', 'default');
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    showToast('Activity Removed', 'Eradicated from the timeline without a trace.', 'warning');
  };

  const postponeActivity = (id: string) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'postponed',
              microCopy: FUNNY_COPY.taskPostponed,
            }
          : a
      )
    );
    showToast('Task Postponed', FUNNY_COPY.taskPostponed, 'warning');
  };

  const completeActivity = (id: string) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'completed',
              microCopy: FUNNY_COPY.taskCompleted,
            }
          : a
      )
    );
    showToast('Completed!', FUNNY_COPY.taskCompleted, 'success');
  };

  const resetToSampleData = () => {
    const initial = generateInitialActivities();
    setActivities(initial);
    setCurrentDate(getFormattedDate(0));
    showToast('Evidence Restored', 'Rich sample timeline successfully reloaded.', 'success');
  };

  const clearAllData = () => {
    setActivities([]);
    showToast('Timeline Erased', FUNNY_COPY.emptyTimelineSub, 'warning');
  };

  const exportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activities, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `life-replay-evidence-${currentDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Evidence Exported', 'Your digital receipts have been downloaded.', 'success');
  };

  const openAddModal = () => {
    setSelectedActivityForModal(null);
    setIsModalOpen(true);
  };

  const openEditModal = (activity: Activity) => {
    setSelectedActivityForModal(activity);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedActivityForModal(null);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activities,
        currentDate,
        setCurrentDate,
        activeTab,
        setActiveTab,
        todayActivities,
        addActivity,
        updateActivity,
        deleteActivity,
        postponeActivity,
        completeActivity,
        resetToSampleData,
        clearAllData,
        exportData,
        isModalOpen,
        selectedActivityForModal,
        openAddModal,
        openEditModal,
        closeModal,
        toast,
        showToast,
        currentQuote,
        refreshQuote,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
