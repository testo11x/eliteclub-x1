'use client'

import { motion } from 'framer-motion'
import { Plus, Check, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCartStore, Product } from '@/store/cartStore'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCartStore()
  const [isAdded, setIsAdded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const inCart = mounted ? items.some((item) => item.product.id === product.id) : false
  
  const handleAdd = () => {
    addItem(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const mediaCount = (product.video_url ? 1 : 0) + (product.image_url ? 1 : 0) + (product.image_url_2 ? 1 : 0) + (product.image_url_3 ? 1 : 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative bg-[#111111] rounded-[24px] overflow-hidden hover:shadow-2xl hover:shadow-red-900/20 transition-all duration-500 border border-white/5 flex flex-col"
    >
      <div 
        onClick={() => router.push(`/product/${product.id}`)}
        className="relative aspect-square overflow-hidden bg-black/50 group/gallery cursor-pointer"
      >
        {/* Subtle red glow behind image */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none" />
        
        {(product.video_url || product.image_url) ? (
          <div ref={scrollRef} className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none relative z-10">
            {product.video_url && (
              <video 
                src={product.video_url} 
                autoPlay 
                muted 
                loop 
                playsInline
                className="flex-none w-full h-full object-cover snap-center"
              />
            )}
            {product.image_url && (
              <img src={product.image_url} alt={product.name} className="flex-none w-full h-full object-cover snap-center transform group-hover:scale-105 transition-transform duration-700 ease-out" />
            )}
            {product.image_url_2 && (
              <img src={product.image_url_2} alt={`${product.name} view 2`} className="flex-none w-full h-full object-cover snap-center" />
            )}
            {product.image_url_3 && (
              <img src={product.image_url_3} alt={`${product.name} view 3`} className="flex-none w-full h-full object-cover snap-center" />
            )}
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 bg-gradient-to-br from-zinc-900 to-black relative z-10 p-8 text-center">
            <img src="/logo-2.jpg" alt="GermanGearsIndia" className="w-16 h-16 mb-4 rounded-xl opacity-50 grayscale" />
            <span className="text-2xl font-bold italic opacity-30">GERMANGEARS</span>
          </div>
        )}
        
        {/* Indicators if multiple media items */}
        {((product.video_url ? 1 : 0) + (product.image_url ? 1 : 0) + (product.image_url_2 ? 1 : 0) + (product.image_url_3 ? 1 : 0) > 1) && (
          <>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20 transition-opacity">
              {product.video_url && <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>}
              {product.image_url && <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>}
              {product.image_url_2 && <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>}
              {product.image_url_3 && <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>}
            </div>
            
            {/* Navigation Arrows */}
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); scroll('left'); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-red-600/80 text-white transition-all z-20 backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); scroll('right'); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-red-600/80 text-white transition-all z-20 backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
        
        {product.type === 'membership' && (
          <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] tracking-wide z-20">
            MEMBERSHIP
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow relative z-10">
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 mb-2 hover:underline">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-zinc-400 line-clamp-2 min-h-[40px] mb-6">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-2xl font-black text-white">
            ₹{product.price}
          </span>
          <button
            onClick={handleAdd}
            disabled={product.type === 'membership' && inCart}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all ${
              (product.type === 'membership' && inCart) || isAdded
                ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                : 'bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {(product.type === 'membership' && inCart) || isAdded ? (
              <>
                <Check className="w-5 h-5 text-green-500" />
                <span>Added</span>
              </>
            ) : (
              <>
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
