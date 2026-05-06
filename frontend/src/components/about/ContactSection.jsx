import { useState } from "react";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", interest: "", message: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! We'll be in touch shortly.");
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#f9fafb",
  };

  const inputFocus = (e) => (e.currentTarget.style.border = "1px solid rgba(245,158,11,0.4)");
  const inputBlur  = (e) => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)");

  return (
    <section className="py-24" style={{ background: "#111827" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-14">

          {/* Left */}
          <div className="lg:col-span-5">
            <div
              className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full mb-8"
              style={{ background: "rgba(245,158,11,0.10)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
            >
              Get In Touch
            </div>
            <h2 className="text-4xl font-extrabold font-headline mb-6" style={{ color: "#f9fafb" }}>
              Inquire with Intelligence
            </h2>
            <p className="leading-relaxed mb-10" style={{ color: "#6b7280" }}>
              Whether you're a single researcher or representing a university, we're ready to discuss how
              Editorial AI can transform your workflow.
            </p>

            <div className="space-y-6">
              {[
                { icon: "mail", label: "General Inquiries", value: "hello@editorial.ai" },
                { icon: "location_on", label: "HQ Office", value: "88 Scholars Row, Boston, MA" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(245,158,11,0.10)" }}
                  >
                    <span
                      className="material-symbols-outlined text-amber-500"
                      style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px" }}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest font-headline mb-0.5" style={{ color: "#4b5563" }}>
                      {item.label}
                    </p>
                    <p className="font-bold font-headline text-sm" style={{ color: "#f9fafb" }}>
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7">
            <div
              className="rounded-2xl p-8 space-y-5"
              style={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold font-headline mb-1.5" style={{ color: "#4b5563" }}>
                    Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Dr. Julian Reed"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                    className="w-full h-11 rounded-xl px-4 text-sm font-body transition-all"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold font-headline mb-1.5" style={{ color: "#4b5563" }}>
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@university.edu"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                    className="w-full h-11 rounded-xl px-4 text-sm font-body transition-all"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold font-headline mb-1.5" style={{ color: "#4b5563" }}>
                  Interest Type
                </label>
                <select
                  name="interest"
                  value={form.interest}
                  onChange={handleChange}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  className="w-full h-11 rounded-xl px-4 text-sm font-body transition-all"
                  style={{ ...inputStyle }}
                >
                  <option value="" style={{ background: "#161b22" }}>Select an option…</option>
                  <option style={{ background: "#161b22" }}>Individual Educator</option>
                  <option style={{ background: "#161b22" }}>University Partnership</option>
                  <option style={{ background: "#161b22" }}>Press Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold font-headline mb-1.5" style={{ color: "#4b5563" }}>
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="How can we assist your workflow?"
                  value={form.message}
                  onChange={handleChange}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  className="w-full rounded-xl px-4 py-3 text-sm font-body transition-all resize-none"
                  style={inputStyle}
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3.5 font-bold font-headline rounded-xl transition-all active:scale-[0.98] hover:opacity-90"
                style={{ background: "#f59e0b", color: "#111827", boxShadow: "0 4px 20px rgba(245,158,11,0.25)" }}
              >
                Submit Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}