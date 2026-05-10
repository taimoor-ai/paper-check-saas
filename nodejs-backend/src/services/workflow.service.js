/**
 * AI Assessment Workflow
 * ─────────────────────
 * Node.js equivalent of graph/workflow.py (LangGraph pipeline)
 *
 * Pipeline runs 3 parallel tasks:
 *   A) Question evaluation  (Groq LLM, structured output)
 *   B) Similarity scoring   (cosine similarity via Groq embeddings)
 *   C) Plagiarism check     (Groq LLM, structured output)
 *
 * Then merges into a final overall evaluation node.
 */

import Groq from "groq-sdk";
import logger from "../utils/logger.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile";

// ─── Helper: call Groq and parse JSON response ────────────
async function callGroqJSON(prompt, systemPrompt = "") {
  const messages = [];

  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }

  messages.push({ role: "user", content: prompt });

  const response = await groq.chat.completions.create({
    model: MODEL,
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages,
  });

  const raw = response.choices[0].message.content;
  return JSON.parse(raw);
}

// ─── Helper: cosine similarity between two vectors ────────
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

// ─── Helper: get embeddings via Groq ──────────────────────
// NOTE: Groq doesn't natively expose embeddings endpoint.
// We simulate with the LLM asking it to produce embedding-like
// similarity score directly. For real embeddings, swap in
// OpenAI or Supabase pgvector.
async function computeTextSimilarity(text1, text2) {
  const prompt = `
Compare the semantic similarity between these two texts.
Return ONLY a JSON object: { "similarity_score": <number between 0 and 100> }

Text A:
${text1}

Text B:
${text2}
`;
  const result = await callGroqJSON(prompt);
  return parseFloat(result.similarity_score ?? 0);
}

// ─── NODE A: Question Evaluation ──────────────────────────
async function nodeEvaluateQuestions(state) {
  logger.info("🤖 Node A: Evaluating questions...");

  const { teacher_doc, student_doc } = state;
  const studentMap = {};
  for (const q of student_doc.questions) {
    studentMap[q.id] = q;
  }

  const evaluateOne = async (tq) => {
    const sq = studentMap[tq.id];

    const prompt = `
You are a strict academic evaluator.

Rules:
- Be precise and objective
- Do not inflate marks
- Award 0 if answer is missing
- Respect max_score strictly

Return ONLY a JSON object with these exact fields:
{
  "num": "<question_no>",
  "question": "<question text>",
  "awarded_score": <number>,
  "max_score": <number>,
  "compliment": "<positive feedback>",
  "deduction": "<what was wrong, or null>",
  "tags": {
    "logic": <0-10>,
    "clarity": <0-10>,
    "completeness_pct": <0-100>
  }
}

QUESTION: ${tq.question}
REFERENCE: ${tq.answer}
STUDENT: ${sq ? sq.answer : "No answer"}
MAX_SCORE: ${tq.marks}
RUBRIC: ${tq.rubric || "Use reference answer"}
`;

    const result = await callGroqJSON(prompt);
    return {
      ...result,
      num: tq.question_no,
      question: tq.question,
      max_score: tq.marks,
    };
  };

  const question_results = await Promise.all(
    teacher_doc.questions.map(evaluateOne)
  );

  return { question_results };
}

// ─── NODE B: Similarity Score ──────────────────────────────
async function nodeComputeSimilarity(state) {
  logger.info("📐 Node B: Computing similarity...");

  const teacherText = state.teacher_doc.questions.map((q) => q.answer).join(" ");
  const studentText = state.student_doc.questions.map((q) => q.answer).join(" ");

  const score = await computeTextSimilarity(teacherText, studentText);

  return { similarity_score: Math.round(score * 100) / 100 };
}

// ─── NODE C: Plagiarism Check ──────────────────────────────
async function nodeCheckPlagiarism(state) {
  logger.info("🔍 Node C: Checking plagiarism...");

  const text = state.student_doc.questions.map((q) => q.answer).join("\n");

  const prompt = `
Estimate the plagiarism likelihood of the following student answers (0–100%).
Consider: copied phrases, unnatural fluency, overly formal language.

Return ONLY a JSON object: { "plagiarism_pct": <number 0-100> }

Text:
${text}
`;

  const result = await callGroqJSON(prompt);
  return { plagiarism_pct: parseFloat(result.plagiarism_pct ?? 0) };
}

// ─── NODE D: Overall Evaluator ─────────────────────────────
async function nodeOverallEvaluator(state) {
  logger.info("📊 Node D: Computing overall score...");

  const { question_results } = state;

  const totalGot = question_results.reduce((sum, q) => sum + (q.awarded_score || 0), 0);
  const totalMax = question_results.reduce((sum, q) => sum + (q.max_score || 0), 0);
  const overall = totalMax > 0 ? Math.round((totalGot / totalMax) * 100) : 0;

  const prompt = `
Summarize the student's academic performance.

Score: ${overall}%
Results: ${JSON.stringify(question_results)}

Return ONLY a JSON object:
{
  "summary": "<2-3 sentence performance summary>",
  "early_insight": "<key strength or weakness>",
  "ai_confidence_pct": <0-100>
}
`;

  const meta = await callGroqJSON(prompt);

  const ai_results = {
    summary: meta.summary,
    early_insight: meta.early_insight,
    questions: question_results,
  };

  return {
    overall_score: overall,
    ai_confidence_pct: parseInt(meta.ai_confidence_pct ?? 0, 10),
    ai_results,
  };
}

// ─── MAIN WORKFLOW (Graph equivalent) ─────────────────────
/**
 * Runs the full assessment pipeline.
 * Parallel nodes A, B, C → merge → final node D
 *
 * @param {object} teacherDoc
 * @param {object} studentDoc
 * @returns {Promise<object>} - full assessment result
 */
export const runWorkflow = async (teacherDoc, studentDoc) => {
  const initialState = {
    teacher_doc: teacherDoc,
    student_doc: studentDoc,
    question_results: [],
    similarity_score: 0.0,
    plagiarism_pct: 0.0,
    ai_results: {},
    overall_score: 0,
    ai_confidence_pct: 0,
  };

  // Run A, B, C in parallel (equivalent to LangGraph parallel edges)
  logger.info("🚀 Starting parallel pipeline nodes A, B, C...");
  const [evalResult, simResult, plagResult] = await Promise.all([
    nodeEvaluateQuestions(initialState),
    nodeComputeSimilarity(initialState),
    nodeCheckPlagiarism(initialState),
  ]);

  // Merge intermediate results
  const mergedState = {
    ...initialState,
    ...evalResult,
    ...simResult,
    ...plagResult,
  };

  // Run final node
  const finalResult = await nodeOverallEvaluator(mergedState);

  return {
    ...mergedState,
    ...finalResult,
  };
};
