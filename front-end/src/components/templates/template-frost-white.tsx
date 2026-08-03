'use client'

import { useState } from 'react'
import { Menu, X, Phone, Mail, MapPin, Clock, ChevronRight, Quote, Star } from 'lucide-react'
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

export function FrostWhiteTemplate({ store, themeColors, onAddToCart, onShopNow }: TemplateProps) {
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

  const defaultTheme = `
    --tw-primary: #1e2937;
    --tw-primary-light: #334155;
    --tw-bg: #ffffff;
    --tw-bg-secondary: #f8fafc;
    --tw-border: #e2e8f0;
    --tw-text-secondary: #64748b;
    --tw-accent: #38bdf8;
  `

  const dayLabels: Record<string, string> = {
    monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu',
    friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
  }

  function ReviewCard({ review }: { review: ReviewData }) {
    return (
      <div className="border-b border-[#e2e8f0] pb-10 mb-10 last:border-b-0 last:mb-0 last:pb-0 text-center max-w-2xl mx-auto">
        <StarRating rating={review.rating} size={18} activeColor="#f59e0b" inactiveColor="#e2e8f0" />
        <Quote className="mx-auto mt-4 text-[#e2e8f0]" size={28} />
        {review.comment && (
          <p className="mt-4 text-lg text-[#64748b] leading-relaxed italic font-light">"{review.comment}"</p>
        )}
        <div className="mt-4 flex items-center justify-center gap-2">
          {review.avatar ? (
            <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#94a3b8]">{review.user.charAt(0)}</span>
            </div>
          )}
          <p className="font-semibold text-[#1e2937] text-sm">{review.user}</p>
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
        @import url('https://fonts.googleapis.com/css2?family=Cabin+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

        :root {
          ${defaultTheme}
        }

        body {
          font-family: 'Inter', sans-serif;
          background: #ffffff;
          color: #1e2937;
        }
      `}</style>
      {themeColors && (
        <style>{`
          :root {
            ${Object.entries(themeColors).map(([k, v]) => `--${k}: ${v};`).join('\n')}
          }
        `}</style>
      )}

      <div className="min-h-screen bg-white font-[family-name:var(--font-body,Inter)] antialiased">
        {/* ── Navbar ── */}
        <nav className="border-b border-[#e2e8f0]">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="#" className="flex items-center gap-3">
              {store.logo ? (
                <img src={getImageUrl(store.logo) || ''} alt={store.name} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center">
                  <span className="text-[#94a3b8] text-xs font-bold">{store.name.charAt(0)}</span>
                </div>
              )}
              <h1 className="font-['Cabin_Grotesk',sans-serif] text-xl font-bold tracking-tight text-[#1e2937]">
                {store.name}
              </h1>
            </a>
            <div className="hidden lg:flex items-center gap-8 text-sm text-[#64748b]">
              <a href="#selection" className="hover:text-[#1e2937] transition-colors">Selection</a>
              <a href="#kind-notes" className="hover:text-[#1e2937] transition-colors">Kind Notes</a>
              <a href="#people" className="hover:text-[#1e2937] transition-colors">People</a>
              <a href="#hours" className="hover:text-[#1e2937] transition-colors">Hours</a>
              <a href="#reach" className="hover:text-[#1e2937] transition-colors">Reach</a>
              {onShopNow && (
                <button
                  onClick={onShopNow}
                  className="px-5 py-2 rounded-full bg-[#1e2937] text-white text-xs font-medium hover:bg-[#334155] transition-colors"
                >
                  Order
                </button>
              )}
            </div>
            <button
              className="lg:hidden p-2 -mr-2 text-[#64748b] hover:text-[#1e2937]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          {mobileOpen && (
            <div className="lg:hidden border-t border-[#e2e8f0] px-6 py-4 space-y-3 text-sm text-[#64748b]">
              <a href="#selection" className="block hover:text-[#1e2937]">Selection</a>
              <a href="#kind-notes" className="block hover:text-[#1e2937]">Kind Notes</a>
              <a href="#people" className="block hover:text-[#1e2937]">People</a>
              <a href="#hours" className="block hover:text-[#1e2937]">Hours</a>
              <a href="#reach" className="block hover:text-[#1e2937]">Reach</a>
              {onShopNow && (
                <button
                  onClick={onShopNow}
                  className="w-full mt-2 px-5 py-2 rounded-full bg-[#1e2937] text-white text-xs font-medium"
                >
                  Order
                </button>
              )}
            </div>
          )}
        </nav>

        {/* ── Hero ── */}
        <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-3/5">
              <span className="inline-block text-[#94a3b8] text-xs uppercase tracking-[0.2em] font-medium mb-4">
                {store.badges?.length ? store.badges[0]!.name : 'Welcome'}
              </span>
              <h2 className="font-['Cabin_Grotesk',sans-serif] text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-[#1e2937]">
                {store.name}
              </h2>
              {store.description && (
                <p className="mt-6 text-lg text-[#64748b] font-light leading-relaxed max-w-md">
                  {store.description}
                </p>
              )}
              <div className="mt-8 flex gap-4">
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="px-8 py-3 rounded-full bg-[#1e2937] text-white text-sm font-medium hover:bg-[#334155] transition-colors"
                  >
                    Shop Now
                  </button>
                )}
                <a
                  href="#selection"
                  className="px-8 py-3 rounded-full border border-[#e2e8f0] text-[#64748b] text-sm font-medium hover:border-[#1e2937] hover:text-[#1e2937] transition-colors"
                >
                  Explore
                </a>
              </div>
              {store.reviews_count > 0 && (
                <div className="mt-10 flex items-center gap-4 text-sm text-[#64748b]">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-[#f59e0b] text-[#f59e0b]" />
                    <span className="font-medium text-[#1e2937]">{store.avg_rating.toFixed(1)}</span>
                  </div>
                  <span className="text-[#94a3b8]">/</span>
                  <span>{store.reviews_count} reviews</span>
                </div>
              )}
            </div>
            <div className="w-full md:w-2/5">
              {store.cover_image ? (
                <img
                  src={getImageUrl(store.cover_image) || ''}
                  alt={store.name}
                  className="w-full aspect-[4/5] object-cover rounded-2xl"
                />
              ) : (
                <div className="w-full aspect-[4/5] rounded-2xl bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] flex items-center justify-center">
                  <span className="text-[#94a3b8] text-sm">Visual</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Badges Strip ── */}
        {store.badges && store.badges.length > 0 && (
          <section className="border-t border-b border-[#e2e8f0]">
            <div className="max-w-6xl mx-auto px-6 py-6">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {store.badges.map((badge) => (
                  <span
                    key={badge.id}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-[#64748b] bg-[#f8fafc] border border-[#e2e8f0]"
                  >
                    {badge.name}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Foods ── */}
        <section id="selection" className="border-t border-[#e2e8f0]">
          <div className="max-w-4xl mx-auto px-6 py-24">
            <div className="flex items-center justify-between mb-16">
              <h3 className="font-['Cabin_Grotesk',sans-serif] text-3xl font-bold text-[#1e2937] tracking-tight">
                Selection
              </h3>
              {store.foods && store.foods.length > 0 && (
                <span className="text-xs text-[#94a3b8] font-mono">{store.foods.length} items</span>
              )}
            </div>
            {store.foods && store.foods.length > 0 ? (
              <div className="space-y-0">
                {store.foods.map((food, idx) => (
                  <div
                    key={food.id}
                    className="flex items-start justify-between py-6 border-b border-[#e2e8f0] last:border-b-0 group"
                  >
                    <div className="flex-1 pr-8">
                      <div className="flex items-center gap-3">
                        <span className="text-[#94a3b8] text-xs font-mono w-6">{String(idx + 1).padStart(2, '0')}</span>
                        {food.image && (
                          <img
                            src={getImageUrl(food.image) ?? undefined}
                            alt={food.name}
                            className="w-10 h-10 rounded-full object-cover shrink-0"
                          />
                        )}
                        <h4 className="font-['Cabin_Grotesk',sans-serif] text-lg font-semibold text-[#1e2937] group-hover:text-[#38bdf8] transition-colors">
                          {food.name}
                        </h4>
                        {food.is_offer && (
                          <span className="text-[10px] font-medium text-[#38bdf8] uppercase tracking-wider border border-[#38bdf8]/30 px-2 py-0.5 rounded-full">
                            Offer
                          </span>
                        )}
                      </div>
                      {food.description && (
                        <p className="mt-1.5 text-sm text-[#64748b] font-light ml-9 leading-relaxed">{food.description}</p>
                      )}
                      {food.category && (
                        <p className="mt-1 text-[11px] text-[#94a3b8] ml-9">{food.category.name}</p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0 min-w-[80px]">
                      <div className="flex flex-col items-end">
                        {food.new_price ? (
                          <>
                            <p className="text-sm font-medium text-[#1e2937]">
                              {formatFoodPrice(food, currency)}
                            </p>
                            <p className="text-xs text-[#94a3b8] line-through">
                              {formatFoodPrice(food, currency, { original: true })}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm font-medium text-[#1e2937]">
                            {formatFoodPrice(food, currency)}
                          </p>
                        )}
                        {food.cooking_time && (
                          <p className="text-xs text-[#94a3b8] mt-0.5">{food.cooking_time} min</p>
                        )}
                      </div>
                      {onAddToCart && (
                        <button
                          data-add-to-cart={food.id}
                          onClick={() => onAddToCart(food.id)}
                          className="mt-2 text-xs font-medium text-[#38bdf8] hover:text-white hover:bg-[#38bdf8] px-3 py-1 rounded-full border border-[#38bdf8]/30 hover:border-transparent transition-all"
                        >
                          Add +
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-[#e2e8f0] rounded-xl bg-[#f8fafc]/50">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center mb-4">
                  <ChevronRight size={16} className="text-[#94a3b8]" />
                </div>
                <p className="text-[#94a3b8] text-sm font-light">No items available at this time.</p>
                <p className="text-[#cbd5e1] text-xs mt-1">Check back soon for our curated selection.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Reviews ── */}
        <section id="kind-notes" className="border-t border-[#e2e8f0] bg-[#f8fafc]/30">
          <div className="max-w-4xl mx-auto px-6 py-24">
            <div className="text-center mb-16">
              <h3 className="font-['Cabin_Grotesk',sans-serif] text-3xl font-bold text-[#1e2937] tracking-tight">
                Kind Notes
              </h3>
              <p className="text-[#94a3b8] text-sm mt-2 font-light">What people are saying</p>
            </div>
            {store.reviews && store.reviews.length > 0 ? (
              <div className="space-y-0">
                {store.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
                {store.reviews_count > store.reviews.length && (
                  <p className="text-center text-xs text-[#94a3b8] mt-8">
                    +{store.reviews_count - store.reviews.length} more reviews
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-[#e2e8f0] rounded-xl bg-white">
                <Quote size={28} className="mx-auto text-[#e2e8f0] mb-4" />
                <p className="text-[#94a3b8] text-sm font-light">No reviews yet. Be the first to leave a note.</p>
                <p className="text-[#cbd5e1] text-xs mt-1">Your kind words mean the world to us.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Staff ── */}
        <section id="people" className="border-t border-[#e2e8f0]">
          <div className="max-w-2xl mx-auto px-6 py-24">
            <div className="text-center mb-16">
              <h3 className="font-['Cabin_Grotesk',sans-serif] text-3xl font-bold text-[#1e2937] tracking-tight">
                People
              </h3>
              <p className="text-[#94a3b8] text-sm mt-2 font-light">The faces behind the food</p>
            </div>
            {store.staff && store.staff.length > 0 ? (
              <div className="space-y-0">
                {store.staff.map((member, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-5 border-b border-[#e2e8f0] last:border-b-0 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center group-hover:border-[#1e2937] transition-colors">
                        <span className="text-[10px] font-bold text-[#94a3b8] group-hover:text-[#1e2937] transition-colors">
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <p className="font-medium text-[#1e2937] text-sm">{member.name}</p>
                    </div>
                    <p className="text-sm text-[#64748b] font-light">{member.role}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-[#e2e8f0] rounded-xl bg-[#f8fafc]/50">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center mb-4">
                  <span className="text-[#94a3b8] text-xs font-bold">TM</span>
                </div>
                <p className="text-[#94a3b8] text-sm font-light">Meet our team soon.</p>
                <p className="text-[#cbd5e1] text-xs mt-1">We&apos;re assembling a remarkable crew.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Hours ── */}
        <section id="hours" className="border-t border-[#e2e8f0]">
          <div className="max-w-xl mx-auto px-6 py-24">
            <h3 className="font-['Cabin_Grotesk',sans-serif] text-3xl font-bold text-[#1e2937] mb-16 tracking-tight text-center">
              Hours
            </h3>
            {days.length > 0 ? (
              <div className="space-y-3">
                {days.map(([day, h]) => (
                  <div key={day} className="flex justify-between items-center text-sm py-2">
                    <span className="text-[#1e2937] font-medium w-20">{dayLabels[day] || day}</span>
                    <span className="text-[#64748b] font-light">
                      {h.open} — {h.close}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-[#e2e8f0] rounded-xl">
                <Clock size={24} className="mx-auto text-[#94a3b8] mb-3" />
                <p className="text-[#94a3b8] text-sm font-light">Opening hours not yet listed.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="reach" className="border-t border-[#e2e8f0] bg-[#f8fafc]/30">
          <div className="max-w-4xl mx-auto px-6 py-24">
            <div className="text-center mb-16">
              <h3 className="font-['Cabin_Grotesk',sans-serif] text-3xl font-bold text-[#1e2937] tracking-tight">
                Reach
              </h3>
              <p className="text-[#94a3b8] text-sm mt-2 font-light">We&apos;d love to hear from you</p>
            </div>
            {store.phone || store.email || store.address ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {store.phone && (
                  <div className="text-center p-6 rounded-xl border border-[#e2e8f0] bg-white hover:border-[#38bdf8]/30 transition-colors">
                    <div className="w-10 h-10 mx-auto rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center mb-4">
                      <Phone size={16} className="text-[#64748b]" />
                    </div>
                    <p className="text-xs text-[#94a3b8] font-medium uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-sm text-[#1e2937] font-medium">{store.phone}</p>
                  </div>
                )}
                {store.email && (
                  <div className="text-center p-6 rounded-xl border border-[#e2e8f0] bg-white hover:border-[#38bdf8]/30 transition-colors">
                    <div className="w-10 h-10 mx-auto rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center mb-4">
                      <Mail size={16} className="text-[#64748b]" />
                    </div>
                    <p className="text-xs text-[#94a3b8] font-medium uppercase tracking-wider mb-1">Email</p>
                    <p className="text-sm text-[#1e2937] font-medium break-all">{store.email}</p>
                  </div>
                )}
                {store.address && (
                  <div className="text-center p-6 rounded-xl border border-[#e2e8f0] bg-white hover:border-[#38bdf8]/30 transition-colors">
                    <div className="w-10 h-10 mx-auto rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center mb-4">
                      <MapPin size={16} className="text-[#64748b]" />
                    </div>
                    <p className="text-xs text-[#94a3b8] font-medium uppercase tracking-wider mb-1">Address</p>
                    <p className="text-sm text-[#1e2937] font-medium">{store.address}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-[#e2e8f0] rounded-xl bg-white">
                <Mail size={20} className="mx-auto text-[#cbd5e1] mb-3" />
                <p className="text-[#94a3b8] text-sm font-light">Contact information coming soon.</p>
                <p className="text-[#cbd5e1] text-xs mt-1">We&apos;ll be here when you need us.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        {onShopNow && (
          <section className="border-t border-[#e2e8f0] bg-[#f8fafc]/50">
            <div className="max-w-4xl mx-auto px-6 py-20 text-center">
              <h3 className="font-['Cabin_Grotesk',sans-serif] text-2xl font-bold text-[#1e2937] tracking-tight">
                Ready to order?
              </h3>
              <p className="text-[#64748b] text-sm mt-2 font-light max-w-md mx-auto">
                Browse our selection and place your order in minutes.
              </p>
              <button
                onClick={onShopNow}
                className="mt-6 px-8 py-3 rounded-full bg-[#1e2937] text-white text-sm font-medium hover:bg-[#334155] transition-colors"
              >
                Start Order
              </button>
            </div>
          </section>
        )}

        {/* ── Footer ── */}
        <footer className="border-t border-[#e2e8f0] bg-[#f8fafc]/30">
          <div className="max-w-6xl mx-auto px-6 py-14">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <h4 className="font-['Cabin_Grotesk',sans-serif] text-lg font-bold text-[#1e2937]">{store.name}</h4>
                {store.description && (
                  <p className="mt-2 text-sm text-[#64748b] font-light leading-relaxed max-w-sm">{store.description}</p>
                )}
                <div className="flex items-center gap-2 mt-4">
                  {store.phone && <span className="text-xs text-[#94a3b8]">{store.phone}</span>}
                  {store.phone && store.email && <span className="text-[#e2e8f0]">/</span>}
                  {store.email && <span className="text-xs text-[#94a3b8]">{store.email}</span>}
                </div>
              </div>
              <div>
                <h5 className="text-xs font-semibold text-[#1e2937] uppercase tracking-wider mb-4">Navigate</h5>
                <ul className="space-y-2.5 text-sm text-[#64748b]">
                  <li><a href="#selection" className="hover:text-[#1e2937] transition-colors">Selection</a></li>
                  <li><a href="#kind-notes" className="hover:text-[#1e2937] transition-colors">Kind Notes</a></li>
                  <li><a href="#people" className="hover:text-[#1e2937] transition-colors">People</a></li>
                  <li><a href="#hours" className="hover:text-[#1e2937] transition-colors">Hours</a></li>
                </ul>
              </div>
              <div>
                <h5 className="text-xs font-semibold text-[#1e2937] uppercase tracking-wider mb-4">Contact</h5>
                <ul className="space-y-2.5 text-sm text-[#64748b]">
                  {store.phone && <li><a href={`tel:${store.phone}`} className="hover:text-[#1e2937] transition-colors">{store.phone}</a></li>}
                  {store.email && <li><a href={`mailto:${store.email}`} className="hover:text-[#1e2937] transition-colors">{store.email}</a></li>}
                  {store.address && <li className="text-xs">{store.address}</li>}
                  {!store.phone && !store.email && !store.address && (
                    <li className="text-xs text-[#cbd5e1]">Details coming soon</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-[#e2e8f0] flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-[#94a3b8] font-light">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
              <p className="text-[10px] text-[#cbd5e1] font-light">
                Crafted with care
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
