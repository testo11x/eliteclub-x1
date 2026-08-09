import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-600/10 blur-[100px] pointer-events-none" />
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase mb-4 relative z-10">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Touch</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto relative z-10">
            Whether you have a question about our exclusive memberships, premium accessories, or want to partner with GermanGearsIndia, our team is ready to assist you.
          </p>
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
                123 Motorsports Way<br />
                Trackside, Auto City 90210
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
            <div className="bg-[#111111] border border-white/5 p-8 md:p-12 rounded-[24px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/5 blur-[100px] pointer-events-none" />
              
              <h3 className="text-2xl font-bold text-white mb-8 relative z-10">Send us a Message</h3>
              
              <form className="space-y-6 relative z-10" action={async () => {
                'use server'
                // Here you would hook up resend or a database insert for messages
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">First Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#dc2626] transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#dc2626] transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#dc2626] transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Subject</label>
                  <select className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#dc2626] transition-colors appearance-none">
                    <option value="general">General Inquiry</option>
                    <option value="support">Order Support</option>
                    <option value="membership">Membership Info</option>
                    <option value="partnership">Partnership / Press</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Message</label>
                  <textarea 
                    rows={5}
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#dc2626] transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="button"
                  className="w-full md:w-auto px-8 py-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold rounded-full transition-all shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
