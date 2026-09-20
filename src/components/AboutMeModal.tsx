import React from 'react';
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  MapPin, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  X, 
  ExternalLink,
  Code2,
  Award,
  Calendar,
  Cpu
} from 'lucide-react';

interface AboutMeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutMeModal: React.FC<AboutMeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200/90 dark:border-slate-800 transition-colors">
        
        {/* Modal Header with Badge */}
        <div className="bg-gradient-to-r from-[#0a6352] to-[#0d7a68] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-teal-100 text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Project Author & Developer
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">About Me</h2>
          <p className="text-teal-100/90 text-xs mt-0.5">
            Student Profile & Academic Project Specifications
          </p>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 space-y-5 text-slate-800 dark:text-slate-200">
          
          {/* Personal & College Info Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/70 space-y-3">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                NG
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Nisha Girraj Singh
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 font-mono text-[11px] font-bold">
                    Roll: 266629
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Student & Medical AI Project Developer
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-tight">Guide Name</span>
                  <span className="font-bold text-slate-900 dark:text-white">Tazeen Shaikh</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-tight">College</span>
                  <span className="font-bold text-slate-900 dark:text-white">K.B.P Navi Mumbai Vashi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Overview Brief */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <Code2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Project Overview: MedInsight AI</span>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200/70 dark:border-teal-900/50 text-xs space-y-2">
              <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                <strong className="text-teal-800 dark:text-teal-200">MedInsight AI</strong> is an intelligent Clinical Laboratory Pathology & Decision-Support System designed to parse, normalize, and interpret complex blood test panels and diagnostic reports.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="flex items-start gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
                    Multimodal OCR extraction for unstructured PDF/image labs
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
                    Automated panic/critical biomarker threshold flagging
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
                    Longitudinal patient account synchronization & history
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
                    Direct local PDF report export & print generation
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Footer Tag */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Academic Project 2026
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
