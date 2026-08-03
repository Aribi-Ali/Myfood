'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, Quote } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface MinimalProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const DARK = '#1f2937'
const BG = '#ffffff'
const SECONDARY = '#525252'
const BORDER = '#e5e5e5'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

export default function MinimalTemplate({ store, themeColors, onAddToCart, onShopNow }: MinimalProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )
    document.querySelectorAll('section[id]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&display=swap');
        :root { ${Object.entries(c).map(([k, v]) => `${k}: ${v};`).join('\n')} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-white text-[#1f2937] font-['Inter'] overflow-x-hidden">
        {/* ── Navbar ── */}
        <nav
          className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
            scrolled ? 'bg-white/90 backdrop-blur-md' : 'bg-transparent'
          )}
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <span className="text-sm font-medium tracking-tight text-[#1f2937]">
                {store.name}
              </span>

              <div className="hidden lg:flex items-center gap-6">
                {['Menu', 'Reviews', 'Hours', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className={cn(
                      'text-xs tracking-wider uppercase transition-colors duration-300',
                      activeSection === item.toLowerCase()
                        ? 'text-[#1f2937] font-medium'
                        : 'text-[#525252]/60 hover:text-[#1f2937]'
                    )}
                  >
                    {item}
                  </a>
                ))}
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="bg-[#1f2937] text-white px-5 py-2 text-xs tracking-wider uppercase font-medium hover:bg-[#374151] transition-colors duration-300"
                  >
                    Order
                  </button>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-[#1f2937] p-1"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          <div
            className={cn(
              'lg:hidden overflow-hidden transition-all duration-300',
              menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="bg-white border-t border-[#e5e5e5] px-6 py-4 space-y-3">
              {['Menu', 'Reviews', 'Hours', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-xs tracking-wider uppercase text-[#525252]/60 hover:text-[#1f2937] transition-colors"
                >
                  {item}
                </a>
              ))}
              {onShopNow && (
                <button
                  onClick={() => { setMenuOpen(false); onShopNow?.() }}
                  className="w-full bg-[#1f2937] text-white px-5 py-2.5 text-xs tracking-wider uppercase font-medium mt-2"
                >
                  Order Now
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="min-h-[80vh] flex items-center justify-center px-6">
          <div className="max-w-2xl mx-auto text-center py-32">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#1f2937] leading-tight tracking-tight">
              {store.name}
            </h1>
            <div className="w-12 h-0.5 bg-[#1f2937] mx-auto my-6" />
            <p className="text-base sm:text-lg text-[#525252]/70 max-w-lg mx-auto leading-relaxed font-light">
              {store.description || 'Simple, honest food crafted with care.'}
            </p>
            <div className="mt-10">
              <button
                onClick={onShopNow}
                className="bg-[#1f2937] text-white px-8 py-3.5 text-sm tracking-wider uppercase font-medium hover:bg-[#374151] transition-all duration-300"
              >
                View Menu
              </button>
            </div>
            {store.avg_rating > 0 && (
              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-[#525252]/60">
                <StarRating rating={store.avg_rating} size={14} activeColor="#1f2937" inactiveColor="#e5e5e5" />
                <span>({store.reviews_count} reviews)</span>
              </div>
            )}
          </div>
        </section>

        {/* ── Foods Section ── */}
        <section id="menu" className="py-24 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1f2937] tracking-tight">Menu</h2>
              <div className="w-8 h-0.5 bg-[#1f2937] mt-3" />
            </div>

            {store.foods.length === 0 ? (
              <div className="text-center py-16 border border-[#e5e5e5]">
                <Clock size={32} className="mx-auto text-[#525252]/30 mb-3" />
                <p className="text-lg font-medium text-[#1f2937] mb-1">Menu coming soon</p>
                <p className="text-sm text-[#525252]/60">We are curating our selection.</p>
              </div>
            ) : (
              <div className="space-y-0">
                {store.foods.map((food, idx) => (
                  <div
                    key={food.id}
                    className={cn(
                      'flex items-center justify-between py-5',
                      idx < store.foods.length - 1 && 'border-b border-[#e5e5e5]'
                    )}
                  >
                    {food.image && (
                      <img
                        src={getImageUrl(food.image) ?? undefined}
                        alt={food.name}
                        className="w-12 h-12 rounded-lg object-cover mr-4 shrink-0"
                      />
                    )}
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-medium text-[#1f2937]">{food.name}</h3>
                        {food.is_offer && (
                          <span className="text-[10px] tracking-widest uppercase text-[#525252] border border-[#e5e5e5] px-2 py-0.5">
                            Offer
                          </span>
                        )}
                      </div>
                      {food.description && (
                        <p className="text-sm text-[#525252]/60 mt-1 line-clamp-1">{food.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-medium text-[#1f2937]">{formatFoodPrice(food, currency)}</span>
                      {onAddToCart && (
                        <button
                          data-add-to-cart={food.id}
                          onClick={() => onAddToCart(food.id)}
                          className="border border-[#e5e5e5] text-[#525252] px-3 py-1.5 text-xs uppercase tracking-wider hover:bg-[#1f2937] hover:text-white hover:border-[#1f2937] transition-all duration-200"
                        >
                          <ShoppingCart size={12} className="inline-block mr-1" />
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Reviews Section ── */}
        <section id="reviews" className="py-24 px-6 bg-[#fafafa]">
          <div className="max-w-2xl mx-auto">
            <div className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1f2937] tracking-tight">Reviews</h2>
              <div className="w-8 h-0.5 bg-[#1f2937] mt-3" />
            </div>

            <div className="space-y-4">
              {store.reviews.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border border-[#e5e5e5] p-6 bg-white">
                      <StarRating rating={5} size={14} activeColor="#1f2937" inactiveColor="#e5e5e5" />
                      <Quote size={16} className="text-[#525252]/20 mt-3 mb-2" />
                      <p className="text-sm text-[#525252]/70 leading-relaxed mb-4">
                        A truly minimal and elegant dining experience. Every detail matters.
                      </p>
<div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#e5e5e5] flex items-center justify-center">
                          <span className="text-[10px] font-medium text-[#525252]">G</span>
                        </div>
                        <span className="text-xs font-medium text-[#1f2937]">Guest</span>
                        <span className="text-[10px] text-[#525252]/50">· Verified</span>
                      </div>
                    </div>
                  ))
                : store.reviews.map((review) => (
                    <div key={review.id} className="border border-[#e5e5e5] p-6 bg-white hover:border-[#1f2937]/20 transition-all duration-200">
                      <StarRating rating={review.rating} size={14} activeColor="#1f2937" inactiveColor="#e5e5e5" />
                      <Quote size={16} className="text-[#525252]/20 mt-3 mb-2" />
                      <p className="text-sm text-[#525252]/70 leading-relaxed mb-4 line-clamp-3">
                        {review.comment || 'Great experience.'}
                      </p>
                      <div className="flex items-center gap-2">
                        {review.avatar ? (
                          <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#e5e5e5] flex items-center justify-center">
                            <span className="text-[10px] font-medium text-[#525252]">{review.user.charAt(0)}</span>
                          </div>
                        )}
                        <span className="text-xs font-medium text-[#1f2937]">{review.user}</span>
                        <span className="text-[10px] text-[#525252]/50">· Verified</span>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* ── Staff Section ── */}
        {store.staff.length > 0 && (
          <section id="team" className="py-24 px-6">
            <div className="max-w-2xl mx-auto">
              <div className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1f2937] tracking-tight">Team</h2>
                <div className="w-8 h-0.5 bg-[#1f2937] mt-3" />
              </div>

              <div className="space-y-3">
                {store.staff.map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-[#e5e5e5] last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-[#1f2937]">{member.name}</span>
                      <span className="text-xs text-[#525252]/60">{member.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Opening Hours ── */}
        {store.opening_hours && (
          <section id="hours" className="py-24 px-6 bg-[#fafafa]">
            <div className="max-w-md mx-auto">
              <div className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1f2937] tracking-tight">Hours</h2>
                <div className="w-8 h-0.5 bg-[#1f2937] mt-3" />
              </div>

              <div className="space-y-1">
                {DAY_ORDER.map((day) => {
                  const hours = store.opening_hours![day]
                  return (
                    <div key={day} className="flex items-center justify-between py-2.5 border-b border-[#e5e5e5] last:border-0">
                      <span className="text-sm text-[#1f2937]">{DAY_LABELS[day]}</span>
                      {hours ? (
                        <span className="text-sm text-[#525252]">
                          {hours.open} – {hours.close}
                        </span>
                      ) : (
                        <span className="text-sm text-[#525252]/50">Closed</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Contact Section ── */}
        <section id="contact" className="py-24 px-6">
          <div className="max-w-md mx-auto">
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1f2937] tracking-tight">Contact</h2>
              <div className="w-8 h-0.5 bg-[#1f2937] mt-3" />
            </div>

            <div className="space-y-4">
              {store.phone && (
                <a href={`tel:${store.phone}`} className="flex items-center gap-3 text-sm text-[#525252] hover:text-[#1f2937] transition-colors">
                  <Phone size={14} className="shrink-0" />
                  <span>{store.phone}</span>
                </a>
              )}
              {store.email && (
                <a href={`mailto:${store.email}`} className="flex items-center gap-3 text-sm text-[#525252] hover:text-[#1f2937] transition-colors">
                  <Mail size={14} className="shrink-0" />
                  <span>{store.email}</span>
                </a>
              )}
              {store.address && (
                <div className="flex items-start gap-3 text-sm text-[#525252]">
                  <MapPin size={14} className="shrink-0 mt-0.5" />
                  <span>{store.address}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-[#e5e5e5] py-8 px-6">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#525252]/50">
              &copy; {new Date().getFullYear()} {store.name}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-[10px] tracking-wider uppercase text-[#525252]/50 hover:text-[#1f2937] transition-colors">Privacy</a>
              <a href="#" className="text-[10px] tracking-wider uppercase text-[#525252]/50 hover:text-[#1f2937] transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
