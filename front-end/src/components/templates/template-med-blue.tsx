'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, Quote, Waves, Sun, Wind } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import { SocialLinks } from '@/components/templates/blocks/social-links'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface MedBlueProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const WHITE = '#FFFFFF'
const BLUE = '#1E90FF'
const DEEP_BLUE = '#003366'
const SANDY = '#F5DEB3'
const LIGHT_BLUE = '#E8F4FD'
const WARM_WHITE = '#FDFBF7'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

export function TemplateMedBlue({ store, themeColors, onAddToCart, onShopNow }: MedBlueProps) {
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
    servesCuisine: 'Greek, Mediterranean, Seafood',
    image: getImageUrl(store.cover_image || store.cover),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');
        :root { ${Object.entries(c).map(([k, v]) => `${k}: ${v};`).join('\n')} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-[#FDFBF7] text-[#003366] font-['Inter'] overflow-x-hidden">
        {/* ── Navbar ── */}
        <nav
          className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
            scrolled ? 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-sm shadow-[#1E90FF]/10' : 'bg-transparent'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                <Sun size={22} className="text-[#1E90FF]" />
                {store.logo && (
                  <img
                    src={getImageUrl(store.logo) || ''}
                    alt={store.name}
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-[#1E90FF]/30"
                  />
                )}
                <span className="font-['Lora'] italic text-xl text-[#003366]">
                  {store.name}
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-8">
                {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-[#5A8DBE] hover:text-[#1E90FF] transition-colors duration-300 font-medium"
                  >
                    {item}
                  </a>
                ))}
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="bg-[#1E90FF] text-white px-6 py-2.5 text-sm font-medium rounded-full hover:bg-[#0066CC] transition-all duration-300 shadow-md shadow-[#1E90FF]/20"
                  >
                    Opa! Order Now
                  </button>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-[#003366] p-2"
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
            <div className="bg-[#FDFBF7]/98 backdrop-blur-md border-t border-[#B0D4E8] px-4 py-6 space-y-4">
              {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm text-[#5A8DBE] hover:text-[#1E90FF] transition-colors"
                >
                  {item}
                </a>
              ))}
              {onShopNow && (
                <button
                  onClick={() => { setMenuOpen(false); onShopNow?.() }}
                  className="w-full bg-[#1E90FF] text-white px-6 py-3 text-sm font-medium rounded-full"
                >
                  Opa! Order Now
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {(store.cover_image || store.cover) ? (
            <div className="absolute inset-0">
              <img
                src={getImageUrl(store.cover_image || store.cover) || ''}
                alt={store.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7]/95 via-[#FDFBF7]/70 to-transparent" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#E8F4FD] via-[#FDFBF7] to-[#F5DEB3]" />
          )}

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Waves size={20} className="text-[#1E90FF]" />
                <span className="text-[#1E90FF] text-sm font-medium tracking-wider uppercase">Mediterranean Experience</span>
              </div>
              <h1 className="font-['Lora'] italic text-5xl sm:text-6xl md:text-7xl text-[#003366] leading-tight">
                {store.name}
              </h1>
              <div className="w-20 h-0.5 bg-[#1E90FF] my-6" />
              <p className="text-lg sm:text-xl text-[#5A8DBE] max-w-lg leading-relaxed">
                {store.description || 'Sun-kissed flavors from the Greek islands — fresh, vibrant, and made with love.'}
              </p>
              <div className="flex items-center gap-4 mt-10 flex-wrap">
                <button
                  onClick={onShopNow}
                  className="bg-[#1E90FF] text-white px-8 py-3.5 text-sm font-semibold rounded-full hover:bg-[#0066CC] transition-all duration-300 shadow-lg shadow-[#1E90FF]/20"
                >
                  Kalos Orisate!
                </button>
                <a
                  href="#menu"
                  className="border-2 border-[#1E90FF]/40 text-[#1E90FF] px-8 py-3.5 text-sm font-medium rounded-full hover:bg-[#E8F4FD] transition-all duration-300"
                >
                  View Menu
                </a>
              </div>
              {store.avg_rating > 0 && (
                <div className="flex items-center gap-3 mt-10 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-full border border-[#B0D4E8] max-w-fit">
                  <StarRating rating={store.avg_rating} size={18} activeColor="#1E90FF" inactiveColor="#B0D4E8" />
                  <span className="text-[#003366] text-sm font-semibold">{store.avg_rating.toFixed(1)}</span>
                  <span className="text-[#5A8DBE] text-sm">({store.reviews_count} reviews)</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Menu Section ── */}
        <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Waves size={24} className="mx-auto text-[#1E90FF] mb-3" />
            <span className="text-[#1E90FF] text-sm font-medium tracking-wider uppercase">Taverna Specials</span>
            <h2 className="font-['Lora'] italic text-4xl sm:text-5xl text-[#003366] mt-3 mb-4">
              Our Menu
            </h2>
            <div className="w-16 h-0.5 bg-[#1E90FF] mx-auto" />
          </div>

          {store.foods.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#B0D4E8] max-w-lg mx-auto">
              <Sun size={48} className="mx-auto text-[#1E90FF]/30 mb-4" />
              <p className="font-['Lora'] italic text-2xl text-[#003366] mb-2">Opa! Coming Soon</p>
              <p className="text-[#5A8DBE]">Our Mediterranean menu is being prepared.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.foods.map((food) => (
                <div
                  key={food.id}
                  className="group bg-white rounded-2xl border border-[#B0D4E8] hover:border-[#1E90FF]/40 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-[#1E90FF]/5"
                >
                  <div className="relative overflow-hidden aspect-[4/3] rounded-t-2xl">
                    {food.image ? (
                      <img
                        src={getImageUrl(food.image) ?? undefined}
                        alt={food.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#E8F4FD] flex items-center justify-center">
                        <Sun size={36} className="text-[#B0D4E8]" />
                      </div>
                    )}
                    {food.is_offer && (
                      <span className="absolute top-3 left-3 bg-[#1E90FF] text-white text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full font-semibold shadow-md">
                        Opa Special
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-['Lora'] italic text-lg font-semibold text-[#003366] group-hover:text-[#1E90FF] transition-colors">
                      {food.name}
                    </h3>
                    {food.description && (
                      <p className="text-[#5A8DBE] text-sm mt-2 line-clamp-2 leading-relaxed">
                        {food.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#B0D4E8]">
                      <span className="font-['Lora'] text-lg font-bold text-[#1E90FF]">
                        {formatFoodPrice(food, currency)}
                      </span>
                      {onAddToCart && (
                        <button
                          data-add-to-cart={food.id}
                          onClick={() => onAddToCart(food.id)}
                          className="bg-[#E8F4FD] text-[#1E90FF] px-4 py-2 text-xs font-semibold uppercase rounded-full hover:bg-[#1E90FF] hover:text-white transition-all duration-300"
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
        <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#E8F4FD]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#1E90FF] text-sm font-medium tracking-wider uppercase">Thavmases</span>
              <h2 className="font-['Lora'] italic text-4xl sm:text-5xl text-[#003366] mt-3 mb-4">
                Guest Reviews
              </h2>
              <div className="w-16 h-0.5 bg-[#1E90FF] mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.reviews.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-[#B0D4E8]">
                      <StarRating rating={5} size={16} activeColor="#1E90FF" inactiveColor="#B0D4E8" />
                      <Quote size={20} className="text-[#1E90FF]/20 mt-4 mb-3" />
                      <p className="text-[#5A8DBE] text-sm leading-relaxed mb-4 italic">
                        The taste of the Mediterranean! Every dish is like a vacation to a Greek island.
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#B0D4E8]">
                        <div className="w-10 h-10 rounded-full bg-[#E8F4FD] flex items-center justify-center">
                          <span className="text-[#1E90FF] text-sm font-semibold">G</span>
                        </div>
                        <div>
                          <p className="text-[#003366] text-sm font-medium">Guest</p>
                          <p className="text-[#5A8DBE] text-xs">Verified Diner</p>
                        </div>
                      </div>
                    </div>
                  ))
                : store.reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-2xl border border-[#B0D4E8] hover:border-[#1E90FF]/30 transition-all duration-300">
                      <StarRating rating={review.rating} size={16} activeColor="#1E90FF" inactiveColor="#B0D4E8" />
                      <Quote size={20} className="text-[#1E90FF]/20 mt-4 mb-3" />
                      <p className="text-[#5A8DBE] text-sm leading-relaxed mb-4 line-clamp-3 italic">
                        {review.comment || 'A wonderful Mediterranean experience!'}
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#B0D4E8]">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          {review.avatar ? (
                            <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#E8F4FD] flex items-center justify-center">
                              <span className="text-[#1E90FF] text-sm font-semibold">{review.user.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[#003366] text-sm font-medium">{review.user}</p>
                          <p className="text-[#5A8DBE] text-xs">Verified Diner</p>
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
              <span className="text-[#1E90FF] text-sm font-medium tracking-wider uppercase">I Omada</span>
              <h2 className="font-['Lora'] italic text-4xl sm:text-5xl text-[#003366] mt-3 mb-4">
                Meet the Team
              </h2>
              <div className="w-16 h-0.5 bg-[#1E90FF] mx-auto" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {store.staff.map((member, idx) => (
                <div key={idx} className="text-center group">
                  <div className="w-24 h-24 mx-auto rounded-full bg-white border-2 border-[#B0D4E8] group-hover:border-[#1E90FF] transition-all duration-300 flex items-center justify-center shadow-sm">
                    <span className="font-['Lora'] italic text-3xl font-bold text-[#1E90FF]">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-['Lora'] italic text-base font-semibold text-[#003366] mt-4 group-hover:text-[#1E90FF] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-[#5A8DBE] text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Opening Hours ── */}
        {store.opening_hours && (
          <section id="hours" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#E8F4FD]">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-12">
                <span className="text-[#1E90FF] text-sm font-medium tracking-wider uppercase">Ores</span>
                <h2 className="font-['Lora'] italic text-4xl text-[#003366] mt-3 mb-4">
                  Opening Hours
                </h2>
                <div className="w-16 h-0.5 bg-[#1E90FF] mx-auto" />
              </div>

              <div className="bg-white rounded-2xl overflow-hidden border border-[#B0D4E8]">
                <div className="bg-gradient-to-r from-[#1E90FF] to-[#0066CC] px-6 py-3">
                  <p className="text-white font-['Lora'] italic text-sm">Weekly Schedule</p>
                </div>
                <div className="divide-y divide-[#B0D4E8]">
                  {DAY_ORDER.map((day) => {
                    const hours = store.opening_hours![day]
                    return (
                      <div key={day} className="flex items-center justify-between px-6 py-4 hover:bg-[#E8F4FD] transition-colors">
                        <span className="text-[#003366] text-sm font-medium capitalize">{DAY_LABELS[day]}</span>
                        {hours ? (
                          <span className="text-[#1E90FF] text-sm font-semibold">
                            {hours.open} – {hours.close}
                          </span>
                        ) : (
                          <span className="text-[#5A8DBE] text-sm italic">Closed</span>
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
            <span className="text-[#1E90FF] text-sm font-medium tracking-wider uppercase">Epikoinonia</span>
            <h2 className="font-['Lora'] italic text-4xl sm:text-5xl text-[#003366] mt-3 mb-4">
              Get in Touch
            </h2>
            <div className="w-16 h-0.5 bg-[#1E90FF] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {store.phone && (
              <a
                href={`tel:${store.phone}`}
                className="group bg-white rounded-2xl border border-[#B0D4E8] hover:border-[#1E90FF]/40 p-8 text-center transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#E8F4FD] group-hover:bg-[#1E90FF]/10 flex items-center justify-center mb-5 transition-colors">
                  <Phone size={22} className="text-[#1E90FF]" />
                </div>
                <h3 className="font-['Lora'] italic text-lg font-semibold text-[#003366] mb-2">Phone</h3>
                <p className="text-[#5A8DBE] text-sm">{store.phone}</p>
              </a>
            )}
            {store.email && (
              <a
                href={`mailto:${store.email}`}
                className="group bg-white rounded-2xl border border-[#B0D4E8] hover:border-[#1E90FF]/40 p-8 text-center transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#E8F4FD] group-hover:bg-[#1E90FF]/10 flex items-center justify-center mb-5 transition-colors">
                  <Mail size={22} className="text-[#1E90FF]" />
                </div>
                <h3 className="font-['Lora'] italic text-lg font-semibold text-[#003366] mb-2">Email</h3>
                <p className="text-[#5A8DBE] text-sm">{store.email}</p>
              </a>
            )}
            {store.address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl border border-[#B0D4E8] hover:border-[#1E90FF]/40 p-8 text-center transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#E8F4FD] group-hover:bg-[#1E90FF]/10 flex items-center justify-center mb-5 transition-colors">
                  <MapPin size={22} className="text-[#1E90FF]" />
                </div>
                <h3 className="font-['Lora'] italic text-lg font-semibold text-[#003366] mb-2">Address</h3>
                <p className="text-[#5A8DBE] text-sm">{store.address}</p>
              </a>
            )}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-[#003366]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Waves size={22} className="text-[#1E90FF]" />
                  {store.logo && (
                    <img
                      src={getImageUrl(store.logo) || ''}
                      alt={store.name}
                      className="h-9 w-9 rounded-full object-cover ring-1 ring-[#1E90FF]/30"
                    />
                  )}
                  <span className="font-['Lora'] italic text-lg text-white">{store.name}</span>
                </div>
                <p className="text-[#87CEEB] text-sm leading-relaxed mb-6">
                  {store.description || 'Authentic Mediterranean cuisine served with sunshine and joy.'}
                </p>
                <SocialLinks links={store.social_links ?? []} />
              </div>

              <div>
                <h4 className="font-['Lora'] italic text-[#1E90FF] text-lg mb-5">Quick Links</h4>
                <ul className="space-y-3">
                  {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-[#87CEEB] hover:text-white text-sm transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-['Lora'] italic text-[#1E90FF] text-lg mb-5">Discover</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#87CEEB] hover:text-white text-sm transition-colors">Our Story</a></li>
                  <li><a href="#" className="text-[#87CEEB] hover:text-white text-sm transition-colors">Catering</a></li>
                  <li><a href="#" className="text-[#87CEEB] hover:text-white text-sm transition-colors">Private Events</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-['Lora'] italic text-[#1E90FF] text-lg mb-5">Contact</h4>
                <ul className="space-y-3">
                  {store.phone && (
                    <li>
                      <a href={`tel:${store.phone}`} className="text-[#87CEEB] hover:text-white text-sm transition-colors flex items-center gap-2">
                        <Phone size={14} /> {store.phone}
                      </a>
                    </li>
                  )}
                  {store.email && (
                    <li>
                      <a href={`mailto:${store.email}`} className="text-[#87CEEB] hover:text-white text-sm transition-colors flex items-center gap-2">
                        <Mail size={14} /> {store.email}
                      </a>
                    </li>
                  )}
                  {store.address && (
                    <li className="flex items-start gap-2 text-[#87CEEB] text-sm">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span>{store.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1E90FF]/20 bg-[#002244]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[#87CEEB]/50 text-xs">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
              <p className="text-[#87CEEB]/50 text-xs italic">
                Opa! — Yassou from all of us
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
