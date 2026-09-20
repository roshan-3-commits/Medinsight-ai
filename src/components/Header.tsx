import React, { useState } from 'react';
import { 
  Printer, 
  Sparkles, 
  Search, 
  Bell, 
  FileText, 
  ChevronDown, 
  UserCheck, 
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Command,
  Sun,
  Moon,
  X,
  GraduationCap
} from 'lucide-react';
import { MedicalReport } from '../types';

interface HeaderProps {
  currentReport: MedicalReport | null;
  allReports: MedicalReport[];
  onSelectReport: (report: MedicalReport) => void;
  onPrint: () => void;
  onOpenProfile?: () => void;
  onOpenSearch?: () => void;
  onOpenAboutMe?: () => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentReport,
  allReports,
  onSelectReport,
  onPrint,
  onOpenProfile,
  onOpenSearch,
  onOpenAboutMe,
  theme,
  setTheme,
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Derive notifications from reports
  const abnormalReports = allReports.filter((r) => r.summary.abnormalCount > 0);

  return (
    <header 
      id="app-top-header" 
      className="h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between z-20 shrink-0 relative transition-colors"
    >
      {/* Left side: Search bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div
          id="btn-global-search-trigger"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100/90 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 rounded-xl text-xs text-slate-500 dark:text-slate-400 transition-all shadow-2xs group cursor-pointer"
          title="Search by patient name, ID, report type, or doctor (Ctrl/Cmd + K)"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors shrink-0" />
            <span className="truncate text-slate-400 dark:text-slate-400 text-xs font-medium">Search by patient name, ID, report type, or doctor...</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] font-semibold text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700 shrink-0 shadow-2xs group-hover:border-slate-300 dark:group-hover:border-slate-600">
            <span>Ctrl + K</span>
          </div>
        </div>
      </div>

      {/* Right side: Theme Switcher, Notifications & User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Senior Developer Polished Theme Toggle */}
        <div 
          id="header-theme-toggle"
          className="flex items-center bg-slate-100/90 dark:bg-slate-800/90 p-0.5 sm:p-1 rounded-xl border border-slate-200/90 dark:border-slate-700/80 shadow-2xs backdrop-blur-xs"
          role="group"
          aria-label="Color scheme toggle"
        >
          <button
            id="btn-header-theme-light"
            onClick={() => setTheme('light')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              theme === 'light'
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/60 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/40'
            }`}
            title="Switch to Light Theme"
          >
            <Sun className={`w-3.5 h-3.5 transition-transform ${theme === 'light' ? 'text-amber-500 fill-amber-400/25 scale-105' : 'text-slate-400'}`} />
            <span className="text-[11px] tracking-tight">Light</span>
          </button>

          <button
            id="btn-header-theme-dark"
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-[#0d7a68] to-[#0a6352] text-white shadow-xs ring-1 ring-teal-500/30 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-white/40 dark:hover:bg-slate-700/40'
            }`}
            title="Switch to Night-Shift Dark Theme"
          >
            <Moon className={`w-3.5 h-3.5 transition-transform ${theme === 'dark' ? 'text-teal-200 fill-teal-200/20 scale-105' : 'text-slate-400'}`} />
            <span className="text-[11px] tracking-tight">Dark</span>
          </button>
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

        {/* Notifications */}
        <div className="relative">
          <button
            id="btn-header-notifications"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200/90 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all relative cursor-pointer shadow-2xs active:scale-95"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs animate-pulse">
              1
            </span>
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 text-xs space-y-2 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Clinical Notifications
                </span>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {abnormalReports.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      onSelectReport(r);
                      setIsNotificationsOpen(false);
                    }}
                    className="p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-slate-800 dark:text-slate-200 hover:bg-amber-100/70 dark:hover:bg-amber-900/40 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>{r.patientInfo.name}</span>
                      <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.2 rounded font-semibold">
                        {r.summary.abnormalCount} Flagged
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      {r.patientInfo.reportType} • {r.summary.headline}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right side: About Me button */}
        {onOpenAboutMe && (
          <button
            id="btn-header-about-me"
            onClick={onOpenAboutMe}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-500/15 to-emerald-500/15 hover:from-teal-500/25 hover:to-emerald-500/25 text-[#0d7a68] dark:text-teal-300 border border-teal-300/60 dark:border-teal-700/60 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
            title="View Developer & Project Information (Nisha Girraj Singh)"
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#0d7a68] dark:text-teal-300" />
            <span className="hidden md:inline">About Me</span>
          </button>
        )}

        {/* User Profile Area */}
        <div 
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors cursor-pointer border border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/60"
          title="Technician Account Profile"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 dark:from-teal-600 dark:to-teal-800 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-1 ring-white/10">
            PJ
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1">
              <span>Prasad Jadhav</span>
            </div>
            <div className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold leading-tight">Lead Technician</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block ml-0.5" />
        </div>
      </div>
    </header>
  );
};
