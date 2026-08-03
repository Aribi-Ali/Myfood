'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, Sun, MapPin, Phone, Mail, Clock, Utensils, ArrowRight } from 'lucide-react'
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

export function SunsetGlowTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-sunset/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  return (
    <div className="min-h-screen bg-[#fff7ed] text-[#431407]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-white/80 backdrop-blur-xl shadow-md shadow-[#f97316]/10' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Sun size={22} className="text-[#f97316]" />
              <span className="text-lg font-bold text-[#431407]">{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#7c2d12]/70 hover:text-[#ea580c] text-sm font-medium transition-colors duration-300">{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#f97316] to-[#d946ef] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#f97316]/30">
                <ShoppingBag size={16} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[#431407]"><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-white/95 backdrop-blur-xl border-t border-[#f97316]/10 flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#7c2d12]/70 hover:text-[#ea580c] text-sm font-medium">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-gradient-to-r from-[#f97316] to-[#d946ef] text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"><ShoppingBag size={16} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f97316] via-[#d946ef] to-[#6366f1]" />
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-10 right-20 w-80 h-80 bg-yellow-300 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-pink-300 rounded-full blur-3xl" />
        </div>
        {heroBg && <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <span className="text-white/80 text-sm font-medium tracking-wider uppercase mb-4 block backdrop-blur-sm bg-white/10 rounded-full px-4 py-1.5 inline-flex items-center gap-2"><Sun size={14} /> Sunset Glow</span>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] text-white mb-6">{store.name}</h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">{store.description || 'Where the sun meets the plate. Tropical flavors that glow.'}</p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <StarRating rating={store.avg_rating} size={16} activeColor="#f97316" inactiveColor="#fed7aa" />
                <span className="text-white text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-white/60 text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="bg-white text-[#ea580c] px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center gap-2">
                <ShoppingBag size={18} /> Order Now
              </button>
              <a href="#menu" className="border-2 border-white/40 text-white hover:bg-white/10 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300">View Menu</a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#ea580c] text-sm font-semibold tracking-wider uppercase block mb-3">Golden Hour Menu</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#431407]">Sunset Specialties</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#f97316] via-[#d946ef] to-[#6366f1] mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="group bg-white/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-[#fed7aa] hover:border-[#f97316]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#f97316]/10">
                <div className="relative h-52 overflow-hidden">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#fff7ed] to-[#fef3c7]"><Utensils className="w-10 h-10 text-[#f97316]/40" /></div>
                  )}
                  {food.is_offer && <span className="absolute top-3 left-3 bg-gradient-to-r from-[#f97316] to-[#d946ef] text-white text-xs font-bold px-3 py-1 rounded-full">Sunset Deal</span>}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#431407] mb-2">{food.name}</h3>
                  {food.description && <p className="text-[#7c2d12]/60 text-sm mb-4 line-clamp-2">{food.description}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#ea580c] text-lg font-bold">{formatFoodPrice(food, currency)}</span>
                      {food.new_price && <span className="text-[#7c2d12]/40 text-sm line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>}
                    </div>
                    <button onClick={() => onAddToCart?.(food.id)} className="bg-gradient-to-r from-[#f97316] to-[#d946ef] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 hover:shadow-lg flex items-center gap-1">
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                  {food.cooking_time && <div className="flex items-center gap-1 mt-3 text-[#7c2d12]/50 text-xs"><Clock size={12} /> {food.cooking_time} min</div>}
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-16"><Sun size={48} className="mx-auto mb-4 text-[#f97316]/50" /><p className="text-[#7c2d12]/50 text-lg">Our sunset menu is glowing up. Coming soon!</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-gradient-to-br from-[#fff7ed] via-white to-[#fef3c7]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#d946ef] text-sm font-semibold tracking-wider uppercase block mb-3">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#431407]">Golden Reviews</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.reviews.slice(0, 3).map((review, i) => {
              const gradients = ['from-[#f97316]/10 to-[#d946ef]/10', 'from-[#d946ef]/10 to-[#6366f1]/10', 'from-[#6366f1]/10 to-[#f97316]/10']
              return (
                <div key={review.id} className={`bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-[#fed7aa] hover:border-[#f97316]/30 transition-all duration-500 bg-gradient-to-br ${gradients[i % 3]}`}>
                  <StarRating rating={review.rating} size={16} activeColor="#f97316" inactiveColor="#fed7aa" />
                  <p className="text-[#7c2d12]/80 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;{review.comment || 'The sunset views and the food — absolute paradise!'}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f97316] to-[#d946ef] flex items-center justify-center"><span className="text-white text-sm font-bold">{review.user.charAt(0)}</span></div>
                    <div><p className="text-[#431407] text-sm font-semibold">{review.user}</p><p className="text-[#7c2d12]/50 text-xs">Verified Guest</p></div>
                  </div>
                </div>
              )
            })}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-[#fed7aa]">
                <StarRating rating={5} size={16} activeColor="#f97316" inactiveColor="#fed7aa" />
                <p className="text-[#7c2d12]/80 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;The sunset views and the food — absolute paradise!&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f97316] to-[#d946ef] flex items-center justify-center"><span className="text-white text-sm font-bold">S</span></div>
                  <div><p className="text-[#431407] text-sm font-semibold">Sunset Fan</p><p className="text-[#7c2d12]/50 text-xs">Verified</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-16 bg-white/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto bg-white/70 backdrop-blur-lg rounded-3xl p-8 border border-[#fed7aa]">
              <div className="flex items-center gap-3 mb-6 justify-center">
                <Clock size={20} className="text-[#f97316]" />
                <h3 className="text-[#431407] text-lg font-bold">Opening Hours</h3>
              </div>
              <div className="space-y-2">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-[#fed7aa]/50 last:border-b-0">
                    <span className="text-[#7c2d12] font-medium capitalize text-sm">{day}</span>
                    <span className="text-[#ea580c] text-sm">{hrs.open} &mdash; {hrs.close}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-20 bg-gradient-to-br from-[#fff7ed] to-[#fef3c7]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#6366f1] text-sm font-semibold tracking-wider uppercase block mb-3">Contact</span>
            <h2 className="text-4xl font-black text-[#431407]">Reach Out</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {store.phone && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-[#fed7aa] hover:border-[#f97316]/40 transition-all duration-300">
                <Phone size={22} className="text-[#f97316] mx-auto mb-4" />
                <h3 className="text-[#431407] font-semibold mb-2 text-sm">Call</h3>
                <a href={`tel:${store.phone}`} className="text-[#7c2d12]/70 hover:text-[#ea580c] text-sm transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-[#fed7aa] hover:border-[#f97316]/40 transition-all duration-300">
                <Mail size={22} className="text-[#f97316] mx-auto mb-4" />
                <h3 className="text-[#431407] font-semibold mb-2 text-sm">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#7c2d12]/70 hover:text-[#ea580c] text-sm transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-[#fed7aa] hover:border-[#f97316]/40 transition-all duration-300">
                <MapPin size={22} className="text-[#f97316] mx-auto mb-4" />
                <h3 className="text-[#431407] font-semibold mb-2 text-sm">Address</h3>
                <p className="text-[#7c2d12]/70 text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-[#f97316] via-[#d946ef] to-[#6366f1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Sun size={20} className="text-white/80" />
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
