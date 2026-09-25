# AstroMath — AI-Powered Vedic Astrology SaaS Platform 🌌

> **Deterministic Swiss Ephemeris Precision** (`swisseph-wasm`, NASA JPL DE431 & Lahiri Ayanamsa) coupled with **Google Gemini AI Brain** for enlightened, zero-hallucination astrological synthesis.

---

## 🌟 Key Highlights

- **100% Deterministic Calculations**: Planetary longitudes, speeds, retrograde status, house cusps, and ascendant (Lagna) calculated using Swiss Ephemeris with Chitrapaksha (Lahiri) Ayanamsa.
- **Divisional Charts**:
  - **D1 (Lagna / Rashi Chart)**: Natal life blueprint.
  - **D9 (Navamsha Chart)**: Critical for marriage, inner strength, and spouse analysis.
  - **D10 (Dashamsha Chart)**: Critical for career, authority, and status.
- **120-Year Vimshottari Dasha Engine**: Full hierarchical timeline calculated from natal Moon degrees (Mahadasha, Antardasha, and active period detection).
- **Daily Gochar (Transit Analysis)**: Real-time transit comparison against natal Moon for **Chandra Bala** and 9-fold **Tara Bala**.
- **Mangal Dosha (Kuja Dosha) Analysis**: Comprehensive evaluation across 1st, 2nd, 4th, 7th, 8th, and 12th houses with classical cancellation (Bhanga) rules.
- **Zero-Hallucination AI Brain (Gemini)**: The AI never invents planetary positions. It is fed ground-truth mathematical facts and acts as a wise Vedic Astrologer providing empathetic, deeply nuanced guidance in Marathi and English.
- **Deep-Space Orbit UI**: Featuring an interactive cosmic Orbit visualizer with 9 realistic Navagraha planetary bodies, transparent backgrounds, and animated starfield.
- **Email OTP Authentication**: Registration requires 6-digit OTP verification sent via **Nodemailer** before login is permitted.
- **Cloudflare & SQL Enterprise Ready**: Modular database schema compatible with **Cloudflare D1** and **SQLite**.

---

## 🏗️ Architecture

```
[ User Input (Birth Date, Time, City) ]
                   │
                   ▼
┌──────────────────────────────────────────────┐
│  AstroMath Engine (swisseph-wasm)            │
│  - Lahiri Ayanamsa (JPL DE431)               │
│  - D1, D9, D10 Divisional Charts             │
│  - 120-Year Vimshottari Dasha Tree           │
│  - Today's Gochar (Chandra Bala & Tara Bala) │
│  - Mangal Dosha & House Placements           │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
          [ Structured Facts JSON ]
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  Gemini AI Brain (gemini-3.5-flash / 3.8)    │
│  - Vedic Master Astrologer System Prompt     │
│  - Zero Hallucination Grounding              │
│  - Deep-Dive (Career, Marriage, Daily, Chat) │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  SaaS Frontend (React + Vite + Tailwind)     │
│  - Dominik Koch OrbitImages Navagraha        │
│  - Traditional North Indian Diamond SVG      │
│  - Dasha Timeline & Daily Analysis Feed      │
│  - Nodemailer Email OTP Auth Modal           │
└──────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### 1. Environment Setup

Copy `.env.example` to `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=AstroMath <auth@astromath.ai>
PORT=5000
```

*(Note: In development mode without SMTP credentials, OTP codes are logged directly to the server terminal).*

### 2. Install & Build

```bash
# Install root dependencies
npm install

# Build frontend
npm run build

# Start production server
npm start
```

For development mode:
```bash
# Terminal 1: Backend API Server
npm run dev:server

# Terminal 2: Frontend Vite Dev Server
npm run dev:client
```

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/signup`: Register user and dispatch email OTP.
- `POST /api/auth/verify-otp`: Validate 6-digit OTP and issue JWT.
- `POST /api/auth/resend-otp`: Dispatch a fresh OTP.
- `POST /api/auth/login`: Authenticate verified users.

### Astronomical Engine (`/api/chart`)
- `POST /api/chart/calculate`: Compute D1, D9, D10, Vimshottari Dasha, and Doshas.
- `POST /api/chart/daily`: Compute today's Gochar, Chandra Bala, and Tara Bala.

### AI Astrologer Brain (`/api/ai`)
- `POST /api/ai/interpret`: Deep-dive analysis for Career, Marriage, or Daily Forecast.
- `POST /api/ai/chat`: Multi-turn conversational consultation grounded in chart facts.

---

## ☁️ Cloudflare Deployment Guide

1. **Frontend**: The `frontend/dist` directory can be deployed directly to **Cloudflare Pages**.
2. **Database**: The SQL schema in `server/db.js` maps directly to **Cloudflare D1**.
3. **WASM Compatibility**: `swisseph-wasm` is pure WebAssembly and runs natively on Cloudflare Workers and Pages Functions.

---

## 📜 License
Licensed under GPL-3.0-or-later in compliance with Swiss Ephemeris open-source licensing terms.
