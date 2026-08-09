import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import ContactForm from './ContactForm'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="relative mb-16 py-24 rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
          {/* GIF Background */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: 'url(/1.gif)' }}
          />
          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0a0a0a]/80 via-black/50 to-[#0a0a0a] pointer-events-none" />
          
          <div className="relative z-20 text-center px-4">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase mb-4 drop-shadow-2xl">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-700">Touch</span>
            </h1>
            <p className="text-zinc-300 max-w-2xl mx-auto drop-shadow-md">
              Whether you have a question about our exclusive memberships, premium accessories, or want to partner with GermanGearsIndia, our team is ready to assist you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#111111] border border-white/5 p-8 rounded-[24px] hover:border-red-500/30 transition-colors group">
              <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-[#dc2626]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Visit Us</h3>
              <p className="text-zinc-400">
                Mumbai, Maharashtra, India
              </p>
            </div>

            <div className="bg-[#111111] border border-white/5 p-8 rounded-[24px] hover:border-red-500/30 transition-colors group">
              <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-[#dc2626]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Call Us</h3>
              <p className="text-zinc-400 mb-1">+91 8019591100</p>
              <p className="text-sm text-zinc-500">Mon-Fri from 9am to 6pm</p>
            </div>

            <div className="bg-[#111111] border border-white/5 p-8 rounded-[24px] hover:border-red-500/30 transition-colors group">
              <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-[#dc2626]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Email Us</h3>
              <p className="text-zinc-400 mb-1">support@germangearsindia.com</p>
              <p className="text-sm text-zinc-500">We typically reply within 24 hours</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
  )
}
