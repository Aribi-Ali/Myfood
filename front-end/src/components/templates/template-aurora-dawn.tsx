'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, Sparkles, MapPin, Phone, Mail, Clock, Utensils, ArrowRight } from 'lucide-react'
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

export function AuroraDawnTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-aurora/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  return (
    <div className="min-h-screen bg-[#faf5ff] text-[#1e1b2e]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Sparkles size={22} className="text-[#8b5cf6]" />
              <span className="text-lg font-bold bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] bg-clip-text text-transparent">{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#4a3f6b] hover:text-[#8b5cf6] text-sm font-medium transition-colors duration-300">{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#8b5cf6]/30">
                <ShoppingBag size={16} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[#4a3f6b]"><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-white/90 backdrop-blur-xl border-t border-[#8b5cf6]/10 flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#4a3f6b] hover:text-[#8b5cf6] text-sm font-medium">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2"><ShoppingBag size={16} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6] via-[#ec4899] to-[#06b6d4]" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#06b6d4] rounded-full blur-3xl" />
        </div>
        {heroBg && <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <span className="text-white/80 text-sm font-medium tracking-wider uppercase mb-4 block backdrop-blur-sm bg-white/10 rounded-full px-4 py-1.5 inline-flex items-center gap-2"><Sparkles size={14} /> Aurora Collection</span>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] text-white mb-6">{store.name}</h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">{store.description || 'A dreamy escape into flavor. Every dish is a masterpiece.'}</p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <StarRating rating={store.avg_rating} size={16} activeColor="#8b5cf6" inactiveColor="#e2d5f7" />
                <span className="text-white text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-white/60 text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="bg-white text-[#8b5cf6] px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center gap-2">
                <ShoppingBag size={18} /> Order Now
              </button>
              <a href="#menu" className="border-2 border-white/40 text-white hover:bg-white/10 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300">Explore Menu</a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#8b5cf6] text-sm font-semibold tracking-wider uppercase block mb-3">Our Selection</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e1b2e]">Signature Dishes</h2>
            <div className="flex items-center justify-center gap-2 mt-6"><span className="w-3 h-3 rounded-full bg-[#8b5cf6]" /><span className="w-3 h-3 rounded-full bg-[#ec4899]" /><span className="w-3 h-3 rounded-full bg-[#06b6d4]" /></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="group bg-white/30 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/50 hover:shadow-xl hover:shadow-[#8b5cf6]/10 transition-all duration-500">
                <div className="relative h-52 overflow-hidden">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover transition-transform duration-700" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#8b5cf6]/10 to-[#ec4899]/10"><Utensils className="w-10 h-10 text-[#8b5cf6]/40" /></div>
                  )}
                  {food.is_offer && <span className="absolute top-3 right-3 bg-gradient-to-r from-[#ec4899] to-[#8b5cf6] text-white text-xs font-bold px-3 py-1 rounded-full">Special</span>}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#1e1b2e] mb-2">{food.name}</h3>
                  {food.description && <p className="text-[#4a3f6b]/70 text-sm mb-4 line-clamp-2">{food.description}</p>}
                  <div className="flex items-center justify-between">
                    <span className="text-[#8b5cf6] text-lg font-bold">{formatFoodPrice(food, currency)}</span>
                    <button onClick={() => onAddToCart?.(food.id)} className="bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 hover:shadow-lg flex items-center gap-1">
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-16"><Sparkles size={48} className="mx-auto mb-4 text-[#8b5cf6]/50" /><p className="text-[#4a3f6b]/50 text-lg">Our dreamy menu is being prepared.</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-gradient-to-br from-[#faf5ff] via-white to-[#fdf2f8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#ec4899] text-sm font-semibold tracking-wider uppercase block mb-3">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e1b2e]">Loved by Many</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.reviews.slice(0, 3).map((review, i) => {
              const pastels = ['bg-[#f3e8ff] border-[#8b5cf6]/20', 'bg-[#fce7f3] border-[#ec4899]/20', 'bg-[#e0f2fe] border-[#06b6d4]/20']
              return (
                <div key={review.id} className={`${pastels[i % 3]} backdrop-blur-sm rounded-3xl p-8 border hover:shadow-lg transition-all duration-500`}>
                  <StarRating rating={review.rating} size={16} activeColor="#8b5cf6" inactiveColor="#e2d5f7" />
                  <p className="text-[#4a3f6b]/80 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;{review.comment || 'Absolutely delightful experience! The ambiance was magical.'}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white border border-[#8b5cf6]/20 flex items-center justify-center">
                      <span className="text-[#8b5cf6] text-sm font-bold">{review.user.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-[#1e1b2e] text-sm font-semibold">{review.user}</p>
                      <p className="text-[#4a3f6b]/50 text-xs">Verified Guest</p>
                    </div>
                  </div>
                </div>
              )
            })}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => {
              const pastels = ['bg-[#f3e8ff] border-[#8b5cf6]/20', 'bg-[#fce7f3] border-[#ec4899]/20', 'bg-[#e0f2fe] border-[#06b6d4]/20']
              return (
                <div key={i} className={`${pastels[i % 3]} backdrop-blur-sm rounded-3xl p-8 border`}>
                  <StarRating rating={5} size={16} activeColor="#8b5cf6" inactiveColor="#e2d5f7" />
                  <p className="text-[#4a3f6b]/80 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;Absolutely delightful experience! The ambiance was magical.&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white border border-[#8b5cf6]/20 flex items-center justify-center"><span className="text-[#8b5cf6] text-sm font-bold">L</span></div>
                    <div><p className="text-[#1e1b2e] text-sm font-semibold">Happy Guest</p><p className="text-[#4a3f6b]/50 text-xs">Verified</p></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-16 bg-white/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-[#8b5cf6]/10">
              <div className="flex items-center gap-3 mb-6 justify-center">
                <Clock size={20} className="text-[#8b5cf6]" />
                <h3 className="text-[#1e1b2e] text-lg font-bold">Opening Hours</h3>
              </div>
              <div className="space-y-2">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-[#8b5cf6]/5 last:border-b-0">
                    <span className="text-[#4a3f6b] font-medium capitalize text-sm">{day}</span>
                    <span className="text-[#8b5cf6] text-sm">{hrs.open} &mdash; {hrs.close}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#06b6d4] text-sm font-semibold tracking-wider uppercase block mb-3">Get in Touch</span>
            <h2 className="text-4xl font-bold text-[#1e1b2e]">We&apos;d Love to Hear From You</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {store.phone && (
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-[#8b5cf6]/10 hover:border-[#8b5cf6]/30 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8b5cf6]/10 to-[#ec4899]/10 flex items-center justify-center mx-auto mb-4"><Phone size={22} className="text-[#8b5cf6]" /></div>
                <h3 className="text-[#1e1b2e] font-semibold mb-2 text-sm">Phone</h3>
                <a href={`tel:${store.phone}`} className="text-[#4a3f6b]/70 hover:text-[#8b5cf6] text-sm transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-[#8b5cf6]/10 hover:border-[#8b5cf6]/30 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8b5cf6]/10 to-[#ec4899]/10 flex items-center justify-center mx-auto mb-4"><Mail size={22} className="text-[#8b5cf6]" /></div>
                <h3 className="text-[#1e1b2e] font-semibold mb-2 text-sm">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#4a3f6b]/70 hover:text-[#8b5cf6] text-sm transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-[#8b5cf6]/10 hover:border-[#8b5cf6]/30 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8b5cf6]/10 to-[#ec4899]/10 flex items-center justify-center mx-auto mb-4"><MapPin size={22} className="text-[#8b5cf6]" /></div>
                <h3 className="text-[#1e1b2e] font-semibold mb-2 text-sm">Address</h3>
                <p className="text-[#4a3f6b]/70 text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-[#8b5cf6]/5 via-[#ec4899]/5 to-[#06b6d4]/5 border-t border-[#8b5cf6]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Sparkles size={20} className="text-[#8b5cf6]" />
              <span className="text-[#1e1b2e] font-bold text-lg">{store.name}</span>
            </div>
            <div className="flex items-center gap-6">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#4a3f6b]/50 hover:text-[#8b5cf6] text-sm transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#8b5cf6]/10 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#4a3f6b]/40 text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-6"><a href="#" className="text-[#4a3f6b]/40 hover:text-[#8b5cf6] text-xs transition-colors">Privacy Policy</a><a href="#" className="text-[#4a3f6b]/40 hover:text-[#8b5cf6] text-xs transition-colors">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
