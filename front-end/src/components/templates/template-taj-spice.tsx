'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, Quote, Crown, Sparkles, Gem } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import { SocialLinks } from '@/components/templates/blocks/social-links'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface TajSpiceProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const PURPLE = '#2D1B69'
const AMBER = '#FFBF00'
const EMERALD = '#50C878'
const CREAM = '#FFFDD0'
const DEEP_GOLD = '#B8860B'
const BURGUNDY = '#800020'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

export function TemplateTajSpice({ store, themeColors, onAddToCart, onShopNow }: TajSpiceProps) {
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
    servesCuisine: 'Indian, Mughlai, North Indian, Curry',
    image: getImageUrl(store.cover_image || store.cover),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');
        :root { ${Object.entries(c).map(([k, v]) => `${k}: ${v};`).join('\n')} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-[#FFFDD0] text-[#2D1B69] font-['Inter'] overflow-x-hidden">
        {/* ── Navbar ── */}
        <nav
          className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
            scrolled ? 'bg-[#2D1B69]/95 backdrop-blur-md shadow-lg shadow-purple-900/30' : 'bg-transparent'
          )}
        >
          {/* Ornate border */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#FFBF00] to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                {store.logo ? (
                  <img
                    src={getImageUrl(store.logo) || ''}
                    alt={store.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-[#FFBF00]/50"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FFBF00] to-[#B8860B] flex items-center justify-center">
                    <Crown size={18} className="text-[#2D1B69]" />
                  </div>
                )}
                <span className="font-['Cormorant_Garamond'] text-2xl italic font-semibold text-[#FFFDD0] tracking-wide">
                  {store.name}
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-8">
                {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm tracking-wider text-[#D4C9A8] hover:text-[#FFBF00] transition-colors duration-300 font-medium"
                  >
                    {item}
                  </a>
                ))}
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="bg-[#FFBF00] text-[#2D1B69] px-6 py-2.5 text-sm tracking-wider font-bold uppercase hover:bg-amber-400 transition-all duration-300"
                  >
                    Order Now
                  </button>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-[#FFFDD0] p-2"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-[#FFBF00] to-transparent" />

          <div
            className={cn(
              'lg:hidden overflow-hidden transition-all duration-400',
              menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="bg-[#2D1B69]/98 backdrop-blur-md px-4 py-6 space-y-4">
              {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm tracking-wider text-[#D4C9A8] hover:text-[#FFBF00] transition-colors"
                >
                  {item}
                </a>
              ))}
              {onShopNow && (
                <button
                  onClick={() => { setMenuOpen(false); onShopNow?.() }}
                  className="w-full bg-[#FFBF00] text-[#2D1B69] px-6 py-3 text-sm tracking-wider font-bold uppercase"
                >
                  Order Now
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B69] via-[#3D2B79] to-[#1D0B59]" />
          {/* Ornate pattern overlay */}
          <div className="absolute inset-0 opacity-8" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,191,0,0.1) 1px, transparent 1px), radial-gradient(circle at 80% 50%, rgba(255,191,0,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px, 60px 60px' }} />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFBF00] to-transparent" />

          {(store.cover_image || store.cover) && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url(${getImageUrl(store.cover_image || store.cover)})` }}
            />
          )}

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 border border-[#FFBF00]/30 px-6 py-2 mb-8">
                <Crown size={14} className="text-[#FFBF00]" />
                <span className="text-[#FFBF00] text-xs tracking-[0.25em] uppercase font-medium">Royal Mughlai Cuisine</span>
                <Gem size={14} className="text-[#50C878]" />
              </div>
              <h1 className="font-['Cormorant_Garamond'] italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[#FFFDD0] leading-tight">
                {store.name}
              </h1>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#FFBF00] to-transparent mx-auto my-8" />
              <p className="text-lg sm:text-xl text-[#D4C9A8] max-w-2xl mx-auto leading-relaxed font-light">
                {store.description || 'A royal feast of aromatic spices and centuries-old recipes from the kitchens of the Maharajas.'}
              </p>
              <div className="flex items-center justify-center gap-4 mt-10 flex-wrap">
                <button
                  onClick={onShopNow}
                  className="bg-[#FFBF00] text-[#2D1B69] px-10 py-4 text-sm tracking-[0.2em] uppercase font-bold hover:bg-amber-400 transition-all duration-300 shadow-2xl shadow-amber-900/30"
                >
                  Explore Menu
                </button>
                <a
                  href="#menu"
                  className="border border-[#FFBF00]/40 text-[#FFBF00] px-10 py-4 text-sm tracking-[0.2em] uppercase font-medium hover:bg-[#FFBF00]/10 transition-all duration-300"
                >
                  Royal Feast
                </a>
              </div>
              {store.avg_rating > 0 && (
                <div className="mt-12 inline-flex items-center gap-4 border border-[#FFBF00]/20 px-6 py-3 bg-[#2D1B69]/50">
                  <StarRating rating={store.avg_rating} size={20} activeColor="#FFBF00" inactiveColor="#6B5B95" />
                  <span className="text-[#FFBF00] text-sm font-semibold">{store.avg_rating.toFixed(1)}</span>
                  <span className="text-[#D4C9A8] text-sm">({store.reviews_count} reviews)</span>
                </div>
              )}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFBF00] to-transparent" />
        </section>

        {/* ── Menu Section ── */}
        <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Sparkles size={24} className="mx-auto text-[#FFBF00] mb-3" />
            <span className="text-[#800020] text-sm tracking-[0.25em] uppercase font-medium">Shaahi Khaana</span>
            <h2 className="font-['Cormorant_Garamond'] italic text-4xl sm:text-5xl font-bold text-[#2D1B69] mt-3 mb-4">
              Royal Menu
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#FFBF00] to-transparent mx-auto" />
          </div>

          {store.foods.length === 0 ? (
            <div className="text-center py-20 border-2 border-[#FFBF00]/20 max-w-lg mx-auto bg-white">
              <Crown size={48} className="mx-auto text-[#FFBF00]/30 mb-4" />
              <p className="font-['Cormorant_Garamond'] italic text-2xl font-bold text-[#2D1B69] mb-2">Menu in Preparation</p>
              <p className="text-[#6B5B95]">Our royal chefs are crafting something magnificent.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.foods.map((food) => (
                <div
                  key={food.id}
                  className="group bg-white border border-[#FFBF00]/20 hover:border-[#FFBF00]/50 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl"
                >
                  {/* Ornate top border */}
                  <div className="h-1 bg-gradient-to-r from-[#2D1B69] via-[#FFBF00] to-[#2D1B69]" />
                  <div className="relative overflow-hidden aspect-[4/3]">
                    {food.image ? (
                      <img
                        src={getImageUrl(food.image) ?? undefined}
                        alt={food.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#FFFDD0] to-[#F5E6CC] flex items-center justify-center">
                        <Gem size={36} className="text-[#FFBF00]/30" />
                      </div>
                    )}
                    {food.is_offer && (
                      <span className="absolute top-3 left-3 bg-[#800020] text-[#FFFDD0] text-[9px] tracking-[0.2em] uppercase px-3 py-1 font-semibold">
                        Royal Special
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-['Cormorant_Garamond'] italic text-xl font-bold text-[#2D1B69] group-hover:text-[#800020] transition-colors">
                        {food.name}
                      </h3>
                    </div>
                    {food.description && (
                      <p className="text-[#6B5B95] text-sm mt-2 line-clamp-2 leading-relaxed">
                        {food.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#FFBF00]/15">
                      <span className="font-['Cormorant_Garamond'] text-xl font-bold text-[#800020]">
                        {formatFoodPrice(food, currency)}
                      </span>
                      {onAddToCart && (
                        <button
                          data-add-to-cart={food.id}
                          onClick={() => onAddToCart(food.id)}
                          className="border border-[#FFBF00]/40 text-[#2D1B69] px-4 py-2 text-xs tracking-[0.15em] uppercase font-semibold hover:bg-[#FFBF00] hover:text-[#2D1B69] transition-all duration-300"
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
        </section>

        {/* ── Reviews Section ── */}
        <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F5E6CC]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#800020] text-sm tracking-[0.25em] uppercase font-medium">Prashansa</span>
              <h2 className="font-['Cormorant_Garamond'] italic text-4xl sm:text-5xl font-bold text-[#2D1B69] mt-3 mb-4">
                Guest Praises
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#FFBF00] to-transparent mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {store.reviews.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white p-6 border border-[#FFBF00]/20">
                      <StarRating rating={5} size={16} activeColor="#FFBF00" inactiveColor="#6B5B95" />
                      <Quote size={20} className="text-[#FFBF00]/30 mt-4 mb-3" />
                      <p className="text-[#6B5B95] italic text-sm leading-relaxed mb-4">
                        A truly royal dining experience. The flavors transport you to another world.
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#FFBF00]/15">
                        <div className="w-10 h-10 rounded-full bg-[#2D1B69] ring-1 ring-[#FFBF00]/30 flex items-center justify-center">
                          <span className="text-[#FFBF00] text-sm font-semibold">G</span>
                        </div>
                        <div>
                          <p className="text-[#2D1B69] text-sm font-medium">Guest</p>
                          <p className="text-[#6B5B95] text-xs">Verified Diner</p>
                        </div>
                      </div>
                    </div>
                  ))
                : store.reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 border border-[#FFBF00]/20 hover:border-[#FFBF00]/40 transition-all duration-300">
                      <StarRating rating={review.rating} size={16} activeColor="#FFBF00" inactiveColor="#6B5B95" />
                      <Quote size={20} className="text-[#FFBF00]/30 mt-4 mb-3" />
                      <p className="text-[#6B5B95] italic text-sm leading-relaxed mb-4 line-clamp-3">
                        {review.comment || 'An unforgettable experience.'}
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#FFBF00]/15">
                        <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-[#FFBF00]/30">
                          {review.avatar ? (
                            <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#2D1B69] flex items-center justify-center">
                              <span className="text-[#FFBF00] text-sm font-semibold">{review.user.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[#2D1B69] text-sm font-medium">{review.user}</p>
                          <p className="text-[#6B5B95] text-xs">Verified Diner</p>
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
              <span className="text-[#50C878] text-sm tracking-[0.25em] uppercase font-medium">Humari Team</span>
              <h2 className="font-['Cormorant_Garamond'] italic text-4xl sm:text-5xl font-bold text-[#2D1B69] mt-3 mb-4">
                The Royal Court
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#50C878] to-transparent mx-auto" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {store.staff.map((member, idx) => (
                <div key={idx} className="text-center group">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#2D1B69] to-[#FFBF00] p-0.5">
                    <div className="w-full h-full rounded-full bg-[#FFFDD0] flex items-center justify-center">
                      <span className="font-['Cormorant_Garamond'] italic text-3xl font-bold text-[#2D1B69]">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-['Cormorant_Garamond'] italic text-lg font-bold text-[#2D1B69] mt-4 group-hover:text-[#FFBF00] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-[#6B5B95] text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Opening Hours ── */}
        {store.opening_hours && (
          <section id="hours" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#2D1B69]">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-12">
                <span className="text-[#FFBF00] text-sm tracking-[0.25em] uppercase font-medium">Samay</span>
                <h2 className="font-['Cormorant_Garamond'] italic text-4xl text-[#FFFDD0] mt-3 mb-4 font-bold">
                  Opening Hours
                </h2>
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#FFBF00] to-transparent mx-auto" />
              </div>

              <div className="border border-[#FFBF00]/20 bg-[#3D2B79]/50 divide-y divide-[#FFBF00]/10">
                <div className="px-6 py-3 bg-[#FFBF00]/10">
                  <p className="text-[#FFBF00] font-['Cormorant_Garamond'] italic text-sm font-semibold">Weekly Schedule</p>
                </div>
                {DAY_ORDER.map((day) => {
                  const hours = store.opening_hours![day]
                  return (
                    <div key={day} className="flex items-center justify-between px-6 py-4 hover:bg-[#FFBF00]/5 transition-colors">
                      <span className="text-[#D4C9A8] text-sm font-medium capitalize">{DAY_LABELS[day]}</span>
                      {hours ? (
                        <span className="text-[#FFBF00] text-sm font-semibold">
                          {hours.open} – {hours.close}
                        </span>
                      ) : (
                        <span className="text-[#6B5B95] text-sm italic">Closed</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Contact Section ── */}
        <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#800020] text-sm tracking-[0.25em] uppercase font-medium">Sampark</span>
            <h2 className="font-['Cormorant_Garamond'] italic text-4xl sm:text-5xl font-bold text-[#2D1B69] mt-3 mb-4">
              Get in Touch
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#FFBF00] to-transparent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {store.phone && (
              <a
                href={`tel:${store.phone}`}
                className="group bg-white border border-[#FFBF00]/20 hover:border-[#FFBF00]/50 p-8 text-center transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#2D1B69]/10 group-hover:bg-[#FFBF00]/20 flex items-center justify-center mb-5 transition-colors">
                  <Phone size={22} className="text-[#2D1B69] group-hover:text-[#FFBF00]" />
                </div>
                <h3 className="font-['Cormorant_Garamond'] italic text-lg font-bold text-[#2D1B69] mb-2">Phone</h3>
                <p className="text-[#6B5B95] text-sm">{store.phone}</p>
              </a>
            )}
            {store.email && (
              <a
                href={`mailto:${store.email}`}
                className="group bg-white border border-[#FFBF00]/20 hover:border-[#FFBF00]/50 p-8 text-center transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#2D1B69]/10 group-hover:bg-[#FFBF00]/20 flex items-center justify-center mb-5 transition-colors">
                  <Mail size={22} className="text-[#2D1B69] group-hover:text-[#FFBF00]" />
                </div>
                <h3 className="font-['Cormorant_Garamond'] italic text-lg font-bold text-[#2D1B69] mb-2">Email</h3>
                <p className="text-[#6B5B95] text-sm">{store.email}</p>
              </a>
            )}
            {store.address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-[#FFBF00]/20 hover:border-[#FFBF00]/50 p-8 text-center transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#2D1B69]/10 group-hover:bg-[#FFBF00]/20 flex items-center justify-center mb-5 transition-colors">
                  <MapPin size={22} className="text-[#2D1B69] group-hover:text-[#FFBF00]" />
                </div>
                <h3 className="font-['Cormorant_Garamond'] italic text-lg font-bold text-[#2D1B69] mb-2">Address</h3>
                <p className="text-[#6B5B95] text-sm">{store.address}</p>
              </a>
            )}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-[#1D0B59] border-t-2 border-[#FFBF00]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {store.logo ? (
                    <img
                      src={getImageUrl(store.logo) || ''}
                      alt={store.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-[#FFBF00]/30"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FFBF00] to-[#B8860B] flex items-center justify-center">
                      <Crown size={18} className="text-[#1D0B59]" />
                    </div>
                  )}
                  <span className="font-['Cormorant_Garamond'] italic text-xl font-semibold text-[#FFFDD0]">{store.name}</span>
                </div>
                <p className="text-[#6B5B95] text-sm leading-relaxed mb-6">
                  {store.description || 'Royal Indian cuisine crafted with tradition and passion.'}
                </p>
                <SocialLinks links={store.social_links ?? []} />
              </div>

              <div>
                <h4 className="font-['Cormorant_Garamond'] italic text-[#FFBF00] text-lg font-semibold mb-5">Quick Links</h4>
                <ul className="space-y-3">
                  {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-[#6B5B95] hover:text-[#FFBF00] text-sm transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-['Cormorant_Garamond'] italic text-[#FFBF00] text-lg font-semibold mb-5">Discover</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#6B5B95] hover:text-[#FFBF00] text-sm transition-colors">Our Story</a></li>
                  <li><a href="#" className="text-[#6B5B95] hover:text-[#FFBF00] text-sm transition-colors">Catering</a></li>
                  <li><a href="#" className="text-[#6B5B95] hover:text-[#FFBF00] text-sm transition-colors">Private Events</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-['Cormorant_Garamond'] italic text-[#FFBF00] text-lg font-semibold mb-5">Contact</h4>
                <ul className="space-y-3">
                  {store.phone && (
                    <li>
                      <a href={`tel:${store.phone}`} className="text-[#6B5B95] hover:text-[#FFBF00] text-sm transition-colors flex items-center gap-2">
                        <Phone size={14} /> {store.phone}
                      </a>
                    </li>
                  )}
                  {store.email && (
                    <li>
                      <a href={`mailto:${store.email}`} className="text-[#6B5B95] hover:text-[#FFBF00] text-sm transition-colors flex items-center gap-2">
                        <Mail size={14} /> {store.email}
                      </a>
                    </li>
                  )}
                  {store.address && (
                    <li className="flex items-start gap-2 text-[#6B5B95] text-sm">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span>{store.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#FFBF00]/10 bg-[#150945]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[#6B5B95]/60 text-xs">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
              <p className="text-[#6B5B95]/60 text-xs italic">
                Shaan-e-Dastarkhwan — Pride of the Feast
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
