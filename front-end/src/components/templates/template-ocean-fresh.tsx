'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, Quote, Waves, Fish, Anchor } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import { SocialLinks } from '@/components/templates/blocks/social-links'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface OceanFreshProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const DEEP_BLUE = '#0A4C7A'
const SANDY = '#F4E4C1'
const CORAL = '#FF7F50'
const WHITE = '#FFFFFF'
const LIGHT_BLUE = '#D4E8F0'
const NAVY = '#063554'
const TEAL = '#1A7A7A'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

export function TemplateOceanFresh({ store, themeColors, onAddToCart, onShopNow }: OceanFreshProps) {
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
    servesCuisine: 'Seafood, Fresh Fish, Shellfish, Coastal',
    image: getImageUrl(store.cover_image || store.cover),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Inter:wght@300;400;500&display=swap');
        :root { ${Object.entries(c).map(([k, v]) => `${k}: ${v};`).join('\n')} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-[#F4E4C1] text-[#0A4C7A] font-['Inter'] overflow-x-hidden">
        {/* ── Navbar ── */}
        <nav
          className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
            scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm shadow-[#0A4C7A]/10' : 'bg-transparent'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                {store.logo ? (
                  <img
                    src={getImageUrl(store.logo) || ''}
                    alt={store.name}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-[#0A4C7A]/30"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#0A4C7A] to-[#FF7F50] flex items-center justify-center">
                    <Fish size={16} className="text-white" />
                  </div>
                )}
                <span className="font-['Plus_Jakarta_Sans'] text-lg font-semibold text-[#0A4C7A] tracking-tight">
                  {store.name}
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-6">
                {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-[#5A8DAD] hover:text-[#0A4C7A] transition-colors duration-300 font-medium"
                  >
                    {item}
                  </a>
                ))}
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="bg-[#0A4C7A] text-white px-6 py-2.5 text-sm font-semibold rounded-lg hover:bg-[#063554] transition-all duration-300 shadow-md shadow-[#0A4C7A]/20"
                  >
                    Order Now
                  </button>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-[#0A4C7A] p-2"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          <div
            className={cn(
              'lg:hidden overflow-hidden transition-all duration-400',
              menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="bg-white/98 backdrop-blur-md border-t border-[#D4E8F0] px-4 py-6 space-y-4">
              {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm text-[#5A8DAD] hover:text-[#0A4C7A] transition-colors"
                >
                  {item}
                </a>
              ))}
              {onShopNow && (
                <button
                  onClick={() => { setMenuOpen(false); onShopNow?.() }}
                  className="w-full bg-[#0A4C7A] text-white px-6 py-3 text-sm font-semibold rounded-lg"
                >
                  Order Now
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Ocean wave pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A4C7A] via-[#1A7A7A] to-[#0A4C7A]" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 5 Q40 15 30 25 Q20 35 30 45 Q40 55 30 60\' stroke=\'white\' fill=\'none\' stroke-width=\'0.5\' opacity=\'0.3\'/%3E%3C/svg%3E")', backgroundSize: '80px 80px' }} />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-[#F4E4C1]" style={{ borderRadius: '50% 50% 0 0 / 100% 100% 0 0' }} />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8 border border-white/20">
                <Anchor size={14} className="text-[#FF7F50]" />
                <span className="text-white text-xs tracking-wider uppercase font-medium">Fresh Catch Daily</span>
              </div>
              <h1 className="font-['Plus_Jakarta_Sans'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight">
                {store.name}
              </h1>
              <div className="w-20 h-1 bg-[#FF7F50] mx-auto my-6 rounded-full" />
              <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                {store.description || 'Fresh from the ocean to your plate — sustainably caught seafood served with coastal charm.'}
              </p>
              <div className="flex items-center justify-center gap-4 mt-10 flex-wrap">
                <button
                  onClick={onShopNow}
                  className="bg-[#FF7F50] text-white px-10 py-4 text-sm font-bold uppercase tracking-wider rounded-full hover:bg-[#E0683E] transition-all duration-300 hover:scale-105 shadow-2xl shadow-[#FF7F50]/30"
                >
                  Today&apos;s Catch
                </button>
                <a
                  href="#menu"
                  className="border-2 border-white/30 text-white px-10 py-4 text-sm font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
                >
                  View Menu
                </a>
              </div>
              {store.avg_rating > 0 && (
                <div className="mt-12 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/15">
                  <StarRating rating={store.avg_rating} size={20} activeColor="#FF7F50" inactiveColor="#A8C8D8" />
                  <span className="text-white text-sm font-bold">{store.avg_rating.toFixed(1)}</span>
                  <span className="text-white/60 text-sm">({store.reviews_count} reviews)</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Menu Section ── */}
        <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-12 relative z-20">
          <div className="text-center mb-16">
            <Fish size={24} className="mx-auto text-[#0A4C7A] mb-3" />
            <span className="text-[#0A4C7A] text-xs tracking-[0.2em] uppercase font-semibold">Ocean Selection</span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl font-bold text-[#0A4C7A] mt-3 mb-4 tracking-tight">
              Our Menu
            </h2>
            <div className="w-16 h-1 bg-[#FF7F50] mx-auto rounded-full" />
          </div>

          {store.foods.length === 0 ? (
            <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#D4E8F0] max-w-lg mx-auto shadow-lg">
              <Fish size={48} className="mx-auto text-[#0A4C7A]/30 mb-4" />
              <p className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#0A4C7A] mb-2">Net Coming In</p>
              <p className="text-[#5A8DAD]">Our fresh catch menu is being prepared daily.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.foods.map((food) => (
                <div
                  key={food.id}
                  className="group bg-white rounded-2xl hover:shadow-xl transition-all duration-500 overflow-hidden shadow-md"
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    {food.image ? (
                      <img
                        src={getImageUrl(food.image) ?? undefined}
                        alt={food.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#D4E8F0] to-[#F4E4C1] flex items-center justify-center">
                        <Waves size={40} className="text-[#0A4C7A]/20" />
                      </div>
                    )}
                    {food.is_offer && (
                      <span className="absolute top-3 left-3 bg-[#FF7F50] text-white text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full font-bold shadow-md">
                        Fresh Catch
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0A4C7A] group-hover:text-[#FF7F50] transition-colors">
                      {food.name}
                    </h3>
                    {food.description && (
                      <p className="text-[#5A8DAD] text-sm mt-2 line-clamp-2 leading-relaxed">
                        {food.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#D4E8F0]">
                      <span className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#0A4C7A]">
                        {formatFoodPrice(food, currency)}
                      </span>
                      {onAddToCart && (
                        <button
                          data-add-to-cart={food.id}
                          onClick={() => onAddToCart(food.id)}
                          className="bg-[#0A4C7A]/10 text-[#0A4C7A] px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#0A4C7A] hover:text-white transition-all duration-300 flex items-center gap-1"
                        >
                          <ShoppingCart size={14} />
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Reviews Section ── */}
        <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#0A4C7A] text-xs tracking-[0.2em] uppercase font-semibold">Testimonials</span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl font-bold text-[#0A4C7A] mt-3 mb-4 tracking-tight">
                What Guests Say
              </h2>
              <div className="w-16 h-1 bg-[#FF7F50] mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.reviews.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-[#F4E4C1]/30 rounded-xl p-6 border border-[#D4E8F0]">
                      <StarRating rating={5} size={16} activeColor="#FF7F50" inactiveColor="#A8C8D8" />
                      <Quote size={20} className="text-[#0A4C7A]/20 mt-4 mb-3" />
                      <p className="text-[#5A8DAD] text-sm leading-relaxed mb-4">
                        The freshest seafood I have ever tasted. The ocean-to-table concept really works!
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#D4E8F0]">
                        <div className="w-10 h-10 rounded-full bg-[#0A4C7A]/10 flex items-center justify-center">
                          <span className="text-[#0A4C7A] text-sm font-bold">G</span>
                        </div>
                        <div>
                          <p className="text-[#0A4C7A] text-sm font-semibold">Guest</p>
                          <p className="text-[#5A8DAD] text-xs">Verified Diner</p>
                        </div>
                      </div>
                    </div>
                  ))
                : store.reviews.map((review) => (
                    <div key={review.id} className="bg-[#F4E4C1]/30 rounded-xl p-6 border border-[#D4E8F0] hover:border-[#FF7F50]/30 transition-all duration-300">
                      <StarRating rating={review.rating} size={16} activeColor="#FF7F50" inactiveColor="#A8C8D8" />
                      <Quote size={20} className="text-[#0A4C7A]/20 mt-4 mb-3" />
                      <p className="text-[#5A8DAD] text-sm leading-relaxed mb-4 line-clamp-3">
                        {review.comment || 'Amazing fresh seafood!'}
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#D4E8F0]">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          {review.avatar ? (
                            <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#0A4C7A]/10 flex items-center justify-center">
                              <span className="text-[#0A4C7A] text-sm font-bold">{review.user.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[#0A4C7A] text-sm font-semibold">{review.user}</p>
                          <p className="text-[#5A8DAD] text-xs">Verified Diner</p>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* ── Staff Section ── */}
        {store.staff.length > 0 && (
          <section id="team" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F4E4C1]">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-[#0A4C7A] text-xs tracking-[0.2em] uppercase font-semibold">Our Crew</span>
                <h2 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl font-bold text-[#0A4C7A] mt-3 mb-4 tracking-tight">
                  Meet the Team
                </h2>
                <div className="w-16 h-1 bg-[#FF7F50] mx-auto rounded-full" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                {store.staff.map((member, idx) => (
                  <div key={idx} className="text-center group">
                    <div className="w-24 h-24 mx-auto rounded-full bg-white border-3 border-[#0A4C7A]/20 group-hover:border-[#FF7F50]/50 transition-all duration-300 flex items-center justify-center shadow-md overflow-hidden">
                      <span className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#0A4C7A]">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0A4C7A] mt-4 group-hover:text-[#FF7F50] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-[#5A8DAD] text-sm">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Opening Hours ── */}
        {store.opening_hours && (
          <section id="hours" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-12">
                <span className="text-[#0A4C7A] text-xs tracking-[0.2em] uppercase font-semibold">Tide Times</span>
                <h2 className="font-['Plus_Jakarta_Sans'] text-4xl font-bold text-[#0A4C7A] mt-3 mb-4 tracking-tight">
                  Opening Hours
                </h2>
                <div className="w-16 h-1 bg-[#FF7F50] mx-auto rounded-full" />
              </div>

              <div className="bg-white rounded-xl overflow-hidden border border-[#D4E8F0] shadow-md">
                <div className="bg-gradient-to-r from-[#0A4C7A] to-[#1A7A7A] px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Waves size={16} className="text-[#FF7F50]" />
                    <p className="text-white font-['Plus_Jakarta_Sans'] text-sm font-semibold">Weekly Schedule</p>
                  </div>
                </div>
                <div className="divide-y divide-[#D4E8F0]">
                  {DAY_ORDER.map((day) => {
                    const hours = store.opening_hours![day]
                    return (
                      <div key={day} className="flex items-center justify-between px-6 py-4 hover:bg-[#F4E4C1]/20 transition-colors">
                        <span className="text-[#0A4C7A] text-sm font-semibold capitalize">{DAY_LABELS[day]}</span>
                        {hours ? (
                          <span className="text-[#FF7F50] text-sm font-bold">
                            {hours.open} – {hours.close}
                          </span>
                        ) : (
                          <span className="text-[#5A8DAD] text-sm italic">Closed</span>
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
        <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F4E4C1]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#0A4C7A] text-xs tracking-[0.2em] uppercase font-semibold">Reach Out</span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl font-bold text-[#0A4C7A] mt-3 mb-4 tracking-tight">
                Contact Us
              </h2>
              <div className="w-16 h-1 bg-[#FF7F50] mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {store.phone && (
                <a
                  href={`tel:${store.phone}`}
                  className="group bg-white rounded-xl border border-[#D4E8F0] hover:border-[#0A4C7A]/30 p-8 text-center transition-all duration-300 hover:shadow-lg"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#0A4C7A]/10 group-hover:bg-[#FF7F50]/20 flex items-center justify-center mb-5 transition-colors">
                    <Phone size={22} className="text-[#0A4C7A] group-hover:text-[#FF7F50]" />
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0A4C7A] mb-2">Phone</h3>
                  <p className="text-[#5A8DAD] text-sm">{store.phone}</p>
                </a>
              )}
              {store.email && (
                <a
                  href={`mailto:${store.email}`}
                  className="group bg-white rounded-xl border border-[#D4E8F0] hover:border-[#0A4C7A]/30 p-8 text-center transition-all duration-300 hover:shadow-lg"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#0A4C7A]/10 group-hover:bg-[#FF7F50]/20 flex items-center justify-center mb-5 transition-colors">
                    <Mail size={22} className="text-[#0A4C7A] group-hover:text-[#FF7F50]" />
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0A4C7A] mb-2">Email</h3>
                  <p className="text-[#5A8DAD] text-sm">{store.email}</p>
                </a>
              )}
              {store.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-xl border border-[#D4E8F0] hover:border-[#0A4C7A]/30 p-8 text-center transition-all duration-300 hover:shadow-lg"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#0A4C7A]/10 group-hover:bg-[#FF7F50]/20 flex items-center justify-center mb-5 transition-colors">
                    <MapPin size={22} className="text-[#0A4C7A] group-hover:text-[#FF7F50]" />
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0A4C7A] mb-2">Address</h3>
                  <p className="text-[#5A8DAD] text-sm">{store.address}</p>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-[#063554]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {store.logo ? (
                    <img
                      src={getImageUrl(store.logo) || ''}
                      alt={store.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-[#FF7F50]/30"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0A4C7A] to-[#FF7F50] flex items-center justify-center">
                      <Fish size={18} className="text-white" />
                    </div>
                  )}
                  <span className="font-['Plus_Jakarta_Sans'] text-lg font-semibold text-white">{store.name}</span>
                </div>
                <p className="text-[#87B8D0] text-sm leading-relaxed mb-6">
                  {store.description || 'Fresh, sustainable seafood served with ocean views and coastal hospitality.'}
                </p>
                <SocialLinks links={store.social_links ?? []} />
              </div>

              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#FF7F50] mb-5 uppercase tracking-wider">Quick Links</h4>
                <ul className="space-y-3">
                  {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-[#87B8D0] hover:text-white text-sm transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#FF7F50] mb-5 uppercase tracking-wider">Info</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#87B8D0] hover:text-white text-sm transition-colors">Sustainability</a></li>
                  <li><a href="#" className="text-[#87B8D0] hover:text-white text-sm transition-colors">Our Fleet</a></li>
                  <li><a href="#" className="text-[#87B8D0] hover:text-white text-sm transition-colors">Private Events</a></li>
                  <li><a href="#" className="text-[#87B8D0] hover:text-white text-sm transition-colors">Gift Cards</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#FF7F50] mb-5 uppercase tracking-wider">Contact</h4>
                <ul className="space-y-3">
                  {store.phone && (
                    <li>
                      <a href={`tel:${store.phone}`} className="text-[#87B8D0] hover:text-white text-sm transition-colors flex items-center gap-2">
                        <Phone size={14} /> {store.phone}
                      </a>
                    </li>
                  )}
                  {store.email && (
                    <li>
                      <a href={`mailto:${store.email}`} className="text-[#87B8D0] hover:text-white text-sm transition-colors flex items-center gap-2">
                        <Mail size={14} /> {store.email}
                      </a>
                    </li>
                  )}
                  {store.address && (
                    <li className="flex items-start gap-2 text-[#87B8D0] text-sm">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span>{store.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#0A4C7A]/30 bg-[#042840]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[#87B8D0]/50 text-xs">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
              <p className="text-[#87B8D0]/50 text-xs">
                From Ocean to Plate 🌊
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
