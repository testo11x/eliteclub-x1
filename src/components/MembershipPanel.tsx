'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product, useCartStore } from '@/store/cartStore'
import { Check, Star, Users, MessageCircle, MapPin, ChevronRight, ChevronLeft, Play } from 'lucide-react'

export default function MembershipPanel({ memberships }: { memberships: Product[] }) {
  // Only use 2 plans. Sort them to ensure consistent order (e.g., cheaper first)
  const availablePlans = memberships.filter(m => m.price !== 999).sort((a, b) => a.price - b.price)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeVideo, setActiveVideo] = useState(0)
  const videoScrollRef = useRef<HTMLDivElement>(null)

  const scrollToVideo = (index: number) => {
    setActiveVideo(index)
    if (videoScrollRef.current) {
      const scrollAmount = videoScrollRef.current.clientWidth * index
      videoScrollRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const handleVideoScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const index = Math.round(el.scrollLeft / el.clientWidth)
    setActiveVideo(index)
  }

  const scrollVideo = (direction: 'left' | 'right') => {
    if (videoScrollRef.current) {
      const scrollAmount = videoScrollRef.current.clientWidth
      videoScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

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
    <div className="relative pt-24 pb-32">
      {/* Decorative gradient orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase mb-6 drop-shadow-2xl">
            Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Tier</span>
          </h2>
          
          {/* Sleek Pill Toggle with Framer Motion */}
          <div className="inline-flex items-center p-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md mb-8 relative">
            <AnimatePresence>
              <motion.div 
                className="absolute inset-y-1.5 bg-[#dc2626] rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                layoutId="pill-highlight"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{ 
                  width: `calc(50% - 6px)`,
                  left: selectedIndex === 0 ? '6px' : 'calc(50%)'
                }}
              />
            </AnimatePresence>
            {availablePlans.map((plan, index) => (
              <button
                key={plan.id}
                onClick={() => setSelectedIndex(index)}
                className={`relative z-10 w-32 sm:w-40 py-3 rounded-full text-sm font-bold tracking-wider uppercase transition-colors duration-300 ${
                  selectedIndex === index 
                    ? 'text-white' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {plan.name}
              </button>
            ))}
          </div>
        </div>

        {/* Unified Dynamic Card */}
        <div 
          className={`bg-black/60 border ${selectedPlan.price >= 9000 ? 'border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.15)]' : 'border-red-500/30 shadow-[0_0_40px_rgba(220,38,38,0.15)]'} p-8 md:p-12 rounded-[32px] backdrop-blur-xl relative overflow-hidden transition-all duration-700 max-w-6xl mx-auto`}
        >
          <div 
            className={`absolute top-0 right-0 w-[400px] h-[400px] blur-[100px] pointer-events-none transition-colors duration-1000 ${selectedPlan.price >= 9000 ? 'bg-amber-600/10' : 'bg-red-600/10'}`} 
          />
          <div 
            className={`absolute bottom-0 left-0 w-[300px] h-[300px] blur-[80px] pointer-events-none transition-colors duration-1000 ${selectedPlan.price >= 9000 ? 'bg-amber-600/5' : 'bg-red-600/5'}`} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left Side: Selected Plan Details */}
            <div className="lg:col-span-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedPlan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <div className="text-center lg:text-left mb-8">
                    <div className="inline-block px-4 py-1.5 bg-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest rounded-full mb-6">
                      GermanGearsIndia {selectedPlan.name}
                    </div>
                    <h3 className="text-4xl font-black text-white mb-2 tracking-tight">{selectedPlan.name}</h3>
                    <div className="flex items-baseline justify-center lg:justify-start gap-2">
                      <span className="text-6xl font-black text-white">₹{selectedPlan.price}</span>
                      <span className="text-zinc-400 font-medium">/ Year</span>
                    </div>
                    {selectedPlan.description && (
                      <p className="text-sm text-zinc-400 mt-4">{selectedPlan.description}</p>
                    )}
                  </div>

                  <div className="space-y-4 mb-10 text-left">
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

                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-500/20 text-red-500">
                        <Star className="w-5 h-5" />
                      </div>
                      <span className="text-sm text-zinc-300 font-medium">Features, Reposts & Collabs</span>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-500/20 text-red-500">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <span className="text-sm text-zinc-300 font-medium">Exclusive Car Meets & Drives</span>
                    </div>

                    {/* Base Tier Only */}
                    {selectedPlan.price <= 500 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 overflow-hidden"
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-red-500/20 text-red-500">
                          <Check className="w-5 h-5" />
                        </div>
                        <span className="text-sm text-zinc-300 font-medium">And more...</span>
                      </motion.div>
                    )}

                    {/* Elite Plus Tier Exclusive Features */}
                    {selectedPlan.price > 500 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4 overflow-hidden"
                      >
                        <div className="flex items-center gap-4 bg-amber-500/10 p-4 rounded-2xl border border-amber-500/30">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-amber-500 text-black">
                            <Star className="w-5 h-5" />
                          </div>
                          <span className="text-sm text-amber-500 font-bold">Priority Entry & Reserved Event Spots</span>
                        </div>

                        <div className="flex items-center gap-4 bg-amber-500/10 p-4 rounded-2xl border border-amber-500/30">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-amber-500 text-black">
                            <MessageCircle className="w-5 h-5" />
                          </div>
                          <span className="text-sm text-amber-500 font-bold">Elite+ Networking & Brand Collabs</span>
                        </div>

                        <div className="flex items-center gap-4 bg-amber-500/10 p-4 rounded-2xl border border-amber-500/30">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-amber-500 text-black">
                            <Check className="w-5 h-5" />
                          </div>
                          <span className="text-sm text-amber-500 font-bold">Early Access to Drops & Experiences</span>
                        </div>

                        <div className="flex items-center gap-4 bg-amber-500/10 p-4 rounded-2xl border border-amber-500/30">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-amber-500 text-black">
                            <Star className="w-5 h-5" />
                          </div>
                          <span className="text-sm text-amber-500 font-bold">Priority Entry to Exclusive Car Meets - PAN India</span>
                        </div>

                        <div className="flex items-center gap-4 bg-amber-500/10 p-4 rounded-2xl border border-amber-500/30">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-amber-500 text-black">
                            <Users className="w-5 h-5" />
                          </div>
                          <span className="text-sm text-amber-500 font-bold">Member-Only Giveaways & Contests</span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <button 
                    onClick={handleJoin}
                    className={`relative group w-full py-5 font-bold rounded-full transition-all duration-500 text-lg uppercase tracking-wider text-white flex items-center justify-center`}
                  >
                    <div className="absolute inset-0 rounded-full overflow-hidden z-0 transform-gpu [-webkit-mask-image:-webkit-radial-gradient(white,black)] bg-black">
                      <video 
                        src="/carbon-button.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                    </div>
                    <span className="relative z-20 drop-shadow-lg flex items-center gap-2 transition-transform duration-300 group-hover:scale-105">
                      Join Membership <span className="text-xl font-medium leading-none">→</span>
                    </span>
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Side: Swipable Reels Carousel */}
            <div className="lg:col-span-6 h-full flex flex-col justify-center items-center mt-12 lg:mt-0">
              <div className="w-full max-w-[340px] relative group">
                {/* Elegant Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600/30 to-red-900/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                {/* The Clean Screen */}
                <div className="relative rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10 aspect-[9/16] z-10 transform-gpu transition-transform duration-500 hover:scale-[1.01]">
                  <div 
                    ref={videoScrollRef}
                    onScroll={handleVideoScroll}
                    className="flex h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar"
                  >
                    {[
                      "/H1.mp4",
                      "/H2.mp4",
                      "/H3.mp4",
                      "/H4.mp4"
                    ].map((url, i) => (
                      <div 
                        key={i} 
                        className="w-full h-full flex-none relative bg-zinc-900 snap-center"
                      >
                        <video 
                          src={url}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          className="absolute top-0 left-0 w-full h-full object-cover z-10"
                        />
                        
                        {/* Dark overlay at bottom to make UI elements pop */}
                        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none" />
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollVideo('left'); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-red-600/80 text-white transition-all z-40 backdrop-blur-sm pointer-events-auto"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollVideo('right'); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-red-600/80 text-white transition-all z-40 backdrop-blur-sm pointer-events-auto"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Internal UI Overlays */}
                  <div className="absolute bottom-6 inset-x-0 flex flex-col items-center justify-end z-30 pointer-events-none">
                    {/* Floating Pagination inside the screen */}
                    <div className="flex justify-center gap-2 mb-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-auto">
                      {[0, 1, 2, 3].map((i) => (
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
