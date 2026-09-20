import React from 'react';
import { 
  Home, 
  FolderPlus, 
  Activity, 
  Users, 
  FileText, 
  Settings, 
  BookOpen, 
  FlaskConical, 
  HelpCircle,
  LogOut,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { NavigationTab, PatientInfo } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  activePatient: PatientInfo;
  reportsCount: number;
  abnormalCount: number;
  hasActiveReport: boolean;
  onSelectReportView: () => void;
  onResetDemo: () => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activePatient,
  reportsCount,
  abnormalCount,
  hasActiveReport,
  onSelectReportView,
  onResetDemo,
  theme,
  setTheme,
}) => {
  const mainNavItems = [
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: Home, badge: null },
    { id: 'upload' as NavigationTab, label: 'Uploaded Reports', icon: FolderPlus, badge: 'New', badgeType: 'emerald' },
    { id: 'reports' as NavigationTab, label: 'Analysis', icon: Activity, badge: null, disabled: !hasActiveReport },
    { id: 'profile' as NavigationTab, label: 'Patient Accounts', icon: Users, badge: 'Auto-sync', badgeType: 'blue' },
    { id: 'history' as NavigationTab, label: 'Reports & History', icon: FileText, badge: null },
    { id: 'settings' as NavigationTab, label: 'Settings', icon: Settings, badge: null },
  ];

  const quickTools = [
    { id: 'guidelines' as NavigationTab, label: 'Medical Guidelines', icon: BookOpen },
    { id: 'ranges' as NavigationTab, label: 'Reference Ranges', icon: FlaskConical },
    { id: 'about' as NavigationTab, label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <aside 
      id="sidebar-navigation" 
      className="w-64 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex flex-col shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 select-none z-20 transition-colors"
    >
      {/* Brand Header - Exact h-16 alignment with top bar */}
      <div className="h-16 px-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0 bg-slate-50/40 dark:bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0a6352] to-[#0d7a68] flex items-center justify-center text-white shadow-md shadow-teal-900/20 shrink-0 ring-1 ring-white/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">MedInsight</span>
              <span className="font-black text-base tracking-tight text-[#0d7a68] dark:text-teal-400">AI</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-tight leading-none mt-0.5">
              Clinical Intelligence Suite
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isDisabled = item.disabled;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              disabled={isDisabled}
              onClick={() => {
                if (item.id === 'reports') {
                  onSelectReportView();
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-teal-50 to-emerald-50/70 dark:from-teal-950/80 dark:to-slate-800/60 text-[#0a6352] dark:text-teal-300 font-bold shadow-2xs border border-teal-200/60 dark:border-teal-800/40'
                  : isDisabled
                  ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-[#0d7a68] dark:text-teal-400 scale-110' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className={isActive ? 'font-bold' : 'font-medium'}>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeType === 'emerald'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60'
                      : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Tools Header */}
        <div className="pt-4 px-3 pb-1 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
          Quick Tools
        </div>

        {quickTools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTab === tool.id;

          return (
            <button
              key={tool.id}
              id={`quick-tool-${tool.id}`}
              onClick={() => setActiveTab(tool.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#e6f7f2] dark:bg-teal-950/60 text-[#0a6352] dark:text-teal-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0d7a68] dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Streamlined Status & Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 transition-colors shrink-0">
        {/* System Status Pill */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">System Ready</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-medium">v2.4.2</span>
        </div>

        {/* Demo reset button */}
        <button
          id="btn-reset-demo"
          onClick={onResetDemo}
          title="Reset back to default sample reports"
          className="w-full flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>
    </aside>
  );
};
