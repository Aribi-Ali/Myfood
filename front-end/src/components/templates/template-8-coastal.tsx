'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, ChevronRight, Quote, Fish, Waves, Sun } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import { SocialLinks } from '@/components/templates/blocks/social-links'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface CoastalProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const SKY_BLUE = '#0ea5e9'
const LIGHT = '#f0f9ff'
const DARK = '#0c4a6e'
const CYAN = '#06b6d4'
const ORANGE = '#f97316'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

export default function CoastalTemplate({ store, themeColors, onAddToCart, onShopNow }: CoastalProps) {
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
    servesCuisine: 'Seafood, Coastal',
    image: getImageUrl(store.cover_image || store.cover),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        :root { ${Object.entries(c).map(([k, v]) => `${k}: ${v};`).join('\n')} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-white text-[#0c4a6e] font-['Inter'] overflow-x-hidden">
        {/* ── Navbar ── */}
        <nav
          className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
            scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm shadow-[#0ea5e9]/10' : 'bg-transparent'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                <Waves size={24} className="text-[#0ea5e9]" />
                {store.logo && (
                  <img
                    src={getImageUrl(store.logo) || ''}
                    alt={store.name}
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-[#0ea5e9]/30"
                  />
                )}
                <span className="font-['Plus_Jakarta_Sans'] text-xl font-semibold text-[#0c4a6e]">
                  {store.name}
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-8">
                {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-[#0c4a6e]/70 hover:text-[#0ea5e9] transition-colors duration-300 font-medium"
                  >
                    {item}
                  </a>
                ))}
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="bg-[#0ea5e9] text-white px-6 py-2.5 text-sm font-semibold rounded-full hover:bg-[#0284c7] transition-all duration-300"
                  >
                    Order Now
                  </button>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-[#0c4a6e] p-2"
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
            <div className="bg-white/98 backdrop-blur-md border-t border-[#e0f2fe] px-4 py-6 space-y-4">
              {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm text-[#0c4a6e]/70 hover:text-[#0ea5e9] transition-colors"
                >
                  {item}
                </a>
              ))}
              {onShopNow && (
                <button
                  onClick={() => { setMenuOpen(false); onShopNow?.() }}
                  className="w-full bg-[#0ea5e9] text-white px-6 py-3 text-sm font-semibold rounded-full"
                >
                  Order Now
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
              <div className="py-24">
                <div className="flex items-center gap-2 mb-4">
                  <Fish size={20} className="text-[#0ea5e9]" />
                  <span className="text-[#0ea5e9] text-sm font-semibold tracking-wider uppercase">Fresh from the Ocean</span>
                </div>
                <h1 className="font-['Playfair_Display'] text-5xl sm:text-6xl md:text-7xl text-[#0c4a6e] leading-tight">
                  {store.name}
                </h1>
                <p className="text-lg sm:text-xl text-[#0c4a6e]/60 mt-6 max-w-lg leading-relaxed">
                  {store.description || 'Where the ocean meets your plate — fresh catches daily, coastal flavors, and seaside serenity.'}
                </p>
                <div className="flex items-center gap-4 mt-10 flex-wrap">
                  <button
                    onClick={onShopNow}
                    className="bg-[#0ea5e9] text-white px-8 py-3.5 text-sm font-semibold rounded-full hover:bg-[#0284c7] transition-all duration-300 shadow-lg shadow-[#0ea5e9]/20"
                  >
                    View Our Menu
                  </button>
                  <a
                    href="#menu"
                    className="border-2 border-[#0ea5e9] text-[#0ea5e9] px-8 py-3.5 text-sm font-semibold rounded-full hover:bg-[#0ea5e9]/5 transition-all duration-300"
                  >
                    Catch of the Day
                  </a>
                </div>
                <div className="flex items-center gap-6 mt-12">
                  <div className="flex items-center gap-2">
                    <Sun size={18} className="text-[#f97316]" />
                    <span className="text-sm text-[#0c4a6e]/60">Ocean View</span>
                  </div>
                  <div className="w-px h-6 bg-[#bae6fd]" />
                  <div className="flex items-center gap-2">
                    <Fish size={18} className="text-[#0ea5e9]" />
                    <span className="text-sm text-[#0c4a6e]/60">Fresh Catch</span>
                  </div>
                  <div className="w-px h-6 bg-[#bae6fd]" />
                  <div className="flex items-center gap-2">
                    <Waves size={18} className="text-[#06b6d4]" />
                    <span className="text-sm text-[#0c4a6e]/60">Coastal Vibes</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block relative h-[600px]">
                {(store.cover_image || store.cover) ? (
                  <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl shadow-[#0ea5e9]/10">
                    <img
                      src={getImageUrl(store.cover_image || store.cover) || ''}
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0ea5e9]/10 to-transparent" />
                  </div>
                ) : (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#f0f9ff] to-[#bae6fd] flex items-center justify-center">
                    <Waves size={80} className="text-[#0ea5e9]/30" />
                  </div>
                )}
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#f97316]/10 rounded-full blur-3xl" />
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#0ea5e9]/10 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Foods Section (Catch of the Day) ── */}
        <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f0f9ff]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Fish size={24} className="mx-auto text-[#0ea5e9] mb-3" />
              <span className="text-[#0ea5e9] text-sm font-semibold tracking-wider uppercase">Catch of the Day</span>
              <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl text-[#0c4a6e] mt-3 mb-4">
                Coastal Menu
              </h2>
              <p className="text-[#0c4a6e]/60 max-w-xl mx-auto">Freshly caught and beautifully prepared</p>
            </div>

            {store.foods.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#bae6fd] max-w-lg mx-auto shadow-sm">
                <Fish size={48} className="mx-auto text-[#0ea5e9]/30 mb-4" />
                <p className="font-['Playfair_Display'] text-2xl text-[#0c4a6e] mb-2">Coming Soon</p>
                <p className="text-[#0c4a6e]/60">Our coastal menu is being prepared fresh. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.foods.map((food) => (
                  <div
                    key={food.id}
                    className="group bg-white rounded-2xl border border-[#bae6fd] hover:border-[#0ea5e9]/40 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-[#0ea5e9]/5"
                  >
                    <div className="relative overflow-hidden aspect-[4/3]">
                      {food.image ? (
                        <img
                          src={getImageUrl(food.image) ?? undefined}
                          alt={food.name}
                          className="w-full h-full object-cover transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#f0f9ff] flex items-center justify-center">
                          <Fish size={32} className="text-[#bae6fd]" />
                        </div>
                      )}
                      {food.is_offer && (
                        <span className="absolute top-3 left-3 bg-[#f97316] text-white text-[10px] tracking-widest uppercase px-3 py-1 rounded-full font-semibold">
                          Fresh Catch
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-semibold text-[#0c4a6e] group-hover:text-[#0ea5e9] transition-colors">
                        {food.name}
                      </h3>
                      {food.description && (
                        <p className="text-[#0c4a6e]/60 text-sm mt-1.5 line-clamp-2 leading-relaxed">
                          {food.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#bae6fd]">
                        <span className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0ea5e9]">
                          {formatFoodPrice(food, currency)}
                        </span>
                        {onAddToCart && (
                          <button
                            data-add-to-cart={food.id}
                            onClick={() => onAddToCart(food.id)}
                            className="bg-[#0ea5e9]/10 text-[#0ea5e9] px-4 py-2 text-xs font-semibold rounded-full hover:bg-[#0ea5e9] hover:text-white transition-all duration-300"
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
            <span className="text-[#0ea5e9] text-sm font-semibold tracking-wider uppercase">Testimonials</span>
            <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl text-[#0c4a6e] mt-3 mb-4">
              Guest Stories
            </h2>
            <p className="text-[#0c4a6e]/60 max-w-xl mx-auto">Hear from our coastal family</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {store.reviews.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-[#f0f9ff] p-6 rounded-2xl border border-[#bae6fd]">
                    <StarRating rating={5} size={16} activeColor="#f97316" inactiveColor="#bae6fd" />
                    <Quote size={20} className="text-[#0ea5e9]/20 mt-4 mb-3" />
                    <p className="text-[#0c4a6e]/70 text-sm leading-relaxed mb-4 italic">
                      The freshest seafood I have ever tasted. The ocean view and coastal ambiance make every meal unforgettable.
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-[#bae6fd]">
                      <div className="w-10 h-10 rounded-full bg-[#0ea5e9]/10 flex items-center justify-center">
                        <span className="text-[#0ea5e9] text-sm font-semibold">G</span>
                      </div>
                      <div>
                        <p className="text-[#0c4a6e] text-sm font-medium">Guest</p>
                        <p className="text-[#0c4a6e]/50 text-xs">Verified Diner</p>
                      </div>
                    </div>
                  </div>
                ))
              : store.reviews.map((review) => (
                  <div key={review.id} className="bg-[#f0f9ff] p-6 rounded-2xl border border-[#bae6fd] hover:border-[#0ea5e9]/30 transition-all duration-300">
                    <StarRating rating={review.rating} size={16} activeColor="#f97316" inactiveColor="#bae6fd" />
                    <Quote size={20} className="text-[#0ea5e9]/20 mt-4 mb-3" />
                    <p className="text-[#0c4a6e]/70 text-sm leading-relaxed mb-4 line-clamp-4 italic">
                      {review.comment || 'An amazing coastal dining experience.'}
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-[#bae6fd]">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        {review.avatar ? (
                          <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#0ea5e9]/10 flex items-center justify-center">
                            <span className="text-[#0ea5e9] text-sm font-semibold">{review.user.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-[#0c4a6e] text-sm font-medium">{review.user}</p>
                        <p className="text-[#0c4a6e]/50 text-xs">Verified Diner</p>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </section>

        {/* ── Staff Section ── */}
        {store.staff.length > 0 && (
          <section id="team" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f0f9ff]">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-[#0ea5e9] text-sm font-semibold tracking-wider uppercase">Our Crew</span>
                <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl text-[#0c4a6e] mt-3 mb-4">
                  Meet the Team
                </h2>
                <p className="text-[#0c4a6e]/60 max-w-xl mx-auto">The people behind the plates</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                {store.staff.map((member, idx) => (
                  <div key={idx} className="text-center group">
                    <div className="w-24 h-24 mx-auto rounded-full bg-white border-2 border-[#0ea5e9]/30 group-hover:border-[#0ea5e9] transition-all duration-300 flex items-center justify-center shadow-sm">
                      <span className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#0ea5e9]">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-[#0c4a6e] font-semibold mt-4 group-hover:text-[#0ea5e9] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-[#0c4a6e]/60 text-sm">{member.role}</p>
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
                <Clock size={24} className="mx-auto text-[#0ea5e9] mb-3" />
                <span className="text-[#0ea5e9] text-sm font-semibold tracking-wider uppercase">Tide Times</span>
                <h2 className="font-['Playfair_Display'] text-4xl text-[#0c4a6e] mt-3 mb-4">
                  Opening Hours
                </h2>
              </div>

              <div className="bg-[#f0f9ff] rounded-2xl overflow-hidden border border-[#bae6fd]">
                <div className="bg-[#0ea5e9] px-6 py-3">
                  <p className="text-white font-semibold text-sm">Weekly Schedule</p>
                </div>
                <div className="divide-y divide-[#bae6fd]">
                  {DAY_ORDER.map((day) => {
                    const hours = store.opening_hours![day]
                    return (
                      <div key={day} className="flex items-center justify-between px-6 py-4 hover:bg-[#bae6fd]/20 transition-colors">
                        <span className="text-[#0c4a6e] text-sm font-medium">{DAY_LABELS[day]}</span>
                        {hours ? (
                          <span className="text-[#0ea5e9] text-sm font-semibold">
                            {hours.open} – {hours.close}
                          </span>
                        ) : (
                          <span className="text-[#0c4a6e]/50 text-sm italic">Closed</span>
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
        <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f0f9ff]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#0ea5e9] text-sm font-semibold tracking-wider uppercase">Reach Out</span>
              <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl text-[#0c4a6e] mt-3 mb-4">
                Contact Us
              </h2>
              <p className="text-[#0c4a6e]/60 max-w-xl mx-auto">We would love to hear from you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {store.phone && (
                <a
                  href={`tel:${store.phone}`}
                  className="group bg-white rounded-2xl border border-[#bae6fd] hover:border-[#0ea5e9]/40 p-8 text-center transition-all duration-300 shadow-sm"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#0ea5e9]/10 group-hover:bg-[#0ea5e9]/20 flex items-center justify-center mb-5 transition-colors">
                    <Phone size={22} className="text-[#0ea5e9]" />
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-semibold text-[#0c4a6e] mb-2">Phone</h3>
                  <p className="text-[#0c4a6e]/60 text-sm">{store.phone}</p>
                </a>
              )}
              {store.email && (
                <a
                  href={`mailto:${store.email}`}
                  className="group bg-white rounded-2xl border border-[#bae6fd] hover:border-[#0ea5e9]/40 p-8 text-center transition-all duration-300 shadow-sm"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#0ea5e9]/10 group-hover:bg-[#0ea5e9]/20 flex items-center justify-center mb-5 transition-colors">
                    <Mail size={22} className="text-[#0ea5e9]" />
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-semibold text-[#0c4a6e] mb-2">Email</h3>
                  <p className="text-[#0c4a6e]/60 text-sm">{store.email}</p>
                </a>
              )}
              {store.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl border border-[#bae6fd] hover:border-[#0ea5e9]/40 p-8 text-center transition-all duration-300 shadow-sm"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#0ea5e9]/10 group-hover:bg-[#0ea5e9]/20 flex items-center justify-center mb-5 transition-colors">
                    <MapPin size={22} className="text-[#0ea5e9]" />
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-semibold text-[#0c4a6e] mb-2">Address</h3>
                  <p className="text-[#0c4a6e]/60 text-sm">{store.address}</p>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-[#0c4a6e]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Waves size={24} className="text-[#0ea5e9]" />
                  {store.logo && (
                    <img
                      src={getImageUrl(store.logo) || ''}
                      alt={store.name}
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-[#0ea5e9]/30"
                    />
                  )}
                  <span className="font-['Plus_Jakarta_Sans'] text-lg font-semibold text-white">{store.name}</span>
                </div>
                <p className="text-[#bae6fd]/70 text-sm leading-relaxed mb-6">
                  {store.description || 'Fresh coastal cuisine served daily with ocean views.'}
                </p>
                <SocialLinks links={store.social_links ?? []} />
              </div>

              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-white text-lg font-semibold mb-5">Quick Links</h4>
                <ul className="space-y-3">
                  {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-[#bae6fd]/70 hover:text-white text-sm transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-white text-lg font-semibold mb-5">Support</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#bae6fd]/70 hover:text-white text-sm transition-colors">FAQ</a></li>
                  <li><a href="#" className="text-[#bae6fd]/70 hover:text-white text-sm transition-colors">Delivery Info</a></li>
                  <li><a href="#" className="text-[#bae6fd]/70 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-[#bae6fd]/70 hover:text-white text-sm transition-colors">Terms of Service</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-white text-lg font-semibold mb-5">Contact</h4>
                <ul className="space-y-3">
                  {store.phone && (
                    <li>
                      <a href={`tel:${store.phone}`} className="text-[#bae6fd]/70 hover:text-white text-sm transition-colors flex items-center gap-2">
                        <Phone size={14} /> {store.phone}
                      </a>
                    </li>
                  )}
                  {store.email && (
                    <li>
                      <a href={`mailto:${store.email}`} className="text-[#bae6fd]/70 hover:text-white text-sm transition-colors flex items-center gap-2">
                        <Mail size={14} /> {store.email}
                      </a>
                    </li>
                  )}
                  {store.address && (
                    <li className="flex items-start gap-2 text-[#bae6fd]/70 text-sm">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span>{store.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#0ea5e9]/20 bg-[#08344e]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[#bae6fd]/50 text-xs">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
              <p className="text-[#bae6fd]/50 text-xs">
                Made with love by the coast
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
