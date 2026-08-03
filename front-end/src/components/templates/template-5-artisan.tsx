'use client'

import { useEffect, useState, useRef } from 'react'
import { ShoppingBag, Menu, X, MapPin, Phone, Mail, Clock, ChevronRight, Heart, Sparkles, Award, Feather, ChefHat, Quote, Utensils } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import type { TemplateStore } from './types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface ArtisanProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-[#78716c] hover:text-[#c2410c] text-sm font-medium transition-colors duration-300 relative after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-[#c2410c] after:transition-all after:duration-300 hover:after:w-full"
    >
      {children}
    </a>
  )
}

export default function Template5Artisan({
  store,
  themeColors,
  onAddToCart,
  onShopNow,
}: ArtisanProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const { currency } = useCurrency()

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-artisan-hero/1920/1080`
  const logoUrl = getImageUrl(store.logo)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: store.name,
    description: store.description || undefined,
    image: heroBg || undefined,
    telephone: store.phone || undefined,
    email: store.email || undefined,
    address: store.address
      ? { '@type': 'PostalAddress', streetAddress: store.address }
      : undefined,
    aggregateRating:
      store.reviews_count > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: store.avg_rating,
            reviewCount: store.reviews_count,
          }
        : undefined,
    ...(store.opening_hours
      ? {
          openingHoursSpecification: (Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(
            ([day, hrs]) => ({
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
              opens: hrs.open,
              closes: hrs.close,
            }),
          ),
        }
      : {}),
  }

  const cssVars = themeColors
    ? Object.entries(themeColors).reduce((acc, [key, val]) => `${acc}${key}: ${val};`, '')
    : ''

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{cssVars}</style>

      <div
        className="min-h-screen bg-[#fefce8] text-[#292524] overflow-hidden"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        {/* Announcement Bar */}
        <div className="bg-[#c2410c] text-white py-2">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <p className="text-xs tracking-wide flex items-center justify-center gap-2">
              <Feather size={12} />
              Handcrafted with love &mdash; Every bite tells a story.
              <Feather size={12} />
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav
          ref={navRef}
          className={cn(
            'sticky top-0 z-50 transition-all duration-500 bg-[#fefce8]',
            scrolled ? 'shadow-md' : 'shadow-sm',
          )}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                {logoUrl && (
                  <img src={logoUrl} alt={store.name} className="h-9 w-auto object-contain" />
                )}
                <a
                  href="#"
                  className="text-[#292524] font-bold text-2xl"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  {store.name}
                </a>
              </div>

              <div className="hidden md:flex items-center gap-8">
                <NavLink href="#menu">Handcrafted Bites</NavLink>
                <NavLink href="#story">Our Story</NavLink>
                <NavLink href="#reviews">Reviews</NavLink>
                <NavLink href="#staff">Artisans</NavLink>
                <NavLink href="#hours">Hours</NavLink>
                <NavLink href="#contact">Contact</NavLink>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={onShopNow}
                  className="hidden md:flex items-center gap-2 bg-[#c2410c] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#b33a0a] transition-all duration-300 shadow-sm"
                >
                  <ShoppingBag size={16} />
                  Order Handcrafted
                </button>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden text-[#292524] hover:text-[#c2410c] transition-colors duration-300"
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>

          <div
            className={cn(
              'md:hidden transition-all duration-400 overflow-hidden bg-[#fefce8] border-t border-[#e7e5e4]',
              mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
            )}
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              <a href="#menu" onClick={() => setMobileOpen(false)} className="text-[#78716c] hover:text-[#c2410c] text-sm font-medium transition-colors">Handcrafted Bites</a>
              <a href="#story" onClick={() => setMobileOpen(false)} className="text-[#78716c] hover:text-[#c2410c] text-sm font-medium transition-colors">Our Story</a>
              <a href="#reviews" onClick={() => setMobileOpen(false)} className="text-[#78716c] hover:text-[#c2410c] text-sm font-medium transition-colors">Reviews</a>
              <a href="#staff" onClick={() => setMobileOpen(false)} className="text-[#78716c] hover:text-[#c2410c] text-sm font-medium transition-colors">Artisans</a>
              <a href="#hours" onClick={() => setMobileOpen(false)} className="text-[#78716c] hover:text-[#c2410c] text-sm font-medium transition-colors">Hours</a>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="text-[#78716c] hover:text-[#c2410c] text-sm font-medium transition-colors">Contact</a>
              <button
                onClick={() => { setMobileOpen(false); onShopNow?.() }}
                className="bg-[#c2410c] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#b33a0a] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} /> Order Handcrafted
              </button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#c2410c] to-[#9a3412]">
          <div className="absolute inset-0 opacity-20">
            <img src={heroBg} alt={store.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#c2410c]/60 to-transparent" />
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20">
              <ChefHat size={14} className="text-[#fcd34d]" />
              <span className="text-white/80 text-sm font-medium">Artisan Crafted Since {new Date().getFullYear()}</span>
            </div>
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] text-white mb-6 relative inline-block"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              {store.name}
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-[#fcd34d] rounded-full" style={{ width: '60%', margin: '0 auto' }} />
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              {store.description || 'Where time-honored traditions meet modern palates. Every dish is handcrafted with passion and the finest ingredients.'}
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={onShopNow}
                className="bg-[#fcd34d] text-[#292524] px-10 py-4 rounded-full text-sm font-semibold hover:bg-[#fbbf24] transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Explore Our Menu
              </button>
              <a
                href="#story"
                className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Our Story
              </a>
            </div>
          </div>
        </section>

        {/* Story */}
        <section id="story" className="py-24 lg:py-28 bg-[#fefce8]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={`https://picsum.photos/seed/${store.alias}-artisan-story/800/1000`}
                  alt="Our story"
                  className="w-full h-[500px] object-cover transition-transform duration-700"
                />
                <div className="absolute inset-0 border-2 border-[#c2410c]/20 rounded-2xl pointer-events-none" />
              </div>
              <div className="lg:pl-8">
                <div className="flex items-center gap-2 text-[#c2410c] text-sm font-medium uppercase tracking-wide mb-4">
                  <Heart size={16} />
                  Our Story
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#292524] mb-6 leading-tight" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                  Crafted With Passion, Served With Love
                </h2>
                <div className="w-16 h-0.5 bg-[#c2410c] mb-6" />
                <p className="text-[#78716c] text-base leading-relaxed mb-6">
                  At {store.name}, we believe in the art of slow food. Every recipe is a family heirloom, every ingredient is locally sourced, and every plate is a canvas for our culinary artistry.
                </p>
                <p className="text-[#78716c] text-base leading-relaxed mb-8">
                  From our kitchen to your table, we pour our hearts into creating experiences that linger long after the last bite.
                </p>
                <a
                  href="#menu"
                  className="inline-flex items-center gap-2 text-[#c2410c] font-medium hover:text-[#9a3412] transition-colors duration-300"
                >
                  Discover Our Menu <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Handcrafted Bites */}
        <section id="menu" className="py-24 lg:py-28 bg-[#fff7ed]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#c2410c] text-sm font-medium uppercase tracking-wide block mb-3">From Our Kitchen</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#292524] mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Handcrafted Bites</h2>
              <div className="w-16 h-0.5 bg-[#c2410c] mx-auto" />
            </div>
            {store.foods.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {store.foods.map((food) => {
                  return (
                    <div
                      key={food.id}
                      className="bg-[#fefce8] rounded-2xl border-t-4 border-[#c2410c] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                    >
                      <div className="relative h-56 overflow-hidden">
                        {food.image ? (
                          <img
                            src={getImageUrl(food.image) ?? undefined}
                            alt={food.name}
                            className="w-full h-full object-cover transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gray-100">
                            <Utensils className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                        {food.is_offer && (
                          <span className="absolute top-3 left-3 bg-[#fcd34d] text-[#292524] text-xs font-bold px-3 py-1 rounded-full">
                            Artisan Pick
                          </span>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-[#292524]">{food.name}</h3>
                          <span className="text-[#c2410c] font-bold text-lg whitespace-nowrap ml-4">
                            {formatFoodPrice(food, currency)}
                          </span>
                        </div>
                        {food.new_price && (
                          <p className="text-[#a8a29e] text-sm line-through mb-1">
                            {formatFoodPrice(food, currency, { original: true })}
                          </p>
                        )}
                        {food.description && (
                          <p className="text-[#78716c] text-sm mb-4 line-clamp-2">{food.description}</p>
                        )}
                        <button
                          data-add-to-cart={food.id}
                          onClick={() => onAddToCart?.(food.id)}
                          className="w-full border border-[#c2410c] text-[#c2410c] px-4 py-2.5 rounded-full text-sm font-medium hover:bg-[#c2410c] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <ShoppingBag size={14} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-[#c2410c]/30 rounded-2xl">
                <ChefHat size={48} className="text-[#c2410c]/40 mx-auto mb-4" />
                <p className="text-[#78716c] text-lg">Our artisans are preparing something special. Coming soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="py-24 lg:py-28 bg-[#fefce8]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#c2410c] text-sm font-medium uppercase tracking-wide block mb-3">Testimonials</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#292524] mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Words From Our Community</h2>
              <div className="w-16 h-0.5 bg-[#c2410c] mx-auto" />
            </div>
            {store.reviews.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {store.reviews.slice(0, 4).map((review) => (
                  <div
                    key={review.id}
                    className="bg-[#fff7ed] p-8 rounded-2xl border border-[#e7e5e4] hover:border-[#c2410c]/20 transition-all duration-300"
                  >
                    <StarRating rating={review.rating} size={16} activeColor="#fcd34d" inactiveColor="#e7e5e4" />
                    <p className="text-[#57534e] leading-relaxed mt-4 mb-6 italic" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                      &ldquo;{review.comment || 'Absolutely divine! The flavors take you on a journey. This is what real food tastes like.'}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      {review.avatar ? (
                        <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-12 h-12 rounded-full object-cover border border-[#c2410c]/30" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#c2410c]/10 border border-[#c2410c]/30 flex items-center justify-center">
                          <span className="text-[#c2410c] text-lg font-bold" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{review.user.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-[#292524]">{review.user}</p>
                        <p className="text-[#78716c] text-sm">Food Lover</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Quote size={48} className="text-[#c2410c]/40 mx-auto mb-4" />
                <p className="text-[#78716c] text-lg">No reviews yet. Share your experience with us!</p>
              </div>
            )}
          </div>
        </section>

        {/* Staff */}
        <section id="staff" className="py-24 lg:py-28 bg-[#fff7ed]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#c2410c] text-sm font-medium uppercase tracking-wide block mb-3">Our Artisans</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#292524] mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Meet the Artisans</h2>
              <div className="w-16 h-0.5 bg-[#c2410c] mx-auto" />
            </div>
            {store.staff.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {store.staff.map((member, idx) => (
                  <div key={idx} className="bg-[#fefce8] rounded-2xl p-8 text-center border border-[#e7e5e4] hover:border-[#c2410c]/20 hover:shadow-sm transition-all duration-300">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c2410c] to-[#9a3412] mx-auto mb-4 flex items-center justify-center shadow-md">
                      <span className="text-white text-2xl font-bold" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>{member.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#292524] mb-1">{member.name}</h3>
                    <p className="text-[#78716c] text-sm">{member.role}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <ChefHat size={48} className="text-[#c2410c]/40 mx-auto mb-4" />
                <p className="text-[#78716c] text-lg">Meet our talented artisans soon.</p>
              </div>
            )}
          </div>
        </section>

        {/* Opening Hours */}
        <section id="hours" className="py-24 lg:py-28 bg-[#fefce8]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#c2410c] text-sm font-medium uppercase tracking-wide block mb-3">Hours</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#292524] mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Opening Hours</h2>
              <div className="w-16 h-0.5 bg-[#c2410c] mx-auto" />
            </div>
            {store.opening_hours ? (
              <div className="max-w-lg mx-auto bg-[#fff7ed] rounded-2xl border border-[#e7e5e4] overflow-hidden">
                <div className="divide-y divide-[#e7e5e4]">
                  {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                    <div key={day} className="flex items-center justify-between px-8 py-4">
                      <span className="text-[#292524] font-medium capitalize flex items-center gap-3">
                        <Clock size={16} className="text-[#c2410c]" />
                        {day}
                      </span>
                      <span className="text-[#78716c]">
                        {hrs.open} &mdash; {hrs.close}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <Clock size={48} className="text-[#c2410c]/40 mx-auto mb-4" />
                <p className="text-[#78716c] text-lg">Opening hours coming soon.</p>
              </div>
            )}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-24 lg:py-28 bg-[#fff7ed]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#c2410c] text-sm font-medium uppercase tracking-wide block mb-3">Connect</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#292524] mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Get in Touch</h2>
              <div className="w-16 h-0.5 bg-[#c2410c] mx-auto" />
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-[#fefce8] rounded-2xl p-8 text-center border border-[#e7e5e4] hover:border-[#c2410c]/20 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-[#c2410c]/10 flex items-center justify-center mx-auto mb-4">
                  <Phone size={24} className="text-[#c2410c]" />
                </div>
                <h3 className="text-lg font-semibold text-[#292524] mb-2">Phone</h3>
                {store.phone ? (
                  <a href={`tel:${store.phone}`} className="text-[#c2410c] hover:underline">{store.phone}</a>
                ) : (
                  <p className="text-[#78716c]">Coming soon</p>
                )}
              </div>
              <div className="bg-[#fefce8] rounded-2xl p-8 text-center border border-[#e7e5e4] hover:border-[#c2410c]/20 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-[#c2410c]/10 flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-[#c2410c]" />
                </div>
                <h3 className="text-lg font-semibold text-[#292524] mb-2">Email</h3>
                {store.email ? (
                  <a href={`mailto:${store.email}`} className="text-[#c2410c] hover:underline">{store.email}</a>
                ) : (
                  <p className="text-[#78716c]">Coming soon</p>
                )}
              </div>
              <div className="bg-[#fefce8] rounded-2xl p-8 text-center border border-[#e7e5e4] hover:border-[#c2410c]/20 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-[#c2410c]/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin size={24} className="text-[#c2410c]" />
                </div>
                <h3 className="text-lg font-semibold text-[#292524] mb-2">Address</h3>
                {store.address ? (
                  <p className="text-[#78716c]">{store.address}</p>
                ) : (
                  <p className="text-[#78716c]">Coming soon</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#c2410c] text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
              <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  {logoUrl && (
                    <img src={logoUrl} alt={store.name} className="h-8 w-auto object-contain brightness-0 invert" />
                  )}
                  <span
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                  >
                    {store.name}
                  </span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-xs">
                  Handcrafted with love. Every dish tells a story of tradition, passion, and the finest ingredients.
                </p>
                <div className="flex items-center gap-3">
                  <Sparkles size={14} className="text-[#fcd34d]" />
                  <span className="text-white/70 text-xs">Artisan Food &amp; Drink</span>
                </div>
              </div>
              <div>
                <h4 className="text-[#fcd34d] text-xs tracking-wider uppercase font-semibold mb-6">Explore</h4>
                <ul className="space-y-3">
                  {['Handcrafted Bites', 'Our Story', 'Reviews', 'Contact'].map((link) => (
                    <li key={link}>
                      <a href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-white/70 hover:text-white text-sm transition-colors duration-300">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[#fcd34d] text-xs tracking-wider uppercase font-semibold mb-6">Info</h4>
                <ul className="space-y-3">
                  {['Shipping', 'Returns', 'Catering', 'FAQ'].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-white/70 hover:text-white text-sm transition-colors duration-300">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[#fcd34d] text-xs tracking-wider uppercase font-semibold mb-6">Contact</h4>
                <ul className="space-y-4">
                  {store.address && (
                    <li className="flex items-start gap-3 text-white/70 text-sm">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-[#fcd34d]" />
                      <span>{store.address}</span>
                    </li>
                  )}
                  {store.phone && (
                    <li className="flex items-center gap-3 text-white/70 text-sm">
                      <Phone size={14} className="shrink-0 text-[#fcd34d]" />
                      <a href={`tel:${store.phone}`} className="hover:text-white transition-colors">{store.phone}</a>
                    </li>
                  )}
                  {store.email && (
                    <li className="flex items-center gap-3 text-white/70 text-sm">
                      <Mail size={14} className="shrink-0 text-[#fcd34d]" />
                      <a href={`mailto:${store.email}`} className="hover:text-white transition-colors">{store.email}</a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-white/50 text-xs">&copy; {new Date().getFullYear()} {store.name}. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-white/50 hover:text-white text-xs transition-colors">Privacy Policy</a>
                <a href="#" className="text-white/50 hover:text-white text-xs transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
