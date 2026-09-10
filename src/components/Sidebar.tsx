import React from 'react';
import { motion } from 'motion/react';
import {
  CircleDot,
  Clock,
  Sparkles,
  Search,
  Archive,
  Settings,
  Plus,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavTab } from '../types';
import { cn } from '../utils/cn';

interface NavItem {
  id: NavTab;
  label: string;
  symbol: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  tagline: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'today', label: 'Today', symbol: '◉', icon: CircleDot, tagline: 'Your Day, Replayed' },
  { id: 'timeline', label: 'Timeline', symbol: '◷', icon: Clock, tagline: 'Living Vertical Log' },
  { id: 'insights', label: 'Insights', symbol: '✦', icon: Sparkles, tagline: 'Time Investigation' },
  { id: 'patterns', label: 'Patterns', symbol: '⌕', icon: Search, tagline: 'Pattern Detective' },
  { id: 'history', label: 'History', symbol: '◫', icon: Archive, tagline: 'The Archives' },
  { id: 'control', label: 'Control Room', symbol: '⚙', icon: Settings, tagline: 'System Controls' },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, openAddModal, theme, toggleTheme } = useApp();

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside
        id="desktop-sidebar"
        className={cn(
          'hidden md:flex flex-col w-64 lg:w-72 border-r p-5 shrink-0 z-30 transition-colors duration-300 relative',
          theme === 'dark'
            ? 'bg-slate-950/80 border-slate-800/60 backdrop-blur-xl text-slate-100'
            : 'bg-white/85 border-slate-200/80 backdrop-blur-xl text-slate-800 shadow-sm'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20 text-white">
              <span className="font-bold text-lg tracking-tighter">LR</span>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold tracking-tight text-lg">
                  LIFE REPLAY
                </span>
              </div>
              <p
                className={cn(
                  'text-xs tracking-wide font-medium',
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                )}
              >
                Your day has receipts.
              </p>
            </div>
          </div>

          <button
            id="theme-toggle-sidebar"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={cn(
              'p-2 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95',
              theme === 'dark'
                ? 'bg-slate-900/80 border-slate-800 text-amber-300 hover:bg-slate-800'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            )}
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>

        {/* Primary Action Button */}
        <div className="mb-6 px-1">
          <button
            id="sidebar-add-activity-btn"
            onClick={openAddModal}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl font-semibold text-sm text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 cursor-pointer"
          >
            <Plus size={18} className="stroke-[2.5]" />
            <span>+ Add Something</span>
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 space-y-1.5 px-1" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left group cursor-pointer',
                  isActive
                    ? theme === 'dark'
                      ? 'text-white'
                      : 'text-slate-950 font-semibold'
                    : theme === 'dark'
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                )}
              >
                {/* Active Glowing Pill Background */}
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    className={cn(
                      'absolute inset-0 rounded-xl border',
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-cyan-500/15 via-indigo-500/10 to-transparent border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'bg-gradient-to-r from-cyan-50 to-indigo-50/50 border-cyan-300/60 shadow-sm'
                    )}
                  />
                )}

                <div className="relative z-10 flex items-center gap-3">
                  <span
                    className={cn(
                      'text-base transition-transform group-hover:scale-110',
                      isActive ? 'text-cyan-400' : 'text-slate-500'
                    )}
                  >
                    {item.symbol}
                  </span>
                  <span className="tracking-tight">{item.label}</span>
                </div>

                <Icon
                  size={16}
                  className={cn(
                    'relative z-10 transition-colors',
                    isActive
                      ? 'text-cyan-400'
                      : theme === 'dark'
                      ? 'text-slate-600 group-hover:text-slate-400'
                      : 'text-slate-400 group-hover:text-slate-600'
                  )}
                />
              </button>
            );
          })}
        </nav>

        {/* Bottom Status Card */}
        <div
          className={cn(
            'p-3.5 rounded-2xl border text-xs relative overflow-hidden mt-4',
            theme === 'dark'
              ? 'bg-slate-900/60 border-slate-800/80 text-slate-400'
              : 'bg-slate-50 border-slate-200/80 text-slate-600'
          )}
        >
          <div className="flex items-center gap-2 mb-1 text-emerald-400 font-semibold text-[11px] tracking-wider uppercase">
            <ShieldCheck size={14} />
            <span>Witness Active</span>
          </div>
          <p className="text-[12px] leading-relaxed">
            Every minute verified. Zero fabricated logs.
          </p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        id="mobile-bottom-nav"
        className={cn(
          'md:hidden fixed bottom-0 left-0 right-0 z-40 border-t px-2 py-1.5 flex items-center justify-around backdrop-blur-2xl transition-colors duration-200',
          theme === 'dark'
            ? 'bg-slate-950/90 border-slate-800 text-slate-300'
            : 'bg-white/95 border-slate-200 text-slate-700 shadow-lg'
        )}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl min-w-[52px] min-h-[44px] transition-all duration-200',
                isActive
                  ? theme === 'dark'
                    ? 'text-cyan-400'
                    : 'text-indigo-600 font-semibold'
                  : 'text-slate-400'
              )}
            >
              <div className="relative">
                <Icon size={19} />
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                  />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}

        {/* Mobile floating quick add */}
        <button
          id="mobile-add-btn"
          onClick={openAddModal}
          aria-label="Add activity"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/30 active:scale-95"
        >
          <Plus size={20} />
        </button>
      </nav>
    </>
  );
};
