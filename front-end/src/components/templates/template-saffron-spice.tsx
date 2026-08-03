'use client'

import { useState } from 'react'
import { Menu, X, Phone, Mail, MapPin, Clock, ChevronRight, Quote } from 'lucide-react'
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

export function SaffronSpiceTemplate({ store, themeColors, onAddToCart, onShopNow }: TemplateProps) {
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
    monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday',
    friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
  }

  function ReviewCard({ review }: { review: ReviewData }) {
    return (
      <div className="bg-[#fff8f0] border border-[#fcd34d]/30 rounded-lg p-6 relative">
        <Quote size={32} className="absolute top-3 left-3 text-[#fcd34d]/30" />
        <div className="mt-4">
          <StarRating rating={review.rating} size={14} activeColor="#fcd34d" inactiveColor="#d4a373" />
          {review.comment && (
            <p className="mt-3 text-sm text-[#292524] leading-relaxed italic">"{review.comment}"</p>
          )}
        </div>
        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#fcd34d]/20">
          {review.avatar ? (
            <img
              src={getImageUrl(review.avatar) ?? undefined}
              alt={review.user}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#c2410c] flex items-center justify-center text-white text-xs font-bold">
              {review.user.charAt(0).toUpperCase()}
            </div>
          )}
          <p className="text-sm font-semibold text-[#292524]">{review.user}</p>
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
        @import url('https://fonts.googleapis.com/css2?family=Martel:wght@400;600;700;900&family=Inter:wght@300;400;500;600&display=swap');

        :root {
          --primary: #c2410c;
          --bg: #fef9ef;
          --secondary: #d97706;
          --gold: #fcd34d;
          --text: #292524;
        }

        body {
          font-family: 'Inter', sans-serif;
          background: #fef9ef;
          color: #292524;
        }
      `}</style>
      {themeColors && (
        <style>{`
          :root {
            ${Object.entries(themeColors).map(([k, v]) => `--${k}: ${v};`).join('\n')}
          }
        `}</style>
      )}

      <div className="min-h-screen bg-[#fef9ef] font-[family-name:var(--font-body,Inter)] antialiased">
        {/* Decorative top border */}
        <div className="h-1 bg-gradient-to-r from-[#c2410c] via-[#fcd34d] to-[#c2410c]" />

        {/* ── Navbar ── */}
        <nav className="bg-[#292524] border-b-2 border-[#fcd34d]/40">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {store.logo ? (
                <img src={getImageUrl(store.logo) || ''} alt={store.name} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-[#c2410c] flex items-center justify-center">
                  <span className="text-[#fcd34d] text-xs font-bold">{store.name.charAt(0)}</span>
                </div>
              )}
              <h1 className="font-['Martel',serif] text-lg font-bold text-[#fef9ef] tracking-wide">
                {store.name}
              </h1>
            </div>
            <div className="hidden lg:flex items-center gap-8 text-sm">
              <a href="#spice-menu" className="text-[#fcd34d]/80 hover:text-[#fcd34d] transition-colors">Spice Menu</a>
              <a href="#tales" className="text-[#fcd34d]/80 hover:text-[#fcd34d] transition-colors">Tales</a>
              <a href="#masters" className="text-[#fcd34d]/80 hover:text-[#fcd34d] transition-colors">Masters</a>
              <a href="#timings" className="text-[#fcd34d]/80 hover:text-[#fcd34d] transition-colors">Timings</a>
              <a href="#connect" className="text-[#fcd34d]/80 hover:text-[#fcd34d] transition-colors">Connect</a>
              {onShopNow && (
                <button
                  onClick={onShopNow}
                  className="px-5 py-2 rounded-md bg-[#c2410c] text-[#fef9ef] font-semibold text-sm hover:bg-[#d97706] transition-colors border border-[#fcd34d]/30"
                >
                  Order Now
                </button>
              )}
            </div>
            <button
              className="lg:hidden p-2 -mr-2 text-[#fcd34d]/80 hover:text-[#fcd34d]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          {mobileOpen && (
            <div className="lg:hidden border-t border-[#fcd34d]/20 px-6 py-4 space-y-3 text-sm text-[#fcd34d]/80 bg-[#292524]">
              <a href="#spice-menu" className="block hover:text-[#fcd34d]">Spice Menu</a>
              <a href="#tales" className="block hover:text-[#fcd34d]">Tales</a>
              <a href="#masters" className="block hover:text-[#fcd34d]">Masters</a>
              <a href="#timings" className="block hover:text-[#fcd34d]">Timings</a>
              <a href="#connect" className="block hover:text-[#fcd34d]">Connect</a>
              {onShopNow && (
                <button
                  onClick={onShopNow}
                  className="w-full mt-2 px-5 py-2 rounded-md bg-[#c2410c] text-[#fef9ef] font-semibold text-sm"
                >
                  Order Now
                </button>
              )}
            </div>
          )}
        </nav>

        {/* ── Hero ── */}
        <section className="bg-gradient-to-br from-[#c2410c] via-[#d97706] to-[#b45309] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fcd34d 0px, #fcd34d 1px, transparent 1px, transparent 12px)' }} />
          <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 relative z-10 text-center">
            <div className="inline-block border-2 border-[#fcd34d]/60 rounded-full px-5 py-1 mb-6">
              <span className="text-[#fcd34d] text-xs uppercase tracking-[0.2em] font-semibold">Welcome</span>
            </div>
            <h2 className="font-['Martel',serif] text-5xl md:text-7xl font-bold text-[#fef9ef] leading-tight">
              {store.name}
            </h2>
            <div className="w-24 h-0.5 bg-[#fcd34d] mx-auto my-6" />
            <div className="w-16 h-0.5 bg-[#fcd34d] mx-auto my-2" />
            {store.description && (
              <p className="mt-6 text-lg text-[#fef9ef]/80 max-w-2xl mx-auto font-light leading-relaxed">
                {store.description}
              </p>
            )}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {onShopNow && (
                <button
                  onClick={onShopNow}
                  className="px-8 py-3 rounded-md bg-[#fcd34d] text-[#292524] font-bold text-sm uppercase tracking-wider hover:bg-[#fbbf24] transition-colors border-2 border-[#fcd34d]"
                >
                  Explore Menu
                </button>
              )}
              <a
                href="#spice-menu"
                className="px-8 py-3 rounded-md border-2 border-[#fcd34d]/60 text-[#fef9ef] text-sm font-semibold uppercase tracking-wider hover:bg-[#fef9ef]/10 transition-colors"
              >
                Our Spices
              </a>
            </div>
          </div>
        </section>

        {/* ── Foods ── */}
        <section id="spice-menu" className="bg-[#fef9ef]">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <div className="text-center mb-16">
              <h3 className="font-['Martel',serif] text-4xl font-bold text-[#292524]">Spice Menu</h3>
              <div className="w-16 h-0.5 bg-[#c2410c] mx-auto mt-4" />
            </div>
            {store.foods && store.foods.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.foods.map((food, idx) => (
                  <div
                    key={food.id}
                    className={cn(
                      'bg-[#fff8f0] rounded-lg overflow-hidden border-t-4',
                      idx % 3 === 0 ? 'border-t-[#c2410c]' : idx % 3 === 1 ? 'border-t-[#d97706]' : 'border-t-[#fcd34d]',
                      'shadow-sm hover:shadow-md transition-shadow'
                    )}
                  >
                    {food.image ? (
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={getImageUrl(food.image) ?? undefined}
                          alt={food.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                        {food.is_offer && (
                          <span className="absolute top-3 right-3 bg-[#c2410c] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            Offer
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="h-44 bg-gradient-to-br from-[#c2410c]/10 to-[#fcd34d]/10 flex items-center justify-center">
                        <span className="text-[#c2410c]/30 text-xs font-semibold uppercase tracking-wider">No Image</span>
                      </div>
                    )}
                    <div className="p-5">
                      <h4 className="font-['Martel',serif] text-lg font-bold text-[#292524]">{food.name}</h4>
                      {food.description && (
                        <p className="mt-1.5 text-sm text-[#57534e] leading-relaxed">{food.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#fcd34d]/20">
                        <p className="font-bold text-[#c2410c]">
                          {formatFoodPrice(food, currency)}
                        </p>
                        <div className="flex items-center gap-3">
                          {food.cooking_time && (
                            <span className="text-xs text-[#57534e]">{food.cooking_time} min</span>
                          )}
                          {onAddToCart && (
                            <button
                              data-add-to-cart={food.id}
                              onClick={() => onAddToCart(food.id)}
                              className="px-4 py-1.5 rounded text-xs font-semibold bg-[#c2410c] text-white hover:bg-[#d97706] transition-colors"
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
              <div className="text-center py-20 border-2 border-dashed border-[#c2410c]/20 rounded-xl bg-[#fff8f0]">
                <p className="text-[#c2410c]/50 text-lg font-['Martel',serif]">Our spices are being blended...</p>
                <p className="text-[#57534e]/40 text-sm mt-2">Check back soon for our aromatic offerings.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Reviews ── */}
        <section id="tales" className="bg-[#fff8f0] border-t-2 border-[#fcd34d]/20">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <div className="text-center mb-16">
              <h3 className="font-['Martel',serif] text-4xl font-bold text-[#292524]">Tales</h3>
              <div className="w-16 h-0.5 bg-[#c2410c] mx-auto mt-4" />
            </div>
            {store.reviews && store.reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-[#c2410c]/20 rounded-xl bg-[#fef9ef]">
                <Quote size={40} className="mx-auto text-[#c2410c]/20" />
                <p className="mt-4 text-[#c2410c]/50 text-lg font-['Martel',serif]">No tales yet...</p>
                <p className="text-[#57534e]/40 text-sm mt-1">Share your experience and be the first to tell your tale.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Staff ── */}
        <section id="masters" className="bg-[#fef9ef]">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <div className="text-center mb-16">
              <h3 className="font-['Martel',serif] text-4xl font-bold text-[#292524]">Masters</h3>
              <div className="w-16 h-0.5 bg-[#c2410c] mx-auto mt-4" />
            </div>
            {store.staff && store.staff.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {store.staff.map((member, idx) => (
                  <div key={idx} className="text-center group">
                    <div className="w-28 h-28 mx-auto rounded-full border-2 border-[#fcd34d]/40 p-1.5">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-[#c2410c] to-[#d97706] flex items-center justify-center">
                        <span className="text-[#fcd34d] text-2xl font-['Martel',serif] font-bold">
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 font-['Martel',serif] font-bold text-[#292524] text-sm">{member.name}</p>
                    <p className="text-xs text-[#57534e] mt-0.5 italic">{member.role}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-[#c2410c]/20 rounded-xl bg-[#fff8f0]">
                <p className="text-[#c2410c]/50 text-lg font-['Martel',serif]">Our masters are being revealed...</p>
                <p className="text-[#57534e]/40 text-sm mt-2">Meet the skilled hands behind the flavors soon.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Hours ── */}
        <section id="timings" className="bg-[#fff8f0] border-t-2 border-[#fcd34d]/20">
          <div className="max-w-2xl mx-auto px-6 py-24">
            <div className="text-center mb-16">
              <h3 className="font-['Martel',serif] text-4xl font-bold text-[#292524]">Timings</h3>
              <div className="w-16 h-0.5 bg-[#c2410c] mx-auto mt-4" />
            </div>
            {days.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-[#fcd34d]/30">
                <div className="bg-gradient-to-r from-[#c2410c] to-[#d97706] px-6 py-3">
                  <div className="flex justify-between items-center">
                    <span className="font-['Martel',serif] text-sm font-bold text-[#fef9ef] uppercase tracking-wider">Day</span>
                    <span className="font-['Martel',serif] text-sm font-bold text-[#fef9ef] uppercase tracking-wider">Hours</span>
                  </div>
                </div>
                <div className="divide-y divide-[#fcd34d]/20">
                  {days.map(([day, h], idx) => (
                    <div
                      key={day}
                      className={cn(
                        'flex justify-between items-center px-6 py-3.5 text-sm',
                        idx % 2 === 0 ? 'bg-[#fef9ef]' : 'bg-[#fff5e6]'
                      )}
                    >
                      <span className="font-semibold text-[#292524]">{dayLabels[day] || day}</span>
                      <span className="text-[#57534e]">
                        {h.open} — {h.close}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-[#c2410c]/20 rounded-xl bg-[#fef9ef]">
                <Clock size={32} className="mx-auto text-[#c2410c]/30" />
                <p className="mt-4 text-[#c2410c]/50 text-lg font-['Martel',serif]">Timings not yet announced</p>
                <p className="text-[#57534e]/40 text-sm mt-1">We&apos;re setting our schedule. Stay tuned.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="connect" className="bg-[#fef9ef]">
          <div className="max-w-6xl mx-auto px-6 py-24">
            <div className="text-center mb-16">
              <h3 className="font-['Martel',serif] text-4xl font-bold text-[#292524]">Connect</h3>
              <div className="w-16 h-0.5 bg-[#c2410c] mx-auto mt-4" />
            </div>
            {store.phone || store.email || store.address ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {store.phone && (
                  <div className="bg-[#fff8f0] border border-[#fcd34d]/30 rounded-lg p-6 text-center hover:border-[#c2410c]/40 transition-colors">
                    <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#c2410c] to-[#d97706] flex items-center justify-center mb-4">
                      <Phone size={20} className="text-[#fcd34d]" />
                    </div>
                    <p className="font-['Martel',serif] text-sm font-bold text-[#292524] mb-1">Phone</p>
                    <p className="text-sm text-[#57534e]">{store.phone}</p>
                  </div>
                )}
                {store.email && (
                  <div className="bg-[#fff8f0] border border-[#fcd34d]/30 rounded-lg p-6 text-center hover:border-[#c2410c]/40 transition-colors">
                    <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#c2410c] to-[#d97706] flex items-center justify-center mb-4">
                      <Mail size={20} className="text-[#fcd34d]" />
                    </div>
                    <p className="font-['Martel',serif] text-sm font-bold text-[#292524] mb-1">Email</p>
                    <p className="text-sm text-[#57534e]">{store.email}</p>
                  </div>
                )}
                {store.address && (
                  <div className="bg-[#fff8f0] border border-[#fcd34d]/30 rounded-lg p-6 text-center hover:border-[#c2410c]/40 transition-colors">
                    <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#c2410c] to-[#d97706] flex items-center justify-center mb-4">
                      <MapPin size={20} className="text-[#fcd34d]" />
                    </div>
                    <p className="font-['Martel',serif] text-sm font-bold text-[#292524] mb-1">Address</p>
                    <p className="text-sm text-[#57534e]">{store.address}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-[#c2410c]/20 rounded-xl bg-[#fff8f0]">
                <p className="text-[#c2410c]/50 text-lg font-['Martel',serif]">Ways to connect coming soon</p>
                <p className="text-[#57534e]/40 text-sm mt-2">We&apos;re setting up our contact channels.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-[#292524] border-t-2 border-[#fcd34d]/30">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div>
                <h4 className="font-['Martel',serif] text-lg font-bold text-[#fcd34d]">{store.name}</h4>
                {store.description && (
                  <p className="mt-2 text-xs text-[#a8a29e] leading-relaxed">{store.description}</p>
                )}
              </div>
              <div>
                <h5 className="font-['Martel',serif] text-sm font-bold text-[#fef9ef] uppercase tracking-wider mb-3">Links</h5>
                <ul className="space-y-2 text-sm text-[#a8a29e]">
                  <li><a href="#spice-menu" className="hover:text-[#fcd34d] transition-colors">Spice Menu</a></li>
                  <li><a href="#tales" className="hover:text-[#fcd34d] transition-colors">Tales</a></li>
                  <li><a href="#masters" className="hover:text-[#fcd34d] transition-colors">Masters</a></li>
                  <li><a href="#timings" className="hover:text-[#fcd34d] transition-colors">Timings</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-['Martel',serif] text-sm font-bold text-[#fef9ef] uppercase tracking-wider mb-3">Connect</h5>
                <ul className="space-y-2 text-sm text-[#a8a29e]">
                  {store.phone && <li>{store.phone}</li>}
                  {store.email && <li>{store.email}</li>}
                  {store.address && <li className="text-xs">{store.address}</li>}
                </ul>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-[#fcd34d]/10 text-center">
              <p className="text-xs text-[#a8a29e]">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
