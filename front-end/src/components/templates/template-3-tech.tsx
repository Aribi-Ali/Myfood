'use client'

import { useEffect, useState, useRef } from 'react'
import { ShoppingBag, Menu, X, MapPin, Phone, Mail, Clock, ChevronRight, Zap, Users, Shield, TrendingUp, ArrowRight, Utensils } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import type { TemplateStore } from './types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface TechProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-[#64748b] hover:text-[#3b82f6] text-sm font-medium transition-colors duration-300"
    >
      {children}
    </a>
  )
}

export default function Template3Tech({
  store,
  themeColors,
  onAddToCart,
  onShopNow,
}: TechProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const { currency } = useCurrency()

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-tech-hero/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: store.name,
    description: store.description || undefined,
    image: heroBg || undefined,
    telephone: store.phone || undefined,
    email: store.email || undefined,
    address: store.address
      ? { '@type': 'PostalAddress', streetAddress: store.address }
      : undefined,
    aggregateRating:
      store.reviews_count > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: store.avg_rating,
            reviewCount: store.reviews_count,
          }
        : undefined,
    ...(store.opening_hours
      ? {
          openingHoursSpecification: (Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(
            ([day, hrs]) => ({
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
              opens: hrs.open,
              closes: hrs.close,
            }),
          ),
        }
      : {}),
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
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <style>{cssVars}</style>

      <div
        className="min-h-screen bg-[#f8fafc] text-[#0f172a] overflow-hidden"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        {/* Nav */}
        <nav
          ref={navRef}
          className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
            scrolled
              ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-[#e2e8f0]'
              : 'bg-transparent',
          )}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <img src={logoUrl} alt={store.name} className="h-9 w-auto object-contain" />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center">
                    <Zap size={18} className="text-white" />
                  </div>
                )}
                <span className="text-xl font-bold text-[#0f172a]">{store.name}</span>
              </div>

              <div className="hidden md:flex items-center gap-8">
                <NavLink href="#menu">Menu</NavLink>
                <NavLink href="#reviews">Reviews</NavLink>
                <NavLink href="#staff">Team</NavLink>
                <NavLink href="#hours">Hours</NavLink>
                <NavLink href="#contact">Contact</NavLink>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={onShopNow}
                  className="hidden md:flex items-center gap-2 bg-[#3b82f6] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2563eb] transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Order Now
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden text-[#0f172a] hover:text-[#3b82f6] transition-colors duration-300"
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>

          <div
            className={cn(
              'md:hidden transition-all duration-400 overflow-hidden bg-white border-t border-[#e2e8f0]',
              mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0',
            )}
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              <a href="#menu" onClick={() => setMobileOpen(false)} className="text-[#64748b] hover:text-[#3b82f6] text-sm font-medium transition-colors">Menu</a>
              <a href="#reviews" onClick={() => setMobileOpen(false)} className="text-[#64748b] hover:text-[#3b82f6] text-sm font-medium transition-colors">Reviews</a>
              <a href="#staff" onClick={() => setMobileOpen(false)} className="text-[#64748b] hover:text-[#3b82f6] text-sm font-medium transition-colors">Team</a>
              <a href="#hours" onClick={() => setMobileOpen(false)} className="text-[#64748b] hover:text-[#3b82f6] text-sm font-medium transition-colors">Hours</a>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="text-[#64748b] hover:text-[#3b82f6] text-sm font-medium transition-colors">Contact</a>
              <button
                onClick={() => { setMobileOpen(false); onShopNow?.() }}
                className="bg-[#3b82f6] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2563eb] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Order Now <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6] via-[#6366f1] to-[#8b5cf6]" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <Zap size={14} className="text-[#facc15]" />
              <span className="text-white/80 text-sm font-medium">{store.foods.length} items available</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#e2e8f0] to-[#cbd5e1]">
              {store.name}
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              {store.description || 'Next-level dining experience powered by innovation. Fast, fresh, and always ahead of the curve.'}
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={onShopNow}
                className="bg-white text-[#3b82f6] px-10 py-4 rounded-full text-sm font-semibold hover:bg-[#f1f5f9] transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Get Started
              </button>
              <a
                href="#menu"
                className="border-2 border-white/30 text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-white/10 transition-all duration-300"
              >
                View Menu
              </a>
            </div>
            {store.avg_rating > 0 && (
              <div className="mt-12 inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
                <StarRating rating={store.avg_rating} size={20} activeColor="#facc15" inactiveColor="#cbd5e1" />
                <span className="text-white text-sm font-medium">{store.avg_rating.toFixed(1)}</span>
                <span className="text-white/50 text-sm">({store.reviews_count} reviews)</span>
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="py-24 lg:py-28 bg-[#f8fafc] border-b border-[#e2e8f0]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center mx-auto mb-5">
                  <Zap size={24} className="text-[#3b82f6]" />
                </div>
                <h3 className="text-lg font-semibold text-[#0f172a] mb-2">Lightning Fast</h3>
                <p className="text-[#64748b] text-sm leading-relaxed">Order in seconds with our streamlined checkout. No unnecessary steps, just speed.</p>
              </div>
              <div className="p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center mx-auto mb-5">
                  <Shield size={24} className="text-[#3b82f6]" />
                </div>
                <h3 className="text-lg font-semibold text-[#0f172a] mb-2">Quality Assured</h3>
                <p className="text-[#64748b] text-sm leading-relaxed">Every item is verified for freshness and quality before it reaches you.</p>
              </div>
              <div className="p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center mx-auto mb-5">
                  <TrendingUp size={24} className="text-[#3b82f6]" />
                </div>
                <h3 className="text-lg font-semibold text-[#0f172a] mb-2">Smart Tracking</h3>
                <p className="text-[#64748b] text-sm leading-relaxed">Real-time order tracking from preparation to delivery. Know exactly when it arrives.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Menu */}
        <section id="menu" className="py-24 lg:py-28 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#3b82f6] text-sm font-semibold tracking-wide uppercase block mb-3">Our Menu</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-4">Menu</h2>
              <p className="text-[#64748b] max-w-lg mx-auto">Curated selections for every taste. Built for speed, designed for flavor.</p>
            </div>
            {store.foods.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.foods.map((food) => {
                  return (
                    <div
                      key={food.id}
                      className="bg-white rounded-xl border-l-4 border-[#3b82f6] shadow-sm hover:shadow-md transition-all duration-300 p-6"
                    >
                      <div className="flex gap-4">
                        {food.image ? (
                          <img
                            src={getImageUrl(food.image) ?? undefined}
                            alt={food.name}
                            className="w-20 h-20 rounded-lg object-cover shrink-0"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-20 h-20 rounded-lg bg-gray-100 shrink-0">
                            <Utensils className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-[#0f172a] truncate">{food.name}</h3>
                            <span className="text-[#3b82f6] font-bold whitespace-nowrap text-sm">
                              {formatFoodPrice(food, currency)}
                            </span>
                          </div>
                          {food.new_price && (
                            <p className="text-[#94a3b8] text-xs line-through">{formatFoodPrice(food, currency, { original: true })}</p>
                          )}
                          {food.description && (
                            <p className="text-[#64748b] text-sm mt-1 line-clamp-2">{food.description}</p>
                          )}
                          <button
                            data-add-to-cart={food.id}
                            onClick={() => onAddToCart?.(food.id)}
                            className="mt-3 text-[#3b82f6] text-sm font-medium hover:text-[#2563eb] transition-colors flex items-center gap-1"
                          >
                            <ShoppingBag size={14} />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <Zap size={48} className="text-[#3b82f6]/30 mx-auto mb-4" />
                <p className="text-[#64748b] text-lg">Menu loading... Fresh items coming right up!</p>
              </div>
            )}
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="py-24 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#3b82f6] text-sm font-semibold tracking-wide uppercase block mb-3">Testimonials</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-4">What Our Users Say</h2>
              <p className="text-[#64748b] max-w-lg mx-auto">Trusted by hundreds of happy customers.</p>
            </div>
            {store.reviews.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {store.reviews.slice(0, 4).map((review) => (
                  <div
                    key={review.id}
                    className="bg-[#f8fafc] p-8 rounded-xl border border-[#e2e8f0] hover:border-[#3b82f6]/30 hover:bg-[#f1f5f9] transition-all duration-300"
                  >
                    <StarRating rating={review.rating} size={16} activeColor="#facc15" inactiveColor="#cbd5e1" />
                    <p className="text-[#475569] leading-relaxed mt-4 mb-6">
                      &ldquo;{review.comment || 'Amazing experience! The quality and speed exceeded my expectations.'}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      {review.avatar ? (
                        <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
                          <span className="text-[#3b82f6] font-bold text-sm">{review.user.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-[#0f172a] text-sm">{review.user}</p>
                        <p className="text-[#64748b] text-xs">Verified Customer</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Users size={48} className="text-[#3b82f6]/30 mx-auto mb-4" />
                <p className="text-[#64748b] text-lg">No reviews yet. Be the first to review us!</p>
              </div>
            )}
          </div>
        </section>

        {/* Staff */}
        <section id="staff" className="py-24 lg:py-28 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#3b82f6] text-sm font-semibold tracking-wide uppercase block mb-3">Our Team</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-4">Meet the Team</h2>
              <p className="text-[#64748b] max-w-lg mx-auto">The people behind the innovation.</p>
            </div>
            {store.staff.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {store.staff.map((member, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-8 text-center border border-[#e2e8f0] hover:border-[#3b82f6]/30 hover:shadow-sm transition-all duration-300">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">{member.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#0f172a] mb-1">{member.name}</h3>
                    <p className="text-[#64748b] text-sm">{member.role}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Users size={48} className="text-[#3b82f6]/30 mx-auto mb-4" />
                <p className="text-[#64748b] text-lg">Team information coming soon.</p>
              </div>
            )}
          </div>
        </section>

        {/* Opening Hours */}
        <section id="hours" className="py-24 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#3b82f6] text-sm font-semibold tracking-wide uppercase block mb-3">Hours</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-4">Opening Hours</h2>
            </div>
            {store.opening_hours ? (
              <div className="max-w-lg mx-auto bg-[#f8fafc] rounded-xl border border-[#e2e8f0] overflow-hidden">
                <div className="bg-[#3b82f6] px-8 py-4">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Clock size={16} />
                    Weekly Schedule
                  </h3>
                </div>
                <div className="divide-y divide-[#e2e8f0]">
                  {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                    <div key={day} className="flex items-center justify-between px-8 py-4">
                      <span className="text-[#0f172a] font-medium capitalize">{day}</span>
                      <span className="text-[#64748b]">
                        {hrs.open} &mdash; {hrs.close}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <Clock size={48} className="text-[#3b82f6]/30 mx-auto mb-4" />
                <p className="text-[#64748b] text-lg">Opening hours coming soon.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 lg:py-28 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to Order?</h2>
            <p className="text-white/70 text-lg mb-10 max-w-lg mx-auto">Experience the fastest way to get fresh food delivered to your door.</p>
            <button
              onClick={onShopNow}
              className="bg-white text-[#3b82f6] px-12 py-4 rounded-full text-base font-semibold hover:bg-[#f1f5f9] transition-all duration-300 shadow-xl hover:scale-105 inline-flex items-center gap-2"
            >
              Order Now <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-24 lg:py-28 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#3b82f6] text-sm font-semibold tracking-wide uppercase block mb-3">Contact</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] mb-4">Get in Touch</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-8 text-center border border-[#e2e8f0] hover:border-[#3b82f6]/30 transition-all duration-300">
                <Phone size={28} className="text-[#3b82f6] mx-auto mb-4" />
                <h3 className="font-semibold text-[#0f172a] mb-2">Phone</h3>
                {store.phone ? (
                  <a href={`tel:${store.phone}`} className="text-[#3b82f6] text-sm hover:underline">{store.phone}</a>
                ) : (
                  <p className="text-[#64748b] text-sm">Coming soon</p>
                )}
              </div>
              <div className="bg-white rounded-xl p-8 text-center border border-[#e2e8f0] hover:border-[#3b82f6]/30 transition-all duration-300">
                <Mail size={28} className="text-[#3b82f6] mx-auto mb-4" />
                <h3 className="font-semibold text-[#0f172a] mb-2">Email</h3>
                {store.email ? (
                  <a href={`mailto:${store.email}`} className="text-[#3b82f6] text-sm hover:underline">{store.email}</a>
                ) : (
                  <p className="text-[#64748b] text-sm">Coming soon</p>
                )}
              </div>
              <div className="bg-white rounded-xl p-8 text-center border border-[#e2e8f0] hover:border-[#3b82f6]/30 transition-all duration-300">
                <MapPin size={28} className="text-[#3b82f6] mx-auto mb-4" />
                <h3 className="font-semibold text-[#0f172a] mb-2">Address</h3>
                {store.address ? (
                  <p className="text-[#64748b] text-sm">{store.address}</p>
                ) : (
                  <p className="text-[#64748b] text-sm">Coming soon</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0f172a] text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
              <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  {logoUrl ? (
                    <img src={logoUrl} alt={store.name} className="h-8 w-auto object-contain brightness-0 invert" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center">
                      <Zap size={16} className="text-white" />
                    </div>
                  )}
                  <span className="text-xl font-bold text-white">{store.name}</span>
                </div>
                <p className="text-[#94a3b8] text-sm leading-relaxed mb-6 max-w-xs">Fast, fresh, and always reliable. Your go-to for modern dining.</p>
                <div className="flex items-center gap-3">
                  <Shield size={14} className="text-[#3b82f6]" />
                  <span className="text-[#94a3b8] text-xs">100% Satisfaction Guaranteed</span>
                </div>
              </div>
              <div>
                <h4 className="text-[#3b82f6] text-xs tracking-wider uppercase font-semibold mb-6">Quick Links</h4>
                <ul className="space-y-3">
                  {['Menu', 'Reviews', 'Team', 'Contact'].map((link) => (
                    <li key={link}>
                      <a href={`#${link.toLowerCase()}`} className="text-[#94a3b8] hover:text-white text-sm transition-colors duration-300">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[#3b82f6] text-xs tracking-wider uppercase font-semibold mb-6">Company</h4>
                <ul className="space-y-3">
                  {['About', 'Careers', 'Press', 'Blog'].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[#94a3b8] hover:text-white text-sm transition-colors duration-300">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[#3b82f6] text-xs tracking-wider uppercase font-semibold mb-6">Support</h4>
                <ul className="space-y-4">
                  {store.address && (
                    <li className="flex items-start gap-3 text-[#94a3b8] text-sm">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-[#3b82f6]" />
                      <span>{store.address}</span>
                    </li>
                  )}
                  {store.phone && (
                    <li className="flex items-center gap-3 text-[#94a3b8] text-sm">
                      <Phone size={14} className="shrink-0 text-[#3b82f6]" />
                      <a href={`tel:${store.phone}`} className="hover:text-white transition-colors">{store.phone}</a>
                    </li>
                  )}
                  {store.email && (
                    <li className="flex items-center gap-3 text-[#94a3b8] text-sm">
                      <Mail size={14} className="shrink-0 text-[#3b82f6]" />
                      <a href={`mailto:${store.email}`} className="hover:text-white transition-colors">{store.email}</a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-[#1e293b]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[#475569] text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-[#475569] hover:text-[#94a3b8] text-xs transition-colors">Privacy Policy</a>
                <a href="#" className="text-[#475569] hover:text-[#94a3b8] text-xs transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
