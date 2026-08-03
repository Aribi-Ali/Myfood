'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, Crown, MapPin, Phone, Mail, Clock, Flame } from 'lucide-react'
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

export function SteakhousePremiumTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-steakhouse/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  return (
    <div className="min-h-screen bg-[#1a0a00] text-[#e8dcc8]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-[#0d0500]/95 backdrop-blur-md shadow-lg shadow-black/50' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center gap-3">
              <Crown size={22} className={cn(scrolled ? 'text-[#c8a96e]' : 'text-[#c8a96e]')} />
              <span className={cn('text-lg font-bold tracking-wide', scrolled ? 'text-white' : 'text-[#e8dcc8]')}>{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-10">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className={cn('text-sm font-medium tracking-wider uppercase transition-colors duration-300', scrolled ? 'text-[#a09080] hover:text-[#c8a96e]' : 'text-[#a09080] hover:text-[#c8a96e]')}>{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-[#c8a96e] hover:bg-[#b89550] text-[#0d0500] px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#c8a96e]/20">
                <ShoppingBag size={16} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className={cn('md:hidden', scrolled ? 'text-white' : 'text-[#e8dcc8]')}><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-[#0d0500] border-t border-[#c8a96e]/20 flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#a09080] hover:text-[#c8a96e] text-sm font-medium uppercase tracking-wider">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-[#c8a96e] text-[#0d0500] px-5 py-3 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2"><ShoppingBag size={16} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt={store.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0500]/90 via-[#1a0a00]/70 to-[#0d0500]/95" />
        </div>
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23c8a96e\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M40 0l3.3 6.6 7.3 1.1-5.3 5.1 1.2 7.3L40 16.4l-6.5 3.7 1.2-7.3-5.3-5.1 7.3-1.1z\'/%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Flame size={20} className="text-[#c8a96e]" />
              <span className="text-[#c8a96e] text-sm font-bold tracking-[0.2em] uppercase">Steakhouse Premium &middot; Prime Excellence</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] text-white mb-6">{store.name}</h1>
            <p className="text-lg md:text-xl text-[#a09080] mb-8 leading-relaxed max-w-xl">{store.description || 'Prime cuts, chargrilled to perfection. An exquisite dining experience.'}</p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-[#0d0500]/60 backdrop-blur-sm px-4 py-2 border border-[#c8a96e]/30">
                <StarRating rating={store.avg_rating} size={16} activeColor="#c8a96e" inactiveColor="#4a3f35" />
                <span className="text-white text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-[#a09080]/50 text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="bg-[#c8a96e] hover:bg-[#b89550] text-[#0d0500] px-10 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-2xl hover:shadow-[#c8a96e]/30 hover:scale-105 flex items-center gap-2">
                <ShoppingBag size={18} /> Order Now
              </button>
              <a href="#menu" className="border border-[#c8a96e]/50 text-[#c8a96e] hover:bg-[#c8a96e]/10 px-10 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300">Explore Menu</a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24 bg-[#1a0a00]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#c8a96e] text-sm font-bold tracking-[0.2em] uppercase block mb-3">Prime Cuts</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">The Finest Steaks</h2>
            <div className="w-20 h-0.5 bg-[#c8a96e] mx-auto mt-6" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="group bg-[#2c1810] overflow-hidden border border-[#c8a96e]/20 hover:-translate-y-0.5 hover:border-[#c8a96e]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#c8a96e]/5">
                <div className="relative h-52 overflow-hidden">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-[#2c1810]"><Flame className="w-10 h-10 text-[#c8a96e]/40" /></div>
                  )}
                  {food.is_offer && <span className="absolute top-3 left-3 bg-[#c8a96e] text-[#0d0500] text-xs font-bold px-3 py-1 uppercase tracking-wider">Chef&apos;s Select</span>}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">{food.name}</h3>
                  {food.description && <p className="text-[#a09080]/70 text-sm mb-4 line-clamp-2">{food.description}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#c8a96e] text-lg font-bold">{formatFoodPrice(food, currency)}</span>
                      {food.new_price && <span className="text-[#a09080]/30 text-sm line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>}
                    </div>
                    <button onClick={() => onAddToCart?.(food.id)} className="bg-[#c8a96e] hover:bg-[#b89550] text-[#0d0500] px-4 py-2 text-xs font-bold uppercase tracking-wider active:scale-[0.97] transition-all duration-300 flex items-center gap-1">
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                  {food.cooking_time && <div className="flex items-center gap-1 mt-3 text-[#a09080]/40 text-xs"><Clock size={12} /> {food.cooking_time} min</div>}
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-16"><Crown size={48} className="mx-auto mb-4 text-[#c8a96e]/50" /><p className="text-[#a09080]/50 text-lg">Our premium menu is being prepared. Coming soon.</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-[#2c1810]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#c8a96e] text-sm font-bold tracking-[0.2em] uppercase block mb-3">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Connoisseur Reviews</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-[#1a0a00] p-8 border border-[#c8a96e]/20 hover:border-[#c8a96e]/40 transition-all duration-500">
                <div className="flex items-center gap-1 mb-4"><StarRating rating={review.rating} size={16} activeColor="#c8a96e" inactiveColor="#4a3f35" /></div>
                <p className="text-[#a09080]/80 text-base leading-relaxed mb-6 italic">&ldquo;{review.comment || 'Exquisite marbling, cooked to perfection. A carnivore\'s paradise.'}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2c1810] border border-[#c8a96e]/20 flex items-center justify-center">
                    <span className="text-[#c8a96e] text-sm font-bold">{review.user.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{review.user}</p>
                    <p className="text-[#a09080]/40 text-xs">Verified Guest</p>
                  </div>
                </div>
              </div>
            ))}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-[#1a0a00] p-8 border border-[#c8a96e]/20">
                <StarRating rating={5} size={16} activeColor="#c8a96e" inactiveColor="#4a3f35" />
                <p className="text-[#a09080]/80 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;Exquisite marbling, cooked to perfection. A carnivore\'s paradise.&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2c1810] border border-[#c8a96e]/20 flex items-center justify-center"><span className="text-[#c8a96e] text-sm font-bold">S</span></div>
                  <div><p className="text-white text-sm font-semibold">Steak Lover</p><p className="text-[#a09080]/40 text-xs">Verified</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-16 bg-[#1a0a00]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto bg-[#2c1810] p-8 border border-[#c8a96e]/20">
              <div className="flex items-center gap-3 mb-6 justify-center">
                <Clock size={20} className="text-[#c8a96e]" />
                <h3 className="text-white text-lg font-bold">Opening Hours</h3>
              </div>
              <div className="space-y-3">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between bg-[#1a0a00] px-5 py-3 border border-[#c8a96e]/10">
                    <span className="text-[#a09080] font-medium capitalize text-sm">{day}</span>
                    <span className="text-[#c8a96e] text-sm font-semibold">{hrs.open} &mdash; {hrs.close}</span>
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
            <span className="text-[#c8a96e] text-sm font-bold tracking-[0.2em] uppercase block mb-3">Connect</span>
            <h2 className="text-4xl font-bold text-white">Find Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {store.phone && (
              <div className="bg-[#1a0a00] p-8 text-center border border-[#c8a96e]/20 hover:border-[#c8a96e]/40 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-[#2c1810] flex items-center justify-center mx-auto mb-4 border border-[#c8a96e]/20"><Phone size={22} className="text-[#c8a96e]" /></div>
                <h3 className="text-white font-semibold mb-2 text-sm uppercase tracking-wider">Call</h3>
                <a href={`tel:${store.phone}`} className="text-[#a09080]/60 hover:text-[#c8a96e] text-sm transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-[#1a0a00] p-8 text-center border border-[#c8a96e]/20 hover:border-[#c8a96e]/40 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-[#2c1810] flex items-center justify-center mx-auto mb-4 border border-[#c8a96e]/20"><Mail size={22} className="text-[#c8a96e]" /></div>
                <h3 className="text-white font-semibold mb-2 text-sm uppercase tracking-wider">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#a09080]/60 hover:text-[#c8a96e] text-sm transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-[#1a0a00] p-8 text-center border border-[#c8a96e]/20 hover:border-[#c8a96e]/40 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-[#2c1810] flex items-center justify-center mx-auto mb-4 border border-[#c8a96e]/20"><MapPin size={22} className="text-[#c8a96e]" /></div>
                <h3 className="text-white font-semibold mb-2 text-sm uppercase tracking-wider">Address</h3>
                <p className="text-[#a09080]/60 text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#0d0500]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Crown size={20} className="text-[#c8a96e]" />
              <span className="text-white font-bold text-lg">{store.name}</span>
            </div>
            <div className="flex items-center gap-6">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#a09080]/60 hover:text-[#c8a96e] text-sm transition-colors uppercase tracking-wider">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#c8a96e]/20 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#a09080]/40 text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-6"><a href="#" className="text-[#a09080]/40 hover:text-[#c8a96e] text-xs transition-colors uppercase tracking-wider">Privacy Policy</a><a href="#" className="text-[#a09080]/40 hover:text-[#c8a96e] text-xs transition-colors uppercase tracking-wider">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
