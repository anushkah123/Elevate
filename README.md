# 🧠 QuizGen AI

> AI-powered quiz platform using NVIDIA NIM (LLaMA 3.3 70B), React frontend on GitHub Pages, and Express backend on Railway.

---

## 🏗️ Architecture

```
quizgen/
├── frontend/          # React app → deploys to GitHub Pages
├── backend/           # Express.js API → deploys to Railway
└── .github/workflows/ # CI/CD pipeline
```

---

## 🚀 Deployment Guide (Step by Step)

### Step 1 — Get your NVIDIA NIM API Key

1. Go to [https://build.nvidia.com](https://build.nvidia.com)
2. Sign up / log in
3. Click **Get API Key**
4. Copy your key (starts with `nvapi-`)

---

### Step 2 — Deploy Backend to Railway

1. Go to [https://railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project → Deploy from GitHub repo**
3. Select your repository → choose the **`backend`** folder as root (or set Root Directory to `backend` in Railway settings)
4. In Railway project settings, add these **Environment Variables**:
   ```
   NVIDIA_NIM_API_KEY=nvapi-your-key-here
   FRONTEND_URL=https://YOUR_GITHUB_USERNAME.github.io
   PORT=5000
   ```
5. Railway will auto-deploy. Copy your Railway URL (e.g., `https://quizgen-backend.up.railway.app`)

**Railway Settings:**
- Root Directory: `backend`
- Start Command: `node server.js`
- Health Check Path: `/api/health`

---

### Step 3 — Set GitHub Secrets

In your GitHub repo → **Settings → Secrets and variables → Actions**, add:

| Secret Name | Value |
|-------------|-------|
| `REACT_APP_API_URL` | Your Railway URL (e.g., `https://quizgen-backend.up.railway.app`) |

---

### Step 4 — Enable GitHub Pages

1. In GitHub repo → **Settings → Pages**
2. Set Source: **GitHub Actions** (or `gh-pages` branch)
3. The workflow will auto-deploy on every push to `main`

---

### Step 5 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial QuizGen AI deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/quizgen-ai.git
git push -u origin main
```

The GitHub Actions workflow will:
- Build the React app with your Railway backend URL injected
- Deploy to GitHub Pages automatically

Your site will be live at: `https://YOUR_USERNAME.github.io/quizgen-ai`

---

## 💻 Local Development

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env and add your NVIDIA NIM API key
npm install
npm run dev
# Running at http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env: REACT_APP_API_URL=http://localhost:5000
npm install
npm start
# Running at http://localhost:3000
```

---

## 🎯 Features

- **AI Quiz Generation** — Enter any topic → NVIDIA NIM LLaMA 3.3 70B generates real questions
- **3 Question Formats** — MCQ, True/False, Short Answer (or mixed)
- **3 Difficulty Levels** — Easy, Medium, Hard
- **Live Timer** — 30-second countdown per question with auto-advance
- **Instant Explanations** — AI-generated explanations for every answer
- **Adaptive Practice** — Detects weak subtopics → generates targeted follow-up questions
- **Flashcard Mode** — Flip any quiz into interactive flashcards
- **Analytics Dashboard** — Score history line chart, radar mastery chart, full history table
- **Dark / Light Mode** — Persistent theme toggle
- **File Upload** — Upload .txt or .md files to generate quizzes from your own content

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|------------|
| AI | NVIDIA NIM — LLaMA 3.3 70B Instruct |
| Frontend | React 18, React Router, Recharts, Framer Motion, Lucide |
| Backend | Node.js, Express, Axios |
| Frontend Deploy | GitHub Pages + GitHub Actions |
| Backend Deploy | Railway |
| Styling | Custom CSS Design System (DM Sans + Syne) |

---

## 📁 File Structure

```
backend/
├── server.js              # Express app entry point
├── routes/
│   ├── health.js          # GET /api/health
│   └── quiz.js            # POST /api/quiz/generate, /api/quiz/adaptive
├── services/
│   └── nvidiaService.js   # NVIDIA NIM API integration
├── railway.toml           # Railway deployment config
├── nixpacks.toml          # Build config
└── .env.example           # Environment variables template

frontend/
├── public/index.html
└── src/
    ├── App.js             # Routes
    ├── index.js           # Entry point
    ├── context/
    │   ├── ThemeContext.js
    │   └── QuizContext.js
    ├── services/api.js    # Axios API client
    ├── components/Navbar.js
    ├── pages/
    │   ├── Landing.js
    │   ├── CreateQuiz.js
    │   ├── Quiz.js
    │   ├── Results.js
    │   ├── Adaptive.js
    │   └── Dashboard.js
    └── styles/global.css

.github/workflows/deploy.yml  # CI/CD pipeline
```

---

## 🐛 Troubleshooting

**CORS error?** → Make sure `FRONTEND_URL` in Railway matches your exact GitHub Pages URL.

**401 from NVIDIA NIM?** → Double-check your `NVIDIA_NIM_API_KEY` starts with `nvapi-`.

**Build fails on GitHub Actions?** → Make sure `REACT_APP_API_URL` secret is set in GitHub repo settings.

**Railway not deploying?** → Set Root Directory to `backend` in Railway project settings.
