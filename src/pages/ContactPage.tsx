import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Mail, MessageCircle, Phone, ArrowRight, Check, Send } from 'lucide-react';

const CONTACT_METHODS = [
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Average response time: 2 minutes',
    availability: 'Mon-Fri 9am-6pm ET',
    cta: 'Start Chat',
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Average response time: 4 hours',
    availability: '24/7 for Enterprise',
    cta: 'Send Email',
  },
  {
    icon: Phone,
    title: 'Phone',
    description: 'For Enterprise customers',
    availability: 'Mon-Fri 9am-6pm ET',
    cta: 'Schedule Call',
  },
];

export default function ContactPage() {
  const { addToast } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    subject: 'general',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }
    setSubmitted(true);
    addToast('Message sent! We will respond within 24 hours.', 'success');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-[720px] mx-auto px-6 pt-10 pb-6 text-center">
        <h1 className="text-3xl font-semibold text-ink-primary tracking-tight mb-3">
          Contact Us
        </h1>
        <p className="text-sm text-ink-secondary max-w-[400px] mx-auto leading-relaxed">
          Have a question or need assistance? We are here to help.
        </p>
      </div>

      {/* Contact methods */}
      <div className="max-w-[720px] mx-auto px-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CONTACT_METHODS.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.title}
                className="bg-surface rounded-xl border border-ink-wash p-4 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-accent-indigo/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-accent-indigo" />
                </div>
                <h3 className="text-sm font-semibold text-ink-primary mb-1">
                  {method.title}
                </h3>
                <p className="text-[11px] text-ink-secondary mb-1">
                  {method.description}
                </p>
                <p className="text-[10px] text-ink-tertiary mb-3">
                  {method.availability}
                </p>
                <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-canvas border border-ink-wash text-xs font-medium text-ink-secondary hover:border-accent-indigo/30 hover:bg-surface-hover transition-all">
                  {method.cta}
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact form */}
      <div className="max-w-[560px] mx-auto px-6 pb-12">
        <div className="bg-surface rounded-2xl border border-ink-wash p-6">
          <h2 className="text-lg font-semibold text-ink-primary mb-1">
            Send a Message
          </h2>
          <p className="text-xs text-ink-secondary mb-5">
            Fill out the form below and we will get back to you within 24 hours.
          </p>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-accent-teal/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-accent-teal" />
              </div>
              <h3 className="text-base font-semibold text-ink-primary mb-2">
                Message Sent
              </h3>
              <p className="text-sm text-ink-secondary">
                Thank you for reaching out. Our team will respond within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink-primary mb-1.5">
                    Name <span className="text-accent-crimson">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-3 py-2.5 rounded-xl bg-canvas border border-ink-wash text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-accent-indigo/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-primary mb-1.5">
                    Email <span className="text-accent-crimson">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@company.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-canvas border border-ink-wash text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-accent-indigo/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink-primary mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Your company"
                    className="w-full px-3 py-2.5 rounded-xl bg-canvas border border-ink-wash text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-accent-indigo/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-primary mb-1.5">
                    Subject
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-canvas border border-ink-wash text-sm text-ink-primary focus:outline-none focus:border-accent-indigo/50"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="sales">Sales & Enterprise</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing</option>
                    <option value="partners">Partnerships</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-primary mb-1.5">
                  Message <span className="text-accent-crimson">*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help you?"
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-xl bg-canvas border border-ink-wash text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:border-accent-indigo/50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-indigo text-white text-sm font-semibold hover:bg-accent-indigo-dim transition-all active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
