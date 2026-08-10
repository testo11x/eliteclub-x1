'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { X, Plus, Minus, ShoppingBag, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Cart() {
  const { items, isCartOpen, closeCart, updateQuantity, removeItem, getCartTotal } = useCartStore()
  const { user, isLoaded } = useAuthStore()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [address, setAddress] = useState({ street: '', city: '', zip: '', phone: '' })
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleCheckout = async () => {
    if (!address.street || !address.city || !address.zip || !address.phone) {
      alert("Please fill in all address fields.")
      return
    }

    if (!user) {
      alert("Please login to place an order.")
      return
    }

    setIsCheckingOut(true)
    
    try {
      const supabase = (await import('@/utils/supabase/client')).createClient()
      
      // 1. Generate short ID
      const shortId = 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase()
      
      // 2. Insert Order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          short_id: shortId,
          user_id: user.id,
          total_amount: getCartTotal(),
          shipping_address: address,
          status: 'pending'
        })
        .select()
        .single()
        
      if (orderError) throw orderError

      // 3. Insert Order Items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price_at_time: item.product.price
      }))
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        
      if (itemsError) throw itemsError

      // 4. Format cart data for WhatsApp
      let message = `Hello! I would like to place an order.%0A%0A*Order ID: ${shortId}*%0A%0A`
      
      items.forEach((item, index) => {
        message += `${index + 1}. *${item.product.name}* (x${item.quantity}) - ₹${item.product.price * item.quantity}%0A`
      })
      
      message += `%0A*Total: ₹${getCartTotal()}*%0A`
      message += `%0A*Shipping Details:*%0AName: ${user?.user_metadata?.full_name || 'Customer'}%0AEmail: ${user?.email}%0APhone: ${address.phone}%0AAddress: ${address.street}, ${address.city} - ${address.zip}%0A`
      message += `%0APlease process my order.`
      
      // Redirect to WhatsApp
      window.location.href = `https://api.whatsapp.com/send/?phone=9182850554&text=${message}`
      
      setTimeout(() => {
        setIsCheckingOut(false)
        closeCart()
      }, 1000)
    } catch (err: any) {
      console.error(err)
      alert("Error placing order: " + err.message)
      setIsCheckingOut(false)
    }
  }

  const proceedToAddress = () => {
    setShowAddressForm(true)
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#111111] border-l border-white/5 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Your Cart
              </h2>
              <button
                onClick={closeCart}
                className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            {!showAddressForm ? (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                    <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                    <p>Your cart is empty.</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 bg-[#1a1a1a] p-4 rounded-2xl shadow-lg border border-white/5">
                      {item.product.image_url ? (
                        <div className="w-20 h-20 bg-black/40 rounded-xl overflow-hidden">
                          <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-600">
                          No Image
                        </div>
                      )}
                      
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-white font-medium line-clamp-1">{item.product.name}</h3>
                        <p className="text-red-500 font-semibold mt-1">₹{item.product.price}</p>
                        
                        <div className="mt-auto flex items-center justify-between">
                          {item.product.type === 'accessory' ? (
                            <div className="flex items-center gap-2 bg-[#222222] rounded-lg p-1">
                              <button 
                                onClick={() => {
                                  if (item.quantity > 1) updateQuantity(item.product.id, item.quantity - 1)
                                  else removeItem(item.product.id)
                                }}
                                className="p-1.5 hover:bg-[#dc2626] rounded-md text-zinc-300 hover:text-white transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-white text-sm font-bold w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1.5 hover:bg-[#dc2626] rounded-md text-zinc-300 hover:text-white transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs bg-[#dc2626]/20 text-red-400 px-3 py-1.5 rounded-md font-medium">Membership</span>
                          )}
                          
                          <button 
                            onClick={() => removeItem(item.product.id)}
                            className="text-xs text-zinc-500 hover:text-[#dc2626] transition-colors font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-6 flex items-center gap-2">
                  <button onClick={() => setShowAddressForm(false)} className="text-sm text-zinc-400 hover:text-white transition-colors">
                    ← Back to cart
                  </button>
                </div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" /> Shipping Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Phone Number</label>
                    <input 
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({...address, phone: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Street Address</label>
                    <input 
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({...address, street: e.target.value})}
                      className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      placeholder="123 Main St, Apt 4B"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">City</label>
                      <input 
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({...address, city: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        placeholder="Mumbai"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-1">Postal Code</label>
                      <input 
                        type="text"
                        value={address.zip}
                        onChange={(e) => setAddress({...address, zip: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                        placeholder="400001"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-[#1a1a1a] rounded-t-3xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-zinc-400">
                    <span>Subtotal:</span>
                    <span className="text-white">₹{getCartTotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-zinc-400">
                    <span>Delivery Fee:</span>
                    <span className="text-white">₹0</span>
                  </div>
                  <div className="h-px bg-white/5 my-2" />
                  <div className="flex justify-between items-end">
                    <span className="text-zinc-400">Total:</span>
                    <span className="text-2xl font-black text-white">₹{getCartTotal()}</span>
                  </div>
                </div>
                
                {!isLoaded ? (
                  <button disabled className="w-full bg-zinc-800 text-zinc-500 font-semibold py-4 rounded-full">Loading...</button>
                ) : !user ? (
                  <button
                    onClick={() => {
                      closeCart()
                      router.push('/login')
                    }}
                    className="w-full bg-white text-black hover:bg-zinc-200 font-semibold py-4 rounded-full transition-all flex items-center justify-center gap-2"
                  >
                    Login to Checkout
                  </button>
                ) : !showAddressForm ? (
                  <button
                    onClick={proceedToAddress}
                    className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold py-4 rounded-full transition-all shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)]"
                  >
                    Checkout
                  </button>
                ) : (
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold py-4 rounded-full transition-all shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isCheckingOut ? 'Redirecting...' : 'Place Order on WhatsApp'}
                  </button>
                )}
                
                {user && showAddressForm && (
                  <p className="text-xs text-center text-zinc-500 mt-4">
                    You will be redirected to WhatsApp to complete your purchase.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
