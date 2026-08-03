'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, Flower2, MapPin, Phone, Mail, Clock, Utensils, LucideDiamond } from 'lucide-react'
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

export function DesertRoseTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-desert/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  return (
    <div className="min-h-screen bg-[#fdf6f0] text-[#3a2a1a]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-[#fdf6f0]/95 backdrop-blur-lg shadow-sm' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Flower2 size={20} className="text-[#e07a5f]" />
              <span className="text-lg font-bold text-[#3a2a1a]">{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#8b6f5e]/70 hover:text-[#e07a5f] text-sm font-medium transition-colors duration-300">{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-[#e07a5f] hover:bg-[#c96a50] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg shadow-[#e07a5f]/20">
                <ShoppingBag size={16} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[#3a2a1a]"><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-[#fdf6f0] border-t border-[#e07a5f]/10 flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#8b6f5e]/70 hover:text-[#e07a5f] text-sm font-medium">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-[#e07a5f] text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"><ShoppingBag size={16} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt={store.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#3a2a1a]/80 via-[#e07a5f]/60 to-[#3a2a1a]/85" />
        </div>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 0v40M0 20h40\' stroke=\'%23e07a5f\' stroke-width=\'0.5\' fill=\'none\'/%3E%3C/svg%3E")' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <span className="text-[#f4d4c0] text-sm font-semibold tracking-widest uppercase block mb-4">Desert Rose &middot; Arabian Nights</span>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] text-white mb-6">{store.name}</h1>
            <p className="text-lg md:text-xl text-[#f4d4c0]/80 mb-8 leading-relaxed">{store.description || 'A taste of the Orient. Exotic spices, warm hospitality.'}</p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-[#3a2a1a]/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-[#e07a5f]/40">
                <StarRating rating={store.avg_rating} size={16} activeColor="#e07a5f" inactiveColor="#f4d4c0" />
                <span className="text-white text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-[#f4d4c0]/60 text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="bg-[#e07a5f] hover:bg-[#c96a50] text-white px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-2xl hover:shadow-[#e07a5f]/40 hover:scale-105 flex items-center gap-2">
                <ShoppingBag size={18} /> Order Now
              </button>
              <a href="#menu" className="border-2 border-[#f4d4c0]/50 text-[#f4d4c0] hover:bg-[#f4d4c0]/10 px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300">Explore Menu</a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#e07a5f] text-sm font-semibold tracking-widest uppercase block mb-3">Arabian Flavors</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#3a2a1a]">Exotic Selections</h2>
            <div className="w-20 h-0.5 bg-[#e07a5f] mx-auto mt-6" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="group bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#f4d4c0] hover:border-[#e07a5f]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#e07a5f]/10">
                <div className="relative h-52 overflow-hidden">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover transition-transform duration-700" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-[#fdf6f0]"><Utensils className="w-10 h-10 text-[#e07a5f]/40" /></div>
                  )}
                  {food.is_offer && <span className="absolute top-3 right-3 bg-[#e07a5f] text-white text-xs font-bold px-3 py-1 rounded-lg">Rose Selection</span>}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#3a2a1a] mb-2">{food.name}</h3>
                  {food.description && <p className="text-[#8b6f5e]/60 text-sm mb-4 line-clamp-2">{food.description}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#e07a5f] text-lg font-bold">{formatFoodPrice(food, currency)}</span>
                      {food.new_price && <span className="text-[#8b6f5e]/40 text-sm line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>}
                    </div>
                    <button onClick={() => onAddToCart?.(food.id)} className="bg-[#e07a5f] hover:bg-[#c96a50] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-1">
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                  {food.cooking_time && <div className="flex items-center gap-1 mt-3 text-[#8b6f5e]/50 text-xs"><Clock size={12} /> {food.cooking_time} min</div>}
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-16"><Flower2 size={48} className="mx-auto mb-4 text-[#e07a5f]/50" /><p className="text-[#8b6f5e]/50 text-lg">Our desert menu is blooming with flavors.</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-[#fdf6f0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#e07a5f] text-sm font-semibold tracking-widest uppercase block mb-3">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#3a2a1a]">Voices of the Desert</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-white rounded-2xl p-8 border border-[#f4d4c0] hover:border-[#e07a5f]/30 transition-all duration-500">
                <StarRating rating={review.rating} size={16} activeColor="#e07a5f" inactiveColor="#f4d4c0" />
                <p className="text-[#8b6f5e]/80 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;{review.comment || 'Exotic and enchanting. The spices transported me to another world.'}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fdf6f0] border border-[#e07a5f]/30 flex items-center justify-center"><span className="text-[#e07a5f] text-sm font-bold">{review.user.charAt(0)}</span></div>
                  <div><p className="text-[#3a2a1a] text-sm font-semibold">{review.user}</p><p className="text-[#8b6f5e]/50 text-xs">Verified Guest</p></div>
                </div>
              </div>
            ))}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-[#f4d4c0]">
                <StarRating rating={5} size={16} activeColor="#e07a5f" inactiveColor="#f4d4c0" />
                <p className="text-[#8b6f5e]/80 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;Exotic and enchanting. The spices transported me to another world.&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fdf6f0] border border-[#e07a5f]/30 flex items-center justify-center"><span className="text-[#e07a5f] text-sm font-bold">T</span></div>
                  <div><p className="text-[#3a2a1a] text-sm font-semibold">Traveler</p><p className="text-[#8b6f5e]/50 text-xs">Verified</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto bg-[#fdf6f0] rounded-2xl p-8 border border-[#f4d4c0]">
              <div className="flex items-center gap-3 mb-6 justify-center">
                <Clock size={20} className="text-[#e07a5f]" />
                <h3 className="text-[#3a2a1a] text-lg font-bold">Opening Hours</h3>
              </div>
              <div className="space-y-2">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-[#f4d4c0]/50 last:border-b-0">
                    <span className="text-[#8b6f5e] font-medium capitalize text-sm">{day}</span>
                    <span className="text-[#e07a5f] text-sm">{hrs.open} &mdash; {hrs.close}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-20 bg-[#fdf6f0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#e07a5f] text-sm font-semibold tracking-widest uppercase block mb-3">Reach Out</span>
            <h2 className="text-4xl font-bold text-[#3a2a1a]">Connect with Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {store.phone && (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#f4d4c0] hover:border-[#e07a5f]/40 transition-all duration-300">
                <Phone size={22} className="text-[#e07a5f] mx-auto mb-4" />
                <h3 className="text-[#3a2a1a] font-semibold mb-2 text-sm">Call</h3>
                <a href={`tel:${store.phone}`} className="text-[#8b6f5e]/70 hover:text-[#e07a5f] text-sm transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#f4d4c0] hover:border-[#e07a5f]/40 transition-all duration-300">
                <Mail size={22} className="text-[#e07a5f] mx-auto mb-4" />
                <h3 className="text-[#3a2a1a] font-semibold mb-2 text-sm">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#8b6f5e]/70 hover:text-[#e07a5f] text-sm transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#f4d4c0] hover:border-[#e07a5f]/40 transition-all duration-300">
                <MapPin size={22} className="text-[#e07a5f] mx-auto mb-4" />
                <h3 className="text-[#3a2a1a] font-semibold mb-2 text-sm">Address</h3>
                <p className="text-[#8b6f5e]/70 text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#3a2a1a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Flower2 size={20} className="text-[#e07a5f]" />
              <span className="text-white font-bold text-lg">{store.name}</span>
            </div>
            <div className="flex items-center gap-6">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#f4d4c0]/60 hover:text-[#e07a5f] text-sm transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#e07a5f]/20 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#f4d4c0]/30 text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-6"><a href="#" className="text-[#f4d4c0]/30 hover:text-[#e07a5f] text-xs transition-colors">Privacy</a><a href="#" className="text-[#f4d4c0]/30 hover:text-[#e07a5f] text-xs transition-colors">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
