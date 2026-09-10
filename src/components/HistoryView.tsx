import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Archive,
  Search,
  Calendar,
  Filter,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActivityCategory } from '../types';
import { CATEGORY_META } from '../data/quotes';
import { calculateDayScore, formatMinutes } from '../utils/calculations';
import { cn } from '../utils/cn';

export const HistoryView: React.FC = () => {
  const { activities, setCurrentDate, setActiveTab, openEditModal, theme } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'All'>('All');

  // Group activities by date
  const dateGroups = React.useMemo(() => {
    const map = new Map<string, typeof activities>();
    for (const act of activities) {
      const list = map.get(act.date) || [];
      list.push(act);
      map.set(act.date, list);
    }
    // Sort dates descending
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [activities]);

  const filteredGroups = dateGroups
    .map(([date, acts]) => {
      const filteredActs = acts.filter((a) => {
        const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
        const matchesQuery =
          !searchQuery.trim() ||
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (a.microCopy && a.microCopy.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesQuery;
      });
      return { date, acts: filteredActs };
    })
    .filter((g) => g.acts.length > 0);

  const handleJumpToDay = (date: string) => {
    setCurrentDate(date);
    setActiveTab('today');
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <section
        id="history-archive-header"
        className={cn(
          'relative rounded-3xl p-6 sm:p-10 border overflow-hidden transition-all duration-300',
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900/60 border-slate-800/80 shadow-2xl backdrop-blur-xl'
            : 'bg-gradient-to-br from-white via-slate-50 to-slate-100 border-slate-200/80 shadow-xl backdrop-blur-xl'
        )}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Archive size={16} />
          </span>
          <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-indigo-400">
            CHRONO-REPOSITORY
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight uppercase">
          THE ARCHIVES
        </h1>
        <p
          className={cn(
            'text-base sm:text-lg font-medium tracking-tight mt-1',
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          )}
        >
          Your calendar remembers what your brain conveniently forgets.
        </p>

        {/* Search & Filter Bar */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past activities, receipts, or tags..."
              className={cn(
                'w-full pl-11 pr-4 py-3 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all',
                theme === 'dark'
                  ? 'bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
              )}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {(
              ['All', 'Work', 'Study', 'Entertainment', 'Exercise'] as (ActivityCategory | 'All')[]
            ).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3.5 py-3 rounded-2xl text-xs font-semibold whitespace-nowrap border transition-all',
                  selectedCategory === cat
                    ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold'
                    : theme === 'dark'
                    ? 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Date Groups */}
      {filteredGroups.length > 0 ? (
        <div className="space-y-8">
          {filteredGroups.map(({ date, acts }) => {
            const dayScore = calculateDayScore(acts);

            return (
              <div
                key={date}
                className={cn(
                  'rounded-3xl p-6 sm:p-8 border transition-all duration-200',
                  theme === 'dark'
                    ? 'bg-slate-900/60 border-slate-800/80 backdrop-blur-md'
                    : 'bg-white border-slate-200 shadow-sm'
                )}
              >
                {/* Date Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-inherit mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-cyan-400" />
                    <div>
                      <h3 className="font-display font-bold text-lg">{date}</h3>
                      <span className="text-xs text-slate-400 font-mono-code">
                        {acts.length} verified logs • Score: {dayScore.score}/100 ({dayScore.ratingLabel})
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleJumpToDay(date)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-400 hover:text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/10 transition-colors self-start sm:self-auto"
                  >
                    <span>Replay This Day</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* Day's Activities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {acts.map((act) => {
                    const meta = CATEGORY_META[act.category];

                    return (
                      <div
                        key={act.id}
                        onClick={() => openEditModal(act)}
                        className={cn(
                          'p-4 rounded-2xl border transition-all hover:border-cyan-500/40 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between',
                          theme === 'dark' ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                        )}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-mono-code text-xs font-bold text-cyan-400">
                              {act.startTime} ({formatMinutes(act.durationMinutes)})
                            </span>
                            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', meta.badgeBg)}>
                              {meta.emoji} {act.category}
                            </span>
                          </div>
                          <h4 className="font-semibold text-sm line-clamp-1">{act.title}</h4>
                        </div>

                        <p className="text-xs italic text-slate-400 mt-2 pt-2 border-t border-inherit">
                          “{act.microCopy || meta.defaultMicroCopy}”
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className={cn(
            'p-12 rounded-3xl border text-center my-8 space-y-3 max-w-lg mx-auto',
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
          )}
        >
          <FileText size={32} className="text-slate-500 mx-auto" />
          <h3 className="text-lg font-display font-bold">No archives match your query.</h3>
          <p className="text-xs text-slate-400">
            Try adjusting your search keywords or category filters.
          </p>
        </div>
      )}
    </div>
  );
};
