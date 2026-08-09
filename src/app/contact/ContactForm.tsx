'use client'

import { useActionState, useEffect, useRef } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import { submitContactMessage } from '@/app/actions/contact'

type ContactFormState = {
  success: boolean;
  error?: string;
}

const initialState: ContactFormState = {
  success: false,
}

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactMessage, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
    }
  }, [state.success])

  if (state.success) {
    return (
      <div className="bg-[#111111] border border-green-500/30 p-8 md:p-12 rounded-[24px] shadow-2xl relative overflow-hidden text-center flex flex-col items-center justify-center min-h-[450px]">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-3xl font-bold text-white mb-4">Message Sent!</h3>
        <p className="text-zinc-400 max-w-sm mx-auto">
          Thank you for reaching out to GermanGearsIndia. Our team will get back to you as soon as possible.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-colors"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <div className="bg-[#111111] border border-white/5 p-8 md:p-12 rounded-[24px] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/5 blur-[100px] pointer-events-none" />
      
      <h3 className="text-2xl font-bold text-white mb-8 relative z-10">Send us a Message</h3>
      
      {state.error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl">
          {state.error}
        </div>
      )}

      <form ref={formRef} action={formAction} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-zinc-400 mb-2">First Name</label>
            <input 
              type="text" 
              id="firstName"
              name="firstName"
              required
              className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#dc2626] transition-colors"
              placeholder="John"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-zinc-400 mb-2">Last Name</label>
            <input 
              type="text" 
              id="lastName"
              name="lastName"
              required
              className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#dc2626] transition-colors"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
          <input 
            type="email" 
            id="email"
            name="email"
            required
            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#dc2626] transition-colors"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-zinc-400 mb-2">Subject</label>
          <select 
            id="subject"
            name="subject"
            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#dc2626] transition-colors appearance-none"
          >
            <option value="general">General Inquiry</option>
            <option value="support">Order Support</option>
            <option value="membership">Membership Info</option>
            <option value="partnership">Partnership / Press</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-zinc-400 mb-2">Message</label>
          <textarea 
            id="message"
            name="message"
            required
            rows={5}
            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#dc2626] transition-colors resize-none"
            placeholder="How can we help you?"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full md:w-auto px-8 py-4 bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-full transition-all shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] flex items-center justify-center gap-2"
        >
          {isPending ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          {isPending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}
