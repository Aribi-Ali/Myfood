'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, Zap, MapPin, Phone, Mail, Clock, Utensils, Monitor } from 'lucide-react'
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

export function NeonPulseTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-neon/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e0e0e0]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-[#06b6d4]/20' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Zap size={22} className="text-[#06b6d4] drop-shadow-[0_0_8px_#06b6d4]" />
              <span className="text-lg font-bold bg-gradient-to-r from-[#06b6d4] to-[#d946ef] bg-clip-text text-transparent">{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#a0a0b0] hover:text-[#06b6d4] text-sm font-medium transition-colors duration-300">{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#06b6d4] via-[#8b5cf6] to-[#d946ef] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#06b6d4]/30">
                <ShoppingBag size={16} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[#a0a0b0]"><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-[#0f0f1a] border-t border-[#06b6d4]/20 flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#a0a0b0] hover:text-[#06b6d4] text-sm font-medium">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-gradient-to-r from-[#06b6d4] via-[#8b5cf6] to-[#d946ef] text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"><ShoppingBag size={16} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0f]" />
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(6,182,212,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(217,70,239,0.15) 0%, transparent 50%), radial-gradient(circle at 50% 100%, rgba(139,92,246,0.1) 0%, transparent 40%)' }} />
        {heroBg && <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 border border-[#06b6d4]/30 bg-[#06b6d4]/5 px-4 py-1.5 rounded-lg mb-6">
              <Monitor size={14} className="text-[#06b6d4]" />
              <span className="text-[#06b6d4] text-xs font-bold tracking-widest uppercase">Neon Pulse</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.0] text-white mb-6">{store.name}</h1>
            <p className="text-lg md:text-xl text-[#a0a0b0] mb-8 leading-relaxed">{store.description || 'Cyberpunk cuisine. Electrify your taste buds.'}</p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-[#0f0f1a] rounded-lg px-4 py-2 border border-[#06b6d4]/30">
                <StarRating rating={store.avg_rating} size={16} activeColor="#06b6d4" inactiveColor="#2d1b4e" />
                <span className="text-[#06b6d4] text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-[#a0a0b0]/50 text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="bg-gradient-to-r from-[#06b6d4] via-[#8b5cf6] to-[#d946ef] text-white px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-2xl hover:shadow-[#06b6d4]/30 hover:scale-105 flex items-center gap-2">
                <Zap size={18} /> Order Now
              </button>
              <a href="#menu" className="border border-[#06b6d4]/40 text-[#06b6d4] hover:bg-[#06b6d4]/10 px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300">View Menu</a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24 bg-[#0f0f1a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#06b6d4] text-sm font-bold tracking-widest uppercase block mb-3 drop-shadow-[0_0_4px_#06b6d4]">Digital Menu</span>
            <h2 className="text-4xl md:text-5xl font-black text-white">Neon Selections</h2>
            <div className="flex items-center justify-center gap-1 mt-6"><span className="w-2 h-2 rounded-full bg-[#06b6d4] shadow-[0_0_6px_#06b6d4]" /><span className="w-2 h-2 rounded-full bg-[#8b5cf6] shadow-[0_0_6px_#8b5cf6]" /><span className="w-2 h-2 rounded-full bg-[#d946ef] shadow-[0_0_6px_#d946ef]" /></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="group bg-[#0a0a0f] rounded-xl overflow-hidden border border-[#1a1a2e] hover:border-[#06b6d4]/40 transition-all duration-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                <div className="relative h-52 overflow-hidden">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-[#0f0f1a]"><Utensils className="w-10 h-10 text-[#06b6d4]/30" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                  {food.is_offer && <span className="absolute top-3 right-3 bg-gradient-to-r from-[#06b6d4] to-[#d946ef] text-white text-xs font-bold px-3 py-1 rounded-lg">NEON DEAL</span>}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">{food.name}</h3>
                  {food.description && <p className="text-[#a0a0b0]/70 text-sm mb-4 line-clamp-2">{food.description}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#06b6d4] text-lg font-bold">{formatFoodPrice(food, currency)}</span>
                      {food.new_price && <span className="text-[#a0a0b0]/30 text-sm line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>}
                    </div>
                    <button onClick={() => onAddToCart?.(food.id)} className="bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#06b6d4]/20 flex items-center gap-1">
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                  {food.cooking_time && <div className="flex items-center gap-1 mt-3 text-[#a0a0b0]/40 text-xs"><Clock size={12} /> {food.cooking_time} min</div>}
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-16"><Zap size={48} className="mx-auto mb-4 text-[#06b6d4]/50" /><p className="text-[#a0a0b0]/50 text-lg">Our neon menu is being upgraded. Stand by.</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#d946ef] text-sm font-bold tracking-widest uppercase block mb-3">Feedback Stream</span>
            <h2 className="text-4xl md:text-5xl font-black text-white">User Reviews</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-[#0f0f1a] rounded-xl p-8 border border-[#1a1a2e] hover:border-[#d946ef]/30 transition-all duration-500">
                <StarRating rating={review.rating} size={16} activeColor="#06b6d4" inactiveColor="#2d1b4e" />
                <p className="text-[#a0a0b0]/80 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;{review.comment || 'Mind-blowing flavors! The neon vibe is unmatched.'}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#06b6d4] to-[#d946ef] flex items-center justify-center"><span className="text-white text-sm font-bold">{review.user.charAt(0)}</span></div>
                  <div><p className="text-white text-sm font-semibold">{review.user}</p><p className="text-[#a0a0b0]/50 text-xs">Verified Guest</p></div>
                </div>
              </div>
            ))}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-[#0f0f1a] rounded-xl p-8 border border-[#1a1a2e]">
                <StarRating rating={5} size={16} activeColor="#06b6d4" inactiveColor="#2d1b4e" />
                <p className="text-[#a0a0b0]/80 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;Mind-blowing flavors! The neon vibe is unmatched.&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#06b6d4] to-[#d946ef] flex items-center justify-center"><span className="text-white text-sm font-bold">N</span></div>
                  <div><p className="text-white text-sm font-semibold">Neon Rider</p><p className="text-[#a0a0b0]/50 text-xs">Verified</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-16 bg-[#0f0f1a] border-y border-[#1a1a2e]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto bg-[#0a0a0f] rounded-xl p-8 border border-[#1a1a2e]">
              <div className="flex items-center gap-3 mb-6 justify-center">
                <Clock size={20} className="text-[#06b6d4]" />
                <h3 className="text-white text-lg font-bold">Operating Hours</h3>
              </div>
              <div className="space-y-2">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-[#1a1a2e] last:border-b-0">
                    <span className="text-[#a0a0b0] font-medium capitalize text-sm">{day}</span>
                    <span className="text-[#06b6d4] text-sm">{hrs.open} &mdash; {hrs.close}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-20 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#8b5cf6] text-sm font-bold tracking-widest uppercase block mb-3">Connect</span>
            <h2 className="text-4xl font-black text-white">Drop a Signal</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {store.phone && (
              <div className="bg-[#0f0f1a] rounded-xl p-8 text-center border border-[#1a1a2e] hover:border-[#06b6d4]/40 transition-all duration-300">
                <Phone size={22} className="text-[#06b6d4] mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2 text-sm">Call</h3>
                <a href={`tel:${store.phone}`} className="text-[#a0a0b0]/70 hover:text-[#06b6d4] text-sm transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-[#0f0f1a] rounded-xl p-8 text-center border border-[#1a1a2e] hover:border-[#06b6d4]/40 transition-all duration-300">
                <Mail size={22} className="text-[#06b6d4] mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2 text-sm">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#a0a0b0]/70 hover:text-[#06b6d4] text-sm transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-[#0f0f1a] rounded-xl p-8 text-center border border-[#1a1a2e] hover:border-[#06b6d4]/40 transition-all duration-300">
                <MapPin size={22} className="text-[#06b6d4] mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2 text-sm">Address</h3>
                <p className="text-[#a0a0b0]/70 text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#0f0f1a] border-t border-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-[#06b6d4]" />
              <span className="text-white font-bold text-lg">{store.name}</span>
            </div>
            <div className="flex items-center gap-6">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#a0a0b0]/50 hover:text-[#06b6d4] text-sm transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#1a1a2e] mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#a0a0b0]/30 text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-6"><a href="#" className="text-[#a0a0b0]/30 hover:text-[#06b6d4] text-xs transition-colors">Privacy</a><a href="#" className="text-[#a0a0b0]/30 hover:text-[#06b6d4] text-xs transition-colors">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
