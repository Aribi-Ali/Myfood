'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, MapPin, Phone, Mail, Clock, Utensils, Sparkles, ChevronDown } from 'lucide-react'
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

export function SaffronDreamTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-saffron/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  return (
    <div className="min-h-screen bg-[#fffbeb] text-[#292524]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-[#7c2d12]/95 backdrop-blur-md shadow-lg' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <span className={cn('text-xl font-serif font-bold tracking-tight', scrolled ? 'text-[#fffbeb]' : 'text-[#7c2d12]')}>{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className={cn('text-sm font-medium transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-0 after:bg-[#f59e0b] after:transition-all after:duration-300 hover:after:w-full', scrolled ? 'text-[#fffbeb]/70 hover:text-[#fffbeb]' : 'text-[#7c2d12]/60 hover:text-[#7c2d12]')}>{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-[#c2410c] hover:bg-[#9a3412] text-white px-5 py-2.5 text-sm font-bold transition-all duration-300">
                <ShoppingBag size={16} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className={cn('md:hidden', scrolled ? 'text-[#fffbeb]' : 'text-[#7c2d12]')}><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-[#7c2d12] flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#fffbeb]/60 hover:text-[#f59e0b] text-sm font-medium">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-[#c2410c] text-white px-5 py-2.5 text-sm font-bold flex items-center justify-center gap-2"><ShoppingBag size={16} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7c2d12] via-[#c2410c] to-[#f59e0b]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #f59e0b 0px, transparent 8px), radial-gradient(circle at 80% 70%, #fffbeb 0px, transparent 6px)', backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 200 200" className="absolute top-5 left-5">
            <path d="M0 100 Q50 0 100 100 Q150 200 200 100" stroke="#f59e0b" strokeWidth="2" fill="none" opacity="0.5" />
            <path d="M0 50 Q50 -50 100 50 Q150 150 200 50" stroke="#f59e0b" strokeWidth="1" fill="none" opacity="0.3" />
          </svg>
        </div>
        <img src={heroBg} alt="" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="inline-block border border-[#f59e0b]/40 bg-[#fffbeb]/10 backdrop-blur-sm px-6 py-2 mb-6">
              <span className="text-[#f59e0b] text-sm font-bold tracking-[0.2em] uppercase">Royal Indian Kitchen</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] text-[#fffbeb] mb-6">{store.name}</h1>
            <p className="text-lg md:text-xl text-[#fffbeb]/70 mb-8 leading-relaxed font-serif">{store.description || 'A royal feast of authentic Indian flavors. Spices that tell stories.'}</p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-[#7c2d12]/40 backdrop-blur-sm rounded px-4 py-2 border border-[#f59e0b]/20">
                <StarRating rating={store.avg_rating} size={16} activeColor="#f59e0b" inactiveColor="#7c2d12" />
                <span className="text-[#fffbeb] text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-[#fffbeb]/50 text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="bg-[#f59e0b] hover:bg-[#d97706] text-[#7c2d12] px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 flex items-center gap-2">
                <ShoppingBag size={18} /> Order Now
              </button>
              <a href="#menu" className="border-2 border-[#fffbeb]/30 text-[#fffbeb] hover:bg-[#fffbeb]/10 px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300">View Menu</a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#c2410c] text-sm font-bold tracking-[0.25em] uppercase block mb-3">Royal Menu</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#292524]">Our Signature Dishes</h2>
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="w-12 h-px bg-[#f59e0b]" /><Sparkles size={16} className="text-[#f59e0b]" /><span className="w-12 h-px bg-[#f59e0b]" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="group bg-[#fffcf5] border-2 border-[#c2410c]/10 hover:border-[#f59e0b] transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#f59e0b]/30" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#f59e0b]/30" />
                <div className="relative h-52 overflow-hidden">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-[#fffbeb]"><Utensils className="w-10 h-10 text-[#f59e0b]/40" /></div>
                  )}
                  {food.is_offer && <span className="absolute top-3 right-3 bg-[#c2410c] text-[#fffbeb] text-xs font-bold px-3 py-1">Royal Deal</span>}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-serif font-bold text-[#292524] mb-2">{food.name}</h3>
                  {food.description && <p className="text-[#292524]/60 text-sm mb-4 line-clamp-2">{food.description}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#c2410c] text-lg font-bold">{formatFoodPrice(food, currency)}</span>
                      {food.new_price && <span className="text-[#292524]/40 text-sm line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>}
                    </div>
                    <button onClick={() => onAddToCart?.(food.id)} className="bg-[#c2410c] hover:bg-[#9a3412] text-white px-4 py-2 text-xs font-bold transition-all duration-300 flex items-center gap-1">
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                  {food.cooking_time && <div className="flex items-center gap-1 mt-3 text-[#292524]/40 text-xs"><Clock size={12} /> {food.cooking_time} min</div>}
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-[#f59e0b]/30 p-12"><Sparkles size={48} className="mx-auto mb-4 text-[#f59e0b]" /><p className="text-[#292524]/50 text-lg font-serif">Our royal menu is being prepared by master chefs.</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-gradient-to-b from-[#fffcf5] to-[#fffbeb]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#f59e0b] text-sm font-bold tracking-[0.25em] uppercase block mb-3">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#292524]">Royal Praise</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-[#fffbeb] border border-[#f59e0b]/20 p-8 hover:border-[#f59e0b]/50 transition-all duration-500 relative">
                <StarRating rating={review.rating} size={16} activeColor="#f59e0b" inactiveColor="#7c2d12" />
                <p className="text-[#292524]/70 text-base leading-relaxed mt-4 mb-6 italic font-serif">&ldquo;{review.comment || 'An exquisite journey through Indian cuisine. Every dish is a masterpiece!'}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7c2d12] border border-[#f59e0b]/30 flex items-center justify-center">
                    <span className="text-[#f59e0b] text-sm font-bold">{review.user.charAt(0)}</span>
                  </div>
                  <div><p className="text-[#292524] text-sm font-bold">{review.user}</p><p className="text-[#292524]/50 text-xs">Royal Guest</p></div>
                </div>
                <div className="absolute bottom-3 right-3 text-[#f59e0b]/20"><Sparkles size={24} /></div>
              </div>
            ))}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-[#fffbeb] border border-[#f59e0b]/20 p-8 relative">
                <StarRating rating={5} size={16} activeColor="#f59e0b" inactiveColor="#7c2d12" />
                <p className="text-[#292524]/70 text-base leading-relaxed mt-4 mb-6 italic font-serif">&ldquo;An exquisite journey through Indian cuisine.&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7c2d12] border border-[#f59e0b]/30 flex items-center justify-center"><span className="text-[#f59e0b] text-sm font-bold">R</span></div>
                  <div><p className="text-[#292524] text-sm font-bold">Royal Guest</p><p className="text-[#292524]/50 text-xs">Verified</p></div>
                </div>
                <div className="absolute bottom-3 right-3 text-[#f59e0b]/20"><Sparkles size={24} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-16 bg-[#fffbeb] border-y border-[#f59e0b]/20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto bg-[#fffcf5] border-2 border-[#f59e0b]/20 p-8">
              <div className="flex items-center gap-3 mb-6 justify-center border-b border-[#f59e0b]/20 pb-4">
                <Clock size={20} className="text-[#c2410c]" />
                <h3 className="text-[#292524] text-lg font-serif font-bold">Opening Hours</h3>
              </div>
              <div className="space-y-3">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-dashed border-[#f59e0b]/20 last:border-b-0">
                    <span className="text-[#292524] font-medium capitalize text-sm">{day}</span>
                    <span className="text-[#c2410c] text-sm font-bold">{hrs.open} &mdash; {hrs.close}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="contact" className="py-20 bg-[#fffcf5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#7c2d12] text-sm font-bold tracking-[0.25em] uppercase block mb-3">Connect</span>
            <h2 className="text-4xl font-serif font-bold text-[#292524]">Reach Out to Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {store.phone && (
              <div className="bg-[#fffbeb] border-2 border-[#f59e0b]/20 p-8 text-center hover:border-[#f59e0b] transition-all duration-300 relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#f59e0b]/30" />
                <Phone size={24} className="text-[#c2410c] mx-auto mb-4" />
                <h3 className="text-[#292524] font-bold mb-2 text-sm uppercase tracking-wider">Call</h3>
                <a href={`tel:${store.phone}`} className="text-[#292524]/60 hover:text-[#c2410c] text-sm transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-[#fffbeb] border-2 border-[#f59e0b]/20 p-8 text-center hover:border-[#f59e0b] transition-all duration-300 relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#f59e0b]/30" />
                <Mail size={24} className="text-[#c2410c] mx-auto mb-4" />
                <h3 className="text-[#292524] font-bold mb-2 text-sm uppercase tracking-wider">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#292524]/60 hover:text-[#c2410c] text-sm transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-[#fffbeb] border-2 border-[#f59e0b]/20 p-8 text-center hover:border-[#f59e0b] transition-all duration-300 relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#f59e0b]/30" />
                <MapPin size={24} className="text-[#c2410c] mx-auto mb-4" />
                <h3 className="text-[#292524] font-bold mb-2 text-sm uppercase tracking-wider">Visit</h3>
                <p className="text-[#292524]/60 text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-[#7c2d12] via-[#c2410c] to-[#f59e0b]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <span className="text-[#fffbeb] font-serif text-2xl font-bold">{store.name}</span>
            <div className="flex items-center gap-6">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#fffbeb]/60 hover:text-[#fffbeb] text-sm transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#fffbeb]/20 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#fffbeb]/40 text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-6"><a href="#" className="text-[#fffbeb]/40 hover:text-[#fffbeb] text-xs transition-colors">Privacy Policy</a><a href="#" className="text-[#fffbeb]/40 hover:text-[#fffbeb] text-xs transition-colors">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
