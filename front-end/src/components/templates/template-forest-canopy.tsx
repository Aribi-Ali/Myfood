'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, TreePine, MapPin, Phone, Mail, Clock, Utensils, Leaf } from 'lucide-react'
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

export function ForestCanopyTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-forest/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  return (
    <div className="min-h-screen bg-[#ecfdf5] text-[#064e3b]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-[#064e3b]/95 backdrop-blur-md shadow-lg shadow-[#059669]/10' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <TreePine size={22} className={cn(scrolled ? 'text-[#34d399]' : 'text-[#059669]')} />
              <span className={cn('text-lg font-bold', scrolled ? 'text-white' : 'text-[#064e3b]')}>{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className={cn('text-sm font-medium transition-colors duration-300', scrolled ? 'text-[#a7f3d0] hover:text-[#34d399]' : 'text-[#065f46]/70 hover:text-[#059669]')}>{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-[#059669] hover:bg-[#047857] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg shadow-[#059669]/20">
                <ShoppingBag size={16} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className={cn('md:hidden', scrolled ? 'text-white' : 'text-[#064e3b]')}><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-[#064e3b] border-t border-[#059669]/30 flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#a7f3d0] hover:text-[#34d399] text-sm font-medium">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-[#059669] text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"><ShoppingBag size={16} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt={store.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#064e3b]/85 via-[#064e3b]/65 to-[#064e3b]/90" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(5,150,105,0.2)_0%,_transparent_70%)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <span className="text-[#34d399] text-sm font-semibold tracking-widest uppercase block mb-4">Forest Canopy &middot; Wild & Natural</span>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] text-white mb-6">{store.name}</h1>
            <p className="text-lg md:text-xl text-[#a7f3d0]/80 mb-8 leading-relaxed">{store.description || 'Rooted in nature. Every dish foraged from the finest ingredients.'}</p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-[#064e3b]/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-[#059669]/30">
                <StarRating rating={store.avg_rating} size={16} activeColor="#059669" inactiveColor="#a7f3d0" />
                <span className="text-white text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-[#a7f3d0]/50 text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="bg-[#059669] hover:bg-[#047857] text-white px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-2xl hover:shadow-[#059669]/40 flex items-center gap-2">
                <ShoppingBag size={18} /> Order Now
              </button>
              <a href="#menu" className="border-2 border-[#34d399]/50 text-[#34d399] hover:bg-[#34d399]/10 px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300">Explore Menu</a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#059669] text-sm font-semibold tracking-widest uppercase block mb-3">From the Forest</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#064e3b]">Nature&apos;s Bounty</h2>
            <div className="flex items-center justify-center gap-2 mt-6"><span className="w-3 h-3 rounded-full bg-[#059669]" /><span className="w-2 h-2 rounded-full bg-[#34d399]" /><span className="w-3 h-3 rounded-full bg-[#059669]" /></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="group bg-white rounded-2xl overflow-hidden border border-[#a7f3d0] hover:border-[#059669]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#059669]/10">
                <div className="relative h-52 overflow-hidden">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover transition-transform duration-700" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-[#d1fae5]"><Utensils className="w-10 h-10 text-[#34d399]/50" /></div>
                  )}
                  {food.is_offer && <span className="absolute top-3 left-3 bg-[#059669] text-white text-xs font-bold px-3 py-1 rounded-lg">Forest Find</span>}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#064e3b] mb-2">{food.name}</h3>
                  {food.description && <p className="text-[#065f46]/70 text-sm mb-4 line-clamp-2">{food.description}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#059669] text-lg font-bold">{formatFoodPrice(food, currency)}</span>
                      {food.new_price && <span className="text-[#065f46]/40 text-sm line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>}
                    </div>
                    <button onClick={() => onAddToCart?.(food.id)} className="bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-1">
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                  {food.cooking_time && <div className="flex items-center gap-1 mt-3 text-[#065f46]/50 text-xs"><Clock size={12} /> {food.cooking_time} min</div>}
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-16"><Leaf size={48} className="mx-auto mb-4 text-[#059669]/50" /><p className="text-[#065f46]/50 text-lg">Our forest kitchen is foraging fresh ingredients.</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-[#d1fae5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#059669] text-sm font-semibold tracking-widest uppercase block mb-3">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#064e3b]">Echoes from the Wild</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-white rounded-2xl p-8 border border-[#a7f3d0] hover:border-[#059669]/30 transition-all duration-500">
                <StarRating rating={review.rating} size={16} activeColor="#059669" inactiveColor="#a7f3d0" />
                <p className="text-[#065f46]/80 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;{review.comment || 'A true taste of the wild. Every dish tells a story of nature.'}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#d1fae5] border border-[#34d399]/30 flex items-center justify-center"><span className="text-[#059669] text-sm font-bold">{review.user.charAt(0)}</span></div>
                  <div><p className="text-[#064e3b] text-sm font-semibold">{review.user}</p><p className="text-[#065f46]/50 text-xs">Verified Guest</p></div>
                </div>
              </div>
            ))}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-[#a7f3d0]">
                <StarRating rating={5} size={16} activeColor="#059669" inactiveColor="#a7f3d0" />
                <p className="text-[#065f46]/80 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;A true taste of the wild. Every dish tells a story of nature.&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#d1fae5] border border-[#34d399]/30 flex items-center justify-center"><span className="text-[#059669] text-sm font-bold">F</span></div>
                  <div><p className="text-[#064e3b] text-sm font-semibold">Forager</p><p className="text-[#065f46]/50 text-xs">Verified</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto bg-[#ecfdf5] rounded-2xl p-8 border border-[#a7f3d0]">
              <div className="flex items-center gap-3 mb-6 justify-center">
                <Clock size={20} className="text-[#059669]" />
                <h3 className="text-[#064e3b] text-lg font-bold">Opening Hours</h3>
              </div>
              <div className="space-y-2">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-[#a7f3d0]/50 last:border-b-0">
                    <span className="text-[#065f46] font-medium capitalize text-sm">{day}</span>
                    <span className="text-[#059669] text-sm">{hrs.open} &mdash; {hrs.close}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-20 bg-[#d1fae5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#059669] text-sm font-semibold tracking-widest uppercase block mb-3">Connect with Nature</span>
            <h2 className="text-4xl font-bold text-[#064e3b]">Find Us in the Wild</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {store.phone && (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#a7f3d0] hover:border-[#059669]/40 transition-all duration-300">
                <Phone size={22} className="text-[#059669] mx-auto mb-4" />
                <h3 className="text-[#064e3b] font-semibold mb-2 text-sm">Call</h3>
                <a href={`tel:${store.phone}`} className="text-[#065f46]/70 hover:text-[#059669] text-sm transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#a7f3d0] hover:border-[#059669]/40 transition-all duration-300">
                <Mail size={22} className="text-[#059669] mx-auto mb-4" />
                <h3 className="text-[#064e3b] font-semibold mb-2 text-sm">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#065f46]/70 hover:text-[#059669] text-sm transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-white rounded-2xl p-8 text-center border border-[#a7f3d0] hover:border-[#059669]/40 transition-all duration-300">
                <MapPin size={22} className="text-[#059669] mx-auto mb-4" />
                <h3 className="text-[#064e3b] font-semibold mb-2 text-sm">Address</h3>
                <p className="text-[#065f46]/70 text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#064e3b]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <TreePine size={20} className="text-[#34d399]" />
              <span className="text-white font-bold text-lg">{store.name}</span>
            </div>
            <div className="flex items-center gap-6">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#a7f3d0]/60 hover:text-[#34d399] text-sm transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#059669]/20 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#a7f3d0]/30 text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-6"><a href="#" className="text-[#a7f3d0]/30 hover:text-[#34d399] text-xs transition-colors">Privacy</a><a href="#" className="text-[#a7f3d0]/30 hover:text-[#34d399] text-xs transition-colors">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
