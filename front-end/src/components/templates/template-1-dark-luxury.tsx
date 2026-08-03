'use client'

import { useEffect, useState, useRef } from 'react'
import { ShoppingBag, Menu, X, ChevronRight, MapPin, Phone, Mail, Clock, Utensils } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import { SocialLinks } from '@/components/templates/blocks/social-links'
import type { TemplateStore } from './types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface DarkLuxuryProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-[#A89E8E] hover:text-[#C9A84C] text-xs tracking-[0.2em] uppercase font-[450] transition-colors duration-300 relative after:absolute after:bottom-[-2px] after:left-0 after:h-[1px] after:w-0 after:bg-[#C9A84C] after:transition-all after:duration-300 hover:after:w-full"
    >
      {children}
    </a>
  )
}

function GoldEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[#C9A84C] text-xs tracking-[0.25em] uppercase font-[450] block mb-4">
      {children}
    </span>
  )
}

export function Template1DarkLuxury({
  store,
  themeColors,
  onAddToCart,
  onShopNow,
}: DarkLuxuryProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [email, setEmail] = useState('')
  const navRef = useRef<HTMLElement>(null)
  const { currency } = useCurrency()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-hero/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  const featured = store.foods.slice(0, 3)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: store.name,
    description: store.description || undefined,
    image: heroBg || undefined,
    telephone: store.phone || undefined,
    email: store.email || undefined,
    address: store.address ? {
      '@type': 'PostalAddress',
      streetAddress: store.address,
    } : undefined,
    aggregateRating: store.reviews_count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: store.avg_rating,
      reviewCount: store.reviews_count,
    } : undefined,
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
    ? Object.entries(themeColors).reduce((acc, [key, val]) => `${acc}${key}: ${val};`, '')
    : ''

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&family=Inter:wght@300;400;450;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{cssVars}</style>

      <div
        className="min-h-screen bg-[#0E0E0E] text-[#F5F0EB] overflow-hidden"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        {/* Sticky Nav */}
        <nav
          ref={navRef}
          className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
            scrolled
              ? 'bg-[#1A1A1A]/95 backdrop-blur-md shadow-[0_1px_0_rgba(201,168,76,0.15)]'
              : 'bg-transparent',
          )}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20 lg:h-24">
              <div className="hidden md:flex items-center gap-8">
                <NavLink href="#featured">Featured</NavLink>
                <NavLink href="#story">Our Story</NavLink>
                <NavLink href="#testimonials">Testimonials</NavLink>
              </div>

              <div className="flex items-center gap-3">
                {logoUrl && (
                  <img
                    src={logoUrl}
                    alt={store.name}
                    className="h-8 w-auto object-contain"
                  />
                )}
                <a
                  href="#"
                  className="text-[#F5F0EB] hover:text-[#C9A84C] transition-colors duration-300 text-2xl lg:text-3xl font-semibold"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {store.name}
                </a>
              </div>

              <div className="flex items-center gap-6">
                <button
                  onClick={onShopNow}
                  className="hidden md:flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[#F5F0EB] hover:text-[#C9A84C] transition-colors duration-300"
                >
                  <ShoppingBag size={16} className="text-[#C9A84C]" />
                  <span>Shop</span>
                  {featured.length > 0 && (
                    <span className="bg-[#C9A84C] text-[#0E0E0E] text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                      {featured.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden text-[#F5F0EB] hover:text-[#C9A84C] transition-colors duration-300"
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>

          <div
            className={cn(
              'md:hidden transition-all duration-400 overflow-hidden',
              mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0',
            )}
          >
            <div className="px-6 py-6 bg-[#1A1A1A] border-t border-[#C9A84C]/20 flex flex-col gap-5">
              <a href="#featured" onClick={() => setMobileOpen(false)} className="text-[#A89E8E] hover:text-[#C9A84C] text-xs tracking-[0.2em] uppercase transition-colors duration-300">Featured</a>
              <a href="#story" onClick={() => setMobileOpen(false)} className="text-[#A89E8E] hover:text-[#C9A84C] text-xs tracking-[0.2em] uppercase transition-colors duration-300">Our Story</a>
              <a href="#testimonials" onClick={() => setMobileOpen(false)} className="text-[#A89E8E] hover:text-[#C9A84C] text-xs tracking-[0.2em] uppercase transition-colors duration-300">Testimonials</a>
              <button onClick={() => { setMobileOpen(false); onShopNow?.() }} className="text-left text-[#C9A84C] text-xs tracking-[0.15em] uppercase flex items-center gap-2 transition-colors duration-300">
                <ShoppingBag size={16} /> Shop Now
              </button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroBg} alt={store.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />
          </div>
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <GoldEyebrow>Est. {new Date().getFullYear()}</GoldEyebrow>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] text-[#F5F0EB] mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {store.name}
            </h1>
            <div className="w-20 h-[2px] bg-[#C9A84C] mx-auto mb-6" />
            <p className="text-lg md:text-xl text-[#A89E8E] font-light italic max-w-2xl mx-auto mb-10 leading-relaxed">
              {store.description || 'Timeless elegance redefined. Experience the extraordinary.'}
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button onClick={onShopNow} className="bg-[#C9A84C] text-[#0E0E0E] px-10 py-4 text-sm tracking-[0.15em] uppercase font-semibold hover:bg-[#B8972E] transition-all duration-300 hover:scale-105">
                Shop Collection
              </button>
              <a href="#featured" className="border border-[#C9A84C] text-[#C9A84C] px-10 py-4 text-sm tracking-[0.15em] uppercase font-medium hover:bg-[#C9A84C] hover:text-[#0E0E0E] transition-all duration-300 hover:scale-105">
                Explore More
              </a>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
            <a href="#featured" className="text-[#C9A84C]/60 hover:text-[#C9A84C] transition-colors duration-300">
              <ChevronRight size={24} className="rotate-90" />
            </a>
          </div>
        </section>

        {/* Featured Products */}
        <section id="featured" className="bg-[#1A1A1A] py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <GoldEyebrow>Curated Selection</GoldEyebrow>
              <h2 className="text-4xl md:text-5xl font-bold text-[#F5F0EB] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Featured Products</h2>
              <div className="w-16 h-[2px] bg-[#C9A84C] mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((food) => {
                return (
                  <div key={food.id} className="group relative bg-[#0E0E0E] border border-transparent hover:border-[#C9A84C]/40 transition-all duration-500 overflow-hidden">
                    <div className="relative h-96 overflow-hidden">
                      {food.image ? (
                        <img src={getImageUrl(food.image) ?? undefined} alt={food.name} className="w-full h-full object-cover transition-transform duration-700" />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-100">
                          <Utensils className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-[#F5F0EB] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{food.name}</h3>
                      {food.description && <p className="text-[#A89E8E] text-sm mb-4 line-clamp-2 leading-relaxed">{food.description}</p>}
                      <div className="flex items-center justify-between">
                        <span className="text-[#C9A84C] text-lg font-semibold">
                          {formatFoodPrice(food, currency)}
                          {food.new_price && <span className="text-[#A89E8E] text-sm line-through ml-2 font-normal">{formatFoodPrice(food, currency, { original: true })}</span>}
                        </span>
                        <button data-add-to-cart={food.id} onClick={() => onAddToCart?.(food.id)} className="border border-[#C9A84C] text-[#C9A84C] px-5 py-2 text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#C9A84C] hover:text-[#0E0E0E] transition-all duration-300">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {featured.length === 0 && (
              <div className="text-center py-20"><p className="text-[#A89E8E] text-lg italic">Discover our latest collection arriving soon.</p></div>
            )}
          </div>
        </section>

        {/* Brand Story */}
        <section id="story" className="bg-[#0E0E0E] py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 lg:mb-32">
              <div className="relative overflow-hidden">
                <img src={`https://picsum.photos/seed/${store.alias}-story-1/800/1000`} alt="Brand story" className="w-full h-[500px] object-cover transition-transform duration-700" />
                <div className="absolute inset-0 border border-[#C9A84C]/20 pointer-events-none" />
              </div>
              <div className="lg:pl-8">
                <GoldEyebrow>Our Heritage</GoldEyebrow>
                <h2 className="text-4xl md:text-5xl font-bold text-[#F5F0EB] mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Crafting Excellence Since Day One</h2>
                <p className="text-[#A89E8E] text-base leading-relaxed mb-8">Every creation at {store.name} is born from a passion for perfection. We source only the finest materials, working with master artisans who pour their soul into every piece.</p>
                <a href="#" className="inline-flex items-center gap-2 text-[#C9A84C] text-sm tracking-[0.15em] uppercase font-medium group">
                  Discover More <ChevronRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="lg:order-2 relative overflow-hidden">
                <img src={`https://picsum.photos/seed/${store.alias}-story-2/800/1000`} alt="Craftsmanship" className="w-full h-[500px] object-cover transition-transform duration-700" />
                <div className="absolute inset-0 border border-[#C9A84C]/20 pointer-events-none" />
              </div>
              <div className="lg:order-1 lg:pr-8">
                <GoldEyebrow>Artisanship</GoldEyebrow>
                <h2 className="text-4xl md:text-5xl font-bold text-[#F5F0EB] mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Where Tradition Meets Innovation</h2>
                <p className="text-[#A89E8E] text-base leading-relaxed mb-8">Our atelier blends time-honored techniques with contemporary design, creating pieces that transcend trends.</p>
                <a href="#" className="inline-flex items-center gap-2 text-[#C9A84C] text-sm tracking-[0.15em] uppercase font-medium group">
                  Our Process <ChevronRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="bg-[#1A1A1A] py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <GoldEyebrow>Kind Words</GoldEyebrow>
              <h2 className="text-4xl md:text-5xl font-bold text-[#F5F0EB] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>What Our Clients Say</h2>
              <div className="w-16 h-[2px] bg-[#C9A84C] mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {store.reviews.slice(0, 3).map((review, idx) => (
                <div key={review.id} className="bg-[#0E0E0E] p-8 border border-transparent hover:border-[#C9A84C]/20 transition-all duration-500 group">
                  <StarRating rating={review.rating} size={14} activeColor="#C9A84C" inactiveColor="#3D3D3D" />
                  <p className="text-[#F5F0EB]/80 text-base leading-relaxed mt-6 mb-6 italic" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>&ldquo;{review.comment || 'An absolutely transcendent experience.'}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    {review.avatar && <img src={getImageUrl(review.avatar) || `https://picsum.photos/seed/user-${review.id}/40/40`} alt={review.user} className="w-10 h-10 rounded-full object-cover" />}
                    <div>
                      <p className="text-[#F5F0EB] text-sm font-medium">{review.user}</p>
                      <p className="text-[#A89E8E] text-xs">Verified Client</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {store.reviews.length === 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-[#0E0E0E] p-8 border border-transparent hover:border-[#C9A84C]/20 transition-all duration-500 group">
                    <StarRating rating={5} size={14} activeColor="#C9A84C" inactiveColor="#3D3D3D" />
                    <p className="text-[#F5F0EB]/80 text-base leading-relaxed mt-6 mb-6 italic">&ldquo;An absolutely transcendent experience.&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <img src={`https://picsum.photos/seed/testimonial-${i}/40/40`} alt="Client" className="w-10 h-10 rounded-full object-cover" />
                      <div><p className="text-[#F5F0EB] text-sm font-medium">Valued Client</p><p className="text-[#A89E8E] text-xs">Verified Client</p></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-[#0E0E0E] border-y border-[#C9A84C]/30 py-20 lg:py-24">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <GoldEyebrow>Stay Connected</GoldEyebrow>
            <h2 className="text-3xl md:text-4xl font-bold text-[#F5F0EB] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Join the Inner Circle</h2>
            <p className="text-[#A89E8E] text-base leading-relaxed mb-10">Be the first to know about exclusive collections and events.</p>
            <form onSubmit={(e) => { e.preventDefault(); if (email) setEmail('') }} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" required className="flex-1 bg-[#1A1A1A] border border-[#3D3D3D] px-6 py-4 text-[#F5F0EB] text-sm placeholder:text-[#6B5B4F] outline-none focus:border-[#C9A84C] transition-colors duration-300" />
              <button type="submit" className="bg-[#C9A84C] text-[#0E0E0E] px-8 py-4 text-sm tracking-[0.15em] uppercase font-semibold hover:bg-[#B8972E] transition-all duration-300 whitespace-nowrap">Subscribe</button>
            </form>
          </div>
        </section>

        {/* Opening Hours */}
        {store.opening_hours && (
          <section className="bg-[#1A1A1A] py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-16">
                <GoldEyebrow>Hours</GoldEyebrow>
                <h2 className="text-4xl md:text-5xl font-bold text-[#F5F0EB] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Opening Hours</h2>
                <div className="w-16 h-[2px] bg-[#C9A84C] mx-auto" />
              </div>
              <div className="max-w-lg mx-auto">
                <div className="bg-[#0E0E0E] border border-[#C9A84C]/20 p-8">
                  {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                    <div key={day} className="flex items-center justify-between py-3 border-b border-[#C9A84C]/10 last:border-b-0">
                      <span className="text-[#F5F0EB] text-sm font-medium capitalize">{day}</span>
                      <span className="text-[#A89E8E] text-sm">{hrs.open} &mdash; {hrs.close}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Contact */}
        {(store.phone || store.email || store.address) && (
          <section className="bg-[#0E0E0E] py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-16">
                <GoldEyebrow>Get in Touch</GoldEyebrow>
                <h2 className="text-4xl md:text-5xl font-bold text-[#F5F0EB] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Contact Us</h2>
                <div className="w-16 h-[2px] bg-[#C9A84C] mx-auto" />
              </div>
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {store.phone && <div className="bg-[#1A1A1A] p-8 text-center border border-[#C9A84C]/20 hover:border-[#C9A84C]/40 transition-all duration-300"><Phone size={24} className="text-[#C9A84C] mx-auto mb-4" /><h3 className="text-[#F5F0EB] text-sm font-medium mb-2">Phone</h3><a href={`tel:${store.phone}`} className="text-[#A89E8E] text-sm hover:text-[#C9A84C] transition-colors duration-300">{store.phone}</a></div>}
                {store.email && <div className="bg-[#1A1A1A] p-8 text-center border border-[#C9A84C]/20 hover:border-[#C9A84C]/40 transition-all duration-300"><Mail size={24} className="text-[#C9A84C] mx-auto mb-4" /><h3 className="text-[#F5F0EB] text-sm font-medium mb-2">Email</h3><a href={`mailto:${store.email}`} className="text-[#A89E8E] text-sm hover:text-[#C9A84C] transition-colors duration-300">{store.email}</a></div>}
                {store.address && <div className="bg-[#1A1A1A] p-8 text-center border border-[#C9A84C]/20 hover:border-[#C9A84C]/40 transition-all duration-300"><MapPin size={24} className="text-[#C9A84C] mx-auto mb-4" /><h3 className="text-[#F5F0EB] text-sm font-medium mb-2">Address</h3><p className="text-[#A89E8E] text-sm">{store.address}</p></div>}
              </div>
            </div>
          </section>
        )}

        {/* Staff */}
        {store.staff.length > 0 && (
          <section className="bg-[#1A1A1A] py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-16">
                <GoldEyebrow>Our Team</GoldEyebrow>
                <h2 className="text-4xl md:text-5xl font-bold text-[#F5F0EB] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Meet the Team</h2>
                <div className="w-16 h-[2px] bg-[#C9A84C] mx-auto" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {store.staff.map((member, idx) => (
                  <div key={idx} className="bg-[#0E0E0E] p-8 text-center border border-[#C9A84C]/20 hover:border-[#C9A84C]/40 transition-all duration-300 group">
                    <div className="w-20 h-20 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 mx-auto mb-4 flex items-center justify-center group-hover:bg-[#C9A84C]/20 transition-all duration-300">
                      <span className="text-[#C9A84C] text-2xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{member.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-[#F5F0EB] text-lg font-medium mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{member.name}</h3>
                    <p className="text-[#A89E8E] text-xs tracking-[0.15em] uppercase">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="bg-[#0A0A0A] border-t border-[#C9A84C]/20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
              <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  {logoUrl && <img src={logoUrl} alt={store.name} className="h-8 w-auto object-contain" />}
                  <span className="text-xl font-bold text-[#F5F0EB]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{store.name}</span>
                </div>
                <p className="text-[#A89E8E] text-sm leading-relaxed mb-6 max-w-xs">Redefining luxury since our inception.</p>
                <SocialLinks links={store.social_links ?? []} />
              </div>
              <div>
                <h4 className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase font-medium mb-6">Quick Links</h4>
                <ul className="space-y-3">
                  {['Featured', 'Our Story', 'Testimonials', 'Contact'].map((link) => (
                    <li key={link}><a href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-[#A89E8E] hover:text-[#C9A84C] text-sm transition-colors duration-300">{link}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase font-medium mb-6">Support</h4>
                <ul className="space-y-3">
                  {['Shipping & Returns', 'Size Guide', 'Care Instructions', 'FAQ'].map((link) => (
                    <li key={link}><a href="#" className="text-[#A89E8E] hover:text-[#C9A84C] text-sm transition-colors duration-300">{link}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase font-medium mb-6">Contact</h4>
                <ul className="space-y-4">
                  {store.address && <li className="flex items-start gap-3 text-[#A89E8E] text-sm"><MapPin size={14} className="mt-0.5 text-[#C9A84C] shrink-0" /><span>{store.address}</span></li>}
                  {store.phone && <li className="flex items-center gap-3 text-[#A89E8E] text-sm"><Phone size={14} className="text-[#C9A84C] shrink-0" /><a href={`tel:${store.phone}`} className="hover:text-[#C9A84C] transition-colors duration-300">{store.phone}</a></li>}
                  {store.email && <li className="flex items-center gap-3 text-[#A89E8E] text-sm"><Mail size={14} className="text-[#C9A84C] shrink-0" /><a href={`mailto:${store.email}`} className="hover:text-[#C9A84C] transition-colors duration-300">{store.email}</a></li>}
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-[#C9A84C]/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[#6B5B4F] text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-[#6B5B4F] hover:text-[#C9A84C] text-xs transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="text-[#6B5B4F] hover:text-[#C9A84C] text-xs transition-colors duration-300">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
