'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, Quote, Heart, Sparkles, Cake } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface SweetDreamsProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const PINK = '#FFB6C1'
const MINT = '#98FB98'
const LAVENDER = '#E6E6FA'
const CREAM = '#FFF5EE'
const DUSTY_ROSE = '#D4A0A0'
const CHARCOAL = '#4A4A4A'
const GOLD = '#D4AF37'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

export function TemplateSweetDreams({ store, themeColors, onAddToCart, onShopNow }: SweetDreamsProps) {
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
    servesCuisine: 'French, Patisserie, Desserts, Bakery',
    image: getImageUrl(store.cover_image || store.cover),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@200;300;400;500&display=swap');
        :root { ${Object.entries(c).map(([k, v]) => `${k}: ${v};`).join('\n')} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-[#FFF5EE] text-[#4A4A4A] font-['Inter'] overflow-x-hidden">
        {/* ── Navbar ── */}
        <nav
          className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
            scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm shadow-pink-200/30' : 'bg-transparent'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-2">
                {store.logo ? (
                  <img
                    src={getImageUrl(store.logo) || ''}
                    alt={store.name}
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-[#D4A0A0]/30"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#FFB6C1] to-[#E6E6FA] flex items-center justify-center">
                    <Cake size={16} className="text-white" />
                  </div>
                )}
                <span className="font-['Playfair_Display'] italic text-lg text-[#4A4A4A] tracking-wide">
                  {store.name}
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-6">
                {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-[#A08090] hover:text-[#D4A0A0] transition-colors duration-300 font-light"
                  >
                    {item}
                  </a>
                ))}
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="bg-gradient-to-r from-[#FFB6C1] to-[#E6E6FA] text-[#4A4A4A] px-6 py-2.5 text-sm font-medium rounded-full hover:shadow-lg hover:shadow-pink-200/40 transition-all duration-300"
                  >
                    Order Now
                  </button>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-[#4A4A4A] p-2"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          <div
            className={cn(
              'lg:hidden overflow-hidden transition-all duration-400',
              menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="bg-white/98 backdrop-blur-md border-t border-[#FFE4E9] px-4 py-6 space-y-4">
              {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm text-[#A08090] hover:text-[#D4A0A0] transition-colors"
                >
                  {item}
                </a>
              ))}
              {onShopNow && (
                <button
                  onClick={() => { setMenuOpen(false); onShopNow?.() }}
                  className="w-full bg-gradient-to-r from-[#FFB6C1] to-[#E6E6FA] text-[#4A4A4A] px-6 py-3 text-sm font-medium rounded-full"
                >
                  Order Now
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5EE] via-[#FFE4E9] to-[#E6E6FA]" />
          {/* Decorative dots */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #FFB6C1 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-5 py-2 rounded-full mb-8 border border-[#FFB6C1]/30">
                <Sparkles size={14} className="text-[#D4AF37]" />
                <span className="text-[#D4A0A0] text-xs tracking-wider uppercase font-medium">Artisan Pâtisserie</span>
              </div>
              <h1 className="font-['Playfair_Display'] italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#4A4A4A] leading-tight">
                {store.name}
              </h1>
              <div className="flex items-center justify-center gap-3 my-6">
                <span className="w-8 h-px bg-[#D4A0A0]" />
                <Heart size={16} className="text-[#FFB6C1] fill-[#FFB6C1]" />
                <span className="w-8 h-px bg-[#D4A0A0]" />
              </div>
              <p className="text-base sm:text-lg text-[#A08090] max-w-xl mx-auto leading-relaxed font-light">
                {store.description || 'Delicate French patisserie crafted with love. Every bite is a sweet rêve — a dream come true.'}
              </p>
              <div className="flex items-center justify-center gap-4 mt-10 flex-wrap">
                <button
                  onClick={onShopNow}
                  className="bg-gradient-to-r from-[#FFB6C1] to-[#E6E6FA] text-[#4A4A4A] px-10 py-4 text-sm font-medium rounded-full hover:shadow-xl hover:shadow-pink-200/30 transition-all duration-300"
                >
                  View Our Menu
                </button>
                <a
                  href="#menu"
                  className="border border-[#D4A0A0]/40 text-[#D4A0A0] px-10 py-4 text-sm font-light rounded-full hover:bg-white/50 transition-all duration-300"
                >
                  Sweet Selection
                </a>
              </div>
              {store.avg_rating > 0 && (
                <div className="mt-10 inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-[#FFB6C1]/20">
                  <StarRating rating={store.avg_rating} size={18} activeColor="#D4AF37" inactiveColor="#E8D5E0" />
                  <span className="text-[#4A4A4A] text-sm font-medium">{store.avg_rating.toFixed(1)}</span>
                  <span className="text-[#A08090] text-sm">({store.reviews_count} reviews)</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Menu Section ── */}
        <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Cake size={24} className="mx-auto text-[#D4A0A0] mb-3" />
            <span className="text-[#D4A0A0] text-xs tracking-[0.25em] uppercase font-medium">Nos Délices</span>
            <h2 className="font-['Playfair_Display'] italic text-4xl sm:text-5xl text-[#4A4A4A] mt-3 mb-4">
              Our Sweet Menu
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4A0A0] to-transparent mx-auto" />
          </div>

          {store.foods.length === 0 ? (
            <div className="text-center py-20 bg-white/60 rounded-3xl max-w-lg mx-auto border border-[#FFE4E9]">
              <Cake size={48} className="mx-auto text-[#FFB6C1]/30 mb-4" />
              <p className="font-['Playfair_Display'] italic text-2xl text-[#4A4A4A] mb-2">Coming Soon</p>
              <p className="text-[#A08090] text-sm">Our pâtissier is crafting something delightful.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.foods.map((food) => (
                <div
                  key={food.id}
                  className="group bg-white/80 backdrop-blur-sm rounded-3xl hover:shadow-lg hover:shadow-pink-200/20 transition-all duration-500 overflow-hidden border border-[#FFE4E9]"
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    {food.image ? (
                      <img
                        src={getImageUrl(food.image) ?? undefined}
                        alt={food.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#FFE4E9] to-[#E6E6FA] flex items-center justify-center">
                        <Cake size={36} className="text-[#D4A0A0]/30" />
                      </div>
                    )}
                    {food.is_offer && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-[#FFB6C1] to-[#E6E6FA] text-[#4A4A4A] text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full font-medium shadow-sm">
                        Délicieux
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-['Playfair_Display'] italic text-lg font-medium text-[#4A4A4A] group-hover:text-[#D4A0A0] transition-colors">
                      {food.name}
                    </h3>
                    {food.description && (
                      <p className="text-[#A08090] text-sm mt-2 line-clamp-2 leading-relaxed font-light">
                        {food.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#FFE4E9]">
                      <span className="font-['Playfair_Display'] italic text-lg font-semibold text-[#D4A0A0]">
                        {formatFoodPrice(food, currency)}
                      </span>
                      {onAddToCart && (
                        <button
                          data-add-to-cart={food.id}
                          onClick={() => onAddToCart(food.id)}
                          className="bg-[#FFB6C1]/20 text-[#D4A0A0] px-4 py-2 text-xs font-medium rounded-full hover:bg-gradient-to-r hover:from-[#FFB6C1] hover:to-[#E6E6FA] hover:text-[#4A4A4A] transition-all duration-300 flex items-center gap-1"
                        >
                          <ShoppingCart size={13} />
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Reviews Section ── */}
        <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFE4E9] to-[#FFF5EE]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#D4A0A0] text-xs tracking-[0.25em] uppercase font-medium">Témoignages</span>
              <h2 className="font-['Playfair_Display'] italic text-4xl sm:text-5xl text-[#4A4A4A] mt-3 mb-4">
                Sweet Words
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4A0A0] to-transparent mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.reviews.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-[#FFE4E9]">
                      <StarRating rating={5} size={15} activeColor="#D4AF37" inactiveColor="#E8D5E0" />
                      <Quote size={18} className="text-[#D4A0A0]/20 mt-4 mb-3" />
                      <p className="text-[#A08090] text-sm leading-relaxed mb-4 font-light italic">
                        The most exquisite pastries I have ever tasted. A little piece of Paris in every bite.
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFB6C1] to-[#E6E6FA] flex items-center justify-center">
                          <span className="text-white text-xs font-medium">G</span>
                        </div>
                        <span className="text-[#4A4A4A] text-sm font-light">Guest</span>
                      </div>
                    </div>
                  ))
                : store.reviews.map((review) => (
                    <div key={review.id} className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-[#FFE4E9] hover:border-[#D4A0A0]/30 transition-all duration-300">
                      <StarRating rating={review.rating} size={15} activeColor="#D4AF37" inactiveColor="#E8D5E0" />
                      <Quote size={18} className="text-[#D4A0A0]/20 mt-4 mb-3" />
                      <p className="text-[#A08090] text-sm leading-relaxed mb-4 line-clamp-3 font-light italic">
                        {review.comment || 'Absolutely divine pastries!'}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden">
                          {review.avatar ? (
                            <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#FFB6C1] to-[#E6E6FA] flex items-center justify-center">
                              <span className="text-white text-xs font-medium">{review.user.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-[#4A4A4A] text-sm font-light">{review.user}</span>
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
              <span className="text-[#D4A0A0] text-xs tracking-[0.25em] uppercase font-medium">Notre Équipe</span>
              <h2 className="font-['Playfair_Display'] italic text-4xl sm:text-5xl text-[#4A4A4A] mt-3 mb-4">
                Meet Our Team
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4A0A0] to-transparent mx-auto" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {store.staff.map((member, idx) => (
                <div key={idx} className="text-center group">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#FFB6C1] via-[#E6E6FA] to-[#98FB98] p-0.5 shadow-sm">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <span className="font-['Playfair_Display'] italic text-2xl text-[#D4A0A0]">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-['Playfair_Display'] italic text-sm font-medium text-[#4A4A4A] mt-4 group-hover:text-[#D4A0A0] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-[#A08090] text-xs font-light">{member.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Opening Hours ── */}
        {store.opening_hours && (
          <section id="hours" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFF5EE] to-[#FFE4E9]">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-12">
                <span className="text-[#D4A0A0] text-xs tracking-[0.25em] uppercase font-medium">Heures</span>
                <h2 className="font-['Playfair_Display'] italic text-4xl text-[#4A4A4A] mt-3 mb-4">
                  Opening Hours
                </h2>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4A0A0] to-transparent mx-auto" />
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden border border-[#FFE4E9]">
                <div className="bg-gradient-to-r from-[#FFB6C1] to-[#E6E6FA] px-6 py-3">
                  <p className="text-[#4A4A4A] font-['Playfair_Display'] italic text-sm">Weekly Schedule</p>
                </div>
                <div className="divide-y divide-[#FFE4E9]">
                  {DAY_ORDER.map((day) => {
                    const hours = store.opening_hours![day]
                    return (
                      <div key={day} className="flex items-center justify-between px-6 py-4 hover:bg-[#FFF5EE] transition-colors">
                        <span className="text-[#4A4A4A] text-sm font-light capitalize">{DAY_LABELS[day]}</span>
                        {hours ? (
                          <span className="text-[#D4A0A0] text-sm font-medium">
                            {hours.open} – {hours.close}
                          </span>
                        ) : (
                          <span className="text-[#A08090] text-sm italic font-light">Closed</span>
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
            <span className="text-[#D4A0A0] text-xs tracking-[0.25em] uppercase font-medium">Contactez-Nous</span>
            <h2 className="font-['Playfair_Display'] italic text-4xl sm:text-5xl text-[#4A4A4A] mt-3 mb-4">
              Get in Touch
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4A0A0] to-transparent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {store.phone && (
              <a
                href={`tel:${store.phone}`}
                className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-[#FFE4E9] hover:border-[#D4A0A0]/40 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#FFB6C1]/20 to-[#E6E6FA]/20 group-hover:from-[#FFB6C1]/40 group-hover:to-[#E6E6FA]/40 flex items-center justify-center mb-4 transition-all">
                  <Phone size={20} className="text-[#D4A0A0]" />
                </div>
                <h3 className="font-['Playfair_Display'] italic text-base text-[#4A4A4A] mb-1">Phone</h3>
                <p className="text-[#A08090] text-sm font-light">{store.phone}</p>
              </a>
            )}
            {store.email && (
              <a
                href={`mailto:${store.email}`}
                className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-[#FFE4E9] hover:border-[#D4A0A0]/40 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#FFB6C1]/20 to-[#E6E6FA]/20 group-hover:from-[#FFB6C1]/40 group-hover:to-[#E6E6FA]/40 flex items-center justify-center mb-4 transition-all">
                  <Mail size={20} className="text-[#D4A0A0]" />
                </div>
                <h3 className="font-['Playfair_Display'] italic text-base text-[#4A4A4A] mb-1">Email</h3>
                <p className="text-[#A08090] text-sm font-light">{store.email}</p>
              </a>
            )}
            {store.address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-[#FFE4E9] hover:border-[#D4A0A0]/40 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#FFB6C1]/20 to-[#E6E6FA]/20 group-hover:from-[#FFB6C1]/40 group-hover:to-[#E6E6FA]/40 flex items-center justify-center mb-4 transition-all">
                  <MapPin size={20} className="text-[#D4A0A0]" />
                </div>
                <h3 className="font-['Playfair_Display'] italic text-base text-[#4A4A4A] mb-1">Address</h3>
                <p className="text-[#A08090] text-sm font-light">{store.address}</p>
              </a>
            )}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-white/90 backdrop-blur-sm border-t border-[#FFE4E9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {store.logo ? (
                    <img
                      src={getImageUrl(store.logo) || ''}
                      alt={store.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#FFB6C1] to-[#E6E6FA] flex items-center justify-center">
                      <Cake size={14} className="text-white" />
                    </div>
                  )}
                  <span className="font-['Playfair_Display'] italic text-base text-[#4A4A4A]">{store.name}</span>
                </div>
                <p className="text-[#A08090] text-sm leading-relaxed mb-6 font-light">
                  {store.description || 'French patisserie crafted with love and the finest ingredients.'}
                </p>
                <div className="flex items-center gap-3">
                  <a href="#" className="text-[#D4A0A0] hover:text-[#FFB6C1] transition-colors" aria-label="Instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                  <a href="#" className="text-[#D4A0A0] hover:text-[#FFB6C1] transition-colors" aria-label="Pinterest">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.087-.791-.166-2.006.035-2.868.181-.78 1.172-4.971 1.172-4.971s-.299-.599-.299-1.484c0-1.39.806-2.429 1.81-2.429.854 0 1.266.641 1.266 1.41 0 .859-.546 2.143-.828 3.334-.236.996.5 1.807 1.48 1.807 1.776 0 3.143-1.873 3.143-4.575 0-2.391-1.718-4.063-4.173-4.063-2.842 0-4.512 2.134-4.512 4.34 0 .859.331 1.78.744 2.282a.3.3 0 0 1 .069.287c-.076.316-.245.996-.278 1.135-.044.183-.145.222-.334.134-1.247-.58-2.027-2.405-2.027-3.871 0-3.152 2.29-6.045 6.599-6.045 3.464 0 6.156 2.469 6.156 5.77 0 3.444-2.171 6.217-5.185 6.217-1.012 0-1.965-.526-2.291-1.148l-.623 2.378c-.227.87-.839 1.958-1.249 2.623.94.291 1.94.448 2.973.448 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-['Playfair_Display'] italic text-[#D4A0A0] text-sm mb-5">Links</h4>
                <ul className="space-y-3">
                  {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-[#A08090] hover:text-[#D4A0A0] text-sm transition-colors font-light">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-['Playfair_Display'] italic text-[#D4A0A0] text-sm mb-5">Discover</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#A08090] hover:text-[#D4A0A0] text-sm transition-colors font-light">Our Story</a></li>
                  <li><a href="#" className="text-[#A08090] hover:text-[#D4A0A0] text-sm transition-colors font-light">Custom Cakes</a></li>
                  <li><a href="#" className="text-[#A08090] hover:text-[#D4A0A0] text-sm transition-colors font-light">Wedding Services</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-['Playfair_Display'] italic text-[#D4A0A0] text-sm mb-5">Contact</h4>
                <ul className="space-y-3">
                  {store.phone && (
                    <li className="flex items-center gap-2 text-[#A08090] text-sm font-light">
                      <Phone size={12} /> {store.phone}
                    </li>
                  )}
                  {store.email && (
                    <li className="flex items-center gap-2 text-[#A08090] text-sm font-light">
                      <Mail size={12} /> {store.email}
                    </li>
                  )}
                  {store.address && (
                    <li className="flex items-start gap-2 text-[#A08090] text-sm font-light">
                      <MapPin size={12} className="mt-0.5 shrink-0" />
                      <span>{store.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#FFE4E9] py-5 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[#A08090] text-xs font-light">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
              <p className="text-[#A08090] text-xs font-light italic">
                Fait avec amour — Made with love ❤️
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
