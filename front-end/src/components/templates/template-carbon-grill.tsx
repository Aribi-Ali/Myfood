'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, MapPin, Phone, Mail, Clock, Utensils, Flame, ChevronDown } from 'lucide-react'
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

export function CarbonGrillTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-carbon/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  return (
    <div className="min-h-screen bg-[#171717] text-[#fafafa]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-[#171717]/95 backdrop-blur-md border-b border-[#262626]' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black tracking-tighter text-[#fafafa]">{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-10">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#737373] hover:text-[#fafafa] text-xs tracking-[0.25em] uppercase font-bold transition-colors duration-300">{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300">
                <ShoppingBag size={14} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[#fafafa]"><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-[#171717] border-t border-[#262626] flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#737373] hover:text-[#fafafa] text-xs tracking-[0.25em] uppercase font-bold">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-[#dc2626] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"><ShoppingBag size={14} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt={store.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#171717] via-[#171717]/90 to-[#171717]/70" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(220,38,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.05)_1px,transparent_1px)]" style={{ backgroundSize: '80px 80px' }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="border-l-4 border-[#dc2626] pl-4 mb-6">
              <span className="text-[#737373] text-xs tracking-[0.3em] uppercase font-bold">Premium Steakhouse</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] text-[#fafafa] mb-6 tracking-tight">{store.name}</h1>
            <p className="text-lg md:text-xl text-[#737373] mb-8 leading-relaxed max-w-lg">{store.description || 'Fire. Smoke. Perfection. The ultimate grilling experience.'}</p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-[#262626] px-4 py-2">
                <StarRating rating={store.avg_rating} size={16} activeColor="#dc2626" inactiveColor="#262626" />
                <span className="text-[#fafafa] text-sm font-bold ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-[#737373] text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-10 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2">
                <Flame size={18} /> Order Now
              </button>
              <a href="#menu" className="border-2 border-[#262626] text-[#737373] hover:border-[#737373] hover:text-[#fafafa] px-10 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300">View Menu</a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <ChevronDown size={24} className="text-[#737373]" />
        </div>
      </section>

      <section id="menu" className="py-24 bg-[#171717]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="border-l-4 border-[#dc2626] pl-4 mb-16">
            <span className="text-[#737373] text-xs tracking-[0.3em] uppercase font-bold block mb-2">The Grill</span>
            <h2 className="text-4xl md:text-6xl font-black text-[#fafafa] tracking-tight">Our Cuts</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="group bg-[#262626] hover:bg-[#333333] transition-all duration-500 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover transition-transform duration-700" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-[#171717]"><Utensils className="w-10 h-10 text-[#737373]" /></div>
                  )}
                  {food.is_offer && <span className="absolute top-2 left-2 bg-[#dc2626] text-white text-[10px] font-bold px-2 py-1">GRILL SPECIAL</span>}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#fafafa] mb-1">{food.name}</h3>
                  {food.description && <p className="text-[#737373] text-xs mb-3 line-clamp-2">{food.description}</p>}
                  <div className="flex items-center justify-between pt-3 border-t border-[#171717]">
                    <div>
                      <span className="text-[#dc2626] text-lg font-bold">{formatFoodPrice(food, currency)}</span>
                      {food.new_price && <span className="text-[#525252] text-xs line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>}
                    </div>
                    <button onClick={() => onAddToCart?.(food.id)} className="bg-transparent border border-[#525252] text-[#fafafa] hover:bg-[#dc2626] hover:border-[#dc2626] px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300">
                      +Add
                    </button>
                  </div>
                  {food.cooking_time && <div className="flex items-center gap-1 mt-2 text-[#525252] text-xs"><Clock size={11} /> {food.cooking_time} min</div>}
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-20 border border-dashed border-[#262626]"><Flame size={48} className="mx-auto mb-4 text-[#737373]" /><p className="text-[#525252] text-lg">Our grill is heating up. Menu coming soon.</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-[#171717] border-t border-[#262626]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="border-l-4 border-[#dc2626] pl-4 mb-16">
            <span className="text-[#737373] text-xs tracking-[0.3em] uppercase font-bold block mb-2">Testimonials</span>
            <h2 className="text-4xl md:text-6xl font-black text-[#fafafa] tracking-tight">Reviews</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {store.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-[#262626] p-6 border-l-4 border-[#262626] hover:border-[#dc2626] transition-all duration-500">
                <StarRating rating={review.rating} size={14} activeColor="#dc2626" inactiveColor="#262626" />
                <p className="text-[#a3a3a3] text-sm leading-relaxed mt-3 mb-4">&ldquo;{review.comment || 'The best steak I\'ve ever had. Perfectly charred, perfectly cooked.'}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#171717] flex items-center justify-center">
                    <span className="text-[#dc2626] text-sm font-bold">{review.user.charAt(0)}</span>
                  </div>
                  <div><p className="text-[#fafafa] text-sm font-bold">{review.user}</p><p className="text-[#525252] text-xs uppercase tracking-wider">Verified</p></div>
                </div>
              </div>
            ))}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-[#262626] p-6 border-l-4 border-[#262626]">
                <StarRating rating={5} size={14} activeColor="#dc2626" inactiveColor="#262626" />
                <p className="text-[#a3a3a3] text-sm leading-relaxed mt-3 mb-4">&ldquo;The best steak I&apos;ve ever had. Perfectly charred.&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#171717] flex items-center justify-center"><span className="text-[#dc2626] text-sm font-bold">G</span></div>
                  <div><p className="text-[#fafafa] text-sm font-bold">Guest</p><p className="text-[#525252] text-xs uppercase tracking-wider">Verified</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-16 bg-[#171717] border-t border-[#262626]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto bg-[#262626] p-8 border border-[#333333]">
              <div className="flex items-center gap-3 mb-6 border-b border-[#333333] pb-4">
                <Clock size={18} className="text-[#dc2626]" />
                <h3 className="text-[#fafafa] text-sm font-bold uppercase tracking-wider">Opening Hours</h3>
              </div>
              <div className="space-y-3">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-[#262626] last:border-b-0">
                    <span className="text-[#a3a3a3] text-xs uppercase tracking-wider font-bold">{day}</span>
                    <span className="text-[#fafafa] text-xs font-mono">{hrs.open} &mdash; {hrs.close}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-20 bg-[#171717] border-t border-[#262626]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="border-l-4 border-[#dc2626] pl-4 mb-14">
            <span className="text-[#737373] text-xs tracking-[0.3em] uppercase font-bold block mb-2">Connect</span>
            <h2 className="text-4xl font-black text-[#fafafa] tracking-tight">Contact</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-3 max-w-4xl">
            {store.phone && (
              <div className="bg-[#262626] p-6 text-center border border-[#333333] hover:border-[#dc2626]/30 transition-all duration-300">
                <Phone size={22} className="text-[#dc2626] mx-auto mb-3" />
                <h3 className="text-[#fafafa] text-xs font-bold uppercase tracking-wider mb-1">Phone</h3>
                <a href={`tel:${store.phone}`} className="text-[#737373] text-sm hover:text-[#fafafa] transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-[#262626] p-6 text-center border border-[#333333] hover:border-[#dc2626]/30 transition-all duration-300">
                <Mail size={22} className="text-[#dc2626] mx-auto mb-3" />
                <h3 className="text-[#fafafa] text-xs font-bold uppercase tracking-wider mb-1">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#737373] text-sm hover:text-[#fafafa] transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-[#262626] p-6 text-center border border-[#333333] hover:border-[#dc2626]/30 transition-all duration-300">
                <MapPin size={22} className="text-[#dc2626] mx-auto mb-3" />
                <h3 className="text-[#fafafa] text-xs font-bold uppercase tracking-wider mb-1">Address</h3>
                <p className="text-[#737373] text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#171717] border-t border-[#262626]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-[#fafafa] text-2xl font-black tracking-tight">{store.name}</span>
            <div className="flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#525252] hover:text-[#fafafa] text-xs uppercase tracking-wider font-bold transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#262626] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#525252] text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-8"><a href="#" className="text-[#525252] hover:text-[#fafafa] text-xs uppercase tracking-wider transition-colors">Privacy</a><a href="#" className="text-[#525252] hover:text-[#fafafa] text-xs uppercase tracking-wider transition-colors">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
