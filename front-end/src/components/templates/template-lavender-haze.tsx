'use client'

import { useState } from 'react'
import {
  Menu, X, ShoppingCart, Clock, MapPin, Phone, Mail, Star,
} from 'lucide-react'
import type { TemplateStore } from './types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface TemplateProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DAY_LABELS: Record<string, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
  thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
}

const DOT_COLORS = ['#f472b6', '#a855f7', '#c084fc', '#e879f9', '#f0abfc', '#d8b4fe', '#c4b5fd']

export function LavenderHazeTemplate({
  store,
  themeColors,
  onAddToCart,
  onShopNow,
}: TemplateProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  const c = {
    primary: themeColors?.primary || '#a855f7',
    bg: themeColors?.background || '#faf5ff',
    text: themeColors?.['dark-text'] || '#2e1065',
    secondary: themeColors?.secondary || '#c084fc',
    pink: themeColors?.pink || '#f472b6',
  }

  const foods = store.foods ?? []
  const reviews = store.reviews ?? []
  const staff = store.staff ?? []
  const hours = store.opening_hours
  const hasHours = hours && Object.keys(hours).length > 0
  const contactItems = [
    { icon: Phone, label: 'Phone', value: store.phone },
    { icon: Mail, label: 'Email', value: store.email },
    { icon: MapPin, label: 'Address', value: store.address },
  ].filter((i) => i.value)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: store.name,
    description: store.description,
    address: store.address ? { '@type': 'PostalAddress', streetAddress: store.address } : undefined,
    telephone: store.phone,
    email: store.email,
    image: getImageUrl(store.cover_image || store.logo),
    servesCuisine: 'Italian',
    review: reviews.length > 0
      ? reviews.slice(0, 5).map((r) => ({
          '@type': 'Review',
          reviewRating: { '@type': 'Rating', ratingValue: r.rating },
          author: { '@type': 'Person', name: r.user },
          reviewBody: r.comment,
        }))
      : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{`
        :root {
          --haze-primary: ${c.primary};
          --haze-bg: ${c.bg};
          --haze-text: ${c.text};
          --haze-secondary: ${c.secondary};
          --haze-pink: ${c.pink};
        }
        .orb-left::before {
          content: '';
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%);
          top: -100px;
          left: -100px;
          pointer-events: none;
          filter: blur(60px);
        }
        .orb-right::after {
          content: '';
          position: absolute;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(244,114,182,0.12) 0%, transparent 70%);
          bottom: -80px;
          right: -80px;
          pointer-events: none;
          filter: blur(50px);
        }
      `}</style>

      <div className="min-h-screen" style={{ background: c.bg, color: c.text }}>
        {/* ── NAVBAR ── */}
        <nav
          className="sticky top-0 z-50 border-b"
          style={{
            background: 'rgba(250, 245, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderColor: 'rgba(168, 85, 247, 0.2)',
          }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              {store.logo && (
                <img
                  src={getImageUrl(store.logo) ?? ''}
                  alt={store.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              )}
              <span
                className="text-xl font-semibold tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif", color: c.text }}
              >
                {store.name}
              </span>
            </div>

            <button
              className="flex items-center justify-center rounded-full p-2 sm:hidden"
              style={{ background: 'rgba(168,85,247,0.1)' }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} style={{ color: c.primary }} /> : <Menu size={22} style={{ color: c.primary }} />}
            </button>

            <div className="hidden items-center gap-6 sm:flex">
              {['Sweet Treats', 'Dreamy Words', 'Dream Team', 'Hours', 'Reach Out'].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm font-medium transition-all hover:opacity-70"
                    style={{ fontFamily: "'Inter', sans-serif", color: c.text }}
                  >
                    {item}
                  </a>
                ),
              )}
              <button
                onClick={onShopNow}
                className="rounded-full px-6 py-2.5 text-sm font-medium transition-all hover:opacity-90"
                style={{
                  background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
                  color: '#fff',
                }}
              >
                Order Now
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div
              className="border-t px-4 pb-6 pt-2 sm:hidden"
              style={{
                borderColor: 'rgba(168,85,247,0.2)',
                background: 'rgba(250, 245, 255, 0.95)',
              }}
            >
              <div className="flex flex-col gap-3">
                {['Sweet Treats', 'Dreamy Words', 'Dream Team', 'Hours', 'Reach Out'].map(
                  (item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm font-medium"
                      style={{ fontFamily: "'Inter', sans-serif", color: c.text }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item}
                    </a>
                  ),
                )}
                <button
                  onClick={() => {
                    setMobileOpen(false)
                    onShopNow?.()
                  }}
                  className="mt-2 rounded-full px-6 py-2.5 text-sm font-medium"
                  style={{
                    background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
                    color: '#fff',
                  }}
                >
                  Order Now
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* ── HERO ── */}
        <section
          className="relative overflow-hidden px-4 py-28 text-center sm:px-6 lg:px-8"
          style={{
            background: `linear-gradient(135deg, ${c.primary} 0%, ${c.secondary} 50%, ${c.pink} 100%)`,
            color: '#fff',
          }}
        >
          <div className="relative z-10 mx-auto max-w-3xl">
            <h1
              className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {store.name || 'Sweet Dreams'}
            </h1>
            <p
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed opacity-90"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
            >
              {store.description || 'Indulge in our handcrafted treats made with love and the finest ingredients.'}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button
                onClick={onShopNow}
                className="rounded-full px-10 py-3 text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: '#fff', color: c.primary }}
              >
                Explore Menu
              </button>
              <button
                onClick={onShopNow}
                className="rounded-full border-2 px-10 py-3 text-sm font-semibold transition-all hover:opacity-90"
                style={{ borderColor: '#fff', color: '#fff', background: 'transparent' }}
              >
                Order Now
              </button>
            </div>
          </div>
        </section>

        {/* ── FOODS: SWEET TREATS ── */}
        <section
          id="sweet-treats"
          className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
        >
          <div className="orb-left orb-right relative">
            <div className="relative z-10">
              <div className="mb-12 text-center">
                <h2
                  className="text-4xl font-bold sm:text-5xl"
                  style={{ fontFamily: "'Playfair Display', serif", color: c.text }}
                >
                  Sweet Treats
                </h2>
                <div
                  className="mx-auto mt-3 h-1 w-24 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${c.primary}, ${c.pink})` }}
                />
              </div>

              {foods.length === 0 ? (
                <div className="rounded-3xl px-8 py-16 text-center" style={{ background: 'rgba(168,85,247,0.06)' }}>
                  <p
                    className="text-lg font-medium"
                    style={{ fontFamily: "'Playfair Display', serif", color: c.text, opacity: 0.6 }}
                  >
                    Our sweet treats are being prepared
                  </p>
                  <p className="mt-2 text-sm" style={{ fontFamily: "'Inter', sans-serif", color: c.text, opacity: 0.4 }}>
                    Check back soon for fresh delights!
                  </p>
                </div>
              ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {foods.map((food) => (
                    <div
                      key={food.id}
                      className="group overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1"
                      style={{
                        background: '#fff',
                        boxShadow: '0 4px 20px rgba(168,85,247,0.08)',
                      }}
                    >
                      {food.image && (
                        <div className="relative overflow-hidden">
                          <img
                            src={getImageUrl(food.image) ?? undefined}
                            alt={food.name}
                            className="h-52 w-full rounded-2xl object-cover"
                          />
                          {food.is_offer && (
                            <span
                              className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold"
                              style={{ background: c.pink, color: '#fff' }}
                            >
                              Offer
                            </span>
                          )}
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2">
                          <h3
                            className="text-lg font-semibold"
                            style={{ fontFamily: "'Playfair Display', serif", color: c.text }}
                          >
                            {food.name}
                          </h3>
                          <span
                            className="whitespace-nowrap text-lg font-bold"
                            style={{ fontFamily: "'Inter', sans-serif", color: c.primary }}
                          >
                            {formatFoodPrice(food, currency)}
                          </span>
                        </div>
                        {food.description && (
                          <p
                            className="mt-2 text-sm leading-relaxed"
                            style={{ fontFamily: "'Inter', sans-serif", color: c.text, opacity: 0.6 }}
                          >
                            {food.description}
                          </p>
                        )}
                        <div className="mt-4 flex items-center justify-between">
                          {food.cooking_time && (
                            <span
                              className="flex items-center gap-1 text-xs"
                              style={{ fontFamily: "'Inter', sans-serif", color: c.text, opacity: 0.5 }}
                            >
                              <Clock size={14} />
                              {food.cooking_time} min
                            </span>
                          )}
                          <button
                            data-add-to-cart={food.id}
                            onClick={() => onAddToCart?.(food.id)}
                            className="ml-auto flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all hover:opacity-90"
                            style={{
                              background: `linear-gradient(135deg, ${c.primary}, ${c.pink})`,
                              color: '#fff',
                            }}
                          >
                            <ShoppingCart size={14} />
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── REVIEWS: DREAMY WORDS ── */}
        <section
          id="dreamy-words"
          className="px-4 py-24 sm:px-6 lg:px-8"
          style={{ background: 'rgba(168,85,247,0.04)' }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2
                className="text-4xl font-bold sm:text-5xl"
                style={{ fontFamily: "'Playfair Display', serif", color: c.text }}
              >
                Dreamy Words
              </h2>
              <div
                className="mx-auto mt-3 h-1 w-24 rounded-full"
                style={{ background: `linear-gradient(90deg, ${c.primary}, ${c.pink})` }}
              />
            </div>

            {reviews.length === 0 ? (
              <div className="rounded-3xl px-8 py-16 text-center" style={{ background: '#fff' }}>
                <p
                  className="text-lg font-medium"
                  style={{ fontFamily: "'Playfair Display', serif", color: c.text, opacity: 0.6 }}
                >
                  No dreamy words yet
                </p>
                <p className="mt-2 text-sm" style={{ fontFamily: "'Inter', sans-serif", color: c.text, opacity: 0.4 }}>
                  Be the first to share your experience!
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {reviews.map((r, i) => {
                  const borderColors = [c.pink, c.primary, c.secondary]
                  return (
                    <div
                      key={r.id}
                      className="rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"
                      style={{
                        background: '#fff',
                        borderLeft: `4px solid ${borderColors[i % borderColors.length]}`,
                        boxShadow: '0 2px 16px rgba(168,85,247,0.06)',
                      }}
                    >
                      <div className="mb-3 flex gap-1">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star
                            key={si}
                            size={16}
                            fill={si < r.rating ? c.primary : 'none'}
                            color={si < r.rating ? c.primary : '#e5e7eb'}
                          />
                        ))}
                      </div>
                      <p
                        className="mb-4 text-sm leading-relaxed"
                        style={{ fontFamily: "'Inter', sans-serif", color: c.text, opacity: 0.7 }}
                      >
                        &ldquo;{r.comment || 'No comment provided.'}&rdquo;
                      </p>
                      <div className="flex items-center gap-3">
                        {r.avatar ? (
                          <img src={getImageUrl(r.avatar) ?? undefined} alt={r.user} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.pink})` }}>
                            <span className="text-sm font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{r.user.charAt(0)}</span>
                          </div>
                        )}
                        <p
                          className="text-sm font-medium"
                          style={{ fontFamily: "'Playfair Display', serif", color: c.primary }}
                        >
                          {r.user}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── STAFF: DREAM TEAM ── */}
        {staff.length > 0 && (
          <section
            id="dream-team"
            className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
          >
            <div className="mb-12 text-center">
              <h2
                className="text-4xl font-bold sm:text-5xl"
                style={{ fontFamily: "'Playfair Display', serif", color: c.text }}
              >
                Dream Team
              </h2>
              <div
                className="mx-auto mt-3 h-1 w-24 rounded-full"
                style={{ background: `linear-gradient(90deg, ${c.primary}, ${c.pink})` }}
              />
            </div>

            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {staff.map((m, i) => (
                <div
                  key={i}
                  className="group flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2"
                >
                  <div
                    className="mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full p-1"
                    style={{
                      background: `linear-gradient(135deg, ${c.primary}, ${c.pink})`,
                    }}
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                      <span
                        className="text-3xl font-bold"
                        style={{ fontFamily: "'Playfair Display', serif", color: c.primary }}
                      >
                        {m.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ fontFamily: "'Playfair Display', serif", color: c.text }}
                  >
                    {m.name}
                  </h3>
                  <p
                    className="mt-1 text-sm"
                    style={{ fontFamily: "'Inter', sans-serif", color: c.primary, opacity: 0.7 }}
                  >
                    {m.role}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── HOURS ── */}
        {hasHours && (
          <section
            id="hours"
            className="px-4 py-24 sm:px-6 lg:px-8"
            style={{ background: 'rgba(168,85,247,0.04)' }}
          >
            <div className="mx-auto max-w-2xl">
              <div className="mb-12 text-center">
                <h2
                  className="text-4xl font-bold sm:text-5xl"
                  style={{ fontFamily: "'Playfair Display', serif", color: c.text }}
                >
                  Hours
                </h2>
                <div
                  className="mx-auto mt-3 h-1 w-24 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${c.primary}, ${c.pink})` }}
                />
              </div>

              <div
                className="rounded-3xl p-8"
                style={{
                  background: '#fff',
                  boxShadow: '0 4px 24px rgba(168,85,247,0.08)',
                }}
              >
                {DAY_ORDER.map((day, i) => {
                  const slot = hours?.[day]
                  return (
                    <div
                      key={day}
                      className="flex items-center justify-between border-b py-3 last:border-0"
                      style={{ borderColor: 'rgba(168,85,247,0.1)' }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ background: slot ? DOT_COLORS[i % DOT_COLORS.length] : '#d1d5db' }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ fontFamily: "'Inter', sans-serif", color: c.text }}
                        >
                          {DAY_LABELS[day] || day}
                        </span>
                      </div>
                      <span
                        className="text-sm"
                        style={{ fontFamily: "'Inter', sans-serif", color: c.text, opacity: slot ? 0.7 : 0.4 }}
                      >
                        {slot ? `${slot.open} – ${slot.close}` : 'Closed'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── CONTACT: REACH OUT ── */}
        {contactItems.length > 0 && (
          <section
            id="reach-out"
            className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
          >
            <div className="mb-12 text-center">
              <h2
                className="text-4xl font-bold sm:text-5xl"
                style={{ fontFamily: "'Playfair Display', serif", color: c.text }}
              >
                Reach Out
              </h2>
              <div
                className="mx-auto mt-3 h-1 w-24 rounded-full"
                style={{ background: `linear-gradient(90deg, ${c.primary}, ${c.pink})` }}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {contactItems.map((item, i) => (
                <div
                  key={i}
                  className="rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: '#fff',
                    boxShadow: '0 4px 20px rgba(168,85,247,0.06)',
                  }}
                >
                  <div
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${c.primary}, ${c.pink})`,
                    }}
                  >
                    <item.icon size={22} color="#fff" />
                  </div>
                  <h3
                    className="mb-2 text-sm font-semibold uppercase tracking-wider"
                    style={{ fontFamily: "'Inter', sans-serif", color: c.primary }}
                  >
                    {item.label}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ fontFamily: "'Inter', sans-serif", color: c.text, opacity: 0.7 }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── FOOTER ── */}
        <footer
          className="rounded-t-3xl px-4 py-10 text-center sm:px-6 lg:px-8"
          style={{
            background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
            color: '#fff',
          }}
        >
          <p
            className="text-sm font-light"
            style={{ fontFamily: "'Inter', sans-serif", opacity: 0.8 }}
          >
            &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
          </p>
          <p
            className="mt-2 text-xs"
            style={{ fontFamily: "'Inter', sans-serif", opacity: 0.5 }}
          >
            Made with love and a sprinkle of magic ✨
          </p>
        </footer>
      </div>
    </>
  )
}
