import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { trackEvent } from "@/hooks/useTelemetry";

export default function ContactPage() {
  const { setCurrentPage } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent("contact_form_submitted", { subject: form.subject });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent-teal/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-accent-teal" />
        </div>
        <h2 className="text-xl font-semibold text-ink-primary">Message Sent</h2>
        <p className="text-sm text-ink-secondary mt-2">We'll get back to you within 24 hours.</p>
        <button
          onClick={() => setCurrentPage("dashboard")}
          className="mt-6 px-6 py-2.5 rounded-lg bg-accent-indigo text-white text-sm font-semibold hover:bg-accent-indigo-dim transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-accent-indigo/10 flex items-center justify-center mx-auto mb-3">
          <MessageSquare className="w-6 h-6 text-accent-indigo" />
        </div>
        <h1 className="text-xl font-semibold text-ink-primary">Contact Us</h1>
        <p className="text-sm text-ink-secondary mt-1">Questions about BuildSignal or Kestovar?</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-ink-secondary mb-1">Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-ink-wash bg-canvas text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-accent-indigo/30 focus:border-accent-indigo transition-all"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-secondary mb-1">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-ink-wash bg-canvas text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-accent-indigo/30 focus:border-accent-indigo transition-all"
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-secondary mb-1">Subject</label>
          <select
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-ink-wash bg-canvas text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-accent-indigo/30 focus:border-accent-indigo transition-all"
          >
            <option value="">Select a topic</option>
            <option value="general">General Inquiry</option>
            <option value="sales">Sales / Enterprise</option>
            <option value="support">Technical Support</option>
            <option value="partnership">Partnership</option>
            <option value="feedback">Feedback</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-secondary mb-1">Message</label>
          <textarea
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-ink-wash bg-canvas text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-accent-indigo/30 focus:border-accent-indigo transition-all resize-none"
            placeholder="How can we help?"
          />
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent-indigo text-white text-sm font-semibold hover:bg-accent-indigo-dim transition-all"
        >
          <Send className="w-4 h-4" />
          Send Message
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-ink-wash/50 text-center">
        <p className="text-xs text-ink-tertiary">
          Or email us directly at{" "}
          <a href="mailto:support@buildsignal.net" className="text-accent-indigo hover:underline">
            support@buildsignal.net
          </a>
        </p>
      </div>
    </div>
  );
}
