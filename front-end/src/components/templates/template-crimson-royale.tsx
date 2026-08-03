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
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

export function CrimsonRoyaleTemplate({
  store,
  themeColors,
  onAddToCart,
  onShopNow,
}: TemplateProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { currency } = useCurrency()

  const c = {
    crimson: themeColors?.crimson || '#991b1b',
    navy: themeColors?.navy || '#1e3a5f',
    gold: themeColors?.gold || '#fbbf24',
    bg: themeColors?.background || '#fdf2f2',
    border: themeColors?.border || '#fecaca',
  }

  const foods = store.foods ?? []
  const reviews = store.reviews ?? []
  const staff = store.staff ?? []
  const hours = store.opening_hours
  const hasHours = hours && Object.keys(hours).length > 0
  const contactItems = [
    { icon: Phone, label: 'Telefono', value: store.phone },
    { icon: Mail, label: 'Email', value: store.email },
    { icon: MapPin, label: 'Indirizzo', value: store.address },
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

  if (typeof window !== 'undefined') {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    if (typeof window !== 'undefined') {
      const existing = (window as any).__crimsonScrollHandler
      if (!existing) {
        window.addEventListener('scroll', handleScroll, { passive: true })
        ;(window as any).__crimsonScrollHandler = handleScroll
      }
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{`
        :root {
          --crimson: ${c.crimson};
          --navy: ${c.navy};
          --gold: ${c.gold};
          --cream: ${c.bg};
          --crimson-border: ${c.border};
        }
        .cross-hatch {
          background-image:
            repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(153,27,27,0.03) 8px, rgba(153,27,27,0.03) 9px),
            repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(153,27,27,0.03) 8px, rgba(153,27,27,0.03) 9px);
        }
        .hero-pattern {
          background-image: repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.05) 0px,
            rgba(255,255,255,0.05) 2px,
            transparent 2px,
            transparent 8px
          );
          background-size: 16px 16px;
        }
      `}</style>

      <div
        className="min-h-screen cross-hatch"
        style={{ background: c.bg, color: c.navy }}
      >
        {/* ── NAVBAR ── */}
        <nav
          className="fixed top-0 z-50 w-full transition-all duration-300"
          style={{
            background: scrolled ? '#fff' : 'transparent',
            boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
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
                className="text-xl font-bold italic tracking-wide"
                style={{
                  fontFamily: "'Lora', serif",
                  color: scrolled ? c.crimson : '#fff',
                  textShadow: scrolled ? 'none' : '0 1px 4px rgba(0,0,0,0.3)',
                }}
              >
                {store.name}
              </span>
            </div>

            <button
              className="flex items-center justify-center rounded p-2 sm:hidden"
              style={{
                background: scrolled ? 'rgba(153,27,27,0.08)' : 'rgba(255,255,255,0.2)',
              }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X size={22} style={{ color: scrolled ? c.crimson : '#fff' }} />
              ) : (
                <Menu size={22} style={{ color: scrolled ? c.crimson : '#fff' }} />
              )}
            </button>

            <div className="hidden items-center gap-8 sm:flex">
              {['La Cucina', 'Praise', 'Il Team', 'Orari', 'Contattaci'].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, '-').replace(/[è]/g, 'e')}`}
                    className="text-xs font-medium uppercase tracking-[0.2em] transition-all hover:opacity-70"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      color: scrolled ? c.navy : '#fff',
                      textShadow: scrolled ? 'none' : '0 1px 4px rgba(0,0,0,0.3)',
                    }}
                  >
                    {item}
                  </a>
                ),
              )}
              <button
                onClick={onShopNow}
                className="px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] transition-all hover:opacity-90"
                style={{
                  background: c.gold,
                  color: c.navy,
                  borderRadius: 0,
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
                background: '#fff',
                borderColor: c.border,
              }}
            >
              <div className="flex flex-col gap-3">
                {['La Cucina', 'Praise', 'Il Team', 'Orari', 'Contattaci'].map(
                  (item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase().replace(/\s+/g, '-').replace(/[è]/g, 'e')}`}
                      className="text-xs font-medium uppercase tracking-[0.15em]"
                      style={{ fontFamily: "'Inter', sans-serif", color: c.navy }}
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
                  className="mt-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em]"
                  style={{ background: c.gold, color: c.navy, borderRadius: 0 }}
                >
                  Order Now
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* ── HERO (split) ── */}
        <section className="flex min-h-screen flex-col md:flex-row">
          {/* Left: content */}
          <div
            className="flex items-center px-6 py-24 md:w-1/2 md:px-12 lg:px-20"
            style={{
              background: `linear-gradient(135deg, ${c.crimson} 0%, #7f1d1d 50%, ${c.crimson} 100%)`,
              color: '#fff',
            }}
          >
            <div className="max-w-xl">
              <div
                className="mb-6 h-1 w-20"
                style={{ background: c.gold }}
              />
              <h1
                className="text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"
                style={{ fontFamily: "'Lora', serif" }}
              >
                {store.name || 'La Cucina Italiana'}
              </h1>
              <p
                className="mt-6 max-w-lg text-lg leading-relaxed"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  color: '#fecaca',
                }}
              >
                {store.description || 'Authentic Italian cuisine passed down through generations. Mangia! Mangia!'}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={onShopNow}
                  className="px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] transition-all hover:opacity-90"
                  style={{
                    background: c.gold,
                    color: c.navy,
                    borderRadius: 0,
                  }}
                >
                  View Menu
                  </button>
                <button
                  onClick={onShopNow}
                  className="border-2 px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] transition-all hover:opacity-90"
                  style={{
                    borderColor: '#fff',
                    color: '#fff',
                    background: 'transparent',
                    borderRadius: 0,
                  }}
                >
                  Reserve a Table
                </button>
              </div>
            </div>
          </div>

          {/* Right: image / pattern */}
          <div
            className="relative flex items-center justify-center md:w-1/2"
            style={{
              background: `linear-gradient(135deg, ${c.crimson}cc, ${c.navy}cc), ${
                store.cover_image
                  ? `url(${getImageUrl(store.cover_image)})`
                  : 'none'
              }`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '400px',
            }}
          >
            {!store.cover_image && (
              <div className="hero-pattern absolute inset-0" />
            )}
            {store.cover_image && (
              <img
                src={getImageUrl(store.cover_image) ?? ''}
                alt={store.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${c.crimson}99, ${c.navy}99)`,
              }}
            />
            <div className="relative z-10 text-center">
              <span
                className="text-8xl font-bold italic opacity-20"
                style={{ fontFamily: "'Lora', serif", color: c.gold }}
              >
                {store.name?.charAt(0) || 'C'}
              </span>
            </div>
          </div>
        </section>

        {/* ── FOODS: LA CUCINA ── */}
        <section
          id="la-cucina"
          className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
        >
          <div className="mb-14 text-center">
            <h2
              className="text-4xl font-bold italic sm:text-5xl"
              style={{ fontFamily: "'Lora', serif", color: c.navy }}
            >
              La Cucina
            </h2>
            <div
              className="mx-auto mt-3 h-0.5 w-16"
              style={{ background: c.crimson }}
            />
          </div>

          {foods.length === 0 ? (
            <div
              className="border-2 px-8 py-16 text-center"
              style={{ borderColor: c.border, background: '#fff' }}
            >
              <p
                className="text-lg italic"
                style={{ fontFamily: "'Lora', serif", color: c.navy, opacity: 0.6 }}
              >
                La cucina sta preparando qualcosa di speciale...
              </p>
              <p
                className="mt-2 text-sm"
                style={{ fontFamily: "'Inter', sans-serif", color: c.navy, opacity: 0.4 }}
              >
                Torna presto per scoprire le nostre nuove creazioni!
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2">
              {foods.map((food, i) => (
                <div
                  key={food.id}
                  className="group relative transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: '#fff',
                    borderTop: `4px solid ${c.crimson}`,
                    boxShadow: '0 2px 16px rgba(153,27,27,0.06)',
                    marginTop: i % 2 === 1 ? '2rem' : undefined,
                  }}
                >
                  {food.image && (
                    <div className="relative overflow-hidden">
                      <img
                        src={getImageUrl(food.image) ?? undefined}
                        alt={food.name}
                        className="h-48 w-full object-cover transition-transform duration-500"
                      />
                      {food.is_offer && (
                        <span
                          className="absolute right-3 top-3 px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                          style={{ background: c.gold, color: c.navy }}
                        >
                          Speciale
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        className="text-xl font-bold italic"
                        style={{ fontFamily: "'Lora', serif", color: c.navy }}
                      >
                        {food.name}
                      </h3>
                      <span
                        className="inline-flex items-center rounded px-3 py-1 text-sm font-bold"
                        style={{
                          background: c.gold,
                          color: c.navy,
                        }}
                      >
                        {formatFoodPrice(food, currency)}
                      </span>
                    </div>
                    {food.description && (
                      <p
                        className="mt-3 text-sm leading-relaxed"
                        style={{ fontFamily: "'Inter', sans-serif", color: c.navy, opacity: 0.6 }}
                      >
                        {food.description}
                      </p>
                    )}
                    <div className="mt-5 flex items-center justify-between">
                      {food.cooking_time && (
                        <span
                          className="flex items-center gap-1.5 text-xs"
                          style={{ fontFamily: "'Inter', sans-serif", color: c.navy, opacity: 0.5 }}
                        >
                          <Clock size={14} />
                          {food.cooking_time} min
                        </span>
                      )}
                      <button
                        data-add-to-cart={food.id}
                        onClick={() => onAddToCart?.(food.id)}
                        className="ml-auto flex items-center gap-1.5 px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all hover:opacity-90"
                        style={{
                          background: c.crimson,
                          color: '#fff',
                          borderRadius: 0,
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
        </section>

        {/* ── REVIEWS: PRAISE ── */}
        <section
          id="praise"
          className="px-4 py-24 sm:px-6 lg:px-8"
          style={{ background: '#fff' }}
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 text-center">
              <h2
                className="text-4xl font-bold italic sm:text-5xl"
                style={{ fontFamily: "'Lora', serif", color: c.navy }}
              >
                Praise
              </h2>
              <div
                className="mx-auto mt-3 h-0.5 w-16"
                style={{ background: c.crimson }}
              />
            </div>

            {reviews.length === 0 ? (
              <div
                className="border-2 px-8 py-16 text-center"
                style={{ borderColor: c.border }}
              >
                <p
                  className="text-lg italic"
                  style={{ fontFamily: "'Lora', serif", color: c.navy, opacity: 0.6 }}
                >
                  Nessuna recensione ancora
                </p>
                <p
                  className="mt-2 text-sm"
                  style={{ fontFamily: "'Inter', sans-serif", color: c.navy, opacity: 0.4 }}
                >
                  Sii il primo a condividere la tua esperienza!
                </p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="relative border-l-4 p-8"
                    style={{
                      borderLeftColor: c.crimson,
                      background: c.bg,
                    }}
                  >
                    <span
                      className="absolute right-6 top-4 text-6xl leading-none italic opacity-15"
                      style={{ fontFamily: "'Lora', serif", color: c.crimson }}
                    >
                      &ldquo;
                    </span>
                    <div className="mb-4 flex gap-1">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star
                          key={si}
                          size={18}
                          fill={si < r.rating ? c.gold : 'none'}
                          color={si < r.rating ? c.gold : c.border}
                        />
                      ))}
                    </div>
                    <p
                      className="mb-5 text-sm leading-relaxed italic"
                      style={{ fontFamily: "'Lora', serif", color: c.navy, opacity: 0.8 }}
                    >
                      {r.comment || 'No comment provided.'}
                    </p>
                    <div className="flex items-center gap-3">
                      {r.avatar ? (
                        <img src={getImageUrl(r.avatar) ?? undefined} alt={r.user} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: c.crimson }}>
                          <span className="text-sm font-bold italic text-white" style={{ fontFamily: "'Lora', serif" }}>{r.user.charAt(0)}</span>
                        </div>
                      )}
                      <p
                        className="text-sm font-semibold"
                        style={{ fontFamily: "'Inter', sans-serif", color: c.navy }}
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

        {/* ── STAFF: IL TEAM ── */}
        {staff.length > 0 && (
          <section
            id="il-team"
            className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
          >
            <div className="mb-14 text-center">
              <h2
                className="text-4xl font-bold italic sm:text-5xl"
                style={{ fontFamily: "'Lora', serif", color: c.navy }}
              >
                Il Team
              </h2>
              <div
                className="mx-auto mt-3 h-0.5 w-16"
                style={{ background: c.crimson }}
              />
            </div>

            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {staff.map((m, i) => (
                <div key={i} className="group flex flex-col items-center text-center">
                  <div
                    className="mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 p-1 transition-all duration-300 group-hover:scale-105"
                    style={{
                      borderColor: c.gold,
                      background: '#fff',
                    }}
                  >
                    <div
                      className="flex h-full w-full items-center justify-center rounded-full"
                      style={{ background: `linear-gradient(135deg, ${c.crimson}, ${c.navy})` }}
                    >
                      <span
                        className="text-3xl font-bold italic text-white"
                        style={{ fontFamily: "'Lora', serif" }}
                      >
                        {m.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <h3
                    className="text-lg font-bold italic"
                    style={{ fontFamily: "'Lora', serif", color: c.navy }}
                  >
                    {m.name}
                  </h3>
                  <p
                    className="mt-1 text-sm uppercase tracking-wider"
                    style={{ fontFamily: "'Inter', sans-serif", color: c.crimson, opacity: 0.7 }}
                  >
                    {m.role}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── HOURS: ORARI ── */}
        {hasHours && (
          <section
            id="orari"
            className="px-4 py-24 sm:px-6 lg:px-8"
            style={{ background: '#fff' }}
          >
            <div className="mx-auto max-w-2xl">
              <div className="mb-14 text-center">
                <h2
                  className="text-4xl font-bold italic sm:text-5xl"
                  style={{ fontFamily: "'Lora', serif", color: c.navy }}
                >
                  Orari
                </h2>
                <div
                  className="mx-auto mt-3 h-0.5 w-16"
                  style={{ background: c.crimson }}
                />
              </div>

              <div
                className="border-2 p-8"
                style={{
                  borderColor: c.crimson,
                  background: c.bg,
                }}
              >
                {DAY_ORDER.map((day) => {
                  const slot = hours?.[day]
                  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
                  const isToday = today === day
                  return (
                    <div
                      key={day}
                      className="flex items-center justify-between border-b py-3 last:border-0"
                      style={{
                        borderColor: c.border,
                        background: isToday ? c.gold : 'transparent',
                        color: isToday ? c.navy : undefined,
                        padding: isToday ? '0.75rem 1rem' : '0.75rem 0',
                        margin: isToday ? '0 -1rem' : 0,
                      }}
                    >
                      <span
                        className="text-sm font-semibold"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: isToday ? 700 : 500,
                        }}
                      >
                        {DAY_LABELS[day] || day}
                        {isToday && (
                          <span
                            className="ml-2 text-xs uppercase tracking-wider"
                            style={{ fontFamily: "'Inter', sans-serif", opacity: 0.7 }}
                          >
                            (Today)
                          </span>
                        )}
                      </span>
                      <span
                        className="text-sm"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          opacity: slot ? 0.8 : 0.4,
                        }}
                      >
                        {slot ? `${slot.open} – ${slot.close}` : 'Chiuso'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── CONTACT: CONTATTACI ── */}
        {contactItems.length > 0 && (
          <section
            id="contattaci"
            className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
          >
            <div className="mb-14 text-center">
              <h2
                className="text-4xl font-bold italic sm:text-5xl"
                style={{ fontFamily: "'Lora', serif", color: c.navy }}
              >
                Contattaci
              </h2>
              <div
                className="mx-auto mt-3 h-0.5 w-16"
                style={{ background: c.crimson }}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {contactItems.map((item, i) => (
                <div
                  key={i}
                  className="p-8 text-center transition-all duration-300 hover:-translate-y-1"
                  style={{ background: '#fff' }}
                >
                  <div
                    className="mx-auto mb-5 flex h-14 w-14 items-center justify-center"
                    style={{ background: c.crimson }}
                  >
                    <item.icon size={22} color="#fff" />
                  </div>
                  <h3
                    className="mb-2 text-sm font-bold uppercase tracking-wider"
                    style={{ fontFamily: "'Inter', sans-serif", color: c.navy }}
                  >
                    {item.label}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ fontFamily: "'Inter', sans-serif", color: c.navy, opacity: 0.6 }}
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
          className="px-4 py-12 sm:px-6 lg:px-8"
          style={{ background: c.navy, color: '#fdf2f2' }}
        >
          <div className="mx-auto max-w-7xl text-center">
            <div className="mb-6 flex items-center justify-center gap-6">
              <a
                href="#"
                className="text-xs uppercase tracking-[0.2em] transition-all hover:opacity-70"
                style={{ fontFamily: "'Inter', sans-serif", color: c.gold }}
              >
                La Cucina
              </a>
              <span style={{ color: c.gold, opacity: 0.3 }}>|</span>
              <a
                href="#"
                className="text-xs uppercase tracking-[0.2em] transition-all hover:opacity-70"
                style={{ fontFamily: "'Inter', sans-serif", color: c.gold }}
              >
                Il Team
              </a>
              <span style={{ color: c.gold, opacity: 0.3 }}>|</span>
              <a
                href="#"
                className="text-xs uppercase tracking-[0.2em] transition-all hover:opacity-70"
                style={{ fontFamily: "'Inter', sans-serif", color: c.gold }}
              >
                Contattaci
              </a>
            </div>
            <p
              className="text-sm"
              style={{ fontFamily: "'Inter', sans-serif", opacity: 0.7 }}
            >
              &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
            </p>
            <p
              className="mt-2 text-xs italic"
              style={{ fontFamily: "'Lora', serif", opacity: 0.5, color: c.gold }}
            >
              Authentic Italian since day one.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
