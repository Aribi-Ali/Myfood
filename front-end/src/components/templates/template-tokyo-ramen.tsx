'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, ChefHat, MapPin, Phone, Mail, Clock, Utensils, Flame } from 'lucide-react'
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

export function TokyoRamenTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-tokyo/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  return (
    <div className="min-h-screen bg-[#1a0e08] text-[#d4a574]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-[#2c1810]/95 backdrop-blur-md shadow-lg' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <ChefHat size={22} className={cn(scrolled ? 'text-[#c17f3a]' : 'text-[#c17f3a]')} />
              <span className={cn('text-lg font-bold', scrolled ? 'text-[#d4a574]' : 'text-[#d4a574]')}>{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className={cn('text-sm font-medium transition-colors duration-300', scrolled ? 'text-[#d4a574]/70 hover:text-[#c17f3a]' : 'text-[#d4a574]/60 hover:text-[#c17f3a]')}>{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-[#c17f3a] hover:bg-[#d4a574] text-[#1a0e08] px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg shadow-[#c17f3a]/20">
                <ShoppingBag size={16} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className={cn('md:hidden', scrolled ? 'text-[#d4a574]' : 'text-[#d4a574]')}><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-[#2c1810] border-t border-[#c17f3a]/30 flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#d4a574]/70 hover:text-[#c17f3a] text-sm font-medium">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-[#c17f3a] text-[#1a0e08] px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"><ShoppingBag size={16} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt={store.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a0e08]/90 via-[#1a0e08]/60 to-[#1a0e08]/80" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c17f3a\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M0 0h40v40H0V0zm20 20h-8v-8h8v8zm0-20h-8v8h8V0zM0 20h8v-8H0v8z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Flame size={18} className="text-[#c17f3a]" />
              <span className="text-[#c17f3a] text-sm font-semibold tracking-widest uppercase">Tokyo Ramen &middot; Authentic Japanese Flavors</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] text-white mb-6">{store.name}</h1>
            <p className="text-lg md:text-xl text-[#d4a574]/80 mb-8 leading-relaxed max-w-xl">{store.description || 'Rich broths simmered to perfection. Authentic ramen crafted with tradition.'}</p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-[#1a0e08]/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-[#c17f3a]/30">
                <StarRating rating={store.avg_rating} size={16} activeColor="#c17f3a" inactiveColor="rgba(212,165,116,0.4)" />
                <span className="text-white text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-[#d4a574]/50 text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="bg-[#c17f3a] hover:bg-[#d4a574] text-[#1a0e08] px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-2xl hover:shadow-[#c17f3a]/40 hover:scale-105 flex items-center gap-2">
                <ShoppingBag size={18} /> Order Now
              </button>
              <a href="#menu" className="border-2 border-[#c17f3a]/50 text-[#c17f3a] hover:bg-[#c17f3a]/10 px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300">Explore Menu</a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24 bg-[#1a0e08]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#c17f3a] text-sm font-semibold tracking-widest uppercase block mb-3">From Our Kitchen</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Ramen & Specialties</h2>
            <div className="w-16 h-1 bg-[#c17f3a] mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="group bg-[#2c1810] rounded-3xl overflow-hidden border border-[#c17f3a]/20 hover:border-[#c17f3a]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#c17f3a]/10">
                <div className="relative h-52 overflow-hidden">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-[#1a0e08]"><Utensils className="w-10 h-10 text-[#c17f3a]/50" /></div>
                  )}
                  {food.is_offer && <span className="absolute top-3 left-3 bg-[#c17f3a] text-[#1a0e08] text-xs font-bold px-3 py-1 rounded-full">Chef Special</span>}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#d4a574] mb-2">{food.name}</h3>
                  {food.description && <p className="text-[#d4a574]/60 text-sm mb-4 line-clamp-2">{food.description}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#c17f3a] text-lg font-bold">{formatFoodPrice(food, currency)}</span>
                      {food.new_price && <span className="text-[#d4a574]/40 text-sm line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>}
                    </div>
                    <button onClick={() => onAddToCart?.(food.id)} className="bg-[#c17f3a] hover:bg-[#d4a574] text-[#1a0e08] px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-1">
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                  {food.cooking_time && <div className="flex items-center gap-1 mt-3 text-[#d4a574]/40 text-xs"><Clock size={12} /> {food.cooking_time} min</div>}
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-16"><ChefHat size={48} className="mx-auto mb-4 text-[#c17f3a]/50" /><p className="text-[#d4a574]/50 text-lg">Our ramen menu is being prepared. Check back soon!</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-[#2c1810]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#c17f3a] text-sm font-semibold tracking-widest uppercase block mb-3">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">What Our Guests Say</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-[#1a0e08] rounded-3xl p-8 border border-[#c17f3a]/20 hover:border-[#c17f3a]/30 transition-all duration-500">
                <div className="flex items-center gap-1 mb-4"><StarRating rating={review.rating} size={16} activeColor="#c17f3a" inactiveColor="rgba(212,165,116,0.4)" /></div>
                <p className="text-[#d4a574]/80 text-base leading-relaxed mb-6 italic">&ldquo;{review.comment || 'The broth was incredibly rich. Authentic taste of Tokyo in every bowl.'}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2c1810] border border-[#c17f3a]/30 flex items-center justify-center">
                    <span className="text-[#c17f3a] text-sm font-bold">{review.user.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-[#d4a574] text-sm font-semibold">{review.user}</p>
                    <p className="text-[#d4a574]/50 text-xs">Verified Guest</p>
                  </div>
                </div>
              </div>
            ))}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-[#1a0e08] rounded-3xl p-8 border border-[#c17f3a]/20">
                <StarRating rating={5} size={16} activeColor="#c17f3a" inactiveColor="rgba(212,165,116,0.4)" />
                <p className="text-[#d4a574]/80 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;The broth was incredibly rich. Authentic taste of Tokyo in every bowl.&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2c1810] border border-[#c17f3a]/30 flex items-center justify-center"><span className="text-[#c17f3a] text-sm font-bold">R</span></div>
                  <div><p className="text-[#d4a574] text-sm font-semibold">Ramen Lover</p><p className="text-[#d4a574]/50 text-xs">Verified</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-16 bg-[#1a0e08]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto bg-[#2c1810] rounded-3xl p-8 border border-[#c17f3a]/20">
              <div className="flex items-center gap-3 mb-6 justify-center">
                <Clock size={20} className="text-[#c17f3a]" />
                <h3 className="text-[#d4a574] text-lg font-bold">Opening Hours</h3>
              </div>
              <div className="space-y-3">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between bg-[#1a0e08] rounded-xl px-5 py-3 border border-[#c17f3a]/20">
                    <span className="text-[#d4a574]/70 font-medium capitalize text-sm">{day}</span>
                    <span className="text-[#c17f3a] text-sm font-semibold">{hrs.open} &mdash; {hrs.close}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-20 bg-[#2c1810]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#c17f3a] text-sm font-semibold tracking-widest uppercase block mb-3">Connect</span>
            <h2 className="text-4xl font-bold text-white">Find Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {store.phone && (
              <div className="bg-[#1a0e08] rounded-2xl p-8 text-center border border-[#c17f3a]/20 hover:border-[#c17f3a]/40 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-[#2c1810] flex items-center justify-center mx-auto mb-4"><Phone size={22} className="text-[#c17f3a]" /></div>
                <h3 className="text-[#d4a574] font-semibold mb-2 text-sm">Call</h3>
                <a href={`tel:${store.phone}`} className="text-[#d4a574]/60 hover:text-[#c17f3a] text-sm transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-[#1a0e08] rounded-2xl p-8 text-center border border-[#c17f3a]/20 hover:border-[#c17f3a]/40 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-[#2c1810] flex items-center justify-center mx-auto mb-4"><Mail size={22} className="text-[#c17f3a]" /></div>
                <h3 className="text-[#d4a574] font-semibold mb-2 text-sm">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#d4a574]/60 hover:text-[#c17f3a] text-sm transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-[#1a0e08] rounded-2xl p-8 text-center border border-[#c17f3a]/20 hover:border-[#c17f3a]/40 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-[#2c1810] flex items-center justify-center mx-auto mb-4"><MapPin size={22} className="text-[#c17f3a]" /></div>
                <h3 className="text-[#d4a574] font-semibold mb-2 text-sm">Address</h3>
                <p className="text-[#d4a574]/60 text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#2c1810] border-t border-[#c17f3a]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <ChefHat size={20} className="text-[#c17f3a]" />
              <span className="text-[#d4a574] font-bold text-lg">{store.name}</span>
            </div>
            <div className="flex items-center gap-6">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#d4a574]/50 hover:text-[#c17f3a] text-sm transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#c17f3a]/20 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#d4a574]/30 text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-6"><a href="#" className="text-[#d4a574]/30 hover:text-[#c17f3a] text-xs transition-colors">Privacy Policy</a><a href="#" className="text-[#d4a574]/30 hover:text-[#c17f3a] text-xs transition-colors">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
