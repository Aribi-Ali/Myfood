'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, MapPin, Phone, Mail, Clock, Utensils, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import type { TemplateStore } from './types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface ComponentProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

export function MidnightSushiTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-midnight/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  const categories = [...new Set(store.foods.map((f) => f.category?.name || 'All').filter(Boolean))]
  const [activeCat, setActiveCat] = useState('All')

  const filteredFoods = activeCat === 'All' ? store.foods : store.foods.filter((f) => f.category?.name === activeCat)

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-[#0f172a]/95 backdrop-blur-md border-b border-[#06b6d4]/20' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <span className="text-[#06b6d4] text-2xl font-black tracking-tighter">{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#94a3b8] hover:text-[#06b6d4] text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-300">{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-[#f43f5e] hover:bg-[#e11d48] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#f43f5e]/20">
                <ShoppingBag size={14} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[#f8fafc]"><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-[#1e293b] border-t border-[#06b6d4]/10 flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#94a3b8] hover:text-[#06b6d4] text-xs tracking-[0.2em] uppercase font-medium">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-[#f43f5e] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"><ShoppingBag size={14} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt={store.name} className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-transparent" />
        </div>
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 border border-[#06b6d4]/30 px-4 py-1.5 mb-6">
              <Zap size={14} className="text-[#06b6d4]" />
              <span className="text-[#06b6d4] text-xs tracking-[0.25em] uppercase font-medium">Midnight Collection</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1] text-[#f8fafc] mb-6 tracking-tight">{store.name}</h1>
            <p className="text-lg md:text-xl text-[#94a3b8] mb-8 leading-relaxed">{store.description || 'Precision. Freshness. Art. Experience the finest cuts.'}</p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-[#1e293b] border border-[#06b6d4]/20 px-4 py-2">
                <StarRating rating={store.avg_rating} size={14} activeColor="#06b6d4" inactiveColor="#1e293b" />
                <span className="text-[#f8fafc] text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-[#64748b] text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="bg-[#f43f5e] hover:bg-[#e11d48] text-white px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#f43f5e]/30">
                <ShoppingBag size={18} /> Order Now
              </button>
              <a href="#menu" className="border border-[#06b6d4] text-[#06b6d4] hover:bg-[#06b6d4]/10 px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300">View Menu</a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-6 mb-12 overflow-x-auto pb-2 scrollbar-thin">
            <button onClick={() => setActiveCat('All')} className={cn('whitespace-nowrap px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 border', activeCat === 'All' ? 'bg-[#06b6d4] text-[#0f172a] border-[#06b6d4]' : 'border-[#1e293b] text-[#64748b] hover:text-[#f8fafc] hover:border-[#06b6d4]/30')}>All</button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCat(cat)} className={cn('whitespace-nowrap px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 border', activeCat === cat ? 'bg-[#06b6d4] text-[#0f172a] border-[#06b6d4]' : 'border-[#1e293b] text-[#64748b] hover:text-[#f8fafc] hover:border-[#06b6d4]/30')}>{cat}</button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFoods.slice(0, 8).map((food) => (
              <div key={food.id} className="group bg-[#1e293b] border border-[#1e293b] hover:border-[#06b6d4]/40 transition-all duration-500 relative overflow-hidden">
                <div className="relative h-44 overflow-hidden">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-[#0f172a]"><Utensils className="w-8 h-8 text-[#06b6d4]/30" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                  {food.is_offer && <span className="absolute top-2 right-2 bg-[#f43f5e] text-white text-[10px] font-bold px-2 py-0.5">DEAL</span>}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-[#f8fafc] mb-1">{food.name}</h3>
                  {food.description && <p className="text-[#64748b] text-xs mb-3 line-clamp-1">{food.description}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#06b6d4] text-sm font-bold">{formatFoodPrice(food, currency)}</span>
                      {food.new_price && <span className="text-[#64748b] text-xs line-through ml-1">{formatFoodPrice(food, currency, { original: true })}</span>}
                    </div>
                    <button onClick={() => onAddToCart?.(food.id)} className="bg-[#06b6d4]/10 hover:bg-[#06b6d4] text-[#06b6d4] hover:text-[#0f172a] px-3 py-1.5 text-xs font-bold transition-all duration-300 border border-[#06b6d4]/30">
                      +Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredFoods.length === 0 && (
            <div className="text-center py-16 border border-dashed border-[#06b6d4]/20"><Zap size={48} className="mx-auto mb-4 text-[#06b6d4]/30" /><p className="text-[#64748b]">No items in this category.</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-[#0f172a] border-t border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#f43f5e] text-xs tracking-[0.25em] uppercase font-bold block mb-3">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#f8fafc]">Guest Impressions</h2>
            <div className="w-12 h-0.5 bg-[#06b6d4] mx-auto mt-6" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {store.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-[#1e293b]/60 backdrop-blur-sm border border-[#1e293b] hover:border-[#06b6d4]/20 transition-all duration-500 p-6">
                <StarRating rating={review.rating} size={12} activeColor="#06b6d4" inactiveColor="#1e293b" />
                <p className="text-[#94a3b8] text-sm leading-relaxed mt-3 mb-4">&ldquo;{review.comment || 'Exceptional quality and presentation. A truly modern dining experience.'}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0f172a] border border-[#06b6d4]/20 flex items-center justify-center">
                    <span className="text-[#06b6d4] text-xs font-bold">{review.user.charAt(0)}</span>
                  </div>
                  <div><p className="text-[#f8fafc] text-xs font-semibold">{review.user}</p><p className="text-[#64748b] text-[10px]">Verified</p></div>
                </div>
              </div>
            ))}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-[#1e293b]/60 backdrop-blur-sm border border-[#1e293b] p-6">
                <StarRating rating={5} size={12} activeColor="#06b6d4" inactiveColor="#1e293b" />
                <p className="text-[#94a3b8] text-sm leading-relaxed mt-3 mb-4">&ldquo;Exceptional quality and presentation. A truly modern dining experience.&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0f172a] border border-[#06b6d4]/20 flex items-center justify-center"><span className="text-[#06b6d4] text-xs font-bold">G</span></div>
                  <div><p className="text-[#f8fafc] text-xs font-semibold">Guest</p><p className="text-[#64748b] text-[10px]">Verified</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-16 bg-[#0f172a] border-t border-[#1e293b]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto bg-[#1e293b] border border-[#06b6d4]/10 p-6">
              <div className="flex items-center gap-3 mb-6 justify-center border-b border-[#06b6d4]/10 pb-4">
                <Clock size={16} className="text-[#06b6d4]" />
                <h3 className="text-[#f8fafc] text-sm font-bold uppercase tracking-wider">Hours</h3>
              </div>
              <div className="space-y-2">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between py-1.5 border-b border-[#1e293b] last:border-b-0">
                    <span className="text-[#94a3b8] text-xs uppercase tracking-wider font-medium">{day}</span>
                    <span className="text-[#06b6d4] text-xs font-mono">{hrs.open} &mdash; {hrs.close}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-20 bg-[#0f172a] border-t border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#06b6d4] text-xs tracking-[0.25em] uppercase font-bold block mb-3">Connect</span>
            <h2 className="text-4xl font-black text-[#f8fafc]">Contact</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {store.phone && (
              <div className="bg-[#1e293b] border border-[#1e293b] hover:border-[#06b6d4]/20 p-6 text-center transition-all duration-300">
                <Phone size={20} className="text-[#06b6d4] mx-auto mb-3" />
                <h3 className="text-[#f8fafc] text-xs font-bold uppercase tracking-wider mb-1">Phone</h3>
                <a href={`tel:${store.phone}`} className="text-[#94a3b8] text-xs hover:text-[#06b6d4] transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-[#1e293b] border border-[#1e293b] hover:border-[#06b6d4]/20 p-6 text-center transition-all duration-300">
                <Mail size={20} className="text-[#06b6d4] mx-auto mb-3" />
                <h3 className="text-[#f8fafc] text-xs font-bold uppercase tracking-wider mb-1">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#94a3b8] text-xs hover:text-[#06b6d4] transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-[#1e293b] border border-[#1e293b] hover:border-[#06b6d4]/20 p-6 text-center transition-all duration-300">
                <MapPin size={20} className="text-[#06b6d4] mx-auto mb-3" />
                <h3 className="text-[#f8fafc] text-xs font-bold uppercase tracking-wider mb-1">Address</h3>
                <p className="text-[#94a3b8] text-xs">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#0f172a] border-t border-[#06b6d4]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-[#f8fafc] font-black text-lg tracking-tight">{store.name}</span>
            <div className="flex items-center gap-6">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#64748b] hover:text-[#06b6d4] text-xs uppercase tracking-wider transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#06b6d4]/5 mt-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#475569] text-[10px] uppercase tracking-wider">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-6"><a href="#" className="text-[#475569] hover:text-[#06b6d4] text-[10px] uppercase tracking-wider transition-colors">Privacy</a><a href="#" className="text-[#475569] hover:text-[#06b6d4] text-[10px] uppercase tracking-wider transition-colors">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
