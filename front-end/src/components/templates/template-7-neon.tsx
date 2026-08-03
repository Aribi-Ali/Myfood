'use client'

import { useEffect, useState } from 'react'
import { Star, Clock, MapPin, Phone, Mail, ShoppingCart, Zap, ChevronDown } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import type { TemplateStore } from './types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface Props {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

function GlowBorder({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('relative group', className)}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#06d6a0] via-[#ef476f] to-[#ffd166] rounded-lg opacity-30 group-hover:opacity-70 blur transition-opacity duration-500" />
      <div className="relative bg-[#0a0a1a] rounded-lg">{children}</div>
    </div>
  )
}

function NeonDivider() {
  return (
    <div className="flex items-center gap-2 my-10">
      <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#06d6a0]/50 to-transparent" />
      <Zap size={16} className="text-[#ffd166]" />
      <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#ef476f]/50 to-transparent" />
    </div>
  )
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center mb-14">
      <span className="text-[#06d6a0] text-[10px] tracking-[0.3em] uppercase font-medium block mb-3">
        {'//'} {eyebrow}
      </span>
      <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#06d6a0] via-[#ffd166] to-[#ef476f] bg-clip-text text-transparent leading-tight">
        {title}
      </h2>
      <NeonDivider />
    </div>
  )
}

export default function Template7Neon({ store, themeColors, onAddToCart, onShopNow }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap'
    document.head.appendChild(link)
  }, [])

  const { currency } = useCurrency()

  const heroBg = getImageUrl(store.cover_image) || getImageUrl(store.cover)
  const logoUrl = getImageUrl(store.logo)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: store.name,
    description: store.description || undefined,
    telephone: store.phone || undefined,
    email: store.email || undefined,
    aggregateRating: store.reviews_count > 0 ? { '@type': 'AggregateRating', ratingValue: store.avg_rating, reviewCount: store.reviews_count } : undefined,
    ...(store.opening_hours ? {
      openingHoursSpecification: (Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
        opens: hrs.open,
        closes: hrs.close,
      })),
    } : {}),
  }

  const cssVars = themeColors
    ? Object.entries(themeColors).reduce((acc, [k, v]) => `${acc}${k}: ${v};`, '')
    : ''

  const isOpen = (() => {
    if (!store.opening_hours) return null
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const today = days[new Date().getDay()]!
    const hrs = store.opening_hours[today]
    if (!hrs) return false
    const now = new Date()
    const current = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    return current >= hrs.open && current <= hrs.close
  })()

  const navLinks = ['Menu', 'Reviews', 'Crew', 'Hours', 'Contact']

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <style>{cssVars}</style>
      <div className="min-h-screen bg-[#0a0a1a] text-white overflow-hidden" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
        <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(6, 214, 160, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 214, 160, 0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'bg-[#0a0a1a]/90 backdrop-blur-xl border-b border-[#06d6a0]/20' : 'bg-transparent')}>
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              <div className="flex items-center gap-3">
                {logoUrl && <img src={logoUrl} alt={store.name} className="h-7 w-auto object-contain brightness-0 invert" />}
                <a href="#" className="text-white text-lg lg:text-xl font-bold tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>{store.name}</a>
              </div>
              <div className="hidden md:flex items-center gap-6">
                {navLinks.map((l) => (
                  <a key={l} href={`#${l.toLowerCase()}`} className="text-white/50 hover:text-[#06d6a0] text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-300">[ {l} ]</a>
                ))}
                <button onClick={onShopNow} className="relative px-5 py-2 text-xs tracking-[0.15em] uppercase font-bold text-[#0a0a1a] bg-[#06d6a0] hover:shadow-[0_0_20px_rgba(6,214,160,0.5)] transition-all duration-300 overflow-hidden" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  <span className="relative z-10">Order</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-[#06d6a0] to-[#ef476f] opacity-0 hover:opacity-100 transition-opacity duration-500" />
                </button>
              </div>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white/70 hover:text-[#06d6a0] transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
          <div className={cn('md:hidden transition-all duration-400 overflow-hidden bg-[#0a0a1a]/95 backdrop-blur-xl border-b border-[#06d6a0]/20', mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="text-white/50 hover:text-[#06d6a0] text-xs tracking-[0.2em] uppercase font-medium transition-colors">[ {l} ]</a>
              ))}
              <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="text-left text-[#06d6a0] text-xs tracking-[0.15em] uppercase font-bold w-fit" style={{ fontFamily: "'Orbitron', sans-serif" }}>{'>'} Order_Now</button>
            </div>
          </div>
        </nav>

        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
          {heroBg && (
            <div className="absolute inset-0">
              <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a]/60 via-[#0a0a1a]/80 to-[#0a0a1a]" />
            </div>
          )}
          {!heroBg && (
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0f0f2a] to-[#0a0a1a]" />
              <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#06d6a0]/10 rounded-full blur-[100px]" />
              <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-[#ef476f]/10 rounded-full blur-[100px]" />
            </div>
          )}

          {isOpen !== null && (
            <div className="absolute top-24 right-4 lg:right-8 z-10 flex items-center gap-2 bg-[#0a0a1a]/80 backdrop-blur-md border border-[#06d6a0]/30 px-3 py-1.5 rounded-full">
              <span className={cn('w-2 h-2 rounded-full animate-pulse', isOpen ? 'bg-[#06d6a0] shadow-[0_0_8px_rgba(6,214,160,0.8)]' : 'bg-[#ef476f] shadow-[0_0_8px_rgba(239,71,111,0.8)]')} />
              <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-white/70">{isOpen ? 'Open Now' : 'Closed'}</span>
            </div>
          )}

          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto py-20">
            {store.badges.length > 0 && (
              <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
                {store.badges.map((b) => (
                  <span key={b.id} className="inline-block px-3 py-1 border border-[#06d6a0]/40 text-[#06d6a0] text-[10px] tracking-[0.2em] uppercase font-medium rounded-sm">{'<'} {b.name} {'/>'}</span>
                ))}
              </div>
            )}
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] mb-6 bg-gradient-to-r from-[#06d6a0] via-[#ffd166] to-[#ef476f] bg-clip-text text-transparent" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              {store.name}
            </h1>
            <div className="flex items-center justify-center gap-3 mb-4">
              <StarRating rating={store.avg_rating} size={16} activeColor="#ffd166" inactiveColor="rgba(255,255,255,0.1)" />
              <span className="text-white/40 text-sm tracking-wide">{store.avg_rating.toFixed(1)} / 5.0 ({store.reviews_count})</span>
            </div>
            <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10 tracking-wide">
              {store.description || 'Next-level flavour experience.'}
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button onClick={onShopNow} className="relative px-8 py-3.5 text-sm tracking-[0.15em] uppercase font-bold text-[#0a0a1a] bg-[#06d6a0] hover:shadow-[0_0_30px_rgba(6,214,160,0.6)] transition-all duration-300 group" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <span className="relative z-10 flex items-center gap-2"><ShoppingCart size={16} /> Enter Menu</span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#06d6a0] to-[#ef476f] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
              <a href="#menu" className="border border-[#06d6a0]/50 text-[#06d6a0] px-8 py-3.5 text-sm tracking-[0.15em] uppercase font-bold hover:bg-[#06d6a0]/10 hover:border-[#06d6a0] transition-all duration-300" style={{ fontFamily: "'Orbitron', sans-serif" }}>{'>'} Explore</a>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce"><ChevronDown size={20} className="text-[#06d6a0]/50" /></div>
        </section>

        <section id="menu" className="py-20 lg:py-28 relative">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
            <SectionTitle eyebrow="SYSTEM_ACCESS" title="Fuel Library" />
            {store.foods.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {store.foods.map((food) => {
                  const foodImg = getImageUrl(food.image)
                  return (
                    <GlowBorder key={food.id}>
                      <div className="overflow-hidden">
                        <div className="relative h-48 overflow-hidden bg-[#0f0f2a]">
                          {foodImg ? (
                            <img src={foodImg} alt={food.name} className="w-full h-full object-cover transition-transform duration-700 opacity-80 hover:opacity-100" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-16 h-16 border-2 border-[#06d6a0]/30 rounded-full flex items-center justify-center">
                                <ShoppingCart size={24} className="text-[#06d6a0]/30" />
                              </div>
                            </div>
                          )}
                          {food.is_offer && <span className="absolute top-3 right-3 bg-[#ef476f] text-white text-[10px] tracking-[0.1em] uppercase font-bold px-2 py-1 rounded-sm shadow-[0_0_12px_rgba(239,71,111,0.6)]">HOT</span>}
                          {food.new_price != null && <span className="absolute top-3 left-3 bg-[#ffd166] text-[#0a0a1a] text-[10px] tracking-[0.1em] uppercase font-bold px-2 py-1 rounded-sm">SALE</span>}
                          {food.cooking_time != null && (
                            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-[#0a0a1a]/80 backdrop-blur-sm px-2 py-1 rounded-sm">
                              <Clock size={10} className="text-[#06d6a0]" />
                              <span className="text-[10px] text-white/70">{food.cooking_time} min</span>
                            </div>
                          )}
                        </div>
                        <div className="p-5 bg-[#0a0a1a]">
                          <h3 className="text-white text-base font-bold mb-1 tracking-wide" style={{ fontFamily: "'Orbitron', sans-serif" }}>{food.name}</h3>
                          {food.description && <p className="text-white/40 text-sm leading-relaxed mb-3 line-clamp-2">{food.description}</p>}
                          <div className="flex items-center justify-between pt-3 border-t border-white/5">
                            <span className="text-[#06d6a0] text-lg font-bold">
                              {formatFoodPrice(food, currency)}
                              {food.new_price != null && <span className="text-white/30 text-sm line-through ml-2 font-normal">{formatFoodPrice(food, currency, { original: true })}</span>}
                            </span>
                            <button data-add-to-cart={food.id} onClick={() => onAddToCart?.(food.id)} className="relative px-4 py-2 text-xs tracking-[0.1em] uppercase font-bold text-[#0a0a1a] bg-[#06d6a0] hover:shadow-[0_0_16px_rgba(6,214,160,0.5)] transition-all duration-300 overflow-hidden" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                              <span className="relative z-10">+Cart</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </GlowBorder>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center gap-2 border border-[#06d6a0]/30 px-6 py-3 rounded-sm">
                  <Zap size={16} className="text-[#ffd166]" />
                  <p className="text-white/50 text-sm tracking-wide">Menu grid is offline — fuel data pending...</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="reviews" className="py-20 lg:py-28 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#0a0a1a]" />
          <div className="max-w-5xl mx-auto px-4 lg:px-8 relative z-10">
            <SectionTitle eyebrow="USER_FEEDBACK" title="Testimonials_v2" />
            {store.reviews.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {store.reviews.map((review) => (
                  <div key={review.id} className="bg-[#0a0a1a] border border-[#06d6a0]/20 hover:border-[#06d6a0]/50 transition-all duration-300 p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#06d6a0]/5 to-transparent" />
                    <div className="flex items-center gap-3 mb-4">
                      {review.avatar ? (
                        <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-10 h-10 rounded-full object-cover border-2 border-[#06d6a0]/30" />
                      ) : (
                        <div className="w-10 h-10 rounded-full border-2 border-[#06d6a0]/30 flex items-center justify-center bg-[#0f0f2a] text-[#06d6a0] text-sm font-bold">{review.user.charAt(0)}</div>
                      )}
                      <div>
                        <p className="text-white text-sm font-medium">{review.user}</p>
                        <div className="flex items-center gap-2"><StarRating rating={review.rating} size={10} activeColor="#ffd166" inactiveColor="rgba(255,255,255,0.1)" /><span className="text-white/30 text-[10px]">{review.rating}/5</span></div>
                      </div>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">&ldquo;{review.comment || 'Next-level experience.'}&rdquo;</p>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#06d6a0] via-[#ffd166] to-[#ef476f] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 border border-[#ffd166]/30 px-6 py-3 rounded-sm">
                  <Star size={16} className="text-[#ffd166]" />
                  <p className="text-white/50 text-sm tracking-wide">No reviews yet. Be the first to log feedback.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {store.staff.length > 0 && (
          <section id="crew" className="py-20 lg:py-28 relative">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
              <SectionTitle eyebrow="TEAM_NODES" title="The Crew" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {store.staff.map((member, idx) => (
                  <div key={idx} className="text-center group">
                    <div className="relative w-28 h-28 mx-auto mb-5">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <defs><clipPath id={`hex-${idx}`}><polygon points="50 5, 90 27.5, 90 72.5, 50 95, 10 72.5, 10 27.5" /></clipPath></defs>
                        <polygon points="50 5, 90 27.5, 90 72.5, 50 95, 10 72.5, 10 27.5" fill="none" stroke="#06d6a0" strokeWidth="2" className="opacity-50 group-hover:opacity-100 transition-opacity duration-300" style={{ filter: 'drop-shadow(0 0 6px rgba(6,214,160,0.4))' }} />
                        <foreignObject x="10" y="27.5" width="80" height="65" clipPath={`url(#hex-${idx})`}>
                          <div className="w-full h-full bg-gradient-to-br from-[#06d6a0]/20 to-[#ef476f]/20 flex items-center justify-center">
                            <span className="text-white text-3xl font-black" style={{ fontFamily: "'Orbitron', sans-serif" }}>{member.name.charAt(0)}</span>
                          </div>
                        </foreignObject>
                      </svg>
                      <div className="absolute -top-1 -right-1 bg-[#06d6a0] text-[#0a0a1a] text-[8px] tracking-[0.1em] uppercase font-bold px-2 py-0.5 rounded-sm">{member.role?.split(' ')[0] || ''}</div>
                    </div>
                    <h3 className="text-white text-base font-bold" style={{ fontFamily: "'Orbitron', sans-serif" }}>{member.name}</h3>
                    <p className="text-[#06d6a0]/60 text-xs tracking-[0.2em] uppercase mt-1">{member.role || 'Staff'}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {store.opening_hours && (
          <section id="hours" className="py-20 lg:py-28 relative">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
              <SectionTitle eyebrow="SCHEDULE" title="Operating Hours" />
              <div className="max-w-lg mx-auto">
                <div className="border border-[#06d6a0]/30 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#06d6a0]/10 to-[#ef476f]/10 px-6 py-3 flex items-center justify-between border-b border-[#06d6a0]/20">
                    <span className="text-[#06d6a0] text-xs tracking-[0.2em] uppercase font-bold" style={{ fontFamily: "'Orbitron', sans-serif" }}>DAY</span>
                    <span className="text-[#06d6a0] text-xs tracking-[0.2em] uppercase font-bold" style={{ fontFamily: "'Orbitron', sans-serif" }}>CYCLE</span>
                  </div>
                  {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                    <div key={day} className="flex items-center justify-between px-6 py-3 border-b border-white/5 last:border-b-0 hover:bg-[#06d6a0]/5 transition-colors">
                      <span className="text-white/70 text-sm font-medium capitalize">{day}</span>
                      <span className="text-[#06d6a0]/80 text-sm tracking-wide">{hrs.open} &mdash; {hrs.close}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {(store.phone || store.email || store.address) && (
          <section id="contact" className="py-20 lg:py-28 relative">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
              <SectionTitle eyebrow="CONNECT" title="Contact Signal" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {store.phone && (
                  <div className="bg-[#0a0a1a] border border-[#06d6a0]/20 hover:border-[#06d6a0] p-6 text-center transition-all duration-300 group">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-lg border border-[#06d6a0]/30 flex items-center justify-center group-hover:border-[#06d6a0] group-hover:shadow-[0_0_16px_rgba(6,214,160,0.3)] transition-all duration-300"><Phone size={22} className="text-[#06d6a0]" /></div>
                    <h3 className="text-white text-xs tracking-[0.2em] uppercase font-bold mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>COMMS</h3>
                    <a href={`tel:${store.phone}`} className="text-white/50 text-sm hover:text-[#06d6a0] transition-colors">{store.phone}</a>
                  </div>
                )}
                {store.email && (
                  <div className="bg-[#0a0a1a] border border-[#ffd166]/20 hover:border-[#ffd166] p-6 text-center transition-all duration-300 group">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-lg border border-[#ffd166]/30 flex items-center justify-center group-hover:border-[#ffd166] group-hover:shadow-[0_0_16px_rgba(255,209,102,0.3)] transition-all duration-300"><Mail size={22} className="text-[#ffd166]" /></div>
                    <h3 className="text-white text-xs tracking-[0.2em] uppercase font-bold mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>EMAIL</h3>
                    <a href={`mailto:${store.email}`} className="text-white/50 text-sm hover:text-[#ffd166] transition-colors">{store.email}</a>
                  </div>
                )}
                {store.address && (
                  <div className="bg-[#0a0a1a] border border-[#ef476f]/20 hover:border-[#ef476f] p-6 text-center transition-all duration-300 group">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-lg border border-[#ef476f]/30 flex items-center justify-center group-hover:border-[#ef476f] group-hover:shadow-[0_0_16px_rgba(239,71,111,0.3)] transition-all duration-300"><MapPin size={22} className="text-[#ef476f]" /></div>
                    <h3 className="text-white text-xs tracking-[0.2em] uppercase font-bold mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>LOCATION</h3>
                    <p className="text-white/50 text-sm">{store.address}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <footer className="relative border-t border-[#06d6a0]/10">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16 relative z-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {logoUrl && <img src={logoUrl} alt={store.name} className="h-7 w-auto object-contain brightness-0 invert" />}
                  <h3 className="text-white text-lg font-bold tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>{store.name}</h3>
                </div>
                <p className="text-white/40 text-sm leading-relaxed">Powered by flavour. Engineered for taste.</p>
              </div>
              <div>
                <h4 className="text-[#06d6a0] text-xs tracking-[0.2em] uppercase font-bold mb-5" style={{ fontFamily: "'Orbitron', sans-serif" }}>NAV</h4>
                <ul className="space-y-2.5">
                  {navLinks.map((l) => (<li key={l}><a href={`#${l.toLowerCase()}`} className="text-white/40 hover:text-[#06d6a0] text-sm transition-colors">{'>'} {l}</a></li>))}
                </ul>
              </div>
              <div>
                <h4 className="text-[#ffd166] text-xs tracking-[0.2em] uppercase font-bold mb-5" style={{ fontFamily: "'Orbitron', sans-serif" }}>CONNECT</h4>
                <ul className="space-y-3">
                  {store.address && <li className="flex items-start gap-2 text-white/40 text-sm"><MapPin size={14} className="mt-0.5 shrink-0 text-[#ffd166]" /><span>{store.address}</span></li>}
                  {store.phone && <li className="flex items-center gap-2 text-white/40 text-sm"><Phone size={14} className="shrink-0 text-[#ffd166]" /><a href={`tel:${store.phone}`} className="hover:text-[#ffd166] transition-colors">{store.phone}</a></li>}
                  {store.email && <li className="flex items-center gap-2 text-white/40 text-sm"><Mail size={14} className="shrink-0 text-[#ffd166]" /><a href={`mailto:${store.email}`} className="hover:text-[#ffd166] transition-colors">{store.email}</a></li>}
                </ul>
              </div>
              <div>
                <h4 className="text-[#ef476f] text-xs tracking-[0.2em] uppercase font-bold mb-5" style={{ fontFamily: "'Orbitron', sans-serif" }}>SOCIAL</h4>
                <div className="flex items-center gap-3">
                  {['IG', 'FB', 'TW', 'YT'].map((s) => (
                    <a key={s} href="#" aria-label={s} className="w-9 h-9 border border-white/10 hover:border-[#ef476f]/50 flex items-center justify-center text-white/40 hover:text-[#ef476f] transition-all duration-300 text-xs font-bold">{s}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-white/30 text-xs tracking-wide">&copy; {new Date().getFullYear()} {store.name}. ALL RIGHTS RESERVED.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-white/30 hover:text-[#06d6a0] text-xs transition-colors">PRIVACY</a>
                <a href="#" className="text-white/30 hover:text-[#06d6a0] text-xs transition-colors">TERMS</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
