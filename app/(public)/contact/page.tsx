// app/(public)/contact/page.tsx
'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { Metadata } from 'next';

export default function ContactPage() {
  const [form, setForm]   = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Replace with your preferred email service (Resend, EmailJS, Formspree, etc.)
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <h1 className="font-serif text-4xl font-bold text-ink-950 mb-3">Contact Us</h1>
      <p className="text-ink-500 mb-10">We'd love to hear from you. Fill out the form below and we'll respond within 48 hours.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { label: 'Name',    key: 'name',    type: 'text',  placeholder: 'Your full name'  },
          { label: 'Email',   key: 'email',   type: 'email', placeholder: 'your@email.com'  },
          { label: 'Subject', key: 'subject', type: 'text',  placeholder: 'What is this about?' },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-ink-700 mb-1">{label}</label>
            <input
              type={type}
              required
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className="w-full px-4 py-2.5 border border-ink-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-white"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">Message</label>
          <textarea
            required
            rows={5}
            placeholder="Your message..."
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="w-full px-4 py-2.5 border border-ink-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-white resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-accent hover:bg-accent-light disabled:opacity-60 text-white font-semibold rounded-lg transition-colors"
        >
          {loading ? 'Sending…' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
