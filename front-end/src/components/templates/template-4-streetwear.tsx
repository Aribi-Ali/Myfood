'use client'

import { useEffect, useState, useRef } from 'react'
import { ShoppingBag, Menu, X, MapPin, Phone, Mail, Clock, ChevronRight, Sparkles, Flame, Zap, Skull, Music, Camera, Utensils, Users } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import type { TemplateStore } from './types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface StreetwearProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-[#a0a0a0] hover:text-[#ec4899] text-sm font-bold uppercase tracking-wider transition-colors duration-300"
    >
      {children}
    </a>
  )
}

export function StreetwearTemplate({
  store,
  themeColors,
  onAddToCart,
  onShopNow,
}: StreetwearProps) {
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

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-street-hero/1920/1080`
  const logoUrl = getImageUrl(store.logo)
  const featured = store.foods.slice(0, 3)
  const spotlight = store.foods.length > 0 ? store.foods[0] : null

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
        href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <style>{cssVars}</style>

      <div
        className="min-h-screen bg-[#0f0a0a] text-[#f5f5f5] overflow-hidden"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        {/* Nav */}
        <nav
          ref={navRef}
          className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[#0f0a0a] border-b border-[#1a1111]',
            scrolled ? 'shadow-lg shadow-black/50' : '',
          )}
        >
          <div className="w-full px-6 lg:px-12">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <img src={logoUrl} alt={store.name} className="h-9 w-auto object-contain" />
                ) : (
                  <Skull size={24} className="text-[#ec4899]" />
                )}
                <span
                  className="text-2xl font-bold text-white uppercase tracking-widest"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {store.name}
                </span>
              </div>

              <div className="hidden md:flex items-center gap-8">
                <NavLink href="#collection">Collection</NavLink>
                <NavLink href="#reviews">Reviews</NavLink>
                <NavLink href="#crew">Crew</NavLink>
                <NavLink href="#hours">Hours</NavLink>
                <NavLink href="#contact">Contact</NavLink>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={onShopNow}
                  className="hidden md:flex items-center gap-2 bg-[#eab308] text-[#0f0a0a] px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#d97706] transition-all duration-300"
                >
                  <ShoppingBag size={16} />
                  Shop Now
                </button>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden text-[#f5f5f5] hover:text-[#ec4899] transition-colors duration-300"
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>

          <div
            className={cn(
              'md:hidden transition-all duration-400 overflow-hidden bg-[#0f0a0a] border-t border-[#1a1111]',
              mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
            )}
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              <a href="#collection" onClick={() => setMobileOpen(false)} className="text-[#a0a0a0] hover:text-[#ec4899] text-sm font-bold uppercase tracking-wider transition-colors">Collection</a>
              <a href="#reviews" onClick={() => setMobileOpen(false)} className="text-[#a0a0a0] hover:text-[#ec4899] text-sm font-bold uppercase tracking-wider transition-colors">Reviews</a>
              <a href="#crew" onClick={() => setMobileOpen(false)} className="text-[#a0a0a0] hover:text-[#ec4899] text-sm font-bold uppercase tracking-wider transition-colors">Crew</a>
              <a href="#hours" onClick={() => setMobileOpen(false)} className="text-[#a0a0a0] hover:text-[#ec4899] text-sm font-bold uppercase tracking-wider transition-colors">Hours</a>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="text-[#a0a0a0] hover:text-[#ec4899] text-sm font-bold uppercase tracking-wider transition-colors">Contact</a>
              <button
                onClick={() => { setMobileOpen(false); onShopNow?.() }}
                className="bg-[#eab308] text-[#0f0a0a] px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#d97706] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} /> Shop Now
              </button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0f0a0a]">
          <div className="absolute inset-0">
            <img src={heroBg} alt={store.name} className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a0a] via-[#0f0a0a]/80 to-transparent" />
          </div>
          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#ec4899]/10 border border-[#ec4899]/30 px-4 py-2 rounded-full mb-8">
              <Flame size={14} className="text-[#ec4899]" />
              <span className="text-[#ec4899] text-sm font-bold uppercase tracking-wider">New Drop Available</span>
            </div>
            <h1
              className="text-7xl md:text-9xl lg:text-[10rem] font-bold leading-[0.9] text-white mb-6 uppercase tracking-tight"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {store.name}
            </h1>
            <div className="w-24 h-1 bg-[#ec4899] mx-auto mb-6" />
            <p className="text-lg md:text-xl text-[#a0a0a0] max-w-2xl mx-auto mb-10 leading-relaxed uppercase tracking-wider">
              {store.description || 'Bold flavors. Street attitude. This is not just food — this is a lifestyle.'}
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={onShopNow}
                className="bg-[#eab308] text-[#0f0a0a] px-12 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#d97706] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#eab308]/30"
              >
                <span className="flex items-center gap-2"><Sparkles size={16} /> Shop Collection</span>
              </button>
              <a
                href="#collection"
                className="border-2 border-[#ec4899] text-[#ec4899] px-12 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#ec4899] hover:text-[#0f0a0a] transition-all duration-300"
              >
                View Collection
              </a>
            </div>
          </div>
        </section>

        {/* Featured Spotlight */}
        {spotlight && (
          <section className="py-24 lg:py-28 bg-[#151010] border-y border-[#ec4899]/20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="relative overflow-hidden rounded-2xl border border-[#ec4899]/30 group">
                  {spotlight.image ? (
                    <img
                      src={getImageUrl(spotlight.image) ?? undefined}
                      alt={spotlight.name}
                      className="w-full h-[500px] object-cover transition-transform duration-700"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-[500px] bg-gray-800">
                      <Utensils className="w-12 h-12 text-gray-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a0a] to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <span className="bg-[#ec4899] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">Featured</span>
                  </div>
                </div>
                <div className="lg:pl-8">
                  <Zap size={24} className="text-[#eab308] mb-4" />
                  <h2 className="text-5xl font-bold text-white mb-4 uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{spotlight.name}</h2>
                  <p className="text-[#a0a0a0] text-base leading-relaxed mb-6">{spotlight.description || 'The signature piece. Bold, unapologetic, and crafted for those who dare to stand out.'}</p>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-[#eab308] text-3xl font-bold">{formatFoodPrice(spotlight, currency)}</span>
                    {spotlight.new_price && (
                      <span className="text-[#6b4a5a] text-lg line-through">{formatFoodPrice(spotlight, currency, { original: true })}</span>
                    )}
                  </div>
                  <button
                    data-add-to-cart={spotlight.id}
                    onClick={() => onAddToCart?.(spotlight.id)}
                    className="bg-[#ec4899] text-white px-10 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#db2777] transition-all duration-300 flex items-center gap-2"
                  >
                    <ShoppingBag size={16} /> Grab It Now
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Collection */}
        <section id="collection" className="py-24 lg:py-28 bg-[#0f0a0a]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between mb-16">
              <div>
                <span className="text-[#ec4899] text-sm font-bold uppercase tracking-widest block mb-3">Fresh Drops</span>
                <h2 className="text-5xl md:text-6xl font-bold text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Collection</h2>
              </div>
              <Camera size={24} className="text-[#a0a0a0]" />
            </div>
            {store.foods.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.foods.slice(0, 6).map((food) => {
                  return (
                    <div
                      key={food.id}
                      className="group bg-[#151010] border border-[#ec4899]/20 hover:border-[#ec4899]/60 rounded-xl overflow-hidden transition-all duration-500"
                    >
                      <div className="relative h-72 overflow-hidden">
                        {food.image ? (
                          <img
                            src={getImageUrl(food.image) ?? undefined}
                            alt={food.name}
                            className="w-full h-full object-cover transition-transform duration-700"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gray-800">
                            <Utensils className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500" />
                        {food.is_offer && (
                          <span className="absolute top-3 right-3 bg-[#eab308] text-[#0f0a0a] text-xs font-bold px-3 py-1 rounded-full">
                            SALE
                          </span>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-1 uppercase tracking-wide">{food.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-[#eab308] text-lg font-bold">
                            {formatFoodPrice(food, currency)}
                          </span>
                          {food.new_price && (
                            <span className="text-[#6b4a5a] text-sm line-through">{formatFoodPrice(food, currency, { original: true })}</span>
                          )}
                        </div>
                        <button
                          data-add-to-cart={food.id}
                          onClick={() => onAddToCart?.(food.id)}
                          className="w-full mt-4 border border-[#ec4899] text-[#ec4899] px-4 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#ec4899] hover:text-white transition-all duration-300"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-[#ec4899]/30 rounded-xl">
                <Skull size={48} className="text-[#ec4899]/40 mx-auto mb-4" />
                <p className="text-[#a0a0a0] text-lg uppercase tracking-wider">Collection dropping soon. Stay locked.</p>
              </div>
            )}
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="py-24 lg:py-28 bg-[#151010]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#ec4899] text-sm font-bold uppercase tracking-widest block mb-3">Hype Check</span>
              <h2 className="text-5xl md:text-6xl font-bold text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>What the Streets Say</h2>
            </div>
            {store.reviews.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {store.reviews.slice(0, 4).map((review) => (
                  <div
                    key={review.id}
                    className="bg-[#0f0a0a] p-8 rounded-xl border border-[#ec4899]/10 hover:border-[#ec4899]/30 transition-all duration-300"
                  >
                    <StarRating rating={review.rating} size={18} activeColor="#ec4899" inactiveColor="#3b1f2e" />
                    <p className="text-[#a0a0a0] leading-relaxed mt-4 mb-6">
                      &ldquo;{review.comment || 'Straight fire. Best thing I have tasted in years.'}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      {review.avatar ? (
                        <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-10 h-10 rounded-full object-cover border border-[#ec4899]/30" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#ec4899]/20 border border-[#ec4899]/30 flex items-center justify-center">
                          <span className="text-[#ec4899] font-bold text-sm">{review.user.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-white text-sm uppercase tracking-wide">{review.user}</p>
                        <p className="text-[#6b4a5a] text-xs">Verified</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Music size={48} className="text-[#ec4899]/40 mx-auto mb-4" />
                <p className="text-[#a0a0a0] text-lg uppercase tracking-wider">No reviews yet. Drop your feedback.</p>
              </div>
            )}
          </div>
        </section>

        {/* Crew */}
        <section id="crew" className="py-24 lg:py-28 bg-[#0f0a0a]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#ec4899] text-sm font-bold uppercase tracking-widest block mb-3">The Crew</span>
              <h2 className="text-5xl md:text-6xl font-bold text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Meet the Team</h2>
            </div>
            {store.staff.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {store.staff.map((member, idx) => (
                  <div key={idx} className="bg-[#151010] rounded-xl p-8 text-center border border-[#ec4899]/10 hover:border-[#ec4899]/30 transition-all duration-300">
                    <div className="w-20 h-20 rounded-full bg-[#ec4899]/10 border-2 border-[#ec4899] mx-auto mb-4 flex items-center justify-center">
                      <span className="text-[#ec4899] text-3xl font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{member.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1 uppercase tracking-wide">{member.name}</h3>
                    <p className="text-[#a0a0a0] text-sm uppercase tracking-wider">{member.role}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Users size={48} className="text-[#ec4899]/40 mx-auto mb-4" />
                <p className="text-[#a0a0a0] text-lg uppercase tracking-wider">Crew info loading.</p>
              </div>
            )}
          </div>
        </section>

        {/* Opening Hours */}
        <section id="hours" className="py-24 lg:py-28 bg-[#151010]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#ec4899] text-sm font-bold uppercase tracking-widest block mb-3">Schedule</span>
              <h2 className="text-5xl md:text-6xl font-bold text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Opening Hours</h2>
            </div>
            {store.opening_hours ? (
              <div className="max-w-lg mx-auto bg-[#0f0a0a] rounded-xl border border-[#ec4899]/20 overflow-hidden">
                <div className="divide-y divide-[#ec4899]/10">
                  {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                    <div key={day} className="flex items-center justify-between px-8 py-4">
                      <span className="text-white font-bold uppercase tracking-wider text-sm flex items-center gap-3">
                        <Clock size={14} className="text-[#ec4899]" />
                        {day}
                      </span>
                      <span className="text-[#a0a0a0] text-sm">
                        {hrs.open} &mdash; {hrs.close}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <Clock size={48} className="text-[#ec4899]/40 mx-auto mb-4" />
                <p className="text-[#a0a0a0] text-lg uppercase tracking-wider">Hours TBA</p>
              </div>
            )}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-24 lg:py-28 bg-[#0f0a0a]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#ec4899] text-sm font-bold uppercase tracking-widest block mb-3">Connect</span>
              <h2 className="text-5xl md:text-6xl font-bold text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Hit Us Up</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-[#151010] rounded-xl p-8 text-center border border-[#ec4899]/10 hover:border-[#ec4899]/30 transition-all duration-300">
                <Phone size={28} className="text-[#ec4899] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">Phone</h3>
                {store.phone ? (
                  <a href={`tel:${store.phone}`} className="text-[#eab308] text-sm hover:underline">{store.phone}</a>
                ) : (
                  <p className="text-[#6b4a5a] text-sm">Coming soon</p>
                )}
              </div>
              <div className="bg-[#151010] rounded-xl p-8 text-center border border-[#ec4899]/10 hover:border-[#ec4899]/30 transition-all duration-300">
                <Mail size={28} className="text-[#ec4899] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">Email</h3>
                {store.email ? (
                  <a href={`mailto:${store.email}`} className="text-[#eab308] text-sm hover:underline">{store.email}</a>
                ) : (
                  <p className="text-[#6b4a5a] text-sm">Coming soon</p>
                )}
              </div>
              <div className="bg-[#151010] rounded-xl p-8 text-center border border-[#ec4899]/10 hover:border-[#ec4899]/30 transition-all duration-300">
                <MapPin size={28} className="text-[#ec4899] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-2">Address</h3>
                {store.address ? (
                  <p className="text-[#a0a0a0] text-sm">{store.address}</p>
                ) : (
                  <p className="text-[#6b4a5a] text-sm">Coming soon</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0a0606] border-t border-[#ec4899]/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
              <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  {logoUrl ? (
                    <img src={logoUrl} alt={store.name} className="h-8 w-auto object-contain" />
                  ) : (
                    <Skull size={20} className="text-[#ec4899]" />
                  )}
                  <span className="text-xl font-bold text-white uppercase tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{store.name}</span>
                </div>
                <p className="text-[#6b4a5a] text-sm leading-relaxed mb-6 max-w-xs uppercase tracking-wider">Street culture meets flavor. Stay hungry, stay bold.</p>
                <div className="flex items-center gap-3">
                  <Flame size={14} className="text-[#ec4899]" />
                  <span className="text-[#6b4a5a] text-xs uppercase tracking-wider">Est. {new Date().getFullYear()}</span>
                </div>
              </div>
              <div>
                <h4 className="text-[#ec4899] text-xs tracking-widest uppercase font-bold mb-6">Navigate</h4>
                <ul className="space-y-3">
                  {['Collection', 'Reviews', 'Crew', 'Contact'].map((link) => (
                    <li key={link}>
                      <a href={`#${link.toLowerCase()}`} className="text-[#6b4a5a] hover:text-[#eab308] text-sm transition-colors duration-300 uppercase tracking-wider">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[#ec4899] text-xs tracking-widest uppercase font-bold mb-6">Links</h4>
                <ul className="space-y-3">
                  {['Lookbook', 'Careers', 'Press', 'FAQ'].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[#6b4a5a] hover:text-[#eab308] text-sm transition-colors duration-300 uppercase tracking-wider">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[#ec4899] text-xs tracking-widest uppercase font-bold mb-6">Connect</h4>
                <ul className="space-y-4">
                  {store.address && (
                    <li className="flex items-start gap-3 text-[#6b4a5a] text-sm">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-[#ec4899]" />
                      <span className="uppercase tracking-wider">{store.address}</span>
                    </li>
                  )}
                  {store.phone && (
                    <li className="flex items-center gap-3 text-[#6b4a5a] text-sm">
                      <Phone size={14} className="shrink-0 text-[#ec4899]" />
                      <a href={`tel:${store.phone}`} className="hover:text-[#eab308] transition-colors uppercase tracking-wider">{store.phone}</a>
                    </li>
                  )}
                  {store.email && (
                    <li className="flex items-center gap-3 text-[#6b4a5a] text-sm">
                      <Mail size={14} className="shrink-0 text-[#ec4899]" />
                      <a href={`mailto:${store.email}`} className="hover:text-[#eab308] transition-colors uppercase tracking-wider">{store.email}</a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-[#1a1111]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[#3b1f2e] text-xs uppercase tracking-wider">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-[#3b1f2e] hover:text-[#ec4899] text-xs transition-colors uppercase tracking-wider">Privacy</a>
                <a href="#" className="text-[#3b1f2e] hover:text-[#ec4899] text-xs transition-colors uppercase tracking-wider">Terms</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
