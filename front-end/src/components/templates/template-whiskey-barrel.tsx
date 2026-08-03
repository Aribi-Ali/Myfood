'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Menu, X, MapPin, Phone, Mail, Clock, Utensils, Wine, ChevronDown } from 'lucide-react'
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

export function WhiskeyBarrelTemplate({ store, onAddToCart, onShopNow }: ComponentProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-whiskey/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  return (
    <div className="min-h-screen bg-[#fefce8] text-[#292524]">
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-[#292524]/95 backdrop-blur-md shadow-lg' : 'bg-transparent')}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <Wine size={22} className={scrolled ? 'text-[#a16207]' : 'text-[#a16207]'} />
              <span className={cn('text-lg font-black tracking-tight', scrolled ? 'text-[#fefce8]' : 'text-[#292524]')}>{store.name}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className={cn('text-sm font-medium transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[#a16207] after:transition-all after:duration-300 hover:after:w-full', scrolled ? 'text-[#fefce8]/70 hover:text-[#fefce8]' : 'text-[#292524]/60 hover:text-[#292524]')}>{l}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={onShopNow} className="hidden md:flex items-center gap-2 bg-[#92400e] hover:bg-[#78350f] text-[#fefce8] px-5 py-2.5 text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-lg shadow-[#92400e]/20">
                <ShoppingBag size={16} /> Order
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className={cn('md:hidden', scrolled ? 'text-[#fefce8]' : 'text-[#292524]')}><Menu size={22} /></button>
            </div>
          </div>
        </div>
        <div className={cn('md:hidden overflow-hidden transition-all duration-400', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="px-6 py-6 bg-[#292524] flex flex-col gap-5">
            {['Menu', 'Reviews', 'Contact'].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-[#fefce8]/60 hover:text-[#a16207] text-sm font-medium">{l}</a>
            ))}
            <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="bg-[#92400e] text-[#fefce8] px-5 py-2.5 text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2"><ShoppingBag size={16} /> Order Now</button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#78350f] via-[#92400e] to-[#a16207]" />
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, #fefce8 20px, #fefce8 21px)' }} />
        <img src={heroBg} alt="" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="inline-block bg-[#a16207]/20 backdrop-blur-sm border border-[#a16207]/30 px-5 py-2 mb-6">
              <span className="text-[#fefce8] text-sm font-bold tracking-[0.3em] uppercase">Est. 2024</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1] text-[#fefce8] mb-6">{store.name}</h1>
            <p className="text-lg md:text-xl text-[#fefce8]/70 mb-8 leading-relaxed">{store.description || 'Where every pour tells a story. Fine spirits, hearty meals.'}</p>
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-[#292524]/40 backdrop-blur-sm px-4 py-2 border border-[#a16207]/30">
                <StarRating rating={store.avg_rating} size={16} activeColor="#a16207" inactiveColor="#44403c" />
                <span className="text-[#fefce8] text-sm font-medium ml-1">{store.avg_rating.toFixed(1)}</span>
                <span className="text-[#fefce8]/50 text-xs">({store.reviews_count})</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={onShopNow} className="bg-[#a16207] hover:bg-[#854d0e] text-[#fefce8] px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 flex items-center gap-2">
                <ShoppingBag size={18} /> Order Now
              </button>
              <a href="#menu" className="border-2 border-[#fefce8]/30 text-[#fefce8] hover:bg-[#fefce8]/10 px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-300">Explore Menu</a>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#92400e] text-sm font-bold tracking-[0.25em] uppercase block mb-3">Barrel Selection</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#292524]">Our Crafted Menu</h2>
            <div className="w-16 h-1 bg-[#a16207] mx-auto mt-6" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.foods.slice(0, 6).map((food) => (
              <div key={food.id} className="group bg-[#fffcf5] border border-[#a16207]/20 hover:border-[#a16207] transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#92400e] text-[#fefce8] text-[10px] font-bold uppercase tracking-wider px-4 py-1 z-10">Featured</div>
                <div className="relative h-52 overflow-hidden">
                  {food.image ? (
                    <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-[#fefce8]"><Utensils className="w-10 h-10 text-[#a16207]/30" /></div>
                  )}
                  {food.is_offer && <span className="absolute bottom-3 left-3 bg-[#a16207] text-[#fefce8] text-xs font-bold px-3 py-1">Barrel Deal</span>}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#292524] mb-2">{food.name}</h3>
                  {food.description && <p className="text-[#292524]/60 text-sm mb-4 line-clamp-2">{food.description}</p>}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[#92400e] text-lg font-bold">{formatFoodPrice(food, currency)}</span>
                      {food.new_price && <span className="text-[#292524]/40 text-sm line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>}
                    </div>
                    <button onClick={() => onAddToCart?.(food.id)} className="bg-[#92400e] hover:bg-[#78350f] text-[#fefce8] px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1">
                      <ShoppingBag size={14} /> Add
                    </button>
                  </div>
                  {food.cooking_time && <div className="flex items-center gap-1 mt-3 text-[#292524]/40 text-xs"><Clock size={12} /> {food.cooking_time} min</div>}
                </div>
              </div>
            ))}
          </div>
          {store.foods.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-[#a16207]/30 p-12"><Wine size={48} className="mx-auto mb-4 text-[#a16207]" /><p className="text-[#292524]/50 text-lg">Our barrel-aged menu is coming soon.</p></div>
          )}
        </div>
      </section>

      <section id="reviews" className="py-24 bg-[#fffcf5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#a16207] text-sm font-bold tracking-[0.25em] uppercase block mb-3">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#292524]">What Patrons Say</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-[#fefce8] border border-[#a16207]/20 p-8 hover:border-[#a16207]/50 transition-all duration-500 relative">
                <div className="absolute top-0 left-0 w-0 h-0 border-t-[30px] border-t-[#a16207] border-r-[30px] border-r-transparent" />
                <div className="flex items-center gap-1 mb-4"><StarRating rating={review.rating} size={16} activeColor="#a16207" inactiveColor="#44403c" /></div>
                <p className="text-[#292524]/70 text-base leading-relaxed mb-6 italic">&ldquo;{review.comment || 'A whiskey lover\'s paradise. The food is equally impressive.'}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#92400e] flex items-center justify-center"><span className="text-[#a16207] text-sm font-bold">{review.user.charAt(0)}</span></div>
                  <div><p className="text-[#292524] text-sm font-bold">{review.user}</p><p className="text-[#292524]/50 text-xs">Regular Patron</p></div>
                </div>
              </div>
            ))}
            {store.reviews.length === 0 && [1, 2, 3].map((i) => (
              <div key={i} className="bg-[#fefce8] border border-[#a16207]/20 p-8 relative">
                <div className="absolute top-0 left-0 w-0 h-0 border-t-[30px] border-t-[#a16207] border-r-[30px] border-r-transparent" />
                <StarRating rating={5} size={16} activeColor="#a16207" inactiveColor="#44403c" />
                <p className="text-[#292524]/70 text-base leading-relaxed mt-4 mb-6 italic">&ldquo;A whiskey lover&apos;s paradise. The food is equally impressive.&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#92400e] flex items-center justify-center"><span className="text-[#a16207] text-sm font-bold">P</span></div>
                  <div><p className="text-[#292524] text-sm font-bold">Loyal Patron</p><p className="text-[#292524]/50 text-xs">Regular</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {store.opening_hours && (
        <section className="py-16 bg-[#fefce8] border-y border-[#a16207]/20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-lg mx-auto bg-[#fffcf5] border border-[#a16207]/20 p-8">
              <div className="flex items-center gap-3 mb-6 justify-center">
                <Clock size={20} className="text-[#a16207]" />
                <h3 className="text-[#292524] text-lg font-bold uppercase tracking-wider">Hours</h3>
              </div>
              <div className="space-y-3">
                {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-[#a16207]/10 last:border-b-0">
                    <span className="text-[#292524] font-medium capitalize text-sm">{day}</span>
                    <span className="text-[#92400e] text-sm font-bold">{hrs.open} &mdash; {hrs.close}</span>
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
            <span className="text-[#78350f] text-sm font-bold tracking-[0.25em] uppercase block mb-3">Get in Touch</span>
            <h2 className="text-4xl font-black text-[#292524]">Find Us at the Bar</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {store.phone && (
              <div className="bg-[#fefce8] border-2 border-[#a16207]/20 p-8 text-center hover:border-[#a16207] transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-[#92400e]/10 flex items-center justify-center mx-auto mb-4"><Phone size={24} className="text-[#92400e]" /></div>
                <h3 className="text-[#292524] font-bold mb-2 text-sm uppercase tracking-wider">Call</h3>
                <a href={`tel:${store.phone}`} className="text-[#292524]/60 hover:text-[#92400e] text-sm font-medium transition-colors">{store.phone}</a>
              </div>
            )}
            {store.email && (
              <div className="bg-[#fefce8] border-2 border-[#a16207]/20 p-8 text-center hover:border-[#a16207] transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-[#92400e]/10 flex items-center justify-center mx-auto mb-4"><Mail size={24} className="text-[#92400e]" /></div>
                <h3 className="text-[#292524] font-bold mb-2 text-sm uppercase tracking-wider">Email</h3>
                <a href={`mailto:${store.email}`} className="text-[#292524]/60 hover:text-[#92400e] text-sm font-medium transition-colors">{store.email}</a>
              </div>
            )}
            {store.address && (
              <div className="bg-[#fefce8] border-2 border-[#a16207]/20 p-8 text-center hover:border-[#a16207] transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-[#92400e]/10 flex items-center justify-center mx-auto mb-4"><MapPin size={24} className="text-[#92400e]" /></div>
                <h3 className="text-[#292524] font-bold mb-2 text-sm uppercase tracking-wider">Visit</h3>
                <p className="text-[#292524]/60 text-sm">{store.address}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-b from-[#78350f] to-[#292524]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Wine size={20} className="text-[#a16207]" />
              <span className="text-[#fefce8] font-bold text-lg">{store.name}</span>
            </div>
            <div className="flex items-center gap-6">
              {['Menu', 'Reviews', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-[#fefce8]/60 hover:text-[#a16207] text-sm transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-[#a16207]/20 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#fefce8]/40 text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
            <div className="flex items-center gap-6"><a href="#" className="text-[#fefce8]/40 hover:text-[#a16207] text-xs transition-colors">Privacy Policy</a><a href="#" className="text-[#fefce8]/40 hover:text-[#a16207] text-xs transition-colors">Terms</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
