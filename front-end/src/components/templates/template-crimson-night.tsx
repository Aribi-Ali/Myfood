'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, Heart, MapPin, Phone, Mail, Clock, Utensils, ChevronDown } from 'lucide-react'
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

export function CrimsonNightTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-crimson/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  return (
    <div className="min-h-screen bg-[#1a0a0a] text-[#f5e6d0]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-[#1a0a0a]/95 backdrop-blur-md border-b border-[#c9a84c]/20' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Heart size={20} className="text-[#c9a84c]" />
              <span className="text-xl font-bold text-[#f5e6d0] tracking-tight">{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#d4a8a8]/70 hover:text-[#c9a84c] text-sm font-medium tracking-wider uppercase transition-colors duration-300">{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-[#8b1a1a] hover:bg-[#6b1212] text-[#c9a84c] px-6 py-2.5 text-sm font-semibold transition-all duration-300 border border-[#c9a84c]/30 hover:border-[#c9a84c]/60">
                <ShoppingBag size={16} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[#d4a8a8]"><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-[#120808] border-t border-[#c9a84c]/20 flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#d4a8a8]/70 hover:text-[#c9a84c] text-sm font-medium">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-[#8b1a1a] text-[#c9a84c] px-5 py-2.5 text-sm font-semibold border border-[#c9a84c]/30 flex items-center justify-center gap-2"><ShoppingBag size={16} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt={store.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a0a]/95 via-[#1a0a0a]/70 to-[#1a0a0a]/85" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a0a]/40 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="border-l-4 border-[#c9a84c] pl-5 mb-6">
              <span className="text-[#c9a84c] text-sm font-semibold tracking-[0.2em] uppercase">Crimson Night &middot; Fine Dining</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-light leading-[1.05] text-white mb-6 tracking-tight">{store.name}</h1>
            <p className="text-lg md:text-xl text-[#d4a8a8]/80 mb-8 leading-relaxed max-w-xl font-light">{store.description || 'An intimate evening of unparalleled flavors. Sophistication on every plate.'}</p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-[#120808]/70 backdrop-blur-sm px-4 py-2 border border-[#c9a84c]/20">
                <StarRating rating={store.avg_rating} size={16} activeColor="#c9a84c" inactiveColor="#5c3a3a" />
                <span className="text-[#c9a84c] text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-[#d4a8a8]/50 text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="bg-[#8b1a1a] hover:bg-[#6b1212] text-[#c9a84c] px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 border border-[#c9a84c]/40 hover:border-[#c9a84c] hover:shadow-lg hover:shadow-[#c9a84c]/10 flex items-center gap-2">
                <ShoppingBag size={18} /> Reserve a Table
              </button>
              <a href="#menu" className="border border-[#c9a84c]/30 text-[#d4a8a8] hover:text-[#c9a84c] hover:border-[#c9a84c]/60 px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300">View Menu</a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24 bg-[#120808]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#c9a84c] text-sm font-semibold tracking-[0.2em] uppercase block mb-3">The Crimson Collection</span>
            <h2 className="text-4xl md:text-5xl font-light text-white">Signature Offerings</h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent mx-auto mt-6" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="group bg-[#1a0a0a] border border-[#5c3a3a]/50 hover:border-[#c9a84c]/40 transition-all duration-500">
                <div className="relative h-56 overflow-hidden">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover transition-transform duration-700" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-[#120808]"><Utensils className="w-10 h-10 text-[#5c3a3a]/50" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a0a] to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                  {food.is_offer && <span className="absolute top-3 right-3 bg-[#8b1a1a] text-[#c9a84c] text-[10px] font-bold px-3 py-1 border border-[#c9a84c]/30">SIGNATURE</span>}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{food.name}</h3>
                  {food.description && <p className="text-[#d4a8a8]/60 text-sm mb-4 line-clamp-2 font-light">{food.description}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#c9a84c] text-lg font-semibold">{formatFoodPrice(food, currency)}</span>
                      {food.new_price && <span className="text-[#d4a8a8]/30 text-sm line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>}
                    </div>
                    <button onClick={() => onAddToCart?.(food.id)} className="bg-transparent border border-[#c9a84c]/40 text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#1a0a0a] px-4 py-2 text-xs font-semibold transition-all duration-300 flex items-center gap-1">
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                  {food.cooking_time && <div className="flex items-center gap-1 mt-3 text-[#d4a8a8]/40 text-xs"><Clock size={12} /> {food.cooking_time} min</div>}
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-16 border border-dashed border-[#5c3a3a]/50 p-12"><Heart size={48} className="mx-auto mb-4 text-[#5c3a3a]" /><p className="text-[#d4a8a8]/50 text-lg font-light">Our evening menu is being curated.</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#c9a84c] text-sm font-semibold tracking-[0.2em] uppercase block mb-3">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-light text-white">The Experience</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-[#120808] border border-[#5c3a3a]/50 p-8 hover:border-[#c9a84c]/30 transition-all duration-500">
                <div className="flex items-center gap-1 mb-4"><StarRating rating={review.rating} size={16} activeColor="#c9a84c" inactiveColor="#5c3a3a" /></div>
                <p className="text-[#d4a8a8]/80 text-base leading-relaxed mb-6 italic font-light">&ldquo;{review.comment || 'An unforgettable evening. Every detail was perfect.'}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1a0a0a] border border-[#c9a84c]/30 flex items-center justify-center">
                    <span className="text-[#c9a84c] text-sm font-semibold">{review.user.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{review.user}</p>
                    <p className="text-[#d4a8a8]/50 text-xs">Verified Guest</p>
                  </div>
                </div>
              </div>
            ))}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-[#120808] border border-[#5c3a3a]/50 p-8">
                <StarRating rating={5} size={16} activeColor="#c9a84c" inactiveColor="#5c3a3a" />
                <p className="text-[#d4a8a8]/80 text-base leading-relaxed mt-4 mb-6 italic font-light">&ldquo;An unforgettable evening. Every detail was perfect.&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1a0a0a] border border-[#c9a84c]/30 flex items-center justify-center"><span className="text-[#c9a84c] text-sm font-semibold">C</span></div>
                  <div><p className="text-white text-sm font-semibold">Connoisseur</p><p className="text-[#d4a8a8]/50 text-xs">Verified</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-16 bg-[#120808] border-y border-[#5c3a3a]/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto">
              <div className="flex items-center gap-3 mb-8 justify-center">
                <Clock size={20} className="text-[#c9a84c]" />
                <h3 className="text-white text-lg font-light">Opening Hours</h3>
              </div>
              <div className="space-y-2">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between border-b border-[#5c3a3a]/20 py-3">
                    <span className="text-[#d4a8a8] font-light capitalize text-sm">{day}</span>
                    <span className="text-[#c9a84c] text-sm">{hrs.open} &mdash; {hrs.close}</span>
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
            <span className="text-[#c9a84c] text-sm font-semibold tracking-[0.2em] uppercase block mb-3">Contact</span>
            <h2 className="text-4xl font-light text-white">Get in Touch</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {store.phone && (
              <div className="bg-[#120808] border border-[#5c3a3a]/50 p-8 text-center hover:border-[#c9a84c]/30 transition-all duration-300">
                <Phone size={24} className="text-[#c9a84c] mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2 text-sm">Call</h3>
                <a href={`tel:${store.phone}`} className="text-[#d4a8a8]/70 hover:text-[#c9a84c] text-sm transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-[#120808] border border-[#5c3a3a]/50 p-8 text-center hover:border-[#c9a84c]/30 transition-all duration-300">
                <Mail size={24} className="text-[#c9a84c] mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2 text-sm">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#d4a8a8]/70 hover:text-[#c9a84c] text-sm transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-[#120808] border border-[#5c3a3a]/50 p-8 text-center hover:border-[#c9a84c]/30 transition-all duration-300">
                <MapPin size={24} className="text-[#c9a84c] mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2 text-sm">Address</h3>
                <p className="text-[#d4a8a8]/70 text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#120808] border-t border-[#5c3a3a]/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Heart size={20} className="text-[#c9a84c]" />
              <span className="text-white font-bold text-lg">{store.name}</span>
            </div>
            <div className="flex items-center gap-6">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#d4a8a8]/50 hover:text-[#c9a84c] text-sm transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#5c3a3a]/20 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#d4a8a8]/30 text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-6"><a href="#" className="text-[#d4a8a8]/30 hover:text-[#c9a84c] text-xs transition-colors">Privacy Policy</a><a href="#" className="text-[#d4a8a8]/30 hover:text-[#c9a84c] text-xs transition-colors">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
