import React from 'react';
import { motion } from 'motion/react';
import {
  Film,
  Sparkles,
  TrendingUp,
  Tv,
  CheckCircle2,
  AlertOctagon,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getWeeklyEpisodeStats, formatMinutes } from '../utils/calculations';
import { CATEGORY_META } from '../data/quotes';
import { ActivityCategory } from '../types';
import { cn } from '../utils/cn';

export const InsightsView: React.FC = () => {
  const { activities, resetToSampleData, openAddModal, theme } = useApp();

  const weeklyStats = getWeeklyEpisodeStats(activities);
  const hasData = activities.length > 0;

  // Compute category totals across the entire week
  const categoryTotals: Record<ActivityCategory, number> = {
    Work: 0,
    Study: 0,
    Entertainment: 0,
    Exercise: 0,
    Social: 0,
    Personal: 0,
    Other: 0,
  };

  let totalWeekMinutes = 0;
  for (const act of activities) {
    categoryTotals[act.category] += act.durationMinutes;
    totalWeekMinutes += act.durationMinutes;
  }

  const sortedCategories = (Object.keys(categoryTotals) as ActivityCategory[])
    .map((cat) => ({
      category: cat,
      minutes: categoryTotals[cat],
      percentage: totalWeekMinutes > 0 ? Math.round((categoryTotals[cat] / totalWeekMinutes) * 100) : 0,
      meta: CATEGORY_META[cat],
    }))
    .sort((a, b) => b.minutes - a.minutes);

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto animate-fadeIn">
      {/* Top Banner: Season Recap Header */}
      <section
        id="weekly-season-recap"
        className={cn(
          'relative rounded-3xl p-6 sm:p-10 border overflow-hidden transition-all duration-300',
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 border-slate-800/80 shadow-2xl backdrop-blur-xl'
            : 'bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 border-slate-200/80 shadow-xl backdrop-blur-xl'
        )}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Film size={16} />
            </span>
            <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-purple-400">
              CHRONO-SEASON ARCHIVE
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight uppercase">
            YOUR WEEK — EPISODE {weeklyStats.episodeNumber}
          </h1>
          <p
            className={cn(
              'text-base sm:text-lg font-medium tracking-tight mt-1 italic',
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            )}
          >
            “Previously on Life Replay…”
          </p>

          {hasData ? (
            <>
              {/* Animated Statistics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8">
                {/* FOCUS */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={cn(
                    'p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1',
                    theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  )}
                >
                  <div className="flex items-center justify-between mb-2 text-indigo-400">
                    <span className="text-[11px] font-mono-code font-bold tracking-widest uppercase">
                      FOCUS
                    </span>
                    <TrendingUp size={16} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono-code font-black text-slate-100 dark:text-white">
                    {weeklyStats.focusTimeText}
                  </div>
                  <span className="text-xs text-slate-400 mt-1 block">Work + Study + Exercise</span>
                </motion.div>

                {/* ENTERTAINMENT */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={cn(
                    'p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1',
                    theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  )}
                >
                  <div className="flex items-center justify-between mb-2 text-rose-400">
                    <span className="text-[11px] font-mono-code font-bold tracking-widest uppercase">
                      ENTERTAINMENT
                    </span>
                    <Tv size={16} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono-code font-black text-rose-400">
                    {weeklyStats.entertainmentTimeText}
                  </div>
                  <span className="text-xs text-slate-400 mt-1 block">Recreation & Dopamine</span>
                </motion.div>

                {/* COMPLETED */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={cn(
                    'p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1',
                    theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  )}
                >
                  <div className="flex items-center justify-between mb-2 text-emerald-400">
                    <span className="text-[11px] font-mono-code font-bold tracking-widest uppercase">
                      COMPLETED
                    </span>
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono-code font-black text-emerald-400">
                    {weeklyStats.completedCount}
                  </div>
                  <span className="text-xs text-slate-400 mt-1 block">Verified accomplishments</span>
                </motion.div>

                {/* POSTPONED */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={cn(
                    'p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1',
                    theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  )}
                >
                  <div className="flex items-center justify-between mb-2 text-amber-400">
                    <span className="text-[11px] font-mono-code font-bold tracking-widest uppercase">
                      POSTPONED
                    </span>
                    <AlertOctagon size={16} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono-code font-black text-amber-400">
                    {weeklyStats.postponedCount}
                  </div>
                  <span className="text-xs text-slate-400 mt-1 block">Passed to future self</span>
                </motion.div>
              </div>

              {/* THIS WEEK'S PLOT TWIST */}
              <div
                className={cn(
                  'p-5 sm:p-6 rounded-2xl border relative overflow-hidden',
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-purple-950/50 via-slate-950/80 to-indigo-950/40 border-purple-500/30'
                    : 'bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-purple-300/60'
                )}
              >
                <div className="flex items-center gap-2 text-purple-400 mb-1.5">
                  <Sparkles size={16} />
                  <span className="font-mono-code text-xs font-bold uppercase tracking-wider">
                    THIS WEEK'S PLOT TWIST
                  </span>
                </div>
                <p className="text-base sm:text-lg font-medium leading-relaxed italic text-slate-200 dark:text-slate-100">
                  “{weeklyStats.plotTwist}”
                </p>
              </div>
            </>
          ) : (
            <div className="py-12 text-center space-y-3">
              <p className="text-lg font-semibold text-slate-400">
                “This episode is still loading.”
              </p>
              <p className="text-xs text-slate-500">Collect more logs across the week to unlock the full season recap.</p>
              <div className="pt-2">
                <button
                  onClick={resetToSampleData}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
                >
                  Load Sample Evidence
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Daily Rhythm Bars (Mon - Sun) */}
      {hasData && (
        <section
          className={cn(
            'p-6 sm:p-8 rounded-3xl border transition-all duration-200',
            theme === 'dark' ? 'bg-slate-900/60 border-slate-800/80 backdrop-blur-md' : 'bg-white border-slate-200 shadow-sm'
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-cyan-400">
                EPISODE TIMELINE
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-bold tracking-tight">
                7-Day Chrono-Distribution
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono-code">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-2.5 h-2.5 rounded bg-indigo-500" /> Focus Time
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded bg-rose-500" /> Entertainment
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end pt-8 pb-4 h-64 border-b border-inherit">
            {weeklyStats.dailyBreakdown.map((day, i) => {
              const maxVal = 400; // max minutes benchmark
              const focusHeight = Math.min(100, Math.round((day.focusMinutes / maxVal) * 100));
              const entHeight = Math.min(100, Math.round((day.entMinutes / maxVal) * 100));

              return (
                <div key={day.dayName} className="flex flex-col items-center h-full justify-end group">
                  <div className="w-full max-w-[42px] flex items-end justify-center gap-1 h-full">
                    {/* Focus Bar */}
                    <div
                      style={{ height: `${focusHeight}%` }}
                      className="w-1/2 rounded-t-lg bg-gradient-to-t from-indigo-600 to-cyan-400 transition-all group-hover:brightness-125"
                      title={`${day.dayName} Focus: ${formatMinutes(day.focusMinutes)}`}
                    />
                    {/* Entertainment Bar */}
                    <div
                      style={{ height: `${entHeight}%` }}
                      className="w-1/2 rounded-t-lg bg-gradient-to-t from-rose-600 to-rose-400 transition-all group-hover:brightness-125"
                      title={`${day.dayName} Entertainment: ${formatMinutes(day.entMinutes)}`}
                    />
                  </div>
                  <span className="text-xs font-mono-code font-bold mt-2 text-slate-400 group-hover:text-cyan-400 transition-colors">
                    {day.dayName}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 font-mono-code mt-4 text-center">
            * Consistent focus detected on Tuesday and Friday. Weekend show relaxed recreational shifts.
          </p>
        </section>
      )}

      {/* Category Breakdown Table */}
      {hasData && (
        <section
          className={cn(
            'p-6 sm:p-8 rounded-3xl border transition-all duration-200',
            theme === 'dark' ? 'bg-slate-900/60 border-slate-800/80 backdrop-blur-md' : 'bg-white border-slate-200 shadow-sm'
          )}
        >
          <h3 className="text-lg sm:text-xl font-display font-bold tracking-tight mb-5">
            Macro Category Distribution (Full History)
          </h3>

          <div className="space-y-3.5">
            {sortedCategories.map((item) => (
              <div
                key={item.category}
                className={cn(
                  'p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:translate-x-1',
                  theme === 'dark' ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.meta.emoji}</span>
                  <div>
                    <h4 className="font-semibold text-sm">{item.category}</h4>
                    <p className="text-xs text-slate-400 italic">“{item.meta.wittyComment}”</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-32 sm:w-48 bg-slate-800/50 rounded-full h-2.5 overflow-hidden">
                    <div
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.meta.color,
                      }}
                      className="h-full rounded-full"
                    />
                  </div>
                  <div className="text-right min-w-[70px]">
                    <span className="font-mono-code text-sm font-bold text-cyan-400">
                      {formatMinutes(item.minutes)}
                    </span>
                    <span className="block text-[10px] font-mono-code text-slate-400">
                      {item.percentage}% of total
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
