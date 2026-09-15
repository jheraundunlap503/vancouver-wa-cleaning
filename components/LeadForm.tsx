'use client'

import { useState } from 'react'
import { submitLead } from '@/lib/supabase'
import { services, phoneIsPlaceholder } from '@/lib/site'
import { IconCheckCircle, IconAlert } from './Icons'

type Status = 'idle' | 'sending' | 'ok' | 'error'

/**
 * The only client component on the site. Writes straight to the Supabase
 * `leads` table from the browser, which is what keeps the export static.
 */
export default function LeadForm({ defaultService }: { defaultService?: string }) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    const name = String(data.get('name') || '').trim()
    const phone = String(data.get('phone') || '').trim()

    if (!name || !phone) {
      setStatus('error')
      setError('Name and phone are both required.')
      return
    }

    setStatus('sending')
    setError('')

    const result = await submitLead({
      name,
      phone,
      email: String(data.get('email') || '').trim() || undefined,
      service_type: String(data.get('service_type') || '') || undefined,
      zip_code: String(data.get('zip_code') || '').trim() || undefined,
      message: String(data.get('message') || '').trim() || undefined,
    })

    if (result.ok) {
      setStatus('ok')
      form.reset()
    } else {
      setStatus('error')
      setError(result.error || 'Something went wrong. Please call instead.')
    }
  }

  if (status === 'ok') {
    return (
      <div className="lead-form">
        <div className="form-status form-status-ok">
          <IconCheckCircle />
          <span>
            {phoneIsPlaceholder
              ? 'Got it. We will reach out to confirm the details and give you a price, usually the same day.'
              : 'Got it. Someone will call you back to confirm the details and give you a price.'}
          </span>
        </div>
        {!phoneIsPlaceholder && (
          <p className="form-note">
            If you need an answer sooner than that, calling is faster than the form.
          </p>
        )}
      </div>
    )
  }

  return (
    <form className="lead-form" onSubmit={onSubmit} noValidate>
      <h2>Request a quote</h2>
      <p>Two required fields. You get a real number, not a callback to ask more questions.</p>

      {status === 'error' && (
        <div className="form-status form-status-err">
          <IconAlert />
          <span>{error}</span>
        </div>
      )}

      <div className="field">
        <label htmlFor="lf-name">Your name</label>
        <input id="lf-name" name="name" type="text" autoComplete="name" required />
      </div>

      <div className="field">
        <label htmlFor="lf-phone">Phone number</label>
        <input id="lf-phone" name="phone" type="tel" autoComplete="tel" required />
      </div>

      <div className="field">
        <label htmlFor="lf-email">Email</label>
        <input id="lf-email" name="email" type="email" autoComplete="email" />
      </div>

      <div className="field">
        <label htmlFor="lf-service">What do you need cleaned</label>
        <select id="lf-service" name="service_type" defaultValue={defaultService || ''}>
          <option value="">Not sure yet</option>
          {services.map((s) => (
            <option key={s.slug} value={s.label}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="lf-zip">ZIP code</label>
        <input id="lf-zip" name="zip_code" type="text" inputMode="numeric" autoComplete="postal-code" />
      </div>

      <div className="field">
        <label htmlFor="lf-message">Anything we should know</label>
        <textarea
          id="lf-message"
          name="message"
          placeholder="Size of the home, number of bathrooms, when you need it done"
        />
      </div>

      <button type="submit" className="btn btn-phone btn-block" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending' : 'Request a quote'}
      </button>

      <p className="form-note">
        We use your contact info to reach out about the cleaning you asked about. Nothing else.
      </p>
    </form>
  )
}
