'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, Waves, MapPin, Phone, Mail, Clock, Utensils, Ship } from 'lucide-react'
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

export function OceanWaveTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-wave/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  return (
    <div className="min-h-screen bg-[#f0f9ff] text-[#0c4a6e]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-white/90 backdrop-blur-lg shadow-md shadow-[#0ea5e9]/10' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Waves size={22} className="text-[#0ea5e9]" />
              <span className="text-lg font-bold text-[#0c4a6e]">{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#0c4a6e]/70 hover:text-[#0ea5e9] text-sm font-medium transition-colors duration-300">{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#0ea5e9]/30">
                <ShoppingBag size={16} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[#0c4a6e]"><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-white/95 backdrop-blur-xl border-t border-[#0ea5e9]/10 flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#0c4a6e]/70 hover:text-[#0ea5e9] text-sm font-medium">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2"><ShoppingBag size={16} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt={store.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c4a6e]/80 via-[#0ea5e9]/60 to-[#06b6d4]/70" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32">
          <svg className="w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" fill="#f0f9ff" opacity="0.3" />
            <path d="M0,80 C360,40 720,100 1080,60 L1440,80 L1440,120 L0,120 Z" fill="#f0f9ff" opacity="0.6" />
          </svg>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-5">
              <Ship size={16} className="text-white/80" />
              <span className="text-white/80 text-sm font-medium tracking-wider uppercase">Ocean Wave &middot; Coastal Cuisine</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] text-white mb-6">{store.name}</h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">{store.description || 'Fresh from the sea. Every wave brings new flavors.'}</p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <StarRating rating={store.avg_rating} size={16} activeColor="#0ea5e9" inactiveColor="#bae6fd" />
                <span className="text-white text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-white/60 text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="bg-white text-[#0ea5e9] px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center gap-2">
                <ShoppingBag size={18} /> Order Now
              </button>
              <a href="#menu" className="border-2 border-white/40 text-white hover:bg-white/10 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300">Explore Menu</a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#0ea5e9] text-sm font-semibold tracking-wider uppercase block mb-3">Catch of the Day</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0c4a6e]">Our Seafood Selection</h2>
            <svg className="w-8 h-8 mx-auto mt-4 text-[#0ea5e9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12C2 6.5 6.5 2 12 2s10 4.5 10 10-4.5 10-10 10S2 17.5 2 12z" /><path d="M8 12l2 2 4-4" /></svg>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="group bg-white rounded-2xl overflow-hidden border border-[#bae6fd] hover:border-[#0ea5e9]/40 transition-all duration-500 hover:shadow-xl hover:shadow-[#0ea5e9]/10">
                <div className="relative h-52 overflow-hidden">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#e0f2fe] to-[#f0f9ff]"><Utensils className="w-10 h-10 text-[#0ea5e9]/40" /></div>
                  )}
                  {food.is_offer && <span className="absolute top-3 right-3 bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white text-xs font-bold px-3 py-1 rounded-full">Fresh Catch</span>}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#0c4a6e] mb-2">{food.name}</h3>
                  {food.description && <p className="text-[#0c4a6e]/60 text-sm mb-4 line-clamp-2">{food.description}</p>}
                  <div className="flex items-center justify-between">
                    <span className="text-[#0ea5e9] text-lg font-bold">{formatFoodPrice(food, currency)}</span>
                    <button onClick={() => onAddToCart?.(food.id)} className="bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] text-white px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 hover:shadow-lg flex items-center gap-1">
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                  {food.cooking_time && <div className="flex items-center gap-1 mt-3 text-[#0c4a6e]/50 text-xs"><Clock size={12} /> {food.cooking_time} min</div>}
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-16"><Waves size={48} className="mx-auto mb-4 text-[#0ea5e9]/50" /><p className="text-[#0c4a6e]/50 text-lg">Our ocean menu is being prepared. The tide will bring it soon.</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#06b6d4] text-sm font-semibold tracking-wider uppercase block mb-3">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0c4a6e]">Tides of Praise</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-[#f0f9ff] rounded-2xl p-8 border border-[#bae6fd] hover:border-[#0ea5e9]/30 transition-all duration-500">
                <StarRating rating={review.rating} size={16} activeColor="#0ea5e9" inactiveColor="#bae6fd" />
                <p className="text-[#0c4a6e]/70 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;{review.comment || 'The freshest seafood I have ever tasted. Absolutely divine!'}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] flex items-center justify-center"><span className="text-white text-sm font-bold">{review.user.charAt(0)}</span></div>
                  <div><p className="text-[#0c4a6e] text-sm font-semibold">{review.user}</p><p className="text-[#0c4a6e]/50 text-xs">Verified Guest</p></div>
                </div>
              </div>
            ))}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-[#f0f9ff] rounded-2xl p-8 border border-[#bae6fd]">
                <StarRating rating={5} size={16} activeColor="#0ea5e9" inactiveColor="#bae6fd" />
                <p className="text-[#0c4a6e]/70 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;The freshest seafood I have ever tasted. Absolutely divine!&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] flex items-center justify-center"><span className="text-white text-sm font-bold">S</span></div>
                  <div><p className="text-[#0c4a6e] text-sm font-semibold">Seafood Lover</p><p className="text-[#0c4a6e]/50 text-xs">Verified</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-16 bg-[#f0f9ff]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto bg-white rounded-2xl p-8 border border-[#bae6fd] shadow-sm">
              <div className="flex items-center gap-3 mb-6 justify-center">
                <Clock size={20} className="text-[#0ea5e9]" />
                <h3 className="text-[#0c4a6e] text-lg font-bold">Opening Hours</h3>
              </div>
              <div className="space-y-2">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-[#bae6fd]/50 last:border-b-0">
                    <span className="text-[#0c4a6e]/70 font-medium capitalize text-sm">{day}</span>
                    <span className="text-[#0ea5e9] text-sm">{hrs.open} &mdash; {hrs.close}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#0ea5e9] text-sm font-semibold tracking-wider uppercase block mb-3">Contact</span>
            <h2 className="text-4xl font-bold text-[#0c4a6e]">Drop Us a Line</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {store.phone && (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#bae6fd] hover:border-[#0ea5e9]/40 transition-all duration-300 shadow-sm">
                <Phone size={22} className="text-[#0ea5e9] mx-auto mb-4" />
                <h3 className="text-[#0c4a6e] font-semibold mb-2 text-sm">Phone</h3>
                <a href={`tel:${store.phone}`} className="text-[#0c4a6e]/70 hover:text-[#0ea5e9] text-sm transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#bae6fd] hover:border-[#0ea5e9]/40 transition-all duration-300 shadow-sm">
                <Mail size={22} className="text-[#0ea5e9] mx-auto mb-4" />
                <h3 className="text-[#0c4a6e] font-semibold mb-2 text-sm">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#0c4a6e]/70 hover:text-[#0ea5e9] text-sm transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#bae6fd] hover:border-[#0ea5e9]/40 transition-all duration-300 shadow-sm">
                <MapPin size={22} className="text-[#0ea5e9] mx-auto mb-4" />
                <h3 className="text-[#0c4a6e] font-semibold mb-2 text-sm">Address</h3>
                <p className="text-[#0c4a6e]/70 text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-[#0c4a6e] to-[#0ea5e9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Waves size={20} className="text-white/80" />
              <span className="text-white font-bold text-lg">{store.name}</span>
            </div>
            <div className="flex items-center gap-6">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-white/60 hover:text-white text-sm transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-6"><a href="#" className="text-white/40 hover:text-white text-xs transition-colors">Privacy Policy</a><a href="#" className="text-white/40 hover:text-white text-xs transition-colors">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
