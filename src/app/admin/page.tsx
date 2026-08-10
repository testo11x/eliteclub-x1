'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Trash2, Plus, Image as ImageIcon, MessageSquare, Users, Package, Power } from 'lucide-react'

export default function AdminDashboard() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<'products' | 'messages' | 'customers'>('products')
  
  // Data States
  const [products, setProducts] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form State
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    type: 'accessory'
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    if (activeTab === 'products') {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (data) setProducts(data)
    } else if (activeTab === 'messages') {
      const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
      if (data) setMessages(data)
    } else if (activeTab === 'customers') {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      if (data) setCustomers(data)
    }
    setLoading(false)
  }

  // --- Product Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0])
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    try {
      let imageUrl = null
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile)
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName)
        imageUrl = publicUrl
      }

      const { error } = await supabase.from('products').insert({
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        type: formData.type,
        image_url: imageUrl,
        is_active: true
      })
      if (error) throw error

      setFormData({ name: '', description: '', price: '', type: 'accessory' })
      setImageFile(null)
      fetchData()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleToggleProduct = async (id: string, currentStatus: boolean) => {
    await supabase.from('products').update({ is_active: !currentStatus }).eq('id', id)
    fetchData()
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product permanently?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchData()
  }

  // --- Message Handlers ---
  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return
    await supabase.from('contact_messages').delete().eq('id', id)
    fetchData()
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex space-x-2 mb-8 bg-white/5 p-1 rounded-xl w-fit">
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

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-red-500" /> Add Product
            </h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Product Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-red-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-red-500 outline-none h-24 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Price (₹)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-red-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-red-500 outline-none">
                    <option value="accessory">Accessory</option>
                    <option value="membership">Membership</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Image</label>
                <div className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center hover:border-red-500/50 cursor-pointer relative">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <ImageIcon className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                  <span className="text-sm text-zinc-400">{imageFile ? imageFile.name : 'Upload image'}</span>
                </div>
              </div>
              <button type="submit" disabled={isUploading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center disabled:opacity-50">
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Product'}
              </button>
            </form>
          </div>
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
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
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="text-zinc-500 truncate max-w-[200px]">{p.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleToggleProduct(p.id, p.is_active)} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${p.is_active ? 'bg-green-500/20 text-green-500' : 'bg-zinc-500/20 text-zinc-500'}`}>
                        <Power className="w-3 h-3" /> {p.is_active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold">₹{p.price}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-zinc-500 hover:text-red-500 rounded-lg hover:bg-red-500/10"><Trash2 className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
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
                    <div className="font-bold text-white">{m.first_name} {m.last_name}</div>
                    <div className="text-zinc-500">{m.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-zinc-300 mb-1">{m.subject}</div>
                    <div className="text-zinc-500 text-sm">{m.message}</div>
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
      )}

      {/* CUSTOMERS TAB */}
      {activeTab === 'customers' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-zinc-400">
              <tr>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? <tr><td colSpan={4} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-500" /></td></tr> : 
                customers.map(c => (
                <tr key={c.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-zinc-400">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-white">{c.name || 'Anonymous'}</td>
                  <td className="px-6 py-4 text-zinc-400">{c.email || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 font-bold uppercase text-xs">
                      {c.membership_tier.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && !loading && <tr><td colSpan={4} className="p-8 text-center text-zinc-500">No registered customers yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
