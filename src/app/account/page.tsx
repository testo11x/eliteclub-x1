'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, Crown, Package, Calendar, Clock } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function AccountPage() {
  const { user, isLoaded } = useAuthStore()
  const router = useRouter()
  const supabase = createClient()
  
  const [profile, setProfile] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login')
    } else if (user) {
      fetchAccountData()
    }
  }, [user, isLoaded])

  const fetchAccountData = async () => {
    setLoading(true)
    
    // Fetch Profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single()
      
    if (profileData) setProfile(profileData)

    // Fetch Orders
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*, order_items(*, products(name, type))')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      
    if (ordersData) setOrders(ordersData)
      
    setLoading(false)
  }

  const isVIP = profile?.membership_tier && profile.membership_tier !== 'none'
  const isExpired = profile?.membership_valid_until ? new Date(profile.membership_valid_until) < new Date() : true

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      
      {(!isLoaded || loading) ? (
        <div className="pt-24 pb-12 h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      ) : (
        <div className="pt-24 pb-12 max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-black text-white mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Profile Overview */}
          <div className="md:col-span-1 space-y-8">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Profile</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-zinc-500">Name</p>
                  <p className="font-semibold text-white">{profile?.name || user?.user_metadata?.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Email</p>
                  <p className="font-semibold text-white break-all">{profile?.email || user?.email}</p>
                </div>
                
                {user?.email === 'germangearsindia@gmail.com' && (
                  <div className="pt-4 mt-4 border-t border-white/10">
                    <a href="/admin" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
                      <Crown className="w-4 h-4" /> Admin Dashboard
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* VIP Status Card */}
            <div className={`border rounded-2xl p-6 relative overflow-hidden ${isVIP && !isExpired ? 'bg-gradient-to-br from-red-900/40 to-black border-red-500/30' : 'bg-[#111] border-white/10'}`}>
              {isVIP && !isExpired && (
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Crown className="w-24 h-24 text-red-500" />
                </div>
              )}
              
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Crown className={`w-5 h-5 ${isVIP && !isExpired ? 'text-red-500' : 'text-zinc-500'}`} /> 
                Membership Status
              </h2>
              
              {isVIP ? (
                <div className="space-y-4 relative z-10">
                  <div>
                    <p className="text-sm text-zinc-400">Current Tier</p>
                    <p className={`text-2xl font-black uppercase tracking-wider ${!isExpired ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'text-zinc-500 line-through'}`}>
                      {profile.membership_tier.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400 mb-1 flex items-center gap-1"><Clock className="w-4 h-4" /> Validity</p>
                    {isExpired ? (
                      <p className="font-semibold text-red-500">
                        Expired on {profile.membership_valid_until ? new Date(profile.membership_valid_until).toLocaleDateString() : 'Unknown'}
                      </p>
                    ) : (
                      <p className="font-semibold text-green-500">
                        Valid till {profile.membership_valid_until ? new Date(profile.membership_valid_until).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown'}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-zinc-500 relative z-10">You do not have an active VIP membership. Visit the homepage to upgrade your experience.</p>
              )}
            </div>
          </div>

          {/* Order History */}
          <div className="md:col-span-2">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 h-full">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-red-500" /> Order History
              </h2>
              
              {orders.length === 0 ? (
                <div className="text-center text-zinc-500 py-12">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="border border-white/5 bg-black/50 rounded-xl p-5 hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-mono font-bold text-white text-lg">{order.short_id}</p>
                          <p className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" /> {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">₹{order.total_amount}</p>
                          <div className="mt-1">
                            {order.status === 'pending' && <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Pending Approval</span>}
                            {order.status === 'approved' && <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Approved</span>}
                            {order.status === 'rejected' && <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Rejected</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-white/5">
                        <p className="text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">Items</p>
                        <ul className="space-y-2">
                          {order.order_items?.map((item: any) => (
                            <li key={item.id} className="flex justify-between text-sm text-zinc-300">
                              <span><span className="text-zinc-500 mr-2">{item.quantity}x</span> {item.products?.name}</span>
                              <span className="font-mono">₹{item.price_at_time * item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
      )}
    </div>
  )
}
