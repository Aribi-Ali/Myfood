'use client'

import { useState, useEffect, useRef } from 'react'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, ChevronRight, Quote, Award, Sparkles } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface AmberGlowProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const AMBER = '#d97706'
const CREAM = '#fffbf0'
const YELLOW = '#fbbf24'
const CORAL = '#ea580c'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

export function AmberGlowTemplate({ store, themeColors, onAddToCart, onShopNow }: AmberGlowProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const tickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const { currency } = useCurrency()

  const c = { ...themeColors } as Record<string, string>
  const primary = c['--primary'] || AMBER
  const bg = c['--bg'] || CREAM
  const accentColor = c['--accent'] || YELLOW
  const secondaryColor = c['--secondary'] || CORAL

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
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap');
        :root { ${Object.entries(c).map(([k, v]) => `${k}: ${v};`).join('\n')} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .glow-shadow { box-shadow: 0 0 30px rgba(217, 119, 6, 0.15), 0 0 60px rgba(217, 119, 6, 0.05); }
        .text-glow { text-shadow: 0 0 40px rgba(217, 119, 6, 0.3), 0 0 80px rgba(217, 119, 6, 0.1); }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker { animation: ticker 30s linear infinite; }
        .animate-ticker:hover { animation-play-state: paused; }
      `}</style>

      <div className="min-h-screen bg-[#fffbf0] text-[#1a1a2e] font-['Inter'] overflow-x-hidden">
        {/* ── Announcement Bar ── */}
        {store.badges.length > 0 && (
          <div className="bg-gradient-to-r from-[#d97706] via-[#fbbf24] to-[#ea580c] py-2 overflow-hidden relative">
            <div className="flex animate-ticker whitespace-nowrap" ref={tickerRef}>
              {[...Array(4)].flatMap(() => store.badges).map((badge, idx) => (
                <span key={idx} className="inline-flex items-center gap-2 mx-8 text-[#1a1a2e] text-sm font-medium">
                  <Award size={14} className="shrink-0" />
                  {badge.name}
                  <Sparkles size={12} className="shrink-0 opacity-60" />
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Navbar ── */}
        <nav
          className={cn(
            'sticky top-0 z-50 transition-all duration-300',
            scrolled
              ? 'bg-white/70 backdrop-blur-xl border-b border-[#d97706]/10'
              : store.badges.length > 0 ? 'bg-white/40 backdrop-blur-md' : 'bg-white/40 backdrop-blur-md'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              <div className="flex items-center gap-3">
                {store.logo && (
                  <img
                    src={getImageUrl(store.logo) || ''}
                    alt={store.name}
                    className="h-9 w-9 rounded-xl object-cover ring-2 ring-[#d97706]/20"
                  />
                )}
                <span className="font-['DM_Serif_Display'] text-xl text-[#1a1a2e] tracking-tight">
                  {store.name}
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-8">
                {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-[#6b7280] hover:text-[#d97706] transition-colors duration-200 font-medium"
                  >
                    {item}
                  </a>
                ))}
                {onAddToCart && (
                  <button
                    onClick={() => {
                      const firstFood = store.foods[0]
                      if (firstFood) onAddToCart(firstFood.id)
                    }}
                    className="relative bg-[#d97706] text-white p-2.5 rounded-full hover:bg-[#b85d04] transition-all duration-300 glow-shadow"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart size={18} />
                  </button>
                )}
                <button
                  onClick={onShopNow}
                  className="bg-gradient-to-r from-[#d97706] to-[#ea580c] text-white px-7 py-2.5 text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-[#d97706]/30 transition-all duration-300"
                >
                  Order Now
                </button>
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-[#1a1a2e] p-2"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={cn(
              'lg:hidden overflow-hidden transition-all duration-300',
              menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="bg-white/90 backdrop-blur-xl border-t border-[#d97706]/10 px-4 py-6 space-y-3">
              {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm text-[#6b7280] hover:text-[#d97706] transition-colors font-medium"
                >
                  {item}
                </a>
              ))}
              <button
                onClick={() => { setMenuOpen(false); onShopNow?.() }}
                className="w-full bg-gradient-to-r from-[#d97706] to-[#ea580c] text-white px-6 py-3 text-sm font-semibold rounded-full"
              >
                Order Now
              </button>
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#fbbf24]/30 via-[#d97706]/20 to-[#ea580c]/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(217,119,6,0.15),_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(234,88,12,0.1),_transparent_50%)]" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-44">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm text-[#d97706] text-xs tracking-widest uppercase px-4 py-2 rounded-full font-semibold mb-6 border border-[#d97706]/20">
                <Sparkles size={12} />
                Welcome to {store.name}
              </span>
              <h1 className="font-['DM_Serif_Display'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#1a1a2e] leading-tight mb-6 text-glow">
                {store.name}
              </h1>
              <p className="text-lg sm:text-xl text-[#6b7280] max-w-xl mx-auto leading-relaxed">
                {store.description || 'Where every sunset brings a new flavor to discover.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
                <button
                  onClick={onShopNow}
                  className="bg-gradient-to-r from-[#d97706] to-[#ea580c] text-white px-10 py-4 text-sm font-semibold rounded-full hover:shadow-xl hover:shadow-[#d97706]/25 transition-all duration-300"
                >
                  Explore Sunset Menu
                </button>
                {store.phone && (
                  <a
                    href={`tel:${store.phone}`}
                    className="bg-white/60 backdrop-blur-sm text-[#d97706] px-10 py-4 text-sm font-semibold rounded-full border border-[#d97706]/20 hover:bg-white hover:shadow-lg transition-all duration-300"
                  >
                    Call Us
                  </a>
                )}
              </div>

              {store.avg_rating > 0 && (
                <div className="flex items-center justify-center gap-3 mt-10 text-sm text-[#6b7280]">
                  <StarRating rating={store.avg_rating} size={18} activeColor="#fbbf24" inactiveColor="#e8d5b0" />
                  <span className="font-semibold text-[#1a1a2e]">{store.avg_rating.toFixed(1)}</span>
                  <span className="text-[#9ca3af]">({store.reviews_count} reviews)</span>
                </div>
              )}
            </div>
          </div>

          {/* Decorative wave */}
          <div className="relative z-10 -mb-1">
            <svg viewBox="0 0 1440 60" className="w-full fill-[#fffbf0]">
              <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
            </svg>
          </div>
        </section>

        {/* ── Foods Section ── */}
        <section id="menu" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-[#d97706]/10 text-[#d97706] text-xs tracking-widest uppercase px-4 py-1.5 rounded-full font-semibold mb-4">
              Our Selection
            </span>
            <h2 className="font-['DM_Serif_Display'] text-4xl sm:text-5xl text-[#1a1a2e]">
              Sunset Menu
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#d97706] to-[#ea580c] rounded-full mx-auto mt-4" />
          </div>

          {store.foods.length === 0 ? (
            <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-[#d97706]/10">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#fbbf24]/20 to-[#ea580c]/20 flex items-center justify-center mb-5">
                <Clock size={36} className="text-[#d97706]" />
              </div>
              <p className="font-['DM_Serif_Display'] text-2xl text-[#1a1a2e] mb-2">Golden hour approaching</p>
              <p className="text-[#6b7280]">Our sunset menu is being prepared. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {store.foods.map((food) => (
                <div
                  key={food.id}
                  className="group bg-white/60 backdrop-blur-md rounded-2xl overflow-hidden border border-white/50 hover:border-[#d97706]/20 transition-all duration-500 hover:shadow-xl hover:shadow-[#d97706]/5"
                >
                  <div className="relative overflow-hidden aspect-[4/3] rounded-t-2xl">
                    {food.image ? (
                      <img
                        src={getImageUrl(food.image) ?? undefined}
                        alt={food.name}
                        className="w-full h-full object-cover transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#fbbf24]/10 to-[#ea580c]/10 flex items-center justify-center">
                        <span className="text-4xl opacity-40">🌅</span>
                      </div>
                    )}
                    {food.is_offer && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-[#d97706] to-[#ea580c] text-white text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-full font-semibold">
                        Sunset Deal
                      </span>
                    )}
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-['DM_Serif_Display'] text-xl text-[#1a1a2e] group-hover:text-[#d97706] transition-colors">
                        {food.name}
                      </h3>
                      {food.cooking_time && (
                        <span className="flex items-center gap-1 text-[#9ca3af] text-xs shrink-0 mt-1">
                          <Clock size={12} />
                          {food.cooking_time} min
                        </span>
                      )}
                    </div>
                    {food.description && (
                      <p className="text-[#6b7280] text-sm mt-2 line-clamp-2 leading-relaxed">
                        {food.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#d97706]/10">
                      <div>
                        <span className="font-['DM_Serif_Display'] text-xl text-[#d97706]">
                          {formatFoodPrice(food, currency)}
                        </span>
                      </div>
                      {onAddToCart && (
                        <button
                          data-add-to-cart={food.id}
                          onClick={() => onAddToCart(food.id)}
                          className="flex items-center gap-2 bg-gradient-to-r from-[#d97706] to-[#ea580c] text-white px-5 py-2.5 text-xs font-semibold rounded-full hover:shadow-lg hover:shadow-[#d97706]/25 transition-all duration-300"
                        >
                          <ShoppingCart size={14} />
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
        <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-[#d97706]/5 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block bg-[#d97706]/10 text-[#d97706] text-xs tracking-widest uppercase px-4 py-1.5 rounded-full font-semibold mb-4">
                Testimonials
              </span>
              <h2 className="font-['DM_Serif_Display'] text-4xl sm:text-5xl text-[#1a1a2e]">
                Golden Words
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#d97706] to-[#ea580c] rounded-full mx-auto mt-4" />
            </div>

            {store.reviews.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border-l-4 border-[#d97706] shadow-sm">
                    <StarRating rating={5} size={16} activeColor="#fbbf24" inactiveColor="#e8d5b0" />
                    <Quote size={24} className="text-[#d97706]/20 mt-3 mb-3" />
                    <p className="text-[#6b7280] italic text-sm leading-relaxed mb-4">
                      A warm and inviting atmosphere with flavors that dance on your palate.
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-[#d97706]/10">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fbbf24]/20 to-[#ea580c]/20 flex items-center justify-center">
                        <span className="text-[#d97706] text-sm font-semibold">G</span>
                      </div>
                      <div>
                        <p className="text-[#1a1a2e] text-sm font-medium">Golden Guest</p>
                        <p className="text-[#9ca3af] text-xs">Sunset Regular</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {store.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-2xl p-6 border-l-4 border-transparent hover:border-[#d97706] shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <StarRating rating={review.rating} size={16} activeColor="#fbbf24" inactiveColor="#e8d5b0" />
                    <Quote size={24} className="text-[#d97706]/20 mt-3 mb-3" />
                    <p className="text-[#6b7280] italic text-sm leading-relaxed line-clamp-4 mb-4">
                      {review.comment || 'An absolutely golden experience.'}
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-[#d97706]/10">
                      <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#d97706]/20 shrink-0">
                        {review.avatar ? (
                          <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#fbbf24]/20 to-[#ea580c]/20 flex items-center justify-center">
                            <span className="text-[#d97706] text-sm font-semibold">{review.user.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-[#1a1a2e] text-sm font-medium">{review.user}</p>
                        <p className="text-[#9ca3af] text-xs">Verified Diner</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Staff Section ── */}
        <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-[#d97706]/10 text-[#d97706] text-xs tracking-widest uppercase px-4 py-1.5 rounded-full font-semibold mb-4">
              Our People
            </span>
            <h2 className="font-['DM_Serif_Display'] text-4xl sm:text-5xl text-[#1a1a2e]">
              The Crew
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#d97706] to-[#ea580c] rounded-full mx-auto mt-4" />
          </div>

          {store.staff.length === 0 ? (
            <div className="text-center py-12 bg-white/40 backdrop-blur-sm rounded-3xl border border-[#d97706]/10 max-w-md mx-auto">
              <p className="text-[#6b7280]">Meet our team soon.</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {store.staff.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-[#d97706]/10 rounded-full px-5 py-3 hover:border-[#d97706]/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fbbf24]/30 to-[#ea580c]/30 flex items-center justify-center shrink-0">
                    <span className="text-[#d97706] text-sm font-bold">{member.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-[#1a1a2e] text-sm font-medium">{member.name}</p>
                    <p className="text-[#6b7280] text-xs">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Opening Hours ── */}
        {store.opening_hours && (
          <section id="hours" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <span className="inline-block bg-[#d97706]/10 text-[#d97706] text-xs tracking-widest uppercase px-4 py-1.5 rounded-full font-semibold mb-4">
                  Schedule
                </span>
                <h2 className="font-['DM_Serif_Display'] text-4xl text-[#1a1a2e]">
                  Café Hours
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-[#d97706] to-[#ea580c] rounded-full mx-auto mt-4" />
              </div>

              <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm overflow-hidden divide-y divide-[#d97706]/10">
                {DAY_ORDER.map((day) => {
                  const hours = store.opening_hours![day]
                  const isWeekend = day === 'saturday' || day === 'sunday'
                  return (
                    <div
                      key={day}
                      className={cn(
                        'flex items-center justify-between px-6 py-4 transition-colors',
                        isWeekend ? 'bg-[#fbbf24]/5' : ''
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          'w-2 h-2 rounded-full',
                          hours ? 'bg-[#d97706]' : 'bg-[#d1d5db]'
                        )} />
                        <span className={cn(
                          'text-sm font-medium',
                          isWeekend ? 'text-[#d97706]' : 'text-[#1a1a2e]'
                        )}>
                          {DAY_LABELS[day]}
                        </span>
                      </div>
                      {hours ? (
                        <span className="text-sm text-[#6b7280] font-medium">
                          {hours.open} – {hours.close}
                        </span>
                      ) : (
                        <span className="text-sm text-[#9ca3af] italic">Closed</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Contact Section ── */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-[#d97706]/5 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block bg-[#d97706]/10 text-[#d97706] text-xs tracking-widest uppercase px-4 py-1.5 rounded-full font-semibold mb-4">
                Connect
              </span>
              <h2 className="font-['DM_Serif_Display'] text-4xl sm:text-5xl text-[#1a1a2e]">
                Reach Us
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#d97706] to-[#ea580c] rounded-full mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {store.phone && (
                <a
                  href={`tel:${store.phone}`}
                  className="group bg-white/60 backdrop-blur-md rounded-2xl p-8 text-center border border-white/50 hover:border-[#d97706]/30 hover:shadow-lg hover:shadow-[#d97706]/5 transition-all duration-300"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#fbbf24]/20 to-[#ea580c]/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Phone size={24} className="text-[#d97706]" />
                  </div>
                  <h3 className="font-['DM_Serif_Display'] text-lg text-[#1a1a2e] mb-2">Phone</h3>
                  <p className="text-[#6b7280] text-sm">{store.phone}</p>
                </a>
              )}
              {store.email && (
                <a
                  href={`mailto:${store.email}`}
                  className="group bg-white/60 backdrop-blur-md rounded-2xl p-8 text-center border border-white/50 hover:border-[#d97706]/30 hover:shadow-lg hover:shadow-[#d97706]/5 transition-all duration-300"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#fbbf24]/20 to-[#ea580c]/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Mail size={24} className="text-[#d97706]" />
                  </div>
                  <h3 className="font-['DM_Serif_Display'] text-lg text-[#1a1a2e] mb-2">Email</h3>
                  <p className="text-[#6b7280] text-sm">{store.email}</p>
                </a>
              )}
              {store.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white/60 backdrop-blur-md rounded-2xl p-8 text-center border border-white/50 hover:border-[#d97706]/30 hover:shadow-lg hover:shadow-[#d97706]/5 transition-all duration-300"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#fbbf24]/20 to-[#ea580c]/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <MapPin size={24} className="text-[#d97706]" />
                  </div>
                  <h3 className="font-['DM_Serif_Display'] text-lg text-[#1a1a2e] mb-2">Address</h3>
                  <p className="text-[#6b7280] text-sm">{store.address}</p>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-gradient-to-b from-[#fffbf0] to-[#fef3c7] border-t border-[#d97706]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {store.logo && (
                    <img src={getImageUrl(store.logo) || ''} alt={store.name} className="h-10 w-10 rounded-xl object-cover ring-2 ring-[#d97706]/20" />
                  )}
                  <span className="font-['DM_Serif_Display'] text-lg text-[#1a1a2e]">{store.name}</span>
                </div>
                <p className="text-[#6b7280] text-sm leading-relaxed">
                  {store.description || 'Bringing warmth and flavor to every plate.'}
                </p>
              </div>

              <div>
                <h4 className="font-['DM_Serif_Display'] text-[#1a1a2e] text-lg mb-5">Quick Links</h4>
                <ul className="space-y-3">
                  {['Menu', 'Reviews', 'Team', 'Hours'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-[#6b7280] hover:text-[#d97706] text-sm transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-['DM_Serif_Display'] text-[#1a1a2e] text-lg mb-5">Support</h4>
                <ul className="space-y-3 text-sm text-[#6b7280]">
                  <li><a href="#" className="hover:text-[#d97706] transition-colors">FAQ</a></li>
                  <li><a href="#" className="hover:text-[#d97706] transition-colors">Delivery</a></li>
                  <li><a href="#" className="hover:text-[#d97706] transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-[#d97706] transition-colors">Terms</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-['DM_Serif_Display'] text-[#1a1a2e] text-lg mb-5">Connect</h4>
                <ul className="space-y-3 text-sm text-[#6b7280]">
                  {store.phone && (
                    <li>
                      <a href={`tel:${store.phone}`} className="hover:text-[#d97706] transition-colors flex items-center gap-2">
                        <Phone size={14} /> {store.phone}
                      </a>
                    </li>
                  )}
                  {store.email && (
                    <li>
                      <a href={`mailto:${store.email}`} className="hover:text-[#d97706] transition-colors flex items-center gap-2">
                        <Mail size={14} /> Email
                      </a>
                    </li>
                  )}
                  {store.address && (
                    <li className="flex items-start gap-2">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span>{store.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#d97706]/10 py-6 px-4">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-[#9ca3af] text-xs">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
