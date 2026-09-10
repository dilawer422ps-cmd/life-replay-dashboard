import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

export const ToastNotification: React.FC = () => {
  const { toast, theme } = useApp();

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className={cn(
              'pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start gap-3 relative overflow-hidden',
              theme === 'dark'
                ? 'bg-slate-900/95 border-slate-700/80 text-white shadow-cyan-950/40'
                : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/60'
            )}
          >
            {/* Icon */}
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' ? (
                <CheckCircle2 size={18} className="text-emerald-400" />
              ) : toast.type === 'warning' ? (
                <AlertTriangle size={18} className="text-amber-400" />
              ) : (
                <Sparkles size={18} className="text-cyan-400" />
              )}
            </div>

            <div className="flex-1">
              <h5 className="font-display font-bold text-xs sm:text-sm tracking-tight">
                {toast.text}
              </h5>
              {toast.sub && (
                <p className="text-xs text-slate-400 italic mt-0.5 leading-relaxed">
                  “{toast.sub}”
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
