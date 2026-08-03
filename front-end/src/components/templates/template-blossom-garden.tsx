'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, MapPin, Phone, Mail, Clock, Utensils, Heart, Flower2 } from 'lucide-react'
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

export function BlossomGardenTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-blossom/1920/1080`

  return (
    <div className="min-h-screen bg-[#fdf2f8] text-[#1e1b2e]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm shadow-[#ec4899]/5' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Flower2 size={20} className="text-[#ec4899]" />
              <span className="text-lg font-bold text-[#db2777]">{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#831843]/60 hover:text-[#ec4899] text-sm font-medium transition-colors duration-300">{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#ec4899] to-[#db2777] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg shadow-[#ec4899]/20">
                <ShoppingBag size={16} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[#db2777]"><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-white/90 backdrop-blur-xl border-t border-[#ec4899]/10 flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#831843]/60 hover:text-[#ec4899] text-sm font-medium">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-gradient-to-r from-[#ec4899] to-[#db2777] text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2"><ShoppingBag size={16} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fdf2f8] via-[#fce7f3] to-[#fbcfe8]" />
        <div className="absolute inset-0 opacity-15">
          <svg width="100%" height="100%" viewBox="0 0 400 400" className="absolute top-0 left-0">
            <circle cx="40" cy="40" r="30" fill="#ec4899" opacity="0.3" /><circle cx="350" cy="80" r="50" fill="#db2777" opacity="0.2" />
            <circle cx="80" cy="320" r="40" fill="#f472b6" opacity="0.3" /><circle cx="320" cy="340" r="60" fill="#ec4899" opacity="0.15" />
            <circle cx="200" cy="50" r="20" fill="#f472b6" opacity="0.3" />
          </svg>
        </div>
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-5 py-2 mb-6 border border-[#ec4899]/20">
              <Heart size={14} className="text-[#ec4899]" />
              <span className="text-[#db2777] text-sm font-medium">Bloom &bull; Taste &bull; Love</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] text-[#1e1b2e] mb-6">{store.name}</h1>
            <p className="text-lg md:text-xl text-[#831843]/70 mb-8 leading-relaxed">{store.description || 'Where every bite is like a petal in bloom.'}</p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-[#ec4899]/20">
                <StarRating rating={store.avg_rating} size={16} activeColor="#ec4899" inactiveColor="#fbcfe8" />
                <span className="text-[#1e1b2e] text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-[#831843]/50 text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="bg-gradient-to-r from-[#ec4899] to-[#db2777] text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center gap-2">
                <ShoppingBag size={18} /> Order Now
              </button>
              <a href="#menu" className="border-2 border-[#ec4899]/40 text-[#db2777] hover:bg-[#ec4899]/10 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300">View Menu</a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <Flower2 size={24} className="mx-auto mb-3 text-[#ec4899]" />
            <span className="text-[#db2777] text-sm font-semibold tracking-wider uppercase block mb-3">Our Garden Selection</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e1b2e]">Blossoming Delights</h2>
            <div className="flex items-center justify-center gap-1 mt-6"><span className="w-8 h-0.5 rounded bg-[#f472b6]" /><Heart size={14} className="text-[#ec4899] mx-1" /><span className="w-8 h-0.5 rounded bg-[#f472b6]" /></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="group bg-white rounded-3xl overflow-hidden border border-[#fbcfe8] hover:border-[#ec4899]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#ec4899]/10">
                <div className="relative h-52 overflow-hidden rounded-t-3xl">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover transition-transform duration-700" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#fdf2f8] to-[#fce7f3]"><Utensils className="w-10 h-10 text-[#ec4899]/40" /></div>
                  )}
                  {food.is_offer && <span className="absolute top-3 right-3 bg-[#ec4899] text-white text-xs font-bold px-4 py-1.5 rounded-full">Garden Special</span>}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#1e1b2e] mb-2">{food.name}</h3>
                  {food.description && <p className="text-[#831843]/60 text-sm mb-4 line-clamp-2">{food.description}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#db2777] text-lg font-bold">{formatFoodPrice(food, currency)}</span>
                      {food.new_price && <span className="text-[#831843]/40 text-sm line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>}
                    </div>
                    <button onClick={() => onAddToCart?.(food.id)} className="bg-gradient-to-r from-[#ec4899] to-[#db2777] text-white px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 hover:shadow-lg flex items-center gap-1">
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                  {food.cooking_time && <div className="flex items-center gap-1 mt-3 text-[#831843]/40 text-xs"><Clock size={12} /> {food.cooking_time} min</div>}
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-16"><Flower2 size={48} className="mx-auto mb-4 text-[#ec4899]/50" /><p className="text-[#831843]/50 text-lg">Our garden is blooming with new delights soon.</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-gradient-to-b from-[#fdf2f8] to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <Heart size={20} className="mx-auto mb-3 text-[#ec4899]" />
            <span className="text-[#db2777] text-sm font-semibold tracking-wider uppercase block mb-3">Kind Words</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e1b2e]">Loved by Our Guests</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.reviews.slice(0, 3).map((review, i) => {
              const bgs = ['bg-[#fce7f3] border-[#f472b6]/20', 'bg-[#fdf2f8] border-[#ec4899]/20', 'bg-[#fff1f2] border-[#db2777]/20']
              return (
                <div key={review.id} className={`${bgs[i % 3]} rounded-3xl p-8 border hover:shadow-lg transition-all duration-500`}>
                  <StarRating rating={review.rating} size={16} activeColor="#ec4899" inactiveColor="#fbcfe8" />
                  <p className="text-[#831843]/70 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;{review.comment || 'Absolutely divine! The most beautiful patisserie in town.'}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white border border-[#ec4899]/20 flex items-center justify-center">
                      <span className="text-[#db2777] text-sm font-bold">{review.user.charAt(0)}</span>
                    </div>
                    <div><p className="text-[#1e1b2e] text-sm font-semibold">{review.user}</p><p className="text-[#831843]/50 text-xs">Verified Guest</p></div>
                  </div>
                </div>
              )
            })}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => {
              const bgs = ['bg-[#fce7f3] border-[#f472b6]/20', 'bg-[#fdf2f8] border-[#ec4899]/20', 'bg-[#fff1f2] border-[#db2777]/20']
              return (
                <div key={i} className={`${bgs[i % 3]} rounded-3xl p-8 border`}>
                  <StarRating rating={5} size={16} activeColor="#ec4899" inactiveColor="#fbcfe8" />
                  <p className="text-[#831843]/70 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;Absolutely divine! The most beautiful patisserie in town.&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white border border-[#ec4899]/20 flex items-center justify-center"><span className="text-[#db2777] text-sm font-bold">G</span></div>
                    <div><p className="text-[#1e1b2e] text-sm font-semibold">Sweet Guest</p><p className="text-[#831843]/50 text-xs">Verified</p></div>
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
            <div className="max-w-lg mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-[#fbcfe8]">
              <div className="flex items-center gap-3 mb-6 justify-center">
                <Clock size={20} className="text-[#ec4899]" />
                <h3 className="text-[#1e1b2e] text-lg font-bold">Opening Hours</h3>
              </div>
              <div className="space-y-2">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-[#fbcfe8] last:border-b-0">
                    <span className="text-[#831843] font-medium capitalize text-sm">{day}</span>
                    <span className="text-[#db2777] text-sm">{hrs.open} &mdash; {hrs.close}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-20 bg-gradient-to-b from-white to-[#fdf2f8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <Heart size={22} className="mx-auto mb-3 text-[#ec4899]" />
            <span className="text-[#db2777] text-sm font-semibold tracking-wider uppercase block mb-3">Get in Touch</span>
            <h2 className="text-4xl font-bold text-[#1e1b2e]">We&apos;d Love to Hear From You</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {store.phone && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-[#fbcfe8] hover:border-[#ec4899]/30 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#fdf2f8] to-[#fce7f3] flex items-center justify-center mx-auto mb-4"><Phone size={22} className="text-[#ec4899]" /></div>
                <h3 className="text-[#1e1b2e] font-semibold mb-2 text-sm">Phone</h3>
                <a href={`tel:${store.phone}`} className="text-[#831843]/60 hover:text-[#db2777] text-sm transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-[#fbcfe8] hover:border-[#ec4899]/30 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#fdf2f8] to-[#fce7f3] flex items-center justify-center mx-auto mb-4"><Mail size={22} className="text-[#ec4899]" /></div>
                <h3 className="text-[#1e1b2e] font-semibold mb-2 text-sm">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#831843]/60 hover:text-[#db2777] text-sm transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-[#fbcfe8] hover:border-[#ec4899]/30 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#fdf2f8] to-[#fce7f3] flex items-center justify-center mx-auto mb-4"><MapPin size={22} className="text-[#ec4899]" /></div>
                <h3 className="text-[#1e1b2e] font-semibold mb-2 text-sm">Address</h3>
                <p className="text-[#831843]/60 text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-[#fbcfe8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Flower2 size={20} className="text-[#ec4899]" />
              <span className="text-[#1e1b2e] font-bold text-lg">{store.name}</span>
            </div>
            <div className="flex items-center gap-6">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#831843]/40 hover:text-[#ec4899] text-sm transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#fbcfe8] mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#831843]/30 text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-6"><a href="#" className="text-[#831843]/30 hover:text-[#ec4899] text-xs transition-colors">Privacy Policy</a><a href="#" className="text-[#831843]/30 hover:text-[#ec4899] text-xs transition-colors">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
