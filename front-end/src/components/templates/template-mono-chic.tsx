'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, Minus, MapPin, Phone, Mail, Clock, Utensils } from 'lucide-react'
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

export function MonoChicTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-mono/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  return (
    <div className="min-h-screen bg-white text-[#1c1917]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-white/90 backdrop-blur-lg border-b border-[#e5e5e5]' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Minus size={18} className="text-[#1c1917]" />
              <span className="text-lg font-light tracking-wider text-[#1c1917]">{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-10">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#6b7280] hover:text-[#1c1917] text-xs font-medium tracking-widest uppercase transition-colors duration-300">{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-[#1c1917] hover:bg-[#292524] text-white px-6 py-2.5 text-xs font-medium tracking-widest uppercase transition-all duration-300">
                <ShoppingBag size={14} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[#1c1917]"><Menu size={20} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-white border-t border-[#e5e5e5] flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#6b7280] hover:text-[#1c1917] text-xs font-medium tracking-widest uppercase">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-[#1c1917] text-white px-5 py-2.5 text-xs font-medium tracking-widest uppercase flex items-center justify-center gap-2"><ShoppingBag size={14} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[#fafaf9]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#e5e5e5 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-xl mx-auto text-center">
            <span className="text-[#9ca3af] text-xs font-medium tracking-[0.3em] uppercase block mb-6">Mono Chic</span>
            <h1 className="text-5xl md:text-7xl font-light leading-[1.05] text-[#1c1917] mb-6 tracking-tight">{store.name}</h1>
            <p className="text-base md:text-lg text-[#6b7280] mb-8 leading-relaxed font-light">{store.description || 'Less is more. Sophisticated minimalism in every dish.'}</p>
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="flex items-center gap-2 px-4 py-2 border border-[#e5e5e5]">
                <StarRating rating={store.avg_rating} size={14} activeColor="#1c1917" inactiveColor="#d4d4d4" />
                <span className="text-[#1c1917] text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-[#9ca3af] text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={onShopNow} className="bg-[#1c1917] hover:bg-[#292524] text-white px-8 py-4 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2">
                <ShoppingBag size={16} /> Order Now
              </button>
              <a href="#menu" className="border border-[#d4d4d4] text-[#6b7280] hover:text-[#1c1917] hover:border-[#1c1917] px-8 py-4 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300">View Menu</a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24 bg-[#fafaf9]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#9ca3af] text-xs font-medium tracking-[0.3em] uppercase block mb-3">The Collection</span>
            <h2 className="text-4xl md:text-5xl font-light text-[#1c1917]">Selected Dishes</h2>
            <div className="w-16 h-px bg-[#d4d4d4] mx-auto mt-6" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e5e5e5]">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="group bg-white p-6 hover:bg-[#fafaf9] transition-all duration-500">
                <div className="relative h-48 overflow-hidden mb-5 bg-[#f5f5f4]">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover transition-all duration-700 grayscale" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full"><Utensils className="w-8 h-8 text-[#d4d4d4]" /></div>
                  )}
                  {food.is_offer && <span className="absolute bottom-2 left-2 bg-[#1c1917] text-white text-[9px] font-medium px-2 py-0.5 tracking-widest uppercase">Curated</span>}
                </div>
                <div className="space-y-0">
                  <h3 className="text-base font-medium text-[#1c1917]">{food.name}</h3>
                  {food.description && <p className="text-[#9ca3af] text-xs mt-1 line-clamp-2 font-light">{food.description}</p>}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#e5e5e5]">
                    <div>
                      <span className="text-[#1c1917] text-sm font-medium">{formatFoodPrice(food, currency)}</span>
                      {food.new_price && <span className="text-[#9ca3af] text-xs line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>}
                    </div>
                    <button onClick={() => onAddToCart?.(food.id)} className="text-[#9ca3af] hover:text-[#1c1917] text-xs font-medium tracking-wider uppercase transition-colors flex items-center gap-1">
                      + Add
                    </button>
                  </div>
                  {food.cooking_time && <div className="flex items-center gap-1 mt-2 text-[#9ca3af] text-xs"><Clock size={10} /> {food.cooking_time} min</div>}
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-16"><Minus size={40} className="mx-auto mb-4 text-[#d4d4d4]" /><p className="text-[#9ca3af] text-lg font-light">Our curated menu is being composed.</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#9ca3af] text-xs font-medium tracking-[0.3em] uppercase block mb-3">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-light text-[#1c1917]">What They Say</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="border border-[#e5e5e5] p-8 hover:bg-[#fafaf9] transition-all duration-500">
                <StarRating rating={review.rating} size={14} activeColor="#1c1917" inactiveColor="#d4d4d4" />
                <p className="text-[#6b7280] text-sm leading-relaxed mt-4 mb-6 font-light">&ldquo;{review.comment || 'Exceptional in its simplicity. A truly refined experience.'}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border border-[#d4d4d4] flex items-center justify-center"><span className="text-[#6b7280] text-xs font-medium">{review.user.charAt(0)}</span></div>
                  <div><p className="text-[#1c1917] text-sm font-medium">{review.user}</p><p className="text-[#9ca3af] text-xs">Guest</p></div>
                </div>
              </div>
            ))}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="border border-[#e5e5e5] p-8">
                <StarRating rating={5} size={14} activeColor="#1c1917" inactiveColor="#d4d4d4" />
                <p className="text-[#6b7280] text-sm leading-relaxed mt-4 mb-6 font-light">&ldquo;Exceptional in its simplicity. A truly refined experience.&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border border-[#d4d4d4] flex items-center justify-center"><span className="text-[#6b7280] text-xs font-medium">M</span></div>
                  <div><p className="text-[#1c1917] text-sm font-medium">Minimalist</p><p className="text-[#9ca3af] text-xs">Guest</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-16 bg-[#fafaf9]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto border border-[#e5e5e5] p-8">
              <div className="flex items-center gap-3 mb-6 justify-center">
                <Clock size={18} className="text-[#6b7280]" />
                <h3 className="text-[#1c1917] text-base font-medium">Opening Hours</h3>
              </div>
              <div className="space-y-2">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-[#e5e5e5] last:border-b-0">
                    <span className="text-[#6b7280] font-light capitalize text-sm">{day}</span>
                    <span className="text-[#1c1917] text-sm">{hrs.open} &mdash; {hrs.close}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#9ca3af] text-xs font-medium tracking-[0.3em] uppercase block mb-3">Connect</span>
            <h2 className="text-4xl font-light text-[#1c1917]">Get in Touch</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {store.phone && (
              <div className="border border-[#e5e5e5] p-8 text-center hover:bg-[#fafaf9] transition-all duration-300">
                <Phone size={20} className="text-[#6b7280] mx-auto mb-4" />
                <h3 className="text-[#1c1917] font-medium mb-2 text-sm">Call</h3>
                <a href={`tel:${store.phone}`} className="text-[#9ca3af] hover:text-[#1c1917] text-sm transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="border border-[#e5e5e5] p-8 text-center hover:bg-[#fafaf9] transition-all duration-300">
                <Mail size={20} className="text-[#6b7280] mx-auto mb-4" />
                <h3 className="text-[#1c1917] font-medium mb-2 text-sm">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#9ca3af] hover:text-[#1c1917] text-sm transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="border border-[#e5e5e5] p-8 text-center hover:bg-[#fafaf9] transition-all duration-300">
                <MapPin size={20} className="text-[#6b7280] mx-auto mb-4" />
                <h3 className="text-[#1c1917] font-medium mb-2 text-sm">Address</h3>
                <p className="text-[#9ca3af] text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#1c1917]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Minus size={16} className="text-[#d4d4d4]" />
              <span className="text-white font-light text-lg">{store.name}</span>
            </div>
            <div className="flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#6b7280] hover:text-white text-xs font-medium tracking-wider uppercase transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#292524] mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#525252] text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-6"><a href="#" className="text-[#525252] hover:text-white text-xs transition-colors">Privacy</a><a href="#" className="text-[#525252] hover:text-white text-xs transition-colors">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
