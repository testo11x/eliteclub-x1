import { updatePassword } from './actions'
import { Lock } from 'lucide-react'

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const { message } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]">
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm backdrop-blur-md">
          {message}
        </div>
      )}
      
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-transparent" />
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Set New Password</h2>
          <p className="text-zinc-400 mt-2 text-sm">
            Please enter your new password below.
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">New Password</label>
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

          <button
            formAction={updatePassword}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-6 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}
