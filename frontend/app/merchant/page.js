'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export default function MerchantPage() {
  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    gstin: '',
    category: '',
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const next = {};

    if (!form.businessName.trim()) {
      next.businessName = 'Enter your business name.';
    }

    if (!form.contactName.trim()) {
      next.contactName = 'Enter a contact person.';
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      next.email = 'Enter a valid email.';
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      next.phone = 'Enter a valid 10-digit phone number.';
    }

    if (!form.address.trim()) {
      next.address = 'Enter your business address.';
    }

    if (!GSTIN_REGEX.test(form.gstin.toUpperCase())) {
      next.gstin = 'Enter a valid 15-character GSTIN.';
    }

    if (!form.category.trim()) {
      next.category = 'Enter at least one product category.';
    }

    if (!form.agree) {
      next.agree = 'You must agree to the quality and GST guidelines to continue.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    setStatus('sending');

    try {
      await api.post('/contact', {
        name: form.contactName,
        email: form.email,
        subject: `Merchant enquiry - ${form.businessName}`,
        message: [
          `Business: ${form.businessName}`,
          `Phone: ${form.phone}`,
          `Address: ${form.address}`,
          `GSTIN: ${form.gstin.toUpperCase()}`,
          `Category: ${form.category}`,
        ].join('\n'),
      });

      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="mx-auto max-w-container px-4 py-14 md:px-8">
      <div className="grid gap-14 md:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted">
            Style Haven B2B
          </p>

          <h1 className="mt-2 font-serif text-4xl leading-tight text-ink">
            Join as a business partner
          </h1>

          <div className="mt-4">
            <p className="text-sm font-semibold text-ink">
              Style Haven Private Limited
            </p>
            <p className="mt-1 text-xs text-muted">
              Operating under the consumer brand Style Haven
            </p>
          </div>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
            Style Haven sources fashion through vetted business partners -
            manufacturers, wholesalers, brands and established suppliers -
            and sells directly to consumers. We are not a reseller
            marketplace: this page is for businesses that want to supply
            Style Haven, not for customers.
          </p>

          <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
            <h2 className="text-sm font-bold text-ink">
              Merchant partner guidelines
            </h2>

            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-muted">
              <li>
                - A valid, active GST registration (GSTIN) is required to
                sell as a merchant.
              </li>
              <li>
                - Product quality, sizing information and imagery must
                accurately represent what ships.
              </li>
              <li>
                - Supply commitments must be fulfilled within the agreed
                terms in the partner agreement.
              </li>
              <li>
                - Style Haven reserves the right to pause a partnership
                pending a quality or compliance review.
              </li>
            </ul>
          </div>

          <ol className="mt-6 space-y-3 text-sm text-muted">
            <li>
              1. Style Haven agrees supply terms directly with your business.
            </li>
            <li>
              2. We list the resulting products and sell to individual
              customers.
            </li>
            <li>
              3. Pricing, volumes and settlement follow the signed partner
              agreement.
            </li>
          </ol>

          <div className="mt-8 border-t border-line pt-5">
            <p className="text-xs leading-relaxed text-muted">
              For merchant enquiries, please provide accurate business,
              contact and GST information. Submission of this form is an
              enquiry only and does not by itself create a merchant or
              supply agreement.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {status === 'sent' && (
            <div className="rounded-xl border border-success/40 bg-green-50 px-4 py-3 text-sm text-success">
              Thanks - our sourcing team will be in touch.
            </div>
          )}

          {status === 'error' && (
            <div className="rounded-xl border border-sale/40 bg-red-50 px-4 py-3 text-sm text-sale">
              Something went wrong. Please try again.
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted">
              Business name
            </label>
            <input
              className="input-underline"
              value={form.businessName}
              onChange={(e) => set('businessName', e.target.value)}
            />
            {errors.businessName && (
              <p className="mt-1 text-xs text-sale">{errors.businessName}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted">
              Contact person
            </label>
            <input
              className="input-underline"
              value={form.contactName}
              onChange={(e) => set('contactName', e.target.value)}
            />
            {errors.contactName && (
              <p className="mt-1 text-xs text-sale">{errors.contactName}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted">
                Email
              </label>
              <input
                type="email"
                className="input-underline"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-sale">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted">
                Phone
              </label>
              <input
                className="input-underline"
                maxLength={10}
                value={form.phone}
                onChange={(e) =>
                  set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))
                }
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-sale">{errors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted">
              Business address
            </label>
            <textarea
              rows={2}
              className="input-underline resize-none"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
            />
            {errors.address && (
              <p className="mt-1 text-xs text-sale">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted">
              GSTIN / Tax Identification Number
            </label>
            <input
              className="input-underline uppercase"
              maxLength={15}
              placeholder="22AAAAA0000A1Z5"
              value={form.gstin}
              onChange={(e) => set('gstin', e.target.value.toUpperCase())}
            />
            {errors.gstin && (
              <p className="mt-1 text-xs text-sale">{errors.gstin}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted">
              Product category
            </label>
            <input
              className="input-underline"
              placeholder="e.g. Men's shirts, footwear"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
            />
            {errors.category && (
              <p className="mt-1 text-xs text-sale">{errors.category}</p>
            )}
          </div>

          <label className="flex items-start gap-3 text-xs leading-relaxed text-muted">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={form.agree}
              onChange={(e) => set('agree', e.target.checked)}
            />
            <span>
              I agree to comply with quality guidelines and maintain valid
              GST registration.
            </span>
          </label>

          {errors.agree && (
            <p className="-mt-4 text-xs text-sale">{errors.agree}</p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="h-12 rounded-full bg-cta px-8 text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep disabled:opacity-40"
          >
            {status === 'sending' ? 'Sending...' : 'Submit enquiry'}
          </button>
        </form>
      </div>
    </div>
  );
}
