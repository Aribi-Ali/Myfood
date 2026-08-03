'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, ChevronRight, Quote, Heart, Award } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import { SocialLinks } from '@/components/templates/blocks/social-links'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface BistroProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const TERRACOTTA = '#bc6c25'
const CREAM = '#fefae0'
const DARK_TEXT = '#283618'
const GOLD = '#dda15e'
const BORDER = '#d4c9b8'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

export default function BistroTemplate({ store, themeColors, onAddToCart, onShopNow }: BistroProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const { currency } = useCurrency()

  const c = { ...themeColors } as Record<string, string>
  const bg = c['--bg'] || CREAM
  const accent = c['--accent'] || TERRACOTTA
  const textColor = c['--text'] || DARK_TEXT
  const borderColor = c['--border'] || BORDER

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
    servesCuisine: 'French, European',
    image: getImageUrl(store.cover_image || store.cover),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500&display=swap');
        :root { ${Object.entries(c).map(([k, v]) => `${k}: ${v};`).join('\n')} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-[#fefae0] text-[#283618] font-['Inter'] overflow-x-hidden">
        {/* ── Navbar ── */}
        <nav
          className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
            scrolled ? 'bg-[#fefae0]/95 backdrop-blur-md shadow-sm shadow-[#d4c9b8]/30' : 'bg-transparent'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                {store.logo && (
                  <img
                    src={getImageUrl(store.logo) || ''}
                    alt={store.name}
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-[#bc6c25]/30"
                  />
                )}
                <span className="font-['Playfair_Display'] text-xl italic text-[#283618]">
                  {store.name}
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-8">
                {['Menu', 'About', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm tracking-wide text-[#bc6c25] hover:text-[#283618] transition-colors duration-300 font-light"
                  >
                    {item}
                  </a>
                ))}
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="bg-[#bc6c25] text-[#fefae0] px-6 py-2.5 text-sm font-medium hover:bg-[#a85d1f] transition-colors duration-300"
                  >
                    Order Now
                  </button>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-[#283618] p-2"
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
            <div className="bg-[#fefae0]/98 backdrop-blur-md border-t border-[#d4c9b8] px-4 py-6 space-y-4">
              {['Menu', 'About', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm tracking-wide text-[#bc6c25] hover:text-[#283618] transition-colors"
                >
                  {item}
                </a>
              ))}
              {onShopNow && (
                <button
                  onClick={() => { setMenuOpen(false); onShopNow?.() }}
                  className="w-full bg-[#bc6c25] text-[#fefae0] px-6 py-3 text-sm font-medium"
                >
                  Order Now
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {(store.cover_image || store.cover) && (
            <div
              className="absolute inset-0 bg-cover bg-center scale-105"
              style={{ backgroundImage: `url(${getImageUrl(store.cover_image || store.cover)})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#fefae0]/30 via-[#bc6c25]/40 to-[#283618]/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#bc6c25]/20 to-transparent" />

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <Award size={40} className="text-[#dda15e] mx-auto mb-2" />
              <div className="w-16 h-0.5 bg-[#bc6c25] mx-auto" />
            </div>
            <h1 className="font-['Playfair_Display'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-[#fefae0] leading-tight italic">
              {store.name}
            </h1>
            <div className="w-24 h-px bg-[#dda15e] mx-auto my-6" />
            <p className="font-['Cormorant_Garamond'] italic text-lg sm:text-xl md:text-2xl text-[#fefae0]/80 max-w-2xl mx-auto leading-relaxed">
              {store.description || 'A timeless Parisian bistro experience'}
            </p>
            <div className="flex items-center justify-center gap-4 mt-10 flex-wrap">
              <button
                onClick={onShopNow}
                className="bg-[#bc6c25] text-[#fefae0] px-8 py-3.5 text-sm tracking-wide font-medium hover:bg-[#a85d1f] transition-all duration-300 border border-[#bc6c25]"
              >
                Explore Our Menu
              </button>
              <a
                href="#about"
                className="border border-[#fefae0]/60 text-[#fefae0] px-8 py-3.5 text-sm tracking-wide hover:bg-[#fefae0]/10 transition-all duration-300"
              >
                Discover More
              </a>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronRight size={24} className="text-[#dda15e]/60 -rotate-90" />
          </div>
        </section>

        {/* ── About Section ── */}
        <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              {(store.cover_image || store.cover) ? (
                <div className="relative overflow-hidden">
                  <img
                    src={getImageUrl(store.cover_image || store.cover) || ''}
                    alt={store.name}
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 border border-[#bc6c25]/20 pointer-events-none" />
                </div>
              ) : (
                <div className="w-full h-[400px] bg-[#d4c9b8]/30 flex items-center justify-center">
                  <Heart size={48} className="text-[#bc6c25]/40" />
                </div>
              )}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-[#bc6c25]/30 -z-10" />
            </div>
            <div>
              <span className="text-[#bc6c25] text-sm tracking-widest uppercase font-light">Our Story</span>
              <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl text-[#283618] mt-3 mb-6 italic">
                A Parisian Tradition
              </h2>
              <div className="w-16 h-0.5 bg-[#bc6c25] mb-6" />
              <p className="text-[#283618]/70 leading-relaxed text-base mb-4">
                {store.description || 'Nestled in the heart of the city, our bistro brings the warmth and charm of Parisian dining to your table. Every dish tells a story of tradition, passion, and the finest ingredients.'}
              </p>
              <p className="text-[#283618]/70 leading-relaxed text-base mb-6">
                From our carefully sourced produce to our artisanal bread baked fresh daily, we honor the culinary heritage of France while embracing modern sensibility.
              </p>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <span className="font-['Playfair_Display'] text-3xl text-[#bc6c25]">{store.foods.length || 0}</span>
                  <p className="text-[#283618]/60 text-sm mt-1">Dishes</p>
                </div>
                <div className="w-px h-10 bg-[#d4c9b8]" />
                <div className="text-center">
                  <span className="font-['Playfair_Display'] text-3xl text-[#bc6c25]">{store.reviews_count || 0}</span>
                  <p className="text-[#283618]/60 text-sm mt-1">Reviews</p>
                </div>
                <div className="w-px h-10 bg-[#d4c9b8]" />
                <div className="text-center">
                  <span className="font-['Playfair_Display'] text-3xl text-[#bc6c25]">{store.staff.length || 0}</span>
                  <p className="text-[#283618]/60 text-sm mt-1">Staff</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Foods Section (Carte) ── */}
        <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#d4c9b8]/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#bc6c25] text-sm tracking-widest uppercase font-light">La Carte</span>
              <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl text-[#283618] mt-3 mb-4 italic">
                Our Selection
              </h2>
              <div className="w-16 h-0.5 bg-[#bc6c25] mx-auto" />
            </div>

            {store.foods.length === 0 ? (
              <div className="text-center py-20 border border-[#d4c9b8] max-w-lg mx-auto bg-[#fefae0]">
                <Clock size={48} className="mx-auto text-[#bc6c25]/40 mb-4" />
                <p className="font-['Playfair_Display'] text-2xl text-[#283618] mb-2 italic">Carte à venir</p>
                <p className="text-[#283618]/60 italic">Our menu is being prepared with care. Please check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.foods.map((food) => (
                  <div
                    key={food.id}
                    className="group bg-[#fefae0] border border-[#d4c9b8] hover:border-[#bc6c25]/40 transition-all duration-500"
                  >
                    <div className="relative overflow-hidden aspect-[4/3]">
                      {food.image ? (
                        <img
                          src={getImageUrl(food.image) ?? undefined}
                          alt={food.name}
                          className="w-full h-full object-cover transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#d4c9b8]/20 flex items-center justify-center">
                          <Clock size={32} className="text-[#bc6c25]/30" />
                        </div>
                      )}
                      {food.is_offer && (
                        <span className="absolute top-3 left-3 bg-[#bc6c25] text-[#fefae0] text-[10px] tracking-widest uppercase px-3 py-1">
                          Offre
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-['Playfair_Display'] text-lg text-[#283618] group-hover:text-[#bc6c25] transition-colors italic">
                        {food.name}
                      </h3>
                      {food.description && (
                        <p className="text-[#283618]/60 text-sm mt-1.5 line-clamp-2 leading-relaxed">
                          {food.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#d4c9b8]">
                        <span className="font-['Playfair_Display'] text-lg text-[#bc6c25] italic">
                          {formatFoodPrice(food, currency)}
                        </span>
                        {onAddToCart && (
                          <button
                            data-add-to-cart={food.id}
                            onClick={() => onAddToCart(food.id)}
                            className="border border-[#bc6c25]/40 text-[#bc6c25] px-4 py-2 text-xs tracking-widest uppercase hover:bg-[#bc6c25] hover:text-[#fefae0] transition-all duration-300"
                          >
                            <ShoppingCart size={14} className="inline-block mr-1" />
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Reviews Section ── */}
        <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#bc6c25] text-sm tracking-widest uppercase font-light">Témoignages</span>
            <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl text-[#283618] mt-3 mb-4 italic">
              What Our Guests Say
            </h2>
            <div className="w-16 h-0.5 bg-[#bc6c25] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {store.reviews.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-[#fefae0] p-6 border border-[#d4c9b8] hover:border-[#bc6c25]/20 transition-all duration-300">
                    <StarRating rating={5} size={16} activeColor="#bc6c25" inactiveColor="#d4c9b8" />
                    <Quote size={20} className="text-[#bc6c25]/20 mt-4 mb-3" />
                    <p className="text-[#283618]/70 italic text-sm leading-relaxed mb-4">
                      An enchanting evening with exquisite flavors and impeccable service. A true Parisian gem.
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-[#d4c9b8]">
                      <div className="w-10 h-10 rounded-full bg-[#bc6c25]/10 flex items-center justify-center">
                        <span className="text-[#bc6c25] text-sm font-semibold">G</span>
                      </div>
                      <div>
                        <p className="text-[#283618] text-sm font-medium">Guest</p>
                        <p className="text-[#283618]/50 text-xs">Verified Diner</p>
                      </div>
                    </div>
                  </div>
                ))
              : store.reviews.map((review) => (
                  <div key={review.id} className="bg-[#fefae0] p-6 border border-[#d4c9b8] hover:border-[#bc6c25]/30 transition-all duration-300">
                    <StarRating rating={review.rating} size={16} activeColor="#bc6c25" inactiveColor="#d4c9b8" />
                    <Quote size={20} className="text-[#bc6c25]/20 mt-4 mb-3" />
                    <p className="text-[#283618]/70 italic text-sm leading-relaxed mb-4 line-clamp-4">
                      {review.comment || 'A delightful experience.'}
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-[#d4c9b8]">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        {review.avatar ? (
                          <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#bc6c25]/10 flex items-center justify-center">
                            <span className="text-[#bc6c25] text-sm font-semibold">{review.user.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-[#283618] text-sm font-medium">{review.user}</p>
                        <p className="text-[#283618]/50 text-xs">Verified Diner</p>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </section>

        {/* ── Staff Section ── */}
        {store.staff.length > 0 && (
          <section id="team" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#d4c9b8]/20">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-[#bc6c25] text-sm tracking-widest uppercase font-light">L&apos;Équipe</span>
                <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl text-[#283618] mt-3 mb-4 italic">
                  Meet Our Team
                </h2>
                <div className="w-16 h-0.5 bg-[#bc6c25] mx-auto" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                {store.staff.map((member, idx) => (
                  <div key={idx} className="text-center group">
                    <div className="w-28 h-28 mx-auto mb-4 overflow-hidden">
                      <div className="w-full h-full bg-[#fefae0] border border-[#d4c9b8] group-hover:border-[#bc6c25]/50 transition-all duration-300 flex items-center justify-center">
                        <span className="font-['Playfair_Display'] text-4xl text-[#bc6c25] italic">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-[#283618] font-medium group-hover:text-[#bc6c25] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-[#283618]/60 text-sm italic">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Opening Hours ── */}
        {store.opening_hours && (
          <section id="hours" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-12">
                <span className="text-[#bc6c25] text-sm tracking-widest uppercase font-light">Horaires</span>
                <h2 className="font-['Playfair_Display'] text-4xl text-[#283618] mt-3 mb-4 italic">
                  Opening Hours
                </h2>
                <div className="w-16 h-0.5 bg-[#bc6c25] mx-auto" />
              </div>

              <div className="border border-[#d4c9b8] bg-[#fefae0] divide-y divide-[#d4c9b8]">
                {DAY_ORDER.map((day) => {
                  const hours = store.opening_hours![day]
                  return (
                    <div key={day} className="flex items-center justify-between px-6 py-4 hover:bg-[#d4c9b8]/20 transition-colors">
                      <span className="text-[#283618] text-sm tracking-wide">{DAY_LABELS[day]}</span>
                      {hours ? (
                        <span className="text-[#bc6c25] text-sm font-medium">
                          {hours.open} – {hours.close}
                        </span>
                      ) : (
                        <span className="text-[#283618]/50 text-sm italic">Fermé</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Contact Section ── */}
        <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#d4c9b8]/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#bc6c25] text-sm tracking-widest uppercase font-light">Contact</span>
              <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl text-[#283618] mt-3 mb-4 italic">
                Get in Touch
              </h2>
              <div className="w-16 h-0.5 bg-[#bc6c25] mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {store.phone && (
                <a
                  href={`tel:${store.phone}`}
                  className="group bg-[#fefae0] border border-[#d4c9b8] hover:border-[#bc6c25]/40 p-8 text-center transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto border border-[#d4c9b8] group-hover:border-[#bc6c25]/50 flex items-center justify-center mb-5 transition-colors">
                    <Phone size={22} className="text-[#bc6c25]" />
                  </div>
                  <h3 className="font-['Playfair_Display'] text-lg text-[#283618] mb-2 italic">Phone</h3>
                  <p className="text-[#283618]/60 text-sm">{store.phone}</p>
                </a>
              )}
              {store.email && (
                <a
                  href={`mailto:${store.email}`}
                  className="group bg-[#fefae0] border border-[#d4c9b8] hover:border-[#bc6c25]/40 p-8 text-center transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto border border-[#d4c9b8] group-hover:border-[#bc6c25]/50 flex items-center justify-center mb-5 transition-colors">
                    <Mail size={22} className="text-[#bc6c25]" />
                  </div>
                  <h3 className="font-['Playfair_Display'] text-lg text-[#283618] mb-2 italic">Email</h3>
                  <p className="text-[#283618]/60 text-sm">{store.email}</p>
                </a>
              )}
              {store.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#fefae0] border border-[#d4c9b8] hover:border-[#bc6c25]/40 p-8 text-center transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto border border-[#d4c9b8] group-hover:border-[#bc6c25]/50 flex items-center justify-center mb-5 transition-colors">
                    <MapPin size={22} className="text-[#bc6c25]" />
                  </div>
                  <h3 className="font-['Playfair_Display'] text-lg text-[#283618] mb-2 italic">Address</h3>
                  <p className="text-[#283618]/60 text-sm">{store.address}</p>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-[#fefae0] border-t border-[#d4c9b8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {store.logo && (
                    <img
                      src={getImageUrl(store.logo) || ''}
                      alt={store.name}
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-[#bc6c25]/30"
                    />
                  )}
                  <span className="font-['Playfair_Display'] text-lg text-[#283618] italic">{store.name}</span>
                </div>
                <p className="text-[#283618]/60 text-sm leading-relaxed mb-6">
                  {store.description || 'A timeless Parisian bistro bringing warmth and elegance to every meal.'}
                </p>
                <SocialLinks links={store.social_links ?? []} />
              </div>

              <div>
                <h4 className="font-['Playfair_Display'] text-[#283618] text-lg mb-5 italic">Quick Links</h4>
                <ul className="space-y-3">
                  {['Menu', 'About', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-[#bc6c25] hover:text-[#283618] text-sm transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-['Playfair_Display'] text-[#283618] text-lg mb-5 italic">Support</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#bc6c25] hover:text-[#283618] text-sm transition-colors">FAQ</a></li>
                  <li><a href="#" className="text-[#bc6c25] hover:text-[#283618] text-sm transition-colors">Delivery Info</a></li>
                  <li><a href="#" className="text-[#bc6c25] hover:text-[#283618] text-sm transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-[#bc6c25] hover:text-[#283618] text-sm transition-colors">Terms of Service</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-['Playfair_Display'] text-[#283618] text-lg mb-5 italic">Contact</h4>
                <ul className="space-y-3">
                  {store.phone && (
                    <li>
                      <a href={`tel:${store.phone}`} className="text-[#bc6c25] hover:text-[#283618] text-sm transition-colors flex items-center gap-2">
                        <Phone size={14} /> {store.phone}
                      </a>
                    </li>
                  )}
                  {store.email && (
                    <li>
                      <a href={`mailto:${store.email}`} className="text-[#bc6c25] hover:text-[#283618] text-sm transition-colors flex items-center gap-2">
                        <Mail size={14} /> {store.email}
                      </a>
                    </li>
                  )}
                  {store.address && (
                    <li className="flex items-start gap-2 text-[#bc6c25] text-sm">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span>{store.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#d4c9b8] bg-[#d4c9b8]/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[#283618]/60 text-xs tracking-wide">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
              <p className="text-[#283618]/60 text-xs italic">
                Avec amour, depuis Paris
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
