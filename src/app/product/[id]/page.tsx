'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useCartStore, Product } from '@/store/cartStore'
import { Loader2, ArrowLeft, ShoppingCart, Check, ShieldCheck, Truck } from 'lucide-react'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const supabase = createClient()
  const { addItem, items } = useCartStore()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdded, setIsAdded] = useState(false)
  
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      
    if (data) {
      setProduct(data as Product)
    }
    setLoading(false)
  }

  const handleAdd = () => {
    if (product) {
      addItem(product)
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <button onClick={() => router.push('/shop')} className="text-zinc-400 hover:text-white flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </button>
      </div>
    )
  }

  const inCart = items.some((item) => item.product.id === product.id)

  // Construct media array
  const mediaList: { type: 'video' | 'image', url: string }[] = []
  if (product.video_url) mediaList.push({ type: 'video', url: product.video_url })
  if (product.image_url) mediaList.push({ type: 'image', url: product.image_url })
  if (product.image_url_2) mediaList.push({ type: 'image', url: product.image_url_2 })
  if (product.image_url_3) mediaList.push({ type: 'image', url: product.image_url_3 })

  const activeMedia = mediaList[activeMediaIndex]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <button onClick={() => router.push('/shop')} className="text-zinc-500 hover:text-white flex items-center gap-2 mb-8 transition-colors text-sm font-bold uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative">
          
          {/* Left: Media Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Media Display */}
            <div className="aspect-[4/3] sm:aspect-[16/10] bg-[#111] rounded-3xl overflow-hidden border border-white/5 relative shadow-2xl flex items-center justify-center">
              {activeMedia ? (
                activeMedia.type === 'video' ? (
                  <video src={activeMedia.url} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                ) : (
                  <img src={activeMedia.url} alt={product.name} className="w-full h-full object-cover" />
                )
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-600">
                  <span className="text-4xl font-bold italic opacity-20">GERMANGEARS</span>
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {mediaList.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {mediaList.map((media, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveMediaIndex(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeMediaIndex === index ? 'border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'border-transparent hover:border-white/20 opacity-50 hover:opacity-100'}`}
                  >
                    {media.type === 'video' ? (
                      <video src={media.url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={media.url} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Sticky Info Sidebar */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32 flex flex-col">
              <div className="mb-2">
                <span className="text-red-500 font-bold uppercase tracking-widest text-xs bg-red-500/10 px-3 py-1 rounded-full">
                  {product.category || product.type}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mt-4 mb-2">{product.name}</h1>
              
              <div className="text-3xl font-mono font-bold text-white/90 mb-8">
                ₹{product.price.toLocaleString('en-IN')}
              </div>

              {/* Description */}
              <div className="prose prose-invert max-w-none text-zinc-400 mb-10 leading-relaxed whitespace-pre-wrap">
                {product.description || "No description provided."}
              </div>

              {/* Add to Cart Area */}
              <div className="space-y-4">
                <button
                  onClick={handleAdd}
                  disabled={inCart}
                  className={`w-full py-4 px-8 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group ${
                    inCart 
                      ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed' 
                      : 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]'
                  }`}
                >
                  {/* Subtle carbon texture overlay on hover */}
                  {!inCart && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-[url('/carbon-pattern.png')] mix-blend-overlay transition-opacity" />
                  )}
                  
                  {isAdded ? (
                    <><Check className="w-5 h-5 relative z-10 text-green-600" /> <span className="relative z-10 text-green-600">Added to Cart</span></>
                  ) : inCart ? (
                    <><Check className="w-5 h-5" /> Already in Cart</>
                  ) : (
                    <><ShoppingCart className="w-5 h-5 relative z-10" /> <span className="relative z-10">Add to Cart</span></>
                  )}
                </button>
              </div>

              {/* Perks */}
              <div className="mt-12 space-y-4 border-t border-white/5 pt-8">
                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                  <ShieldCheck className="w-5 h-5 text-zinc-500" />
                  <span>Premium German Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                  <Truck className="w-5 h-5 text-zinc-500" />
                  <span>Fast, secure shipping across India</span>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
