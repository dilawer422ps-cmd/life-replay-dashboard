import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Zap,
  ArrowRight,
  TrendingUp,
  Clock,
  RotateCcw,
  Sliders,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEFAULT_WHAT_IF_SCENARIOS, formatMinutes } from '../utils/calculations';
import { WhatIfScenario } from '../types';
import { cn } from '../utils/cn';

export const WhatIfView: React.FC = () => {
  const { activities, resetToSampleData, theme } = useApp();

  const [selectedScenario, setSelectedScenario] = useState<WhatIfScenario>(
    DEFAULT_WHAT_IF_SCENARIOS[0]
  );
  const [simulationMultiplier, setSimulationMultiplier] = useState<number>(1);

  const hasData = activities.length > 0;

  // Potential gain scaled with multiplier
  const currentMins = selectedScenario.currentMinutesWeek;
  const possibleMins =
    currentMins + (selectedScenario.possibleMinutesWeek - currentMins) * simulationMultiplier;
  const netGainMinutes = Math.round(possibleMins - currentMins);

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <section
        id="what-if-header"
        className={cn(
          'relative rounded-3xl p-6 sm:p-10 border overflow-hidden transition-all duration-300',
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/30 border-slate-800/80 shadow-2xl backdrop-blur-xl'
            : 'bg-gradient-to-br from-white via-slate-50 to-cyan-50/50 border-slate-200/80 shadow-xl backdrop-blur-xl'
        )}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Zap size={16} />
            </span>
            <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-cyan-400">
              CHRONO-SIMULATION LAB
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight uppercase">
            WHAT IF…?
          </h1>
          <p
            className={cn(
              'text-base sm:text-lg font-medium tracking-tight mt-1',
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            )}
          >
            Let’s mess with the timeline.
          </p>

          <p className="text-xs sm:text-sm font-medium italic text-cyan-400/90 mt-2 font-mono-code">
            “Let’s play the dangerous game of ‘what if I actually did it?’”
          </p>
        </div>
      </section>

      {hasData ? (
        <>
          {/* Selectable Scenario Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-400">
                SELECT A PARALLEL REALITY:
              </span>
              <span className="text-xs font-mono-code text-cyan-400">
                4 Presets Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEFAULT_WHAT_IF_SCENARIOS.map((scen) => {
                const isSelected = selectedScenario.id === scen.id;

                return (
                  <motion.button
                    key={scen.id}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setSelectedScenario(scen);
                      setSimulationMultiplier(1);
                    }}
                    className={cn(
                      'p-6 rounded-3xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden backdrop-blur-md',
                      isSelected
                        ? theme === 'dark'
                          ? 'bg-slate-900 border-cyan-400/80 ring-2 ring-cyan-500/30 shadow-xl shadow-cyan-500/10'
                          : 'bg-white border-cyan-500 ring-2 ring-cyan-200 shadow-xl shadow-cyan-500/10'
                        : theme === 'dark'
                        ? 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono-code font-bold uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {scen.impactTag}
                      </span>
                      {isSelected && (
                        <span className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold">
                          <Check size={14} className="stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-display font-bold tracking-tight mb-2">
                      “{scen.title}”
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{scen.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* SIMULATOR COMPARISON STAGE */}
          <section
            id="simulation-stage"
            className={cn(
              'rounded-3xl p-6 sm:p-10 border relative overflow-hidden transition-all duration-300',
              theme === 'dark'
                ? 'bg-slate-900/80 border-slate-800/90 shadow-2xl backdrop-blur-xl'
                : 'bg-white border-slate-200/90 shadow-xl backdrop-blur-xl'
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-inherit">
              <div>
                <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-cyan-400">
                  CHRONO-PROJECTION
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-bold tracking-tight mt-0.5">
                  CURRENT vs POSSIBLE
                </h2>
              </div>

              {/* Intensity Slider / Multiplier */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-code text-slate-400">Consistency Factor:</span>
                {[1, 1.5, 2].map((m) => (
                  <button
                    key={m}
                    onClick={() => setSimulationMultiplier(m)}
                    className={cn(
                      'px-3 py-1 rounded-xl text-xs font-mono-code font-semibold transition-colors',
                      simulationMultiplier === m
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : theme === 'dark'
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    )}
                  >
                    {m}x
                  </button>
                ))}
              </div>
            </div>

            {/* Comparison Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
              {/* CURRENT */}
              <div
                className={cn(
                  'p-6 rounded-2xl border flex flex-col justify-between',
                  theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-slate-400">
                    <span className="text-xs font-mono-code font-bold tracking-widest uppercase">
                      CURRENT
                    </span>
                    <Clock size={16} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono-code font-black text-slate-300 dark:text-slate-200">
                    {selectedScenario.currentValueText}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Actual logged baseline from this week's history.
                  </p>
                </div>

                <div className="w-full bg-slate-800/60 rounded-full h-3 mt-6 overflow-hidden">
                  <div
                    style={{
                      width: `${Math.min(100, (currentMins / (possibleMins || 1)) * 100)}%`,
                    }}
                    className="h-full rounded-full bg-slate-500"
                  />
                </div>
              </div>

              {/* POSSIBLE */}
              <div
                className={cn(
                  'p-6 rounded-2xl border relative overflow-hidden flex flex-col justify-between',
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-cyan-950/40 via-slate-950/80 to-indigo-950/40 border-cyan-500/40'
                    : 'bg-gradient-to-br from-cyan-50 via-white to-indigo-50 border-cyan-300'
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-cyan-400">
                    <span className="text-xs font-mono-code font-bold tracking-widest uppercase">
                      POSSIBLE
                    </span>
                    <TrendingUp size={16} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono-code font-black text-cyan-400">
                    {simulationMultiplier === 1
                      ? selectedScenario.possibleValueText
                      : `${formatMinutes(possibleMins)} / week`}
                  </div>
                  <p className="text-xs text-cyan-300/80 mt-2">
                    Achievable by executing this one micro-habit shift.
                  </p>
                </div>

                <div className="w-full bg-slate-800/60 rounded-full h-3 mt-6 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-md shadow-cyan-500/30"
                  />
                </div>
              </div>
            </div>

            {/* Potential Gain Callout */}
            <div
              className={cn(
                'p-6 rounded-2xl border text-center space-y-2',
                theme === 'dark'
                  ? 'bg-gradient-to-r from-indigo-950/60 via-slate-950/80 to-purple-950/60 border-indigo-500/40'
                  : 'bg-gradient-to-r from-indigo-50 via-white to-purple-50 border-indigo-200'
              )}
            >
              <div className="text-xs font-mono-code font-bold uppercase tracking-widest text-indigo-400">
                ESTIMATED COMPOUND IMPACT
              </div>
              <div className="text-2xl sm:text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                Potential gain: {selectedScenario.potentialGainText}
              </div>
              <p className="text-xs font-mono-code italic text-slate-400 pt-1">
                “Just an estimate. The future remains annoyingly unpredictable.”
              </p>
            </div>
          </section>
        </>
      ) : (
        /* Empty State */
        <div
          className={cn(
            'p-12 rounded-3xl border text-center my-8 space-y-4 max-w-lg mx-auto',
            theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
          )}
        >
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400">
            <RotateCcw size={28} className="animate-spin" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold">
              Time machine unavailable. Collect more data first.
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              We need a baseline of activities before running simulations.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={resetToSampleData}
              className="px-5 py-2.5 rounded-2xl font-semibold text-xs text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 shadow-md"
            >
              Load Sample Evidence
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
