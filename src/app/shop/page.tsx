'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'
import { Product } from '@/store/cartStore'
import ProductCard from '@/components/ProductCard'

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('All')
  
  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('type', 'accessory')
      .order('created_at', { ascending: false })
      
    if (data) {
      setProducts(data as Product[])
    }
    setLoading(false)
  }

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category || 'General')))]
  
  // Filter products based on active category
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => (p.category || 'General') === activeCategory)

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
            Shop <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Accessories</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Curated premium upgrades for your German machine.
          </p>
        </div>

        {/* Dynamic Category Filter Tabs */}
        {!loading && products.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === category 
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
            <p className="text-zinc-500 uppercase tracking-widest font-bold text-sm">Loading Inventory...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((accessory: Product) => (
                <ProductCard key={accessory.id} product={accessory} />
              ))
            ) : (
              <div className="col-span-full text-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/5">
                <p className="text-zinc-500 text-lg">No accessories found in this category.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
