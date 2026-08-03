'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, ChevronRight, Quote } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import { SocialLinks } from '@/components/templates/blocks/social-links'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface VelvetNoirProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const GOLD = '#c9a84c'
const DARK = '#0d0d0d'
const TEXT = '#f5efe0'
const MUTED = '#8b7355'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}
export function VelvetNoirTemplate({ store, themeColors, onAddToCart, onShopNow }: VelvetNoirProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const { currency } = useCurrency()

  const c = { ...themeColors } as Record<string, string>
  const bg = c['--bg'] || DARK
  const accent = c['--accent'] || GOLD
  const textColor = c['--text'] || TEXT
  const mutedColor = c['--muted'] || MUTED

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
    servesCuisine: 'International',
    image: getImageUrl(store.cover_image || store.cover),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        :root { ${Object.entries(c).map(([k, v]) => `${k}: ${v};`).join('\n')} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-[#0d0d0d] text-[#f5efe0] font-['Inter'] overflow-x-hidden">
        {/* ── Navbar ── */}
        <nav
          className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
            scrolled ? 'bg-[#0d0d0d]/95 backdrop-blur-md shadow-lg shadow-black/30' : 'bg-transparent'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                {store.logo && (
                  <img
                    src={getImageUrl(store.logo) || ''}
                    alt={store.name}
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-[#c9a84c]/30"
                  />
                )}
                <span className="font-['Playfair_Display'] text-xl tracking-wider text-[#f5efe0]">
                  {store.name}
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-8">
                {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm tracking-widest uppercase text-[#8b7355] hover:text-[#c9a84c] transition-colors duration-300"
                  >
                    {item}
                  </a>
                ))}
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="bg-[#c9a84c] text-[#0d0d0d] px-6 py-2.5 text-sm tracking-widest uppercase font-semibold hover:bg-[#b8942f] transition-colors duration-300"
                  >
                    Order Now
                  </button>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-[#f5efe0] p-2"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={cn(
              'lg:hidden overflow-hidden transition-all duration-400',
              menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="bg-[#0d0d0d]/98 backdrop-blur-md border-t border-[#c9a84c]/10 px-4 py-6 space-y-4">
              {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm tracking-widest uppercase text-[#8b7355] hover:text-[#c9a84c] transition-colors"
                >
                  {item}
                </a>
              ))}
              {onShopNow && (
                <button
                  onClick={() => { setMenuOpen(false); onShopNow?.() }}
                  className="w-full bg-[#c9a84c] text-[#0d0d0d] px-6 py-3 text-sm tracking-widest uppercase font-semibold"
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
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/70 via-[#0d0d0d]/50 to-[#0d0d0d]/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d]/40 to-transparent" />

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="font-['Cormorant_Garamond'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-[#f5efe0] leading-tight tracking-wide">
              {store.name}
            </h1>
            <div className="w-24 h-px bg-[#c9a84c] mx-auto my-6" />
            <p className="font-['Cormorant_Garamond'] italic text-lg sm:text-xl md:text-2xl text-[#8b7355] max-w-2xl mx-auto leading-relaxed">
              {store.description || 'An exquisite journey through culinary artistry'}
            </p>
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={onShopNow}
                className="bg-[#c9a84c] text-[#0d0d0d] px-8 py-3.5 text-sm tracking-[0.2em] uppercase font-semibold hover:bg-[#b8942f] transition-all duration-300"
              >
                Explore Menu
              </button>
              {store.phone && (
                <a
                  href={`tel:${store.phone}`}
                  className="border border-[#c9a84c]/40 text-[#c9a84c] px-8 py-3.5 text-sm tracking-[0.2em] uppercase hover:bg-[#c9a84c]/10 transition-all duration-300"
                >
                  Reserve
                </a>
              )}
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronRight size={24} className="text-[#c9a84c]/50 -rotate-90" />
          </div>
        </section>

        {/* ── Foods Section ── */}
        <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#c9a84c] text-sm tracking-[0.3em] uppercase">Culinary Excellence</span>
            <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl text-[#f5efe0] mt-3 mb-4">
              Culinary Selection
            </h2>
            <div className="w-16 h-px bg-[#c9a84c] mx-auto" />
          </div>

          {store.foods.length === 0 ? (
            <div className="text-center py-20 border border-[#c9a84c]/10 max-w-lg mx-auto">
              <Clock size={48} className="mx-auto text-[#8b7355] mb-4" />
              <p className="font-['Playfair_Display'] text-2xl text-[#f5efe0] mb-2">Culinary Collection</p>
              <p className="text-[#8b7355] italic">Our culinary collection is coming soon. Stay tuned.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {store.foods.map((food) => (
                <div
                  key={food.id}
                  className="group bg-[#141414] border border-transparent hover:border-[#c9a84c]/30 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-500 overflow-hidden"
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    {food.image ? (
                      <img
                        src={getImageUrl(food.image) ?? undefined}
                        alt={food.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                        <Clock size={32} className="text-[#3a3a3a]" />
                      </div>
                    )}
                    {food.is_offer && (
                      <span className="absolute top-3 left-3 bg-[#c9a84c] text-[#0d0d0d] text-[10px] tracking-widest uppercase px-3 py-1 font-semibold">
                        Offer
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-['Playfair_Display'] text-lg text-[#f5efe0] group-hover:text-[#c9a84c] transition-colors">
                      {food.name}
                    </h3>
                    {food.description && (
                      <p className="text-[#8b7355] text-sm mt-1.5 line-clamp-2 leading-relaxed">
                        {food.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#c9a84c]/10">
                      <span className="font-['Playfair_Display'] text-lg text-[#c9a84c]">
                        {formatFoodPrice(food, currency)}
                      </span>
                      {onAddToCart && (
                        <button
                          data-add-to-cart={food.id}
                          onClick={() => onAddToCart(food.id)}
                          className="border border-[#c9a84c]/30 text-[#c9a84c] px-4 py-2 text-xs tracking-widest uppercase hover:bg-[#c9a84c] hover:text-[#0d0d0d] active:scale-[0.97] transition-all duration-300"
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
        <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#c9a84c] text-sm tracking-[0.3em] uppercase">Testimonials</span>
              <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl text-[#f5efe0] mt-3 mb-4">
                Kind Words
              </h2>
              <div className="w-16 h-px bg-[#c9a84c] mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {store.reviews.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-[#141414] p-6 border border-[#c9a84c]/5">
                      <StarRating rating={5} size={16} activeColor="#c9a84c" inactiveColor="#3a3a3a" />
                      <Quote size={20} className="text-[#c9a84c]/30 mt-4 mb-3" />
                      <p className="text-[#8b7355] italic text-sm leading-relaxed mb-4">
                        A remarkable dining experience that transcends expectations.
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#c9a84c]/10">
                        <div className="w-10 h-10 rounded-full bg-[#1a1a1a] ring-1 ring-[#c9a84c]/20 flex items-center justify-center">
                          <span className="text-[#c9a84c] text-sm font-semibold">G</span>
                        </div>
                        <div>
                          <p className="text-[#f5efe0] text-sm font-medium">Guest</p>
                          <p className="text-[#8b7355] text-xs">Verified Diner</p>
                        </div>
                      </div>
                    </div>
                  ))
                : store.reviews.map((review) => (
                    <div key={review.id} className="bg-[#141414] p-6 border border-transparent hover:border-[#c9a84c]/10 transition-all duration-300">
                      <StarRating rating={review.rating} size={16} activeColor="#c9a84c" inactiveColor="#3a3a3a" />
                      <Quote size={20} className="text-[#c9a84c]/30 mt-4 mb-3" />
                      <p className="text-[#8b7355] italic text-sm leading-relaxed mb-4 line-clamp-4">
                        {review.comment || 'An unforgettable experience.'}
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#c9a84c]/10">
                        <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-[#c9a84c]/20">
                          {review.avatar ? (
                            <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                              <span className="text-[#c9a84c] text-sm font-semibold">{review.user.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[#f5efe0] text-sm font-medium">{review.user}</p>
                          <p className="text-[#8b7355] text-xs">Verified Diner</p>
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
              <span className="text-[#c9a84c] text-sm tracking-[0.3em] uppercase">Our People</span>
              <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl text-[#f5efe0] mt-3 mb-4">
                The Team
              </h2>
              <div className="w-16 h-px bg-[#c9a84c] mx-auto" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {store.staff.map((member, idx) => (
                <div key={idx} className="text-center group">
                  <div className="w-24 h-24 rounded-full mx-auto ring-2 ring-[#c9a84c]/30 group-hover:ring-[#c9a84c] transition-all duration-300 flex items-center justify-center bg-[#141414] overflow-hidden">
                    <span className="font-['Playfair_Display'] text-3xl text-[#c9a84c]">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-[#f5efe0] font-medium mt-4 group-hover:text-[#c9a84c] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-[#8b7355] text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Opening Hours ── */}
        {store.opening_hours && (
          <section id="hours" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-12">
                <span className="text-[#c9a84c] text-sm tracking-[0.3em] uppercase">Visit Us</span>
                <h2 className="font-['Playfair_Display'] text-4xl text-[#f5efe0] mt-3 mb-4">Hours</h2>
                <div className="w-16 h-px bg-[#c9a84c] mx-auto" />
              </div>

              <div className="border border-[#c9a84c]/20 bg-[#141414] divide-y divide-[#c9a84c]/5">
                {DAY_ORDER.map((day) => {
                  const hours = store.opening_hours![day]
                  return (
                    <div key={day} className="flex items-center justify-between px-6 py-4 hover:bg-[#1a1a1a] transition-colors">
                      <span className="text-[#f5efe0] text-sm tracking-wider uppercase">{DAY_LABELS[day]}</span>
                      {hours ? (
                        <span className="text-[#c9a84c] text-sm font-medium tracking-wide">
                          {hours.open} – {hours.close}
                        </span>
                      ) : (
                        <span className="text-[#8b7355] text-sm italic">Closed</span>
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
            <span className="text-[#c9a84c] text-sm tracking-[0.3em] uppercase">Connect</span>
            <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl text-[#f5efe0] mt-3 mb-4">
              Get in Touch
            </h2>
            <div className="w-16 h-px bg-[#c9a84c] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {store.phone && (
              <a
                href={`tel:${store.phone}`}
                className="group bg-[#141414] border border-transparent hover:border-[#c9a84c]/30 p-8 text-center transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto rounded-full border border-[#c9a84c]/20 group-hover:border-[#c9a84c]/50 flex items-center justify-center mb-5 transition-colors">
                  <Phone size={22} className="text-[#c9a84c]" />
                </div>
                <h3 className="text-[#f5efe0] font-['Playfair_Display'] text-lg mb-2">Phone</h3>
                <p className="text-[#8b7355] text-sm">{store.phone}</p>
              </a>
            )}
            {store.email && (
              <a
                href={`mailto:${store.email}`}
                className="group bg-[#141414] border border-transparent hover:border-[#c9a84c]/30 p-8 text-center transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto rounded-full border border-[#c9a84c]/20 group-hover:border-[#c9a84c]/50 flex items-center justify-center mb-5 transition-colors">
                  <Mail size={22} className="text-[#c9a84c]" />
                </div>
                <h3 className="text-[#f5efe0] font-['Playfair_Display'] text-lg mb-2">Email</h3>
                <p className="text-[#8b7355] text-sm">{store.email}</p>
              </a>
            )}
            {store.address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#141414] border border-transparent hover:border-[#c9a84c]/30 p-8 text-center transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto rounded-full border border-[#c9a84c]/20 group-hover:border-[#c9a84c]/50 flex items-center justify-center mb-5 transition-colors">
                  <MapPin size={22} className="text-[#c9a84c]" />
                </div>
                <h3 className="text-[#f5efe0] font-['Playfair_Display'] text-lg mb-2">Address</h3>
                <p className="text-[#8b7355] text-sm">{store.address}</p>
              </a>
            )}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-[#080808] border-t border-[#c9a84c]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {store.logo && (
                    <img
                      src={getImageUrl(store.logo) || ''}
                      alt={store.name}
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-[#c9a84c]/30"
                    />
                  )}
                  <span className="font-['Playfair_Display'] text-lg text-[#f5efe0]">{store.name}</span>
                </div>
                <p className="text-[#8b7355] text-sm leading-relaxed mb-6">
                  {store.description || 'A premium dining experience crafted with passion.'}
                </p>
                <SocialLinks links={store.social_links ?? []} />
              </div>

              <div>
                <h4 className="font-['Playfair_Display'] text-[#f5efe0] text-lg mb-5">Quick Links</h4>
                <ul className="space-y-3">
                  {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase()}`}
                        className="text-[#8b7355] hover:text-[#c9a84c] text-sm transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-['Playfair_Display'] text-[#f5efe0] text-lg mb-5">Support</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#8b7355] hover:text-[#c9a84c] text-sm transition-colors">FAQ</a></li>
                  <li><a href="#" className="text-[#8b7355] hover:text-[#c9a84c] text-sm transition-colors">Delivery Info</a></li>
                  <li><a href="#" className="text-[#8b7355] hover:text-[#c9a84c] text-sm transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-[#8b7355] hover:text-[#c9a84c] text-sm transition-colors">Terms of Service</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-['Playfair_Display'] text-[#f5efe0] text-lg mb-5">Contact</h4>
                <ul className="space-y-3">
                  {store.phone && (
                    <li>
                      <a href={`tel:${store.phone}`} className="text-[#8b7355] hover:text-[#c9a84c] text-sm transition-colors flex items-center gap-2">
                        <Phone size={14} /> {store.phone}
                      </a>
                    </li>
                  )}
                  {store.email && (
                    <li>
                      <a href={`mailto:${store.email}`} className="text-[#8b7355] hover:text-[#c9a84c] text-sm transition-colors flex items-center gap-2">
                        <Mail size={14} /> {store.email}
                      </a>
                    </li>
                  )}
                  {store.address && (
                    <li className="flex items-start gap-2 text-[#8b7355] text-sm">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span>{store.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#c9a84c]/10 bg-[#050505]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[#8b7355] text-xs tracking-wider">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
              <p className="text-[#8b7355] text-xs">
                Crafted with passion
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
