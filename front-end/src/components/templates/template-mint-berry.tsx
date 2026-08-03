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

export function MintBerryTemplate({ store, themeColors, onAddToCart, onShopNow }: TemplateProps) {
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

  function ReviewCard({ review, variant }: { review: ReviewData; variant: 'mint' | 'berry' }) {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
        <div className={cn('h-2', variant === 'mint' ? 'bg-[#14b8a6]' : 'bg-[#ec4899]')} />
        <div className="p-5">
          <StarRating rating={review.rating} size={14} activeColor="#fbbf24" inactiveColor="#cbd5e1" />
          {review.comment && (
            <p className="mt-2 text-sm text-[#475569] leading-relaxed italic">"{review.comment}"</p>
          )}
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#f1f5f9]">
            {review.avatar ? (
              <img
                src={getImageUrl(review.avatar) ?? undefined}
                alt={review.user}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold',
                variant === 'mint' ? 'bg-[#14b8a6]' : 'bg-[#ec4899]'
              )}>
                {review.user.charAt(0).toUpperCase()}
              </div>
            )}
            <p className="font-bold text-[#1e293b] text-sm">{review.user}</p>
          </div>
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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

        :root {
          --mint: #14b8a6;
          --berry: #ec4899;
          --purple: #8b5cf6;
          --light: #f0fdf4;
        }

        body {
          font-family: 'Inter', sans-serif;
          background: #f0fdf4;
          color: #1e293b;
        }
      `}</style>
      {themeColors && (
        <style>{`
          :root {
            ${Object.entries(themeColors).map(([k, v]) => `--${k}: ${v};`).join('\n')}
          }
        `}</style>
      )}

      <div className="min-h-screen bg-[#f0fdf4] font-[family-name:var(--font-body,Inter)] antialiased">
        {/* ── Navbar (glassmorphism) ── */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {store.logo ? (
                <img src={getImageUrl(store.logo) || ''} alt={store.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-[#14b8a6]/30" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#14b8a6] to-[#ec4899] flex items-center justify-center">
                  <span className="text-white font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold">{store.name.charAt(0)}</span>
                </div>
              )}
              <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#1e293b]">
                {store.name}
              </h1>
            </div>
            <div className="hidden lg:flex items-center gap-8 text-sm">
              <a href="#fresh-picks" className="text-[#475569] hover:text-[#14b8a6] font-semibold transition-colors">Fresh Picks</a>
              <a href="#raves" className="text-[#475569] hover:text-[#ec4899] font-semibold transition-colors">Raves</a>
              <a href="#team" className="text-[#475569] hover:text-[#8b5cf6] font-semibold transition-colors">Team</a>
              <a href="#hours" className="text-[#475569] hover:text-[#14b8a6] font-semibold transition-colors">Hours</a>
              <a href="#connect" className="text-[#475569] hover:text-[#ec4899] font-semibold transition-colors">Connect</a>
              {onShopNow && (
                <button
                  onClick={onShopNow}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-[#14b8a6] to-[#ec4899] text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md"
                >
                  Order Now
                </button>
              )}
            </div>
            <button
              className="lg:hidden p-2 -mr-2 text-[#475569] hover:text-[#1e293b]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          {mobileOpen && (
            <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-white/20 px-6 py-4 space-y-3 text-sm">
              <a href="#fresh-picks" className="block text-[#475569] hover:text-[#14b8a6] font-semibold">Fresh Picks</a>
              <a href="#raves" className="block text-[#475569] hover:text-[#ec4899] font-semibold">Raves</a>
              <a href="#team" className="block text-[#475569] hover:text-[#8b5cf6] font-semibold">Team</a>
              <a href="#hours" className="block text-[#475569] hover:text-[#14b8a6] font-semibold">Hours</a>
              <a href="#connect" className="block text-[#475569] hover:text-[#ec4899] font-semibold">Connect</a>
              {onShopNow && (
                <button
                  onClick={onShopNow}
                  className="w-full mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#14b8a6] to-[#ec4899] text-white font-bold text-xs uppercase"
                >
                  Order Now
                </button>
              )}
            </div>
          )}
        </nav>

        <div className="pt-16" />

        {/* ── Hero (split diagonal) ── */}
        <section className="relative overflow-hidden min-h-[70vh] flex">
          <div className="absolute inset-0 flex">
            <div className="w-1/2 bg-gradient-to-br from-[#14b8a6] to-[#0d9488] clip-path-diagonal-right" />
            <div className="w-1/2 bg-gradient-to-bl from-[#ec4899] to-[#db2777] clip-path-diagonal-left" />
          </div>
          <style>{`
            .clip-path-diagonal-right {
              clip-path: polygon(0 0, 100% 0, 80% 100%, 0 100%);
            }
            .clip-path-diagonal-left {
              clip-path: polygon(20% 0, 100% 0, 100% 100%, 0 100%);
            }
            @media (max-width: 768px) {
              .clip-path-diagonal-right {
                clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
              }
              .clip-path-diagonal-left {
                clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
              }
            }
          `}</style>
          <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative z-10 w-full">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#fbbf24]" />
                <span className="text-white text-xs font-semibold uppercase tracking-wider">Fresh & Vibrant</span>
              </div>
              <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[0.95] tracking-tight">
                {store.name}
              </h2>
              {store.description && (
                <p className="mt-6 text-lg md:text-xl text-white/80 max-w-xl mx-auto font-light leading-relaxed">
                  {store.description}
                </p>
              )}
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="px-8 py-3.5 rounded-full bg-white text-[#1e293b] font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm hover:bg-white/90 transition-colors shadow-xl"
                  >
                    Explore Menu
                  </button>
                )}
                <a
                  href="#fresh-picks"
                  className="px-8 py-3.5 rounded-full border-2 border-white/40 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
                >
                  Fresh Picks
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Foods ── */}
        <section id="fresh-picks" className="bg-[#f0fdf4]">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="flex items-center gap-3 mb-12">
              <div className="h-8 w-2 bg-gradient-to-b from-[#14b8a6] to-[#ec4899] rounded-full" />
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl md:text-4xl font-extrabold text-[#1e293b] tracking-tight">
                Fresh Picks
              </h3>
            </div>
            {store.foods && store.foods.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.foods.map((food, idx) => {
                  const accent = idx % 2 === 0 ? '#14b8a6' : '#ec4899'
                  const gradient = idx % 2 === 0
                    ? 'from-[#14b8a6] to-[#0d9488]'
                    : 'from-[#ec4899] to-[#db2777]'
                  return (
                    <div
                      key={food.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative h-48 overflow-hidden">
                        {food.image ? (
                          <img
                            src={getImageUrl(food.image) ?? undefined}
                            alt={food.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                            <span className="text-white/40 font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold uppercase">Fresh</span>
                          </div>
                        )}
                        <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${gradient}`} />
                        {food.is_offer && (
                          <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold uppercase bg-gradient-to-r ${gradient}`}>
                            Fresh Deal
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#1e293b]">{food.name}</h4>
                        {food.description && (
                          <p className="mt-1.5 text-sm text-[#64748b] leading-relaxed">{food.description}</p>
                        )}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f1f5f9]">
                          <p className={`font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold`}
                            style={{ color: accent }}>
                            {formatFoodPrice(food, currency)}
                          </p>
                          <div className="flex items-center gap-3">
                            {food.cooking_time && (
                              <span className="text-xs text-[#64748b]">{food.cooking_time} min</span>
                            )}
                            {onAddToCart && (
                              <button
                                data-add-to-cart={food.id}
                                onClick={() => onAddToCart(food.id)}
                                className={`px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${gradient} hover:opacity-90 transition-opacity shadow-sm`}
                              >
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-[#14b8a6]/20 rounded-2xl bg-white">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#14b8a6] to-[#ec4899] flex items-center justify-center mb-4">
                  <Clock size={24} className="text-white" />
                </div>
                <p className="text-[#14b8a6]/60 font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold">Fresh picks coming soon...</p>
                <p className="text-[#64748b]/40 text-sm mt-1">We&apos;re preparing something vibrant for you.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Reviews ── */}
        <section id="raves" className="bg-white">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="flex items-center gap-3 mb-12">
              <div className="h-8 w-2 bg-gradient-to-b from-[#ec4899] to-[#8b5cf6] rounded-full" />
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl md:text-4xl font-extrabold text-[#1e293b] tracking-tight">
                Raves
              </h3>
            </div>
            {store.reviews && store.reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {store.reviews.map((review, idx) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    variant={idx % 2 === 0 ? 'mint' : 'berry'}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-[#ec4899]/20 rounded-2xl bg-[#f0fdf4]">
                <Star size={36} className="mx-auto text-[#ec4899]/20" />
                <p className="mt-4 text-[#ec4899]/50 font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold">No raves yet...</p>
                <p className="text-[#64748b]/40 text-sm mt-1">Be the first to share the love.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Staff ── */}
        <section id="team" className="bg-[#f0fdf4]">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="flex items-center gap-3 mb-12">
              <div className="h-8 w-2 bg-gradient-to-b from-[#8b5cf6] to-[#14b8a6] rounded-full" />
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl md:text-4xl font-extrabold text-[#1e293b] tracking-tight">
                Team
              </h3>
            </div>
            {store.staff && store.staff.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {store.staff.map((member, idx) => {
                  const isMint = idx % 2 === 0
                  return (
                    <div key={idx} className="group text-center">
                      <div className="relative w-32 h-32 mx-auto rounded-2xl overflow-hidden shadow-sm">
                        <div className={cn(
                          'absolute inset-0',
                          isMint
                            ? 'bg-gradient-to-br from-[#14b8a6] to-[#0d9488]'
                            : 'bg-gradient-to-br from-[#ec4899] to-[#db2777]'
                        )} />
                        <div className={cn(
                          'absolute inset-0 opacity-30',
                          isMint
                            ? 'bg-gradient-to-tr from-[#ec4899]/40 to-transparent'
                            : 'bg-gradient-to-tr from-[#14b8a6]/40 to-transparent'
                        )} />
                        <div className="relative h-full flex items-center justify-center">
                          <span className="text-white font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold">
                            {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <p className="mt-3 font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#1e293b] text-sm">{member.name}</p>
                      <p className="text-xs text-[#64748b] mt-0.5 font-medium">{member.role}</p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-[#8b5cf6]/20 rounded-2xl bg-white">
                <p className="text-[#8b5cf6]/50 font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold">Meet the team soon</p>
                <p className="text-[#64748b]/40 text-sm mt-1">Our vibrant crew is getting ready.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Hours ── */}
        <section id="hours" className="bg-white">
          <div className="max-w-3xl mx-auto px-6 py-24">
            <div className="text-center mb-12">
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl md:text-4xl font-extrabold text-[#1e293b] tracking-tight">
                Hours
              </h3>
              <p className="text-[#64748b] text-sm mt-2">Come visit us</p>
            </div>
            {days.length > 0 ? (
              <div className="rounded-2xl overflow-hidden shadow-sm">
                {days.map(([day, h], idx) => (
                  <div
                    key={day}
                    className={cn(
                      'flex justify-between items-center px-6 py-4 text-sm',
                      idx % 2 === 0
                        ? 'bg-gradient-to-r from-[#14b8a6]/10 to-[#14b8a6]/5 text-[#1e293b]'
                        : 'bg-gradient-to-r from-[#ec4899]/10 to-[#ec4899]/5 text-[#1e293b]'
                    )}
                  >
                    <span className="font-['Plus_Jakarta_Sans',sans-serif] font-bold uppercase tracking-wider text-xs">
                      {dayLabels[day] || day}
                    </span>
                    <span className="font-semibold">
                      {h.open} — {h.close}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-[#14b8a6]/20 rounded-2xl bg-[#f0fdf4]">
                <Clock size={32} className="mx-auto text-[#14b8a6]/30" />
                <p className="mt-4 text-[#14b8a6]/50 font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold">Hours TBD</p>
                <p className="text-[#64748b]/40 text-sm mt-1">We&apos;re setting our vibrant schedule.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="connect" className="bg-[#f0fdf4]">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="flex items-center gap-3 mb-12">
              <div className="h-8 w-2 bg-gradient-to-b from-[#14b8a6] to-[#8b5cf6] rounded-full" />
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl md:text-4xl font-extrabold text-[#1e293b] tracking-tight">
                Connect
              </h3>
            </div>
            {store.phone || store.email || store.address ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {store.phone && (
                  <a href={`tel:${store.phone}`} className="bg-gradient-to-br from-[#14b8a6] to-[#0d9488] rounded-2xl p-6 text-white hover:shadow-lg transition-shadow group">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Phone size={20} className="text-white" />
                    </div>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm opacity-80 uppercase tracking-wider">Call</p>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold mt-1">{store.phone}</p>
                  </a>
                )}
                {store.email && (
                  <a href={`mailto:${store.email}`} className="bg-gradient-to-br from-[#ec4899] to-[#db2777] rounded-2xl p-6 text-white hover:shadow-lg transition-shadow group">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Mail size={20} className="text-white" />
                    </div>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm opacity-80 uppercase tracking-wider">Email</p>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold mt-1 break-all">{store.email}</p>
                  </a>
                )}
                {store.address && (
                  <div className="bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] rounded-2xl p-6 text-white hover:shadow-lg transition-shadow group">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <MapPin size={20} className="text-white" />
                    </div>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-sm opacity-80 uppercase tracking-wider">Visit</p>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold mt-1">{store.address}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-[#8b5cf6]/20 rounded-2xl bg-white">
                <p className="text-[#8b5cf6]/50 font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold">Connect with us soon</p>
                <p className="text-[#64748b]/40 text-sm mt-1">We&apos;re setting up our channels.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-[#0d9488] text-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold">{store.name}</h4>
                {store.description && (
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">{store.description}</p>
                )}
              </div>
              <div>
                <h5 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold uppercase tracking-wider text-white/80 mb-3">Links</h5>
                <ul className="space-y-2 text-sm text-white/60">
                  <li><a href="#fresh-picks" className="hover:text-white transition-colors">Fresh Picks</a></li>
                  <li><a href="#raves" className="hover:text-white transition-colors">Raves</a></li>
                  <li><a href="#team" className="hover:text-white transition-colors">Team</a></li>
                  <li><a href="#hours" className="hover:text-white transition-colors">Hours</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold uppercase tracking-wider text-white/80 mb-3">Social</h5>
                <div className="flex gap-3">
                  {store.phone && (
                    <a href={`tel:${store.phone}`} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ec4899]/30 transition-colors">
                      <Phone size={16} className="text-white/80" />
                    </a>
                  )}
                  {store.email && (
                    <a href={`mailto:${store.email}`} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#14b8a6]/30 transition-colors">
                      <Mail size={16} className="text-white/80" />
                    </a>
                  )}
                  <a href="#connect" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#8b5cf6]/30 transition-colors">
                    <MapPin size={16} className="text-white/80" />
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-white/40">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
