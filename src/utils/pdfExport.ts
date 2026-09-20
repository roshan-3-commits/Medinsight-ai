import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MedicalReport } from '../types';

/**
 * Generates a clean, clinical-grade multi-page PDF medical report using jsPDF and jspdf-autotable.
 */
export function generateMedicalReportPDF(report: MedicalReport): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = margin;

  // Colors
  const primaryTeal: [number, number, number] = [13, 122, 104]; // #0d7a68
  const darkSlate: [number, number, number] = [15, 23, 42]; // #0f172a
  const lightBg: [number, number, number] = [248, 250, 252]; // #f8fafc
  const borderGray: [number, number, number] = [226, 232, 240]; // #e2e8f0

  // 1. Header Banner
  doc.setFillColor(...primaryTeal);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 22, 2, 2, 'F');

  // Brand Name & Tagline inside banner
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('MedInsight AI', margin + 6, currentY + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Clinical Pathology Intelligence & Biomarker Normalization', margin + 6, currentY + 16);

  // Right side of banner: Report ID & Generation Date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`REPORT: ${report.id}`, pageWidth - margin - 6, currentY + 9, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Date: ${report.patientInfo.reportDate || 'N/A'}`, pageWidth - margin - 6, currentY + 16, { align: 'right' });

  currentY += 26;

  // 2. Patient Demographics & Facility Box
  doc.setFillColor(...lightBg);
  doc.setDrawColor(...borderGray);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 26, 2, 2, 'FD');

  doc.setTextColor(...darkSlate);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);

  const col1X = margin + 5;
  const col2X = margin + 50;
  const col3X = margin + 95;
  const col4X = margin + 140;

  // Row 1
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('PATIENT NAME', col1X, currentY + 6);
  doc.text('AGE / GENDER', col2X, currentY + 6);
  doc.text('REPORT TYPE', col3X, currentY + 6);
  doc.text('SPECIMEN / MRN', col4X, currentY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...darkSlate);
  doc.text(report.patientInfo.name || 'Anonymous', col1X, currentY + 11);
  doc.text(`${report.patientInfo.age || '--'} yrs / ${report.patientInfo.gender || '--'}`, col2X, currentY + 11);
  
  // Truncate report type if too long
  const reportTypeStr = report.patientInfo.reportType || 'Comprehensive';
  doc.text(reportTypeStr.length > 22 ? reportTypeStr.substring(0, 20) + '...' : reportTypeStr, col3X, currentY + 11);
  doc.text(report.patientInfo.specimenId || report.id, col4X, currentY + 11);

  // Row 2: Facility & Doctor
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('LABORATORY FACILITY', col1X, currentY + 18);
  doc.text('REFERRING PHYSICIAN', col2X, currentY + 18);
  doc.text('OVERALL HEALTH STATUS', col3X, currentY + 18);
  doc.text('STATUS', col4X, currentY + 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...darkSlate);
  doc.text(report.patientInfo.labName || 'Apex Diagnostic Labs', col1X, currentY + 23);
  doc.text(report.patientInfo.referringDoctor || 'Dr. A. Verma, MD', col2X, currentY + 23);
  
  // Status highlight
  const isAbnormal = report.summary.abnormalCount > 0;
  if (isAbnormal) {
    doc.setTextColor(180, 83, 9); // amber
  } else {
    doc.setTextColor(...primaryTeal);
  }
  doc.text(report.summary.overallHealthStatus || (isAbnormal ? 'Attention Advised' : 'Normal'), col3X, currentY + 23);
  doc.text(`${report.summary.abnormalCount} Flagged / ${report.tests.length} Tested`, col4X, currentY + 23);

  currentY += 30;

  // 3. Biomarkers Table
  doc.setTextColor(...darkSlate);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('Biomarker Analysis & Clinical Reference Ranges', margin, currentY);
  currentY += 3;

  const tableBody = report.tests.map((test) => {
    let statusText = test.status.toUpperCase();
    if (test.status === 'high') statusText = 'HIGH ^';
    if (test.status === 'low') statusText = 'LOW v';
    if (test.status === 'critical') statusText = '! CRITICAL';

    return [
      test.name,
      test.category || 'General',
      `${test.resultValue} ${test.unit || ''}`.trim(),
      test.referenceRange.text || `${test.referenceRange.min ?? ''} - ${test.referenceRange.max ?? ''}`,
      statusText,
    ];
  });

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: [['Biomarker Test', 'Category', 'Observed Value', 'Reference Range', 'Clinical Status']],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: primaryTeal,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: 2.5,
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: darkSlate,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 48 },
      1: { cellWidth: 38 },
      2: { fontStyle: 'bold', cellWidth: 32 },
      3: { cellWidth: 38 },
      4: { halign: 'center', cellWidth: 26 },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 4) {
        const val = String(data.cell.raw || '');
        if (val.includes('CRITICAL')) {
          data.cell.styles.textColor = [225, 29, 72]; // rose-600
          data.cell.styles.fontStyle = 'bold';
        } else if (val.includes('HIGH') || val.includes('LOW')) {
          data.cell.styles.textColor = [217, 119, 6]; // amber-600
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [13, 148, 136]; // teal-600
        }
      }
    },
  });

  // Get Y after table
  // @ts-expect-error jspdf-autotable adds lastAutoTable to doc
  currentY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 6 : currentY + 50;

  // Check if we have space for Key Findings on current page, else add page
  if (currentY > pageHeight - 65) {
    doc.addPage();
    currentY = margin;
  }

  // 4. Key Clinical Findings & Follow-up Section
  doc.setTextColor(...darkSlate);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('Key Clinical Findings & Actionable Guidance', margin, currentY);
  currentY += 4;

  // Findings box
  const findingsHeight = 28;
  const colWidth = (pageWidth - margin * 2 - 4) / 2;

  // Left column: Findings
  doc.setFillColor(...lightBg);
  doc.setDrawColor(...borderGray);
  doc.roundedRect(margin, currentY, colWidth, findingsHeight, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...primaryTeal);
  doc.text('Primary Clinical Insights', margin + 3, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...darkSlate);

  let findingY = currentY + 10;
  const findings = report.summary.keyFindings.slice(0, 3);
  findings.forEach((f) => {
    const splitText = doc.splitTextToSize(`* ${f.summary}`, colWidth - 6);
    doc.text(splitText, margin + 3, findingY);
    findingY += splitText.length * 3.5 + 1;
  });

  // Right column: Recommendations
  doc.setFillColor(...lightBg);
  doc.setDrawColor(...borderGray);
  doc.roundedRect(margin + colWidth + 4, currentY, colWidth, findingsHeight, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...primaryTeal);
  doc.text('Physician & Lifestyle Recommendations', margin + colWidth + 7, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...darkSlate);

  let recY = currentY + 10;
  const recs = [
    ...report.summary.dietaryRecommendations.slice(0, 2).map((d) => `Diet: ${d}`),
    ...report.summary.lifestyleModifications.slice(0, 1).map((l) => `Lifestyle: ${l}`),
  ];

  recs.forEach((r) => {
    const splitText = doc.splitTextToSize(`* ${r}`, colWidth - 6);
    doc.text(splitText, margin + colWidth + 7, recY);
    recY += splitText.length * 3.5 + 1;
  });

  currentY += findingsHeight + 6;

  // 5. Medical Disclaimer & Digital Signature Footer
  if (currentY > pageHeight - 25) {
    doc.addPage();
    currentY = margin;
  }

  doc.setDrawColor(...borderGray);
  doc.line(margin, pageHeight - 22, pageWidth - margin, pageHeight - 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  const disclaimer = report.summary.medicalDisclaimer || 
    'MedInsight AI is an automated diagnostic analysis engine for decision support. Consult a licensed medical professional for clinical treatment decisions.';
  const splitDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - margin * 2 - 50);
  doc.text(splitDisclaimer, margin, pageHeight - 17);

  // Verification Signature stamp
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...darkSlate);
  doc.text('AUTHORIZED REVIEW', pageWidth - margin, pageHeight - 16, { align: 'right' });
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(report.patientInfo.referringDoctor || 'Dr. A. Verma, MD', pageWidth - margin, pageHeight - 12, { align: 'right' });

  // Save the PDF file locally with sanitized patient name & report ID
  const sanitizedName = (report.patientInfo.name || 'Patient').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `MedInsight_Report_${sanitizedName}_${report.id}.pdf`;
  doc.save(filename);
}
