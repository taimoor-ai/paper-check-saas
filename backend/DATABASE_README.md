# Database Schema & Tables Plan

Based on the frontend UI components, the backend implementation, and critical audit requirements for an AI SaaS application, here is the robust and optimized database architecture.

## 1. Already Created Tables

Currently, the backend is integrated with **Supabase** and handles authentication using its built-in modules.

### `auth.users` (Managed by Supabase)
This table automatically handles user registration, login, and security. 
- **`id`** (UUID, Primary Key)
- **`email`** (String)
- **`encrypted_password`** (String)
- **`created_at`** (Timestamp)
- **`last_sign_in_at`** (Timestamp)
- **`raw_user_meta_data`** (JSONB) - Store custom fields at registration like `username`.

*(Note: We use a Postgres trigger on this table to automatically insert a corresponding row into `user_profiles` and seed them with **200 free initial credits**).*

---

## 2. Tables to be Created

To support scalable billing audits, transactional point histories, and highly performant document checking, we need the following core tables:

### `user_profiles` (Extending Auth info)
Stores application-specific user data to ensure transactional row-locking is possible during point deduction.
- **`id`** (UUID, Primary Key, Foreign Key -> `auth.users.id`)
- **`username`** (String)
- **`points_balance`** (Integer, Default: 200) - Tracks available credits. Required to be seeded at 200 via a Supabase trigger on user creation.
- **`created_at`** (Timestamp, Default: NOW())
- **`updated_at`** (Timestamp, DEFAULT: NOW())

### `billing_history` (Purchases)
Tracks point pack purchases and links them reliably to Stripe to avoid double-crediting on webhooks.
- **`id`** (UUID, Primary Key)
- **`user_id`** (UUID, Foreign Key -> `user_profiles.id`)
- **`stripe_session_id`** (VARCHAR, UNIQUE) - Critical for webhook reconciliation. The `UNIQUE` constraint strictly prevents duplicate rows when Stripe fires webhook retries, ensuring users are never double-credited.
- **`stripe_payment_intent_id`** (VARCHAR) - Used to verify successful payments.
- **`purchase_date`** (Timestamp, Default: NOW())
- **`points_added`** (Integer) - e.g., 500, 1000, 2500
- **`amount_usd`** (Decimal) - Amount paid (e.g., $5.00, $10.00)
- **`payment_method`** (String) - e.g., "Stripe •••• 4242"
- **`status`** (ENUM: `'pending'`, `'completed'`, `'failed'`, `'refunded'`) - Enforcing an ENUM secures exact match capabilities for Stripe webhook parsing and frontend querying.

### `credit_transactions` (Audit Trail)
Crucial to create an immutable ledger for every point credit, debit, or refund. Allows you to confidently handle user billing disputes.
- **`id`** (UUID, Primary Key)
- **`user_id`** (UUID, Foreign Key -> `user_profiles.id`)
- **`type`** (ENUM: `credit` | `debit` | `refund`)
- **`amount`** (Integer) - Absolute positive value of the transaction.
- **`balance_after`** (Integer) - Running tally snapshot.
- **`reference_id`** (UUID) - Points to either an `assessment_id` (for debits/refunds) or a `billing_history.id` (for purchases).
- **`reference_type`** (VARCHAR) - E.g., 'assessment' or 'billing'
- **`note`** (Text) - Human-readable note (e.g., "Paper check deducted: Advanced Mode").
- **`created_at`** (Timestamp, Default: NOW())

### `assessments` (or `paper_checks`)
Records the full input documents, metadata, and the structured AI evaluation details. AI outputs are stored in a unified JSONB structure to cleanly eliminate bulky multi-table joins.
- **`id`** (UUID, Primary Key)
- **`user_id`** (UUID, Foreign Key -> `user_profiles.id`)
- **`student_name`** (String) *(Note: Compute student_initials visually on the frontend to avoid stale data)*.
- **`paper_title`** (String)
- **`analysis_mode`** (String) - "Fast", "Standard", or "Advanced"
- **`points_cost`** (Integer) - Always 20 points per check
- **`status`** (ENUM: `'PROCESSING'`, `'IN REVIEW'`, `'COMPLETED'`, `'FLAGGED'`, `'FAILED'`) - Uses a strict constraint to avoid typos breaking the UI.
- **`total_score`** (Decimal) - Final grading score out of 100
- **`ai_confidence`** (Decimal) - e.g., 0.94 (94%)
- **`plagiarism_match`** (Decimal) - Percentage of plagiarism detected
- *---- INPUTS ----*
- **`answer_key_url`** (VARCHAR, nullable) - S3/Supabase Storage path
- **`answer_key_text`** (TEXT, nullable) - Handles raw pasted text submissions
- **`answer_key_filename`** (VARCHAR, nullable) - e.g., "Key_Chapter5.pdf"
- **`student_paper_url`** (VARCHAR, nullable) - S3/Supabase Storage path
- **`student_paper_text`** (TEXT, nullable) - Handles raw pasted text submissions
- **`student_paper_filename`** (VARCHAR, nullable) - e.g., "Biology_Exam.pdf"
- *---- OUTPUT ----*
- **`ai_feedback_json`** (JSONB) - The structured AI grading output. Example format: `[{ question_number: "01", score_awarded: 8, score_max: 10, ai_reasoning: "...", student_answer: "...", expected_answer: "...", tags: [...] }]`. Using decimals for score instead of raw strings like "8/10" allows SQL averaging and aggregations.
  - *(Architectural Note: Create a GIN index `CREATE INDEX idx_assessments_ai_feedback ON assessments USING GIN (ai_feedback_json);` to optimize complex JSON queries across cohorts without table scans).*
- **`processing_error`** (TEXT, nullable) - Stores exact failure reasons (e.g., LLM timeout, OCR fail). Retains partially finished AI results so developers can manually retry just the failed questions without wiping the check.
- **`retry_count`** (INT, Default: 0) - Tracks consecutive automatic background worker fails.
- *---- TIMESTAMPS ----*
- **`created_at`** (Timestamp, Default: NOW())
- **`updated_at`** (Timestamp) - Handled via Postgres trigger or background workers when an assessment transitions from PROCESSING to COMPLETED.

---

### Concept Summary (Optimized Workflow)
1. **Authentication:** User registers via Supabase. A Postgres trigger catches this creation, seamlessly making a `user_profiles` row to hold **200 free promotional points**.
2. **Purchases:** Successful Stripe payments hit a webhook, mapped exactly via `stripe_session_id`. Points get inserted into `billing_history`.
3. **Immutable Auditing:** Whenever they buy a pack OR execute a check, an exhaustive row is recorded in `credit_transactions` calculating their precise `balance_after`.
4. **App Usage:** Initiating a `NewCheck.jsx` locks their profile row transactionally, debits 20 points, drops an audit in `credit_transactions`, and stages a `'PROCESSING'` ENUM status inside `assessments`.
5. **AI Processing:** Background servers receive the task. Since inputs decouple `_url` from `_text`, we natively handle file uploads and clipboard-pastes concurrently. AI deposits highly structured array data to `ai_feedback_json` with numeric `score_awarded` splits, stamps `updated_at`, and finalizes the `'COMPLETED'` ENUM.
