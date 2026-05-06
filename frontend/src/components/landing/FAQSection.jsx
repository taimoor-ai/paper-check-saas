import { useState } from "react";

const faqs = [
  {
    question: "How do points work?",
    answer:
      "$1 = 100 points. Each paper check costs 20 points regardless of the analysis mode chosen. So $1 gets you 5 checks. Points never expire while your account is active.",
  },
  {
    question: "How accurate is the AI grading?",
    answer:
      "Our models are trained specifically on scholarly databases and pedagogical standards. In head-to-head tests, our feedback correlates with human expert grading by 96.4%.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "We support PDF, DOCX, PNG, JPG, HEIC, and handwritten scans (via OCR). You can also paste text directly for both the answer key and student submissions.",
  },
  {
    question: "Is student data secure and private?",
    answer:
      "Absolutely. All student data is encrypted in transit and at rest. We are FERPA-compliant and never use student submissions to train our models. Your data belongs to you.",
  },
  {
    question: "Can I use custom rubrics?",
    answer:
      "Yes! You can define custom rubrics with weighted criteria. The AI evaluates each paper against your specific standards and provides scores mapped to your rubric.",
  },
];

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        background: open ? "#161b22" : "rgba(255,255,255,0.02)",
        border: open ? "1px solid rgba(245,158,11,0.2)" : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <button
        className="w-full flex items-center justify-between p-6 text-left transition-colors"
        onClick={() => setOpen(!open)}
        onMouseEnter={e => !open && (e.currentTarget.parentElement.style.background = "rgba(255,255,255,0.04)")}
        onMouseLeave={e => !open && (e.currentTarget.parentElement.style.background = "rgba(255,255,255,0.02)")}
      >
        <span className="font-bold font-headline pr-4" style={{ color: "#f9fafb" }}>
          {question}
        </span>
        <span
          className="material-symbols-outlined transition-transform duration-300 shrink-0"
          style={{
            color: open ? "#f59e0b" : "#4b5563",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          expand_more
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6 text-sm leading-relaxed" style={{ color: "#6b7280" }}>
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQSection() {
  return (
    <section className="py-28" style={{ background: "#0d1117" }}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-6"
            style={{ background: "rgba(245,158,11,0.10)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
          >
            FAQ
          </div>
          <h2
            className="text-3xl font-extrabold font-headline"
            style={{ color: "#f9fafb" }}
          >
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}