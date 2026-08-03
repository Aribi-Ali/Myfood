'use client'

import { useState, useEffect, useRef } from 'react'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface JadeGardenProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const GREEN = '#2d8a4e'
const PAPER = '#f5f0e8'
const DARK = '#2c3e2d'
const AMBER = '#e8c87a'

const NAV_ITEMS = [
  { id: 'menu', label: 'Menu', icon: '🍃' },
  { id: 'reviews', label: 'Stories', icon: '✧' },
  { id: 'team', label: 'Team', icon: '✦' },
  { id: 'hours', label: 'Hours', icon: '◈' },
  { id: 'contact', label: 'Contact', icon: '♢' },
]

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

export function JadeGardenTemplate({ store, themeColors, onAddToCart, onShopNow }: JadeGardenProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('menu')
  const reviewsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map(n => document.getElementById(n.id))
      const scrollPos = window.scrollY + 150
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i]
        if (el && el.offsetTop <= scrollPos) {
          const item = NAV_ITEMS[i]; if (!item) break; setActiveSection(item.id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const { currency } = useCurrency()

  const c = { ...themeColors } as Record<string, string>
  const primary = c['--primary'] || GREEN
  const bg = c['--bg'] || PAPER
  const textColor = c['--text'] || DARK
  const accentColor = c['--accent'] || AMBER

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
    servesCuisine: 'Asian',
    image: getImageUrl(store.cover_image || store.cover),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Inter:wght@300;400;500;600&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        :root { ${Object.entries(c).map(([k, v]) => `${k}: ${v};`).join('\n')} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .brush-underline {
          background-image: linear-gradient(transparent 60%, rgba(45, 138, 78, 0.3) 60%, rgba(45, 138, 78, 0.3) 85%, transparent 85%);
          background-size: 100% 100%;
          display: inline;
        }
        @keyframes scrollFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: scrollFadeIn 0.6s ease-out forwards;
        }
      `}</style>

      <div className="min-h-screen bg-[#f5f0e8] text-[#2c3e2d] font-['Inter']">
        {/* ── Sidebar Nav (Desktop) ── */}
        <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[220px] bg-white/60 backdrop-blur-lg border-r border-[#2d8a4e]/10 flex-col z-40 shadow-sm">
          <div className="p-6 border-b border-[#2d8a4e]/10">
            <div className="flex items-center gap-3">
              {store.logo ? (
                <img
                  src={getImageUrl(store.logo) || ''}
                  alt={store.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-[#2d8a4e]/20"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-[#2d8a4e]/10 flex items-center justify-center">
                  <span className="text-[#2d8a4e] text-lg font-bold">{store.name.charAt(0)}</span>
                </div>
              )}
              <div>
                <span className="font-['Noto_Serif_SC'] text-sm text-[#2c3e2d] block leading-tight">{store.name}</span>
                <span className="text-[10px] text-[#2d8a4e] tracking-widest uppercase">Garden</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 py-6 px-4">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-all duration-300',
                      activeSection === item.id
                        ? 'bg-[#2d8a4e]/10 text-[#2d8a4e] font-medium'
                        : 'text-[#5a6b5a] hover:bg-[#2d8a4e]/5 hover:text-[#2c3e2d]'
                    )}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-[#2d8a4e]/10">
            <div className="flex items-center justify-center gap-2 text-[#2d8a4e] text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2d8a4e] animate-pulse" />
              <span>Open now</span>
            </div>
          </div>
        </aside>

        {/* ── Mobile Nav ── */}
        <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#2d8a4e]/10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              {store.logo && (
                <img src={getImageUrl(store.logo) || ''} alt={store.name} className="h-8 w-8 rounded-full object-cover" />
              )}
              <span className="font-['Noto_Serif_SC'] text-sm text-[#2c3e2d]">{store.name}</span>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-[#2c3e2d] p-1" aria-label="Toggle menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <div className={cn(
            'overflow-hidden transition-all duration-300',
            menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          )}>
            <div className="px-4 pb-4 space-y-1 bg-white/90 backdrop-blur-md">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors',
                    activeSection === item.id ? 'bg-[#2d8a4e]/10 text-[#2d8a4e]' : 'text-[#5a6b5a]'
                  )}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* ── Main Content ── */}
        <div className="lg:ml-[220px]">
          {/* ── Hero ── */}
          <section className="relative min-h-[90vh] flex items-center overflow-hidden">
            {(store.cover_image || store.cover) && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${getImageUrl(store.cover_image || store.cover)})` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#f5f0e8]/95 via-[#f5f0e8]/80 to-[#f5f0e8]/60" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
              <div className="max-w-2xl">
                <span className="inline-block text-[#2d8a4e] text-sm tracking-[0.25em] uppercase mb-4 font-medium">
                  Welcome to {store.name}
                </span>
                <h1 className="font-['Noto_Serif_SC'] text-5xl sm:text-6xl md:text-7xl text-[#2c3e2d] leading-tight mb-2">
                  <span className="brush-underline">Fresh</span> & Natural
                </h1>
                <p className="font-['Crimson_Text'] italic text-lg sm:text-xl text-[#5a6b5a] mt-4 mb-8 leading-relaxed max-w-lg">
                  {store.description || 'A garden-to-table experience rooted in tradition and nurtured with care.'}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={onShopNow}
                    className="bg-[#2d8a4e] text-white px-8 py-3.5 text-sm tracking-wider uppercase font-medium hover:bg-[#23703f] transition-all duration-300 shadow-lg shadow-[#2d8a4e]/20"
                  >
                    Explore Garden
                  </button>
                  {store.phone && (
                    <a
                      href={`tel:${store.phone}`}
                      className="border-2 border-[#2d8a4e]/30 text-[#2d8a4e] px-8 py-3.5 text-sm tracking-wider uppercase font-medium hover:bg-[#2d8a4e]/5 transition-all duration-300"
                    >
                      Call Us
                    </a>
                  )}
                </div>

                {store.avg_rating > 0 && (
                  <div className="flex items-center gap-3 mt-10 text-sm text-[#5a6b5a]">
                    <StarRating rating={store.avg_rating} size={16} activeColor="#e8c87a" inactiveColor="#d4c9b4" />
                    <span className="font-medium">{store.avg_rating.toFixed(1)}</span>
                    <span className="text-[#8a9b8a]">({store.reviews_count} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── Foods Section ── */}
          <section id="menu" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-[#2d8a4e] text-sm tracking-[0.25em] uppercase font-medium">From Our Garden</span>
              <h2 className="font-['Noto_Serif_SC'] text-4xl sm:text-5xl text-[#2c3e2d] mt-3 mb-4">
                Garden Menu
              </h2>
              <div className="w-20 h-0.5 bg-[#2d8a4e] mx-auto" />
            </div>

            {store.foods.length === 0 ? (
              <div className="text-center py-20 bg-white/50 rounded-2xl border border-[#2d8a4e]/10">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#2d8a4e]/5 flex items-center justify-center mb-5">
                  <span className="text-3xl">🌱</span>
                </div>
                <p className="font-['Noto_Serif_SC'] text-2xl text-[#2c3e2d] mb-2">Our garden menu is being cultivated</p>
                <p className="text-[#5a6b5a] italic">Fresh selections arriving soon. Stay connected.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
                {store.foods.map((food, idx) => (
                  <div
                    key={food.id}
                    className={cn(
                      'group bg-white rounded-2xl overflow-hidden border border-[#2d8a4e]/10 hover:border-[#2d8a4e]/30 transition-all duration-500 shadow-sm hover:shadow-lg hover:shadow-[#2d8a4e]/5',
                      idx % 5 === 0 && 'sm:col-span-2 sm:row-span-2',
                      idx % 7 === 3 && 'sm:col-span-2'
                    )}
                  >
                    <div className={cn(
                      'relative overflow-hidden',
                      idx % 5 === 0 ? 'aspect-square' : 'aspect-[4/3]'
                    )}>
                      {food.image ? (
                        <img
                          src={getImageUrl(food.image) ?? undefined}
                          alt={food.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#f0f5f0] flex items-center justify-center">
                          <span className="text-4xl opacity-30">🍃</span>
                        </div>
                      )}
                      {food.is_offer && (
                        <span className="absolute top-3 right-3 bg-[#e8c87a] text-[#2c3e2d] text-[10px] tracking-wider uppercase px-3 py-1 font-semibold rounded-full">
                          Special
                        </span>
                      )}
                    </div>
                    <div className={cn('p-5', idx % 5 === 0 && 'lg:p-7')}>
                      <h3 className={cn(
                        "font-['Noto_Serif_SC'] text-[#2c3e2d] group-hover:text-[#2d8a4e] transition-colors",
                        idx % 5 === 0 ? 'text-2xl' : 'text-lg'
                      )}>
                        {food.name}
                      </h3>
                      {food.description && (
                        <p className="text-[#5a6b5a] text-sm mt-1.5 line-clamp-2 leading-relaxed font-['Crimson_Text'] italic">
                          {food.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#2d8a4e]/10">
                        <span className="font-['Noto_Serif_SC'] text-lg text-[#e8c87a] font-semibold">
                          {formatFoodPrice(food, currency)}
                        </span>
                        {onAddToCart && (
                          <button
                            data-add-to-cart={food.id}
                            onClick={() => onAddToCart(food.id)}
                            className="bg-[#2d8a4e]/10 text-[#2d8a4e] px-4 py-2 text-xs tracking-wider uppercase rounded-full hover:bg-[#2d8a4e] hover:text-white transition-all duration-300"
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
          <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/40">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-14">
                <span className="text-[#2d8a4e] text-sm tracking-[0.25em] uppercase font-medium">Testimonials</span>
                <h2 className="font-['Noto_Serif_SC'] text-4xl sm:text-5xl text-[#2c3e2d] mt-3 mb-4">
                  Guest Stories
                </h2>
                <div className="w-20 h-0.5 bg-[#2d8a4e] mx-auto" />
              </div>

              <div
                ref={reviewsRef}
                className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory scroll-smooth"
              >
                {(store.reviews.length === 0 ? Array.from({ length: 4 }).map((_, i) => ({
                  id: -i,
                  rating: 5,
                  comment: null,
                  user: 'Guest',
                  avatar: null,
                  created_at: '',
                })) : store.reviews).map((review) => (
                  <div
                    key={review.id}
                    className="snap-start shrink-0 w-[320px] sm:w-[360px] bg-white rounded-2xl p-6 border border-[#2d8a4e]/10 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <StarRating rating={review.rating} size={14} activeColor="#e8c87a" inactiveColor="#d4c9b4" />
                    <Quote size={24} className="text-[#2d8a4e]/20 mt-4 mb-3" />
                    <p className="text-[#5a6b5a] text-sm leading-relaxed line-clamp-4 font-['Crimson_Text'] italic mb-5">
                      {review.comment || 'A delightful experience that captures the essence of garden-fresh dining.'}
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-[#2d8a4e]/10">
                      <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#2d8a4e]/20 shrink-0">
                        {review.avatar ? (
                          <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#f0f5f0] flex items-center justify-center">
                            <span className="text-[#2d8a4e] text-sm font-semibold">{review.user.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-[#2c3e2d] text-sm font-medium">{review.user}</p>
                        <p className="text-[#8a9b8a] text-xs">Garden Guest</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => reviewsRef.current?.scrollBy({ left: -380, behavior: 'smooth' })}
                  className="w-10 h-10 rounded-full border border-[#2d8a4e]/20 flex items-center justify-center text-[#2d8a4e] hover:bg-[#2d8a4e]/5 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => reviewsRef.current?.scrollBy({ left: 380, behavior: 'smooth' })}
                  className="w-10 h-10 rounded-full border border-[#2d8a4e]/20 flex items-center justify-center text-[#2d8a4e] hover:bg-[#2d8a4e]/5 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </section>

          {/* ── Staff Section ── */}
          {store.staff.length > 0 && (
            <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="text-center mb-14">
                <span className="text-[#2d8a4e] text-sm tracking-[0.25em] uppercase font-medium">Our People</span>
                <h2 className="font-['Noto_Serif_SC'] text-4xl sm:text-5xl text-[#2c3e2d] mt-3 mb-4">
                  Our Gardeners
                </h2>
                <div className="w-20 h-0.5 bg-[#2d8a4e] mx-auto" />
              </div>

              <div className="flex flex-wrap justify-center gap-10">
                {store.staff.map((member, idx) => (
                  <div key={idx} className="text-center group">
                    <div className="w-24 h-24 rounded-full mx-auto overflow-hidden ring-2 ring-[#2d8a4e]/20 group-hover:ring-[#2d8a4e]/50 transition-all duration-300 bg-white">
                      <div className="w-full h-full bg-[#f0f5f0] flex items-center justify-center">
                        <span className="font-['Noto_Serif_SC'] text-3xl text-[#2d8a4e]">{member.name.charAt(0)}</span>
                      </div>
                    </div>
                    <h3 className="font-['Noto_Serif_SC'] text-[#2c3e2d] font-medium mt-4 group-hover:text-[#2d8a4e] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-[#5a6b5a] text-sm">{member.role}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Opening Hours ── */}
          {store.opening_hours && (
            <section id="hours" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/40">
              <div className="max-w-lg mx-auto">
                <div className="text-center mb-12">
                  <span className="text-[#2d8a4e] text-sm tracking-[0.25em] uppercase font-medium">Schedule</span>
                  <h2 className="font-['Noto_Serif_SC'] text-4xl text-[#2c3e2d] mt-3 mb-4">
                    Zen Hours
                  </h2>
                  <div className="w-20 h-0.5 bg-[#2d8a4e] mx-auto" />
                </div>

                <div className="bg-white rounded-2xl overflow-hidden border border-[#2d8a4e]/10 shadow-sm">
                  {DAY_ORDER.map((day, idx) => {
                    const hours = store.opening_hours![day]
                    return (
                      <div
                        key={day}
                        className={cn(
                          'flex items-center justify-between px-6 py-3.5 transition-colors',
                          idx % 2 === 0 ? 'bg-[#f5f0e8]' : 'bg-white'
                        )}
                      >
                        <span className="text-[#2c3e2d] text-sm font-medium tracking-wide">
                          {DAY_LABELS[day]}
                        </span>
                        {hours ? (
                          <span className="text-[#2d8a4e] text-sm">
                            {hours.open} – {hours.close}
                          </span>
                        ) : (
                          <span className="text-[#5a6b5a] text-sm italic">Day of rest</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          )}

          {/* ── Contact Section ── */}
          <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-[#2d8a4e] text-sm tracking-[0.25em] uppercase font-medium">Connect</span>
              <h2 className="font-['Noto_Serif_SC'] text-4xl sm:text-5xl text-[#2c3e2d] mt-3 mb-4">
                Find Us
              </h2>
              <div className="w-20 h-0.5 bg-[#2d8a4e] mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {store.phone && (
                <a
                  href={`tel:${store.phone}`}
                  className="group bg-white rounded-2xl p-8 text-center border border-[#2d8a4e]/10 hover:border-[#2d8a4e]/30 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#2d8a4e]/5 flex items-center justify-center mb-5 group-hover:bg-[#2d8a4e]/10 transition-colors">
                    <Phone size={22} className="text-[#2d8a4e]" />
                  </div>
                  <h3 className="font-['Noto_Serif_SC'] text-[#2c3e2d] text-lg mb-2">Phone</h3>
                  <p className="text-[#5a6b5a] text-sm">{store.phone}</p>
                </a>
              )}
              {store.email && (
                <a
                  href={`mailto:${store.email}`}
                  className="group bg-white rounded-2xl p-8 text-center border border-[#2d8a4e]/10 hover:border-[#2d8a4e]/30 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#2d8a4e]/5 flex items-center justify-center mb-5 group-hover:bg-[#2d8a4e]/10 transition-colors">
                    <Mail size={22} className="text-[#2d8a4e]" />
                  </div>
                  <h3 className="font-['Noto_Serif_SC'] text-[#2c3e2d] text-lg mb-2">Email</h3>
                  <p className="text-[#5a6b5a] text-sm">{store.email}</p>
                </a>
              )}
              {store.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl p-8 text-center border border-[#2d8a4e]/10 hover:border-[#2d8a4e]/30 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#2d8a4e]/5 flex items-center justify-center mb-5 group-hover:bg-[#2d8a4e]/10 transition-colors">
                    <MapPin size={22} className="text-[#2d8a4e]" />
                  </div>
                  <h3 className="font-['Noto_Serif_SC'] text-[#2c3e2d] text-lg mb-2">Address</h3>
                  <p className="text-[#5a6b5a] text-sm">{store.address}</p>
                </a>
              )}
            </div>
          </section>

          {/* ── Footer ── */}
          <footer className="border-t border-[#2d8a4e]/10 py-10 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                {store.logo && (
                  <img src={getImageUrl(store.logo) || ''} alt={store.name} className="h-8 w-8 rounded-full object-cover" />
                )}
                <span className="font-['Noto_Serif_SC'] text-lg text-[#2c3e2d]">{store.name}</span>
              </div>
              <p className="text-[#5a6b5a] text-sm max-w-md mx-auto mb-6 font-['Crimson_Text'] italic">
                {store.description || 'Where nature meets flavor in every dish.'}
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-[#5a6b5a]">
                {store.phone && (
                  <a href={`tel:${store.phone}`} className="hover:text-[#2d8a4e] transition-colors flex items-center gap-1.5">
                    <Phone size={14} /> {store.phone}
                  </a>
                )}
                {store.email && (
                  <a href={`mailto:${store.email}`} className="hover:text-[#2d8a4e] transition-colors flex items-center gap-1.5">
                    <Mail size={14} /> Email
                  </a>
                )}
              </div>
              <div className="mt-8 pt-6 border-t border-[#2d8a4e]/10">
                <p className="text-[#8a9b8a] text-xs">
                  &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}
