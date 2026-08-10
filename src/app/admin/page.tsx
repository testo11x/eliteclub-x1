'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Trash2, Plus, Image as ImageIcon, Video, MessageSquare, Users, Package, Power, Edit2, X, ShoppingCart, CheckCircle, XCircle, AlertTriangle, Tag, AlignLeft, IndianRupee, FolderTree, Key } from 'lucide-react'
import { adminResetPassword, adminGetCustomers, adminDeleteCustomer } from './actions'

// --- Custom Modal Components ---
function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", isDanger = false }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111111] border border-white/10 p-6 rounded-2xl max-w-md w-full shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          {isDanger && <AlertTriangle className="text-red-500 w-5 h-5" />}
          {title}
        </h3>
        <p className="text-zinc-400 mb-8">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className={`px-4 py-2 rounded-lg font-bold transition-colors ${isDanger ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-white text-black hover:bg-zinc-200'}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

function AlertModal({ isOpen, title, message, onClose, type = "success" }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111111] border border-white/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl text-center">
        <div className="flex justify-center mb-4">
          {type === 'success' ? (
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><CheckCircle className="w-6 h-6" /></div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500"><XCircle className="w-6 h-6" /></div>
          )}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-zinc-400 mb-6">{message}</p>
        <button onClick={onClose} className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-colors">
          Dismiss
        </button>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'messages' | 'customers'>('orders')
  
  // Data States
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal States
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {}, isDanger: false, confirmText: '' })
  const [alertState, setAlertState] = useState({ isOpen: false, title: '', message: '', type: 'success' })

  // Form State
  const [isUploading, setIsUploading] = useState(false)
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    type: 'accessory',
    category: 'General'
  })
  
  // Media States (0,1,2 are images, 3 is video)
  const [mediaFiles, setMediaFiles] = useState<(File | null)[]>([null, null, null, null])
  const [existingMedia, setExistingMedia] = useState<(string | null)[]>([null, null, null, null])

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    if (activeTab === 'orders') {
      const { data } = await supabase
        .from('orders')
        .select('*, profiles(name, email), order_items(*, products(name, type))')
        .order('created_at', { ascending: false })
      if (data) setOrders(data)
    } else if (activeTab === 'products') {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (data) setProducts(data)
    } else if (activeTab === 'messages') {
      const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
      if (data) setMessages(data)
    } else if (activeTab === 'customers') {
      const res = await adminGetCustomers()
      if (res.success) setCustomers(res.data)
    }
    setLoading(false)
  }

  const showAlert = (title: string, message: string, type: 'success' | 'error' = 'success') => {
    setAlertState({ isOpen: true, title, message, type })
  }

  const requestConfirm = (title: string, message: string, onConfirm: () => void, isDanger: boolean = false, confirmText = "Confirm") => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      isDanger,
      confirmText,
      onConfirm: () => {
        onConfirm()
        setConfirmState(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  // --- Order Handlers ---
  const handleApproveOrder = async (order: any) => {
    requestConfirm('Approve Order?', `Are you sure you want to approve order ${order.short_id}?`, async () => {
      await supabase.from('orders').update({ status: 'approved' }).eq('id', order.id)
      
      const hasMembership = order.order_items.some((item: any) => item.products.type === 'membership')
      if (hasMembership) {
        const membershipItem = order.order_items.find((item: any) => item.products.type === 'membership')
        const tierName = membershipItem.products.name.toLowerCase().replace(' ', '_').replace('++', '_plus').replace('+', '_plus')
        
        const validUntil = new Date()
        validUntil.setFullYear(validUntil.getFullYear() + 1)
        
        await supabase.from('profiles').update({
          membership_tier: tierName,
          membership_valid_until: validUntil.toISOString()
        }).eq('id', order.user_id)
        
        showAlert('Order Approved', `User granted ${membershipItem.products.name} valid until ${validUntil.toLocaleDateString()}.`)
      } else {
        showAlert('Order Approved', 'The order has been approved successfully.')
      }
      fetchData()
    }, false, "Approve Order")
  }

  const handleRejectOrder = (id: string) => {
    requestConfirm('Reject Order', 'Are you sure you want to reject this order?', async () => {
      await supabase.from('orders').update({ status: 'rejected' }).eq('id', id)
      fetchData()
    }, true, "Reject")
  }

  const handleDeleteOrder = (id: string) => {
    requestConfirm('Delete Order', 'Permanently delete this order record? This cannot be undone.', async () => {
      await supabase.from('orders').delete().eq('id', id)
      fetchData()
    }, true, "Delete")
  }

  // --- Product Handlers ---
  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Video is index 3
      if (index === 3) {
        // Check size (15MB = 15 * 1024 * 1024 bytes)
        if (file.size > 15 * 1024 * 1024) {
          showAlert('File Too Large', 'Video must be less than 15MB.', 'error')
          e.target.value = '' // Reset input
          return
        }
      }

      const newFiles = [...mediaFiles]
      newFiles[index] = file
      setMediaFiles(newFiles)
    }
  }

  const clearForm = () => {
    setEditingProductId(null)
    setFormData({ name: '', description: '', price: '', type: 'accessory', category: 'General' })
    setMediaFiles([null, null, null, null])
    setExistingMedia([null, null, null, null])
  }

  const handleEditClick = (product: any) => {
    setEditingProductId(product.id)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      type: product.type,
      category: product.category || 'General'
    })
    setExistingMedia([product.image_url, product.image_url_2, product.image_url_3, product.video_url])
    setMediaFiles([null, null, null, null])
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    try {
      const finalUrls = [...existingMedia]

      for (let i = 0; i < 4; i++) {
        if (mediaFiles[i]) {
          const file = mediaFiles[i]!
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file)
          if (uploadError) throw uploadError
          const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName)
          finalUrls[i] = publicUrl
        }
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        type: formData.type,
        category: formData.category,
        image_url: finalUrls[0],
        image_url_2: finalUrls[1],
        image_url_3: finalUrls[2],
        video_url: finalUrls[3],
        is_active: true
      }

      if (editingProductId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingProductId)
        if (error) throw error
        showAlert('Success', 'Product updated successfully!')
      } else {
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw error
        showAlert('Success', 'Product created successfully!')
      }

      clearForm()
      fetchData()
    } catch (err: any) {
      showAlert('Error', err.message, 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleToggleProduct = async (id: string, currentStatus: boolean) => {
    await supabase.from('products').update({ is_active: !currentStatus }).eq('id', id)
    fetchData()
  }

  const handleDeleteProduct = (id: string) => {
    requestConfirm('Delete Product', 'Are you sure you want to delete this product?', async () => {
      await supabase.from('products').delete().eq('id', id)
      fetchData()
    }, true, "Delete")
  }

  const handleDeleteMessage = (id: string) => {
    requestConfirm('Delete Message', 'Delete this message permanently?', async () => {
      await supabase.from('contact_messages').delete().eq('id', id)
      fetchData()
    }, true, "Delete")
  }

  const handleResetPassword = async (userId: string) => {
    requestConfirm(
      'Reset Password',
      'Are you sure you want to reset this user\'s password to "GermanGears123!"? They will be able to log in with this temporary password immediately.',
      async () => {
        setLoading(true)
        const res = await adminResetPassword(userId)
        setLoading(false)
        if (res.success) {
          showAlert('Password Reset', res.message, 'success')
        } else {
          showAlert('Reset Failed', res.message, 'error')
        }
      },
      true,
      "Reset to GermanGears123!"
    )
  }

  const handleDeleteCustomer = async (userId: string) => {
    requestConfirm(
      'Delete Customer',
      'Are you absolutely sure you want to permanently delete this customer? This action cannot be undone and will remove all their data and login access.',
      async () => {
        setLoading(true)
        const res = await adminDeleteCustomer(userId)
        setLoading(false)
        if (res.success) {
          showAlert('Customer Deleted', res.message, 'success')
          fetchData() // Refresh list
        } else {
          showAlert('Delete Failed', res.message, 'error')
        }
      },
      true,
      "Delete Permanently"
    )
  }

  const uniqueCategories = Array.from(new Set(products.filter(p => p.type === 'accessory' && p.category).map(p => p.category)))

  return (
    <div>
      <ConfirmModal 
        isOpen={confirmState.isOpen} 
        title={confirmState.title} 
        message={confirmState.message} 
        onConfirm={confirmState.onConfirm} 
        onCancel={() => setConfirmState(prev => ({...prev, isOpen: false}))}
        isDanger={confirmState.isDanger}
        confirmText={confirmState.confirmText}
      />
      <AlertModal 
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onClose={() => setAlertState(prev => ({...prev, isOpen: false}))}
      />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white/5 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
        >
          <ShoppingCart className="w-4 h-4" /> Orders
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'products' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
        >
          <Package className="w-4 h-4" /> Products
        </button>
        <button 
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'messages' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
        >
          <MessageSquare className="w-4 h-4" /> Inbox
        </button>
        <button 
          onClick={() => setActiveTab('customers')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'customers' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
        >
          <Users className="w-4 h-4" /> Customers
        </button>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-zinc-400">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loading ? <tr><td colSpan={6} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-500" /></td></tr> : 
                  orders.map(order => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-white">{order.short_id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{order.profiles?.name || 'Unknown'}</div>
                      <div className="text-zinc-500">{order.profiles?.email || 'No email'}</div>
                      <div className="text-zinc-600 text-xs mt-1 truncate max-w-[200px]">
                        {order.shipping_address?.street}, {order.shipping_address?.city}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ul className="text-zinc-300 text-xs space-y-1">
                        {order.order_items?.map((item: any) => (
                          <li key={item.id}>
                            <span className="font-bold">{item.quantity}x</span> {item.products?.name} 
                            {item.products?.type === 'membership' && <span className="text-red-400 ml-1">(VIP)</span>}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-white">₹{order.total_amount}</td>
                    <td className="px-6 py-4">
                      {order.status === 'pending' && <span className="bg-amber-500/20 text-amber-500 px-2 py-1 rounded font-bold uppercase text-[10px] tracking-wider">Pending</span>}
                      {order.status === 'approved' && <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded font-bold uppercase text-[10px] tracking-wider">Approved</span>}
                      {order.status === 'rejected' && <span className="bg-red-500/20 text-red-500 px-2 py-1 rounded font-bold uppercase text-[10px] tracking-wider">Rejected</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {order.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleApproveOrder(order)} className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors" title="Approve Payment">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleRejectOrder(order.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Reject Order">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                      {order.status !== 'pending' && (
                        <button onClick={() => handleDeleteOrder(order.id)} className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete Record">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && !loading && <tr><td colSpan={6} className="p-8 text-center text-zinc-500">No orders placed yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {editingProductId ? <Edit2 className="w-5 h-5 text-red-500" /> : <Plus className="w-5 h-5 text-red-500" />}
                {editingProductId ? 'Edit Product' : 'Add Product'}
              </h2>
              {editingProductId && (
                <button onClick={clearForm} className="text-zinc-400 hover:text-white text-sm flex items-center gap-1">
                  <X className="w-4 h-4" /> Cancel
                </button>
              )}
            </div>
            
            <form onSubmit={handleSaveProduct} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-zinc-300 mb-1.5">Product Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Tag className="h-4 w-4 text-zinc-500" />
                  </div>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all" placeholder="e.g. Carbon Fiber Spoiler" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-zinc-300 mb-1.5">Description</label>
                <div className="relative">
                  <div className="absolute top-3.5 left-0 pl-3.5 pointer-events-none">
                    <AlignLeft className="h-4 w-4 text-zinc-500" />
                  </div>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none min-h-[100px] resize-y transition-all" placeholder="Detailed product description..." />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-1.5">Price (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <IndianRupee className="h-4 w-4 text-zinc-500" />
                    </div>
                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all" placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-1.5">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all appearance-none cursor-pointer">
                    <option value="accessory">Accessory</option>
                    <option value="membership">Membership</option>
                  </select>
                </div>
              </div>

              {formData.type === 'accessory' && (
                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-1.5">Subcategory</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <FolderTree className="h-4 w-4 text-zinc-500" />
                    </div>
                    <input 
                      type="text" 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})} 
                      onFocus={() => setShowCategorySuggestions(true)}
                      onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 200)}
                      className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all" 
                      placeholder="e.g. Interior" 
                    />
                    
                    {showCategorySuggestions && uniqueCategories.filter(c => c.toLowerCase().includes(formData.category.toLowerCase())).length > 0 && (
                      <div className="absolute top-[110%] left-0 right-0 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl max-h-48 overflow-y-auto">
                        {uniqueCategories
                          .filter(c => c.toLowerCase().includes(formData.category.toLowerCase()))
                          .map((cat, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => { setFormData({...formData, category: cat}); setShowCategorySuggestions(false); }}
                            className="px-4 py-3 hover:bg-white/10 cursor-pointer text-white text-sm transition-colors border-b border-white/5 last:border-0"
                          >
                            {cat}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1.5 ml-1">Type anything to auto-create a category tab on the Shop page.</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Media (Images & Video)</label>
                <div className="grid grid-cols-4 gap-2">
                  {/* Video Slot */}
                  <div className="col-span-4 mb-2 aspect-[2/1] border border-dashed border-white/20 rounded-lg relative overflow-hidden group/img bg-black/50 hover:border-red-500/50 transition-colors">
                    <input type="file" accept="video/mp4,video/webm" onChange={(e) => handleFileChange(3, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                    
                    {mediaFiles[3] ? (
                      <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-xs text-green-400 font-bold bg-green-500/10 z-10">
                        Ready to upload video
                      </div>
                    ) : existingMedia[3] ? (
                      <video src={existingMedia[3]!} className="w-full h-full object-cover opacity-60 group-hover/img:opacity-30 transition-opacity" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
                        <Video className="w-6 h-6 mb-2" />
                        <span className="text-xs font-bold">Add Video</span>
                        <span className="text-[10px]">(Max 15MB)</span>
                      </div>
                    )}
                  </div>

                  {/* Image Slots */}
                  {[0, 1, 2].map(index => (
                    <div key={index} className="aspect-square border border-dashed border-white/20 rounded-lg relative overflow-hidden group/img bg-black/50 hover:border-red-500/50 transition-colors">
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(index, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                      
                      {mediaFiles[index] ? (
                        <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-[10px] text-green-400 font-bold bg-green-500/10 z-10">
                          Ready
                        </div>
                      ) : existingMedia[index] ? (
                        <img src={existingMedia[index]!} className="w-full h-full object-cover opacity-60 group-hover/img:opacity-30 transition-opacity" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
                          <Plus className="w-4 h-4 mb-1" />
                          <span className="text-[10px]">Img {index + 1}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={isUploading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center mt-6 disabled:opacity-50">
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingProductId ? 'Update Product' : 'Create Product')}
              </button>
            </form>
          </div>
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl overflow-hidden min-w-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-white/5 text-zinc-400">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {loading ? <tr><td colSpan={4} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-500" /></td></tr> : 
                    products.map(p => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {p.image_url ? <img src={p.image_url} className="w-10 h-10 rounded object-cover bg-black" /> : <div className="w-10 h-10 rounded bg-black flex items-center justify-center"><ImageIcon className="w-5 h-5 text-zinc-600" /></div>}
                          <div>
                            <div className="font-bold text-white max-w-[200px] truncate">{p.name}</div>
                            <div className="text-zinc-500 truncate max-w-[200px] flex gap-2">
                              <span className="capitalize">{p.type}</span>
                              {p.type === 'accessory' && p.category && (
                                <span className="bg-white/10 px-1.5 rounded text-[10px] text-zinc-300">{p.category}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleToggleProduct(p.id, p.is_active)} className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg whitespace-nowrap ${p.is_active ? 'bg-green-500 text-black shadow-green-500/20 hover:bg-green-400' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-white line-through'}`}>
                          <Power className="w-3 h-3" /> {p.is_active ? 'Active' : 'Offline'}
                        </button>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold">₹{p.price}</td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                        <button onClick={() => handleEditClick(p)} className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-white/10"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-zinc-500 hover:text-red-500 rounded-lg hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden min-w-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[800px]">
              <thead className="bg-white/5 text-zinc-400">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loading ? <tr><td colSpan={4} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-500" /></td></tr> : 
                  messages.map(m => (
                  <tr key={m.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 text-zinc-400 whitespace-nowrap">{new Date(m.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white whitespace-nowrap">{m.first_name} {m.last_name}</div>
                      <div className="text-zinc-500">{m.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-zinc-300 mb-1">{m.subject}</div>
                      <div className="text-zinc-500 text-sm max-w-md">{m.message}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDeleteMessage(m.id)} className="p-2 text-zinc-500 hover:text-red-500 rounded-lg hover:bg-red-500/10"><Trash2 className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
                {messages.length === 0 && !loading && <tr><td colSpan={4} className="p-8 text-center text-zinc-500">Inbox is empty.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CUSTOMERS TAB */}
      {activeTab === 'customers' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden min-w-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="bg-white/5 text-zinc-400">
                <tr>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Tier & Expiry</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loading ? <tr><td colSpan={4} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-500" /></td></tr> : 
                  customers.map(c => (
                  <tr key={c.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 text-zinc-400 whitespace-nowrap">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold text-white whitespace-nowrap">{c.name || 'Anonymous'}</td>
                    <td className="px-6 py-4 text-zinc-400">{c.email || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase whitespace-nowrap ${c.membership_tier !== 'none' ? 'bg-red-500/20 text-red-500' : 'bg-zinc-800 text-zinc-500'}`}>
                          {c.membership_tier.replace('_', ' ')}
                        </span>
                        {c.membership_valid_until && (
                          <span className={`text-[10px] whitespace-nowrap ${new Date(c.membership_valid_until) < new Date() ? 'text-red-500 font-bold' : 'text-zinc-500'}`}>
                            {new Date(c.membership_valid_until) < new Date() ? 'Expired on ' : 'Valid till '}
                            {new Date(c.membership_valid_until).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleResetPassword(c.id)} 
                        title="Reset Password"
                        className="px-3 py-1.5 text-zinc-400 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all inline-flex items-center gap-2 whitespace-nowrap shadow-md text-xs font-bold uppercase tracking-wider"
                      >
                        <Key className="w-3.5 h-3.5 text-zinc-500" /> Reset Password
                      </button>
                      <button 
                        onClick={() => handleDeleteCustomer(c.id)} 
                        title="Delete Customer"
                        className="p-2 text-zinc-500 hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && !loading && <tr><td colSpan={5} className="p-8 text-center text-zinc-500">No registered customers yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
