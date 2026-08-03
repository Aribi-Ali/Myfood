'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, UtensilsCrossed, MapPin, Phone, Mail, Clock, Utensils, Wheat } from 'lucide-react'
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

export function MargheritaBlissTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-margherita/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  return (
    <div className="min-h-screen bg-[#fff8f0] text-[#3e2c20]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <UtensilsCrossed size={22} className={cn(scrolled ? 'text-[#d32f2f]' : 'text-[#d32f2f]')} />
              <span className={cn('text-lg font-bold', scrolled ? 'text-[#3e2c20]' : 'text-white')}>{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className={cn('text-sm font-medium transition-colors duration-300', scrolled ? 'text-[#6d5a4a] hover:text-[#d32f2f]' : 'text-white/70 hover:text-white')}>{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-[#d32f2f] hover:bg-[#b71c1c] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg shadow-[#d32f2f]/20">
                <ShoppingBag size={16} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className={cn('md:hidden', scrolled ? 'text-[#3e2c20]' : 'text-white')}><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-white border-t border-[#d32f2f]/20 flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#6d5a4a] hover:text-[#d32f2f] text-sm font-medium">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-[#d32f2f] text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"><ShoppingBag size={16} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt={store.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#fff8f0]/90" />
        </div>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d32f2f\' fill-opacity=\'0.12\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'3\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Wheat size={18} className="text-[#b8860b]" />
              <span className="text-[#b8860b] text-sm font-semibold tracking-widest uppercase">Margherita Bliss &middot; Taste of Italy</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] text-white mb-6">{store.name}</h1>
            <p className="text-lg md:text-xl text-white/70 mb-8 leading-relaxed max-w-xl">{store.description || 'Hand-tossed perfection. The finest Italian ingredients since day one.'}</p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <StarRating rating={store.avg_rating} size={16} activeColor="#d32f2f" inactiveColor="#d32f2f" />
                <span className="text-white text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-white/40 text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-2xl hover:shadow-[#d32f2f]/40 hover:scale-105 flex items-center gap-2">
                <ShoppingBag size={18} /> Order Now
              </button>
              <a href="#menu" className="border-2 border-white/40 text-white hover:bg-white/10 px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300">Explore Menu</a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#d32f2f] text-sm font-semibold tracking-widest uppercase block mb-3">Our Menu</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#3e2c20]">Authentic Italian Classics</h2>
            <div className="w-16 h-1 bg-[#d32f2f] mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="group bg-white rounded-3xl overflow-hidden border border-[#e0d5c8] hover:border-[#d32f2f]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#d32f2f]/5">
                <div className="relative h-52 overflow-hidden">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-[#fff8f0]"><Utensils className="w-10 h-10 text-[#d32f2f]/30" /></div>
                  )}
                  {food.is_offer && <span className="absolute top-3 left-3 bg-[#2e7d32] text-white text-xs font-bold px-3 py-1 rounded-full">Fresh Pick</span>}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#3e2c20] mb-2">{food.name}</h3>
                  {food.description && <p className="text-[#6d5a4a]/70 text-sm mb-4 line-clamp-2">{food.description}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#d32f2f] text-lg font-bold">{formatFoodPrice(food, currency)}</span>
                      {food.new_price && <span className="text-[#6d5a4a]/40 text-sm line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>}
                    </div>
                    <button onClick={() => onAddToCart?.(food.id)} className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-1">
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                  {food.cooking_time && <div className="flex items-center gap-1 mt-3 text-[#6d5a4a]/50 text-xs"><Clock size={12} /> {food.cooking_time} min</div>}
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-16"><UtensilsCrossed size={48} className="mx-auto mb-4 text-[#d32f2f]/50" /><p className="text-[#6d5a4a]/50 text-lg">Our menu is being prepared. Check back soon!</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#d32f2f] text-sm font-semibold tracking-widest uppercase block mb-3">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#3e2c20]">What Our Guests Say</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-[#fff8f0] rounded-3xl p-8 border border-[#e0d5c8] hover:border-[#d32f2f]/20 transition-all duration-500">
                <div className="flex items-center gap-1 mb-4"><StarRating rating={review.rating} size={16} activeColor="#d32f2f" inactiveColor="#d32f2f" /></div>
                <p className="text-[#6d5a4a]/80 text-base leading-relaxed mb-6 italic">&ldquo;{review.comment || 'The best pizza this side of Naples. Perfectly crispy crust and fresh toppings.'}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#d32f2f]/20 flex items-center justify-center">
                    <span className="text-[#d32f2f] text-sm font-bold">{review.user.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-[#3e2c20] text-sm font-semibold">{review.user}</p>
                    <p className="text-[#6d5a4a]/50 text-xs">Verified Guest</p>
                  </div>
                </div>
              </div>
            ))}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-[#fff8f0] rounded-3xl p-8 border border-[#e0d5c8]">
                <StarRating rating={5} size={16} activeColor="#d32f2f" inactiveColor="#d32f2f" />
                <p className="text-[#6d5a4a]/80 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;The best pizza this side of Naples. Perfectly crispy crust and fresh toppings.&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#d32f2f]/20 flex items-center justify-center"><span className="text-[#d32f2f] text-sm font-bold">P</span></div>
                  <div><p className="text-[#3e2c20] text-sm font-semibold">Pizza Lover</p><p className="text-[#6d5a4a]/50 text-xs">Verified</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-16 bg-[#fff8f0]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 border border-[#e0d5c8]">
              <div className="flex items-center gap-3 mb-6 justify-center">
                <Clock size={20} className="text-[#d32f2f]" />
                <h3 className="text-[#3e2c20] text-lg font-bold">Opening Hours</h3>
              </div>
              <div className="space-y-3">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between bg-[#fff8f0] rounded-xl px-5 py-3 border border-[#e0d5c8]/50">
                    <span className="text-[#6d5a4a] font-medium capitalize text-sm">{day}</span>
                    <span className="text-[#d32f2f] text-sm font-semibold">{hrs.open} &mdash; {hrs.close}</span>
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
            <span className="text-[#d32f2f] text-sm font-semibold tracking-widest uppercase block mb-3">Connect</span>
            <h2 className="text-4xl font-bold text-[#3e2c20]">Find Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {store.phone && (
              <div className="bg-[#fff8f0] rounded-2xl p-8 text-center border border-[#e0d5c8] hover:border-[#d32f2f]/30 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto mb-4"><Phone size={22} className="text-[#d32f2f]" /></div>
                <h3 className="text-[#3e2c20] font-semibold mb-2 text-sm">Call</h3>
                <a href={`tel:${store.phone}`} className="text-[#6d5a4a]/70 hover:text-[#d32f2f] text-sm transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-[#fff8f0] rounded-2xl p-8 text-center border border-[#e0d5c8] hover:border-[#d32f2f]/30 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto mb-4"><Mail size={22} className="text-[#d32f2f]" /></div>
                <h3 className="text-[#3e2c20] font-semibold mb-2 text-sm">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#6d5a4a]/70 hover:text-[#d32f2f] text-sm transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-[#fff8f0] rounded-2xl p-8 text-center border border-[#e0d5c8] hover:border-[#d32f2f]/30 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto mb-4"><MapPin size={22} className="text-[#d32f2f]" /></div>
                <h3 className="text-[#3e2c20] font-semibold mb-2 text-sm">Address</h3>
                <p className="text-[#6d5a4a]/70 text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#3e2c20]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <UtensilsCrossed size={20} className="text-[#b8860b]" />
              <span className="text-white font-bold text-lg">{store.name}</span>
            </div>
            <div className="flex items-center gap-6">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-white/50 hover:text-[#b8860b] text-sm transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-6"><a href="#" className="text-white/30 hover:text-[#b8860b] text-xs transition-colors">Privacy Policy</a><a href="#" className="text-white/30 hover:text-[#b8860b] text-xs transition-colors">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
