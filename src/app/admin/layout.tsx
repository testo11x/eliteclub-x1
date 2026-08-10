import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  // Only allow germangearsindia@gmail.com
  if (data.user.email !== 'germangearsindia@gmail.com') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black uppercase tracking-widest text-red-500">Control Panel</h1>
          <p className="text-zinc-500 mt-2">Manage orders, products, customers, and messages.</p>
        </div>
        {children}
      </div>
    </div>
  )
}
