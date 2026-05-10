# Assessment Backend — Node.js/Express

FastAPI → Node.js conversion. Full feature parity.

## Tech Stack

| Layer | Python (original) | Node.js (converted) |
|---|---|---|
| Framework | FastAPI | Express.js |
| Auth | Supabase Auth | Supabase Auth |
| DB | Supabase (via supabase-py) | Supabase (via @supabase/supabase-js) |
| Payments | stripe-python | stripe |
| LLM | LangChain + Groq | groq-sdk |
| AI Pipeline | LangGraph | Promise.all (parallel) |
| File Extract | LlamaCloud (python SDK) | LlamaCloud (REST API via axios) |
| Validation | Pydantic | Zod |
| Logging | Python logging | Winston |
| File Upload | FastAPI UploadFile | Multer |

## Project Structure

```
src/
├── server.js               # App entry point, middleware setup
├── config/
│   └── supabase.js         # Supabase client (anon + admin)
├── middleware/
│   ├── auth.middleware.js  # JWT Bearer token validation
│   └── errorHandler.js     # Global error handler + HttpError class
├── routes/
│   ├── auth.routes.js
│   ├── billing.routes.js
│   ├── teacher.routes.js
│   ├── student.routes.js
│   └── assessment.routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── billing.controller.js
│   ├── teacher.controller.js
│   ├── student.controller.js
│   └── assessment.controller.js
├── services/
│   ├── workflow.service.js     # AI pipeline (LangGraph equivalent)
│   └── llamaExtract.service.js # LlamaCloud file extraction
├── validators/
│   └── auth.validators.js  # Zod schemas + validate() middleware
└── utils/
    └── logger.js           # Winston logger
```

## Setup

```bash
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

## API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /auth/signup | ❌ | Register new user |
| POST | /auth/login | ❌ | Login, get tokens |
| POST | /auth/logout | ✅ | Logout |
| POST | /auth/forgot-password | ❌ | Send reset email |
| POST | /auth/reset-password | ❌ | Reset with token |
| POST | /auth/refresh | ❌ | Refresh session |
| GET | /auth/me | ✅ | Get current user + points |
| POST | /billing/create-checkout | ✅ | Create Stripe checkout |
| POST | /billing/webhook | ❌ | Stripe webhook |
| GET | /billing/history | ✅ | Get billing history |
| POST | /teacher/extract-teacher-data | ✅ | Extract Q&A from teacher file/text |
| POST | /student/extract-student-data | ✅ | Extract Q&A from student file/text |
| POST | /assessment/evaluate | ✅ | Run full AI assessment (costs 20 pts) |

## Key Design Decisions

- **Stripe webhook**: Requires raw body. Express JSON parser is applied AFTER the webhook route in server.js using path-specific `express.raw()`.
- **AI Pipeline**: LangGraph's parallel node execution is replicated with `Promise.all()`. Nodes A (eval), B (similarity), C (plagiarism) run in parallel, then Node D (overall) merges results.
- **Points refund**: If the AI pipeline throws, points are restored to original balance before re-throwing.
- **Auth middleware**: Verifies JWT with Supabase, fetches `points_balance` from `user_profiles`, and attaches to `req.user`.
