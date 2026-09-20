export interface MetricItem {
  name: string;
  value: number | string;
  unit: string;
  range: string;
  status: 'normal' | 'high' | 'low';
}

export interface MedicalReport {
  id: string;
  title: string;
  patientName: string;
  date: string;
  type: string;
  summary: string;
  status: 'normal' | 'attention' | 'critical';
  metrics: MetricItem[];
}

export const mockReports: MedicalReport[] = [
  {
    id: 'rep-001',
    title: 'Comprehensive Metabolic Panel',
    patientName: 'Sample Patient',
    date: '2026-03-15',
    type: 'Blood Test',
    summary: 'Slightly elevated fasting glucose and mild ALT elevation observed. Kidney function markers remain within optimal reference limits.',
    status: 'attention',
    metrics: [
      { name: 'Fasting Glucose', value: 112, unit: 'mg/dL', range: '70 - 99', status: 'high' },
      { name: 'HbA1c', value: 5.7, unit: '%', range: '4.0 - 5.6', status: 'high' },
      { name: 'Creatinine', value: 0.95, unit: 'mg/dL', range: '0.7 - 1.3', status: 'normal' },
      { name: 'BUN', value: 16, unit: 'mg/dL', range: '7 - 20', status: 'normal' },
      { name: 'ALT (SGPT)', value: 48, unit: 'U/L', range: '7 - 45', status: 'high' }
    ]
  },
  {
    id: 'rep-002',
    title: 'Complete Blood Count (CBC)',
    patientName: 'Sample Patient',
    date: '2026-03-18',
    type: 'Hematology',
    summary: 'Hemoglobin and RBC counts are balanced. Platelet count is normal with no active signs of acute infection or microcytic anemia.',
    status: 'normal',
    metrics: [
      { name: 'White Blood Cell (WBC)', value: 6.8, unit: 'x10^3/uL', range: '4.5 - 11.0', status: 'normal' },
      { name: 'Red Blood Cell (RBC)', value: 4.6, unit: 'x10^6/uL', range: '4.0 - 5.2', status: 'normal' },
      { name: 'Hemoglobin (Hb)', value: 13.8, unit: 'g/dL', range: '12.0 - 16.0', status: 'normal' },
      { name: 'Platelets', value: 240, unit: 'x10^3/uL', range: '150 - 450', status: 'normal' }
    ]
  },
  {
    id: 'rep-003',
    title: 'Lipid Profile & Cardiovascular Risk',
    patientName: 'Sample Patient',
    date: '2026-03-10',
    type: 'Cardiovascular',
    summary: 'Elevated low-density lipoprotein (LDL) and triglycerides warrant lifestyle and dietary modifications.',
    status: 'critical',
    metrics: [
      { name: 'Total Cholesterol', value: 245, unit: 'mg/dL', range: '< 200', status: 'high' },
      { name: 'HDL (Good)', value: 38, unit: 'mg/dL', range: '> 40', status: 'low' },
      { name: 'LDL (Bad)', value: 168, unit: 'mg/dL', range: '< 100', status: 'high' },
      { name: 'Triglycerides', value: 195, unit: 'mg/dL', range: '< 150', status: 'high' }
    ]
  }
];
