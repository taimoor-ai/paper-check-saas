# 📘 Paper Checking SaaS

A full-stack paper checking SaaS platform with a React/Tailwind frontend and a FastAPI backend. The app provides authentication, billing, teacher/student workflows, assessments, and AI-powered features using Supabase, Stripe, and additional AI libraries.

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Frontend](#frontend)
- [Backend](#backend)
- [Technology Stack](#technology-stack)
- [Setup & Run](#setup--run)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Notes](#notes)

## Project Overview

This repository contains two main applications:

- `frontend/` — a React + Vite single-page application for user interaction, authentication, billing, and results display.
- `backend/` — a Python FastAPI application providing REST APIs, authentication logic, billing workflows, and Supabase integration.

The frontend and backend are designed to work together, with the backend serving as the API layer and the frontend handling user flows and presentation.

## 🚀 Key Features

- 🔐 User authentication with Supabase
- ✉️ Password reset and email verification flows
- 💳 Payment checkout using Stripe
- 📊 Billing history and points system for users
- 🧑‍🏫 Teacher and student assessment management
- 📱 Responsive landing page and auth pages
- 🤖 AI / NLP backend dependencies for advanced scoring and document processing

## 🏗️ Architecture

- 🌐 Frontend: React application built with Vite, using modern React hooks and client-side routing.
- ⚙️ Backend: FastAPI web server exposing REST endpoints and supporting CORS for the frontend.
- 🗄️ Database/Auth: Supabase used for authentication, database storage, and user profile management.
- 💵 Payments: Stripe checkout sessions and webhook processing for payment confirmation.
- 🧠 AI/ML: Backend includes libraries such as LangChain, sentence-transformers, Llama Cloud, and other tools for AI workflows.

## 🎨 Frontend

The frontend is implemented using:

- ⚛️ React 19
- 🚀 Vite
- 🎨 Tailwind CSS
- 🧭 React Router DOM for navigation
- 🌐 Axios for HTTP requests
- 🔔 React Hot Toast and React Toastify for notifications

Main frontend folders:

- `src/components/` — reusable UI components
- `src/pages/` — page views like login, register, forgot password, verify email
- `src/lib/api.js` — API helper functions
- `src/styles/` — theme and styling config

## 🧩 Backend

The backend is implemented using:

- 🚀 FastAPI
- 🔧 Uvicorn
- 🗄️ Supabase Python client
- 💳 Stripe Python SDK
- 🔐 Passlib bcrypt for password security
- 🧾 Python-JOSE for JWT handling
- 🌿 Dotenv for environment loading

Main backend folders:

- `controller/` — business logic for auth, billing, teacher, assessment, and student workflows
- `db/` — Supabase client and configuration
- `routes/` — FastAPI route definitions
- `schemas/` — request/response validation and data models
- `testing/` — notebooks and scripts for AI pipeline experimentation

## 🧪 Technology Stack

### Frontend

- ⚛️ `react`
- 🌐 `react-dom`
- 🧭 `react-router-dom`
- 🔌 `axios`
- 🪶 `tailwindcss`
- 🧩 `@tailwindcss/vite`
- 🚀 `vite`
- 🔔 `react-hot-toast`
- 📨 `react-toastify`

### Backend

- 🚀 `fastapi`
- 🔧 `uvicorn[standard]`
- 🔐 `passlib[bcrypt]`
- 🌿 `python-dotenv`
- 🧾 `python-jose`
- 🗄️ `supabase`
- 🛡️ `argon2-cffi`
- ✉️ `mailtrap`
- 📧 `resend`
- 🧠 `mpi4py`
- 🤖 `llama-cloud`
- 🧠 `sentence-transformers`
- 🧩 `langchain-core`
- 🌐 `langchain-groq`
- 📊 `langgraph`
- 📦 `python-multipart`
- 🧠 `langchain`
- 💳 `stripe`
- 🧪 `ipykernel`

> Note: Some backend dependencies support AI workflows and advanced NLP/embedding capabilities.

## Setup & Run

### Prerequisites

- 🖥️ Node.js (for frontend)
- 📦 npm or yarn
- 🐍 Python 3.12+ (for backend)
- 🧰 `pip` package manager
- 🌐 A Supabase project and Stripe account for backend integrations

### Backend Setup

1. Open a terminal and navigate to the backend folder:

```bash
cd backend
```

2. Create and activate a Python virtual environment:

```bash
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
# Windows CMD
.venv\Scripts\activate.bat
```

3. Install backend dependencies from `pyproject.toml`:

```bash
python -m pip install --upgrade pip
python -m pip install .
```

4. Create a `.env` file in `backend/` and add required environment variables.

5. Run the backend server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`.

### Frontend Setup

1. Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```

2. Install frontend dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will be available at the Vite default URL, usually `http://localhost:5173`.

### Frontend Production Build

```bash
npm run build
npm run preview
```

## 🔑 Environment Variables

Create a `.env` file inside `backend/` with values for:

- `SUPABASE_URL`
- `SUPABASE_KEY` or `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `FRONTEND_URL` (default: `http://localhost:5173`)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

Example `.env`:

```env
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_KEY=your-supabase-key
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Project Structure

### Root

- `backend/` — FastAPI app and server logic
- `frontend/` — React/Vite frontend app

### Backend highlights

- `main.py` — FastAPI entrypoint
- `routes/` — API routers for auth, billing, teacher, student, assessment
- `controller/` — logic implementations
- `db/` — Supabase client configuration
- `schemas/` — Pydantic models and request validation

### Frontend highlights

- `src/App.jsx` — main React app
- `src/main.jsx` — Vite entrypoint
- `src/components/` — reusable UI components
- `src/pages/` — auth and landing pages
- `src/lib/api.js` — HTTP helper utilities

## Notes

- The backend includes Supabase authentication and Stripe checkout/payment webhook handling.
- The frontend expects the backend to allow CORS from the configured `FRONTEND_URL`.
- If you add new backend endpoints or frontend routes, keep the environment and CORS configuration in sync.
- The repository also contains testing notebooks under `backend/testing/` for AI pipeline development.

---

Happy coding! 🚀