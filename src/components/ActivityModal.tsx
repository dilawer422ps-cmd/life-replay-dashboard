import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Trash2, Clock, Calendar, CheckCircle2, PauseCircle, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActivityCategory, ActivityStatus } from '../types';
import { CATEGORY_META } from '../data/quotes';
import { cn } from '../utils/cn';

const CATEGORIES: ActivityCategory[] = [
  'Work',
  'Study',
  'Entertainment',
  'Exercise',
  'Social',
  'Personal',
  'Other',
];

const DURATION_PRESETS = [15, 25, 45, 60, 90, 120];

export const ActivityModal: React.FC = () => {
  const {
    isModalOpen,
    closeModal,
    selectedActivityForModal,
    addActivity,
    updateActivity,
    deleteActivity,
    currentDate,
    theme,
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('Work');
  const [startTime, setStartTime] = useState('09:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [status, setStatus] = useState<ActivityStatus>('completed');
  const [microCopy, setMicroCopy] = useState('');
  const [focusRating, setFocusRating] = useState(4);
  const [notes, setNotes] = useState('');

  // Sync state when modal opens
  useEffect(() => {
    if (selectedActivityForModal) {
      setTitle(selectedActivityForModal.title);
      setCategory(selectedActivityForModal.category);
      setStartTime(selectedActivityForModal.startTime);
      setDurationMinutes(selectedActivityForModal.durationMinutes);
      setStatus(selectedActivityForModal.status);
      setMicroCopy(selectedActivityForModal.microCopy || '');
      setFocusRating(selectedActivityForModal.focusRating || 4);
      setNotes(selectedActivityForModal.notes || '');
    } else {
      // Default new activity
      setTitle('');
      setCategory('Work');
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(Math.floor(now.getMinutes() / 15) * 15).padStart(2, '0');
      setStartTime(`${hh}:${mm}`);
      setDurationMinutes(45);
      setStatus('completed');
      setMicroCopy(CATEGORY_META['Work'].defaultMicroCopy);
      setFocusRating(4);
      setNotes('');
    }
  }, [selectedActivityForModal, isModalOpen]);

  // When category changes on fresh item, set suggested micro-copy
  const handleCategorySelect = (cat: ActivityCategory) => {
    setCategory(cat);
    if (!selectedActivityForModal || !microCopy) {
      setMicroCopy(CATEGORY_META[cat].defaultMicroCopy);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (selectedActivityForModal) {
      updateActivity(selectedActivityForModal.id, {
        title: title.trim(),
        category,
        startTime,
        durationMinutes: Math.max(5, durationMinutes),
        status,
        microCopy: microCopy.trim() || CATEGORY_META[category].defaultMicroCopy,
        focusRating,
        notes: notes.trim(),
      });
    } else {
      addActivity({
        title: title.trim(),
        category,
        startTime,
        durationMinutes: Math.max(5, durationMinutes),
        status,
        microCopy: microCopy.trim() || CATEGORY_META[category].defaultMicroCopy,
        focusRating,
        notes: notes.trim(),
        date: currentDate,
      });
    }
    closeModal();
  };

  const handleDelete = () => {
    if (selectedActivityForModal) {
      deleteActivity(selectedActivityForModal.id);
      closeModal();
    }
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Dialog Body */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.2 }}
            className={cn(
              'relative w-full max-w-xl rounded-3xl border shadow-2xl p-6 sm:p-8 z-10 my-8 overflow-hidden',
              theme === 'dark'
                ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-cyan-950/30'
                : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-inherit mb-6">
              <div>
                <span className="text-[11px] font-mono-code font-bold uppercase tracking-widest text-cyan-400">
                  {selectedActivityForModal ? 'Modify Evidence' : 'Log Life Activity'}
                </span>
                <h2 className="text-xl sm:text-2xl font-display font-bold tracking-tight mt-0.5">
                  {selectedActivityForModal ? 'Edit Activity Details' : 'Add New Activity'}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className={cn(
                  'p-2 rounded-full transition-colors',
                  theme === 'dark'
                    ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                )}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                  What did you actually do?
                </label>
                <input
                  id="activity-title-input"
                  type="text"
                  required
                  placeholder="e.g. Debugging WebSockets, Deep Reading, Gym..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={cn(
                    'w-full px-4 py-3 rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all',
                    theme === 'dark'
                      ? 'bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                  )}
                />
              </div>

              {/* Category Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSel = category === cat;
                    const meta = CATEGORY_META[cat];
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategorySelect(cat)}
                        className={cn(
                          'flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all duration-150 text-left',
                          isSel
                            ? theme === 'dark'
                              ? `${meta.badgeBg} border-current ring-1 ring-cyan-400/50 shadow-sm`
                              : `${meta.badgeBg} border-current ring-1 ring-indigo-400 font-semibold shadow-sm`
                            : theme === 'dark'
                            ? 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                        )}
                      >
                        <span className="text-sm">{meta.emoji}</span>
                        <span className="truncate">{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                    <Clock size={13} className="inline mr-1 text-cyan-400" /> Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={cn(
                      'w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono-code focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
                      theme === 'dark'
                        ? 'bg-slate-950/60 border-slate-800 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    )}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                    Duration ({durationMinutes}m)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={720}
                    step={5}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 15)}
                    className={cn(
                      'w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono-code focus:outline-none focus:ring-2 focus:ring-cyan-500/50 mb-2',
                      theme === 'dark'
                        ? 'bg-slate-950/60 border-slate-800 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    )}
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {DURATION_PRESETS.map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => setDurationMinutes(dur)}
                        className={cn(
                          'px-2 py-0.5 rounded-lg text-[11px] font-mono-code transition-colors',
                          durationMinutes === dur
                            ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40'
                            : theme === 'dark'
                            ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        )}
                      >
                        {dur}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status & Focus Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                    Status
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStatus('completed')}
                      className={cn(
                        'flex-1 py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all',
                        status === 'completed'
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400 font-semibold'
                          : 'border-slate-800 text-slate-400 hover:bg-slate-800/40'
                      )}
                    >
                      <CheckCircle2 size={14} /> Completed
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('postponed')}
                      className={cn(
                        'flex-1 py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all',
                        status === 'postponed'
                          ? 'bg-amber-500/15 border-amber-500/50 text-amber-400 font-semibold'
                          : 'border-slate-800 text-slate-400 hover:bg-slate-800/40'
                      )}
                    >
                      <PauseCircle size={14} /> Postponed
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                    Focus Quality ({focusRating}/5)
                  </label>
                  <div className="flex items-center gap-2 py-2">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setFocusRating(lvl)}
                        className={cn(
                          'p-1.5 rounded-lg transition-transform hover:scale-110 active:scale-95',
                          focusRating >= lvl
                            ? 'text-amber-400'
                            : theme === 'dark'
                            ? 'text-slate-700'
                            : 'text-slate-300'
                        )}
                      >
                        <Star size={19} className={focusRating >= lvl ? 'fill-amber-400' : ''} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Witty Micro-Copy */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles size={13} className="inline mr-1 text-cyan-400" />
                  Timeline Micro-Receipt (Humor Tag)
                </label>
                <input
                  type="text"
                  value={microCopy}
                  onChange={(e) => setMicroCopy(e.target.value)}
                  placeholder="e.g. Academic weapon detected."
                  className={cn(
                    'w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
                    theme === 'dark'
                      ? 'bg-slate-950/60 border-slate-800 text-slate-300 italic'
                      : 'bg-slate-50 border-slate-200 text-slate-700 italic'
                  )}
                />
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-inherit">
                {selectedActivityForModal ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
                  >
                    <Trash2 size={15} /> Delete Entry
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className={cn(
                      'px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors',
                      theme === 'dark'
                        ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    )}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-purple-500 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
                  >
                    {selectedActivityForModal ? 'Save Changes' : 'Confirm & Log'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
