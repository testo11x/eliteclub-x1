import { createClient } from '@/utils/supabase/server'
import ProductCard from '@/components/ProductCard'
import MembershipPanel from '@/components/MembershipPanel'
import { Product } from '@/store/cartStore'


export const revalidate = 0 // Disable caching to always show latest products

export default async function Home() {
  const supabase = await createClient()

  // Fetch all products
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('price', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
  }

  // We can still fetch these if needed, but we will hardcode the GermanGearsIndia Membership details as requested
  const accessories = products?.filter((p: Product) => p.type === 'accessory') || []

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-black">
        {/* Background Car Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-[center_top] sm:bg-center bg-no-repeat opacity-60"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=100&w=1920)' }}
        />
        
        {/* Gradient Overlays for blending */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black via-transparent to-transparent opacity-80" />

        {/* Layered Typography */}
        <div className="relative z-20 text-center w-full max-w-7xl mx-auto px-4 mt-20">
          <h1 
            className="text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 tracking-tighter uppercase select-none"
            style={{ mixBlendMode: 'overlay' }}
          >
            Explore Beyond
          </h1>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-widest uppercase mt-[-10px] md:mt-[-20px] drop-shadow-2xl">
            The Ordinary
          </h1>
          
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="#germangearsindia" 
              className="px-10 py-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold tracking-wider uppercase text-sm transition-all duration-300 flex items-center gap-2 shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] rounded-full"
            >
              Join GermanGearsIndia <span className="text-xl leading-none">›</span>
            </a>
            <a 
              href="#accessories" 
              className="px-10 py-4 bg-transparent border border-white/20 hover:border-white text-white font-semibold tracking-wider uppercase text-sm transition-all duration-300 rounded-full"
            >
              Shop Accessories
            </a>
          </div>
        </div>
      </section>

      {/* GermanGearsIndia Memberships (Dynamic Premium Tiers) */}
      <section id="germangearsindia" className="relative py-16 overflow-hidden bg-black">
        {/* Full-width Cinematic Background Video */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a] z-10" />
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-60"
          >
            <source src="https://cdn.coverr.co/videos/coverr-driving-a-porsche-in-the-mountains-2646/1080p.mp4" type="video/mp4" />
          </video>
        </div>

        <MembershipPanel memberships={products?.filter((p: Product) => p.type === 'membership') || []} />
      </section>

      {/* Accessories Section */}
      <section id="accessories" className="py-16 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-tight">Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Accessories</span></h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">Enhance your ride with our curated selection of high-end accessories.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accessories.length > 0 ? (
              accessories.map((accessory: Product) => (
                <ProductCard key={accessory.id} product={accessory} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-zinc-500">
                No accessories found. Stay tuned for new arrivals.
              </div>
            )}
          </div>
        </div>
      </section>
      
    </div>
  )
}
