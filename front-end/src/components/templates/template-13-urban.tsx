'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, ChevronRight, Quote, Building, Zap } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import { SocialLinks } from '@/components/templates/blocks/social-links'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface UrbanProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const CHARCOAL = '#1e293b'
const CORAL = '#f97316'
const LIGHT = '#fafaf9'
const DARK = '#1c1917'
const CYAN = '#06b6d4'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

export default function UrbanTemplate({ store, themeColors, onAddToCart, onShopNow }: UrbanProps) {
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
    servesCuisine: 'Modern, Urban',
    image: getImageUrl(store.cover_image || store.cover),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
        :root { ${Object.entries(c).map(([k, v]) => `${k}: ${v};`).join('\n')} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-[#fafaf9] text-[#1c1917] font-['Inter'] overflow-x-hidden">
        {/* Navbar */}
        <nav
          className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
            scrolled ? 'bg-[#1e293b]/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-transparent'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                <Building size={20} className="text-[#f97316]" />
                {store.logo && (
                  <img
                    src={getImageUrl(store.logo) || ''}
                    alt={store.name}
                    className="h-10 w-10 rounded-lg object-cover ring-1 ring-[#f97316]/30"
                  />
                )}
                <span className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-white">
                  {store.name}
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-8">
                {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-white/70 hover:text-[#f97316] transition-colors duration-300 font-medium"
                  >
                    {item}
                  </a>
                ))}
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="bg-[#f97316] text-white px-6 py-2.5 text-sm font-bold hover:bg-[#ea580c] transition-all duration-300 rounded-lg"
                  >
                    Order Now
                  </button>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-white p-2"
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
            <div className="bg-[#1e293b]/98 backdrop-blur-md border-t border-[#f97316]/10 px-4 py-6 space-y-4">
              {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm text-white/70 hover:text-[#f97316] transition-colors"
                >
                  {item}
                </a>
              ))}
              {onShopNow && (
                <button
                  onClick={() => { setMenuOpen(false); onShopNow?.() }}
                  className="w-full bg-[#f97316] text-white px-6 py-3 text-sm font-bold rounded-lg"
                >
                  Order Now
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] via-[#292524] to-[#1c1917]" />
          {(store.cover_image || store.cover) && (
            <div
              className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-15"
              style={{ backgroundImage: `url(${getImageUrl(store.cover_image || store.cover)})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#f97316]/10 to-transparent" />

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <Zap size={36} className="mx-auto text-[#f97316] mb-4" />
            <h1 className="font-['Plus_Jakarta_Sans'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight tracking-tight">
              {store.name}
            </h1>
            <div className="w-16 h-1 bg-[#f97316] mx-auto my-6" />
            <p className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-2xl mx-auto leading-relaxed font-light">
              {store.description || 'Urban flavors, modern edge — where the city comes to eat'}
            </p>
            <div className="flex items-center justify-center gap-4 mt-10 flex-wrap">
              <button
                onClick={onShopNow}
                className="bg-[#f97316] text-white px-8 py-3.5 text-sm font-bold rounded-lg hover:bg-[#ea580c] transition-all duration-300 shadow-xl shadow-[#f97316]/20"
              >
                Explore Menu
              </button>
              <a
                href="#menu"
                className="border-2 border-white/30 text-white px-8 py-3.5 text-sm font-medium rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                Urban Eats
              </a>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronRight size={24} className="text-[#f97316]/60 -rotate-90" />
          </div>
        </section>

        {/* Foods Section (Urban Eats) */}
        <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#fafaf9]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Building size={24} className="mx-auto text-[#f97316] mb-3" />
              <span className="text-[#f97316] text-sm font-bold tracking-widest uppercase">Urban Eats</span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl font-extrabold text-[#1e293b] mt-3 mb-4">
                City Flavors
              </h2>
              <p className="text-[#1c1917]/60 max-w-xl mx-auto">Modern cuisine for the urban palate</p>
            </div>

            {store.foods.length === 0 ? (
              <div className="text-center py-20 bg-[#1e293b] rounded-xl border border-[#f97316]/20 max-w-lg mx-auto shadow-xl">
                <Building size={48} className="mx-auto text-[#f97316]/30 mb-4" />
                <p className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-white mb-2">Coming Soon</p>
                <p className="text-white/60">Our urban menu is being crafted. Stay tuned!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.foods.map((food) => (
                  <div
                    key={food.id}
                    className="group bg-[#1e293b] rounded-xl border border-[#44403c] hover:border-[#f97316]/40 transition-all duration-500 overflow-hidden shadow-lg"
                  >
                    <div className="relative overflow-hidden aspect-[4/3]">
                      {food.image ? (
                        <img
                          src={getImageUrl(food.image) ?? undefined}
                          alt={food.name}
                          className="w-full h-full object-cover transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#292524] flex items-center justify-center">
                          <Building size={32} className="text-[#44403c]" />
                        </div>
                      )}
                      {food.is_offer && (
                        <span className="absolute top-3 left-3 bg-[#f97316] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded">
                          Urban Pick
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-white group-hover:text-[#f97316] transition-colors">
                        {food.name}
                      </h3>
                      {food.description && (
                        <p className="text-white/60 text-sm mt-1.5 line-clamp-2 leading-relaxed">
                          {food.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#44403c]">
                        <span className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#f97316]">
                          {formatFoodPrice(food, currency)}
                        </span>
                        {onAddToCart && (
                          <button
                            data-add-to-cart={food.id}
                            onClick={() => onAddToCart(food.id)}
                            className="bg-[#f97316]/10 text-[#f97316] px-4 py-2 text-xs font-bold uppercase rounded-lg hover:bg-[#f97316] hover:text-white transition-all duration-300"
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

        {/* Reviews Section */}
        <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1e293b]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#f97316] text-sm font-bold tracking-widest uppercase">Testimonials</span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl font-extrabold text-white mt-3 mb-4">
                Urban Voices
              </h2>
              <p className="text-white/60 max-w-xl mx-auto">What the city is saying</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {store.reviews.length === 0
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-[#292524] p-6 rounded-xl border border-[#44403c]">
                      <StarRating rating={5} size={16} activeColor="#f97316" inactiveColor="#44403c" />
                      <Quote size={20} className="text-[#f97316]/20 mt-4 mb-3" />
                      <p className="text-white/70 text-sm leading-relaxed mb-4 italic">
                        The most innovative urban dining experience. Every dish is a work of art.
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#44403c]">
                        <div className="w-10 h-10 rounded-lg bg-[#f97316]/10 flex items-center justify-center">
                          <span className="text-[#f97316] text-sm font-bold">G</span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-bold">Guest</p>
                          <p className="text-white/50 text-xs">Verified Diner</p>
                        </div>
                      </div>
                    </div>
                  ))
                : store.reviews.map((review) => (
                    <div key={review.id} className="bg-[#292524] p-6 rounded-xl border border-[#44403c] hover:border-[#f97316]/30 transition-all duration-300">
                      <StarRating rating={review.rating} size={16} activeColor="#f97316" inactiveColor="#44403c" />
                      <Quote size={20} className="text-[#f97316]/20 mt-4 mb-3" />
                      <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-4 italic">
                        {review.comment || 'An urban culinary masterpiece.'}
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#44403c]">
                        <div className="w-10 h-10 rounded-lg overflow-hidden">
                          {review.avatar ? (
                            <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#f97316]/10 flex items-center justify-center">
                              <span className="text-[#f97316] text-sm font-bold">{review.user.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white text-sm font-bold">{review.user}</p>
                          <p className="text-white/50 text-xs">Verified Diner</p>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* Staff Section */}
        {store.staff.length > 0 && (
          <section id="team" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#fafaf9]">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-[#f97316] text-sm font-bold tracking-widest uppercase">Our People</span>
                <h2 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl font-extrabold text-[#1e293b] mt-3 mb-4">
                  Urban Crew
                </h2>
                <p className="text-[#1c1917]/60 max-w-xl mx-auto">The talent behind the taste</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                {store.staff.map((member, idx) => (
                  <div key={idx} className="text-center group">
                    <div className="w-24 h-24 mx-auto rounded-xl bg-[#1e293b] border-2 border-[#44403c] group-hover:border-[#f97316] transition-all duration-300 flex items-center justify-center shadow-lg">
                      <span className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#f97316]">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-['Plus_Jakarta_Sans'] text-[#1e293b] font-bold mt-4 group-hover:text-[#f97316] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-[#1c1917]/60 text-sm">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Opening Hours */}
        {store.opening_hours && (
          <section id="hours" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1e293b]">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-12">
                <Clock size={24} className="mx-auto text-[#f97316] mb-3" />
                <span className="text-[#f97316] text-sm font-bold tracking-widest uppercase">City Hours</span>
                <h2 className="font-['Plus_Jakarta_Sans'] text-4xl font-extrabold text-white mt-3 mb-4">
                  Opening Hours
                </h2>
              </div>

              <div className="bg-[#292524] rounded-xl overflow-hidden border border-[#44403c]">
                <div className="bg-[#f97316] px-6 py-3">
                  <p className="text-white font-bold text-sm">Weekly Schedule</p>
                </div>
                <div className="divide-y divide-[#44403c]">
                  {DAY_ORDER.map((day) => {
                    const hours = store.opening_hours![day]
                    return (
                      <div key={day} className="flex items-center justify-between px-6 py-4 hover:bg-[#1e293b] transition-colors">
                        <span className="text-white text-sm font-medium">{DAY_LABELS[day]}</span>
                        {hours ? (
                          <span className="text-[#f97316] text-sm font-bold">
                            {hours.open} – {hours.close}
                          </span>
                        ) : (
                          <span className="text-white/50 text-sm italic">Closed</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#fafaf9]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#f97316] text-sm font-bold tracking-widest uppercase">Connect</span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl font-extrabold text-[#1e293b] mt-3 mb-4">
                Get in Touch
              </h2>
              <p className="text-[#1c1917]/60 max-w-xl mx-auto">We would love to connect</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {store.phone && (
                <a
                  href={`tel:${store.phone}`}
                  className="group bg-[#1e293b] rounded-xl border border-[#44403c] hover:border-[#f97316]/40 p-8 text-center transition-all duration-300 shadow-lg"
                >
                  <div className="w-14 h-14 mx-auto rounded-xl bg-[#f97316]/10 group-hover:bg-[#f97316]/20 flex items-center justify-center mb-5 transition-colors">
                    <Phone size={22} className="text-[#f97316]" />
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-white mb-2">Phone</h3>
                  <p className="text-white/60 text-sm">{store.phone}</p>
                </a>
              )}
              {store.email && (
                <a
                  href={`mailto:${store.email}`}
                  className="group bg-[#1e293b] rounded-xl border border-[#44403c] hover:border-[#f97316]/40 p-8 text-center transition-all duration-300 shadow-lg"
                >
                  <div className="w-14 h-14 mx-auto rounded-xl bg-[#f97316]/10 group-hover:bg-[#f97316]/20 flex items-center justify-center mb-5 transition-colors">
                    <Mail size={22} className="text-[#f97316]" />
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-white mb-2">Email</h3>
                  <p className="text-white/60 text-sm">{store.email}</p>
                </a>
              )}
              {store.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#1e293b] rounded-xl border border-[#44403c] hover:border-[#f97316]/40 p-8 text-center transition-all duration-300 shadow-lg"
                >
                  <div className="w-14 h-14 mx-auto rounded-xl bg-[#06b6d4]/10 group-hover:bg-[#06b6d4]/20 flex items-center justify-center mb-5 transition-colors">
                    <MapPin size={22} className="text-[#06b6d4]" />
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-white mb-2">Address</h3>
                  <p className="text-white/60 text-sm">{store.address}</p>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#1e293b]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Building size={20} className="text-[#f97316]" />
                  {store.logo && (
                    <img
                      src={getImageUrl(store.logo) || ''}
                      alt={store.name}
                      className="h-10 w-10 rounded-lg object-cover ring-1 ring-[#f97316]/30"
                    />
                  )}
                  <span className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-white">{store.name}</span>
                </div>
                <p className="text-[#78716c] text-sm leading-relaxed mb-6">
                  {store.description || 'Modern urban cuisine with an edge.'}
                </p>
                <SocialLinks links={store.social_links ?? []} />
              </div>

              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-white text-lg font-bold mb-5">Quick Links</h4>
                <ul className="space-y-3">
                  {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-[#78716c] hover:text-[#f97316] text-sm transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-white text-lg font-bold mb-5">Support</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#78716c] hover:text-[#f97316] text-sm transition-colors">FAQ</a></li>
                  <li><a href="#" className="text-[#78716c] hover:text-[#f97316] text-sm transition-colors">Delivery Info</a></li>
                  <li><a href="#" className="text-[#78716c] hover:text-[#f97316] text-sm transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-[#78716c] hover:text-[#f97316] text-sm transition-colors">Terms of Service</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-white text-lg font-bold mb-5">Contact</h4>
                <ul className="space-y-3">
                  {store.phone && (
                    <li>
                      <a href={`tel:${store.phone}`} className="text-[#78716c] hover:text-[#f97316] text-sm transition-colors flex items-center gap-2">
                        <Phone size={14} /> {store.phone}
                      </a>
                    </li>
                  )}
                  {store.email && (
                    <li>
                      <a href={`mailto:${store.email}`} className="text-[#78716c] hover:text-[#f97316] text-sm transition-colors flex items-center gap-2">
                        <Mail size={14} /> {store.email}
                      </a>
                    </li>
                  )}
                  {store.address && (
                    <li className="flex items-start gap-2 text-[#78716c] text-sm">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span>{store.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#44403c] bg-[#1c1917]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[#78716c]/50 text-xs">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
              <p className="text-[#78716c]/50 text-xs">
                Built for the city
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
