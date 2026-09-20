# MedInsight AI — Clinical Laboratory Pathology & Decision-Support System

> **Academic Project 2026**  
> **Author**: Nisha Girraj Singh (Roll No: 266629)  
> **Project Guide**: Tazeen Shaikh  
> **Institution**: K.B.P Navi Mumbai Vashi  

---

## 📌 Project Overview
**MedInsight AI** is an intelligent Clinical Laboratory Pathology & Decision-Support System designed to parse, normalize, and interpret complex blood test panels and diagnostic reports.

### Key Capabilities:
- **Multimodal OCR & Document Parsing**: Extracts biomarkers from unstructured PDF or image-based laboratory reports.
- **Panic & Critical Threshold Flagging**: Automatic evaluation against clinical reference intervals with real-time panic notifications.
- **Patient Account Longitudinal Sync**: Organizes patient history, delta checks, and biomarker trend analysis over time.
- **Export & Print**: Single-click hospital-ready diagnostic summary printing and local high-resolution PDF download generation (`jspdf` & `jspdf-autotable`).
- **Developer & Student Profile**: Dedicated author credentials and academic attribution built into the user interface.

---

## 🚀 Live Demo Link

Aap is project ka live working link yahan se direct access kar sakte hain:
- **Live URL**: [https://ais-pre-2yorbxw2sgnjv4iys46x7k-249615924183.asia-southeast1.run.app](https://ais-pre-2yorbxw2sgnjv4iys46x7k-249615924183.asia-southeast1.run.app)

---

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Motion
- **Backend / API**: Node.js, Express, tsx, esbuild
- **PDF Engine**: jsPDF, jsPDF-AutoTable
- **AI / OCR Extraction**: Google Gemini 2.5 Flash (`@google/genai`)

---

## 💻 How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
cd YOUR_REPOSITORY_NAME
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Free Hosting (Vercel / Render / Cloud Run)

### Option A: Render (Full-Stack Support)
1. Push this project to your GitHub repository.
2. Sign up on [Render.com](https://render.com).
3. Click **New +** -> **Web Service** -> Connect your GitHub repo.
4. Set:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment Variable**: `GEMINI_API_KEY`
5. Render will give you a free public link (`https://your-project.onrender.com`).

### Option B: Vercel (Client-Side Preview)
1. Import repository into [Vercel](https://vercel.com).
2. Framework preset: **Vite**.
3. Build Command: `npm run build`, Output directory: `dist`.

---

## 👩‍🎓 Author & Acknowledgements
- **Developer**: Nisha Girraj Singh (Roll No: 266629)
- **Mentor / Guide**: Tazeen Shaikh
- **College**: K.B.P Navi Mumbai Vashi
