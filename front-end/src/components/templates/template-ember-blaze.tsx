'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, Flame, MapPin, Phone, Mail, Clock, Utensils, ChevronDown } from 'lucide-react'
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

export function EmberBlazeTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-ember/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  return (
    <div className="min-h-screen bg-[#450a0a] text-[#f5f5f5]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-[#1c1917]/95 backdrop-blur-md shadow-lg shadow-[#dc2626]/10' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Flame size={24} className="text-[#f97316]" />
              <span className="text-xl font-bold text-[#f5f5f5] tracking-tight">{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#f5f5f5]/70 hover:text-[#f97316] text-sm font-medium transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[#f97316] after:transition-all after:duration-300 hover:after:w-full">{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg shadow-[#dc2626]/30 hover:shadow-[#dc2626]/50">
                <ShoppingBag size={16} /> Order Now
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[#f5f5f5]"><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-[#1c1917] border-t border-[#dc2626]/20 flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#f5f5f5]/70 hover:text-[#f97316] text-sm font-medium">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-[#dc2626] text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2"><ShoppingBag size={16} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt={store.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#450a0a]/90 via-[#450a0a]/60 to-[#450a0a]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,38,38,0.15)_0%,_transparent_70%)]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Flame size={20} className="text-[#f97316]" />
              <span className="text-[#f97316] text-sm font-semibold tracking-widest uppercase">Ember Grille &middot; Fire-Kissed Flavors</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] text-white mb-6">{store.name}</h1>
            <p className="text-lg md:text-xl text-[#f5f5f5]/80 mb-8 leading-relaxed max-w-xl">{store.description || 'Wood-fired perfection. Every dish kissed by flame.'}</p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-[#1c1917]/60 backdrop-blur-sm rounded-full px-4 py-2 border border-[#dc2626]/30">
                <StarRating rating={store.avg_rating} size={16} activeColor="#f97316" inactiveColor="#3d3d3d" />
                <span className="text-[#f5f5f5] text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-[#f5f5f5]/50 text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-2xl shadow-[#dc2626]/40 hover:shadow-[#dc2626]/60 hover:scale-105 flex items-center gap-2">
                <Flame size={18} /> Order Now
              </button>
              <a href="#menu" className="border-2 border-[#f97316]/50 text-[#f97316] hover:bg-[#f97316]/10 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300">View Menu</a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown size={28} className="text-[#f97316]/60" />
        </div>
      </section>

      <section id="menu" className="py-24 bg-[#1c1917]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#f97316] text-sm font-semibold tracking-widest uppercase block mb-3">The Ember Collection</span>
            <h2 className="text-4xl md:text-5xl font-black text-white">Our Signature Dishes</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#dc2626] to-[#f97316] mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="group bg-[#450a0a] rounded-2xl overflow-hidden border border-[#dc2626]/20 hover:border-[#f97316]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]">
                <div className="relative h-56 overflow-hidden">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover transition-transform duration-700" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-[#1c1917]"><Utensils className="w-10 h-10 text-[#f97316]/40" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#450a0a] to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                  {food.is_offer && <span className="absolute top-3 left-3 bg-[#dc2626] text-white text-xs font-bold px-3 py-1 rounded-full">Ember Deal</span>}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{food.name}</h3>
                  {food.description && <p className="text-[#f5f5f5]/60 text-sm mb-4 line-clamp-2">{food.description}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#f97316] text-xl font-bold">{formatFoodPrice(food, currency)}</span>
                      {food.new_price && <span className="text-[#f5f5f5]/40 text-sm line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>}
                    </div>
                    <button onClick={() => onAddToCart?.(food.id)} className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1">
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                  {food.cooking_time && <div className="flex items-center gap-1 mt-3 text-[#f5f5f5]/40 text-xs"><Clock size={12} /> {food.cooking_time} min</div>}
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-16"><Flame size={48} className="mx-auto mb-4 text-[#dc2626]/50" /><p className="text-[#f5f5f5]/50 text-lg">Our ember-lit menu is being prepared. Check back soon.</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-[#450a0a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#f97316] text-sm font-semibold tracking-widest uppercase block mb-3">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black text-white">What Our Guests Say</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#dc2626] to-[#f97316] mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {store.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-[#1c1917] rounded-2xl p-8 border border-[#dc2626]/20 hover:border-[#f97316]/30 transition-all duration-500">
                <div className="flex items-center gap-1 mb-4"><StarRating rating={review.rating} size={16} activeColor="#f97316" inactiveColor="#3d3d3d" /></div>
                <p className="text-[#f5f5f5]/80 text-base leading-relaxed mb-6 italic">&ldquo;{review.comment || 'The flavors were absolutely incredible. A true culinary experience!'}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#dc2626]/20 border border-[#f97316]/30 flex items-center justify-center">
                    <span className="text-[#f97316] text-sm font-bold">{review.user.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{review.user}</p>
                    <p className="text-[#f5f5f5]/40 text-xs">Verified Guest</p>
                  </div>
                </div>
              </div>
            ))}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-[#1c1917] rounded-2xl p-8 border border-[#dc2626]/20">
                <div className="flex items-center gap-1 mb-4"><StarRating rating={5} size={16} activeColor="#f97316" inactiveColor="#3d3d3d" /></div>
                <p className="text-[#f5f5f5]/80 text-base leading-relaxed mb-6 italic">&ldquo;The flavors were absolutely incredible. A true culinary experience!&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#dc2626]/20 border border-[#f97316]/30 flex items-center justify-center"><span className="text-[#f97316] text-sm font-bold">G</span></div>
                  <div><p className="text-white text-sm font-semibold">Loyal Guest</p><p className="text-[#f5f5f5]/40 text-xs">Verified Guest</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-20 bg-[#1c1917] border-y border-[#dc2626]/20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto">
              <div className="flex items-center gap-3 mb-8 justify-center">
                <Clock size={20} className="text-[#f97316]" />
                <h3 className="text-white text-xl font-bold">Opening Hours</h3>
              </div>
              <div className="space-y-3">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between bg-[#450a0a] rounded-xl px-6 py-3 border border-[#dc2626]/10">
                    <span className="text-white font-medium capitalize text-sm">{day}</span>
                    <span className="text-[#f97316] text-sm">{hrs.open} &mdash; {hrs.close}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-20 bg-[#450a0a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#f97316] text-sm font-semibold tracking-widest uppercase block mb-3">Get in Touch</span>
            <h2 className="text-4xl font-black text-white">Contact Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {store.phone && (
              <div className="bg-[#1c1917] rounded-2xl p-8 text-center border border-[#dc2626]/20 hover:border-[#f97316]/40 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-[#dc2626]/20 flex items-center justify-center mx-auto mb-4"><Phone size={24} className="text-[#f97316]" /></div>
                <h3 className="text-white font-semibold mb-2 text-sm">Call Us</h3>
                <a href={`tel:${store.phone}`} className="text-[#f5f5f5]/70 hover:text-[#f97316] text-sm transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-[#1c1917] rounded-2xl p-8 text-center border border-[#dc2626]/20 hover:border-[#f97316]/40 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-[#dc2626]/20 flex items-center justify-center mx-auto mb-4"><Mail size={24} className="text-[#f97316]" /></div>
                <h3 className="text-white font-semibold mb-2 text-sm">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#f5f5f5]/70 hover:text-[#f97316] text-sm transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-[#1c1917] rounded-2xl p-8 text-center border border-[#dc2626]/20 hover:border-[#f97316]/40 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-[#dc2626]/20 flex items-center justify-center mx-auto mb-4"><MapPin size={24} className="text-[#f97316]" /></div>
                <h3 className="text-white font-semibold mb-2 text-sm">Visit Us</h3>
                <p className="text-[#f5f5f5]/70 text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#1c1917] border-t border-[#dc2626]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Flame size={22} className="text-[#f97316]" />
              <span className="text-white font-bold text-lg">{store.name}</span>
            </div>
            <div className="flex items-center gap-6">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#f5f5f5]/50 hover:text-[#f97316] text-sm transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#dc2626]/10 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#f5f5f5]/30 text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-6"><a href="#" className="text-[#f5f5f5]/30 hover:text-[#f97316] text-xs transition-colors">Privacy Policy</a><a href="#" className="text-[#f5f5f5]/30 hover:text-[#f97316] text-xs transition-colors">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
