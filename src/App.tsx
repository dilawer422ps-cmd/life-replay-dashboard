import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TodayView } from './components/TodayView';
import { TimelineView } from './components/TimelineView';
import { InsightsView } from './components/InsightsView';
import { PatternsView } from './components/PatternsView';
import { HistoryView } from './components/HistoryView';
import { ControlRoomView } from './components/ControlRoomView';
import { ActivityModal } from './components/ActivityModal';
import { ToastNotification } from './components/Toast';
import { cn } from './utils/cn';

const MainContent: React.FC = () => {
  const { activeTab, theme } = useApp();

  return (
    <div
      id="app-root-container"
      className={cn(
        'min-h-screen flex flex-col md:flex-row transition-colors duration-300 relative selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden',
        theme === 'dark' ? 'bg-[#0A0E17] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      )}
    >
      {/* Ambient background glows for futuristic aesthetic */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={cn(
            'absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25',
            theme === 'dark' ? 'bg-cyan-600' : 'bg-cyan-200'
          )}
        />
        <div
          className={cn(
            'absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20',
            theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-200'
          )}
        />
        <div
          className={cn(
            'absolute -bottom-40 left-1/3 w-[600px] h-[600px] rounded-full blur-[160px] opacity-20',
            theme === 'dark' ? 'bg-purple-600' : 'bg-purple-200'
          )}
        />
      </div>

      {/* Navigation Sidebar (Desktop + Mobile) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10 pb-20 md:pb-8">
        <Header />

        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8 max-w-7xl mx-auto w-full">
          {activeTab === 'today' && <TodayView />}
          {activeTab === 'timeline' && <TimelineView />}
          {activeTab === 'insights' && <InsightsView />}
          {activeTab === 'patterns' && <PatternsView />}
          {activeTab === 'history' && <HistoryView />}
          {activeTab === 'control' && <ControlRoomView />}
        </main>
      </div>

      {/* Interactive Activity Modal */}
      <ActivityModal />

      {/* Floating Micro-Toast Feedback */}
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
