import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  CheckCircle2,
  PauseCircle,
  Edit3,
  Plus,
  Filter,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Activity, ActivityCategory } from '../types';
import { CATEGORY_META, FUNNY_COPY } from '../data/quotes';
import { formatMinutes } from '../utils/calculations';
import { cn } from '../utils/cn';

export const TimelineView: React.FC = () => {
  const {
    todayActivities,
    openAddModal,
    openEditModal,
    completeActivity,
    postponeActivity,
    resetToSampleData,
    theme,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'All'>('All');

  const filteredActivities = todayActivities.filter((act) => {
    if (selectedCategory === 'All') return true;
    return act.category === selectedCategory;
  });

  const categoriesList: (ActivityCategory | 'All')[] = [
    'All',
    'Work',
    'Study',
    'Entertainment',
    'Exercise',
    'Social',
    'Personal',
  ];

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto animate-fadeIn">
      {/* Page Title & Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono-code font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
            <Clock size={13} />
            <span>Living Vertical Log</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight">
            THE LIVING TIMELINE
          </h1>
          <p className={cn('text-sm font-medium mt-1', theme === 'dark' ? 'text-slate-400' : 'text-slate-600')}>
            Every heartbeat accounted for. Floating chronometric evidence.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} className="stroke-[2.5]" />
          <span>+ Add Something</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter size={14} className="text-slate-400 shrink-0 ml-1 mr-1" />
        {categoriesList.map((cat) => {
          const isSel = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150',
                isSel
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/30 ring-2 ring-cyan-400/40'
                  : theme === 'dark'
                  ? 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              )}
            >
              {cat !== 'All' && (
                <span className="mr-1.5">{CATEGORY_META[cat as ActivityCategory]?.emoji}</span>
              )}
              {cat}
            </button>
          );
        })}
      </div>

      {/* GLOWING VERTICAL TIMELINE CONTAINER */}
      {filteredActivities.length > 0 ? (
        <div className="relative pl-6 sm:pl-12 my-6">
          {/* Glowing Vertical Line */}
          <div className="absolute left-2.5 sm:left-5 top-4 bottom-4 w-0.5 bg-gradient-to-b from-cyan-500 via-indigo-500 to-purple-600 shadow-[0_0_12px_rgba(6,182,212,0.6)]" />

          <div className="space-y-6 sm:space-y-8">
            <AnimatePresence mode="popLayout">
              {filteredActivities.map((act, index) => {
                const meta = CATEGORY_META[act.category];

                return (
                  <motion.div
                    key={act.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative group"
                  >
                    {/* Glowing Node Dot & Time Badge */}
                    <div className="absolute -left-6 sm:-left-12 top-4 flex items-center">
                      <div className="relative flex items-center justify-center">
                        <span
                          className="w-3.5 h-3.5 rounded-full border-2 border-slate-950 dark:border-slate-950 transition-all duration-200 group-hover:scale-125"
                          style={{
                            backgroundColor: meta.color,
                            boxShadow: `0 0 10px ${meta.color}`,
                          }}
                        />
                        <span
                          className="absolute w-5 h-5 rounded-full -z-10 animate-ping opacity-30"
                          style={{ backgroundColor: meta.color }}
                        />
                      </div>
                    </div>

                    {/* Floating Activity Card */}
                    <motion.div
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      onClick={() => openEditModal(act)}
                      className={cn(
                        'rounded-3xl p-5 sm:p-6 border cursor-pointer transition-all duration-200 relative overflow-hidden backdrop-blur-md',
                        theme === 'dark'
                          ? 'bg-slate-900/80 border-slate-800/90 shadow-xl shadow-black/40 hover:border-cyan-500/40 hover:shadow-cyan-500/10'
                          : 'bg-white/95 border-slate-200/90 shadow-lg shadow-slate-200/50 hover:border-cyan-300'
                      )}
                    >
                      {/* Top bar with time and category badge */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono-code text-xs sm:text-sm font-bold text-cyan-400">
                            {act.startTime}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="font-mono-code text-xs font-semibold text-slate-400">
                            {formatMinutes(act.durationMinutes)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5',
                              meta.badgeBg
                            )}
                          >
                            <span>{meta.emoji}</span>
                            <span>{act.category}</span>
                          </span>

                          <span
                            className={cn(
                              'text-[11px] font-mono-code font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border',
                              act.status === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : act.status === 'postponed'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                            )}
                          >
                            {act.status}
                          </span>
                        </div>
                      </div>

                      {/* Main Title */}
                      <h3 className="text-base sm:text-lg font-display font-bold tracking-tight mb-1 text-slate-100 dark:text-white">
                        {act.title}
                      </h3>

                      {/* Humor Tagline Quote */}
                      <div className="mt-2.5 pt-2.5 border-t border-inherit/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <p className="text-xs sm:text-sm font-medium italic text-slate-300 dark:text-slate-300">
                          “{act.microCopy || meta.defaultMicroCopy}”
                        </p>

                        {/* Fast inline status actions */}
                        <div
                          className="flex items-center gap-1.5 self-end sm:self-auto"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {act.status !== 'completed' && (
                            <button
                              onClick={() => completeActivity(act.id)}
                              title="Mark Completed"
                              className="p-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                            >
                              <CheckCircle2 size={15} />
                            </button>
                          )}
                          {act.status !== 'postponed' && (
                            <button
                              onClick={() => postponeActivity(act.id)}
                              title="Postpone"
                              className="p-1.5 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors"
                            >
                              <PauseCircle size={15} />
                            </button>
                          )}
                          <button
                            onClick={() => openEditModal(act)}
                            title="Edit Details"
                            className={cn(
                              'p-1.5 rounded-lg border transition-colors',
                              theme === 'dark'
                                ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                            )}
                          >
                            <Edit3 size={15} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* Empty State with Prompt Requirements */
        <div
          className={cn(
            'p-12 rounded-3xl border text-center my-8 space-y-4 max-w-lg mx-auto',
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
          )}
        >
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400">
            <Sparkles size={28} />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold">Nothing to replay yet.</h3>
            <p className="text-sm text-slate-400 mt-1">Give us some evidence.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={openAddModal}
              className="px-5 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 shadow-md shadow-cyan-500/20"
            >
              + Add Something
            </button>
            <button
              onClick={resetToSampleData}
              className="px-5 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm border border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Load Sample Evidence
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
