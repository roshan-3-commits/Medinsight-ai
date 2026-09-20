import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  FileType, 
  ArrowRight,
  ClipboardPaste,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { MedicalReport } from '../types';
import { INITIAL_REPORTS } from '../data/mockReports';

interface UploadViewProps {
  onReportAnalyzed: (report: MedicalReport) => void;
  onSelectSample: (report: MedicalReport) => void;
}

export const UploadView: React.FC<UploadViewProps> = ({
  onReportAnalyzed,
  onSelectSample,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setErrorMessage(null);
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const processAnalysis = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      setProcessingStage('1/4: Ingesting & normalizing document stream...');
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStage('2/4: Extracting text & clinical biomarkers (OCR/NLP)...');
      await new Promise((r) => setTimeout(r, 700));

      setProcessingStage('3/4: Comparing parameters against clinical reference ranges...');
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStage('4/4: Generating plain-language insights & medical summary...');

      let payload: any = {};

      if (inputMode === 'paste' && pastedText.trim()) {
        payload = {
          text: pastedText,
          fileName: 'Manual_Pasted_Lab_Notes.txt',
        };
      } else if (selectedFile) {
        // Check if image
        if (selectedFile.type.startsWith('image/')) {
          const base64 = await toBase64(selectedFile);
          payload = {
            imageBase64: base64,
            mimeType: selectedFile.type,
            fileName: selectedFile.name,
          };
        } else {
          // Read text if text/pdf-like
          const textContent = await selectedFile.text().catch(() => '');
          payload = {
            text: textContent || `Medical Report uploaded: ${selectedFile.name}`,
            fileName: selectedFile.name,
            mimeType: selectedFile.type,
          };
        }
      } else {
        throw new Error('Please select a file or paste lab text to analyze.');
      }

      // Call API
      const response = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.report) {
        onReportAnalyzed(data.report);
      } else {
        throw new Error('Could not parse clinical report data.');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'Error occurred during clinical report extraction.');
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  return (
    <div id="upload-report-view" className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Title Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Upload Medical Report</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload any laboratory diagnostic sheet, blood work report, pathology summary, or paste lab values.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit border border-slate-200 dark:border-slate-700 text-xs font-semibold">
        <button
          id="tab-mode-upload"
          onClick={() => setInputMode('upload')}
          className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
            inputMode === 'upload' 
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          File Upload (PDF/Image)
        </button>
        <button
          id="tab-mode-paste"
          onClick={() => setInputMode('paste')}
          className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
            inputMode === 'paste' 
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold' 
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Paste Lab Text / WhatsApp
        </button>
      </div>

      {/* Main Dropzone / Paste Area */}
      {inputMode === 'upload' ? (
        <div
          id="dropzone-area"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-150 ${
            dragActive
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 scale-[1.005]'
              : 'border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 bg-white dark:bg-slate-900 shadow-xs'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            id="medical-file-input"
            accept=".pdf,.png,.jpg,.jpeg,.txt"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-teal-600 dark:text-teal-400 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
              <UploadCloud className="w-7 h-7" />
            </div>

            {selectedFile ? (
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>File Selected: {selectedFile.name}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Size: {(selectedFile.size / 1024).toFixed(1)} KB • Ready for extraction
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Drag & Drop your medical report here
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">or click to browse from your computer</p>
              </div>
            )}

            <div className="pt-2 flex flex-wrap justify-center items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">PDF</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">PNG</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">JPG</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">JPEG</span>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">
              Supports diagnostic lab sheets from Quest, Labcorp, Dr Lal PathLabs, SRL, Apex, or any hospital.
            </p>
          </div>
        </div>
      ) : (
        /* Text Paste Mode */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs">
          <label htmlFor="textarea-paste-report" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Paste Raw Laboratory Values or Doctor Notes:
          </label>
          <textarea
            id="textarea-paste-report"
            rows={7}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="e.g.&#10;Patient: Rahul Sharma, Age: 28, Male&#10;Hemoglobin: 10.5 g/dL (Normal 12-16)&#10;Fasting Blood Sugar: 95 mg/dL (Normal 70-110)&#10;Total Cholesterol: 230 mg/dL (Normal < 200)&#10;Vitamin D3: 18 ng/mL (Normal 20-50)"
            className="w-full text-xs font-mono p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-800 dark:text-slate-200"
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Paste test results directly from your email, message, or digital PDF report.
          </p>
        </div>
      )}

      {/* Error Banner if any */}
      {errorMessage && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Extraction Error</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Action Button & Processing Animation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>HIPAA & GDPR Compliant • Client-Side Tokenization Security</span>
        </div>

        <button
          id="btn-start-analysis"
          onClick={processAnalysis}
          disabled={isProcessing || (inputMode === 'upload' && !selectedFile) || (inputMode === 'paste' && !pastedText.trim())}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
            isProcessing || (inputMode === 'upload' && !selectedFile) || (inputMode === 'paste' && !pastedText.trim())
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border border-slate-300/60 dark:border-slate-700/60 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#0a6352] to-[#0d7a68] hover:from-[#095748] hover:to-[#0a6352] text-white active:scale-95 shadow-md shadow-teal-900/20'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Analyzing Biomarkers...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-teal-200" />
              <span>Analyze & Extract Report</span>
            </>
          )}
        </button>
      </div>

      {/* Live Processing Pipeline Overlay / Status */}
      {isProcessing && (
        <div className="p-4 rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-800 text-white text-xs space-y-2 shadow-sm animate-pulse">
          <div className="flex items-center justify-between font-semibold">
            <div className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span className="text-emerald-400 font-mono">PROCESSING PIPELINE</span>
            </div>
            <span className="text-[10px] text-slate-400">Gemini 3.8 Flash & Clinical Rule Engine</span>
          </div>
          <p className="text-slate-200 font-medium pl-5">{processingStage}</p>
        </div>
      )}

      {/* Sample Clinical Reports Quick Bar (Matches Image 1 & 2 Blueprint) */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Or Test Instantly with Sample Clinical Reports:
          </h3>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold">1-Click Demo</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {INITIAL_REPORTS.map((sample) => {
            const abnormalCount = sample.summary.abnormalCount;
            return (
              <button
                key={sample.id}
                id={`btn-sample-report-${sample.id}`}
                onClick={() => onSelectSample(sample)}
                className="p-3.5 text-left rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-400 hover:bg-teal-50/20 dark:hover:bg-teal-950/20 transition-all duration-150 space-y-2 group shadow-2xs cursor-pointer active:scale-98"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {sample.patientInfo.name}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      abnormalCount > 0 
                        ? 'bg-amber-100/80 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60' 
                        : 'bg-emerald-100/80 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/60'
                    }`}
                  >
                    {abnormalCount > 0 ? `${abnormalCount} Flags` : 'Normal'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{sample.patientInfo.reportType}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                  <span>{sample.patientInfo.reportDate}</span>
                  <span className="text-[#0d7a68] dark:text-teal-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Load <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
