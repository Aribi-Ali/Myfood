'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, MapPin, Phone, Mail, Clock, Utensils, Sun, ChevronDown } from 'lucide-react'
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

export function TerracottaTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-terra/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  return (
    <div className="min-h-screen bg-[#fef9ef] text-[#292524]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-[#fef9ef]/95 backdrop-blur-md shadow-sm' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Sun size={20} className="text-[#c2410c]" />
              <span className="text-lg font-bold text-[#c2410c]">{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#292524]/60 hover:text-[#c2410c] text-sm font-medium transition-colors duration-300 border-b-2 border-transparent hover:border-[#c2410c] pb-1">{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-[#c2410c] hover:bg-[#9a3412] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300">
                <ShoppingBag size={16} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[#c2410c]"><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-[#fef9ef] border-t border-[#c2410c]/20 flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#292524]/60 hover:text-[#c2410c] text-sm font-medium">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-[#c2410c] text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"><ShoppingBag size={16} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c2410c] via-[#9a3412] to-[#d97706]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #fef9ef 1px, transparent 1px), radial-gradient(circle at 70% 30%, #d97706 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#fef9ef] via-transparent to-transparent opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="inline-block rounded-[30px_10px_30px_10px] bg-[#fef9ef]/10 backdrop-blur-sm border border-[#fef9ef]/20 px-6 py-2 mb-6">
              <span className="text-[#fde68a] text-sm font-medium">Mediterranean &bull; Authentic &bull; Timeless</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] text-[#fef9ef] mb-6">{store.name}</h1>
            <p className="text-lg md:text-xl text-[#fef9ef]/80 mb-8 leading-relaxed">{store.description || 'Sun-kissed flavors from the Mediterranean coast.'}</p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-[#fef9ef]/10 backdrop-blur-sm rounded-[20px_5px_20px_5px] px-4 py-2 border border-[#d97706]/30">
                <StarRating rating={store.avg_rating} size={16} activeColor="#d97706" inactiveColor="#fde68a" />
                <span className="text-[#fde68a] text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-[#fef9ef]/50 text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="bg-[#d97706] hover:bg-[#b45309] text-[#fef9ef] px-8 py-4 rounded-[30px_10px_30px_10px] text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 flex items-center gap-2">
                <ShoppingBag size={18} /> Order Now
              </button>
              <a href="#menu" className="border-2 border-[#fef9ef]/40 text-[#fef9ef] hover:bg-[#fef9ef]/10 px-8 py-4 rounded-[10px_30px_10px_30px] text-sm font-bold uppercase tracking-wider transition-all duration-300">Explore Menu</a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#c2410c] text-sm font-semibold tracking-wider uppercase block mb-3">Our Offerings</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#292524]">Artisanal Selection</h2>
            <div className="w-24 h-0.5 bg-[#c2410c] mx-auto mt-6 rounded" />
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="break-inside-avoid bg-[#fffcf5] border-2 border-dashed border-[#c2410c]/20 hover:border-[#c2410c]/60 rounded-[20px_5px_20px_5px] overflow-hidden transition-all duration-500 group">
                <div className="relative h-56 overflow-hidden">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-[#fef9ef]"><Utensils className="w-10 h-10 text-[#c2410c]/30" /></div>
                  )}
                  {food.is_offer && <span className="absolute top-3 left-3 bg-[#d97706] text-white text-xs font-bold px-3 py-1 rounded-[10px_2px_10px_2px]">Offer</span>}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#292524] mb-2">{food.name}</h3>
                  {food.description && <p className="text-[#292524]/60 text-sm mb-4 line-clamp-2">{food.description}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#c2410c] text-lg font-bold">{formatFoodPrice(food, currency)}</span>
                      {food.new_price && <span className="text-[#292524]/40 text-sm line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>}
                    </div>
                    <button onClick={() => onAddToCart?.(food.id)} className="bg-[#c2410c] hover:bg-[#9a3412] text-white px-4 py-2 rounded-[10px_2px_10px_2px] text-xs font-semibold transition-all duration-300 flex items-center gap-1">
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-[#c2410c]/20 rounded-[30px_10px_30px_10px]"><Sun size={48} className="mx-auto mb-4 text-[#d97706]" /><p className="text-[#292524]/50 text-lg">Our artisanal menu is in the making.</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-[#fffcf5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#d97706] text-sm font-semibold tracking-wider uppercase block mb-3">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#292524]">Loved by Our Community</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-[#fef9ef] rounded-[30px_5px_30px_5px] p-8 border border-[#c2410c]/10 hover:border-[#c2410c]/30 transition-all duration-500">
                <StarRating rating={review.rating} size={16} activeColor="#d97706" inactiveColor="#fde68a" />
                <p className="text-[#292524]/70 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;{review.comment || 'A taste of the Mediterranean! Warm, inviting, and absolutely delicious.'}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[15px_3px_15px_3px] bg-[#c2410c]/10 border border-[#c2410c]/20 flex items-center justify-center">
                    <span className="text-[#c2410c] text-sm font-bold">{review.user.charAt(0)}</span>
                  </div>
                  <div><p className="text-[#292524] text-sm font-semibold">{review.user}</p><p className="text-[#292524]/50 text-xs">Verified Guest</p></div>
                </div>
              </div>
            ))}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-[#fef9ef] rounded-[30px_5px_30px_5px] p-8 border border-[#c2410c]/10">
                <StarRating rating={5} size={16} activeColor="#d97706" inactiveColor="#fde68a" />
                <p className="text-[#292524]/70 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;A taste of the Mediterranean! Warm, inviting, and absolutely delicious.&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[15px_3px_15px_3px] bg-[#c2410c]/10 border border-[#c2410c]/20 flex items-center justify-center"><span className="text-[#c2410c] text-sm font-bold">G</span></div>
                  <div><p className="text-[#292524] text-sm font-semibold">Happy Guest</p><p className="text-[#292524]/50 text-xs">Verified</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-16 bg-[#fef9ef]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto bg-[#fffcf5] rounded-[30px_10px_30px_10px] p-8 border-2 border-dashed border-[#c2410c]/20">
              <div className="flex items-center gap-3 mb-6 justify-center">
                <Clock size={20} className="text-[#c2410c]" />
                <h3 className="text-[#292524] text-lg font-bold">Opening Hours</h3>
              </div>
              <div className="space-y-3">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-dashed border-[#d97706]/20 last:border-b-0">
                    <span className="text-[#292524] font-medium capitalize text-sm">{day}</span>
                    <span className="text-[#c2410c] text-sm font-semibold">{hrs.open} &mdash; {hrs.close}</span>
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
            <span className="text-[#9a3412] text-sm font-semibold tracking-wider uppercase block mb-3">Contact</span>
            <h2 className="text-4xl font-bold text-[#292524]">Find Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {store.phone && (
              <div className="bg-[#fef9ef] border-2 border-dashed border-[#c2410c]/20 rounded-[30px_5px_30px_5px] p-8 text-center hover:border-[#c2410c]/50 transition-all duration-300">
                <Phone size={24} className="text-[#c2410c] mx-auto mb-4" />
                <h3 className="text-[#292524] font-bold mb-2 text-sm">Phone</h3>
                <a href={`tel:${store.phone}`} className="text-[#292524]/60 hover:text-[#c2410c] text-sm transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-[#fef9ef] border-2 border-dashed border-[#c2410c]/20 rounded-[30px_5px_30px_5px] p-8 text-center hover:border-[#c2410c]/50 transition-all duration-300">
                <Mail size={24} className="text-[#c2410c] mx-auto mb-4" />
                <h3 className="text-[#292524] font-bold mb-2 text-sm">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#292524]/60 hover:text-[#c2410c] text-sm transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-[#fef9ef] border-2 border-dashed border-[#c2410c]/20 rounded-[30px_5px_30px_5px] p-8 text-center hover:border-[#c2410c]/50 transition-all duration-300">
                <MapPin size={24} className="text-[#c2410c] mx-auto mb-4" />
                <h3 className="text-[#292524] font-bold mb-2 text-sm">Address</h3>
                <p className="text-[#292524]/60 text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-t from-[#c2410c] to-[#9a3412]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Sun size={20} className="text-[#fde68a]" />
              <span className="text-[#fef9ef] font-bold text-lg">{store.name}</span>
            </div>
            <div className="flex items-center gap-6">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#fef9ef]/60 hover:text-[#fde68a] text-sm transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#fef9ef]/20 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#fef9ef]/40 text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-6"><a href="#" className="text-[#fef9ef]/40 hover:text-[#fde68a] text-xs transition-colors">Privacy Policy</a><a href="#" className="text-[#fef9ef]/40 hover:text-[#fde68a] text-xs transition-colors">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
