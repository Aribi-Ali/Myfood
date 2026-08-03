'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, ChevronRight, Quote, Wheat, Leaf, Soup } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import { SocialLinks } from '@/components/templates/blocks/social-links'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface RusticProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const RED = '#b91c1c'
const CREAM = '#fef9ef'
const DARK_TEXT = '#292524'
const GREEN = '#15803d'
const YELLOW = '#fbbf24'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

export default function RusticTemplate({ store, themeColors, onAddToCart, onShopNow }: RusticProps) {
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
    servesCuisine: 'Farmhouse, Rustic',
    image: getImageUrl(store.cover_image || store.cover),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
        :root { ${Object.entries(c).map(([k, v]) => `${k}: ${v};`).join('\n')} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .gingham-bg {
          background-image: repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(185,28,28,0.03) 4px, rgba(185,28,28,0.03) 8px),
                            repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(185,28,28,0.03) 4px, rgba(185,28,28,0.03) 8px);
        }
      `}</style>

      <div className="min-h-screen bg-[#fef9ef] text-[#292524] font-['Inter'] overflow-x-hidden">
        {/* ── Announcement Bar ── */}
        <div className="bg-[#b91c1c] text-[#fef9ef] text-center py-2 px-4 text-xs tracking-wider uppercase font-medium">
          <span className="inline-block animate-pulse">✦</span> Fresh from the farm — order now for same-day delivery! <span className="inline-block animate-pulse">✦</span>
        </div>

        {/* ── Navbar ── */}
        <nav
          className={cn(
            'sticky top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-[#e7e5e4]',
            'bg-[#fef9ef]'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                <Wheat size={22} className="text-[#b91c1c]" />
                {store.logo && (
                  <img
                    src={getImageUrl(store.logo) || ''}
                    alt={store.name}
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-[#b91c1c]/30"
                  />
                )}
                <span className="font-['DM_Serif_Display'] text-xl text-[#292524]">
                  {store.name}
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-8">
                {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-[#292524]/70 hover:text-[#b91c1c] transition-colors duration-300 font-medium"
                  >
                    {item}
                  </a>
                ))}
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="bg-[#b91c1c] text-[#fef9ef] px-6 py-2.5 text-sm font-semibold hover:bg-[#991b1b] transition-colors duration-300"
                  >
                    Order Now
                  </button>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-[#292524] p-2"
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
            <div className="bg-[#fef9ef] border-t border-[#e7e5e4] px-4 py-6 space-y-4">
              {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm text-[#292524]/70 hover:text-[#b91c1c] transition-colors"
                >
                  {item}
                </a>
              ))}
              {onShopNow && (
                <button
                  onClick={() => { setMenuOpen(false); onShopNow?.() }}
                  className="w-full bg-[#b91c1c] text-[#fef9ef] px-6 py-3 text-sm font-semibold"
                >
                  Order Now
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {(store.cover_image || store.cover) && (
            <div
              className="absolute inset-0 bg-cover bg-center scale-105"
              style={{ backgroundImage: `url(${getImageUrl(store.cover_image || store.cover)})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#292524]/70 via-[#b91c1c]/50 to-[#292524]/80" />
          <div className="absolute inset-0 gingham-bg opacity-30" />

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <Leaf size={32} className="mx-auto text-[#fbbf24] mb-4" />
            <h1 className="font-['DM_Serif_Display'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#fef9ef] leading-tight">
              {store.name}
            </h1>
            <div className="w-24 h-1 bg-[#fbbf24] mx-auto my-6" />
            <p className="font-['DM_Serif_Display'] italic text-lg sm:text-xl md:text-2xl text-[#fef9ef]/80 max-w-2xl mx-auto leading-relaxed">
              {store.description || 'Hearty farmhouse fare made with love from our family to yours'}
            </p>
            <div className="flex items-center justify-center gap-4 mt-10 flex-wrap">
              <button
                onClick={onShopNow}
                className="bg-[#b91c1c] text-[#fef9ef] px-8 py-3.5 text-sm tracking-wide font-semibold hover:bg-[#991b1b] transition-all duration-300 border-2 border-[#b91c1c]"
              >
                Order Farm Fresh
              </button>
              <a
                href="#menu"
                className="border-2 border-[#fef9ef]/60 text-[#fef9ef] px-8 py-3.5 text-sm tracking-wide font-medium hover:bg-[#fef9ef]/10 transition-all duration-300"
              >
                See the Menu
              </a>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronRight size={24} className="text-[#fbbf24]/60 -rotate-90" />
          </div>
        </section>

        {/* ── Foods Section (Farmhouse Fare) ── */}
        <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Soup size={24} className="mx-auto text-[#b91c1c] mb-3" />
              <span className="text-[#b91c1c] text-sm tracking-widest uppercase font-semibold">Farmhouse Fare</span>
              <h2 className="font-['DM_Serif_Display'] text-4xl sm:text-5xl text-[#292524] mt-3 mb-4">
                From Our Kitchen
              </h2>
              <p className="text-[#292524]/60 max-w-xl mx-auto">Honest food made with farm-fresh ingredients</p>
            </div>

            {store.foods.length === 0 ? (
              <div className="text-center py-20 bg-[#fef9ef] border-2 border-[#b91c1c]/20 max-w-lg mx-auto gingham-bg">
                <Soup size={48} className="mx-auto text-[#b91c1c]/30 mb-4" />
                <p className="font-['DM_Serif_Display'] text-2xl text-[#292524] mb-2">Farmhouse Fare</p>
                <p className="text-[#292524]/60 italic">Our kitchen is preparing something special. Come back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.foods.map((food) => (
                  <div
                    key={food.id}
                    className="group bg-[#fef9ef] border-t-4 border-t-[#b91c1c] border border-[#e7e5e4] hover:border-[#b91c1c]/30 transition-all duration-500 overflow-hidden gingham-bg"
                  >
                    <div className="relative overflow-hidden aspect-[4/3]">
                      {food.image ? (
                        <img
                          src={getImageUrl(food.image) ?? undefined}
                          alt={food.name}
                          className="w-full h-full object-cover transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#fef9ef] flex items-center justify-center">
                          <Wheat size={32} className="text-[#e7e5e4]" />
                        </div>
                      )}
                      {food.is_offer && (
                        <span className="absolute top-3 left-3 bg-[#15803d] text-white text-[10px] tracking-widest uppercase px-3 py-1 font-semibold">
                          Farm Fresh
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-['DM_Serif_Display'] text-lg text-[#292524] group-hover:text-[#b91c1c] transition-colors">
                        {food.name}
                      </h3>
                      {food.description && (
                        <p className="text-[#292524]/60 text-sm mt-1.5 line-clamp-2 leading-relaxed">
                          {food.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#e7e5e4]">
                        <span className="font-['DM_Serif_Display'] text-lg text-[#b91c1c]">
                          {formatFoodPrice(food, currency)}
                        </span>
                        {onAddToCart && (
                          <button
                            data-add-to-cart={food.id}
                            onClick={() => onAddToCart(food.id)}
                            className="bg-[#b91c1c]/10 text-[#b91c1c] px-4 py-2 text-xs font-semibold uppercase hover:bg-[#b91c1c] hover:text-[#fef9ef] transition-all duration-300"
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
        <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#e7e5e4]/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#b91c1c] text-sm tracking-widest uppercase font-semibold">Testimonials</span>
              <h2 className="font-['DM_Serif_Display'] text-4xl sm:text-5xl text-[#292524] mt-3 mb-4">
                What Folks Say
              </h2>
              <p className="text-[#292524]/60 max-w-xl mx-auto">Words from our farmhouse family</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {store.reviews.length === 0
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-[#fef9ef] p-6 border border-[#e7e5e4] border-l-4 border-l-[#b91c1c]">
                      <StarRating rating={5} size={16} activeColor="#b91c1c" inactiveColor="#e7e5e4" />
                      <Quote size={20} className="text-[#b91c1c]/20 mt-4 mb-3" />
                      <p className="text-[#292524]/70 text-sm leading-relaxed mb-4 italic">
                        The most comforting farm-to-table experience. Every dish tastes like home.
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#e7e5e4]">
                        <div className="w-10 h-10 rounded-full bg-[#b91c1c]/10 flex items-center justify-center">
                          <span className="text-[#b91c1c] text-sm font-semibold">G</span>
                        </div>
                        <div>
                          <p className="text-[#292524] text-sm font-medium">Guest</p>
                          <p className="text-[#292524]/50 text-xs">Verified Diner</p>
                        </div>
                      </div>
                    </div>
                  ))
                : store.reviews.map((review) => (
                    <div key={review.id} className="bg-[#fef9ef] p-6 border border-[#e7e5e4] border-l-4 border-l-[#b91c1c] hover:border-l-[#991b1b] transition-all duration-300">
                      <StarRating rating={review.rating} size={16} activeColor="#b91c1c" inactiveColor="#e7e5e4" />
                      <Quote size={20} className="text-[#b91c1c]/20 mt-4 mb-3" />
                      <p className="text-[#292524]/70 text-sm leading-relaxed mb-4 line-clamp-4 italic">
                        {review.comment || 'Hearty and delicious farmhouse cooking.'}
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#e7e5e4]">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          {review.avatar ? (
                            <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#b91c1c]/10 flex items-center justify-center">
                              <span className="text-[#b91c1c] text-sm font-semibold">{review.user.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[#292524] text-sm font-medium">{review.user}</p>
                          <p className="text-[#292524]/50 text-xs">Verified Diner</p>
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
              <span className="text-[#b91c1c] text-sm tracking-widest uppercase font-semibold">Our People</span>
              <h2 className="font-['DM_Serif_Display'] text-4xl sm:text-5xl text-[#292524] mt-3 mb-4">
                The Farm Team
              </h2>
              <p className="text-[#292524]/60 max-w-xl mx-auto">The hands that prepare your meal</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {store.staff.map((member, idx) => (
                <div key={idx} className="text-center group">
                  <div className="w-24 h-24 mx-auto rounded-full border-2 border-[#b91c1c]/30 group-hover:border-[#b91c1c] transition-all duration-300 overflow-hidden">
                    <div className="w-full h-full bg-[#fef9ef] flex items-center justify-center">
                      <span className="font-['DM_Serif_Display'] text-3xl text-[#b91c1c]">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-[#292524] font-semibold mt-4 group-hover:text-[#b91c1c] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-[#292524]/60 text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Opening Hours ── */}
        {store.opening_hours && (
          <section id="hours" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#e7e5e4]/30">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-12">
                <Clock size={24} className="mx-auto text-[#b91c1c] mb-3" />
                <span className="text-[#b91c1c] text-sm tracking-widest uppercase font-semibold">Farm Hours</span>
                <h2 className="font-['DM_Serif_Display'] text-4xl text-[#292524] mt-3 mb-4">
                  Opening Hours
                </h2>
              </div>

              <div className="bg-[#fef9ef] border border-[#e7e5e4] divide-y divide-[#e7e5e4]">
                {DAY_ORDER.map((day) => {
                  const hours = store.opening_hours![day]
                  return (
                    <div key={day} className="flex items-center justify-between px-6 py-4 hover:bg-[#b91c1c]/5 transition-colors">
                      <span className="text-[#292524] text-sm font-medium">{DAY_LABELS[day]}</span>
                      {hours ? (
                        <span className="text-[#b91c1c] text-sm font-semibold">
                          {hours.open} – {hours.close}
                        </span>
                      ) : (
                        <span className="text-[#292524]/50 text-sm italic">Closed</span>
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
            <span className="text-[#b91c1c] text-sm tracking-widest uppercase font-semibold">Reach Out</span>
            <h2 className="font-['DM_Serif_Display'] text-4xl sm:text-5xl text-[#292524] mt-3 mb-4">
              Get in Touch
            </h2>
            <p className="text-[#292524]/60 max-w-xl mx-auto">We would love to hear from our farm family</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {store.phone && (
              <a
                href={`tel:${store.phone}`}
                className="group bg-[#fef9ef] border border-[#e7e5e4] hover:border-[#b91c1c]/40 p-8 text-center transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#b91c1c]/10 group-hover:bg-[#b91c1c]/20 flex items-center justify-center mb-5 transition-colors">
                  <Phone size={22} className="text-[#b91c1c]" />
                </div>
                <h3 className="font-['DM_Serif_Display'] text-lg text-[#292524] mb-2">Phone</h3>
                <p className="text-[#292524]/60 text-sm">{store.phone}</p>
              </a>
            )}
            {store.email && (
              <a
                href={`mailto:${store.email}`}
                className="group bg-[#fef9ef] border border-[#e7e5e4] hover:border-[#b91c1c]/40 p-8 text-center transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#b91c1c]/10 group-hover:bg-[#b91c1c]/20 flex items-center justify-center mb-5 transition-colors">
                  <Mail size={22} className="text-[#b91c1c]" />
                </div>
                <h3 className="font-['DM_Serif_Display'] text-lg text-[#292524] mb-2">Email</h3>
                <p className="text-[#292524]/60 text-sm">{store.email}</p>
              </a>
            )}
            {store.address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#fef9ef] border border-[#e7e5e4] hover:border-[#b91c1c]/40 p-8 text-center transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#b91c1c]/10 group-hover:bg-[#b91c1c]/20 flex items-center justify-center mb-5 transition-colors">
                  <MapPin size={22} className="text-[#b91c1c]" />
                </div>
                <h3 className="font-['DM_Serif_Display'] text-lg text-[#292524] mb-2">Address</h3>
                <p className="text-[#292524]/60 text-sm">{store.address}</p>
              </a>
            )}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-[#292524]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Wheat size={20} className="text-[#fbbf24]" />
                  {store.logo && (
                    <img
                      src={getImageUrl(store.logo) || ''}
                      alt={store.name}
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-[#fbbf24]/30"
                    />
                  )}
                  <span className="font-['DM_Serif_Display'] text-lg text-[#fef9ef]">{store.name}</span>
                </div>
                <p className="text-[#a8a29e] text-sm leading-relaxed mb-6">
                  {store.description || 'Hearty farmhouse fare made from scratch with love.'}
                </p>
                <SocialLinks links={store.social_links ?? []} />
              </div>

              <div>
                <h4 className="font-['DM_Serif_Display'] text-[#fef9ef] text-lg mb-5">Quick Links</h4>
                <ul className="space-y-3">
                  {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-[#a8a29e] hover:text-[#fbbf24] text-sm transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-['DM_Serif_Display'] text-[#fef9ef] text-lg mb-5">Support</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#a8a29e] hover:text-[#fbbf24] text-sm transition-colors">FAQ</a></li>
                  <li><a href="#" className="text-[#a8a29e] hover:text-[#fbbf24] text-sm transition-colors">Delivery Info</a></li>
                  <li><a href="#" className="text-[#a8a29e] hover:text-[#fbbf24] text-sm transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-[#a8a29e] hover:text-[#fbbf24] text-sm transition-colors">Terms of Service</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-['DM_Serif_Display'] text-[#fef9ef] text-lg mb-5">Contact</h4>
                <ul className="space-y-3">
                  {store.phone && (
                    <li>
                      <a href={`tel:${store.phone}`} className="text-[#a8a29e] hover:text-[#fbbf24] text-sm transition-colors flex items-center gap-2">
                        <Phone size={14} /> {store.phone}
                      </a>
                    </li>
                  )}
                  {store.email && (
                    <li>
                      <a href={`mailto:${store.email}`} className="text-[#a8a29e] hover:text-[#fbbf24] text-sm transition-colors flex items-center gap-2">
                        <Mail size={14} /> {store.email}
                      </a>
                    </li>
                  )}
                  {store.address && (
                    <li className="flex items-start gap-2 text-[#a8a29e] text-sm">
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
              <p className="text-[#a8a29e]/50 text-xs">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
              <p className="text-[#a8a29e]/50 text-xs">
                From our farm to your table
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
