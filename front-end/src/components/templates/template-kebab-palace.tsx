'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, Flame, MapPin, Phone, Mail, Clock, Utensils } from 'lucide-react'
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

export function KebabPalaceTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-kebab/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  return (
    <div className="min-h-screen bg-[#fef9e7] text-[#2d1b00]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-[#800020]/95 backdrop-blur-md shadow-lg' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Flame size={22} className={cn(scrolled ? 'text-[#d4af37]' : 'text-[#d4af37]')} />
              <span className={cn('text-lg font-bold', scrolled ? 'text-white' : 'text-[#fef9e7]')}>{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className={cn('text-sm font-medium transition-colors duration-300', scrolled ? 'text-[#fef9e7]/70 hover:text-[#d4af37]' : 'text-[#fef9e7]/80 hover:text-[#d4af37]')}>{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-[#d4af37] hover:bg-[#c4a030] text-[#2d1b00] px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg shadow-[#d4af37]/20">
                <ShoppingBag size={16} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className={cn('md:hidden', scrolled ? 'text-white' : 'text-[#fef9e7]')}><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-[#800020] border-t border-[#d4af37]/30 flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#fef9e7]/70 hover:text-[#d4af37] text-sm font-medium">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-[#d4af37] text-[#2d1b00] px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"><ShoppingBag size={16} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt={store.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2d1b00]/85 via-[#800020]/60 to-[#2d1b00]/90" />
        </div>
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Flame size={18} className="text-[#d4af37]" />
              <span className="text-[#d4af37] text-sm font-semibold tracking-widest uppercase">Kebab Palace &middot; Royal Flavors</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] text-white mb-6">{store.name}</h1>
            <p className="text-lg md:text-xl text-[#fef9e7]/80 mb-8 leading-relaxed max-w-xl">{store.description || 'Succulent meats grilled to perfection. A royal feast awaits.'}</p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-[#2d1b00]/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-[#d4af37]/30">
                <StarRating rating={store.avg_rating} size={16} activeColor="#d4af37" inactiveColor="#fef9e7" />
                <span className="text-white text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-[#fef9e7]/50 text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="bg-[#d4af37] hover:bg-[#c4a030] text-[#2d1b00] px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-2xl hover:shadow-[#d4af37]/40 hover:scale-105 flex items-center gap-2">
                <ShoppingBag size={18} /> Order Now
              </button>
              <a href="#menu" className="border-2 border-[#d4af37]/50 text-[#d4af37] hover:bg-[#d4af37]/10 px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300">Explore Menu</a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#800020] text-sm font-semibold tracking-widest uppercase block mb-3">From the Grill</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d1b00]">Royal Specialties</h2>
            <div className="w-16 h-1 bg-[#800020] mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="group bg-white rounded-3xl overflow-hidden border border-[#fef9e7]/50 hover:border-[#d4af37]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#d4af37]/10">
                <div className="relative h-52 overflow-hidden">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-[#fef9e7]"><Utensils className="w-10 h-10 text-[#d4af37]/50" /></div>
                  )}
                  {food.is_offer && <span className="absolute top-3 left-3 bg-[#800020] text-white text-xs font-bold px-3 py-1 rounded-full">Royal Deal</span>}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#2d1b00] mb-2">{food.name}</h3>
                  {food.description && <p className="text-[#2d1b00]/60 text-sm mb-4 line-clamp-2">{food.description}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#800020] text-lg font-bold">{formatFoodPrice(food, currency)}</span>
                      {food.new_price && <span className="text-[#2d1b00]/40 text-sm line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>}
                    </div>
                    <button onClick={() => onAddToCart?.(food.id)} className="bg-[#800020] hover:bg-[#600018] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-1">
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                  {food.cooking_time && <div className="flex items-center gap-1 mt-3 text-[#2d1b00]/40 text-xs"><Clock size={12} /> {food.cooking_time} min</div>}
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-16"><Flame size={48} className="mx-auto mb-4 text-[#800020]/50" /><p className="text-[#2d1b00]/50 text-lg">Our grill is heating up. Check back soon!</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#800020] text-sm font-semibold tracking-widest uppercase block mb-3">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#2d1b00]">Royal Feedback</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-[#fef9e7] rounded-3xl p-8 border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all duration-500">
                <div className="flex items-center gap-1 mb-4"><StarRating rating={review.rating} size={16} activeColor="#d4af37" inactiveColor="#fef9e7" /></div>
                <p className="text-[#2d1b00]/70 text-base leading-relaxed mb-6 italic">&ldquo;{review.comment || 'The kebabs are out of this world. Truly royal flavors!'}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fef9e7] border border-[#d4af37]/30 flex items-center justify-center">
                    <span className="text-[#800020] text-sm font-bold">{review.user.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-[#2d1b00] text-sm font-semibold">{review.user}</p>
                    <p className="text-[#2d1b00]/50 text-xs">Verified Guest</p>
                  </div>
                </div>
              </div>
            ))}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-[#fef9e7] rounded-3xl p-8 border border-[#d4af37]/20">
                <StarRating rating={5} size={16} activeColor="#d4af37" inactiveColor="#fef9e7" />
                <p className="text-[#2d1b00]/70 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;The kebabs are out of this world. Truly royal flavors!&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fef9e7] border border-[#d4af37]/30 flex items-center justify-center"><span className="text-[#800020] text-sm font-bold">K</span></div>
                  <div><p className="text-[#2d1b00] text-sm font-semibold">Kebab Lover</p><p className="text-[#2d1b00]/50 text-xs">Verified</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-16 bg-[#fef9e7]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 border border-[#d4af37]/20">
              <div className="flex items-center gap-3 mb-6 justify-center">
                <Clock size={20} className="text-[#800020]" />
                <h3 className="text-[#2d1b00] text-lg font-bold">Opening Hours</h3>
              </div>
              <div className="space-y-3">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between bg-[#fef9e7] rounded-xl px-5 py-3 border border-[#d4af37]/20">
                    <span className="text-[#2d1b00] font-medium capitalize text-sm">{day}</span>
                    <span className="text-[#800020] text-sm font-semibold">{hrs.open} &mdash; {hrs.close}</span>
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
            <span className="text-[#800020] text-sm font-semibold tracking-widest uppercase block mb-3">Connect</span>
            <h2 className="text-4xl font-bold text-[#2d1b00]">Find Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {store.phone && (
              <div className="bg-[#fef9e7] rounded-2xl p-8 text-center border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto mb-4"><Phone size={22} className="text-[#800020]" /></div>
                <h3 className="text-[#2d1b00] font-semibold mb-2 text-sm">Call</h3>
                <a href={`tel:${store.phone}`} className="text-[#2d1b00]/60 hover:text-[#800020] text-sm transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-[#fef9e7] rounded-2xl p-8 text-center border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto mb-4"><Mail size={22} className="text-[#800020]" /></div>
                <h3 className="text-[#2d1b00] font-semibold mb-2 text-sm">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#2d1b00]/60 hover:text-[#800020] text-sm transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-[#fef9e7] rounded-2xl p-8 text-center border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto mb-4"><MapPin size={22} className="text-[#800020]" /></div>
                <h3 className="text-[#2d1b00] font-semibold mb-2 text-sm">Address</h3>
                <p className="text-[#2d1b00]/60 text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#800020]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Flame size={20} className="text-[#d4af37]" />
              <span className="text-white font-bold text-lg">{store.name}</span>
            </div>
            <div className="flex items-center gap-6">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#fef9e7]/60 hover:text-[#d4af37] text-sm transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#d4af37]/20 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#fef9e7]/40 text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-6"><a href="#" className="text-[#fef9e7]/40 hover:text-[#d4af37] text-xs transition-colors">Privacy Policy</a><a href="#" className="text-[#fef9e7]/40 hover:text-[#d4af37] text-xs transition-colors">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
