import React, { useState } from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  MessageSquare, 
  PhoneCall, 
  Mail, 
  Keyboard, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Workflow,
  GraduationCap,
  MapPin,
  Code2,
  Award,
  Sparkles
} from 'lucide-react';
import { ArchitectureView } from './ArchitectureView';

export const HelpSupportView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showArchitecture, setShowArchitecture] = useState(false);

  const faqs = [
    {
      q: 'How does MedInsight AI parse unstructured pathology PDF and image reports?',
      a: 'MedInsight AI utilizes high-precision medical optical character recognition (OCR) coupled with multimodal clinical knowledge models. It accurately isolates specimen metadata, maps non-standard biomarker aliases to standardized LOINC codes, extracts numerical values and units, and compares them against verified biological reference intervals.',
    },
    {
      q: 'What should a technician do when a panic or critical threshold is flagged?',
      a: 'Per clinical laboratory accreditation guidelines (CAP / ISO 15189), any specimen with a "Critical Panic" value (such as Hemoglobin < 7.0 g/dL or Fasting Glucose > 300 mg/dL) must undergo an immediate duplicate verification run on an alternate analyzer, followed by telephone notification of the ordering physician within 30 minutes.',
    },
    {
      q: 'How does patient account auto-sync work?',
      a: 'Whenever a report is uploaded containing a matching Medical Record Number (MRN) or verified Name + Date of Birth combination, MedInsight AI automatically appends the newly extracted test panel to that patient\'s longitudinal timeline. This enables automatic delta-check comparisons and historical trend graphing.',
    },
    {
      q: 'Can laboratory technicians manually edit extracted biomarkers if OCR makes an error?',
      a: 'Yes. In the detailed report view, clinicians can edit any extracted value, unit, or biological interval before finalizing and printing the clinical summary. All modifications are logged in the system audit trail.',
    },
    {
      q: 'How do I generate an official printable summary for the patient?',
      a: 'Navigate to any report in "Analysis" or "Reports & History" and click the "Print Official Report" button (or press Ctrl + P). This opens a print-formatted, hospital-ready diagnostic summary with clinician signature blocks and plain-language patient explanations.',
    },
  ];

  const shortcuts = [
    { key: 'Ctrl + K', desc: 'Open Global Command Palette to search patients, tests, and MRNs' },
    { key: 'Ctrl + P', desc: 'Print active laboratory report or export PDF' },
    { key: 'Ctrl + U', desc: 'Jump to Uploaded Reports' },
    { key: 'Esc', desc: 'Close any active modal or search palette' },
  ];

  return (
    <div id="help-support-view" className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs relative overflow-hidden transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Clinical Support & Knowledge Base</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Help & Support Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Diagnostic guidelines, technician onboarding documentation, pathology consultation contacts, and laboratory system documentation.
            </p>
          </div>

          <button
            onClick={() => setShowArchitecture(!showArchitecture)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer shrink-0 border border-slate-200 dark:border-slate-700"
          >
            <Workflow className="w-4 h-4 text-[#0d7a68]" />
            <span>{showArchitecture ? 'Hide System Blueprint' : 'View Engineering Architecture'}</span>
          </button>
        </div>
      </div>

      {/* Conditionally view Architecture Blueprint */}
      {showArchitecture && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-200">
          <ArchitectureView />
        </div>
      )}

      {/* Quick Contact & Dispatch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-[#0d7a68] dark:text-teal-400 flex items-center justify-center">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div className="font-bold text-sm text-slate-900 dark:text-white">Emergency Pathology Hotline</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Direct line to Chief Duty Pathologist for critical panic value sign-offs.</div>
          <div className="font-mono text-xs font-extrabold text-[#0d7a68] dark:text-teal-400 pt-1">+1 (800) 555-PATH (Ext. 402)</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Mail className="w-4 h-4" />
          </div>
          <div className="font-bold text-sm text-slate-900 dark:text-white">LIS Informatics Support</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Technical help with analyzer HL7 / FHIR connectors and auto-sync.</div>
          <div className="font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400 pt-1">support@medinsight.internal</div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="font-bold text-sm text-slate-900 dark:text-white">Quality Assurance & Audit</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">CAP & ISO 15189 compliance documentation and proficiency testing logs.</div>
          <div className="font-mono text-xs font-extrabold text-purple-600 dark:text-purple-400 pt-1">qa-audit@medinsight.org</div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-4">
          <Keyboard className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Clinical Workflow Keyboard Shortcuts</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <span className="text-xs text-slate-600 dark:text-slate-300">{sc.desc}</span>
              <kbd className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono text-xs rounded-lg shadow-2xs font-semibold">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Frequently Asked Clinical Questions</h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-3.5">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#0d7a68] dark:group-hover:text-teal-400 transition-colors">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#0d7a68] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pr-6 animate-in fade-in duration-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Developer & Project Author "About Me" Section */}
      <div id="about-me-section" className="bg-white dark:bg-slate-900 rounded-3xl border border-teal-200 dark:border-teal-900/60 p-6 sm:p-8 shadow-xs relative overflow-hidden transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <span className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-[#0d7a68] dark:text-teal-400">
            <GraduationCap className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">About Me & Academic Project</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Student Developer Details & System Specifications</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Student Profile Details Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-teal-50/40 dark:from-slate-800/80 dark:to-teal-950/30 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#0a6352] to-[#0d7a68] text-white font-black text-xl flex items-center justify-center shadow-md shadow-teal-900/20 ring-2 ring-white/20">
                NG
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Nisha Girraj Singh</h3>
                <span className="inline-block px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-[#0a6352] dark:text-teal-300 font-mono text-[11px] font-bold mt-0.5">
                  Roll Number: 266629
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-200/70 dark:border-slate-700/70 text-xs">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Project Guide</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">Tazeen Shaikh</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">College / Institution</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">K.B.P Navi Mumbai Vashi</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Domain & Focus</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">Healthcare AI & Medical Laboratory Informatics</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Project Information */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <Code2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Project Summary: MedInsight AI</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-white font-bold">MedInsight AI</strong> is an intelligent Clinical Laboratory Pathology & Decision-Support System developed as an academic project at <strong className="text-slate-900 dark:text-white">K.B.P Navi Mumbai Vashi</strong> under the mentorship of <strong className="text-slate-900 dark:text-white">Prof. Tazeen Shaikh</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  Pathology Extraction
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Processes unstructured PDF/image diagnostic reports and normalizes non-standard test aliases to LOINC codes.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Panic Value Alerts
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Automated critical biomarker evaluation comparing against age/gender-stratified biological intervals.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Patient Auto-Sync
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Longitudinal history compilation tracking patient trends over multiple months with delta-checks.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  Local PDF Reports
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Single-click clinical PDF generation with physician disclaimer block, printable from any device.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
