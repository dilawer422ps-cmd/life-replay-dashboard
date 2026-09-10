import React from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sun,
  Moon,
  Flame,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
import { getFormattedDate } from '../data/sampleData';

export const Header: React.FC = () => {
  const {
    currentDate,
    setCurrentDate,
    openAddModal,
    theme,
    toggleTheme,
    todayActivities,
  } = useApp();

  // Format date nicely: "THURSDAY, SEP 10, 2026"
  const formattedDisplayDate = React.useMemo(() => {
    try {
      const parts = currentDate.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);

      const weekday = d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
      const monthStr = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      return `${weekday}, ${monthStr} ${day}, ${year}`;
    } catch {
      return currentDate;
    }
  }, [currentDate]);

  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setCurrentDate(getFormattedDate(0));
  };

  const isToday = currentDate === getFormattedDate(0);

  // Dynamic personality reaction based on user behavior
  const personalityPill = React.useMemo(() => {
    const postponed = todayActivities.filter((a) => a.status === 'postponed').length;
    const completed = todayActivities.filter((a) => a.status === 'completed').length;
    const total = todayActivities.length;

    if (total === 0) {
      return { icon: Sparkles, text: 'Timeline ready for evidence' };
    }
    if (postponed >= 2) {
      return { icon: Sparkles, text: 'Your postponed list is becoming a historical archive.' };
    }
    if (completed >= 5) {
      return { icon: Flame, text: 'Okay, productivity monster. We see you.' };
    }
    if (total >= 7) {
      return { icon: Sparkles, text: 'You are documenting EVERYTHING. Respectfully.' };
    }
    return { icon: Flame, text: 'Consistency detected. This is getting serious.' };
  }, [todayActivities]);

  return (
    <header
      id="app-header"
      className={cn(
        'sticky top-0 z-20 px-4 sm:px-8 py-4 border-b backdrop-blur-xl transition-colors duration-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3',
        theme === 'dark'
          ? 'bg-slate-950/70 border-slate-800/60'
          : 'bg-white/80 border-slate-200/80'
      )}
    >
      {/* Date Switcher & Badge */}
      <div className="flex items-center flex-wrap gap-2.5">
        <div
          className={cn(
            'flex items-center gap-1.5 p-1 rounded-2xl border',
            theme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100/90 border-slate-200'
          )}
        >
          <button
            id="prev-day-btn"
            onClick={handlePrevDay}
            aria-label="Previous day"
            className={cn(
              'p-1.5 rounded-xl transition-colors hover:bg-slate-700/20 active:scale-95',
              theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
            )}
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-2 px-2.5">
            <CalendarIcon size={15} className="text-cyan-400 shrink-0" />
            <span className="font-mono-code text-xs sm:text-sm font-semibold tracking-wider">
              {formattedDisplayDate}
            </span>
          </div>

          <button
            id="next-day-btn"
            onClick={handleNextDay}
            aria-label="Next day"
            className={cn(
              'p-1.5 rounded-xl transition-colors hover:bg-slate-700/20 active:scale-95',
              theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
            )}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {!isToday && (
          <button
            id="jump-today-btn"
            onClick={handleToday}
            className="text-xs px-2.5 py-1.5 rounded-xl font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
          >
            Jump to Today
          </button>
        )}

        {/* Personality banner pill */}
        <div
          className={cn(
            'hidden lg:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border animate-fadeIn',
            theme === 'dark'
              ? 'bg-slate-900/60 border-slate-800 text-slate-300'
              : 'bg-slate-100 border-slate-200 text-slate-700'
          )}
        >
          <personalityPill.icon size={13} className="text-amber-400 shrink-0" />
          <span className="truncate max-w-[320px]">{personalityPill.text}</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center justify-end gap-2.5">
        <button
          id="header-theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle light or dark theme"
          className={cn(
            'hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95',
            theme === 'dark'
              ? 'bg-slate-900/80 border-slate-800 text-amber-300 hover:bg-slate-800'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          )}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
        </button>

        <button
          id="header-add-btn"
          onClick={openAddModal}
          className="flex items-center gap-2 py-2 px-3.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-150 active:scale-95 cursor-pointer"
        >
          <Plus size={16} className="stroke-[2.5]" />
          <span>+ Add Something</span>
        </button>
      </div>
    </header>
  );
};
