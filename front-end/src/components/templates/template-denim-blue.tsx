'use client'

import { useState } from 'react'
import { Menu, X, Phone, Mail, MapPin, Clock, ChevronRight, Star } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import type { TemplateStore, ReviewData } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface TemplateProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

export function DenimBlueTemplate({ store, themeColors, onAddToCart, onShopNow }: TemplateProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  const c = (key: string, fallback: string) => themeColors?.[key] ?? fallback

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: store.name,
    description: store.description,
    image: getImageUrl(store.cover_image),
    url: typeof window !== 'undefined' ? window.location.href : '',
    telephone: store.phone,
    email: store.email,
    address: store.address
      ? { '@type': 'PostalAddress', streetAddress: store.address }
      : undefined,
    aggregateRating: store.reviews_count > 0
      ? { '@type': 'AggregateRating', ratingValue: store.avg_rating, reviewCount: store.reviews_count }
      : undefined,
    servesCuisine: store.badges?.map((b) => b.name).join(', ') || undefined,
    openingHoursSpecification: store.opening_hours
      ? (Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, h]) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
          opens: h.open,
          closes: h.close,
        }))
      : undefined,
  }

  const days = store.opening_hours
    ? (Object.entries(store.opening_hours) as [string, { open: string; close: string }][])
    : []

  const dayLabels: Record<string, string> = {
    monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
    friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
  }

  function ReviewCard({ review }: { review: ReviewData }) {
    return (
      <div className="bg-white rounded-lg border-l-4 border-l-[#1d4ed8] shadow-sm p-5 relative">
        <div className="absolute left-5 top-5 w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[12px] border-r-white -left-3 top-7" />
        <div className="absolute left-4 top-7 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[10px] border-r-[#1d4ed8]" />
        <div className="ml-2">
          <div className="flex items-center gap-2 mb-2">
            {review.avatar ? (
              <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1d4ed8] to-[#dc2626] flex items-center justify-center">
                <span className="text-white font-['Archivo_Black',sans-serif] text-xs">{review.user.charAt(0)}</span>
              </div>
            )}
          </div>
          <StarRating rating={review.rating} size={14} activeColor="#fbbf24" inactiveColor="#d1d5db" />
          {review.comment && (
            <p className="mt-2 text-sm text-[#374151] leading-relaxed italic">"{review.comment}"</p>
          )}
          <p className="mt-3 text-xs font-bold text-[#1d4ed8] uppercase tracking-wider">{review.user}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&display=swap');

        :root {
          --denim: #1d4ed8;
          --red: #dc2626;
          --yellow: #fbbf24;
          --bg: #f8fafc;
        }

        body {
          font-family: 'Inter', sans-serif;
          background: #f8fafc;
          color: #1f2937;
        }
      `}</style>
      {themeColors && (
        <style>{`
          :root {
            ${Object.entries(themeColors).map(([k, v]) => `--${k}: ${v};`).join('\n')}
          }
        `}</style>
      )}

      <div className="min-h-screen bg-[#f8fafc] font-[family-name:var(--font-body,Inter)] antialiased">
        {/* Denim texture background */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #1d4ed8 2px, #1d4ed8 3px), repeating-linear-gradient(90deg, transparent, transparent 2px, #1d4ed8 2px, #1d4ed8 3px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* ── Navbar ── */}
        <nav className="bg-[#1d4ed8] border-b-4 border-[#dc2626] relative z-20">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {store.logo ? (
                <img src={getImageUrl(store.logo) || ''} alt={store.name} className="h-10 w-10 rounded-full object-cover border-2 border-white" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                  <span className="text-[#1d4ed8] font-['Archivo_Black',sans-serif] text-sm">{store.name.charAt(0)}</span>
                </div>
              )}
              <h1 className="font-['Archivo_Black',sans-serif] text-lg text-white tracking-tight uppercase">
                {store.name}
              </h1>
            </div>
            <div className="hidden lg:flex items-center gap-6 text-sm">
              <a href="#diner-menu" className="text-white/80 hover:text-white font-semibold uppercase tracking-wide transition-colors">Diner Menu</a>
              <a href="#word-of-mouth" className="text-white/80 hover:text-white font-semibold uppercase tracking-wide transition-colors">Word of Mouth</a>
              <a href="#folks" className="text-white/80 hover:text-white font-semibold uppercase tracking-wide transition-colors">Folks</a>
              <a href="#hours" className="text-white/80 hover:text-white font-semibold uppercase tracking-wide transition-colors">Hours</a>
              <a href="#get-in-touch" className="text-white/80 hover:text-white font-semibold uppercase tracking-wide transition-colors">Get in Touch</a>
              {onShopNow && (
                <button
                  onClick={onShopNow}
                  className="px-5 py-2 rounded-lg bg-[#fbbf24] text-[#1f2937] font-['Archivo_Black',sans-serif] text-xs uppercase tracking-wider hover:bg-[#f59e0b] transition-colors"
                >
                  Order Now
                </button>
              )}
            </div>
            <button
              className="lg:hidden p-2 -mr-2 text-white/80 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          {mobileOpen && (
            <div className="lg:hidden bg-[#1e40af] border-t-2 border-[#dc2626] px-6 py-4 space-y-3 text-sm">
              <a href="#diner-menu" className="block text-white/80 hover:text-white font-semibold">Diner Menu</a>
              <a href="#word-of-mouth" className="block text-white/80 hover:text-white font-semibold">Word of Mouth</a>
              <a href="#folks" className="block text-white/80 hover:text-white font-semibold">Folks</a>
              <a href="#hours" className="block text-white/80 hover:text-white font-semibold">Hours</a>
              <a href="#get-in-touch" className="block text-white/80 hover:text-white font-semibold">Get in Touch</a>
              {onShopNow && (
                <button
                  onClick={onShopNow}
                  className="w-full mt-2 px-5 py-2 rounded-lg bg-[#fbbf24] text-[#1f2937] font-['Archivo_Black',sans-serif] text-xs uppercase"
                >
                  Order Now
                </button>
              )}
            </div>
          )}
        </nav>

        {/* ── Hero ── */}
        <section className="bg-[#1e293b] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 relative z-10 text-center">
            <h2 className="font-['Archivo_Black',sans-serif] text-5xl md:text-7xl text-white leading-tight tracking-tight uppercase"
              style={{ textShadow: '3px 3px 0px #1d4ed8, 6px 6px 0px #dc2626' }}>
              {store.name}
            </h2>
            {store.description && (
              <p className="mt-6 text-lg text-[#cbd5e1] max-w-2xl mx-auto font-light"
                style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.5)' }}>
                {store.description}
              </p>
            )}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {onShopNow && (
                <button
                  onClick={onShopNow}
                  className="px-8 py-3 rounded-xl bg-[#fbbf24] text-[#1f2937] font-['Archivo_Black',sans-serif] text-sm uppercase tracking-wider hover:bg-[#f59e0b] transition-colors shadow-lg"
                >
                  See the Menu
                </button>
              )}
              <a
                href="#diner-menu"
                className="px-8 py-3 rounded-xl border-2 border-white/30 text-white font-semibold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors"
              >
                Come On In
              </a>
            </div>
          </div>
        </section>

        {/* ── Foods ── */}
        <section id="diner-menu" className="bg-[#f8fafc]">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-8 w-2 bg-[#dc2626] rounded-full" />
              <h3 className="font-['Archivo_Black',sans-serif] text-3xl text-[#1f2937] uppercase tracking-tight">Diner Menu</h3>
            </div>
            {store.foods && store.foods.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.foods.map((food) => (
                  <div
                    key={food.id}
                    className="bg-white rounded-lg overflow-hidden border-t-4 border-t-[#dc2626] shadow-sm hover:shadow-lg transition-shadow"
                  >
                    {food.image ? (
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={getImageUrl(food.image) ?? undefined}
                          alt={food.name}
                          className="w-full h-full object-cover transition-transform duration-500"
                        />
                        {food.is_offer && (
                          <span className="absolute top-3 right-3 bg-[#dc2626] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            Special
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="h-44 bg-gradient-to-br from-[#1d4ed8]/5 to-[#dc2626]/5 flex items-center justify-center">
                        <span className="text-[#1d4ed8]/20 font-['Archivo_Black',sans-serif] text-sm uppercase">No Photo</span>
                      </div>
                    )}
                    <div className="p-5">
                      <h4 className="font-['Archivo_Black',sans-serif] text-base text-[#1f2937] uppercase tracking-tight">{food.name}</h4>
                      {food.description && (
                        <p className="mt-1.5 text-sm text-[#6b7280] leading-relaxed">{food.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#e5e7eb]">
                        <p className="font-['Archivo_Black',sans-serif] text-lg text-[#dc2626]">
                          {formatFoodPrice(food, currency)}
                        </p>
                        <div className="flex items-center gap-3">
                          {food.cooking_time && (
                            <span className="text-xs text-[#6b7280]">{food.cooking_time} min</span>
                          )}
                          {onAddToCart && (
                            <button
                              data-add-to-cart={food.id}
                              onClick={() => onAddToCart(food.id)}
                              className="px-4 py-1.5 rounded-lg bg-[#1d4ed8] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1e40af] transition-colors"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-[#1d4ed8]/20 rounded-xl bg-white">
                <p className="text-[#1d4ed8]/40 font-['Archivo_Black',sans-serif] text-lg uppercase">Short-order cook is on break...</p>
                <p className="text-[#6b7280]/40 text-sm mt-2">Menu items are being prepped. Check back soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Reviews ── */}
        <section id="word-of-mouth" className="bg-[#f1f5f9] border-t-2 border-[#e2e8f0]">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-8 w-2 bg-[#fbbf24] rounded-full" />
              <h3 className="font-['Archivo_Black',sans-serif] text-3xl text-[#1f2937] uppercase tracking-tight">Word of Mouth</h3>
            </div>
            {store.reviews && store.reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-[#1d4ed8]/20 rounded-xl bg-white">
                <Star size={32} className="mx-auto text-[#fbbf24]/30" />
                <p className="mt-4 text-[#1d4ed8]/40 font-['Archivo_Black',sans-serif] text-lg uppercase">No word yet...</p>
                <p className="text-[#6b7280]/40 text-sm mt-2">Be the first to spread the word about this place.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Staff ── */}
        <section id="folks" className="bg-[#f8fafc]">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-8 w-2 bg-[#1d4ed8] rounded-full" />
              <h3 className="font-['Archivo_Black',sans-serif] text-3xl text-[#1f2937] uppercase tracking-tight">Folks</h3>
            </div>
            {store.staff && store.staff.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {store.staff.map((member, idx) => (
                  <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-sm text-center">
                    <div className="bg-[#dc2626] py-2 px-4">
                      <p className="font-['Archivo_Black',sans-serif] text-xs text-white uppercase tracking-wider truncate">
                        {member.role}
                      </p>
                    </div>
                    <div className="p-5">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#1d4ed8] to-[#dc2626] flex items-center justify-center mb-3">
                        <span className="text-white font-['Archivo_Black',sans-serif] text-xl">
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <p className="font-bold text-[#1f2937] text-sm">{member.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-[#1d4ed8]/20 rounded-xl bg-white">
                <p className="text-[#1d4ed8]/40 font-['Archivo_Black',sans-serif] text-lg uppercase">Meet the crew soon</p>
                <p className="text-[#6b7280]/40 text-sm mt-2">Our folks are putting on their aprons.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Hours ── */}
        <section id="hours" className="bg-[#1e293b] border-t-4 border-[#fbbf24]">
          <div className="max-w-2xl mx-auto px-6 py-24">
            <div className="text-center mb-12">
              <h3 className="font-['Archivo_Black',sans-serif] text-3xl text-[#fbbf24] uppercase tracking-tight">Hours</h3>
              <div className="w-16 h-1 bg-[#dc2626] mx-auto mt-4 rounded-full" />
            </div>
            {days.length > 0 ? (
              <div className="space-y-0 rounded-lg overflow-hidden border border-[#fbbf24]/20">
                {days.map(([day, h], idx) => (
                  <div
                    key={day}
                    className="flex justify-between items-center px-6 py-3.5 text-sm"
                    style={{
                      backgroundColor: idx % 2 === 0 ? 'rgba(29, 78, 216, 0.15)' : 'rgba(220, 38, 38, 0.15)',
                    }}
                  >
                    <span className="font-bold text-white uppercase tracking-wider text-xs">{dayLabels[day] || day}</span>
                    <span className="text-[#fbbf24] font-semibold">
                      {h.open} — {h.close}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-[#fbbf24]/20 rounded-xl">
                <Clock size={32} className="mx-auto text-[#fbbf24]/30" />
                <p className="mt-4 text-[#fbbf24]/40 font-['Archivo_Black',sans-serif] text-lg uppercase">Check back for hours</p>
                <p className="text-[#94a3b8]/40 text-sm mt-2">We&apos;re setting our schedule.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="get-in-touch" className="bg-[#f8fafc]">
          <div className="max-w-4xl mx-auto px-6 py-24">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-8 w-2 bg-[#dc2626] rounded-full" />
              <h3 className="font-['Archivo_Black',sans-serif] text-3xl text-[#1f2937] uppercase tracking-tight">Get in Touch</h3>
            </div>
            {store.phone || store.email || store.address ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {store.phone && (
                  <a href={`tel:${store.phone}`} className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-[#1d4ed8]">
                    <div className="w-12 h-12 rounded-lg bg-[#1d4ed8] flex items-center justify-center flex-shrink-0">
                      <Phone size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6b7280] uppercase font-bold tracking-wider">Call Us</p>
                      <p className="font-bold text-[#1f2937] text-sm">{store.phone}</p>
                    </div>
                  </a>
                )}
                {store.email && (
                  <a href={`mailto:${store.email}`} className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-[#dc2626]">
                    <div className="w-12 h-12 rounded-lg bg-[#dc2626] flex items-center justify-center flex-shrink-0">
                      <Mail size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6b7280] uppercase font-bold tracking-wider">Email</p>
                      <p className="font-bold text-[#1f2937] text-sm">{store.email}</p>
                    </div>
                  </a>
                )}
                {store.address && (
                  <div className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border-l-4 border-l-[#fbbf24]">
                    <div className="w-12 h-12 rounded-lg bg-[#fbbf24] flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#6b7280] uppercase font-bold tracking-wider">Visit</p>
                      <p className="font-bold text-[#1f2937] text-sm">{store.address}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-[#1d4ed8]/20 rounded-xl bg-white">
                <p className="text-[#1d4ed8]/40 font-['Archivo_Black',sans-serif] text-lg uppercase">Drop a line soon</p>
                <p className="text-[#6b7280]/40 text-sm mt-2">Contact details are coming.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-[#1d4ed8] border-t-4 border-[#dc2626]">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <h4 className="font-['Archivo_Black',sans-serif] text-lg text-white uppercase tracking-tight">{store.name}</h4>
              </div>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <a href="#diner-menu" className="text-white/70 hover:text-white font-semibold uppercase tracking-wide transition-colors">Menu</a>
                <a href="#word-of-mouth" className="text-white/70 hover:text-white font-semibold uppercase tracking-wide transition-colors">Reviews</a>
                <a href="#folks" className="text-white/70 hover:text-white font-semibold uppercase tracking-wide transition-colors">Team</a>
                <a href="#hours" className="text-white/70 hover:text-white font-semibold uppercase tracking-wide transition-colors">Hours</a>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-white/50">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
