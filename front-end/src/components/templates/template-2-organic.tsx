'use client'

import { useEffect, useState, useRef } from 'react'
import { ShoppingBag, Menu, X, Star, MapPin, Phone, Mail, Clock, Leaf, Heart, Timer, ChevronRight, Award, Sparkles, CheckCircle, Utensils } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import { StoreTypeTags } from '@/components/templates/blocks/store-type-tags'
import { StoreLocation } from '@/components/templates/blocks/store-location'
import { DeliveryInfo } from '@/components/templates/blocks/delivery-info'
import { OffersSection } from '@/components/templates/blocks/offers-section'
import { PhotoGallery } from '@/components/templates/blocks/photo-gallery'
import type { TemplateStore } from './types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface OrganicProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

function BadgePill({ badge }: { badge: { name: string; color?: string | null; icon?: string | null } }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
      style={{
        backgroundColor: badge.color ? `${badge.color}20` : '#16a34a20',
        color: badge.color || '#16a34a',
      }}
    >
      {badge.icon || <Award size={12} />}
      {badge.name}
    </span>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-[#4b5563] hover:text-[#16a34a] text-sm font-medium transition-colors duration-300 relative after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-[#16a34a] after:transition-all after:duration-300 hover:after:w-full"
    >
      {children}
    </a>
  )
}

export default function Template2Organic({
  store,
  themeColors,
  onAddToCart,
  onShopNow,
}: OrganicProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [announcementIdx, setAnnouncementIdx] = useState(0)
  const navRef = useRef<HTMLElement>(null)
  const announcementInterval = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (store.badges.length > 3) {
      announcementInterval.current = setInterval(() => {
        setAnnouncementIdx((prev) => (prev + 1) % store.badges.length)
      }, 3000)
    }
    return () => {
      if (announcementInterval.current) clearInterval(announcementInterval.current)
    }
  }, [store.badges.length])

  const { currency } = useCurrency()

  const heroBg = getImageUrl(store.cover) || `https://picsum.photos/seed/${store.alias}-organic-hero/1920/1080`
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
        className="min-h-screen bg-[#f0fdf4] text-[#1f2937] overflow-hidden"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        {/* Announcement Bar */}
        {store.badges.length > 0 && (
          <div className="bg-[#16a34a] text-white py-2 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex items-center justify-center gap-4 text-xs sm:text-sm">
                {store.badges.length <= 3 ? (
                  store.badges.map((badge) => (
                    <span key={badge.id} className="flex items-center gap-1.5">
                      <CheckCircle size={14} />
                      {badge.name}
                    </span>
                  ))
                ) : (
                  <span className="flex items-center gap-1.5 animate-pulse">
                    <Sparkles size={14} />
                    {store.badges[announcementIdx]!.name}
                    <Sparkles size={14} />
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sticky Nav */}
        <nav
          ref={navRef}
          className={cn(
            'sticky top-0 z-50 transition-all duration-500 bg-white shadow-sm',
            scrolled ? 'shadow-md' : 'shadow-sm',
          )}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-8">
                <a
                  href="#"
                  className="flex items-center gap-3 text-[#16a34a] font-bold text-2xl"
                  style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                >
                  {logoUrl && (
                    <img src={logoUrl} alt={store.name} className="h-10 w-auto object-contain" />
                  )}
                  {!logoUrl && <Leaf size={28} />}
                  {store.name}
                </a>
              </div>

              <div className="hidden md:flex items-center gap-8">
                <NavLink href="#menu">Farm Fresh Menu</NavLink>
                <NavLink href="#how-it-works">How It Works</NavLink>
                <NavLink href="#reviews">Reviews</NavLink>
                <NavLink href="#staff">Our Team</NavLink>
                <NavLink href="#hours">Hours</NavLink>
                <NavLink href="#contact">Contact</NavLink>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={onShopNow}
                  className="hidden md:flex items-center gap-2 bg-[#16a34a] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#15803d] transition-all duration-300"
                >
                  <ShoppingBag size={16} />
                  Order Now
                </button>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden text-[#1f2937] hover:text-[#16a34a] transition-colors duration-300"
                >
                  {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          <div
            className={cn(
              'md:hidden transition-all duration-400 overflow-hidden bg-white border-t border-[#e5e7eb]',
              mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
            )}
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              <a href="#menu" onClick={() => setMobileOpen(false)} className="text-[#4b5563] hover:text-[#16a34a] text-sm font-medium transition-colors">Farm Fresh Menu</a>
              <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="text-[#4b5563] hover:text-[#16a34a] text-sm font-medium transition-colors">How It Works</a>
              <a href="#reviews" onClick={() => setMobileOpen(false)} className="text-[#4b5563] hover:text-[#16a34a] text-sm font-medium transition-colors">Reviews</a>
              <a href="#staff" onClick={() => setMobileOpen(false)} className="text-[#4b5563] hover:text-[#16a34a] text-sm font-medium transition-colors">Our Team</a>
              <a href="#hours" onClick={() => setMobileOpen(false)} className="text-[#4b5563] hover:text-[#16a34a] text-sm font-medium transition-colors">Hours</a>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="text-[#4b5563] hover:text-[#16a34a] text-sm font-medium transition-colors">Contact</a>
              <button
                onClick={() => { setMobileOpen(false); onShopNow?.() }}
                className="bg-[#16a34a] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#15803d] transition-all duration-300 text-left flex items-center gap-2"
              >
                <ShoppingBag size={16} /> Order Now
              </button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroBg} alt={store.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#16a34a]/80 via-[#16a34a]/50 to-transparent" />
          </div>
          <div className="relative z-10 px-6 lg:px-8 max-w-4xl ml-0 lg:ml-16">
            <div className="flex items-center gap-2 mb-6">
              <Leaf size={18} className="text-[#facc15]" />
              <span className="text-[#facc15] text-sm font-medium tracking-wide uppercase">100% Organic & Fresh</span>
            </div>
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] text-white mb-6"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              {store.name}
            </h1>
            <StoreTypeTags types={store.type_categories ?? []} className="justify-center mb-6" />
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed">
              {store.description || 'Farm-fresh ingredients, handpicked with love. Taste the goodness of nature delivered to your doorstep.'}
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={onShopNow}
                className="bg-[#16a34a] text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-[#15803d] transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Shop Fresh
              </button>
              <a
                href="#menu"
                className="border-2 border-white text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-white hover:text-[#16a34a] transition-all duration-300"
              >
                Explore Menu
              </a>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#16a34a] text-sm font-medium tracking-wide uppercase block mb-3">Simple & Fresh</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1f2937] mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>How It Works</h2>
              <div className="w-16 h-[2px] bg-[#16a34a] mx-auto" />
            </div>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-[#16a34a]/10 flex items-center justify-center mx-auto mb-6">
                  <Leaf size={28} className="text-[#16a34a]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1f2937] mb-3">Pick Your Produce</h3>
                <p className="text-[#6b7280] leading-relaxed">Browse our farm-fresh selection of organic fruits, vegetables, and artisanal goods.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-[#16a34a]/10 flex items-center justify-center mx-auto mb-6">
                  <Heart size={28} className="text-[#16a34a]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1f2937] mb-3">Handpicked With Care</h3>
                <p className="text-[#6b7280] leading-relaxed">Every item is carefully selected by our farmers at peak ripeness for maximum flavor.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-[#16a34a]/10 flex items-center justify-center mx-auto mb-6">
                  <Timer size={28} className="text-[#16a34a]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1f2937] mb-3">Delivered Fresh Daily</h3>
                <p className="text-[#6b7280] leading-relaxed">Same-day delivery straight from the farm to your table. Freshness guaranteed.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Delivery Info */}
        <section id="delivery" className="py-24 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#16a34a] text-sm font-medium tracking-wide uppercase block mb-3">Delivery</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1f2937] mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Delivery Info</h2>
              <div className="w-16 h-[2px] bg-[#16a34a] mx-auto" />
            </div>
            <div className="max-w-lg mx-auto bg-[#f0fdf4] rounded-xl border border-[#bbf7d0] p-8">
              <DeliveryInfo
                baseDeliveryFee={store.base_delivery_fee}
                avgPrepTime={store.avg_prep_time}
                avgDeliveryTimePerKm={store.avg_delivery_time_per_km}
                deliveryZoneRadius={store.delivery_zone_radius}
                allowsPreOrders={store.allows_pre_orders}
                preOrderLeadTimeHours={store.pre_order_lead_time_hours}
                className="text-[#1f2937]"
              />
            </div>
          </div>
        </section>

        {/* Offers */}
        <section id="offers" className="py-24 lg:py-28 bg-[#f0fdf4]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <OffersSection offers={store.offers ?? []} />
          </div>
        </section>

        {/* Farm Fresh Menu */}
        <section id="menu" className="py-24 lg:py-28 bg-[#f0fdf4]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#16a34a] text-sm font-medium tracking-wide uppercase block mb-3">From the Earth</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1f2937] mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Farm Fresh Menu</h2>
              <div className="w-16 h-[2px] bg-[#16a34a] mx-auto" />
            </div>
            {store.foods.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {store.foods.map((food) => {
                  return (
                    <div
                      key={food.id}
                      className="bg-white rounded-xl border-t-4 border-[#16a34a] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
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
                          <span className="absolute top-3 left-3 bg-[#facc15] text-[#1f2937] text-xs font-bold px-3 py-1 rounded-full">
                            Offer
                          </span>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-[#1f2937]">{food.name}</h3>
                          <span className="text-[#16a34a] font-bold text-lg whitespace-nowrap ml-4">
                            {formatFoodPrice(food, currency)}
                          </span>
                        </div>
                        {food.new_price && (
                          <p className="text-[#9ca3af] text-sm line-through mb-1">
                            {formatFoodPrice(food, currency, { original: true })}
                          </p>
                        )}
                        {food.description && (
                          <p className="text-[#6b7280] text-sm mb-4 line-clamp-2">{food.description}</p>
                        )}
                        <button
                          data-add-to-cart={food.id}
                          onClick={() => onAddToCart?.(food.id)}
                          className="w-full bg-[#16a34a] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#15803d] hover:shadow-md active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
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
              <div className="text-center py-20">
                <Leaf size={48} className="text-[#16a34a]/40 mx-auto mb-4" />
                <p className="text-[#6b7280] text-lg">Our farm-fresh menu is being harvested. Check back soon!</p>
              </div>
            )}
          </div>
        </section>

        {/* Photo Gallery */}
        <section id="gallery" className="py-24 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#16a34a] text-sm font-medium tracking-wide uppercase block mb-3">Moments</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1f2937] mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Photo Gallery</h2>
              <div className="w-16 h-[2px] bg-[#16a34a] mx-auto" />
            </div>
            <PhotoGallery images={store.images ?? []} />
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="py-24 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#16a34a] text-sm font-medium tracking-wide uppercase block mb-3">Testimonials</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1f2937] mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>What Our Customers Say</h2>
              <div className="w-16 h-[2px] bg-[#16a34a] mx-auto" />
            </div>
            {store.reviews.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {store.reviews.slice(0, 4).map((review) => (
                  <div
                    key={review.id}
                    className="bg-[#f0fdf4] p-8 rounded-xl border border-[#bbf7d0] hover:border-[#16a34a] hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
                  >
                    <StarRating rating={review.rating} size={16} activeColor="#facc15" inactiveColor="#bbf7d0" />
                    <p className="text-[#4b5563] leading-relaxed mt-4 mb-6">
                      &ldquo;{review.comment || 'Absolutely fresh and delicious! The quality speaks for itself.'}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      {review.avatar && (
                        <img
                          src={getImageUrl(review.avatar) || `https://picsum.photos/seed/user-${review.id}/48/48`}
                          alt={review.user}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#bbf7d0]"
                        />
                      )}
                      <div>
                        <p className="font-medium text-[#1f2937]">{review.user}</p>
                        <p className="text-[#6b7280] text-sm">Verified Customer</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Star size={48} className="text-[#16a34a]/40 mx-auto mb-4" />
                <p className="text-[#6b7280] text-lg">No reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </section>

        {/* Staff */}
        {store.staff.length > 0 && (
          <section id="staff" className="py-24 lg:py-28 bg-[#f0fdf4]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-16">
                <span className="text-[#16a34a] text-sm font-medium tracking-wide uppercase block mb-3">Our Team</span>
                <h2 className="text-4xl md:text-5xl font-bold text-[#1f2937] mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Meet Our Farmers</h2>
                <div className="w-16 h-[2px] bg-[#16a34a] mx-auto" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {store.staff.map((member, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-8 text-center border border-[#e5e7eb] hover:border-[#16a34a] transition-all duration-300">
                    <div className="w-20 h-20 rounded-full border-2 border-[#16a34a] mx-auto mb-4 flex items-center justify-center bg-[#f0fdf4]">
                      <span className="text-[#16a34a] text-2xl font-bold">{member.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#1f2937] mb-1">{member.name}</h3>
                    <p className="text-[#6b7280] text-sm">{member.role}</p>
                  </div>
                ))}
            </div>
          </div>
        </section>
        )}
        {store.staff.length === 0 && (
          <section id="staff" className="py-24 lg:py-28 bg-[#f0fdf4]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-[#1f2937] mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Meet Our Farmers</h2>
              <div className="w-16 h-[2px] bg-[#16a34a] mx-auto mb-8" />
              <p className="text-[#6b7280] text-lg">Our team page is growing. Stay tuned!</p>
            </div>
          </section>
        )}

        {/* Opening Hours */}
        <section id="hours" className="py-24 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#16a34a] text-sm font-medium tracking-wide uppercase block mb-3">Open Hours</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1f2937] mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Opening Hours</h2>
              <div className="w-16 h-[2px] bg-[#16a34a] mx-auto" />
            </div>
            {store.opening_hours ? (
              <div className="max-w-lg mx-auto bg-[#f0fdf4] rounded-xl border border-[#bbf7d0] overflow-hidden">
                <div className="divide-y divide-[#bbf7d0]">
                  {(Object.entries(store.opening_hours) as [string, { open: string; close: string }][]).map(([day, hrs]) => (
                    <div key={day} className="flex items-center justify-between px-8 py-4">
                      <span className="text-[#1f2937] font-medium capitalize flex items-center gap-3">
                        <Clock size={16} className="text-[#16a34a]" />
                        {day}
                      </span>
                      <span className="text-[#4b5563]">
                        {hrs.open} &mdash; {hrs.close}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <Clock size={48} className="text-[#16a34a]/40 mx-auto mb-4" />
                <p className="text-[#6b7280] text-lg">Opening hours coming soon.</p>
              </div>
            )}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-24 lg:py-28 bg-[#f0fdf4]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#16a34a] text-sm font-medium tracking-wide uppercase block mb-3">Get in Touch</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1f2937] mb-4" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Contact Us</h2>
              <div className="w-16 h-[2px] bg-[#16a34a] mx-auto" />
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {store.phone ? (
                <div className="bg-white rounded-xl p-8 text-center border border-[#e5e7eb] hover:border-[#16a34a] transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-[#16a34a]/10 flex items-center justify-center mx-auto mb-4">
                    <Phone size={24} className="text-[#16a34a]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1f2937] mb-2">Phone</h3>
                  <a href={`tel:${store.phone}`} className="text-[#16a34a] hover:underline">{store.phone}</a>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center border border-[#e5e7eb]">
                  <div className="w-14 h-14 rounded-full bg-[#16a34a]/10 flex items-center justify-center mx-auto mb-4">
                    <Phone size={24} className="text-[#16a34a]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1f2937] mb-2">Phone</h3>
                  <p className="text-[#6b7280]">Contact number coming soon</p>
                </div>
              )}
              {store.email ? (
                <div className="bg-white rounded-xl p-8 text-center border border-[#e5e7eb] hover:border-[#16a34a] transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-[#16a34a]/10 flex items-center justify-center mx-auto mb-4">
                    <Mail size={24} className="text-[#16a34a]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1f2937] mb-2">Email</h3>
                  <a href={`mailto:${store.email}`} className="text-[#16a34a] hover:underline">{store.email}</a>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center border border-[#e5e7eb]">
                  <div className="w-14 h-14 rounded-full bg-[#16a34a]/10 flex items-center justify-center mx-auto mb-4">
                    <Mail size={24} className="text-[#16a34a]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1f2937] mb-2">Email</h3>
                  <p className="text-[#6b7280]">Email coming soon</p>
                </div>
              )}
              {store.address ? (
                <div className="bg-white rounded-xl p-8 text-center border border-[#e5e7eb] hover:border-[#16a34a] transition-all duration-300">
                  <div className="w-14 h-14 rounded-full bg-[#16a34a]/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin size={24} className="text-[#16a34a]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1f2937] mb-2">Address</h3>
                  <p className="text-[#4b5563]">{store.address}</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center border border-[#e5e7eb]">
                  <div className="w-14 h-14 rounded-full bg-[#16a34a]/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin size={24} className="text-[#16a34a]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1f2937] mb-2">Address</h3>
                  <p className="text-[#6b7280]">Location coming soon</p>
                </div>
              )}
            </div>
            <StoreLocation
              wilaya={store.wilaya}
              daira={store.daira}
              commune={store.commune}
              address={store.address}
              className="justify-center mt-8 text-[#4b5563]"
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#16a34a] text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
              <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  {logoUrl && <img src={logoUrl} alt={store.name} className="h-8 w-auto object-contain brightness-0 invert" />}
                  <span
                    className="text-xl font-bold text-white"
                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                  >
                    {store.name}
                  </span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-xs">
                  Bringing farm-fresh organic goodness to your table since day one.
                </p>
                <div className="flex items-center gap-3">
                  <Leaf size={18} className="text-[#facc15]" />
                  <span className="text-white/70 text-xs">100% Organic & Certified</span>
                </div>
              </div>
              <div>
                <h4 className="text-[#facc15] text-xs tracking-wider uppercase font-semibold mb-6">Quick Links</h4>
                <ul className="space-y-3">
                  {['Farm Fresh Menu', 'How It Works', 'Reviews', 'Contact'].map((link) => (
                    <li key={link}>
                      <a href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-white/70 hover:text-white text-sm transition-colors duration-300">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[#facc15] text-xs tracking-wider uppercase font-semibold mb-6">Support</h4>
                <ul className="space-y-3">
                  {['Shipping Info', 'Returns Policy', 'Care Guide', 'FAQ'].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-white/70 hover:text-white text-sm transition-colors duration-300">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[#facc15] text-xs tracking-wider uppercase font-semibold mb-6">Contact</h4>
                <ul className="space-y-4">
                  {store.address && (
                    <li className="flex items-start gap-3 text-white/70 text-sm">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-[#facc15]" />
                      <span>{store.address}</span>
                    </li>
                  )}
                  {store.phone && (
                    <li className="flex items-center gap-3 text-white/70 text-sm">
                      <Phone size={14} className="shrink-0 text-[#facc15]" />
                      <a href={`tel:${store.phone}`} className="hover:text-white transition-colors">{store.phone}</a>
                    </li>
                  )}
                  {store.email && (
                    <li className="flex items-center gap-3 text-white/70 text-sm">
                      <Mail size={14} className="shrink-0 text-[#facc15]" />
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
