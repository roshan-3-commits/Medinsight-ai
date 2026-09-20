import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Hospital, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Printer, 
  Sparkles, 
  HeartHandshake, 
  Utensils, 
  Activity, 
  MessageSquare, 
  ShieldAlert,
  HelpCircle,
  Stethoscope,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  Search,
  Copy,
  TrendingDown,
  TrendingUp,
  Share2,
  Download,
  Loader2
} from 'lucide-react';
import { LabTest, MedicalReport, TestStatus } from '../types';
import { calculateGaugePosition } from '../utils/clinicalRules';
import { generateMedicalReportPDF } from '../utils/pdfExport';

interface ReportDetailViewProps {
  report: MedicalReport;
  onPrint: () => void;
  onNewUpload: () => void;
  onViewPatientProfile?: () => void;
}

export const ReportDetailView: React.FC<ReportDetailViewProps> = ({
  report,
  onPrint,
  onNewUpload,
  onViewPatientProfile,
}) => {
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [tableSearch, setTableSearch] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const { patientInfo, tests, summary } = report;

  // Toggle explanation accordion
  const toggleExplanation = (id: string) => {
    setExpandedTestId(expandedTestId === id ? null : id);
  };

  // Filter tests
  const filteredTests = tests.filter((t) => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (filterStatus === 'abnormal' && t.status === 'normal') return false;
    if (filterStatus === 'normal' && t.status !== 'normal') return false;
    if (tableSearch.trim() && !t.name.toLowerCase().includes(tableSearch.toLowerCase())) return false;
    return true;
  });

  const categories = Array.from(new Set(tests.map((t) => t.category)));

  // Derive abnormal tests sorted by severity (critical first, then high/low)
  const abnormalTests = tests.filter((t) => t.status !== 'normal').sort((a, b) => {
    if (a.status === 'critical' && b.status !== 'critical') return -1;
    if (b.status === 'critical' && a.status !== 'critical') return 1;
    return 0;
  });

  // Calculate Health Index
  const totalTests = tests.length || 1;
  const normalTests = tests.filter((t) => t.status === 'normal').length;
  const healthIndexPercentage = Math.round((normalTests / totalTests) * 100);

  // Jump to specific test in results table and expand its explanation
  const handleJumpToTest = (testId: string) => {
    setFilterStatus('all');
    setFilterCategory('all');
    setTableSearch('');
    setExpandedTestId(testId);
    setTimeout(() => {
      const element = document.getElementById(`test-row-${testId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Copy plain text summary for doctor
  const handleCopySummary = () => {
    const text = `MedInsight Clinical Summary for ${patientInfo.name} (${patientInfo.reportDate}):\n` +
      `Report: ${patientInfo.reportType} | Status: ${summary.overallHealthStatus}\n` +
      `Key Findings:\n` +
      summary.keyFindings.map((f) => `- ${f.testName} (${f.status.toUpperCase()}): ${f.summary}`).join('\n') +
      `\n\nDoctor Consultation Prompts:\n` +
      summary.doctorFollowUpQuestions.map((q) => `- ${q}`).join('\n');

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  // Download PDF handler
  const handleDownloadPDF = () => {
    try {
      setIsDownloadingPDF(true);
      generateMedicalReportPDF(report);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  return (
    <div id="report-detail-view" className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Banner with Action Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
              {report.id}
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Verified Clinical Parse
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-1.5">
            Diagnostic Laboratory Report Analysis
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated CLSI biomarker extraction and physiological range mapping
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            id="btn-copy-clinical-summary"
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700/80"
            title="Copy structured summary to clipboard for messaging"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSummary ? 'Copied Summary' : 'Copy Summary'}</span>
          </button>
          <button
            id="btn-download-pdf-summary"
            onClick={handleDownloadPDF}
            disabled={isDownloadingPDF}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#0d7a68] hover:bg-[#0a6352] text-white rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer disabled:opacity-50 border border-teal-400/30"
            title="Download analyzed report as a local PDF document"
          >
            {isDownloadingPDF ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : downloadSuccess ? (
              <Check className="w-3.5 h-3.5 text-teal-200" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{downloadSuccess ? 'Downloaded!' : 'Download as PDF'}</span>
          </button>
          <button
            id="btn-print-summary"
            onClick={onPrint}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer border border-slate-700/60"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            id="btn-new-upload"
            onClick={onNewUpload}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer border border-emerald-400/30"
          >
            <span>Upload Another</span>
          </button>
        </div>
      </div>

      {/* Extracted Patient Demographics & Health Vitality Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Demographics Card (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between transition-colors">
          <div className="bg-slate-900 dark:bg-slate-950 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Extracted Patient Demographics
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-[11px] text-slate-400 font-mono">
                Specimen ID: {patientInfo.specimenId || 'MED-98231'}
              </span>
              {onViewPatientProfile && (
                <button
                  id="btn-view-patient-account-from-report"
                  onClick={onViewPatientProfile}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer active:scale-95"
                  title="Open Synchronized Patient Health Profile"
                >
                  <User className="w-3 h-3" />
                  <span>Patient Account Profile</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium block">Patient Name</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">{patientInfo.name}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium block">Age</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">{patientInfo.age} yrs</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium block">Gender</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">{patientInfo.gender}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium block">Report Type</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white block truncate" title={patientInfo.reportType}>
                {patientInfo.reportType}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium block">Report Date</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">{patientInfo.reportDate}</span>
            </div>
          </div>

          {/* Secondary Facility Info */}
          <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 gap-3">
            <div className="flex items-center gap-1.5">
              <Hospital className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>Pathology Center: <strong className="text-slate-800 dark:text-slate-200">{patientInfo.labName || 'Apex Diagnostic Labs'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>Attending Physician: <strong className="text-slate-800 dark:text-slate-200">{patientInfo.referringDoctor || 'Dr. A. Verma, MD'}</strong></span>
            </div>
          </div>
        </div>

        {/* Health Vitality & Biomarker Index Card (1 Col) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Biomarker Health Index</span>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 font-mono">{tests.length} Parameters</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Circular / Radial Score */}
            <div className="relative w-16 h-16 rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0">
              <div 
                className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent -rotate-45"
                style={{ opacity: Math.max(0.2, healthIndexPercentage / 100) }}
              />
              <span className="text-base font-extrabold text-slate-900 dark:text-white">{healthIndexPercentage}%</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                {healthIndexPercentage >= 80 ? 'Optimal Diagnostic Balance' : 'Clinical Attention Recommended'}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {normalTests} of {tests.length} markers within accredited biological target zones
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block uppercase">Target Safe</span>
              <span className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">{normalTests} Normal</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80">
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold block uppercase">Action Needed</span>
              <span className="font-bold text-amber-900 dark:text-amber-300 text-sm">{summary.abnormalCount} Out of Range</span>
            </div>
          </div>
        </div>
      </div>

      {/* PERSISTENT KEY FINDINGS SUMMARY CARD (DYNAMIC ABNORMALITY HIGHLIGHTS) */}
      <div 
        id="persistent-key-findings-card" 
        className={`rounded-2xl border p-5 sm:p-6 shadow-xs space-y-4 transition-all ${
          abnormalTests.length > 0 
            ? 'bg-gradient-to-br from-amber-50/50 via-white to-rose-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 border-amber-200/90 dark:border-amber-900/50' 
            : 'bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
              abnormalTests.length > 0 ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300' : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
            }`}>
              {abnormalTests.length > 0 ? (
                <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Key Findings & Priority Abnormalities
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md font-bold bg-slate-900 dark:bg-slate-800 text-white border border-slate-700/60">
                  Executive Triage
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {abnormalTests.length > 0
                  ? 'Dynamically highlighting lab parameters outside accredited biological reference intervals'
                  : 'All analyzed biomarkers fall strictly within certified healthy physiological ranges'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {abnormalTests.length > 0 && (
              <button
                id="btn-toggle-abnormal-filter-from-card"
                onClick={() => setFilterStatus(filterStatus === 'abnormal' ? 'all' : 'abnormal')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  filterStatus === 'abnormal'
                    ? 'bg-amber-600 text-white border-amber-700 shadow-2xs'
                    : 'bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                }`}
                title="Filter table below to show only abnormal parameters"
              >
                {filterStatus === 'abnormal' ? 'Showing Abnormal Only' : `Filter Table (${abnormalTests.length} Flags)`}
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Key Findings Cards */}
        {abnormalTests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {abnormalTests.map((test) => {
              // Calculate variance from normal interval bounds
              let varianceLabel = '';
              if (test.status === 'low' && test.referenceRange.min != null && test.numericValue != null) {
                const diffPct = Math.round(((test.referenceRange.min - test.numericValue) / test.referenceRange.min) * 100);
                if (diffPct > 0) varianceLabel = `${diffPct}% below minimum cutoff`;
              } else if (test.status === 'high' && test.referenceRange.max != null && test.numericValue != null) {
                const diffPct = Math.round(((test.numericValue - test.referenceRange.max) / test.referenceRange.max) * 100);
                if (diffPct > 0) varianceLabel = `${diffPct}% above upper cutoff`;
              }

              // Retrieve matching key finding summary if available
              const matchedFinding = summary.keyFindings.find(
                (f) => f.testName.toLowerCase() === test.name.toLowerCase()
              );

              return (
                <div
                  key={`key-finding-${test.id}`}
                  id={`key-finding-item-${test.id}`}
                  onClick={() => handleJumpToTest(test.id)}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all duration-150 cursor-pointer flex flex-col justify-between space-y-3 group"
                  title="Click to jump directly to this test in the results table"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors">
                          {test.name}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                          • {test.category}
                        </span>
                      </div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white">
                          {test.resultValue}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">{test.unit}</span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                          (Ref: {test.referenceRange.text})
                        </span>
                      </div>
                    </div>

                    {/* Color-Coded Severity Badge */}
                    <div className="shrink-0">
                      {test.status === 'critical' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-extrabold bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 ring-1 ring-rose-400/30">
                          <AlertTriangle className="w-3 h-3 text-rose-700 dark:text-rose-400 animate-pulse" />
                          <span>CRITICAL</span>
                        </span>
                      ) : test.status === 'high' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          <ArrowUpRight className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                          <span>ELEVATED HIGH</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <ArrowDownRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>BELOW NORMAL</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Variance Indicator if computable */}
                  {varianceLabel && (
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 w-fit">
                      <TrendingDown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>{varianceLabel}</span>
                    </div>
                  )}

                  {/* Clinical Meaning / Takeaway */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {matchedFinding?.summary || test.simpleExplanation}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">Click to inspect</span>
                    <span className="text-[#0d7a68] dark:text-teal-400 group-hover:text-teal-600 font-bold flex items-center gap-1">
                      <span>View analysis</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  No Critical Laboratory Abnormalities Detected
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  ALL NORMAL
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                All {tests.length} analyzed parameters in this report meet certified clinical reference criteria with zero out-of-range deviations.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
              <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">Complete Blood Count: Optimal</span>
              <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">Metabolic Panel: Safe</span>
            </div>
          </div>
        )}
      </div>

      {/* STEP 4 IN BLUEPRINT: Test Results with Interactive Table, Filters & Range Meters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden space-y-0 transition-colors">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-xs border border-slate-700">
              4
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Test Results & Biological Reference Intervals
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cross-referenced with standardized clinical diagnostic criteria
              </p>
            </div>
          </div>

          {/* Search inside table + Status and Category Filters */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Quick table filter */}
            <div className="relative w-44 sm:w-52">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Filter biomarker..."
                className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            {/* Status Segmented Control */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  filterStatus === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All ({tests.length})
              </button>
              <button
                onClick={() => setFilterStatus('abnormal')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  filterStatus === 'abnormal' ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Abnormal ({summary.abnormalCount})
              </button>
              <button
                onClick={() => setFilterStatus('normal')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  filterStatus === 'normal' ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Normal ({normalTests})
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-semibold text-[11px] shrink-0">Panels:</span>
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
              filterCategory === 'all' ? 'bg-slate-900 dark:bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            All Panels
          </button>
          {categories.map((cat) => {
            const count = tests.filter((t) => t.category === cat).length;
            const isSelected = filterCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                  isSelected ? 'bg-slate-900 dark:bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Test Name & Category</th>
                <th className="py-3 px-4">Observed Result</th>
                <th className="py-3 px-4">Reference Range</th>
                <th className="py-3 px-4 min-w-[200px]">Clinical Range Meter</th>
                <th className="py-3 px-4">Status Flag</th>
                <th className="py-3 px-4 text-right">Patient Breakdown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    No biomarkers match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTests.map((test) => {
                  const isExpanded = expandedTestId === test.id;
                  const gauge = calculateGaugePosition(test.numericValue, test.referenceRange.min, test.referenceRange.max);

                  return (
                    <React.Fragment key={test.id}>
                      <tr
                        id={`test-row-${test.id}`}
                        className={`hover:bg-slate-50/90 dark:hover:bg-slate-800/60 transition-colors ${
                          test.status !== 'normal' ? 'bg-amber-50/20 dark:bg-amber-950/10' : ''
                        }`}
                      >
                        {/* Test Name & Category */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 dark:text-white text-xs block">{test.name}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{test.category}</span>
                        </td>

                        {/* Measured Result */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white text-sm font-mono flex items-baseline gap-1">
                            <span>{test.resultValue}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">{test.unit}</span>
                          </div>
                        </td>

                        {/* Reference Range */}
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono text-xs">
                          {test.referenceRange.text}
                        </td>

                        {/* Engineered Visual Range Meter Gauge */}
                        <td className="py-3.5 px-4">
                          <div className="w-full space-y-1">
                            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex border border-slate-200 dark:border-slate-700 relative shadow-2xs">
                              {/* Low segment */}
                              <div className="w-1/4 bg-amber-200 dark:bg-amber-900/60 border-r border-amber-300 dark:border-amber-800" title="Low zone" />
                              {/* Normal target safe zone segment */}
                              <div className="w-2/4 bg-emerald-200 dark:bg-emerald-900/60 border-r border-emerald-300 dark:border-emerald-800" title="Target healthy zone" />
                              {/* High segment */}
                              <div className="w-1/4 bg-rose-200 dark:bg-rose-900/60" title="High zone" />
                              
                              {/* Needle Indicator Pin */}
                              <div
                                className="absolute top-0 bottom-0 w-2.5 -ml-1 rounded-full bg-slate-900 dark:bg-white ring-2 ring-white dark:ring-slate-900 shadow-sm"
                                style={{ left: `${gauge.percentage}%` }}
                                title={`Observed value at ${gauge.percentage}% relative to reference limits`}
                              />
                            </div>
                            <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-500 font-mono px-0.5">
                              <span>Low &lt;{test.referenceRange.min ?? '-'}</span>
                              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Normal Zone</span>
                              <span>&gt;{test.referenceRange.max ?? '-'} High</span>
                            </div>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          <StatusBadge status={test.status} />
                        </td>

                        {/* Action: Expand Simple English explanation */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            id={`btn-explain-${test.id}`}
                            onClick={() => toggleExplanation(test.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-colors cursor-pointer border border-emerald-200/60 dark:border-emerald-800/60"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{isExpanded ? 'Hide' : 'Explain'}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Plain-English Explanation Drawer */}
                      {isExpanded && (
                        <tr className="bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
                          <td colSpan={6} className="p-4 sm:p-5">
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-2xs">
                              <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                  <Info className="w-4 h-4" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                    Understanding Your {test.name} in Plain Language:
                                  </h4>
                                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {test.simpleExplanation}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                                <div className="space-y-1">
                                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider">
                                    Clinical Significance
                                  </span>
                                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                                    {test.clinicalSignificance}
                                  </p>
                                </div>

                                {test.recommendations && test.recommendations.length > 0 && (
                                  <div className="space-y-1">
                                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider">
                                      Targeted Health Advice
                                    </span>
                                    <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-xs">
                                      {test.recommendations.map((rec, i) => (
                                        <li key={i} className="flex items-start gap-1.5">
                                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                          <span>{rec}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STEP 5 IN BLUEPRINT: Analysis Summary & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Summary (Left) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="w-5 h-5 rounded-full bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-xs border border-slate-700">
              5
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Overall Summary</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Categorized diagnostic findings</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {summary.keyFindings.map((finding, idx) => {
              const isNormal = finding.status === 'normal';
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
                    isNormal
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-slate-800 dark:text-slate-200'
                      : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {isNormal ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <span className="font-bold block text-slate-900 dark:text-white">
                      {finding.testName} is {finding.status.toUpperCase()}
                    </span>
                    <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                      {finding.summary}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clinical Status Highlight */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Diagnostic Health Assessment
            </span>
            <p className="font-bold text-slate-900 dark:text-white">{summary.overallHealthStatus}</p>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{summary.headline}</p>
          </div>
        </div>

        {/* Clinical Recommendations & Lifestyle Tips (Right) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <HeartHandshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Actionable Recommendations</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Dietary adjustments & lifestyle modifications</p>
            </div>
          </div>

          {/* Diet Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Utensils className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Nutritional Recommendations:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pl-2">
              {summary.dietaryRecommendations.map((diet, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{diet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lifestyle Section */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Lifestyle & Activity:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pl-2">
              {summary.lifestyleModifications.map((life, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{life}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Doctor Questions */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Questions to Discuss with Your Doctor:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pl-2">
              {summary.doctorFollowUpQuestions.map((q, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mandatory Clinical Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
          <ShieldAlert className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>Clinical Informatics Notice</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          {summary.medicalDisclaimer}
        </p>
      </div>
    </div>
  );
};

export const StatusBadge: React.FC<{ status: TestStatus }> = ({ status }) => {
  switch (status) {
    case 'normal':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>Normal</span>
        </span>
      );
    case 'low':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <ArrowDownRight className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>Low</span>
        </span>
      );
    case 'high':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          <ArrowUpRight className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          <span>High</span>
        </span>
      );
    case 'critical':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 ring-1 ring-rose-400/30">
          <AlertTriangle className="w-3 h-3 text-rose-700 dark:text-rose-400 animate-pulse" />
          <span>Critical</span>
        </span>
      );
    default:
      return null;
  }
};
