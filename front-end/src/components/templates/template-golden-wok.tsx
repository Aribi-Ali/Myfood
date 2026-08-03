'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, MapPin, Phone, Mail, Clock, Utensils, ChefHat, ArrowRight } from 'lucide-react'
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

export function GoldenWokTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-golden/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  return (
    <div className="min-h-screen bg-[#fefce8] text-[#1c1917]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-[#dc2626] shadow-lg' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f59e0b] flex items-center justify-center"><ChefHat size={20} className="text-[#dc2626]" /></div>
              <span className={cn('text-lg font-bold', scrolled ? 'text-white' : 'text-[#dc2626]')}>{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className={cn('text-sm font-medium transition-colors duration-300', scrolled ? 'text-white/80 hover:text-white' : 'text-[#991b1b]/70 hover:text-[#dc2626]')}>{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-[#1c1917] px-5 py-2.5 rounded text-sm font-bold transition-all duration-300">
                <ShoppingBag size={16} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className={cn('md:hidden', scrolled ? 'text-white' : 'text-[#dc2626]')}><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-[#991b1b] flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-white/70 hover:text-[#f59e0b] text-sm font-medium">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-[#f59e0b] text-[#1c1917] px-5 py-2.5 rounded text-sm font-bold flex items-center justify-center gap-2"><ShoppingBag size={16} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt={store.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#dc2626]/90 via-[#dc2626]/70 to-[#991b1b]/90" />
        </div>
        <div className="absolute inset-0 opacity-10">
          <div style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b 0px, #f59e0b 2px, transparent 2px, transparent 8px)' }} className="absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="inline-block border-2 border-[#f59e0b] px-6 py-2 mb-6">
              <span className="text-[#f59e0b] text-sm font-bold tracking-[0.3em] uppercase">Golden Wok Kitchen</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] text-white mb-6">{store.name}</h1>
            <p className="text-lg md:text-xl text-[#fefce8]/80 mb-8 leading-relaxed">{store.description || 'Centuries of tradition. A symphony of flavors.'}</p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-[#991b1b]/60 rounded px-4 py-2 border border-[#f59e0b]/30">
                <StarRating rating={store.avg_rating} size={16} activeColor="#f59e0b" inactiveColor="#fef3c7" />
                <span className="text-[#f59e0b] text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-[#fefce8]/50 text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="bg-[#f59e0b] hover:bg-[#d97706] text-[#1c1917] px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2">
                <ShoppingBag size={18} /> Order Now
              </button>
              <a href="#menu" className="border-2 border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b] hover:text-[#1c1917] px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300">View Menu</a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#fefce8] to-transparent" />
      </section>

      <section id="menu" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block border-2 border-[#dc2626] px-6 py-1 mb-4"><span className="text-[#dc2626] text-sm font-bold tracking-[0.25em] uppercase">Our Menu</span></div>
            <h2 className="text-4xl md:text-5xl font-black text-[#1c1917]">Signature Dishes</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#dc2626] via-[#f59e0b] to-[#dc2626] mx-auto mt-6" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="group bg-[#fffcf5] border-2 border-[#f59e0b]/20 hover:border-[#f59e0b] transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#f59e0b]/40" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#f59e0b]/40" />
                <div className="relative h-52 overflow-hidden">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover transition-transform duration-700" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-[#fef3c7]"><Utensils className="w-10 h-10 text-[#f59e0b]/40" /></div>
                  )}
                  {food.is_offer && <div className="absolute top-3 right-3 bg-[#dc2626] text-white text-xs font-bold px-3 py-1">CHEF&apos;S SPECIAL</div>}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#1c1917] mb-2">{food.name}</h3>
                  {food.description && <p className="text-[#1c1917]/60 text-sm mb-4 line-clamp-2">{food.description}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#dc2626] text-lg font-bold">{formatFoodPrice(food, currency)}</span>
                      {food.new_price && <span className="text-[#1c1917]/40 text-sm line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>}
                    </div>
                    <button onClick={() => onAddToCart?.(food.id)} className="bg-[#dc2626] hover:bg-[#991b1b] text-white px-4 py-2 text-xs font-bold transition-all duration-300 flex items-center gap-1">
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                  {food.cooking_time && <div className="flex items-center gap-1 mt-3 text-[#1c1917]/40 text-xs"><Clock size={12} /> {food.cooking_time} min</div>}
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-[#f59e0b]/30 p-12"><ChefHat size={48} className="mx-auto mb-4 text-[#f59e0b]" /><p className="text-[#1c1917]/50 text-lg">Our menu is being perfected by the master chef.</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-[#fffcf5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block border-2 border-[#f59e0b] px-6 py-1 mb-4"><span className="text-[#f59e0b] text-sm font-bold tracking-[0.25em] uppercase">Testimonials</span></div>
            <h2 className="text-4xl md:text-5xl font-black text-[#1c1917]">What Our Guests Say</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-[#fefce8] border-2 border-[#f59e0b]/20 p-8 relative">
                <div className="flex items-center gap-1 mb-4"><StarRating rating={review.rating} size={16} activeColor="#f59e0b" inactiveColor="#fef3c7" /></div>
                <p className="text-[#1c1917]/70 text-base leading-relaxed mb-6 italic">&ldquo;{review.comment || 'Incredible flavors! The perfect blend of tradition and taste.'}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#dc2626] flex items-center justify-center"><span className="text-[#f59e0b] text-sm font-bold">{review.user.charAt(0)}</span></div>
                  <div><p className="text-[#1c1917] text-sm font-bold">{review.user}</p><p className="text-[#1c1917]/50 text-xs">Verified Guest</p></div>
                </div>
              </div>
            ))}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-[#fefce8] border-2 border-[#f59e0b]/20 p-8 relative">
                <StarRating rating={5} size={16} activeColor="#f59e0b" inactiveColor="#fef3c7" />
                <p className="text-[#1c1917]/70 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;Incredible flavors! The perfect blend of tradition and taste.&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#dc2626] flex items-center justify-center"><span className="text-[#f59e0b] text-sm font-bold">G</span></div>
                  <div><p className="text-[#1c1917] text-sm font-bold">Happy Guest</p><p className="text-[#1c1917]/50 text-xs">Verified</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-16 bg-[#fefce8] border-y-2 border-[#f59e0b]/20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto bg-[#fffcf5] border-2 border-[#f59e0b]/20 p-8">
              <div className="flex items-center gap-3 mb-6 justify-center border-b-2 border-[#dc2626]/20 pb-4">
                <Clock size={20} className="text-[#dc2626]" />
                <h3 className="text-[#1c1917] text-lg font-bold">Opening Hours</h3>
              </div>
              <div className="space-y-3">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-dashed border-[#f59e0b]/20 last:border-b-0">
                    <span className="text-[#1c1917] font-medium capitalize text-sm">{day}</span>
                    <span className="text-[#dc2626] text-sm font-semibold">{hrs.open} &mdash; {hrs.close}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-20 bg-[#fffcf5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-block border-2 border-[#dc2626] px-6 py-1 mb-4"><span className="text-[#dc2626] text-sm font-bold tracking-[0.25em] uppercase">Contact</span></div>
            <h2 className="text-4xl font-black text-[#1c1917]">Get in Touch</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {store.phone && (
              <div className="bg-[#fefce8] border-2 border-[#f59e0b]/20 p-8 text-center hover:border-[#f59e0b] transition-all duration-300">
                <Phone size={24} className="text-[#dc2626] mx-auto mb-4" />
                <h3 className="text-[#1c1917] font-bold mb-2 text-sm">Phone</h3>
                <a href={`tel:${store.phone}`} className="text-[#1c1917]/60 hover:text-[#dc2626] text-sm transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-[#fefce8] border-2 border-[#f59e0b]/20 p-8 text-center hover:border-[#f59e0b] transition-all duration-300">
                <Mail size={24} className="text-[#dc2626] mx-auto mb-4" />
                <h3 className="text-[#1c1917] font-bold mb-2 text-sm">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#1c1917]/60 hover:text-[#dc2626] text-sm transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-[#fefce8] border-2 border-[#f59e0b]/20 p-8 text-center hover:border-[#f59e0b] transition-all duration-300">
                <MapPin size={24} className="text-[#dc2626] mx-auto mb-4" />
                <h3 className="text-[#1c1917] font-bold mb-2 text-sm">Address</h3>
                <p className="text-[#1c1917]/60 text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#dc2626] border-t-2 border-[#f59e0b]/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <ChefHat size={20} className="text-[#f59e0b]" />
              <span className="text-white font-bold text-lg">{store.name}</span>
            </div>
            <div className="flex items-center gap-6">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#fefce8]/60 hover:text-[#f59e0b] text-sm transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#f59e0b]/20 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#fefce8]/40 text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-6"><a href="#" className="text-[#fefce8]/40 hover:text-[#f59e0b] text-xs transition-colors">Privacy Policy</a><a href="#" className="text-[#fefce8]/40 hover:text-[#f59e0b] text-xs transition-colors">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
