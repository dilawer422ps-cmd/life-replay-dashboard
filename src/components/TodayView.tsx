import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Flame,
  CheckCircle2,
  Clock,
  Shuffle,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  calculateDayScore,
  getCategoryDistribution,
  getAIDailyObservations,
  formatMinutes,
  CategoryDistribution,
} from '../utils/calculations';
import { cn } from '../utils/cn';

export const TodayView: React.FC = () => {
  const {
    todayActivities,
    openAddModal,
    setActiveTab,
    currentQuote,
    refreshQuote,
    resetToSampleData,
    theme,
  } = useApp();

  const [hoveredCategory, setHoveredCategory] = useState<CategoryDistribution | null>(null);

  const dayScoreData = calculateDayScore(todayActivities);
  const { distributions, dominantComment, largestCategory } =
    getCategoryDistribution(todayActivities);
  const aiObservations = getAIDailyObservations(todayActivities);

  const activeCategoryToShow = hoveredCategory || largestCategory;

  // Circular Score calculation for SVG ring
  const circleRadius = 78;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset =
    circumference - (dayScoreData.score / 100) * circumference;

  const hasData = todayActivities.length > 0;

  return (
    <div className="space-y-8 pb-12 animate-fadeIn max-w-6xl mx-auto">
      {/* 1. HERO DASHBOARD */}
      <section
        id="hero-dashboard"
        className={cn(
          'relative rounded-3xl p-6 sm:p-10 border overflow-hidden transition-all duration-300',
          theme === 'dark'
            ? 'bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/80 border-slate-800/80 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl'
            : 'bg-gradient-to-b from-white via-slate-50 to-slate-100/80 border-slate-200/80 shadow-xl shadow-slate-200/60 backdrop-blur-xl'
        )}
      >
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
          {/* Left: Titles & Stats */}
          <div className="flex-1 text-center lg:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono-code font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles size={13} className="text-cyan-400" />
              <span>Personal Timeline Protocol</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight leading-[1.08] text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 dark:from-white dark:via-slate-100 dark:to-slate-300">
                YOUR DAY, REPLAYED.
              </h1>
              <p
                className={cn(
                  'text-base sm:text-xl font-medium tracking-tight mt-2',
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                )}
              >
                Let’s see what you actually did today.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            {hasData ? (
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <div
                  className={cn(
                    'px-4 py-2 rounded-2xl border flex items-center gap-2 text-xs font-semibold',
                    theme === 'dark'
                      ? 'bg-slate-950/60 border-slate-800 text-slate-300'
                      : 'bg-white border-slate-200 text-slate-700'
                  )}
                >
                  <Clock size={15} className="text-cyan-400" />
                  <span>Logged: {formatMinutes(dayScoreData.totalLoggedMinutes)}</span>
                </div>

                <div
                  className={cn(
                    'px-4 py-2 rounded-2xl border flex items-center gap-2 text-xs font-semibold',
                    theme === 'dark'
                      ? 'bg-slate-950/60 border-slate-800 text-slate-300'
                      : 'bg-white border-slate-200 text-slate-700'
                  )}
                >
                  <TrendingUp size={15} className="text-indigo-400" />
                  <span>Focus: {formatMinutes(dayScoreData.focusMinutes)}</span>
                </div>

                <div
                  className={cn(
                    'px-4 py-2 rounded-2xl border flex items-center gap-2 text-xs font-semibold',
                    theme === 'dark'
                      ? 'bg-slate-950/60 border-slate-800 text-slate-300'
                      : 'bg-white border-slate-200 text-slate-700'
                  )}
                >
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  <span>{dayScoreData.completedTasksCount} Done</span>
                  {dayScoreData.postponedTasksCount > 0 && (
                    <span className="text-amber-400 font-mono-code ml-1">
                      ({dayScoreData.postponedTasksCount} Postponed)
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <p className="text-xs text-amber-400 font-mono-code flex items-center justify-center lg:justify-start gap-1.5">
                  <AlertCircle size={14} />
                  <span>Your timeline is suspiciously empty.</span>
                </p>
              </div>
            )}
          </div>

          {/* Right: Circular Day Score */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative flex items-center justify-center w-52 h-52 sm:w-60 sm:h-60">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 190 190">
                {/* Background Ring */}
                <circle
                  cx="95"
                  cy="95"
                  r={circleRadius}
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className={theme === 'dark' ? 'text-slate-800/80' : 'text-slate-200'}
                />

                {/* Animated Score Ring */}
                {hasData && (
                  <motion.circle
                    cx="95"
                    cy="95"
                    r={circleRadius}
                    stroke="url(#scoreGradient)"
                    strokeWidth="13"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    strokeLinecap="round"
                    fill="transparent"
                    className="filter drop-shadow-[0_0_12px_rgba(6,182,212,0.45)]"
                  />
                )}

                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="50%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Inside Score Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                {hasData ? (
                  <>
                    <span className="text-5xl sm:text-6xl font-display font-black tracking-tighter text-slate-100 dark:text-white leading-none">
                      {dayScoreData.score}
                    </span>
                    <span className="text-[11px] font-mono-code font-bold tracking-widest text-cyan-400 uppercase mt-1">
                      DAY SCORE
                    </span>
                    <span
                      className={cn(
                        'text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full mt-1 border',
                        theme === 'dark'
                          ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                          : 'bg-slate-200 border-slate-300 text-slate-700'
                      )}
                    >
                      {dayScoreData.ratingLabel}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-display font-bold text-slate-500">--</span>
                    <span className="text-[11px] font-mono-code font-bold tracking-widest text-slate-500 uppercase mt-1">
                      NO DATA
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Score Feedback Comment */}
            <div className="text-center mt-3 max-w-xs">
              <p className="text-xs sm:text-sm font-medium italic text-slate-300 dark:text-slate-300">
                “{dayScoreData.funnyComment}”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. RANDOM QUOTE SYSTEM & AI DAILY REPLAY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Replay Thought Card */}
        <div
          id="replay-thought-card"
          className={cn(
            'lg:col-span-5 rounded-3xl p-6 border relative overflow-hidden flex flex-col justify-between transition-all duration-200',
            theme === 'dark'
              ? 'bg-slate-900/70 border-slate-800/80 backdrop-blur-md text-slate-100'
              : 'bg-white/90 border-slate-200/90 shadow-sm text-slate-800'
          )}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-[11px] font-mono-code font-bold tracking-widest uppercase text-cyan-400">
                  Replay Thought
                </span>
              </div>
              <button
                id="refresh-quote-btn"
                onClick={refreshQuote}
                aria-label="New replay thought"
                className={cn(
                  'p-1.5 rounded-xl border transition-colors hover:scale-105 active:scale-95 text-slate-400 hover:text-white',
                  theme === 'dark' ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
                )}
              >
                <Shuffle size={14} />
              </button>
            </div>

            <blockquote className="text-base sm:text-lg font-medium leading-relaxed tracking-tight italic">
              “{currentQuote.text}”
            </blockquote>
          </div>

          <div className="pt-4 mt-6 border-t border-inherit flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono-code text-[11px]">ARCHIVAL FREQUENCY #82</span>
            <span className="text-cyan-400 font-medium">Synced with reality</span>
          </div>
        </div>

        {/* AI Daily Replay Card (Future Self Speech Bubbles) */}
        <div
          id="ai-daily-replay-card"
          className={cn(
            'lg:col-span-7 rounded-3xl p-6 sm:p-7 border relative overflow-hidden flex flex-col justify-between transition-all duration-200',
            theme === 'dark'
              ? 'bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-slate-800/80 backdrop-blur-md'
              : 'bg-gradient-to-br from-white to-slate-50 border-slate-200/90 shadow-sm'
          )}
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-[11px] font-mono-code font-bold tracking-widest uppercase text-indigo-400">
                  TEMPORAL RECON
                </span>
                <h3 className="text-lg sm:text-xl font-display font-bold tracking-tight">
                  YOUR DAY HAS SOMETHING TO SAY.
                </h3>
              </div>

              {/* Animated AI style pulse indicator */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-[11px] font-mono-code font-semibold text-indigo-400">
                  FUTURE SELF
                </span>
              </div>
            </div>

            {/* Speech Bubbles */}
            <div className="space-y-3">
              {aiObservations.map((obs, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.12 }}
                  className={cn(
                    'p-3.5 rounded-2xl text-xs sm:text-sm font-medium border leading-relaxed relative',
                    theme === 'dark'
                      ? 'bg-slate-950/60 border-slate-800 text-slate-200 shadow-inner'
                      : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                  )}
                >
                  <span className="text-indigo-400 font-mono-code font-bold mr-2">›</span>
                  {obs}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-5 border-t border-inherit flex items-center justify-between">
            <span className="text-xs font-mono-code italic text-indigo-400">
              “Interesting. Very interesting.”
            </span>
            <button
              onClick={() => setActiveTab('insights')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
            >
              <span>Full Investigation</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. “WHERE DID MY TIME GO?” SECTION */}
      <section
        id="where-did-my-time-go"
        className={cn(
          'rounded-3xl p-6 sm:p-8 border transition-all duration-200',
          theme === 'dark'
            ? 'bg-slate-900/60 border-slate-800/80 backdrop-blur-md'
            : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <span className="text-[11px] font-mono-code font-bold tracking-widest uppercase text-cyan-400">
              CHRONO-DISSECTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight mt-0.5">
              WHERE DID MY TIME GO?
            </h2>
            <p className={cn('text-sm font-medium', theme === 'dark' ? 'text-slate-400' : 'text-slate-500')}>
              Let’s investigate.
            </p>
          </div>

          {/* Dominant witty comment */}
          <div
            className={cn(
              'px-4 py-2 rounded-2xl border text-xs sm:text-sm font-semibold max-w-md',
              theme === 'dark'
                ? 'bg-slate-950/70 border-cyan-500/30 text-cyan-300'
                : 'bg-cyan-50/80 border-cyan-300/80 text-cyan-900'
            )}
          >
            <span className="font-mono-code text-[11px] text-cyan-400 uppercase mr-1.5">VERDICT:</span>
            “{dominantComment}”
          </div>
        </div>

        {hasData ? (
          <>
            {/* Interactive Category Segment Bar */}
            <div className="w-full h-5 rounded-full overflow-hidden flex bg-slate-800/50 p-0.5 gap-1 mb-6 border border-slate-800">
              {distributions.map((dist) => {
                if (dist.minutes === 0) return null;
                return (
                  <motion.div
                    key={dist.category}
                    layout
                    onMouseEnter={() => setHoveredCategory(dist)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    style={{
                      width: `${Math.max(4, dist.percentage)}%`,
                      backgroundColor: dist.meta.color,
                    }}
                    className="h-full rounded-full cursor-pointer transition-all hover:opacity-90 hover:scale-y-110 shadow-sm"
                    title={`${dist.category}: ${dist.formattedTime} (${dist.percentage}%)`}
                  />
                );
              })}
            </div>

            {/* Hovered Category Highlight Pill */}
            {activeCategoryToShow && activeCategoryToShow.minutes > 0 && (
              <div
                className={cn(
                  'mb-6 p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn',
                  theme === 'dark'
                    ? 'bg-slate-950/50 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{activeCategoryToShow.meta.emoji}</span>
                  <div>
                    <h4 className="font-display font-bold text-base">
                      {activeCategoryToShow.category}
                    </h4>
                    <p className="text-xs text-slate-400 italic">
                      “{activeCategoryToShow.meta.wittyComment}”
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="block text-xl font-mono-code font-bold text-cyan-400">
                      {activeCategoryToShow.formattedTime}
                    </span>
                    <span className="text-[11px] font-mono-code text-slate-400">TOTAL DURATION</span>
                  </div>
                  <div className="border-l border-inherit pl-4">
                    <span className="block text-xl font-mono-code font-bold text-indigo-400">
                      {activeCategoryToShow.percentage}%
                    </span>
                    <span className="text-[11px] font-mono-code text-slate-400">OF LOGGED DAY</span>
                  </div>
                </div>
              </div>
            )}

            {/* Category Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {distributions.map((dist) => {
                const isHovered = hoveredCategory?.category === dist.category;
                return (
                  <button
                    key={dist.category}
                    onClick={() => setHoveredCategory(dist)}
                    onMouseEnter={() => setHoveredCategory(dist)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className={cn(
                      'p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden group',
                      isHovered
                        ? 'border-cyan-400/80 -translate-y-1 shadow-lg shadow-cyan-500/15'
                        : theme === 'dark'
                        ? 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                        : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{dist.meta.emoji}</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: dist.meta.color }}
                      />
                    </div>
                    <div className="font-semibold text-xs tracking-tight text-slate-200 dark:text-slate-200 truncate">
                      {dist.category}
                    </div>
                    <div className="text-base font-mono-code font-bold mt-1 text-cyan-400">
                      {dist.minutes > 0 ? dist.formattedTime : '0m'}
                    </div>
                    <div className="text-[11px] font-mono-code text-slate-400 mt-0.5">
                      {dist.percentage}%
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="py-12 text-center space-y-4">
            <p className="text-base text-slate-400">
              Nothing to replay yet. Give us some evidence.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={openAddModal}
                className="px-5 py-2.5 rounded-2xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 shadow-md"
              >
                + Add Something
              </button>
              <button
                onClick={resetToSampleData}
                className="px-5 py-2.5 rounded-2xl text-xs font-semibold border border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Load Sample Evidence
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 4. TODAY'S EVIDENCE PREVIEW / QUICK TIMELINE */}
      <section
        id="today-timeline-snippet"
        className={cn(
          'rounded-3xl p-6 sm:p-8 border transition-all duration-200',
          theme === 'dark'
            ? 'bg-slate-900/60 border-slate-800/80 backdrop-blur-md'
            : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[11px] font-mono-code font-bold tracking-widest uppercase text-cyan-400">
              CHRONOLOGICAL STRIP
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold tracking-tight">
              Today's Key Receipts
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('timeline')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/20 hover:bg-cyan-500/10 transition-colors"
          >
            <span>Open Living Timeline</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {hasData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {todayActivities.slice(0, 6).map((act) => {
              const meta = getCategoryDistribution([act]).distributions[0].meta;
              return (
                <div
                  key={act.id}
                  className={cn(
                    'p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between',
                    theme === 'dark'
                      ? 'bg-slate-950/50 border-slate-800/80'
                      : 'bg-slate-50 border-slate-200'
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono-code font-semibold text-cyan-400">
                        {act.startTime} • {formatMinutes(act.durationMinutes)}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border',
                          act.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        )}
                      >
                        {act.status}
                      </span>
                    </div>

                    <h4 className="font-semibold text-sm tracking-tight line-clamp-1">
                      {meta.emoji} {act.title}
                    </h4>
                  </div>

                  <p className="text-xs italic text-slate-400 mt-2.5 pt-2 border-t border-inherit">
                    “{act.microCopy || meta.defaultMicroCopy}”
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 text-sm">
            “Something tells us you were busy doing… absolutely nothing.”
          </div>
        )}
      </section>
    </div>
  );
};
