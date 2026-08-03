'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, Wheat, MapPin, Phone, Mail, Clock, Utensils, ArrowRight } from 'lucide-react'
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

export function HarvestGoldTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-harvest/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  return (
    <div className="min-h-screen bg-[#fffbeb] text-[#451a03]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-[#451a03]/95 backdrop-blur-md shadow-lg' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Wheat size={20} className={cn(scrolled ? 'text-[#fbbf24]' : 'text-[#d97706]')} />
              <span className={cn('text-lg font-bold', scrolled ? 'text-white' : 'text-[#451a03]')}>{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className={cn('text-sm font-medium transition-colors duration-300', scrolled ? 'text-[#fde68a] hover:text-[#fbbf24]' : 'text-[#78350f]/70 hover:text-[#451a03]')}>{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-[#d97706] hover:bg-[#b45309] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg shadow-[#d97706]/30">
                <ShoppingBag size={16} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className={cn('md:hidden', scrolled ? 'text-white' : 'text-[#451a03]')}><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-[#451a03] border-t border-[#d97706]/30 flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#fde68a] hover:text-[#fbbf24] text-sm font-medium">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-[#d97706] text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"><ShoppingBag size={16} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt={store.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#451a03]/90 via-[#78350f]/70 to-[#451a03]/85" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, #fbbf24 20px, #fbbf24 21px)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <span className="text-[#fbbf24] text-sm font-semibold tracking-widest uppercase block mb-4">Harvest Gold &middot; Farm Fresh</span>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] text-white mb-6">{store.name}</h1>
            <p className="text-lg md:text-xl text-[#fde68a]/80 mb-8 leading-relaxed">{store.description || 'From our fields to your table. Farm-fresh goodness in every bite.'}</p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-[#451a03]/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-[#d97706]/40">
                <StarRating rating={store.avg_rating} size={16} activeColor="#d97706" inactiveColor="#fde68a" />
                <span className="text-[#fbbf24] text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-[#fde68a]/50 text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="bg-[#d97706] hover:bg-[#b45309] text-white px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-2xl hover:shadow-[#d97706]/40 hover:scale-105 flex items-center gap-2">
                <ShoppingBag size={18} /> Order Now
              </button>
              <a href="#menu" className="border-2 border-[#fbbf24]/50 text-[#fbbf24] hover:bg-[#fbbf24]/10 px-8 py-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300">See Menu</a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#d97706] text-sm font-semibold tracking-widest uppercase block mb-3">The Harvest</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#451a03]">Season&apos;s Best</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#d97706] to-[#fbbf24] mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="group bg-[#fffcf0] rounded-xl overflow-hidden border border-[#fde68a] hover:border-[#d97706]/50 transition-all duration-500 hover:shadow-lg hover:shadow-[#d97706]/10">
                <div className="relative h-52 overflow-hidden">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-[#fef3c7]"><Utensils className="w-10 h-10 text-[#d97706]/40" /></div>
                  )}
                  {food.is_offer && <span className="absolute top-3 left-3 bg-[#d97706] text-white text-xs font-bold px-3 py-1 rounded-lg">Farm Pick</span>}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#451a03] mb-2">{food.name}</h3>
                  {food.description && <p className="text-[#78350f]/60 text-sm mb-4 line-clamp-2">{food.description}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#d97706] text-lg font-bold">{formatFoodPrice(food, currency)}</span>
                      {food.new_price && <span className="text-[#78350f]/40 text-sm line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>}
                    </div>
                    <button onClick={() => onAddToCart?.(food.id)} className="bg-[#d97706] hover:bg-[#b45309] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-1">
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                  {food.cooking_time && <div className="flex items-center gap-1 mt-3 text-[#78350f]/50 text-xs"><Clock size={12} /> {food.cooking_time} min</div>}
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-16"><Wheat size={48} className="mx-auto mb-4 text-[#d97706]/50" /><p className="text-[#78350f]/50 text-lg">Our harvest is ripening. Come back soon!</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-[#fffbeb]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#d97706] text-sm font-semibold tracking-widest uppercase block mb-3">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#451a03]">Our Harvest Stories</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-[#fffcf0] rounded-xl p-8 border border-[#fde68a] hover:border-[#d97706]/30 transition-all duration-500">
                <StarRating rating={review.rating} size={16} activeColor="#d97706" inactiveColor="#fde68a" />
                <p className="text-[#78350f]/80 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;{review.comment || 'The freshest farm-to-table experience. Pure golden goodness!'}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fef3c7] border border-[#d97706]/30 flex items-center justify-center"><span className="text-[#d97706] text-sm font-bold">{review.user.charAt(0)}</span></div>
                  <div><p className="text-[#451a03] text-sm font-semibold">{review.user}</p><p className="text-[#78350f]/50 text-xs">Verified Guest</p></div>
                </div>
              </div>
            ))}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-[#fffcf0] rounded-xl p-8 border border-[#fde68a]">
                <StarRating rating={5} size={16} activeColor="#d97706" inactiveColor="#fde68a" />
                <p className="text-[#78350f]/80 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;The freshest farm-to-table experience. Pure golden goodness!&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fef3c7] border border-[#d97706]/30 flex items-center justify-center"><span className="text-[#d97706] text-sm font-bold">F</span></div>
                  <div><p className="text-[#451a03] text-sm font-semibold">Farmer&apos;s Friend</p><p className="text-[#78350f]/50 text-xs">Verified</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto bg-[#fffbeb] rounded-xl p-8 border border-[#fde68a]">
              <div className="flex items-center gap-3 mb-6 justify-center">
                <Clock size={20} className="text-[#d97706]" />
                <h3 className="text-[#451a03] text-lg font-bold">Opening Hours</h3>
              </div>
              <div className="space-y-2">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-[#fde68a]/50 last:border-b-0">
                    <span className="text-[#78350f] font-medium capitalize text-sm">{day}</span>
                    <span className="text-[#d97706] text-sm">{hrs.open} &mdash; {hrs.close}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-20 bg-[#fffbeb]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#d97706] text-sm font-semibold tracking-widest uppercase block mb-3">Contact Us</span>
            <h2 className="text-4xl font-black text-[#451a03]">Get in Touch</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {store.phone && (
              <div className="bg-[#fffcf0] rounded-xl p-8 text-center border border-[#fde68a] hover:border-[#d97706]/40 transition-all duration-300">
                <Phone size={22} className="text-[#d97706] mx-auto mb-4" />
                <h3 className="text-[#451a03] font-semibold mb-2 text-sm">Call</h3>
                <a href={`tel:${store.phone}`} className="text-[#78350f]/70 hover:text-[#d97706] text-sm transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-[#fffcf0] rounded-xl p-8 text-center border border-[#fde68a] hover:border-[#d97706]/40 transition-all duration-300">
                <Mail size={22} className="text-[#d97706] mx-auto mb-4" />
                <h3 className="text-[#451a03] font-semibold mb-2 text-sm">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#78350f]/70 hover:text-[#d97706] text-sm transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-[#fffcf0] rounded-xl p-8 text-center border border-[#fde68a] hover:border-[#d97706]/40 transition-all duration-300">
                <MapPin size={22} className="text-[#d97706] mx-auto mb-4" />
                <h3 className="text-[#451a03] font-semibold mb-2 text-sm">Address</h3>
                <p className="text-[#78350f]/70 text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#451a03]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Wheat size={20} className="text-[#fbbf24]" />
              <span className="text-white font-bold text-lg">{store.name}</span>
            </div>
            <div className="flex items-center gap-6">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#fde68a]/60 hover:text-[#fbbf24] text-sm transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#d97706]/20 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#fde68a]/30 text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-6"><a href="#" className="text-[#fde68a]/30 hover:text-[#fbbf24] text-xs transition-colors">Privacy</a><a href="#" className="text-[#fde68a]/30 hover:text-[#fbbf24] text-xs transition-colors">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
