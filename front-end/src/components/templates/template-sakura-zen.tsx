'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, Quote, Cherry, Wind } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface SakuraZenProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const PINK = '#FFB7C5'
const DEEP_PINK = '#D4617A'
const CHARCOAL = '#2D2D2D'
const SAGE = '#93C572'
const LIGHT = '#FEFCFD'
const WARM_GRAY = '#8C8C8C'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

export function TemplateSakuraZen({ store, themeColors, onAddToCart, onShopNow }: SakuraZenProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const { currency } = useCurrency()

  const c = { ...themeColors } as Record<string, string>

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: store.name,
    description: store.description,
    telephone: store.phone,
    email: store.email,
    address: store.address ? { '@type': 'PostalAddress', streetAddress: store.address } : undefined,
    aggregateRating: store.reviews_count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: store.avg_rating,
      reviewCount: store.reviews_count,
    } : undefined,
    servesCuisine: 'Japanese, Sushi, Ramen, Asian',
    image: getImageUrl(store.cover_image || store.cover),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@200;400;500;600;700&family=Inter:wght@200;300;400;500;600&display=swap');
        :root { ${Object.entries(c).map(([k, v]) => `${k}: ${v};`).join('\n')} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-[#FEFCFD] text-[#2D2D2D] font-['Inter'] overflow-x-hidden">
        {/* ── Navbar ── */}
        <nav
          className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
            scrolled ? 'bg-white/85 backdrop-blur-lg shadow-sm' : 'bg-transparent'
          )}
        >
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-2">
                {store.logo && (
                  <img
                    src={getImageUrl(store.logo) || ''}
                    alt={store.name}
                    className="h-8 w-8 rounded object-cover"
                  />
                )}
                <span className="font-['Noto_Serif_JP'] text-lg tracking-wider text-[#2D2D2D] font-light">
                  {store.name}
                </span>
              </div>

              <div className="hidden md:flex items-center gap-10">
                {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-xs tracking-[0.15em] uppercase text-[#8C8C8C] hover:text-[#D4617A] transition-colors duration-300 font-light"
                  >
                    {item}
                  </a>
                ))}
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="border border-[#D4617A]/40 text-[#D4617A] px-5 py-2 text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#D4617A] hover:text-white transition-all duration-300"
                  >
                    Order
                  </button>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-[#2D2D2D] p-1"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          <div
            className={cn(
              'md:hidden overflow-hidden transition-all duration-400',
              menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="bg-white/98 backdrop-blur-lg border-t border-[#FFB7C5]/20 px-6 py-6 space-y-4">
              {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-xs tracking-[0.15em] uppercase text-[#8C8C8C] hover:text-[#D4617A] transition-colors"
                >
                  {item}
                </a>
              ))}
              {onShopNow && (
                <button
                  onClick={() => { setMenuOpen(false); onShopNow?.() }}
                  className="w-full border border-[#D4617A]/40 text-[#D4617A] px-6 py-3 text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#D4617A] hover:text-white transition-all"
                >
                  Order Now
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="min-h-screen flex items-center px-6 sm:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen py-24">
              <div className="relative">
                {/* Cherry blossom decoration */}
                <div className="absolute -top-8 -left-8 text-[#FFB7C5]/40">
                  <Cherry size={48} />
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-px bg-[#D4617A]" />
                    <span className="text-[#D4617A] text-xs tracking-[0.25em] uppercase font-light">Sakura Season</span>
                  </div>
                  <h1 className="font-['Noto_Serif_JP'] text-5xl sm:text-6xl md:text-7xl text-[#2D2D2D] leading-[1.15] font-light tracking-wide">
                    {store.name}
                  </h1>
                  <p className="text-base sm:text-lg text-[#8C8C8C] max-w-md leading-relaxed font-light">
                    {store.description || 'Traditional Japanese cuisine with a modern zen aesthetic. Harmony in every bite.'}
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                    <button
                      onClick={onShopNow}
                      className="bg-[#2D2D2D] text-white px-8 py-3.5 text-sm tracking-[0.15em] uppercase font-light hover:bg-[#4A4A4A] transition-all duration-300"
                    >
                      View Menu
                    </button>
                    <a
                      href="#menu"
                      className="text-[#D4617A] text-sm tracking-[0.15em] uppercase border-b border-[#D4617A]/30 hover:border-[#D4617A] transition-colors pb-0.5"
                    >
                      Discover
                    </a>
                  </div>
                  {store.avg_rating > 0 && (
                    <div className="flex items-center gap-3 pt-6">
                      <StarRating rating={store.avg_rating} size={16} activeColor="#D4617A" inactiveColor="#F0D0D8" />
                      <span className="text-[#8C8C8C] text-sm">{store.avg_rating.toFixed(1)} ({store.reviews_count} reviews)</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                {(store.cover_image || store.cover) ? (
                  <div className="relative">
                    <div className="w-[400px] h-[500px] overflow-hidden rounded-sm shadow-lg">
                      <img
                        src={getImageUrl(store.cover_image || store.cover) || ''}
                        alt={store.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#FFB7C5]/20 rounded-full blur-2xl" />
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#93C572]/20 rounded-full blur-2xl" />
                  </div>
                ) : (
                  <div className="w-[400px] h-[500px] bg-[#FEF4F6] flex items-center justify-center rounded-sm">
                    <Wind size={60} className="text-[#FFB7C5]/40" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Zen Divider ── */}
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="border-t border-[#F0D0D8] py-16 text-center">
            <Cherry size={20} className="mx-auto text-[#FFB7C5]" />
          </div>
        </div>

        {/* ── Menu Section ── */}
        <section id="menu" className="py-16 px-6 sm:px-8 lg:px-12 max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <span className="text-[#D4617A] text-xs tracking-[0.25em] uppercase block mb-3 font-light">Gozen</span>
            <h2 className="font-['Noto_Serif_JP'] text-4xl sm:text-5xl text-[#2D2D2D] font-light tracking-wide">
              Our Menu
            </h2>
            <div className="w-12 h-px bg-[#D4617A] mx-auto mt-6" />
          </div>

          {store.foods.length === 0 ? (
            <div className="text-center py-16 border border-[#F0D0D8] max-w-lg mx-auto">
              <Cherry size={40} className="mx-auto text-[#FFB7C5]/40 mb-4" />
              <p className="font-['Noto_Serif_JP'] text-xl text-[#2D2D2D] mb-2 font-light">Menu in Preparation</p>
              <p className="text-[#8C8C8C] text-sm">Our chefs are crafting a seasonal menu.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {store.foods.map((food) => (
                <div
                  key={food.id}
                  className="group hover:shadow-sm transition-all duration-500"
                >
                  <div className="relative overflow-hidden aspect-square mb-5">
                    {food.image ? (
                      <img
                        src={getImageUrl(food.image) ?? undefined}
                        alt={food.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#FEF4F6] flex items-center justify-center">
                        <Cherry size={36} className="text-[#FFB7C5]/30" />
                      </div>
                    )}
                    {food.is_offer && (
                      <span className="absolute top-3 left-3 bg-[#D4617A] text-white text-[9px] tracking-[0.2em] uppercase px-3 py-1 font-light">
                        Seasonal
                      </span>
                    )}
                  </div>
                  <h3 className="font-['Noto_Serif_JP'] text-lg text-[#2D2D2D] group-hover:text-[#D4617A] transition-colors font-light">
                    {food.name}
                  </h3>
                  {food.description && (
                    <p className="text-[#8C8C8C] text-sm mt-2 line-clamp-2 leading-relaxed font-light">
                      {food.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F0D0D8]">
                    <span className="font-['Noto_Serif_JP'] text-base text-[#D4617A]">
                      {formatFoodPrice(food, currency)}
                    </span>
                    {onAddToCart && (
                      <button
                        data-add-to-cart={food.id}
                        onClick={() => onAddToCart(food.id)}
                        className="border border-[#F0D0D8] text-[#8C8C8C] px-4 py-2 text-xs tracking-[0.15em] uppercase hover:border-[#D4617A] hover:text-[#D4617A] transition-all duration-300"
                      >
                        <ShoppingCart size={12} className="inline-block mr-1" />
                        Add
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Reviews Section ── */}
        <section id="reviews" className="py-24 px-6 sm:px-8 lg:px-12 bg-[#FEF4F6]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#D4617A] text-xs tracking-[0.25em] uppercase block mb-3 font-light">Kuchigomi</span>
              <h2 className="font-['Noto_Serif_JP'] text-4xl sm:text-5xl text-[#2D2D2D] font-light tracking-wide">
                Guest Voices
              </h2>
              <div className="w-12 h-px bg-[#D4617A] mx-auto mt-6" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {store.reviews.length === 0
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white p-8 border border-[#F0D0D8]">
                      <StarRating rating={5} size={14} activeColor="#D4617A" inactiveColor="#F0D0D8" />
                      <Quote size={18} className="text-[#FFB7C5]/30 mt-4 mb-4" />
                      <p className="text-[#8C8C8C] text-sm leading-relaxed mb-6 font-light italic">
                        A serene dining experience. Every dish is a work of art.
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#FFB7C5]/20 flex items-center justify-center">
                          <span className="text-[#D4617A] text-xs font-medium">G</span>
                        </div>
                        <span className="text-[#2D2D2D] text-sm font-light">Guest</span>
                      </div>
                    </div>
                  ))
                : store.reviews.map((review) => (
                    <div key={review.id} className="bg-white p-8 border border-[#F0D0D8] hover:border-[#D4617A]/20 transition-all duration-300">
                      <StarRating rating={review.rating} size={14} activeColor="#D4617A" inactiveColor="#F0D0D8" />
                      <Quote size={18} className="text-[#FFB7C5]/30 mt-4 mb-4" />
                      <p className="text-[#8C8C8C] text-sm leading-relaxed mb-6 line-clamp-3 font-light italic">
                        {review.comment || 'A beautiful dining experience.'}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden">
                          {review.avatar ? (
                            <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#FFB7C5]/20 flex items-center justify-center">
                              <span className="text-[#D4617A] text-xs font-medium">{review.user.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-[#2D2D2D] text-sm font-light">{review.user}</span>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* ── Staff Section ── */}
        {store.staff.length > 0 && (
          <section id="team" className="py-24 px-6 sm:px-8 lg:px-12 max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#D4617A] text-xs tracking-[0.25em] uppercase block mb-3 font-light">Our Team</span>
              <h2 className="font-['Noto_Serif_JP'] text-4xl sm:text-5xl text-[#2D2D2D] font-light tracking-wide">
                The Artisans
              </h2>
              <div className="w-12 h-px bg-[#D4617A] mx-auto mt-6" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10">
              {store.staff.map((member, idx) => (
                <div key={idx} className="text-center group">
                  <div className="w-20 h-20 mx-auto rounded-full border border-[#F0D0D8] group-hover:border-[#D4617A]/50 transition-all duration-300 flex items-center justify-center bg-[#FEFCFD]">
                    <span className="font-['Noto_Serif_JP'] text-2xl text-[#D4617A] font-light">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-[#2D2D2D] font-['Noto_Serif_JP'] text-sm mt-4 group-hover:text-[#D4617A] transition-colors font-light">
                    {member.name}
                  </h3>
                  <p className="text-[#8C8C8C] text-xs mt-1 font-light">{member.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Opening Hours ── */}
        {store.opening_hours && (
          <section id="hours" className="py-24 px-6 sm:px-8 lg:px-12 bg-[#FEF4F6]">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-12">
                <span className="text-[#D4617A] text-xs tracking-[0.25em] uppercase block mb-3 font-light">Hours</span>
                <h2 className="font-['Noto_Serif_JP'] text-4xl text-[#2D2D2D] font-light tracking-wide">
                  Opening Hours
                </h2>
                <div className="w-12 h-px bg-[#D4617A] mx-auto mt-6" />
              </div>

              <div className="border border-[#F0D0D8] bg-white divide-y divide-[#F0D0D8]">
                {DAY_ORDER.map((day) => {
                  const hours = store.opening_hours![day]
                  return (
                    <div key={day} className="flex items-center justify-between px-6 py-4 hover:bg-[#FEF4F6] transition-colors">
                      <span className="text-[#2D2D2D] text-sm font-light capitalize">{DAY_LABELS[day]}</span>
                      {hours ? (
                        <span className="text-[#D4617A] text-sm font-light">
                          {hours.open} – {hours.close}
                        </span>
                      ) : (
                        <span className="text-[#8C8C8C] text-sm font-light italic">Closed</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Contact Section ── */}
        <section id="contact" className="py-24 px-6 sm:px-8 lg:px-12 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#D4617A] text-xs tracking-[0.25em] uppercase block mb-3 font-light">Contact</span>
            <h2 className="font-['Noto_Serif_JP'] text-4xl sm:text-5xl text-[#2D2D2D] font-light tracking-wide">
              Get in Touch
            </h2>
            <div className="w-12 h-px bg-[#D4617A] mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {store.phone && (
              <a href={`tel:${store.phone}`} className="group text-center p-8 hover:bg-[#FEF4F6] transition-all duration-300">
                <div className="w-12 h-12 mx-auto rounded-full border border-[#F0D0D8] group-hover:border-[#D4617A]/30 flex items-center justify-center mb-4 transition-colors">
                  <Phone size={18} className="text-[#D4617A]" />
                </div>
                <h3 className="text-[#2D2D2D] font-['Noto_Serif_JP'] text-sm mb-1 font-light">Phone</h3>
                <p className="text-[#8C8C8C] text-sm font-light">{store.phone}</p>
              </a>
            )}
            {store.email && (
              <a href={`mailto:${store.email}`} className="group text-center p-8 hover:bg-[#FEF4F6] transition-all duration-300">
                <div className="w-12 h-12 mx-auto rounded-full border border-[#F0D0D8] group-hover:border-[#D4617A]/30 flex items-center justify-center mb-4 transition-colors">
                  <Mail size={18} className="text-[#D4617A]" />
                </div>
                <h3 className="text-[#2D2D2D] font-['Noto_Serif_JP'] text-sm mb-1 font-light">Email</h3>
                <p className="text-[#8C8C8C] text-sm font-light">{store.email}</p>
              </a>
            )}
            {store.address && (
              <div className="group text-center p-8 hover:bg-[#FEF4F6] transition-all duration-300">
                <div className="w-12 h-12 mx-auto rounded-full border border-[#F0D0D8] group-hover:border-[#D4617A]/30 flex items-center justify-center mb-4 transition-colors">
                  <MapPin size={18} className="text-[#D4617A]" />
                </div>
                <h3 className="text-[#2D2D2D] font-['Noto_Serif_JP'] text-sm mb-1 font-light">Address</h3>
                <p className="text-[#8C8C8C] text-sm font-light">{store.address}</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-[#2D2D2D]">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {store.logo && (
                    <img
                      src={getImageUrl(store.logo) || ''}
                      alt={store.name}
                      className="h-7 w-7 rounded object-cover brightness-75"
                    />
                  )}
                  <span className="font-['Noto_Serif_JP'] text-base text-[#FEFCFD] font-light">{store.name}</span>
                </div>
                <p className="text-[#8C8C8C] text-sm leading-relaxed mb-6 font-light">
                  {store.description || 'Traditional Japanese cuisine with zen harmony.'}
                </p>
                <div className="flex items-center gap-4">
                  <a href="#" className="text-[#5A5A5A] hover:text-[#FFB7C5] transition-colors" aria-label="Instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                  <a href="#" className="text-[#5A5A5A] hover:text-[#FFB7C5] transition-colors" aria-label="Facebook">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-[#FFB7C5] text-xs tracking-[0.2em] uppercase mb-6 font-light">Links</h4>
                <ul className="space-y-3">
                  {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-[#8C8C8C] hover:text-[#FFB7C5] text-sm transition-colors font-light">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[#FFB7C5] text-xs tracking-[0.2em] uppercase mb-6 font-light">Info</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#8C8C8C] hover:text-[#FFB7C5] text-sm transition-colors font-light">Our Story</a></li>
                  <li><a href="#" className="text-[#8C8C8C] hover:text-[#FFB7C5] text-sm transition-colors font-light">Reservations</a></li>
                  <li><a href="#" className="text-[#8C8C8C] hover:text-[#FFB7C5] text-sm transition-colors font-light">Private Dining</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-[#FFB7C5] text-xs tracking-[0.2em] uppercase mb-6 font-light">Contact</h4>
                <ul className="space-y-3">
                  {store.phone && (
                    <li>
                      <a href={`tel:${store.phone}`} className="text-[#8C8C8C] hover:text-[#FFB7C5] text-sm transition-colors flex items-center gap-2 font-light">
                        <Phone size={12} /> {store.phone}
                      </a>
                    </li>
                  )}
                  {store.email && (
                    <li>
                      <a href={`mailto:${store.email}`} className="text-[#8C8C8C] hover:text-[#FFB7C5] text-sm transition-colors flex items-center gap-2 font-light">
                        <Mail size={12} /> {store.email}
                      </a>
                    </li>
                  )}
                  {store.address && (
                    <li className="flex items-start gap-2 text-[#8C8C8C] text-sm font-light">
                      <MapPin size={12} className="mt-0.5 shrink-0" />
                      <span>{store.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#3D3D3D]">
            <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[#5A5A5A] text-xs font-light">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
              <p className="text-[#5A5A5A] text-xs font-light italic">
                Wa — Harmony in every dish
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
