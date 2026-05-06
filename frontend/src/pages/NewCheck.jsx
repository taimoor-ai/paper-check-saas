import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/shared/SideNav";
import TopBar from "../components/shared/TopBar";
import useCurrentUser from "../hooks/useCurrentUser";

// ── Constants ─────────────────────────────────────────────────────────────────
const BASE_URL = "http://127.0.0.1:8000";

// Replace with your real auth token logic (e.g. from supabase.auth.getSession())
const getAuthToken = () => localStorage.getItem("access_token") || "";

const modes = [
  {
    icon: "bolt",
    name: "Fast",
    desc: "Direct matching. Ideal for multiple-choice or recall-based papers.",
    recommended: false,
  },
  {
    icon: "psychology",
    name: "Standard",
    desc: "Contextual analysis. Semantic understanding of short-answer responses.",
    recommended: true,
  },
  {
    icon: "auto_awesome",
    name: "Advanced",
    desc: "Deep editorial critique. Comprehensive essay checking and plagiarism detection.",
    recommended: false,
  },
];

const steps = [
  { num: 1, label: "Answer Key" },
  { num: 2, label: "Student Paper" },
  { num: 3, label: "Mode" },
  { num: 4, label: "Confirm" },
];

// ── Upload Zone ───────────────────────────────────────────────────────────────
function UploadZone({ label, accept, onFile, file }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current.click()}
      className="relative cursor-pointer border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all"
      style={{
        borderColor: dragging ? "#f59e0b" : file ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.1)",
        background: dragging
          ? "rgba(245,158,11,0.05)"
          : file
          ? "rgba(245,158,11,0.03)"
          : "rgba(255,255,255,0.02)",
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: dragging || file ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.05)" }}
      >
        <span
          className="material-symbols-outlined text-3xl"
          style={{
            fontVariationSettings: "'FILL' 1",
            color: file ? "#f59e0b" : dragging ? "#f59e0b" : "#6b7280",
          }}
        >
          {file ? "check_circle" : "cloud_upload"}
        </span>
      </div>
      {file ? (
        <>
          <p className="font-semibold mb-1" style={{ color: "#f59e0b" }}>{file.name}</p>
          <p className="text-xs" style={{ color: "#6b7280" }}>
            {(file.size / 1024).toFixed(0)} KB · Click to replace
          </p>
        </>
      ) : (
        <>
          <h3 className="font-bold text-base mb-1" style={{ color: "#f9fafb" }}>
            {dragging ? "Release to upload" : `Drag & Drop ${label}`}
          </h3>
          <p className="text-sm mb-5" style={{ color: "#6b7280" }}>
            PDF · DOCX · PNG · JPG · Handwritten · Max 20 MB
          </p>
          <span
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "#d1d5db",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>folder_open</span>
            Browse Files
          </span>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => { if (e.target.files[0]) onFile(e.target.files[0]); }}
      />
    </div>
  );
}

// ── Text Zone ─────────────────────────────────────────────────────────────────
function TextZone({ label, value, onChange }) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Paste or type the ${label} here…`}
        rows={10}
        className="w-full rounded-2xl p-5 text-sm leading-relaxed resize-none transition-all"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#f9fafb",
          outline: "none",
        }}
        onFocus={e => (e.currentTarget.style.border = "1px solid rgba(245,158,11,0.4)")}
        onBlur={e => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)")}
      />
      <p className="text-xs mt-2" style={{ color: "#4b5563" }}>
        Supports plain text, markdown, and structured answers.
      </p>
    </div>
  );
}

// ── Tab Toggle ────────────────────────────────────────────────────────────────
function TabToggle({ value, onChange }) {
  return (
    <div
      className="inline-flex rounded-lg p-1 mb-5"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {[
        { id: "file", label: "Upload File", icon: "upload_file" },
        { id: "text", label: "Paste Text", icon: "edit_note" },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all"
          style={
            value === tab.id
              ? { background: "#f59e0b", color: "#111827" }
              : { color: "#6b7280" }
          }
        >
          <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ── Status Banner ─────────────────────────────────────────────────────────────
function StatusBanner({ status }) {
  if (!status) return null;
  const isError = status.type === "error";
  const isLoading = status.type === "loading";
  return (
    <div
      className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
      style={{
        background: isError
          ? "rgba(239,68,68,0.08)"
          : isLoading
          ? "rgba(99,102,241,0.08)"
          : "rgba(16,185,129,0.08)",
        border: `1px solid ${isError ? "rgba(239,68,68,0.2)" : isLoading ? "rgba(99,102,241,0.2)" : "rgba(16,185,129,0.2)"}`,
        color: isError ? "#fca5a5" : isLoading ? "#a5b4fc" : "#6ee7b7",
      }}
    >
      {isLoading ? (
        <svg className="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <span className="material-symbols-outlined shrink-0" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>
          {isError ? "error" : "check_circle"}
        </span>
      )}
      {status.message}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function NewCheck() {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useCurrentUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMode, setSelectedMode] = useState(1);

  // Step 1 — Answer Key
  const [answerInputType, setAnswerInputType] = useState("file");
  const [answerFile, setAnswerFile] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [teacherData, setTeacherData] = useState(null);
  const [teacherStatus, setTeacherStatus] = useState(null);

  // Step 2 — Student Paper
  const [studentInputType, setStudentInputType] = useState("file");
  const [studentFile, setStudentFile] = useState(null);
  const [studentText, setStudentText] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [studentStatus, setStudentStatus] = useState(null);
  const [navOpen, setNavOpen] = useState(false);

  // Step 4 — Grading
  const [gradingStatus, setGradingStatus] = useState(null);

  const totalSteps = 4;
  const progressWidth = `${((currentStep - 1) / (totalSteps - 1)) * 100}%`;

  // ── API: Extract teacher data ────────────────────────────────────────────────
  const extractTeacherData = async () => {
    setTeacherStatus({ type: "loading", message: "Extracting answer key…" });
    try {
      const formData = new FormData();
      if (answerInputType === "file" && answerFile) {
        formData.append("file", answerFile);
        formData.append("text", "");
      } else {
        formData.append("text", answerText);
        // Send empty file blob so endpoint doesn't complain
        formData.append("file", new Blob([], { type: "text/plain" }), "empty.txt");
      }

      const res = await fetch(`${BASE_URL}/teacher/extract-teacher-data`, {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setTeacherData(data);
      setTeacherStatus({ type: "success", message: `✓ Extracted ${data.questions?.length || 0} questions from answer key` });
      return data;
    } catch (err) {
      setTeacherStatus({ type: "error", message: `Failed to extract answer key: ${err.message}` });
      return null;
    }
  };

  // ── API: Extract student data ────────────────────────────────────────────────
  const extractStudentData = async () => {
    setStudentStatus({ type: "loading", message: "Extracting student submission…" });
    try {
      const formData = new FormData();
      if (studentInputType === "file" && studentFile) {
        formData.append("file", studentFile);
        formData.append("text", "");
      } else {
        formData.append("text", studentText);
        formData.append("file", new Blob([], { type: "text/plain" }), "empty.txt");
      }

      const res = await fetch(`${BASE_URL}/student/extract-student-data`, {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setStudentData(data);
      setStudentStatus({ type: "success", message: `✓ Extracted ${data.questions?.length || 0} questions from student paper` });
      return data;
    } catch (err) {
      setStudentStatus({ type: "error", message: `Failed to extract student paper: ${err.message}` });
      return null;
    }
  };

  // ── API: Start grading ────────────────────────────────────────────────────────
  const startGrading = async () => {
    if (!teacherData || !studentData) {
      setGradingStatus({ type: "error", message: "Missing extracted data. Please complete steps 1 & 2." });
      return;
    }
    setGradingStatus({ type: "loading", message: "AI is grading the submission…" });
    try {
      const res = await fetch(`${BASE_URL}/assessment/evaluate`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          teacher_doc: teacherData,
          student_doc: studentData,
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const results = await res.json();
      // Pass results to the Results page via navigation state
      navigate("/results", { state: { results, teacherData, studentData, mode: modes[selectedMode].name } });
    } catch (err) {
      setGradingStatus({ type: "error", message: `Grading failed: ${err.message}` });
    }
  };

  // ── Navigation: handle Next ───────────────────────────────────────────────────
  const handleNext = async () => {
    if (currentStep === 1) {
      const data = await extractTeacherData();
      if (data) setCurrentStep(2);
    } else if (currentStep === 2) {
      const data = await extractStudentData();
      if (data) setCurrentStep(3);
    } else if (currentStep < 4) {
      setCurrentStep(s => s + 1);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      if (teacherStatus?.type === "loading") return false;
      return answerInputType === "file" ? !!answerFile : answerText.trim().length > 20;
    }
    if (currentStep === 2) {
      if (studentStatus?.type === "loading") return false;
      return studentInputType === "file" ? !!studentFile : studentText.trim().length > 20;
    }
    return true;
  };

  const isNextLoading =
    (currentStep === 1 && teacherStatus?.type === "loading") ||
    (currentStep === 2 && studentStatus?.type === "loading");

  const isGrading = gradingStatus?.type === "loading";
  const pointsBalance = user?.points_balance ?? 0;
  const canAccess = !userLoading && pointsBalance >= 20;

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#0d1117" }}>
        <div className="rounded-2xl p-6 bg-[#161b22] border border-white/10 text-center">
          <div className="animate-spin mx-auto mb-4 h-8 w-8 rounded-full border-2 border-amber-500 border-t-transparent" />
          <p className="text-sm text-[#d1d5db]">Loading account details…</p>
        </div>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="flex min-h-screen" style={{ background: "#0d1117" }}>
        <SideNav isOpen={navOpen} onClose={() => setNavOpen(false)} />
        <main className="lg:ml-64 flex-1 min-h-screen">
          <TopBar showSearch={false} showPoints={false} onMenuToggle={() => setNavOpen((open) => !open)} />
          <div className="mt-16 p-6 lg:p-8">
            <div className="max-w-3xl mx-auto rounded-2xl p-8 bg-[#161b22] border border-white/10 text-center">
              <h1 className="text-2xl font-bold mb-3" style={{ color: "#f9fafb" }}>
                Credits required
              </h1>
              <p className="text-sm text-[#9ca3af] mb-6">
                Please buy credits to continue. You need at least 20 points to start a new check.
              </p>
              <button
                onClick={() => navigate("/billing")}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-all"
              >
                Buy points
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#0d1117" }}>
      <SideNav isOpen={navOpen} onClose={() => setNavOpen(false)} />
      <main className="lg:ml-64 flex-1 min-h-screen">
        <TopBar showSearch={false} showPoints={false} onMenuToggle={() => setNavOpen((open) => !open)} />
        <div className="mt-16 p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">

            {/* ── Header ── */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-1" style={{ color: "#f9fafb" }}>New Assessment Check</h1>
              <p className="text-sm" style={{ color: "#6b7280" }}>Upload your answer key and student paper to begin AI grading.</p>
            </div>

            {/* ── Progress Stepper ── */}
            <div className="mb-8">
              <div className="relative">
                <div className="absolute top-[18px] left-0 w-full h-0.5 z-0" style={{ background: "rgba(255,255,255,0.07)" }} />
                <div
                  className="absolute top-[18px] left-0 h-0.5 z-0 transition-all duration-500"
                  style={{ width: progressWidth, background: "#f59e0b" }}
                />
                <div className="relative z-10 flex items-start justify-between">
                  {steps.map((step) => {
                    const done = currentStep > step.num;
                    const active = currentStep === step.num;
                    return (
                      <div key={step.num} className="flex flex-col items-center gap-2">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                          style={{
                            background: done || active ? "#f59e0b" : "rgba(255,255,255,0.05)",
                            color: done || active ? "#111827" : "#4b5563",
                            border: done || active ? "none" : "1px solid rgba(255,255,255,0.08)",
                            boxShadow: active ? "0 0 14px rgba(245,158,11,0.4)" : "none",
                          }}
                        >
                          {done ? (
                            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>check</span>
                          ) : step.num}
                        </div>
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: active ? "#f59e0b" : done ? "#d97706" : "#4b5563" }}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Step Content ── */}
            <div
              className="rounded-2xl p-7 mb-6"
              style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* STEP 1 — Answer Key */}
              {currentStep === 1 && (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-1" style={{ color: "#f9fafb" }}>
                      Answer Key
                    </h2>
                    <p className="text-sm" style={{ color: "#6b7280" }}>
                      Provide the teacher's answer key or model solution.
                    </p>
                  </div>
                  <TabToggle value={answerInputType} onChange={(v) => { setAnswerInputType(v); setTeacherStatus(null); }} />
                  {answerInputType === "file" ? (
                    <UploadZone
                      label="Answer Key"
                      accept=".pdf,.png,.jpg,.jpeg,.docx,.txt"
                      onFile={(f) => { setAnswerFile(f); setTeacherStatus(null); }}
                      file={answerFile}
                    />
                  ) : (
                    <TextZone
                      label="answer key / model solution"
                      value={answerText}
                      onChange={(v) => { setAnswerText(v); setTeacherStatus(null); }}
                    />
                  )}
                  <StatusBanner status={teacherStatus} />

                  {/* Extracted questions preview */}
                  {teacherData?.questions?.length > 0 && (
                    <div className="mt-5 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(245,158,11,0.15)" }}>
                      <div className="px-4 py-3 flex items-center gap-2" style={{ background: "rgba(245,158,11,0.06)" }}>
                        <span className="material-symbols-outlined text-amber-400" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>quiz</span>
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#f59e0b" }}>
                          {teacherData.questions.length} Questions Extracted
                        </span>
                      </div>
                      <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                        {teacherData.questions.slice(0, 3).map((q) => (
                          <div key={q.id} className="px-4 py-3 flex items-start gap-3">
                            <span className="text-xs font-bold mt-0.5 shrink-0" style={{ color: "#f59e0b" }}>{q.question_no}</span>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate" style={{ color: "#d1d5db" }}>{q.question}</p>
                              <p className="text-xs mt-0.5" style={{ color: "#4b5563" }}>{q.marks} marks</p>
                            </div>
                          </div>
                        ))}
                        {teacherData.questions.length > 3 && (
                          <div className="px-4 py-2 text-xs" style={{ color: "#4b5563" }}>
                            +{teacherData.questions.length - 3} more questions…
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div
                    className="mt-5 flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.12)" }}
                  >
                    <span className="material-symbols-outlined text-amber-500 shrink-0" style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px" }}>
                      tips_and_updates
                    </span>
                    <p className="text-xs" style={{ color: "#d97706" }}>
                      <strong className="block mb-0.5" style={{ color: "#f59e0b" }}>Editorial Tip</strong>
                      Include point distributions in your answer key for more accurate per-question grading.
                    </p>
                  </div>
                </>
              )}

              {/* STEP 2 — Student Paper */}
              {currentStep === 2 && (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-1" style={{ color: "#f9fafb" }}>
                      Student Paper
                    </h2>
                    <p className="text-sm" style={{ color: "#6b7280" }}>
                      Upload or paste the student's submission. All formats accepted including handwritten scans.
                    </p>
                  </div>
                  <TabToggle value={studentInputType} onChange={(v) => { setStudentInputType(v); setStudentStatus(null); }} />
                  {studentInputType === "file" ? (
                    <UploadZone
                      label="Student Paper"
                      accept=".pdf,.png,.jpg,.jpeg,.docx,.txt"
                      onFile={(f) => { setStudentFile(f); setStudentStatus(null); }}
                      file={studentFile}
                    />
                  ) : (
                    <TextZone
                      label="student's answer / submission"
                      value={studentText}
                      onChange={(v) => { setStudentText(v); setStudentStatus(null); }}
                    />
                  )}
                  <StatusBanner status={studentStatus} />

                  {/* Extracted questions preview */}
                  {studentData?.questions?.length > 0 && (
                    <div className="mt-5 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(16,185,129,0.15)" }}>
                      <div className="px-4 py-3 flex items-center gap-2" style={{ background: "rgba(16,185,129,0.06)" }}>
                        <span className="material-symbols-outlined shrink-0" style={{ fontSize: "16px", color: "#10b981", fontVariationSettings: "'FILL' 1" }}>task_alt</span>
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#10b981" }}>
                          {studentData.questions.length} Answers Extracted
                        </span>
                      </div>
                      <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                        {studentData.questions.slice(0, 3).map((q) => (
                          <div key={q.id} className="px-4 py-3 flex items-start gap-3">
                            <span className="text-xs font-bold mt-0.5 shrink-0" style={{ color: "#10b981" }}>{q.question_no}</span>
                            <p className="text-xs truncate" style={{ color: "#d1d5db" }}>{q.question}</p>
                          </div>
                        ))}
                        {studentData.questions.length > 3 && (
                          <div className="px-4 py-2 text-xs" style={{ color: "#4b5563" }}>
                            +{studentData.questions.length - 3} more answers…
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div
                    className="mt-5 flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.12)" }}
                  >
                    <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px", color: "#10b981" }}>info</span>
                    <p className="text-xs" style={{ color: "#6b7280" }}>
                      <strong className="block mb-0.5" style={{ color: "#10b981" }}>Formats Accepted</strong>
                      PDF, DOCX, PNG, JPG, HEIC, handwritten scans (OCR included), plain text, markdown.
                    </p>
                  </div>
                </>
              )}

              {/* STEP 3 — Analysis Mode */}
              {currentStep === 3 && (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-1" style={{ color: "#f9fafb" }}>
                      Analysis Mode
                    </h2>
                    <p className="text-sm" style={{ color: "#6b7280" }}>
                      Select how deeply the AI should evaluate this submission.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {modes.map((mode, idx) => (
                      <div
                        key={mode.name}
                        onClick={() => setSelectedMode(idx)}
                        className="relative p-5 rounded-2xl cursor-pointer border-2 transition-all"
                        style={{
                          borderColor: selectedMode === idx ? "#f59e0b" : "rgba(255,255,255,0.07)",
                          background: selectedMode === idx ? "rgba(245,158,11,0.06)" : "rgba(255,255,255,0.02)",
                          boxShadow: selectedMode === idx ? "0 0 20px rgba(245,158,11,0.1)" : "none",
                        }}
                      >
                        {mode.recommended && (
                          <div className="absolute -top-2.5 left-4">
                            <span
                              className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                              style={{ background: "#f59e0b", color: "#111827" }}
                            >
                              Recommended
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className="p-2 rounded-xl"
                            style={{ background: selectedMode === idx ? "#f59e0b" : "rgba(255,255,255,0.06)" }}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "18px", color: selectedMode === idx ? "#111827" : "#6b7280" }}
                            >
                              {mode.icon}
                            </span>
                          </div>
                          {selectedMode === idx && (
                            <span className="material-symbols-outlined text-amber-400" style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>
                              check_circle
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold mb-1" style={{ color: "#f9fafb" }}>{mode.name}</h4>
                        <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>{mode.desc}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* STEP 4 — Confirm */}
              {currentStep === 4 && (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-1" style={{ color: "#f9fafb" }}>
                      Review & Confirm
                    </h2>
                    <p className="text-sm" style={{ color: "#6b7280" }}>
                      Review your submission before the AI begins grading.
                    </p>
                  </div>

                  <div className="space-y-3 mb-5">
                    {[
                      {
                        label: "Answer Key",
                        icon: "task",
                        value: answerInputType === "file"
                          ? (answerFile?.name || "—")
                          : `Text input (${answerText.length} chars)`,
                        sub: teacherData ? `${teacherData.questions.length} questions extracted` : null,
                        color: "#f59e0b",
                      },
                      {
                        label: "Student Paper",
                        icon: "description",
                        value: studentInputType === "file"
                          ? (studentFile?.name || "—")
                          : `Text input (${studentText.length} chars)`,
                        sub: studentData ? `${studentData.questions.length} answers extracted` : null,
                        color: "#10b981",
                      },
                      {
                        label: "Analysis Mode",
                        icon: modes[selectedMode].icon,
                        value: modes[selectedMode].name,
                        sub: modes[selectedMode].desc,
                        color: "#6366f1",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-start gap-4 p-4 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: `${item.color}18` }}
                        >
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px", color: item.color }}>
                            {item.icon}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#4b5563" }}>{item.label}</p>
                          <p className="text-sm font-semibold" style={{ color: "#f9fafb" }}>{item.value}</p>
                          {item.sub && <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{item.sub}</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <StatusBanner status={gradingStatus} />
                </>
              )}
            </div>

            {/* ── Navigation ── */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => (currentStep > 1 ? setCurrentStep(s => s - 1) : navigate("/dashboard"))}
                disabled={isNextLoading || isGrading}
                className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all disabled:opacity-40"
                style={{ color: "#6b7280" }}
                onMouseEnter={e => !isNextLoading && !isGrading && (e.currentTarget.style.color = "#d1d5db")}
                onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span>
                {currentStep > 1 ? "Back" : "Cancel"}
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed() || isNextLoading}
                  className="px-8 py-2.5 font-bold text-sm rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: canProceed() && !isNextLoading ? "#f59e0b" : "rgba(255,255,255,0.06)",
                    color: canProceed() && !isNextLoading ? "#111827" : "#6b7280",
                    boxShadow: canProceed() && !isNextLoading ? "0 4px 16px rgba(245,158,11,0.3)" : "none",
                  }}
                >
                  {isNextLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing…
                    </>
                  ) : (
                    <>
                      {currentStep === 1 ? "Extract & Continue" : currentStep === 2 ? "Extract & Continue" : "Next Step"}
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={startGrading}
                  disabled={isGrading}
                  className="px-8 py-2.5 font-bold text-sm rounded-xl flex items-center gap-2 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: "#f59e0b",
                    color: "#111827",
                    boxShadow: "0 4px 16px rgba(245,158,11,0.3)",
                  }}
                >
                  {isGrading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Grading…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px" }}>rocket_launch</span>
                      Start Grading
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}