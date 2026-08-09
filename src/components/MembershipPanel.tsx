'use client'

import { useState, useRef } from 'react'
import { Product, useCartStore } from '@/store/cartStore'
import { Check, Star, Users, MessageCircle, MapPin, ChevronRight, ChevronLeft, Play } from 'lucide-react'

export default function MembershipPanel({ memberships }: { memberships: Product[] }) {
  // Only use 2 plans. Sort them to ensure consistent order (e.g., cheaper first)
  const availablePlans = memberships.filter(m => m.price !== 999).sort((a, b) => a.price - b.price)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeVideo, setActiveVideo] = useState(0)

  const scrollToVideo = (index: number) => {
    setActiveVideo(index);
  };

  const selectedPlan = availablePlans[selectedIndex]

  // Zustand cart store actions
  const addItem = useCartStore((state) => state.addItem)
  const openCart = useCartStore((state) => state.openCart)

  const handleJoin = () => {
    if (selectedPlan) {
      addItem(selectedPlan)
      openCart()
    }
  }

  // Fallback if no plans are found
  if (!availablePlans || availablePlans.length === 0) {
    return <div className="text-white text-center py-20">Loading memberships...</div>
  }



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase mb-6 drop-shadow-2xl">
          Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Tier</span>
        </h2>
        
        {/* Sleek Pill Toggle */}
        <div className="inline-flex items-center p-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md mb-8">
          {availablePlans.map((plan, index) => (
            <button
              key={plan.id}
              onClick={() => setSelectedIndex(index)}
              className={`px-8 py-3 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 ${
                selectedIndex === index 
                  ? 'bg-[#dc2626] text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {plan.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Selected Plan Details (Takes up 5 columns on large screens) */}
        <div className="lg:col-span-5 bg-black/60 border border-red-500/30 p-8 md:p-12 rounded-[32px] shadow-[0_0_40px_rgba(220,38,38,0.15)] backdrop-blur-xl relative overflow-hidden transition-all">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-red-600/10 blur-[80px] pointer-events-none" />
          
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-1.5 bg-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
              GermanGearsIndia Elite
            </div>
            <h3 className="text-3xl font-black text-white mb-2 tracking-tight">{selectedPlan.name}</h3>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-6xl font-black text-white">₹{selectedPlan.price}</span>
              <span className="text-zinc-400 font-medium">/ Year</span>
            </div>
            {selectedPlan.description && (
              <p className="text-sm text-zinc-400 mt-4">{selectedPlan.description}</p>
            )}
          </div>

          <div className="space-y-4 mb-10">
            {/* Base Tier Features - Included in both */}
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-500/20 text-red-500">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-sm text-zinc-300 font-medium">Connect and network with fellow car enthusiasts</span>
            </div>

            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-500/20 text-red-500">
                <Star className="w-5 h-5" />
              </div>
              <span className="text-sm text-zinc-300 font-medium">Exclusive member perks and updates</span>
            </div>

            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-500/20 text-red-500">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-sm text-zinc-300 font-medium">GermanGears WhatsApp Group</span>
            </div>

            {/* Base Tier Only */}
            {selectedPlan.price < 9000 && (
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-500/20 text-red-500">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-sm text-zinc-300 font-medium">And more...</span>
              </div>
            )}

            {/* Elite Tier Exclusive Features */}
            {selectedPlan.price >= 9000 && (
              <>
                <div className="flex items-center gap-4 bg-[#dc2626]/20 p-4 rounded-2xl border border-[#dc2626]/30">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-500 text-white">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-white font-medium">Exclusive Car Meets & VIP Drives</span>
                </div>

                <div className="flex items-center gap-4 bg-[#dc2626]/20 p-4 rounded-2xl border border-[#dc2626]/30">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-500 text-white">
                    <Check className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-white font-medium">Brand Collaboration Opportunities</span>
                </div>

                <div className="flex items-center gap-4 bg-[#dc2626]/20 p-4 rounded-2xl border border-[#dc2626]/30">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-500 text-white">
                    <Star className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-white font-medium">Priority Features, Reposts & Collabs</span>
                </div>
              </>
            )}
          </div>

          <button 
            onClick={handleJoin}
            className="w-full py-5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold rounded-full transition-all shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] text-lg uppercase tracking-wider"
          >
            Join Membership
          </button>
        </div>

        {/* Right Side: Swipable Reels Carousel (Takes up 7 columns) */}
        <div className="lg:col-span-7 h-full flex flex-col justify-center items-center mt-12 lg:mt-0">
          <div className="w-full max-w-[340px] relative group perspective-1000">
            {/* Cinematic Glow Behind Phone */}
            <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" />
            
            {/* The Mock Phone Frame */}
            <div className="relative bg-black rounded-[3rem] p-2 sm:p-3 shadow-2xl border-[4px] border-zinc-800/80 ring-1 ring-white/10 z-10 overflow-hidden transform-gpu transition-transform duration-500 hover:scale-[1.02]">
              
              {/* Hardware elements: Notch / Dynamic Island */}
              <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50 pointer-events-none">
                <div className="w-24 h-6 bg-black rounded-b-2xl flex items-center justify-center gap-2 px-3 shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-800/80 border border-white/10" />
                  <div className="w-2 h-2 rounded-full bg-indigo-900/40 border border-indigo-500/30 flex items-center justify-center">
                    <div className="w-0.5 h-0.5 rounded-full bg-indigo-400" />
                  </div>
                </div>
              </div>

              {/* Hardware elements: Side Buttons */}
              <div className="absolute -left-[6px] top-24 w-1 h-8 bg-zinc-800 rounded-l-md" />
              <div className="absolute -left-[6px] top-36 w-1 h-12 bg-zinc-800 rounded-l-md" />
              <div className="absolute -left-[6px] top-52 w-1 h-12 bg-zinc-800 rounded-l-md" />
              <div className="absolute -right-[6px] top-32 w-1 h-16 bg-zinc-800 rounded-r-md" />

              {/* The Screen */}
              <div className="relative rounded-[2.2rem] overflow-hidden bg-[#0a0a0a] aspect-[9/16]">
                <div 
                  className="flex transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] h-full"
                  style={{ transform: `translateX(-${activeVideo * 100}%)` }}
                >
                  {[
                    "https://jumpshare.com/embed/03AuaP8mOuKVpxL5i9r1?title=0",
                    "https://jumpshare.com/embed/cp0nkiShcQkz2yJbAUpG?title=0"
                  ].map((url, i) => (
                    <div 
                      key={i} 
                      className="w-full h-full flex-none relative bg-zinc-900"
                    >
                      <iframe 
                        id={`js_video_iframe_${i}`}
                        src={url} 
                        frameBorder="0" 
                        allowFullScreen 
                        className="absolute top-0 left-0 w-full h-full z-10"
                      ></iframe>
                      
                      {/* Dark overlay at bottom to make UI elements pop */}
                      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none" />
                    </div>
                  ))}
                </div>

                {/* Internal UI Overlays */}
                <div className="absolute bottom-6 inset-x-0 flex flex-col items-center justify-end z-30 pointer-events-none">
                  {/* Floating Pagination inside the screen */}
                  <div className="flex justify-center gap-2 mb-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-auto shadow-xl">
                    {[0, 1].map((i) => (
                      <button
                        key={i}
                        onClick={() => scrollToVideo(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          activeVideo === i 
                            ? 'bg-red-500 w-5 shadow-[0_0_10px_rgba(220,38,38,0.8)]' 
                            : 'bg-white/40 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="text-white/90 text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-xl">
                    <Play className="w-3 h-3 text-red-500 fill-red-500" /> Club Highlights
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  )
}
