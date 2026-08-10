'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { motion } from 'framer-motion'
import { login, signup, resetPassword } from './actions'
import { Car, Lock, Mail, User, ArrowLeft } from 'lucide-react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

function SubmitButton({ isLogin }: { isLogin: boolean }) {
  const { pending } = useFormStatus()
  
  if (pending) {
    return (
      <div className="w-full flex justify-center mt-6 h-[44px]">
        <DotLottieReact 
          src="/singin.lottie" 
          loop 
          autoplay 
          style={{ width: 60, height: 60, marginTop: -8 }} 
        />
      </div>
    )
  }

  return (
    <button
      formAction={isLogin ? login : signup}
      className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-medium py-2.5 rounded-full transition-all mt-6 shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)]"
    >
      {isLogin ? 'Sign In' : 'Create Account'}
    </button>
  )
}

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [isForgotPassword, setIsForgotPassword] = useState(false)

  if (isForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 z-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: 'url(/singin.gif)' }} />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-transparent z-10" />
          
          <button 
            onClick={() => setIsForgotPassword(false)}
            className="absolute top-6 left-6 text-zinc-400 hover:text-white transition-colors z-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative z-10">
            <div className="text-center mb-8 mt-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">Reset Password</h2>
              <p className="text-zinc-400 mt-2 text-sm">
              Enter your email and we'll help you reset your password via WhatsApp.
            </p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
              const msg = `Hey GermanGearsIndia, I forgot the password for my account (email: ${email}). Could you please reset it?`;
              window.open(`https://wa.me/9182850554?text=${encodeURIComponent(msg)}`, '_blank');
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-medium py-2.5 rounded-full transition-all mt-6 shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)] flex items-center justify-center gap-2"
            >
              Contact Support on WhatsApp
            </button>
          </form>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: 'url(/singin.gif)' }} />
        <div className="absolute inset-0 z-0 bg-black/60" />
        
        {/* Subtle car-inspired accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-transparent z-10" />
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <Car className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join GermanGearsIndia'}
            </h2>
            <p className="text-zinc-400 mt-2 text-sm">
              {isLogin ? 'Enter your details to access your account' : 'Sign up for the ultimate automotive experience'}
            </p>
          </div>

          <form className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="text" 
                    name="name" 
                    required={!isLogin}
                    className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-zinc-300">Password</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-xs text-red-500 hover:text-red-400 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                  type="password" 
                  name="password" 
                  required 
                  className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <SubmitButton isLogin={isLogin} />
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-zinc-300 hover:text-white transition-colors font-medium drop-shadow-md"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
