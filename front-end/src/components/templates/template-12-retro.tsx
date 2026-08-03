'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, ChevronRight, Quote, Music, Pizza } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import { SocialLinks } from '@/components/templates/blocks/social-links'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface RetroProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const RED = '#dc2626'
const CREAM = '#f8f5f0'
const DARK = '#1e293b'
const YELLOW = '#fcd34d'
const BORDER = '#e2e8f0'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

export default function RetroTemplate({ store, themeColors, onAddToCart, onShopNow }: RetroProps) {
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
    servesCuisine: 'American, Diner',
    image: getImageUrl(store.cover_image || store.cover),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
        :root { ${Object.entries(c).map(([k, v]) => `${k}: ${v};`).join('\n')} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .checkered-bg {
          background-image: linear-gradient(45deg, #dc2626 25%, transparent 25%),
                            linear-gradient(-45deg, #dc2626 25%, transparent 25%),
                            linear-gradient(45deg, transparent 75%, #dc2626 75%),
                            linear-gradient(-45deg, transparent 75%, #dc2626 75%);
          background-size: 40px 40px;
          background-position: 0 0, 0 20px, 20px -20px, -20px 0px;
        }
      `}</style>

      <div className="min-h-screen bg-[#f8f5f0] text-[#1e293b] font-['Inter'] overflow-x-hidden">
        {/* Navbar */}
        <nav className="bg-[#dc2626] sticky top-0 left-0 right-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Pizza size={22} className="text-[#fcd34d]" />
                {store.logo && (
                  <img
                    src={getImageUrl(store.logo) || ''}
                    alt={store.name}
                    className="h-8 w-8 rounded-full object-cover ring-1 ring-[#fcd34d]/50"
                  />
                )}
                <span className="font-['Fredoka_One'] text-lg text-white tracking-wide">
                  {store.name}
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-6">
                {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm font-semibold text-white/80 hover:text-[#fcd34d] transition-colors duration-300 uppercase tracking-wider"
                  >
                    {item}
                  </a>
                ))}
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="bg-[#fcd34d] text-[#dc2626] px-5 py-2 text-sm font-bold uppercase tracking-wider hover:bg-[#fbbf24] transition-colors duration-300 rounded-full"
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
            <div className="bg-[#dc2626] border-t border-[#fcd34d]/20 px-4 py-6 space-y-4">
              {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm font-semibold text-white/80 hover:text-[#fcd34d] transition-colors uppercase tracking-wider"
                >
                  {item}
                </a>
              ))}
              {onShopNow && (
                <button
                  onClick={() => { setMenuOpen(false); onShopNow?.() }}
                  className="w-full bg-[#fcd34d] text-[#dc2626] px-5 py-2.5 text-sm font-bold uppercase tracking-wider rounded-full"
                >
                  Order Now
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[#dc2626]" />
          <div className="absolute inset-0 checkered-bg opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#dc2626]/90 via-[#dc2626]/70 to-[#dc2626]/90" />

          {(store.cover_image || store.cover) && (
            <div
              className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-20"
              style={{ backgroundImage: `url(${getImageUrl(store.cover_image || store.cover)})` }}
            />
          )}

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <Music size={36} className="mx-auto text-[#fcd34d] mb-4" />
            <h1 className="font-['Fredoka_One'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-tight">
              {store.name}
            </h1>
            <div className="flex items-center justify-center gap-2 my-6">
              <span className="w-8 h-1 bg-[#fcd34d] rounded-full" />
              <span className="w-2 h-2 bg-[#fcd34d] rounded-full" />
              <span className="w-8 h-1 bg-[#fcd34d] rounded-full" />
            </div>
            <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed font-medium">
              {store.description || 'Classic diner vibes, bold flavors, and a whole lot of nostalgia'}
            </p>
            <div className="flex items-center justify-center gap-4 mt-10 flex-wrap">
              <button
                onClick={onShopNow}
                className="bg-[#fcd34d] text-[#dc2626] px-8 py-3.5 text-sm font-bold uppercase tracking-wider rounded-full hover:bg-[#fbbf24] transition-all duration-300 shadow-lg shadow-black/20"
              >
                Order Now
              </button>
              <a
                href="#menu"
                className="border-2 border-white/50 text-white px-8 py-3.5 text-sm font-bold uppercase tracking-wider rounded-full hover:bg-white/10 transition-all duration-300"
              >
                See the Menu
              </a>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronRight size={24} className="text-[#fcd34d]/60 -rotate-90" />
          </div>
        </section>

        {/* Foods Section (Diner Menu) */}
        <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Pizza size={24} className="mx-auto text-[#dc2626] mb-3" />
              <span className="text-[#dc2626] text-sm font-bold tracking-widest uppercase">Diner Menu</span>
              <h2 className="font-['Fredoka_One'] text-4xl sm:text-5xl text-[#1e293b] mt-3 mb-4">
                Classic Eats
              </h2>
              <p className="text-[#1e293b]/60 max-w-xl mx-auto">Good food, good times</p>
            </div>

            {store.foods.length === 0 ? (
              <div className="text-center py-20 bg-white border-2 border-[#dc2626]/20 max-w-lg mx-auto rounded-2xl">
                <Pizza size={48} className="mx-auto text-[#dc2626]/30 mb-4" />
                <p className="font-['Fredoka_One'] text-2xl text-[#1e293b] mb-2">Menu Loading</p>
                <p className="text-[#1e293b]/60">Our diner menu is being prepared. Come back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.foods.map((food) => (
                  <div
                    key={food.id}
                    className="group bg-white border-2 border-[#e2e8f0] hover:border-[#dc2626]/40 transition-all duration-500 overflow-hidden rounded-2xl"
                  >
                    <div className="relative overflow-hidden aspect-[4/3]">
                      {food.image ? (
                        <img
                          src={getImageUrl(food.image) ?? undefined}
                          alt={food.name}
                          className="w-full h-full object-cover transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#f8f5f0] flex items-center justify-center">
                          <Pizza size={32} className="text-[#e2e8f0]" />
                        </div>
                      )}
                      {food.is_offer && (
                        <span className="absolute top-3 left-3 bg-[#dc2626] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                          Diner Special
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-['Fredoka_One'] text-lg text-[#1e293b] group-hover:text-[#dc2626] transition-colors">
                        {food.name}
                      </h3>
                      {food.description && (
                        <p className="text-[#1e293b]/60 text-sm mt-1.5 line-clamp-2 leading-relaxed">
                          {food.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#e2e8f0]">
                        <span className="font-['Fredoka_One'] text-lg text-[#dc2626]">
                          {formatFoodPrice(food, currency)}
                        </span>
                        {onAddToCart && (
                          <button
                            data-add-to-cart={food.id}
                            onClick={() => onAddToCart(food.id)}
                            className="bg-[#dc2626]/10 text-[#dc2626] px-4 py-2 text-xs font-bold uppercase rounded-full hover:bg-[#dc2626] hover:text-white transition-all duration-300"
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
        <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#e2e8f0]/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#dc2626] text-sm font-bold tracking-widest uppercase">Testimonials</span>
              <h2 className="font-['Fredoka_One'] text-4xl sm:text-5xl text-[#1e293b] mt-3 mb-4">
                What Folks Say
              </h2>
              <p className="text-[#1e293b]/60 max-w-xl mx-auto">Straight from the diner booth</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {store.reviews.length === 0
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white p-6 border border-[#e2e8f0] rounded-2xl">
                      <StarRating rating={5} size={16} activeColor="#dc2626" inactiveColor="#e2e8f0" />
                      <Quote size={20} className="text-[#dc2626]/20 mt-4 mb-3" />
                      <p className="text-[#1e293b]/70 text-sm leading-relaxed mb-4 italic">
                        A blast from the past! The milkshakes and burgers are absolutely legendary.
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#e2e8f0]">
                        <div className="w-10 h-10 rounded-full bg-[#dc2626]/10 flex items-center justify-center">
                          <span className="text-[#dc2626] text-sm font-bold">G</span>
                        </div>
                        <div>
                          <p className="text-[#1e293b] text-sm font-bold">Guest</p>
                          <p className="text-[#1e293b]/50 text-xs">Verified Diner</p>
                        </div>
                      </div>
                    </div>
                  ))
                : store.reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 border border-[#e2e8f0] rounded-2xl hover:border-[#dc2626]/30 transition-all duration-300">
                      <StarRating rating={review.rating} size={16} activeColor="#dc2626" inactiveColor="#e2e8f0" />
                      <Quote size={20} className="text-[#dc2626]/20 mt-4 mb-3" />
                      <p className="text-[#1e293b]/70 text-sm leading-relaxed mb-4 line-clamp-4 italic">
                        {review.comment || 'Classic diner goodness!'}
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#e2e8f0]">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          {review.avatar ? (
                            <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#dc2626]/10 flex items-center justify-center">
                              <span className="text-[#dc2626] text-sm font-bold">{review.user.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[#1e293b] text-sm font-bold">{review.user}</p>
                          <p className="text-[#1e293b]/50 text-xs">Verified Diner</p>
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
                <span className="text-[#dc2626] text-sm font-bold tracking-widest uppercase">Our Team</span>
                <h2 className="font-['Fredoka_One'] text-4xl sm:text-5xl text-[#1e293b] mt-3 mb-4">
                  The Crew
                </h2>
                <p className="text-[#1e293b]/60 max-w-xl mx-auto">The folks serving up smiles</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                {store.staff.map((member, idx) => (
                  <div key={idx} className="text-center group">
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-white border-2 border-[#e2e8f0] group-hover:border-[#dc2626] transition-all duration-300 flex items-center justify-center shadow-sm">
                      <span className="font-['Fredoka_One'] text-3xl text-[#dc2626]">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-['Fredoka_One'] text-[#1e293b] mt-4 group-hover:text-[#dc2626] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-[#1e293b]/60 text-sm">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Opening Hours */}
        {store.opening_hours && (
          <section id="hours" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#e2e8f0]/30">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-12">
                <Clock size={24} className="mx-auto text-[#dc2626] mb-3" />
                <span className="text-[#dc2626] text-sm font-bold tracking-widest uppercase">Diner Hours</span>
                <h2 className="font-['Fredoka_One'] text-4xl text-[#1e293b] mt-3 mb-4">
                  Opening Hours
                </h2>
              </div>

              <div className="bg-white border-2 border-[#e2e8f0] rounded-2xl overflow-hidden">
                <div className="bg-[#dc2626] px-6 py-3">
                  <p className="text-white font-['Fredoka_One'] text-sm">Weekly Schedule</p>
                </div>
                <div className="divide-y divide-[#e2e8f0]">
                  {DAY_ORDER.map((day) => {
                    const hours = store.opening_hours![day]
                    return (
                      <div key={day} className="flex items-center justify-between px-6 py-4 hover:bg-[#f8f5f0] transition-colors">
                        <span className="text-[#1e293b] text-sm font-bold">{DAY_LABELS[day]}</span>
                        {hours ? (
                          <span className="text-[#dc2626] text-sm font-bold">
                            {hours.open} – {hours.close}
                          </span>
                        ) : (
                          <span className="text-[#1e293b]/50 text-sm italic">Closed</span>
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
              <span className="text-[#dc2626] text-sm font-bold tracking-widest uppercase">Reach Out</span>
              <h2 className="font-['Fredoka_One'] text-4xl sm:text-5xl text-[#1e293b] mt-3 mb-4">
                Get in Touch
              </h2>
              <p className="text-[#1e293b]/60 max-w-xl mx-auto">We would love to hear from you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {store.phone && (
                <a
                  href={`tel:${store.phone}`}
                  className="group bg-white border-2 border-[#e2e8f0] hover:border-[#dc2626]/40 p-8 text-center transition-all duration-300 rounded-2xl"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#dc2626]/10 group-hover:bg-[#dc2626]/20 flex items-center justify-center mb-5 transition-colors">
                    <Phone size={22} className="text-[#dc2626]" />
                  </div>
                  <h3 className="font-['Fredoka_One'] text-lg text-[#1e293b] mb-2">Phone</h3>
                  <p className="text-[#1e293b]/60 text-sm">{store.phone}</p>
                </a>
              )}
              {store.email && (
                <a
                  href={`mailto:${store.email}`}
                  className="group bg-white border-2 border-[#e2e8f0] hover:border-[#dc2626]/40 p-8 text-center transition-all duration-300 rounded-2xl"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#dc2626]/10 group-hover:bg-[#dc2626]/20 flex items-center justify-center mb-5 transition-colors">
                    <Mail size={22} className="text-[#dc2626]" />
                  </div>
                  <h3 className="font-['Fredoka_One'] text-lg text-[#1e293b] mb-2">Email</h3>
                  <p className="text-[#1e293b]/60 text-sm">{store.email}</p>
                </a>
              )}
              {store.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white border-2 border-[#e2e8f0] hover:border-[#dc2626]/40 p-8 text-center transition-all duration-300 rounded-2xl"
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-[#dc2626]/10 group-hover:bg-[#dc2626]/20 flex items-center justify-center mb-5 transition-colors">
                    <MapPin size={22} className="text-[#dc2626]" />
                  </div>
                  <h3 className="font-['Fredoka_One'] text-lg text-[#1e293b] mb-2">Address</h3>
                  <p className="text-[#1e293b]/60 text-sm">{store.address}</p>
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
                  <Pizza size={20} className="text-[#fcd34d]" />
                  {store.logo && (
                    <img
                      src={getImageUrl(store.logo) || ''}
                      alt={store.name}
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-[#fcd34d]/30"
                    />
                  )}
                  <span className="font-['Fredoka_One'] text-lg text-white">{store.name}</span>
                </div>
                <p className="text-[#94a3b8] text-sm leading-relaxed mb-6">
                  {store.description || 'Classic diner vibes since day one.'}
                </p>
                <SocialLinks links={store.social_links ?? []} />
              </div>

              <div>
                <h4 className="font-['Fredoka_One'] text-white text-lg mb-5">Quick Links</h4>
                <ul className="space-y-3">
                  {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-[#94a3b8] hover:text-[#fcd34d] text-sm transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-['Fredoka_One'] text-white text-lg mb-5">Support</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#94a3b8] hover:text-[#fcd34d] text-sm transition-colors">FAQ</a></li>
                  <li><a href="#" className="text-[#94a3b8] hover:text-[#fcd34d] text-sm transition-colors">Delivery Info</a></li>
                  <li><a href="#" className="text-[#94a3b8] hover:text-[#fcd34d] text-sm transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-[#94a3b8] hover:text-[#fcd34d] text-sm transition-colors">Terms of Service</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-['Fredoka_One'] text-white text-lg mb-5">Contact</h4>
                <ul className="space-y-3">
                  {store.phone && (
                    <li>
                      <a href={`tel:${store.phone}`} className="text-[#94a3b8] hover:text-[#fcd34d] text-sm transition-colors flex items-center gap-2">
                        <Phone size={14} /> {store.phone}
                      </a>
                    </li>
                  )}
                  {store.email && (
                    <li>
                      <a href={`mailto:${store.email}`} className="text-[#94a3b8] hover:text-[#fcd34d] text-sm transition-colors flex items-center gap-2">
                        <Mail size={14} /> {store.email}
                      </a>
                    </li>
                  )}
                  {store.address && (
                    <li className="flex items-start gap-2 text-[#94a3b8] text-sm">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span>{store.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#334155] bg-[#0f172a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[#94a3b8]/50 text-xs">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
              <p className="text-[#94a3b8]/50 text-xs">
                Keep on dinin
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
