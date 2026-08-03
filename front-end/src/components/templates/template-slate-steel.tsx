'use client'

import { useState } from 'react'
import {
  Menu, X, ShoppingCart, Clock, MapPin, Phone, Mail, Star, Quote,
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
  monday: 'MON', tuesday: 'TUE', wednesday: 'WED',
  thursday: 'THU', friday: 'FRI', saturday: 'SAT', sunday: 'SUN',
}

export function SlateSteelTemplate({
  store,
  themeColors,
  onAddToCart,
  onShopNow,
}: TemplateProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { currency } = useCurrency()

  const c = {
    primary: themeColors?.primary || '#334155',
    accent: themeColors?.accent || '#f97316',
    dark: themeColors?.['dark-text'] || '#0f172a',
    bg: themeColors?.background || '#f8fafc',
    border: themeColors?.border || '#cbd5e1',
  }

  const foods = store.foods ?? []
  const reviews = store.reviews ?? []
  const staff = store.staff ?? []
  const hours = store.opening_hours
  const hasHours = hours && Object.keys(hours).length > 0
  const contactItems = [
    { icon: Phone, label: 'PHONE', value: store.phone },
    { icon: Mail, label: 'EMAIL', value: store.email },
    { icon: MapPin, label: 'ADDRESS', value: store.address },
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
    numberOfEmployees: staff.length > 0 ? staff.length : undefined,
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
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        :root {
          --steel-primary: ${c.primary};
          --steel-accent: ${c.accent};
          --steel-dark: ${c.dark};
          --steel-bg: ${c.bg};
          --steel-border: ${c.border};
        }
        .dot-grid {
          background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .hex-clip {
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
        }
      `}</style>

      <div className="min-h-screen" style={{ background: c.bg }}>
        <div className="dot-grid min-h-screen">
          {/* ── NAVBAR ── */}
          <nav
            className="sticky top-0 z-50"
            style={{ background: '#1e293b', color: '#fff' }}
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2">
                {store.logo && (
                  <img
                    src={getImageUrl(store.logo) ?? ''}
                    alt={store.name}
                    className="h-10 w-10 object-cover"
                    style={{ borderRadius: 0 }}
                  />
                )}
                <span
                  className="text-xl font-bold uppercase tracking-widest"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {store.name}
                </span>
              </div>

              <button
                className="flex items-center justify-center p-2 sm:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <div className="hidden items-center gap-8 sm:flex">
                {['Fuel Menu', 'Logs', 'Crew', 'Schedule', 'Connect'].map(
                  (item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm uppercase tracking-widest transition-colors hover:opacity-80"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: '#fff',
                      }}
                    >
                      {item}
                    </a>
                  ),
                )}
                <button
                  onClick={onShopNow}
                  className="px-5 py-2 text-sm font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
                  style={{
                    background: c.accent,
                    color: '#fff',
                    borderRadius: 0,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  Order Now
                </button>
              </div>
            </div>

            {mobileOpen && (
              <div
                className="border-t px-4 pb-4 pt-2 sm:hidden"
                style={{
                  background: '#1e293b',
                  borderColor: c.accent,
                }}
              >
                <div className="flex flex-col gap-3">
                  {['Fuel Menu', 'Logs', 'Crew', 'Schedule', 'Connect'].map(
                    (item) => (
                      <a
                        key={item}
                        href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-sm uppercase tracking-widest"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color: '#fff',
                        }}
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
                    className="px-5 py-2 text-sm font-bold uppercase tracking-widest"
                    style={{
                      background: c.accent,
                      color: '#fff',
                      borderRadius: 0,
                      fontFamily: "'JetBrains Mono', monospace",
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
            className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
              color: '#fff',
            }}
          >
            <div className="mx-auto max-w-7xl">
              <div className="max-w-2xl">
                <div
                  className="mb-4 h-1.5 w-20"
                  style={{ background: c.accent }}
                />
                <h1
                  className="text-5xl font-black leading-tight sm:text-6xl lg:text-7xl"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {store.name || 'Fuel Your Day'}
                </h1>
                <p
                  className="mt-6 max-w-xl text-lg leading-relaxed opacity-80"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {store.description || 'Industrial strength food for the modern worker.'}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <button
                    onClick={onShopNow}
                    className="px-8 py-3 text-sm font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
                    style={{
                      background: c.accent,
                      color: '#fff',
                      borderRadius: 0,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    View Menu
                  </button>
                  <button
                    onClick={onShopNow}
                    className="px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all hover:opacity-90"
                    style={{
                      border: '2px solid #fff',
                      color: '#fff',
                      background: 'transparent',
                      borderRadius: 0,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── FOODS: FUEL MENU ── */}
          <section
            id="fuel-menu"
            className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
          >
            <h2
              className="mb-2 text-4xl font-black uppercase tracking-widest"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: c.dark,
              }}
            >
              Fuel Menu
            </h2>
            <div
              className="mb-8 h-1 w-16"
              style={{ background: c.accent }}
            />

            {foods.length === 0 ? (
              <div
                className="border-2 border-dashed px-6 py-12 text-center"
                style={{
                  borderColor: c.border,
                  color: c.border,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                <p className="text-lg uppercase tracking-widest">
                  No items on the menu today
                </p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    <thead>
                      <tr
                        className="text-xs uppercase tracking-widest"
                        style={{ color: c.dark, borderBottom: `2px solid ${c.dark}` }}
                      >
                        <th className="px-4 py-3 font-bold w-14"></th>
                        <th className="px-4 py-3 font-bold">ITEM</th>
                        <th className="px-4 py-3 font-bold">DESCRIPTION</th>
                        <th className="px-4 py-3 font-bold">TIME</th>
                        <th className="px-4 py-3 font-bold">PRICE</th>
                        <th className="px-4 py-3 font-bold">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {foods.map((food, i) => (
                          <tr
                            key={food.id}
                            className="transition-colors"
                            style={{
                              background: i % 2 === 0 ? '#fff' : 'transparent',
                              borderBottom: `1px solid ${c.border}`,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = c.accent
                              e.currentTarget.style.color = '#fff'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = i % 2 === 0 ? '#fff' : 'transparent'
                              e.currentTarget.style.color = c.dark
                            }}
                          >
                            <td className="px-4 py-4">
                              {food.image && (
                                <img
                                  src={getImageUrl(food.image) ?? undefined}
                                  alt={food.name}
                                  className="w-10 h-10 rounded object-cover"
                                />
                              )}
                            </td>
                            <td className="px-4 py-4 font-bold">{food.name}</td>
                          <td className="max-w-xs truncate px-4 py-4 text-sm opacity-80">
                            {food.description || '—'}
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1 text-sm">
                              <Clock size={14} />
                              {food.cooking_time ? `${food.cooking_time} min` : '—'}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-bold">
                            {formatFoodPrice(food, currency)}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              data-add-to-cart={food.id}
                              onClick={() => onAddToCart?.(food.id)}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-90"
                              style={{
                                background: c.accent,
                                color: '#fff',
                                borderRadius: 0,
                              }}
                            >
                              <ShoppingCart size={14} />
                              ADD
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile food list */}
                <div className="flex flex-col gap-4 md:hidden">
                  {foods.map((food) => (
                    <div
                      key={food.id}
                      className="border-l-4 p-4"
                      style={{
                        borderLeftColor: c.accent,
                        borderBottom: `1px solid ${c.border}`,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {food.image && (
                          <img
                            src={getImageUrl(food.image) ?? undefined}
                            alt={food.name}
                            className="w-14 h-14 rounded object-cover shrink-0 mt-1"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold" style={{ fontFamily: "'DM Sans', sans-serif", color: c.dark }}>{food.name}</h3>
                          {food.description && (
                            <p className="mt-1 text-sm opacity-70" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{food.description}</p>
                          )}
                          {food.cooking_time && (
                            <p className="mt-1 flex items-center gap-1 text-xs opacity-60" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                              <Clock size={12} /> {food.cooking_time} min
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", color: c.accent }}>
                            {formatFoodPrice(food, currency)}
                          </p>
                          <button
                            data-add-to-cart={food.id}
                            onClick={() => onAddToCart?.(food.id)}
                            className="mt-2 flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
                            style={{
                              background: c.accent,
                              color: '#fff',
                              borderRadius: 0,
                            }}
                          >
                            <ShoppingCart size={14} /> ADD
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* ── REVIEWS: LOGS ── */}
          <section
            id="logs"
            className="px-4 py-20 sm:px-6 lg:px-8"
            style={{ background: '#f1f5f9' }}
          >
            <div className="mx-auto max-w-7xl">
              <h2
                className="mb-2 text-4xl font-black uppercase tracking-widest"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: c.dark,
                }}
              >
                Logs
              </h2>
              <div
                className="mb-8 h-1 w-16"
                style={{ background: c.accent }}
              />

              {reviews.length === 0 ? (
                <div
                  className="border-2 border-dashed px-6 py-12 text-center"
                  style={{
                    borderColor: c.border,
                    color: c.border,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  <p className="text-lg uppercase tracking-widest">No logs recorded yet</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {reviews.map((r) => (
                    <div
                      key={r.id}
                      className="relative border-l-4 p-6"
                      style={{
                        background: '#fff',
                        borderLeftColor: c.accent,
                      }}
                    >
                      <Quote
                        className="absolute right-4 top-4 opacity-10"
                        size={48}
                        style={{ color: c.accent }}
                      />
                      <div className="mb-3 flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < r.rating ? c.accent : 'none'}
                            color={i < r.rating ? c.accent : c.border}
                          />
                        ))}
                      </div>
                      <p
                        className="mb-4 text-sm leading-relaxed"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: c.dark }}
                      >
                        &ldquo;{r.comment || 'No comment provided.'}&rdquo;
                      </p>
                      <div className="flex items-center gap-3">
                        {r.avatar ? (
                          <img src={getImageUrl(r.avatar) ?? undefined} alt={r.user} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: c.accent }}>
                            <span className="text-xs font-bold uppercase text-white">{r.user.charAt(0)}</span>
                          </div>
                        )}
                        <p
                          className="text-xs font-bold uppercase tracking-widest"
                          style={{ fontFamily: "'JetBrains Mono', monospace", color: c.accent }}
                        >
                          {r.user}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── STAFF: CREW ── */}
          {staff.length > 0 && (
            <section
              id="crew"
              className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
            >
              <h2
                className="mb-2 text-4xl font-black uppercase tracking-widest"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: c.dark,
                }}
              >
                Crew
              </h2>
              <div
                className="mb-8 h-1 w-16"
                style={{ background: c.accent }}
              />

              <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                {staff.map((m, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div
                      className="hex-clip mb-4 flex h-28 w-28 items-center justify-center overflow-hidden"
                      style={{
                        border: `3px solid ${c.accent}`,
                        background: c.primary,
                      }}
                    >
                      <span
                        className="text-3xl font-black uppercase"
                        style={{ color: '#fff', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {m.name.charAt(0)}
                      </span>
                    </div>
                    <h3
                      className="text-lg font-bold uppercase tracking-wider"
                      style={{ fontFamily: "'DM Sans', sans-serif", color: c.dark }}
                    >
                      {m.name}
                    </h3>
                    <p
                      className="mt-1 text-xs uppercase tracking-widest"
                      style={{ fontFamily: "'JetBrains Mono', monospace", color: c.accent }}
                    >
                      {m.role}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── HOURS: SCHEDULE ── */}
          {hasHours && (
            <section
              id="schedule"
              className="px-4 py-20 sm:px-6 lg:px-8"
              style={{ background: '#f1f5f9' }}
            >
              <div className="mx-auto max-w-3xl">
                <h2
                  className="mb-2 text-4xl font-black uppercase tracking-widest"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: c.dark,
                  }}
                >
                  Schedule
                </h2>
                <div
                  className="mb-8 h-1 w-16"
                  style={{ background: c.accent }}
                />

                <div
                  className="border-2 p-6"
                  style={{
                    background: '#1e293b',
                    borderColor: c.accent,
                    color: '#fff',
                  }}
                >
                  <div
                    className="mb-4 flex items-center justify-between border-b pb-2 text-xs uppercase tracking-widest"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      borderColor: c.accent,
                      color: c.accent,
                    }}
                  >
                    <span>DAY</span>
                    <span>HOURS</span>
                  </div>
                  {DAY_ORDER.map((day) => {
                    const slot = hours?.[day]
                    return (
                      <div
                        key={day}
                        className="flex items-center justify-between border-b py-2 text-sm last:border-0"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          borderColor: c.accent,
                          opacity: slot ? 1 : 0.4,
                        }}
                      >
                        <span className="font-bold uppercase tracking-wider">
                          {DAY_LABELS[day] || day.toUpperCase()}
                        </span>
                        <span>
                          {slot ? `${slot.open} – ${slot.close}` : 'CLOSED'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          )}

          {/* ── CONTACT: CONNECT ── */}
          {contactItems.length > 0 && (
            <section
              id="connect"
              className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
            >
              <h2
                className="mb-2 text-4xl font-black uppercase tracking-widest"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: c.dark,
                }}
              >
                Connect
              </h2>
              <div
                className="mb-8 h-1 w-16"
                style={{ background: c.accent }}
              />

              <div className="grid gap-6 sm:grid-cols-3">
                {contactItems.map((item, i) => (
                  <div
                    key={i}
                    className="p-6"
                    style={{
                      background: '#1e293b',
                      color: '#fff',
                      borderRadius: 0,
                    }}
                  >
                    <div
                      className="mb-4 flex h-12 w-12 items-center justify-center"
                      style={{ background: c.accent }}
                    >
                      <item.icon size={20} color="#fff" />
                    </div>
                    <h3
                      className="mb-2 text-xs font-bold uppercase tracking-widest"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: c.accent,
                      }}
                    >
                      {item.label}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
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
            className="px-4 py-8 text-center sm:px-6 lg:px-8"
            style={{
              background: '#1e293b',
              color: '#94a3b8',
            }}
          >
            <p
              className="text-xs uppercase tracking-widest"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </>
  )
}
