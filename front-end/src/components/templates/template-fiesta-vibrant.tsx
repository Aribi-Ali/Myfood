'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, ChevronRight, Quote, Music, Flame, Sun } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import { SocialLinks } from '@/components/templates/blocks/social-links'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface FiestaVibrantProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const ORANGE = '#FF6B35'
const YELLOW = '#FFD700'
const RED = '#E63946'
const TEAL = '#2A9D8F'
const DARK = '#1D3557'
const WARM_BG = '#FFF8E7'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

export function TemplateFiestaVibrant({ store, themeColors, onAddToCart, onShopNow }: FiestaVibrantProps) {
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
    servesCuisine: 'Mexican, Latin American, Tex-Mex',
    image: getImageUrl(store.cover_image || store.cover),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Inter:wght@300;400;500;600&display=swap');
        :root { ${Object.entries(c).map(([k, v]) => `${k}: ${v};`).join('\n')} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fiesta-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      <div className="min-h-screen bg-[#FFF8E7] text-[#1D3557] font-['Inter'] overflow-x-hidden">
        {/* ── Announcement Bar ── */}
        <div className="bg-gradient-to-r from-[#E63946] via-[#FF6B35] to-[#FFD700] text-white text-center text-xs sm:text-sm py-2.5 px-4 font-bold tracking-wider uppercase overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <span className="mx-6">🎉 Fiesta Time! 🌮 Taco Tuesday Special!</span>
            <span className="mx-6">✦</span>
            <span className="mx-6">🍹 2x1 Margaritas 5-7PM</span>
            <span className="mx-6">✦</span>
            <span className="mx-6">🔥 Live Mariachi Every Friday!</span>
          </div>
        </div>

        {/* ── Navbar ── */}
        <nav
          className={cn(
            'fixed top-10 left-0 right-0 z-50 transition-all duration-500',
            scrolled ? 'top-0 bg-[#1D3557]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                {store.logo ? (
                  <img
                    src={getImageUrl(store.logo) || ''}
                    alt={store.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-[#FFD700]/50"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#E63946] flex items-center justify-center">
                    <Flame size={18} className="text-white" />
                  </div>
                )}
                <span className="font-['DM_Sans'] text-xl font-bold text-white tracking-tight">
                  {store.name}
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-6">
                {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm font-medium text-[#F5DEB3] hover:text-[#FFD700] transition-colors duration-300"
                  >
                    {item}
                  </a>
                ))}
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="bg-[#FF6B35] text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-[#E85D2C] transition-all duration-300 shadow-lg shadow-[#FF6B35]/30"
                  >
                    Order Now
                  </button>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-white p-2"
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
            <div className="bg-[#1D3557]/98 backdrop-blur-md border-t border-[#FFD700]/10 px-4 py-6 space-y-4">
              {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm font-medium text-[#F5DEB3] hover:text-[#FFD700] transition-colors"
                >
                  {item}
                </a>
              ))}
              {onShopNow && (
                <button
                  onClick={() => { setMenuOpen(false); onShopNow?.() }}
                  className="w-full bg-[#FF6B35] text-white px-6 py-3 text-sm font-bold uppercase tracking-wider"
                >
                  Order Now
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-10">
          {/* Pattern background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#E63946] via-[#FF6B35] to-[#FFD700]" />
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 22px), repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 22px)' }} />

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-32">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8 border border-white/20">
              <Music size={16} className="text-[#FFD700]" />
              <span className="text-white text-sm font-bold tracking-wider uppercase">¡Bienvenidos!</span>
            </div>
            <h1 className="font-['DM_Sans'] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.05] mb-6 tracking-tight">
              {store.name}
            </h1>
            <div className="w-24 h-1 bg-[#FFD700] mx-auto mb-6 rounded-full" />
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              {store.description || 'Bold flavors, vibrant colors, and the spirit of México in every bite. ¡Olé!'}
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={onShopNow}
                className="bg-[#FFD700] text-[#1D3557] px-10 py-4 rounded-full text-sm font-extrabold uppercase tracking-wider hover:bg-yellow-400 transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                ¡Ordena Ahora!
              </button>
              <a
                href="#menu"
                className="border-2 border-white/40 text-white px-10 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-white/10 transition-all duration-300"
              >
                View Menu
              </a>
            </div>
            {store.avg_rating > 0 && (
              <div className="mt-12 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/15">
                <StarRating rating={store.avg_rating} size={22} activeColor="#FFD700" inactiveColor="#F5DEB3" />
                <span className="text-white text-sm font-bold">{store.avg_rating.toFixed(1)}</span>
                <span className="text-white/60 text-sm">({store.reviews_count} reviews)</span>
              </div>
            )}
          </div>
        </section>

        {/* ── Menu Section ── */}
        <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Flame size={24} className="mx-auto text-[#FF6B35] mb-3" />
            <span className="text-[#FF6B35] text-sm font-bold tracking-[0.2em] uppercase">Nuestro Menú</span>
            <h2 className="font-['DM_Sans'] text-4xl sm:text-5xl font-extrabold text-[#1D3557] mt-3 mb-4 tracking-tight">
              Our Menu
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#FF6B35] to-[#FFD700] mx-auto rounded-full" />
          </div>

          {store.foods.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-[#FF6B35]/30 max-w-lg mx-auto shadow-sm">
              <Flame size={48} className="mx-auto text-[#FF6B35]/30 mb-4" />
              <p className="font-['DM_Sans'] text-2xl font-bold text-[#1D3557] mb-2">Menu Coming Soon</p>
              <p className="text-[#457B9D]">We are preparing something spicy!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.foods.map((food) => (
                <div
                  key={food.id}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-[#FFE4C4] hover:border-[#FF6B35]/40"
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    {food.image ? (
                      <img
                        src={getImageUrl(food.image) ?? undefined}
                        alt={food.name}
                        className="w-full h-full object-cover transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#FFF8E7] to-[#FFE4C4] flex items-center justify-center">
                        <Sun size={40} className="text-[#FFD700]/30" />
                      </div>
                    )}
                    {food.is_offer && (
                      <span className="absolute top-3 right-3 bg-[#E63946] text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-full shadow-lg">
                        ¡Oferta!
                      </span>
                    )}
                    {food.cooking_time && (
                      <span className="absolute bottom-3 left-3 bg-white/90 text-[#1D3557] text-[10px] font-bold px-2 py-1 rounded-full">
                        🕐 {food.cooking_time} min
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-['DM_Sans'] text-lg font-bold text-[#1D3557] group-hover:text-[#FF6B35] transition-colors">
                      {food.name}
                    </h3>
                    {food.description && (
                      <p className="text-[#457B9D] text-sm mt-2 line-clamp-2 leading-relaxed">
                        {food.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#FFE4C4]">
                      <div>
                        <span className="font-['DM_Sans'] text-xl font-extrabold text-[#E63946]">
                          {formatFoodPrice(food, currency)}
                        </span>
                        {food.new_price && (
                          <span className="text-[#457B9D] text-xs line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>
                        )}
                      </div>
                      {onAddToCart && (
                        <button
                          data-add-to-cart={food.id}
                          onClick={() => onAddToCart(food.id)}
                          className="bg-[#FF6B35] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#E85D2C] transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-1"
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
        <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFF8E7] to-[#FFE4C4]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#E63946] text-sm font-bold tracking-[0.2em] uppercase">Testimonios</span>
              <h2 className="font-['DM_Sans'] text-4xl sm:text-5xl font-extrabold text-[#1D3557] mt-3 mb-4 tracking-tight">
                Customer Reviews
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#E63946] to-[#FF6B35] mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.reviews.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-[#FFE4C4] hover:shadow-lg transition-all duration-300">
                      <StarRating rating={5} activeColor="#FFD700" inactiveColor="#F5DEB3" />
                      <Quote size={20} className="text-[#FF6B35]/20 mt-4 mb-3" />
                      <p className="text-[#457B9D] text-sm leading-relaxed mb-4">
                        The best Mexican food in town! The flavors are incredible and the atmosphere is always festive!
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#FFE4C4]">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#E63946] flex items-center justify-center">
                          <span className="text-white text-sm font-bold">G</span>
                        </div>
                        <div>
                          <p className="font-['DM_Sans'] font-bold text-[#1D3557] text-sm">Guest</p>
                          <p className="text-[#457B9D] text-xs">Happy Customer</p>
                        </div>
                      </div>
                    </div>
                  ))
                : store.reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-xl border border-[#FFE4C4] hover:border-[#FF6B35]/30 hover:shadow-lg transition-all duration-300">
                      <StarRating rating={review.rating} activeColor="#FFD700" inactiveColor="#F5DEB3" />
                      <Quote size={20} className="text-[#FF6B35]/20 mt-4 mb-3" />
                      <p className="text-[#457B9D] text-sm leading-relaxed mb-4 line-clamp-3">
                        {review.comment || 'Amazing flavors!'}
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#FFE4C4]">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          {review.avatar ? (
                            <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#FF6B35] to-[#E63946] flex items-center justify-center">
                              <span className="text-white text-sm font-bold">{review.user.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-['DM_Sans'] font-bold text-[#1D3557] text-sm">{review.user}</p>
                          <p className="text-[#457B9D] text-xs">Happy Customer</p>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* ── Staff Section ── */}
        {store.staff.length > 0 && (
          <section id="team" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#2A9D8F] text-sm font-bold tracking-[0.2em] uppercase">El Equipo</span>
              <h2 className="font-['DM_Sans'] text-4xl sm:text-5xl font-extrabold text-[#1D3557] mt-3 mb-4 tracking-tight">
                Meet the Team
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[#2A9D8F] to-[#FF6B35] mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {store.staff.map((member, idx) => (
                <div key={idx} className="text-center group">
                  <div className={cn(
                    'w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-300 shadow-md',
                    idx % 3 === 0 ? 'border-[#FF6B35] group-hover:border-[#E63946]' :
                    idx % 3 === 1 ? 'border-[#2A9D8F] group-hover:border-[#FFD700]' :
                    'border-[#FFD700] group-hover:border-[#FF6B35]'
                  )}>
                    <span className="font-['DM_Sans'] text-3xl font-extrabold text-[#1D3557]">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-['DM_Sans'] font-bold text-[#1D3557] mt-4 group-hover:text-[#FF6B35] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-[#457B9D] text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Opening Hours ── */}
        {store.opening_hours && (
          <section id="hours" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFE4C4] to-[#FFF8E7]">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-12">
                <span className="text-[#2A9D8F] text-sm font-bold tracking-[0.2em] uppercase">Horario</span>
                <h2 className="font-['DM_Sans'] text-4xl font-extrabold text-[#1D3557] mt-3 mb-4 tracking-tight">
                  Opening Hours
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-[#2A9D8F] to-[#FFD700] mx-auto rounded-full" />
              </div>

              <div className="bg-white rounded-xl overflow-hidden border border-[#FFE4C4] shadow-md">
                <div className="bg-gradient-to-r from-[#E63946] to-[#FF6B35] px-6 py-4">
                  <p className="text-white font-['DM_Sans'] font-bold text-sm">Weekly Schedule</p>
                </div>
                <div className="divide-y divide-[#FFE4C4]">
                  {DAY_ORDER.map((day) => {
                    const hours = store.opening_hours![day]
                    return (
                      <div key={day} className="flex items-center justify-between px-6 py-4 hover:bg-[#FFF8E7] transition-colors">
                        <span className="text-[#1D3557] font-['DM_Sans'] font-bold text-sm capitalize">{DAY_LABELS[day]}</span>
                        {hours ? (
                          <span className="text-[#E63946] font-bold text-sm">
                            {hours.open} – {hours.close}
                          </span>
                        ) : (
                          <span className="text-[#457B9D] text-sm italic">Closed</span>
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
        <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#2A9D8F] text-sm font-bold tracking-[0.2em] uppercase">Contacto</span>
            <h2 className="font-['DM_Sans'] text-4xl sm:text-5xl font-extrabold text-[#1D3557] mt-3 mb-4 tracking-tight">
              Get in Touch
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#2A9D8F] to-[#FF6B35] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {store.phone && (
              <a
                href={`tel:${store.phone}`}
                className="group bg-white rounded-xl border border-[#FFE4C4] hover:border-[#FF6B35]/40 p-8 text-center transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#FF6B35]/10 to-[#E63946]/10 group-hover:from-[#FF6B35]/20 group-hover:to-[#E63946]/20 flex items-center justify-center mb-5 transition-all">
                  <Phone size={22} className="text-[#FF6B35]" />
                </div>
                <h3 className="font-['DM_Sans'] font-bold text-[#1D3557] text-lg mb-2">Phone</h3>
                <p className="text-[#457B9D] text-sm">{store.phone}</p>
              </a>
            )}
            {store.email && (
              <a
                href={`mailto:${store.email}`}
                className="group bg-white rounded-xl border border-[#FFE4C4] hover:border-[#FF6B35]/40 p-8 text-center transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#FF6B35]/10 to-[#E63946]/10 group-hover:from-[#FF6B35]/20 group-hover:to-[#E63946]/20 flex items-center justify-center mb-5 transition-all">
                  <Mail size={22} className="text-[#FF6B35]" />
                </div>
                <h3 className="font-['DM_Sans'] font-bold text-[#1D3557] text-lg mb-2">Email</h3>
                <p className="text-[#457B9D] text-sm">{store.email}</p>
              </a>
            )}
            {store.address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-xl border border-[#FFE4C4] hover:border-[#FF6B35]/40 p-8 text-center transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#FF6B35]/10 to-[#E63946]/10 group-hover:from-[#FF6B35]/20 group-hover:to-[#E63946]/20 flex items-center justify-center mb-5 transition-all">
                  <MapPin size={22} className="text-[#FF6B35]" />
                </div>
                <h3 className="font-['DM_Sans'] font-bold text-[#1D3557] text-lg mb-2">Address</h3>
                <p className="text-[#457B9D] text-sm">{store.address}</p>
              </a>
            )}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-[#1D3557]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {store.logo ? (
                    <img
                      src={getImageUrl(store.logo) || ''}
                      alt={store.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-[#FFD700]/40"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#E63946] flex items-center justify-center">
                      <Flame size={18} className="text-white" />
                    </div>
                  )}
                  <span className="font-['DM_Sans'] font-bold text-lg text-white">{store.name}</span>
                </div>
                <p className="text-[#A8DADC] text-sm leading-relaxed mb-6">
                  {store.description || 'Bold Mexican flavors since day one. ¡Olé!'}
                </p>
                <SocialLinks links={store.social_links ?? []} />
              </div>

              <div>
                <h4 className="font-['DM_Sans'] font-bold text-[#FFD700] text-sm mb-5 uppercase tracking-wider">Quick Links</h4>
                <ul className="space-y-3">
                  {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-[#A8DADC] hover:text-[#FFD700] text-sm transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-['DM_Sans'] font-bold text-[#FFD700] text-sm mb-5 uppercase tracking-wider">Info</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#A8DADC] hover:text-[#FFD700] text-sm transition-colors">Catering</a></li>
                  <li><a href="#" className="text-[#A8DADC] hover:text-[#FFD700] text-sm transition-colors">Private Parties</a></li>
                  <li><a href="#" className="text-[#A8DADC] hover:text-[#FFD700] text-sm transition-colors">Gift Cards</a></li>
                  <li><a href="#" className="text-[#A8DADC] hover:text-[#FFD700] text-sm transition-colors">Careers</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-['DM_Sans'] font-bold text-[#FFD700] text-sm mb-5 uppercase tracking-wider">Contact</h4>
                <ul className="space-y-3">
                  {store.phone && (
                    <li>
                      <a href={`tel:${store.phone}`} className="text-[#A8DADC] hover:text-[#FFD700] text-sm transition-colors flex items-center gap-2">
                        <Phone size={14} /> {store.phone}
                      </a>
                    </li>
                  )}
                  {store.email && (
                    <li>
                      <a href={`mailto:${store.email}`} className="text-[#A8DADC] hover:text-[#FFD700] text-sm transition-colors flex items-center gap-2">
                        <Mail size={14} /> {store.email}
                      </a>
                    </li>
                  )}
                  {store.address && (
                    <li className="flex items-start gap-2 text-[#A8DADC] text-sm">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span>{store.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#457B9D]/30 bg-[#15273F]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[#A8DADC]/50 text-xs">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
              <p className="text-[#A8DADC]/50 text-xs font-bold">
                ¡Viva la Fiesta! 🎉
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
