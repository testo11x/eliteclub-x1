'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { ShoppingBag, User, LogOut } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { signOut } from '@/app/login/actions'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function Navbar() {
  const { toggleCart, items } = useCartStore()
  const { user, setUser } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase.auth, pathname])

  const cartItemCount = mounted ? items.reduce((total, item) => total + item.quantity, 0) : 0

  return (
    <nav className="sticky top-0 z-40 w-full bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/logo1.png" alt="GermanGearsIndia Logo" className="h-12 w-auto mix-blend-screen transform group-hover:scale-105 transition-transform" />
            </Link>

            {/* Main Navigation Links */}
            <div className="hidden md:flex items-center gap-6 border-l border-white/10 pl-8 ml-2">
              <Link href="/" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/#accessories" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                Shop
              </Link>
              <Link href="/contact" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-400 hidden sm:inline-block">
                  {user.user_metadata?.full_name || user.email}
                </span>
                <form action={signOut}>
                  <button type="submit" className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                <User className="w-5 h-5" />
                <span className="hidden sm:inline-block">Sign In</span>
              </Link>
            )}

            <div className="w-px h-6 bg-white/10 mx-2"></div>

            <button 
              onClick={toggleCart}
              className="relative p-2 text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 translate-x-1 -translate-y-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
