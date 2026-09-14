'use client';

import { useState } from 'react';
import { submitContactForm } from '@/lib/api';

const QUERY_TYPES = ['General Query', 'Order Status / Issue', 'Returns & Refunds', 'Product Feedback'];
const ORDER_RELATED_TYPES = ['Order Status / Issue', 'Returns & Refunds'];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    queryType: 'General Query',
    orderId: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email.';
    if (!form.subject.trim()) next.subject = 'Enter a subject.';
    if (!form.message.trim()) next.message = 'Enter a message.';
    if (ORDER_RELATED_TYPES.includes(form.queryType) && !form.orderId.trim()) {
      next.orderId = 'Enter your Order ID (e.g. SH-ORD-98412).';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    try {
      await submitContactForm({
        name: form.name,
        email: form.email,
        subject: `[${form.queryType}] ${form.subject}`,
        message: form.orderId
          ? `Order ID: ${form.orderId}\n\n${form.message}`
          : form.message,
      });
      setStatus('sent');
      setForm({ name: '', email: '', queryType: 'General Query', orderId: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="mx-auto max-w-container px-4 py-14 md:px-8">
      <div className="grid gap-14 md:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Contact</p>
          <h1 className="mt-2 font-serif text-4xl leading-tight text-ink">We&apos;d love to hear from you.</h1>
          <p className="mt-4 max-w-sm text-sm text-muted">
            Questions about your order, sizing, or a product recommendation — our team is here 7
            days a week.
          </p>

          <div className="mt-10 space-y-6 text-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted">Support</p>
              <a href="mailto:support@styleheaven.in" className="mt-1 block text-ink hover:text-emerald hover:underline">support@styleheaven.in</a>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted">Merchant enquiries</p>
              <a href="mailto:support@styleheavenin" className="mt-1 block text-ink hover:text-emerald hover:underline">support@styleheavenin</a>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted">Studio</p>
              <p className="mt-1 text-ink">FF 61,PLOT 271, K BLOCK,ANSAL FORTUN ARCADE,NOIDA,SEC 18, NOIDA UP 201301</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted">Phone</p>
              <p className="mt-1 text-ink">+91 8527879317</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-7">
          {status === 'sent' && (
            <div className="rounded-xl border border-success/40 bg-green-50 px-4 py-3 text-sm text-success">
              Thanks — your message has been sent. We&apos;ll reply within 1 business day.
            </div>
          )}
          {status === 'error' && (
            <div className="rounded-xl border border-sale/40 bg-red-50 px-4 py-3 text-sm text-sale">
              Something went wrong sending your message. Please try again.
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted">Query type</label>
            <select
              className="input-underline bg-transparent"
              value={form.queryType}
              onChange={(e) => set('queryType', e.target.value)}
            >
              {QUERY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {ORDER_RELATED_TYPES.includes(form.queryType) && (
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted">Order ID</label>
              <input
                className="input-underline"
                placeholder="SH-ORD-98412"
                value={form.orderId}
                onChange={(e) => set('orderId', e.target.value)}
              />
              {errors.orderId && <p className="mt-1 text-xs text-sale">{errors.orderId}</p>}
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted">Your name</label>
            <input
              className="input-underline"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
            {errors.name && <p className="mt-1 text-xs text-sale">{errors.name}</p>}
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted">Email</label>
            <input
              type="email"
              className="input-underline"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
            {errors.email && <p className="mt-1 text-xs text-sale">{errors.email}</p>}
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted">Subject</label>
            <input
              className="input-underline"
              value={form.subject}
              onChange={(e) => set('subject', e.target.value)}
            />
            {errors.subject && <p className="mt-1 text-xs text-sale">{errors.subject}</p>}
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted">Message</label>
            <textarea
              rows={4}
              className="input-underline resize-none"
              value={form.message}
              onChange={(e) => set('message', e.target.value)}
            />
            {errors.message && <p className="mt-1 text-xs text-sale">{errors.message}</p>}
          </div>

          <button
            disabled={status === 'sending'}
            className="h-12 rounded-full bg-cta px-8 text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep disabled:opacity-40"
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  );
}
