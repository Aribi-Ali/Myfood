'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, MapPin, Phone, Mail, Clock, Utensils, Snowflake } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import type { TemplateStore } from './types'
import { cn, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface ComponentProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

export function ArcticWhiteTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-arctic/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-white/90 backdrop-blur-md border-b border-[#e2e8f0]' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-[#0f172a] tracking-tight">{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#64748b] hover:text-[#0f172a] text-sm font-medium transition-colors duration-300">{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-[#0f172a] hover:bg-[#1e293b] text-white px-5 py-2.5 text-sm font-medium transition-all duration-300">
                <ShoppingBag size={16} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[#0f172a]"><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-white border-t border-[#e2e8f0] flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#64748b] hover:text-[#0f172a] text-sm font-medium">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-[#0f172a] text-white px-5 py-2.5 text-sm font-medium flex items-center justify-center gap-2"><ShoppingBag size={16} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc] via-white to-[#f1f5f9]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#38bdf8]/30 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-[#38bdf8] mb-6">
              <Snowflake size={16} />
              <span className="text-xs font-medium tracking-widest uppercase">Pure &amp; Simple</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] text-[#0f172a] mb-6 tracking-tight">{store.name}</h1>
            <div className="w-16 h-px bg-[#38bdf8] mx-auto mb-6" />
            <p className="text-lg md:text-xl text-[#64748b] mb-8 leading-relaxed max-w-lg mx-auto">{store.description || 'Clean. Fresh. Thoughtfully crafted. Scandinavian simplicity at its best.'}</p>
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-full px-4 py-2">
                <StarRating rating={store.avg_rating} size={16} activeColor="#38bdf8" inactiveColor="#e2e8f0" />
                <span className="text-[#0f172a] text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-[#94a3b8] text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={onShopNow} className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-8 py-4 text-sm font-medium tracking-wider transition-all duration-300 flex items-center gap-2">
                <ShoppingBag size={18} /> Order Now
              </button>
              <a href="#menu" className="border border-[#e2e8f0] text-[#64748b] hover:border-[#94a3b8] hover:text-[#0f172a] px-8 py-4 text-sm font-medium tracking-wider transition-all duration-300">Explore Menu</a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#38bdf8] text-xs font-medium tracking-widest uppercase block mb-3">Selection</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight">Our Menu</h2>
            <div className="w-12 h-px bg-[#e2e8f0] mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="group bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#38bdf8]/30 transition-all duration-500 overflow-hidden">
                <div className="relative h-44 overflow-hidden bg-[#f1f5f9]">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover transition-transform duration-700" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full"><Utensils className="w-8 h-8 text-[#cbd5e1]" /></div>
                  )}
                  {food.is_offer && <span className="absolute top-2 left-2 bg-[#38bdf8] text-white text-[10px] font-semibold px-2 py-0.5">Fresh</span>}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-[#0f172a] mb-1">{food.name}</h3>
                  {food.description && <p className="text-[#64748b] text-xs mb-3 line-clamp-1">{food.description}</p>}
                  <div className="flex items-center justify-between pt-3 border-t border-[#e2e8f0]">
                    <div>
                      <span className="text-[#0f172a] text-base font-bold">{formatFoodPrice(food, currency)}</span>
                      {food.new_price && <span className="text-[#94a3b8] text-xs line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>}
                    </div>
                    <button onClick={() => onAddToCart?.(food.id)} className="text-[#38bdf8] hover:text-[#0f172a] text-xs font-medium transition-colors duration-300 flex items-center gap-1">
                      <ShoppingBag size={13} /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-16 border border-dashed border-[#e2e8f0]"><Snowflake size={40} className="mx-auto mb-4 text-[#cbd5e1]" /><p className="text-[#94a3b8] text-sm">Our menu is being curated. Stay tuned.</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#38bdf8] text-xs font-medium tracking-widest uppercase block mb-3">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight">Reviews</h2>
            <div className="w-12 h-px bg-[#e2e8f0] mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {store.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-white border border-[#e2e8f0] p-6 hover:border-[#38bdf8]/20 transition-all duration-500">
                <StarRating rating={review.rating} size={13} activeColor="#38bdf8" inactiveColor="#e2e8f0" />
                <p className="text-[#475569] text-sm leading-relaxed mt-3 mb-4">&ldquo;{review.comment || 'Clean, fresh, and absolutely delicious. A minimalist\'s dream.'}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center">
                    <span className="text-[#64748b] text-xs font-semibold">{review.user.charAt(0)}</span>
                  </div>
                  <div><p className="text-[#0f172a] text-xs font-semibold">{review.user}</p><p className="text-[#94a3b8] text-[10px]">Verified</p></div>
                </div>
              </div>
            ))}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-[#e2e8f0] p-6">
                <StarRating rating={5} size={13} activeColor="#38bdf8" inactiveColor="#e2e8f0" />
                <p className="text-[#475569] text-sm leading-relaxed mt-3 mb-4">&ldquo;Clean, fresh, and absolutely delicious.&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center"><span className="text-[#64748b] text-xs font-semibold">G</span></div>
                  <div><p className="text-[#0f172a] text-xs font-semibold">Guest</p><p className="text-[#94a3b8] text-[10px]">Verified</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-16 bg-white border-y border-[#e2e8f0]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-2 mb-6 justify-center">
                <Clock size={16} className="text-[#38bdf8]" />
                <h3 className="text-[#0f172a] text-sm font-bold uppercase tracking-wider">Hours</h3>
              </div>
              <div className="border border-[#e2e8f0] divide-y divide-[#e2e8f0]">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-[#475569] text-xs capitalize">{day}</span>
                    <span className="text-[#0f172a] text-xs">{hrs.open} &mdash; {hrs.close}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#38bdf8] text-xs font-medium tracking-widest uppercase block mb-3">Contact</span>
            <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight">Get in Touch</h2>
            <div className="w-12 h-px bg-[#e2e8f0] mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {store.phone && (
              <div className="bg-white border border-[#e2e8f0] p-6 text-center hover:border-[#38bdf8]/30 transition-all duration-300">
                <Phone size={20} className="text-[#38bdf8] mx-auto mb-3" />
                <h3 className="text-[#0f172a] text-xs font-bold uppercase tracking-wider mb-1">Phone</h3>
                <a href={`tel:${store.phone}`} className="text-[#64748b] text-sm hover:text-[#0f172a] transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-white border border-[#e2e8f0] p-6 text-center hover:border-[#38bdf8]/30 transition-all duration-300">
                <Mail size={20} className="text-[#38bdf8] mx-auto mb-3" />
                <h3 className="text-[#0f172a] text-xs font-bold uppercase tracking-wider mb-1">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#64748b] text-sm hover:text-[#0f172a] transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-white border border-[#e2e8f0] p-6 text-center hover:border-[#38bdf8]/30 transition-all duration-300">
                <MapPin size={20} className="text-[#38bdf8] mx-auto mb-3" />
                <h3 className="text-[#0f172a] text-xs font-bold uppercase tracking-wider mb-1">Address</h3>
                <p className="text-[#64748b] text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-[#0f172a] font-bold text-lg tracking-tight">{store.name}</span>
            <div className="flex items-center gap-6">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#94a3b8] hover:text-[#0f172a] text-sm transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#e2e8f0] mt-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#94a3b8] text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-6"><a href="#" className="text-[#94a3b8] hover:text-[#0f172a] text-xs transition-colors">Privacy Policy</a><a href="#" className="text-[#94a3b8] hover:text-[#0f172a] text-xs transition-colors">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
