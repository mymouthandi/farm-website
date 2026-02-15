'use client'

import { useState, FormEvent } from 'react'

export function ContactForm() {
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone') || undefined,
          message: formData.get('message'),
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setStatus('error')
        setErrorMessage(
          data.message || data.error || 'Something went wrong. Please try again.'
        )
        return
      }

      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
      setErrorMessage('Failed to send message. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Name <span className="text-farm-coral">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-farm-green focus:border-farm-green outline-none transition-colors"
          placeholder="Your name"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email <span className="text-farm-coral">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-farm-green focus:border-farm-green outline-none transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Phone <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-farm-green focus:border-farm-green outline-none transition-colors"
          placeholder="01572 722122"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Message <span className="text-farm-coral">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-farm-green focus:border-farm-green outline-none transition-colors resize-y min-h-[120px]"
          placeholder="How can we help?"
        />
      </div>

      {status === 'success' && (
        <div className="p-4 rounded-lg bg-farm-green/10 border border-farm-green/30">
          <p className="text-farm-green-dark font-medium">
            Thank you! Your message has been sent. We&apos;ll get back to you
            soon.
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 rounded-lg bg-farm-coral/10 border border-farm-coral/30">
          <p className="text-farm-coral font-medium">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full sm:w-auto px-8 py-3 rounded-lg bg-farm-green text-white font-semibold hover:bg-farm-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-farm-green focus:ring-offset-2"
      >
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
