'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, ChevronRight, Quote, Leaf, Sun, Droplets } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import { SocialLinks } from '@/components/templates/blocks/social-links'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface TropicalProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const TURQUOISE = '#14b8a6'
const CORAL = '#f43f5e'
const LIGHT = '#ecfdf5'
const DARK = '#134e4a'
const YELLOW = '#fbbf24'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

export default function TropicalTemplate({ store, themeColors, onAddToCart, onShopNow }: TropicalProps) {
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
    servesCuisine: 'Tropical, Caribbean',
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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        :root { ${Object.entries(c).map(([k, v]) => `${k}: ${v};`).join('\n')} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-[#ecfdf5] text-[#134e4a] font-['Inter'] overflow-x-hidden">
        {/* Navbar */}
        <nav
          className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
            scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm shadow-[#14b8a6]/10' : 'bg-transparent'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                <Sun size={22} className="text-[#f43f5e]" />
                {store.logo && (
                  <img
                    src={getImageUrl(store.logo) || ''}
                    alt={store.name}
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-[#14b8a6]/30"
                  />
                )}
                <span className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#134e4a]">
                  {store.name}
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-8">
                {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-[#134e4a]/70 hover:text-[#14b8a6] transition-colors duration-300 font-medium"
                  >
                    {item}
                  </a>
                ))}
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="bg-[#f43f5e] text-white px-6 py-2.5 text-sm font-semibold rounded-full hover:bg-[#e11d48] transition-all duration-300 shadow-lg shadow-[#f43f5e]/20"
                  >
                    Order Now
                  </button>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-[#134e4a] p-2"
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
            <div className="bg-white/98 backdrop-blur-md border-t border-[#ccfbf1] px-4 py-6 space-y-4">
              {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm text-[#134e4a]/70 hover:text-[#14b8a6] transition-colors"
                >
                  {item}
                </a>
              ))}
              {onShopNow && (
                <button
                  onClick={() => { setMenuOpen(false); onShopNow?.() }}
                  className="w-full bg-[#f43f5e] text-white px-6 py-3 text-sm font-semibold rounded-full"
                >
                  Order Now
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#14b8a6] via-[#0d9488] to-[#0f766e]" />
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 text-6xl">🌴</div>
            <div className="absolute bottom-20 right-20 text-6xl">🌺</div>
            <div className="absolute top-1/3 right-1/4 text-4xl">🌿</div>
            <div className="absolute bottom-1/3 left-1/4 text-5xl">🍃</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#134e4a]/40 to-transparent" />

          {(store.cover_image || store.cover) && (
            <div
              className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30"
              style={{ backgroundImage: `url(${getImageUrl(store.cover_image || store.cover)})` }}
            />
          )}

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <Leaf size={36} className="mx-auto text-[#fbbf24] mb-4" />
            <h1 className="font-['Plus_Jakarta_Sans'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight">
              {store.name}
            </h1>
            <div className="flex items-center justify-center gap-3 my-6">
              <span className="w-12 h-0.5 bg-[#fbbf24]" />
              <span className="text-[#fbbf24] text-sm font-semibold tracking-widest uppercase">Paradise Found</span>
              <span className="w-12 h-0.5 bg-[#fbbf24]" />
            </div>
            <p className="text-lg sm:text-xl md:text-2xl text-[#ccfbf1] max-w-2xl mx-auto leading-relaxed font-light">
              {store.description || 'Tropical flavors, island vibes — a taste of paradise in every bite'}
            </p>
            <div className="flex items-center justify-center gap-4 mt-10 flex-wrap">
              <button
                onClick={onShopNow}
                className="bg-[#f43f5e] text-white px-8 py-3.5 text-sm font-bold rounded-full hover:bg-[#e11d48] transition-all duration-300 shadow-xl shadow-[#f43f5e]/30"
              >
                Explore Island Menu
              </button>
              <a
                href="#menu"
                className="border-2 border-white/40 text-white px-8 py-3.5 text-sm font-medium rounded-full hover:bg-white/10 transition-all duration-300"
              >
                View Specials
              </a>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronRight size={24} className="text-[#fbbf24]/60 -rotate-90" />
          </div>
        </section>

        {/* Foods Section (Island Menu) */}
        <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Droplets size={24} className="mx-auto text-[#14b8a6] mb-3" />
              <span className="text-[#f43f5e] text-sm font-semibold tracking-wider uppercase">Island Menu</span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl font-bold text-[#134e4a] mt-3 mb-4">
                Tropical Flavors
              </h2>
              <p className="text-[#134e4a]/60 max-w-xl mx-auto">Bursting with island freshness</p>
            </div>

            {store.foods.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#ccfbf1] max-w-lg mx-auto shadow-sm">
                <Sun size={48} className="mx-auto text-[#fbbf24]/40 mb-4" />
                <p className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#134e4a] mb-2">Menu in Bloom</p>
                <p className="text-[#134e4a]/60">Our tropical menu is growing. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.foods.map((food) => (
                  <div
                    key={food.id}
                    className="group bg-white rounded-2xl border border-[#ccfbf1] hover:border-[#14b8a6]/40 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#14b8a6]/10"
                  >
                    <div className="relative overflow-hidden aspect-[4/3]">
                      {food.image ? (
                        <img
                          src={getImageUrl(food.image) ?? undefined}
                          alt={food.name}
                          className="w-full h-full object-cover transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#ecfdf5] flex items-center justify-center">
                          <Leaf size={32} className="text-[#ccfbf1]" />
                        </div>
                      )}
                      {food.is_offer && (
                        <span className="absolute top-3 left-3 bg-[#f43f5e] text-white text-[10px] tracking-widest uppercase px-3 py-1 rounded-full font-semibold">
                          Island Special
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#134e4a] group-hover:text-[#14b8a6] transition-colors">
                        {food.name}
                      </h3>
                      {food.description && (
                        <p className="text-[#134e4a]/60 text-sm mt-1.5 line-clamp-2 leading-relaxed">
                          {food.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#ccfbf1]">
                        <span className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#14b8a6]">
                          {formatFoodPrice(food, currency)}
                        </span>
                        {onAddToCart && (
                          <button
                            data-add-to-cart={food.id}
                            onClick={() => onAddToCart(food.id)}
                            className="bg-[#f43f5e]/10 text-[#f43f5e] px-4 py-2 text-xs font-semibold rounded-full hover:bg-[#f43f5e] hover:text-white transition-all duration-300"
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
        <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#ccfbf1]/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#14b8a6] text-sm font-semibold tracking-wider uppercase">Testimonials</span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl font-bold text-[#134e4a] mt-3 mb-4">
                Island Voices
              </h2>
              <p className="text-[#134e4a]/60 max-w-xl mx-auto">What our guests say about paradise</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {store.reviews.length === 0
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-[#ccfbf1]">
                      <StarRating rating={5} size={16} activeColor="#f43f5e" inactiveColor="#ccfbf1" />
                      <Quote size={20} className="text-[#14b8a6]/20 mt-4 mb-3" />
                      <p className="text-[#134e4a]/70 text-sm leading-relaxed mb-4 italic">
                        A true tropical paradise! The flavors transport you straight to the islands.
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#ccfbf1]">
                        <div className="w-10 h-10 rounded-full bg-[#14b8a6]/10 flex items-center justify-center">
                          <span className="text-[#14b8a6] text-sm font-semibold">G</span>
                        </div>
                        <div>
                          <p className="text-[#134e4a] text-sm font-medium">Guest</p>
                          <p className="text-[#134e4a]/50 text-xs">Verified Diner</p>
                        </div>
                      </div>
                    </div>
                  ))
                : store.reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-2xl border border-[#ccfbf1] hover:border-[#14b8a6]/30 transition-all duration-300">
                      <StarRating rating={review.rating} size={16} activeColor="#f43f5e" inactiveColor="#ccfbf1" />
                      <Quote size={20} className="text-[#14b8a6]/20 mt-4 mb-3" />
                      <p className="text-[#134e4a]/70 text-sm leading-relaxed mb-4 line-clamp-4 italic">
                        {review.comment || 'A taste of paradise!'}
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#ccfbf1]">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          {review.avatar ? (
                            <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#14b8a6]/10 flex items-center justify-center">
                              <span className="text-[#14b8a6] text-sm font-semibold">{review.user.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[#134e4a] text-sm font-medium">{review.user}</p>
                          <p className="text-[#134e4a]/50 text-xs">Verified Diner</p>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* Staff Section */}
        {store.staff.length > 0 && (
          <section id="team" className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-[#f43f5e] text-sm font-semibold tracking-wider uppercase">Our Crew</span>
                <h2 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl font-bold text-[#134e4a] mt-3 mb-4">
                  Island Team
                </h2>
                <p className="text-[#134e4a]/60 max-w-xl mx-auto">The people behind the paradise</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                {store.staff.map((member, idx) => (
                  <div key={idx} className="text-center group">
                    <div className="w-24 h-24 mx-auto rounded-full ring-2 ring-[#14b8a6]/30 group-hover:ring-[#f43f5e] transition-all duration-300 overflow-hidden">
                      <div className="w-full h-full bg-[#ecfdf5] flex items-center justify-center">
                        <span className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#14b8a6]">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-[#134e4a] font-bold mt-4 group-hover:text-[#f43f5e] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-[#134e4a]/60 text-sm">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Opening Hours */}
        {store.opening_hours && (
          <section id="hours" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#ccfbf1]/30">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-12">
                <Clock size={24} className="mx-auto text-[#14b8a6] mb-3" />
                <span className="text-[#14b8a6] text-sm font-semibold tracking-wider uppercase">Island Time</span>
                <h2 className="font-['Plus_Jakarta_Sans'] text-4xl font-bold text-[#134e4a] mt-3 mb-4">
                  Opening Hours
                </h2>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden border border-[#ccfbf1]">
                <div className="bg-gradient-to-r from-[#14b8a6] to-[#0d9488] px-6 py-3">
                  <p className="text-white font-bold text-sm">Weekly Schedule</p>
                </div>
                <div className="divide-y divide-[#ccfbf1]">
                  {DAY_ORDER.map((day) => {
                    const hours = store.opening_hours![day]
                    return (
                      <div key={day} className="flex items-center justify-between px-6 py-4 hover:bg-[#ecfdf5] transition-colors">
                        <span className="text-[#134e4a] text-sm font-medium">{DAY_LABELS[day]}</span>
                        {hours ? (
                          <span className="text-[#14b8a6] text-sm font-bold">
                            {hours.open} – {hours.close}
                          </span>
                        ) : (
                          <span className="text-[#134e4a]/50 text-sm italic">Closed</span>
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
        <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#f43f5e] text-sm font-semibold tracking-wider uppercase">Reach Out</span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl font-bold text-[#134e4a] mt-3 mb-4">
                Contact Us
              </h2>
              <p className="text-[#134e4a]/60 max-w-xl mx-auto">We would love to hear from you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {store.phone && (
                <a
                  href={`tel:${store.phone}`}
                  className="group bg-white rounded-2xl border border-[#ccfbf1] hover:border-[#14b8a6]/40 p-8 text-center transition-all duration-300 shadow-sm"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#14b8a6]/10 group-hover:bg-[#14b8a6]/20 flex items-center justify-center mb-5 transition-colors">
                    <Phone size={22} className="text-[#14b8a6]" />
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#134e4a] mb-2">Phone</h3>
                  <p className="text-[#134e4a]/60 text-sm">{store.phone}</p>
                </a>
              )}
              {store.email && (
                <a
                  href={`mailto:${store.email}`}
                  className="group bg-white rounded-2xl border border-[#ccfbf1] hover:border-[#f43f5e]/40 p-8 text-center transition-all duration-300 shadow-sm"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#f43f5e]/10 group-hover:bg-[#f43f5e]/20 flex items-center justify-center mb-5 transition-colors">
                    <Mail size={22} className="text-[#f43f5e]" />
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#134e4a] mb-2">Email</h3>
                  <p className="text-[#134e4a]/60 text-sm">{store.email}</p>
                </a>
              )}
              {store.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl border border-[#ccfbf1] hover:border-[#fbbf24]/40 p-8 text-center transition-all duration-300 shadow-sm"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#fbbf24]/10 group-hover:bg-[#fbbf24]/20 flex items-center justify-center mb-5 transition-colors">
                    <MapPin size={22} className="text-[#fbbf24]" />
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#134e4a] mb-2">Address</h3>
                  <p className="text-[#134e4a]/60 text-sm">{store.address}</p>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#14b8a6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Sun size={22} className="text-[#fbbf24]" />
                  {store.logo && (
                    <img
                      src={getImageUrl(store.logo) || ''}
                      alt={store.name}
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-white/30"
                    />
                  )}
                  <span className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-white">{store.name}</span>
                </div>
                <p className="text-[#ccfbf1]/80 text-sm leading-relaxed mb-6">
                  {store.description || 'Tropical paradise on a plate.'}
                </p>
                <SocialLinks links={store.social_links ?? []} />
              </div>

              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-white text-lg font-bold mb-5">Quick Links</h4>
                <ul className="space-y-3">
                  {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-[#ccfbf1]/80 hover:text-white text-sm transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-white text-lg font-bold mb-5">Support</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#ccfbf1]/80 hover:text-white text-sm transition-colors">FAQ</a></li>
                  <li><a href="#" className="text-[#ccfbf1]/80 hover:text-white text-sm transition-colors">Delivery Info</a></li>
                  <li><a href="#" className="text-[#ccfbf1]/80 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-[#ccfbf1]/80 hover:text-white text-sm transition-colors">Terms of Service</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-white text-lg font-bold mb-5">Contact</h4>
                <ul className="space-y-3">
                  {store.phone && (
                    <li>
                      <a href={`tel:${store.phone}`} className="text-[#ccfbf1]/80 hover:text-white text-sm transition-colors flex items-center gap-2">
                        <Phone size={14} /> {store.phone}
                      </a>
                    </li>
                  )}
                  {store.email && (
                    <li>
                      <a href={`mailto:${store.email}`} className="text-[#ccfbf1]/80 hover:text-white text-sm transition-colors flex items-center gap-2">
                        <Mail size={14} /> {store.email}
                      </a>
                    </li>
                  )}
                  {store.address && (
                    <li className="flex items-start gap-2 text-[#ccfbf1]/80 text-sm">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span>{store.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#ccfbf1]/20 bg-[#0d9488]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[#ccfbf1]/50 text-xs">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
              <p className="text-[#ccfbf1]/50 text-xs">
                Paradise awaits
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
