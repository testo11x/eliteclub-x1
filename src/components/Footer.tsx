import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 pt-16 pb-8 mt-20 relative overflow-hidden">
      {/* Subtle red accent gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-6">
              <img src="/logo1.png" alt="GermanGearsIndia Logo" className="h-12 w-auto mix-blend-screen transform group-hover:-rotate-3 transition-transform" />
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              The ultimate automotive lifestyle brand. Premium accessories, exclusive memberships, and unparalleled service for true enthusiasts.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/germangearsindia/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-[#dc2626] hover:text-white transition-all duration-300">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-[#dc2626] hover:text-white transition-all duration-300">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="https://www.facebook.com/people/Germangearsindia/61575488379629/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-[#dc2626] hover:text-white transition-all duration-300">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-[#dc2626] hover:text-white transition-all duration-300">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-zinc-400 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link href="/#accessories" className="text-zinc-400 hover:text-white transition-colors text-sm">Shop Accessories</Link></li>
              <li><Link href="/contact" className="text-zinc-400 hover:text-white transition-colors text-sm">Contact Us</Link></li>
              <li><Link href="/login" className="text-zinc-400 hover:text-white transition-colors text-sm">Member Login</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Shipping Policy</Link></li>
              <li><Link href="#" className="text-zinc-400 hover:text-white transition-colors text-sm">Return Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#dc2626] shrink-0 mt-0.5" />
                <span className="text-zinc-400 text-sm">123 Motorsports Way, Trackside, Auto City 90210</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#dc2626] shrink-0" />
                <span className="text-zinc-400 text-sm">+91 8019591100</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#dc2626] shrink-0" />
                <span className="text-zinc-400 text-sm">support@germangearsindia.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} GermanGearsIndia Automotive. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-zinc-500 text-sm">Systems Online</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
