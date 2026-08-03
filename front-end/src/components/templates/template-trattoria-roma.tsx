'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, ChevronRight, Quote, Wine, Pizza, ChefHat } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import { SocialLinks } from '@/components/templates/blocks/social-links'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface TrattoriaRomaProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const RED = '#8B0000'
const CREAM = '#FFF8DC'
const GREEN = '#2E8B57'
const GOLD = '#D4A017'
const DARK = '#2C1810'
const WARM = '#FDF5E6'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

export function TemplateTrattoriaRoma({ store, themeColors, onAddToCart, onShopNow }: TrattoriaRomaProps) {
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
    servesCuisine: 'Italian, Trattoria, Mediterranean',
    image: getImageUrl(store.cover_image || store.cover),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');
        :root { ${Object.entries(c).map(([k, v]) => `${k}: ${v};`).join('\n')} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-[#FDF5E6] text-[#2C1810] font-['Inter'] overflow-x-hidden">
        {/* ── Announcement Bar ── */}
        <div className="bg-[#8B0000] text-[#FFF8DC] text-center text-xs sm:text-sm py-2 px-4 tracking-wider overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <span className="mx-4">🍝 Authentic Italian Trattoria since 1989</span>
            <span className="mx-4">✦</span>
            <span className="mx-4">🍷 Imported Wines &amp; House Specials</span>
            <span className="mx-4">✦</span>
            <span className="mx-4">🇮🇹 Cucina della Nonna</span>
          </div>
        </div>

        {/* ── Navbar ── */}
        <nav
          className={cn(
            'fixed top-8 left-0 right-0 z-50 transition-all duration-500',
            scrolled ? 'top-0 bg-[#2C1810]/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-transparent'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                {store.logo ? (
                  <img
                    src={getImageUrl(store.logo) || ''}
                    alt={store.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-[#D4A017]/40"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[#8B0000] flex items-center justify-center">
                    <ChefHat size={18} className="text-[#FFF8DC]" />
                  </div>
                )}
                <span className="font-['Playfair_Display'] text-xl italic text-[#FFF8DC] tracking-wide">
                  {store.name}
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-8">
                {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm tracking-wider text-[#DEB887] hover:text-[#D4A017] transition-colors duration-300 font-medium"
                  >
                    {item}
                  </a>
                ))}
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="bg-[#8B0000] text-[#FFF8DC] px-6 py-2.5 text-sm tracking-wider font-semibold hover:bg-[#A00000] transition-all duration-300 shadow-md"
                  >
                    Order Now
                  </button>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-[#FFF8DC] p-2"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          <div
            className={cn(
              'lg:hidden overflow-hidden transition-all duration-400',
              menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="bg-[#2C1810]/98 backdrop-blur-md border-t border-[#D4A017]/10 px-4 py-6 space-y-4">
              {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm tracking-wider text-[#DEB887] hover:text-[#D4A017] transition-colors"
                >
                  {item}
                </a>
              ))}
              {onShopNow && (
                <button
                  onClick={() => { setMenuOpen(false); onShopNow?.() }}
                  className="w-full bg-[#8B0000] text-[#FFF8DC] px-6 py-3 text-sm tracking-wider font-semibold"
                >
                  Order Now
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center overflow-hidden pt-8">
          {(store.cover_image || store.cover) && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${getImageUrl(store.cover_image || store.cover)})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C1810]/90 via-[#2C1810]/70 to-[#2C1810]/50" />
          {/* Checkered pattern overlay */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 42px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 42px)' }} />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center py-32">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#8B0000]/80 px-4 py-2 mb-6">
                  <Wine size={14} className="text-[#D4A017]" />
                  <span className="text-[#FFF8DC] text-xs tracking-[0.2em] uppercase font-medium">Autentica Cucina Italiana</span>
                </div>
                <h1 className="font-['Playfair_Display'] italic text-5xl sm:text-6xl md:text-7xl text-[#FFF8DC] leading-tight">
                  {store.name}
                </h1>
                <div className="w-20 h-0.5 bg-[#D4A017] my-6" />
                <p className="text-lg sm:text-xl text-[#DEB887] max-w-lg leading-relaxed font-light">
                  {store.description || 'A taste of Rome in every dish — handmade pasta, wood-fired perfection, and the warmth of la dolce vita.'}
                </p>
                <div className="flex items-center gap-4 mt-10 flex-wrap">
                  <button
                    onClick={onShopNow}
                    className="bg-[#8B0000] text-[#FFF8DC] px-8 py-3.5 text-sm tracking-wider font-semibold hover:bg-[#A00000] transition-all duration-300 shadow-xl shadow-black/20"
                  >
                    View Our Menu
                  </button>
                  <a
                    href="#menu"
                    className="border-2 border-[#D4A017]/50 text-[#D4A017] px-8 py-3.5 text-sm tracking-wider font-medium hover:bg-[#D4A017]/10 transition-all duration-300"
                  >
                    Reserve a Table
                  </a>
                </div>
                {store.avg_rating > 0 && (
                  <div className="flex items-center gap-3 mt-10 bg-white/5 backdrop-blur-sm px-5 py-3 border border-[#D4A017]/20 max-w-fit">
                    <StarRating rating={store.avg_rating} size={18} activeColor="#D4A017" inactiveColor="#DEB887" />
                    <span className="text-[#D4A017] text-sm font-medium">{store.avg_rating.toFixed(1)}</span>
                    <span className="text-[#DEB887] text-sm">({store.reviews_count} reviews)</span>
                  </div>
                )}
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative">
                  <div className="w-80 h-80 rounded-full border-2 border-[#D4A017]/30 flex items-center justify-center">
                    <div className="w-72 h-72 rounded-full border-2 border-[#D4A017]/20 flex items-center justify-center bg-[#2C1810]/30">
                      <Pizza size={80} className="text-[#D4A017]/30" />
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-[#8B0000] px-6 py-3 border border-[#D4A017]/30">
                    <p className="text-[#D4A017] font-['Playfair_Display'] italic text-lg">Dal 1989</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Menu Section ── */}
        <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Wine size={24} className="mx-auto text-[#8B0000] mb-3" />
            <span className="text-[#8B0000] text-sm tracking-[0.2em] uppercase font-medium">La Nostra Cucina</span>
            <h2 className="font-['Playfair_Display'] italic text-4xl sm:text-5xl text-[#2C1810] mt-3 mb-4">
              Our Menu
            </h2>
            <div className="w-16 h-0.5 bg-[#8B0000] mx-auto" />
            <p className="text-[#6B4C3B] max-w-xl mx-auto mt-4">Handcrafted with love, just like Nonna used to make</p>
          </div>

          {store.foods.length === 0 ? (
            <div className="text-center py-20 border-2 border-[#DEB887] max-w-lg mx-auto bg-[#FFF8DC]/50">
              <Pizza size={48} className="mx-auto text-[#8B0000]/30 mb-4" />
              <p className="font-['Playfair_Display'] italic text-2xl text-[#2C1810] mb-2">Menu in Preparation</p>
              <p className="text-[#6B4C3B]">Our chefs are crafting something special.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {store.foods.map((food, idx) => (
                <div
                  key={food.id}
                  className={cn(
                    'group bg-white border-l-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-500 p-6',
                    idx % 2 === 0 ? 'border-l-[#8B0000]' : 'border-l-[#2E8B57]'
                  )}
                >
                  <div className="flex gap-5">
                    <div className="relative shrink-0">
                      {food.image ? (
                        <img
                          src={getImageUrl(food.image) ?? undefined}
                          alt={food.name}
                          className="w-24 h-24 object-cover rounded-sm"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-[#FDF5E6] flex items-center justify-center border border-[#DEB887]">
                          <Pizza size={28} className="text-[#DEB887]" />
                        </div>
                      )}
                      {food.is_offer && (
                        <span className="absolute -top-2 -right-2 bg-[#D4A017] text-[#2C1810] text-[9px] tracking-widest uppercase px-2 py-0.5 font-bold">
                          Speciale
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#2C1810] group-hover:text-[#8B0000] transition-colors">
                        {food.name}
                      </h3>
                      {food.description && (
                        <p className="text-[#6B4C3B] text-sm mt-1.5 line-clamp-2 leading-relaxed italic">
                          {food.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#DEB887]">
                        <div>
                          <span className="font-['Playfair_Display'] text-lg font-bold text-[#8B0000]">
                            {formatFoodPrice(food, currency)}
                          </span>
                          {food.new_price && (
                            <span className="text-[#6B4C3B] text-xs line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>
                          )}
                        </div>
                        {onAddToCart && (
                          <button
                            data-add-to-cart={food.id}
                            onClick={() => onAddToCart(food.id)}
                            className="bg-[#8B0000]/10 text-[#8B0000] px-4 py-2 text-xs tracking-wider uppercase font-semibold hover:bg-[#8B0000] hover:text-[#FFF8DC] active:scale-[0.97] transition-all duration-300"
                          >
                            <ShoppingCart size={14} className="inline-block mr-1" />
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Reviews Section ── */}
        <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FFF8DC]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#8B0000] text-sm tracking-[0.2em] uppercase font-medium">Testimonianze</span>
              <h2 className="font-['Playfair_Display'] italic text-4xl sm:text-5xl text-[#2C1810] mt-3 mb-4">
                Guest Reviews
              </h2>
              <div className="w-16 h-0.5 bg-[#8B0000] mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.reviews.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white border border-[#DEB887] p-6 hover:shadow-md transition-all duration-300">
                      <StarRating rating={5} size={16} activeColor="#D4A017" inactiveColor="#DEB887" />
                      <Quote size={20} className="text-[#8B0000]/20 mt-4 mb-3" />
                      <p className="text-[#6B4C3B] italic text-sm leading-relaxed mb-4">
                        The most authentic Italian food outside of Rome. Every dish tells a story.
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#DEB887]">
                        <div className="w-10 h-10 rounded-full bg-[#8B0000]/10 flex items-center justify-center">
                          <span className="text-[#8B0000] text-sm font-semibold">G</span>
                        </div>
                        <div>
                          <p className="text-[#2C1810] text-sm font-medium">Guest</p>
                          <p className="text-[#6B4C3B] text-xs">Verified Diner</p>
                        </div>
                      </div>
                    </div>
                  ))
                : store.reviews.map((review) => (
                    <div key={review.id} className="bg-white border border-[#DEB887] hover:border-[#8B0000]/30 p-6 hover:shadow-md transition-all duration-300">
                      <StarRating rating={review.rating} size={16} activeColor="#D4A017" inactiveColor="#DEB887" />
                      <Quote size={20} className="text-[#8B0000]/20 mt-4 mb-3" />
                      <p className="text-[#6B4C3B] italic text-sm leading-relaxed mb-4 line-clamp-4">
                        {review.comment || 'A wonderful dining experience.'}
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#DEB887]">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          {review.avatar ? (
                            <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#8B0000]/10 flex items-center justify-center">
                              <span className="text-[#8B0000] text-sm font-semibold">{review.user.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[#2C1810] text-sm font-medium">{review.user}</p>
                          <p className="text-[#6B4C3B] text-xs">Verified Diner</p>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* ── Staff Section ── */}
        {store.staff.length > 0 && (
          <section id="team" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <ChefHat size={24} className="mx-auto text-[#8B0000] mb-3" />
              <span className="text-[#8B0000] text-sm tracking-[0.2em] uppercase font-medium">Il Nostro Team</span>
              <h2 className="font-['Playfair_Display'] italic text-4xl sm:text-5xl text-[#2C1810] mt-3 mb-4">
                Meet the Team
              </h2>
              <div className="w-16 h-0.5 bg-[#8B0000] mx-auto" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {store.staff.map((member, idx) => (
                <div key={idx} className="text-center group">
                  <div className={cn(
                    'w-24 h-24 mx-auto rounded-full border-2 flex items-center justify-center bg-[#FFF8DC] transition-all duration-300 shadow-sm',
                    idx % 2 === 0 ? 'border-[#8B0000] group-hover:border-[#D4A017]' : 'border-[#2E8B57] group-hover:border-[#D4A017]'
                  )}>
                    <span className="font-['Playfair_Display'] text-3xl font-bold italic text-[#8B0000]">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-[#2C1810] font-['Playfair_Display'] font-semibold mt-4 group-hover:text-[#8B0000] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-[#6B4C3B] text-sm italic">{member.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Opening Hours ── */}
        {store.opening_hours && (
          <section id="hours" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FFF8DC]">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-12">
                <Clock size={24} className="mx-auto text-[#8B0000] mb-3" />
                <span className="text-[#8B0000] text-sm tracking-[0.2em] uppercase font-medium">Orari</span>
                <h2 className="font-['Playfair_Display'] italic text-4xl text-[#2C1810] mt-3 mb-4">
                  Opening Hours
                </h2>
                <div className="w-16 h-0.5 bg-[#8B0000] mx-auto" />
              </div>

              <div className="border-2 border-[#DEB887] bg-white overflow-hidden">
                <div className="bg-[#8B0000] px-6 py-3">
                  <p className="text-[#FFF8DC] font-['Playfair_Display'] italic font-semibold text-sm">Weekly Schedule</p>
                </div>
                <div className="divide-y divide-[#DEB887]">
                  {DAY_ORDER.map((day) => {
                    const hours = store.opening_hours![day]
                    return (
                      <div key={day} className="flex items-center justify-between px-6 py-4 hover:bg-[#FFF8DC] transition-colors">
                        <span className="text-[#2C1810] text-sm font-medium capitalize">{DAY_LABELS[day]}</span>
                        {hours ? (
                          <span className="text-[#8B0000] text-sm font-semibold">
                            {hours.open} – {hours.close}
                          </span>
                        ) : (
                          <span className="text-[#6B4C3B] text-sm italic">Closed</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Contact Section ── */}
        <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#8B0000] text-sm tracking-[0.2em] uppercase font-medium">Contattaci</span>
            <h2 className="font-['Playfair_Display'] italic text-4xl sm:text-5xl text-[#2C1810] mt-3 mb-4">
              Get in Touch
            </h2>
            <div className="w-16 h-0.5 bg-[#8B0000] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {store.phone && (
              <a
                href={`tel:${store.phone}`}
                className="group bg-white border border-[#DEB887] hover:border-[#8B0000]/40 p-8 text-center transition-all duration-300 hover:shadow-md"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#8B0000]/10 group-hover:bg-[#8B0000]/20 flex items-center justify-center mb-5 transition-colors">
                  <Phone size={22} className="text-[#8B0000]" />
                </div>
                <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#2C1810] mb-2">Phone</h3>
                <p className="text-[#6B4C3B] text-sm">{store.phone}</p>
              </a>
            )}
            {store.email && (
              <a
                href={`mailto:${store.email}`}
                className="group bg-white border border-[#DEB887] hover:border-[#8B0000]/40 p-8 text-center transition-all duration-300 hover:shadow-md"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#8B0000]/10 group-hover:bg-[#8B0000]/20 flex items-center justify-center mb-5 transition-colors">
                  <Mail size={22} className="text-[#8B0000]" />
                </div>
                <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#2C1810] mb-2">Email</h3>
                <p className="text-[#6B4C3B] text-sm">{store.email}</p>
              </a>
            )}
            {store.address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-[#DEB887] hover:border-[#8B0000]/40 p-8 text-center transition-all duration-300 hover:shadow-md"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#8B0000]/10 group-hover:bg-[#8B0000]/20 flex items-center justify-center mb-5 transition-colors">
                  <MapPin size={22} className="text-[#8B0000]" />
                </div>
                <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#2C1810] mb-2">Address</h3>
                <p className="text-[#6B4C3B] text-sm">{store.address}</p>
              </a>
            )}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-[#2C1810] border-t-4 border-[#8B0000]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {store.logo ? (
                    <img
                      src={getImageUrl(store.logo) || ''}
                      alt={store.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-[#D4A017]/30"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-[#8B0000] flex items-center justify-center">
                      <ChefHat size={18} className="text-[#FFF8DC]" />
                    </div>
                  )}
                  <span className="font-['Playfair_Display'] italic text-lg text-[#FFF8DC]">{store.name}</span>
                </div>
                <p className="text-[#DEB887] text-sm leading-relaxed mb-6 font-light">
                  {store.description || 'Authentic Italian cuisine served with love and tradition.'}
                </p>
                <SocialLinks links={store.social_links ?? []} />
              </div>

              <div>
                <h4 className="font-['Playfair_Display'] italic text-[#D4A017] text-lg mb-5">Quick Links</h4>
                <ul className="space-y-3">
                  {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-[#DEB887] hover:text-[#D4A017] text-sm transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-['Playfair_Display'] italic text-[#D4A017] text-lg mb-5">Information</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#DEB887] hover:text-[#D4A017] text-sm transition-colors">Our Story</a></li>
                  <li><a href="#" className="text-[#DEB887] hover:text-[#D4A017] text-sm transition-colors">Reservations</a></li>
                  <li><a href="#" className="text-[#DEB887] hover:text-[#D4A017] text-sm transition-colors">Private Events</a></li>
                  <li><a href="#" className="text-[#DEB887] hover:text-[#D4A017] text-sm transition-colors">Gift Cards</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-['Playfair_Display'] italic text-[#D4A017] text-lg mb-5">Contact</h4>
                <ul className="space-y-3">
                  {store.phone && (
                    <li>
                      <a href={`tel:${store.phone}`} className="text-[#DEB887] hover:text-[#D4A017] text-sm transition-colors flex items-center gap-2">
                        <Phone size={14} /> {store.phone}
                      </a>
                    </li>
                  )}
                  {store.email && (
                    <li>
                      <a href={`mailto:${store.email}`} className="text-[#DEB887] hover:text-[#D4A017] text-sm transition-colors flex items-center gap-2">
                        <Mail size={14} /> {store.email}
                      </a>
                    </li>
                  )}
                  {store.address && (
                    <li className="flex items-start gap-2 text-[#DEB887] text-sm">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span>{store.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#D4A017]/10 bg-[#1E0F0A]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[#DEB887]/60 text-xs">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
              <p className="text-[#DEB887]/60 text-xs italic">
                Cucina della Nonna — Fatto con amore
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
