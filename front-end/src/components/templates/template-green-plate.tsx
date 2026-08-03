'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, Quote, Leaf, Sprout, Heart } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface GreenPlateProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const SAGE = '#87C442'
const FOREST = '#2E7D32'
const WHITE = '#FFFFFF'
const WARM_WHITE = '#F5F5DC'
const CHARCOAL = '#2D3748'
const LIGHT_GREEN = '#E8F5E9'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

export function TemplateGreenPlate({ store, themeColors, onAddToCart, onShopNow }: GreenPlateProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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
    servesCuisine: 'Vegan, Vegetarian, Healthy, Organic, Plant-Based',
    image: getImageUrl(store.cover_image || store.cover),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700&family=Inter:wght@300;400;500&display=swap');
        :root { ${Object.entries(c).map(([k, v]) => `${k}: ${v};`).join('\n')} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-[#F5F5DC] text-[#2D3748] font-['Inter'] overflow-x-hidden">
        {/* ── Navbar ── */}
        <nav
          className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
            scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-2">
                {store.logo ? (
                  <img
                    src={getImageUrl(store.logo) || ''}
                    alt={store.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#87C442] to-[#2E7D32] flex items-center justify-center">
                    <Leaf size={16} className="text-white" />
                  </div>
                )}
                <span className="font-['Outfit'] text-xl font-light tracking-tight text-[#2D3748]">
                  {store.name}
                </span>
              </div>

              <div className="hidden md:flex items-center gap-6">
                {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-[#718096] hover:text-[#87C442] transition-colors duration-300 font-light"
                  >
                    {item}
                  </a>
                ))}
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="bg-[#87C442] text-white px-6 py-2.5 text-sm font-medium rounded-full hover:bg-[#6DA832] transition-all duration-300 shadow-sm"
                  >
                    Order Now
                  </button>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-[#2D3748] p-2"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          <div
            className={cn(
              'md:hidden overflow-hidden transition-all duration-400',
              menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="bg-white/98 backdrop-blur-md border-t border-[#E8F5E9] px-4 py-6 space-y-4">
              {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm text-[#718096] hover:text-[#87C442] transition-colors"
                >
                  {item}
                </a>
              ))}
              {onShopNow && (
                <button
                  onClick={() => { setMenuOpen(false); onShopNow?.() }}
                  className="w-full bg-[#87C442] text-white px-6 py-3 text-sm font-medium rounded-full"
                >
                  Order Now
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full py-28">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 bg-[#E8F5E9] px-4 py-2 rounded-full mb-6">
                  <Sprout size={14} className="text-[#87C442]" />
                  <span className="text-[#2E7D32] text-xs font-medium tracking-wide">100% Plant-Based</span>
                </div>
                <h1 className="font-['Outfit'] text-5xl sm:text-6xl md:text-7xl text-[#2D3748] leading-[1.05] font-light tracking-tight">
                  {store.name}
                </h1>
                <div className="w-16 h-1 bg-gradient-to-r from-[#87C442] to-[#2E7D32] rounded-full my-6" />
                <p className="text-base sm:text-lg text-[#718096] max-w-lg leading-relaxed font-light">
                  {store.description || 'Nourishing body and planet — fresh, organic, plant-based cuisine that tastes as good as it feels.'}
                </p>
                <div className="flex items-center gap-4 mt-10 flex-wrap">
                  <button
                    onClick={onShopNow}
                    className="bg-[#2E7D32] text-white px-8 py-3.5 text-sm font-medium rounded-full hover:bg-[#1B5E20] transition-all duration-300 shadow-lg shadow-green-900/20"
                  >
                    Eat Green
                  </button>
                  <a
                    href="#menu"
                    className="border-2 border-[#87C442]/40 text-[#87C442] px-8 py-3.5 text-sm font-medium rounded-full hover:bg-[#E8F5E9] transition-all duration-300"
                  >
                    View Menu
                  </a>
                </div>
                {store.avg_rating > 0 && (
                  <div className="flex items-center gap-3 mt-10 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-full border border-[#C8E6C9] max-w-fit">
                    <StarRating rating={store.avg_rating} size={18} activeColor="#87C442" inactiveColor="#C8E6C9" />
                    <span className="text-[#2D3748] text-sm font-medium">{store.avg_rating.toFixed(1)}</span>
                    <span className="text-[#718096] text-sm">({store.reviews_count} reviews)</span>
                  </div>
                )}
              </div>
              <div className="order-1 lg:order-2 flex items-center justify-center">
                <div className="relative">
                  {(store.cover_image || store.cover) ? (
                    <div className="w-[380px] h-[480px] rounded-[2rem] overflow-hidden shadow-2xl">
                      <img
                        src={getImageUrl(store.cover_image || store.cover) || ''}
                        alt={store.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-[380px] h-[480px] rounded-[2rem] bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] flex items-center justify-center">
                      <Leaf size={80} className="text-[#87C442]/30" />
                    </div>
                  )}
                  {/* Organic shape decorations */}
                  <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#87C442]/10 rounded-full blur-3xl" />
                  <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#2E7D32]/10 rounded-full blur-3xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Menu Section ── */}
        <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Leaf size={24} className="mx-auto text-[#87C442] mb-3" />
              <span className="text-[#87C442] text-xs tracking-[0.2em] uppercase font-medium">From Earth to Plate</span>
              <h2 className="font-['Outfit'] text-4xl sm:text-5xl text-[#2D3748] font-light tracking-tight mt-3 mb-4">
                Our Menu
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#87C442] to-[#2E7D32] mx-auto rounded-full" />
            </div>

            {store.foods.length === 0 ? (
              <div className="text-center py-20 bg-[#F5F5DC] rounded-3xl max-w-lg mx-auto border border-[#C8E6C9]">
                <Sprout size={48} className="mx-auto text-[#87C442]/30 mb-4" />
                <p className="font-['Outfit'] text-2xl text-[#2D3748] font-light mb-2">Growing Soon</p>
                <p className="text-[#718096] text-sm">Our plant-based menu is being cultivated.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {store.foods.map((food) => (
                  <div
                    key={food.id}
                    className="group bg-[#F5F5DC] rounded-3xl hover:shadow-lg transition-all duration-500 overflow-hidden"
                  >
                    <div className="relative overflow-hidden aspect-[4/3]">
                      {food.image ? (
                        <img
                          src={getImageUrl(food.image) ?? undefined}
                          alt={food.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#E8F5E9] flex items-center justify-center">
                          <Leaf size={40} className="text-[#C8E6C9]" />
                        </div>
                      )}
                      {food.is_offer && (
                        <span className="absolute top-3 left-3 bg-[#87C442] text-white text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full font-medium">
                          Organic
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-['Outfit'] text-lg font-medium text-[#2D3748] group-hover:text-[#87C442] transition-colors">
                          {food.name}
                        </h3>
                        <span className="font-['Outfit'] text-base font-semibold text-[#2E7D32] whitespace-nowrap">
                          {formatFoodPrice(food, currency)}
                        </span>
                      </div>
                      {food.description && (
                        <p className="text-[#718096] text-sm mt-2 line-clamp-2 leading-relaxed font-light">
                          {food.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#C8E6C9]">
                        <div className="flex items-center gap-1 text-[#87C442]">
                          <Heart size={12} />
                          <span className="text-xs font-light">Plant-based</span>
                        </div>
                        {onAddToCart && (
                          <button
                            data-add-to-cart={food.id}
                            onClick={() => onAddToCart(food.id)}
                            className="bg-[#87C442]/10 text-[#87C442] px-4 py-2 text-xs font-medium rounded-full hover:bg-[#87C442] hover:text-white transition-all duration-300 flex items-center gap-1"
                          >
                            <ShoppingCart size={13} />
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Reviews Section ── */}
        <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F5F5DC]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#87C442] text-xs tracking-[0.2em] uppercase font-medium">Testimonials</span>
              <h2 className="font-['Outfit'] text-4xl sm:text-5xl text-[#2D3748] font-light tracking-tight mt-3 mb-4">
              What Our Community Says
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#87C442] to-[#2E7D32] mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.reviews.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-[#C8E6C9]">
                      <StarRating rating={5} size={15} activeColor="#87C442" inactiveColor="#C8E6C9" />
                      <Quote size={18} className="text-[#87C442]/20 mt-4 mb-3" />
                      <p className="text-[#718096] text-sm leading-relaxed mb-4 font-light italic">
                        Finally, a place where healthy food actually tastes incredible! My new favorite spot.
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                          <span className="text-[#87C442] text-sm font-medium">G</span>
                        </div>
                        <span className="text-[#2D3748] text-sm font-light">Guest</span>
                      </div>
                    </div>
                  ))
                : store.reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl p-6 border border-[#C8E6C9] hover:border-[#87C442]/30 transition-all duration-300">
                      <StarRating rating={review.rating} size={15} activeColor="#87C442" inactiveColor="#C8E6C9" />
                      <Quote size={18} className="text-[#87C442]/20 mt-4 mb-3" />
                      <p className="text-[#718096] text-sm leading-relaxed mb-4 line-clamp-3 font-light italic">
                        {review.comment || 'Delicious and healthy!'}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          {review.avatar ? (
                            <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#E8F5E9] flex items-center justify-center">
                              <span className="text-[#87C442] text-sm font-medium">{review.user.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-[#2D3748] text-sm font-light">{review.user}</span>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* ── Staff Section ── */}
        {store.staff.length > 0 && (
          <section id="team" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-[#87C442] text-xs tracking-[0.2em] uppercase font-medium">Our People</span>
                <h2 className="font-['Outfit'] text-4xl sm:text-5xl text-[#2D3748] font-light tracking-tight mt-3 mb-4">
                  The Green Team
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-[#87C442] to-[#2E7D32] mx-auto rounded-full" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10">
                {store.staff.map((member, idx) => (
                  <div key={idx} className="text-center group">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#87C442] to-[#2E7D32] p-0.5">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <span className="font-['Outfit'] text-2xl font-light text-[#87C442]">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-['Outfit'] text-sm font-medium text-[#2D3748] mt-4 group-hover:text-[#87C442] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-[#718096] text-xs font-light">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Opening Hours ── */}
        {store.opening_hours && (
          <section id="hours" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F5F5DC]">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-12">
                <span className="text-[#87C442] text-xs tracking-[0.2em] uppercase font-medium">Hours</span>
                <h2 className="font-['Outfit'] text-4xl text-[#2D3748] font-light tracking-tight mt-3 mb-4">
                  Opening Hours
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-[#87C442] to-[#2E7D32] mx-auto rounded-full" />
              </div>

              <div className="bg-white rounded-2xl overflow-hidden border border-[#C8E6C9]">
                <div className="bg-gradient-to-r from-[#87C442] to-[#2E7D32] px-6 py-3">
                  <p className="text-white font-['Outfit'] text-sm font-light">Weekly Schedule</p>
                </div>
                <div className="divide-y divide-[#E8F5E9]">
                  {DAY_ORDER.map((day) => {
                    const hours = store.opening_hours![day]
                    return (
                      <div key={day} className="flex items-center justify-between px-6 py-4 hover:bg-[#F5F5DC] transition-colors">
                        <span className="text-[#2D3748] text-sm font-light capitalize">{DAY_LABELS[day]}</span>
                        {hours ? (
                          <span className="text-[#87C442] text-sm font-medium">
                            {hours.open} – {hours.close}
                          </span>
                        ) : (
                          <span className="text-[#718096] text-sm italic font-light">Closed</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Contact Section ── */}
        <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#87C442] text-xs tracking-[0.2em] uppercase font-medium">Connect</span>
              <h2 className="font-['Outfit'] text-4xl sm:text-5xl text-[#2D3748] font-light tracking-tight mt-3 mb-4">
                Get in Touch
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#87C442] to-[#2E7D32] mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {store.phone && (
                <a
                  href={`tel:${store.phone}`}
                  className="group bg-[#F5F5DC] rounded-2xl p-8 text-center hover:shadow-md transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#E8F5E9] group-hover:bg-[#87C442]/20 flex items-center justify-center mb-5 transition-colors">
                    <Phone size={22} className="text-[#87C442]" />
                  </div>
                  <h3 className="font-['Outfit'] text-lg font-medium text-[#2D3748] mb-2">Phone</h3>
                  <p className="text-[#718096] text-sm font-light">{store.phone}</p>
                </a>
              )}
              {store.email && (
                <a
                  href={`mailto:${store.email}`}
                  className="group bg-[#F5F5DC] rounded-2xl p-8 text-center hover:shadow-md transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#E8F5E9] group-hover:bg-[#87C442]/20 flex items-center justify-center mb-5 transition-colors">
                    <Mail size={22} className="text-[#87C442]" />
                  </div>
                  <h3 className="font-['Outfit'] text-lg font-medium text-[#2D3748] mb-2">Email</h3>
                  <p className="text-[#718096] text-sm font-light">{store.email}</p>
                </a>
              )}
              {store.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#F5F5DC] rounded-2xl p-8 text-center hover:shadow-md transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#E8F5E9] group-hover:bg-[#87C442]/20 flex items-center justify-center mb-5 transition-colors">
                    <MapPin size={22} className="text-[#87C442]" />
                  </div>
                  <h3 className="font-['Outfit'] text-lg font-medium text-[#2D3748] mb-2">Address</h3>
                  <p className="text-[#718096] text-sm font-light">{store.address}</p>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-[#2D3748]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {store.logo ? (
                    <img
                      src={getImageUrl(store.logo) || ''}
                      alt={store.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#87C442] to-[#2E7D32] flex items-center justify-center">
                      <Leaf size={16} className="text-white" />
                    </div>
                  )}
                  <span className="font-['Outfit'] text-lg font-light text-white">{store.name}</span>
                </div>
                <p className="text-[#A0AEC0] text-sm leading-relaxed mb-6 font-light">
                  {store.description || 'Plant-based cuisine that nourishes you and the planet.'}
                </p>
                <div className="flex items-center gap-4">
                  <a href="#" className="text-[#A0AEC0] hover:text-[#87C442] transition-colors" aria-label="Instagram">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                  <a href="#" className="text-[#A0AEC0] hover:text-[#87C442] transition-colors" aria-label="Facebook">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-['Outfit'] text-sm font-medium text-[#87C442] mb-5 uppercase tracking-wider">Links</h4>
                <ul className="space-y-3">
                  {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-[#A0AEC0] hover:text-white text-sm transition-colors font-light">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-['Outfit'] text-sm font-medium text-[#87C442] mb-5 uppercase tracking-wider">Learn</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#A0AEC0] hover:text-white text-sm transition-colors font-light">Our Philosophy</a></li>
                  <li><a href="#" className="text-[#A0AEC0] hover:text-white text-sm transition-colors font-light">Sustainability</a></li>
                  <li><a href="#" className="text-[#A0AEC0] hover:text-white text-sm transition-colors font-light">Sourcing</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-['Outfit'] text-sm font-medium text-[#87C442] mb-5 uppercase tracking-wider">Contact</h4>
                <ul className="space-y-3">
                  {store.phone && (
                    <li className="flex items-center gap-2 text-[#A0AEC0] text-sm font-light">
                      <Phone size={14} /> {store.phone}
                    </li>
                  )}
                  {store.email && (
                    <li className="flex items-center gap-2 text-[#A0AEC0] text-sm font-light">
                      <Mail size={14} /> {store.email}
                    </li>
                  )}
                  {store.address && (
                    <li className="flex items-start gap-2 text-[#A0AEC0] text-sm font-light">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span>{store.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#4A5568] bg-[#1A202C]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[#718096] text-xs font-light">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
              <p className="text-[#718096] text-xs font-light">
                Eat plants. Feel good. 🌱
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
