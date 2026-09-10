import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Settings,
  Download,
  Trash2,
  RotateCcw,
  Sun,
  Moon,
  ShieldCheck,
  Sparkles,
  Database,
  Terminal,
  Sliders,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

export const ControlRoomView: React.FC = () => {
  const {
    activities,
    theme,
    toggleTheme,
    exportData,
    clearAllData,
    resetToSampleData,
    showToast,
  } = useApp();

  const [confirmClear, setConfirmClear] = useState(false);
  const [personalityLevel, setPersonalityLevel] = useState<'clever' | 'standard' | 'subtle'>('clever');

  const handleClearWithConfirm = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 5000);
      return;
    }
    clearAllData();
    setConfirmClear(false);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <section
        id="control-room-header"
        className={cn(
          'relative rounded-3xl p-6 sm:p-10 border overflow-hidden transition-all duration-300',
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-slate-800/80 shadow-2xl backdrop-blur-xl'
            : 'bg-gradient-to-br from-white via-slate-50 to-slate-100 border-slate-200/80 shadow-xl backdrop-blur-xl'
        )}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Terminal size={16} />
          </span>
          <span className="font-mono-code text-xs font-bold uppercase tracking-widest text-cyan-400">
            SYSTEM DIRECTIVE
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight uppercase">
          CONTROL ROOM
        </h1>
        <p
          className={cn(
            'text-base sm:text-lg font-medium tracking-tight mt-1',
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          )}
        >
          Manage your evidence, tune the AI personality, and calibrate your aesthetic horizon.
        </p>
      </section>

      {/* 1. Theme Configuration */}
      <section
        className={cn(
          'p-6 sm:p-8 rounded-3xl border transition-all duration-200',
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800/80 backdrop-blur-md' : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-lg">Visual Spectrum (Theme)</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose between futuristic deep space and soft modern clarity.
            </p>
          </div>
          <span className="text-xs font-mono-code font-bold uppercase text-cyan-400">
            Active: {theme.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Dark Mode Card */}
          <button
            onClick={() => theme !== 'dark' && toggleTheme()}
            className={cn(
              'p-5 rounded-2xl border text-left transition-all relative overflow-hidden',
              theme === 'dark'
                ? 'bg-slate-950 border-cyan-400 ring-2 ring-cyan-500/30 shadow-lg'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            )}
          >
            <div className="flex items-center justify-between mb-3 text-cyan-400">
              <Moon size={20} />
              {theme === 'dark' && (
                <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold">
                  <Check size={12} className="stroke-[3]" />
                </span>
              )}
            </div>
            <h4 className="font-bold text-sm text-white">Cinematic Dark Mode</h4>
            <p className="text-xs text-slate-400 mt-1">
              Deep dark canvas, soft ambient glows, frosted glass cards, subtle neon accents.
            </p>
          </button>

          {/* Light Mode Card */}
          <button
            onClick={() => theme !== 'light' && toggleTheme()}
            className={cn(
              'p-5 rounded-2xl border text-left transition-all relative overflow-hidden',
              theme === 'light'
                ? 'bg-white border-indigo-500 ring-2 ring-indigo-200 shadow-lg text-slate-900'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:border-slate-400'
            )}
          >
            <div className="flex items-center justify-between mb-3 text-amber-500">
              <Sun size={20} />
              {theme === 'light' && (
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Check size={12} className="stroke-[3]" />
                </span>
              )}
            </div>
            <h4 className="font-bold text-sm text-slate-900">Soft Modern Light Mode</h4>
            <p className="text-xs text-slate-500 mt-1">
              Crisp porcelain surfaces, high-contrast typography, playful pastel accents.
            </p>
          </button>
        </div>
      </section>

      {/* 2. Personality Frequency */}
      <section
        className={cn(
          'p-6 sm:p-8 rounded-3xl border transition-all duration-200',
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800/80 backdrop-blur-md' : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-amber-400" />
            <h3 className="font-display font-bold text-lg">Personality System Intensity</h3>
          </div>
          <p className="text-xs text-slate-400">
            Control the frequency of clever, friendly micro-copy observations and receipts.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          {(
            [
              { id: 'clever', label: 'Clever & Witty', desc: 'Full receipts and friendly jabs' },
              { id: 'standard', label: 'Standard', desc: 'Balanced observations' },
              { id: 'subtle', label: 'Subtle', desc: 'Minimal humor, max data' },
            ] as const
          ).map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => {
                setPersonalityLevel(lvl.id);
                showToast('Personality Calibrated', `Level set to ${lvl.label}.`, 'default');
              }}
              className={cn(
                'p-3.5 rounded-2xl border text-left transition-all',
                personalityLevel === lvl.id
                  ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 font-semibold ring-1 ring-cyan-400/40'
                  : theme === 'dark'
                  ? 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-950'
              )}
            >
              <span className="font-bold text-xs block">{lvl.label}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">{lvl.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Evidence Data Management */}
      <section
        className={cn(
          'p-6 sm:p-8 rounded-3xl border transition-all duration-200',
          theme === 'dark' ? 'bg-slate-900/60 border-slate-800/80 backdrop-blur-md' : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div className="flex items-center gap-2 mb-4">
          <Database size={16} className="text-cyan-400" />
          <h3 className="font-display font-bold text-lg">Chrono-Evidence Vault</h3>
        </div>

        <div className="flex items-center justify-between py-3 px-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 text-xs font-mono-code mb-6">
          <span className="text-slate-400">Total Logged Activities:</span>
          <span className="font-bold text-cyan-400">{activities.length} entries</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Export button */}
          <button
            id="export-evidence-btn"
            onClick={exportData}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold text-xs sm:text-sm border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all active:scale-95"
          >
            <Download size={16} />
            <span>Export My Evidence</span>
          </button>

          {/* Reset / Reload Sample */}
          <button
            id="reload-sample-btn"
            onClick={resetToSampleData}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold text-xs sm:text-sm border border-slate-700 text-slate-300 hover:bg-slate-800 transition-all active:scale-95"
          >
            <RotateCcw size={16} />
            <span>Load Sample Evidence</span>
          </button>

          {/* Clear Data */}
          <button
            id="clear-timeline-btn"
            onClick={handleClearWithConfirm}
            className={cn(
              'flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-semibold text-xs sm:text-sm border transition-all active:scale-95',
              confirmClear
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                : 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10'
            )}
          >
            <Trash2 size={16} />
            <span>{confirmClear ? 'Confirm: Erase Timeline?' : 'Erase The Timeline'}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
