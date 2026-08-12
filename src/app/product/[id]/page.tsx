import { Metadata, ResolvingMetadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import ProductClient from './ProductClient'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Props = {
  params: { id: string }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!product) {
    return {
      title: 'Product Not Found | GermanGearsIndia',
    }
  }

  return {
    title: `${product.name} | GermanGearsIndia`,
    description: product.description ? product.description.slice(0, 150) + '...' : `Buy ${product.name} at GermanGearsIndia. Premium accessories for your German car.`,
    openGraph: {
      title: `${product.name} | GermanGearsIndia`,
      description: product.description ? product.description.slice(0, 150) + '...' : `Buy ${product.name} at GermanGearsIndia. Premium accessories for your German car.`,
      images: product.image_url ? [product.image_url] : ['/logo-2.jpg'],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <Link href="/shop" className="text-zinc-400 hover:text-white flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>
    )
  }

  return <ProductClient product={product} />
}
