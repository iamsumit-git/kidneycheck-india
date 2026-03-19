# KidneyCheck — Windows Setup Guide

## Prerequisites — Install These First

### 1. Node.js
- Go to: https://nodejs.org
- Download the LTS version (green button)
- Run the installer — click Next through everything
- Verify: open PowerShell and type `node --version` → should show v18+

### 2. Python
- Go to: https://www.python.org/downloads
- Download Python 3.11 (latest stable)
- Run installer — IMPORTANT: tick "Add Python to PATH" before clicking Install
- Verify: open PowerShell and type `python --version` → should show 3.11+

### 3. Git
- Go to: https://git-scm.com/download/win
- Download and install (click Next through everything)
- Verify: open PowerShell and type `git --version`

---

## Setup Steps (Do These Once)

Open PowerShell in the kidneycheck folder.
(Right-click inside the folder → "Open in Terminal" or "Open PowerShell window here")

### Step 1 — Get the ML models
```powershell
git clone https://github.com/ap-atul/Chronic-Kidney-Disease ap-atul-ckd
copy ap-atul-ckd\model\inbuilt_nb_model.pkl  ml-service\model\
copy ap-atul-ckd\model\inbuilt_knn_model.pkl ml-service\model\
copy ap-atul-ckd\model\inbuilt_lr_model.pkl  ml-service\model\
```

### Step 2 — Add your API key
```powershell
copy frontend\.env.local.example frontend\.env.local
notepad frontend\.env.local
```
In Notepad, change this line:
```
ANTHROPIC_API_KEY=your_anthropic_api_key
```
To your actual key from https://console.anthropic.com → API Keys → Create Key

Save and close Notepad.

### Step 3 — Install Python dependencies
```powershell
cd ml-service
pip install -r requirements.txt
cd ..
```

### Step 4 — Install Node dependencies
```powershell
cd frontend
npm install
cd ..
```

---

## Running the App (Every Time)

### Option A — Double-click (easiest)
Double-click `start.bat` in the kidneycheck folder.
Two black windows open — one for ML service, one for frontend.
Browser opens automatically at http://localhost:3000

### Option B — Manual (two PowerShell windows)

**Window 1 — ML Service:**
```powershell
cd ml-service
python main.py
```
You should see: `Uvicorn running on http://0.0.0.0:8000`

**Window 2 — Frontend:**
```powershell
cd frontend
npm run dev
```
You should see: `ready started server on http://localhost:3000`

Then open http://localhost:3000 in your browser.

---

## Verify Everything Works

1. Open http://localhost:8000 in browser
   - Should show: `{"status":"running","models_loaded":["naive_bayes","knn","logistic"]}`

2. Open http://localhost:3000 in browser
   - Should show the KidneyCheck landing page

3. Click "Check My Kidney Health" → answer 10 questions → see your result

4. Open http://localhost:3000/admin → password: `dedhia2024`

---

## Common Errors and Fixes

### "npm is not recognized"
Node.js is not installed or not in PATH.
Fix: Reinstall Node.js from nodejs.org, tick "Add to PATH"

### "python is not recognized"  
Python is not installed or not in PATH.
Fix: Reinstall Python from python.org, tick "Add Python to PATH"

### "pip install fails" or SSL errors
```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt --trusted-host pypi.org
```

### ML service starts but shows "models_missing"
Model files not copied correctly.
Fix:
```powershell
dir ml-service\model\
```
Should show 3 .pkl files. If not, repeat Step 1.

### Frontend shows "Module not found"
```powershell
cd frontend
npm install
npm run dev
```

### Port already in use
Another app is using port 3000 or 8000.
Fix — frontend: `cd frontend && npx next dev -p 3001`
Fix — ML: `cd ml-service && python main.py` (edit port in main.py line: `port=8001`)

### "ANTHROPIC_API_KEY is missing" — Claude explanation doesn't show
Open `frontend\.env.local`, check the key is set correctly (no quotes, no spaces).

---

## Folder Structure
```
kidneycheck\
├── start.bat              ← Double-click to run on Windows
├── frontend\              ← Next.js web app
│   ├── app\               ← All pages
│   │   ├── page.tsx       ← Landing page
│   │   ├── screening\     ← 10 questions
│   │   ├── results\       ← Risk result + ML + Claude
│   │   ├── lab-values\    ← Optional blood test entry
│   │   └── admin\         ← Dr. Dedhia dashboard
│   ├── lib\
│   │   ├── questions.ts   ← All questions + scoring logic
│   │   └── supabase.ts    ← Database client
│   └── .env.local         ← Your API keys (create this)
└── ml-service\            ← Python FastAPI ML service
    ├── main.py            ← FastAPI app + prediction logic
    ├── model\             ← Put .pkl files here
    └── requirements.txt
```
