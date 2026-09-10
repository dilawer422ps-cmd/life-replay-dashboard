import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  Fingerprint,
  FileSearch,
  CheckCheck,
  AlertTriangle,
  Zap,
  Clock,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generatePatternClues } from '../utils/calculations';
import { ClueItem } from '../types';
import { cn } from '../utils/cn';

export const PatternsView: React.FC = () => {
  const { activities, resetToSampleData, openAddModal, theme } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'focus' | 'distraction' | 'rhythm'>('all');

  const clues = generatePatternClues(activities);

  const filteredClues = clues.filter((c) => {
    if (activeFilter === 'all') return true;
    return c.type === activeFilter;
  });

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto animate-fadeIn">
      {/* Detective Header */}
      <section
        id="pattern-detective-header"
        className={cn(
          'relative rounded-3xl p-6 sm:p-10 border overflow-hidden transition-all duration-300',
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/20 border-slate-800/80 shadow-2xl backdrop-blur-xl'
            : 'bg-gradient-to-br from-white via-slate-50 to-amber-50/40 border-slate-200/80 shadow-xl backdrop-blur-xl'
        )}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <FileSearch size={16} />
              </span>
              <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-amber-400">
                CASE FILE #904-REPLAY
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-code uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                CASE ACTIVE
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight uppercase text-slate-100 dark:text-white">
              THE PATTERN DETECTIVE
            </h1>
            <p
              className={cn(
                'text-base sm:text-lg font-medium tracking-tight mt-1',
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              )}
            >
              Your habits left clues. We found them.
            </p>
          </div>

          {/* Animated Magnifying Glass Graphic Card */}
          <div
            className={cn(
              'flex items-center gap-3 p-3.5 rounded-2xl border backdrop-blur-md',
              theme === 'dark' ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            )}
          >
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Search size={22} className="animate-pulse" />
              <Fingerprint size={12} className="absolute text-amber-400/60" />
            </div>
            <div>
              <span className="font-mono-code text-xs font-bold text-slate-300 block">
                {clues.length} CLUES DISCOVERED
              </span>
              <span className="text-[11px] text-amber-400 font-mono-code">
                Forensics confidence: 88%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(
          [
            { id: 'all', label: 'All Clues' },
            { id: 'focus', label: 'Focus Windows' },
            { id: 'distraction', label: 'Distractions' },
            { id: 'rhythm', label: 'Energy Rhythms' },
          ] as const
        ).map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150',
              activeFilter === f.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : theme === 'dark'
                ? 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* CLUES EVIDENCE CARDS GRID */}
      {filteredClues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClues.map((clue, index) => (
            <motion.div
              key={clue.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className={cn(
                'rounded-3xl p-6 sm:p-7 border relative overflow-hidden transition-all duration-200 flex flex-col justify-between group backdrop-blur-md',
                theme === 'dark'
                  ? 'bg-slate-900/80 border-slate-800/90 shadow-xl shadow-black/40 hover:border-amber-500/40'
                  : 'bg-white/95 border-slate-200/90 shadow-lg shadow-slate-200/50 hover:border-amber-400'
              )}
            >
              {/* Top Bar: Clue Number & Tag */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-mono-code font-bold text-sm">
                      🔎 CLUE #{clue.number}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  </div>
                  <span
                    className={cn(
                      'text-[10px] uppercase font-mono-code font-bold px-2 py-0.5 rounded-full border',
                      clue.type === 'focus'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        : clue.type === 'distraction'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    )}
                  >
                    {clue.type}
                  </span>
                </div>

                {/* Clue Claim Title */}
                <h3 className="text-lg sm:text-xl font-display font-bold tracking-tight mb-3 text-slate-100 dark:text-white">
                  “{clue.title}”
                </h3>

                {/* Evidence Details */}
                <div
                  className={cn(
                    'p-3.5 rounded-2xl border text-xs sm:text-sm font-medium leading-relaxed mb-6',
                    theme === 'dark'
                      ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  )}
                >
                  <span className="font-mono-code text-[11px] font-bold text-amber-400 uppercase block mb-1">
                    VERIFIED EVIDENCE:
                  </span>
                  “{clue.evidence}”
                </div>
              </div>

              {/* Confidence Meter */}
              <div className="pt-4 border-t border-inherit/60">
                <div className="flex items-center justify-between text-xs font-mono-code mb-1.5">
                  <span className="text-slate-400 uppercase font-semibold">CONFIDENCE</span>
                  <span className="text-amber-400 font-bold">{clue.confidence}%</span>
                </div>
                <div className="w-full bg-slate-800/60 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${clue.confidence}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400 shadow-sm"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Empty State with Prompt Requirement: "We need more clues, detective." */
        <div
          className={cn(
            'p-12 rounded-3xl border text-center my-8 space-y-4 max-w-lg mx-auto',
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
          )}
        >
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
            <Search size={28} className="animate-bounce" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold">We need more clues, detective.</h3>
            <p className="text-sm text-slate-400 mt-1">
              Log activities across multiple days to unlock recurring behavioral patterns.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={openAddModal}
              className="px-5 py-2.5 rounded-2xl font-semibold text-xs text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 shadow-md"
            >
              + Add Something
            </button>
            <button
              onClick={resetToSampleData}
              className="px-5 py-2.5 rounded-2xl font-semibold text-xs border border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Load Sample Evidence
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
