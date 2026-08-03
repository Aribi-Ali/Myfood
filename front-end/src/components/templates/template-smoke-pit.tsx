'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, ChevronRight, Quote, Flame, Zap, Award } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import { SocialLinks } from '@/components/templates/blocks/social-links'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface SmokePitProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const DARK_WOOD = '#3E2723'
const CHARCOAL = '#212121'
const EMBER = '#FF6F00'
const CREAM = '#FFF3E0'
const WARM_BROWN = '#5D4037'
const SMOKE = '#424242'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

export function TemplateSmokePit({ store, themeColors, onAddToCart, onShopNow }: SmokePitProps) {
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
    servesCuisine: 'American, BBQ, Southern, Smokehouse',
    image: getImageUrl(store.cover_image || store.cover),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');
        :root { ${Object.entries(c).map(([k, v]) => `${k}: ${v};`).join('\n')} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen bg-[#212121] text-[#FFF3E0] font-['Inter'] overflow-x-hidden">
        {/* ── Navbar ── */}
        <nav
          className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
            scrolled ? 'bg-[#212121]/95 backdrop-blur-md shadow-lg shadow-black/40 border-b border-[#FF6F00]/20' : 'bg-transparent'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                {store.logo ? (
                  <img
                    src={getImageUrl(store.logo) || ''}
                    alt={store.name}
                    className="h-10 w-10 rounded object-cover ring-2 ring-[#FF6F00]/30"
                  />
                ) : (
                  <div className="h-10 w-10 rounded bg-gradient-to-br from-[#FF6F00] to-[#FF8F00] flex items-center justify-center">
                    <Flame size={18} className="text-[#212121]" />
                  </div>
                )}
                <span className="font-['Bebas_Neue'] text-2xl tracking-wider text-[#FFF3E0]">
                  {store.name}
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-6">
                {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm tracking-widest uppercase text-[#8D6E63] hover:text-[#FF6F00] transition-colors duration-300 font-medium"
                  >
                    {item}
                  </a>
                ))}
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="bg-[#FF6F00] text-[#212121] px-6 py-2.5 text-sm tracking-widest uppercase font-bold hover:bg-[#FF8F00] transition-all duration-300"
                  >
                    Order Now
                  </button>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-[#FFF3E0] p-2"
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
            <div className="bg-[#212121]/98 backdrop-blur-md border-t border-[#FF6F00]/10 px-4 py-6 space-y-4">
              {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm tracking-widest uppercase text-[#8D6E63] hover:text-[#FF6F00] transition-colors"
                >
                  {item}
                </a>
              ))}
              {onShopNow && (
                <button
                  onClick={() => { setMenuOpen(false); onShopNow?.() }}
                  className="w-full bg-[#FF6F00] text-[#212121] px-6 py-3 text-sm tracking-widest uppercase font-bold"
                >
                  Order Now
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-[#212121]" />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #FF6F00 0%, transparent 50%), radial-gradient(circle at 70% 50%, #FF6F00 0%, transparent 50%)' }} />

          {(store.cover_image || store.cover) && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-25"
              style={{ backgroundImage: `url(${getImageUrl(store.cover_image || store.cover)})` }}
            />
          )}

          {/* Wood grain overlay */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.03) 3px, rgba(255,255,255,0.03) 4px)' }} />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#3E2723]/80 border border-[#FF6F00]/20 px-4 py-2 mb-6">
                  <Flame size={14} className="text-[#FF6F00]" />
                  <span className="text-[#FF6F00] text-xs tracking-[0.2em] uppercase font-bold">Low &amp; Slow Since 1998</span>
                </div>
                <h1 className="font-['Bebas_Neue'] text-6xl sm:text-7xl md:text-8xl text-[#FFF3E0] leading-[0.9] tracking-tight">
                  {store.name}
                </h1>
                <p className="text-base sm:text-lg text-[#8D6E63] max-w-lg mt-6 leading-relaxed">
                  {store.description || 'Hand-rubbed, pit-smoked, and slathered in our signature sauce. Real BBQ. Real Smoke. Real Good.'}
                </p>
                <div className="flex items-center gap-4 mt-10 flex-wrap">
                  <button
                    onClick={onShopNow}
                    className="bg-[#FF6F00] text-[#212121] px-10 py-4 text-sm tracking-[0.15em] uppercase font-bold hover:bg-[#FF8F00] transition-all duration-300 shadow-2xl shadow-orange-900/40"
                  >
                    Get Smoked
                  </button>
                  <a
                    href="#menu"
                    className="border-2 border-[#5D4037] text-[#8D6E63] px-10 py-4 text-sm tracking-[0.15em] uppercase font-medium hover:border-[#FF6F00] hover:text-[#FF6F00] transition-all duration-300"
                  >
                    View Menu
                  </a>
                </div>
                {store.avg_rating > 0 && (
                  <div className="flex items-center gap-3 mt-10 border border-[#3E2723] px-5 py-3 max-w-fit bg-black/20">
                    <StarRating rating={store.avg_rating} size={18} activeColor="#FF6F00" inactiveColor="#5D4037" />
                    <span className="text-[#FF6F00] text-sm font-bold">{store.avg_rating.toFixed(1)}</span>
                    <span className="text-[#8D6E63] text-sm">({store.reviews_count} reviews)</span>
                  </div>
                )}
              </div>
              <div className="hidden lg:flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-64 h-64 rounded-full border-4 border-[#3E2723] flex items-center justify-center">
                    <div className="text-center">
                      <Flame size={60} className="mx-auto text-[#FF6F00]/40 mb-2" />
                      <p className="font-['Bebas_Neue'] text-3xl text-[#FF6F00] tracking-wider">SMOKED</p>
                      <p className="text-[#8D6E63] text-xs uppercase tracking-widest">To Perfection</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-[#3E2723] border border-[#FF6F00]/30 px-5 py-2">
                    <p className="font-['Bebas_Neue'] text-xl text-[#FF6F00] tracking-wider">AWARD WINNING</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <p className="font-['Bebas_Neue'] text-xs text-[#8D6E63] tracking-[0.3em] uppercase animate-pulse">⬇ Scroll for Smoke ⬇</p>
          </div>
        </section>

        {/* ── Menu Section ── */}
        <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Zap size={24} className="mx-auto text-[#FF6F00] mb-3" />
              <span className="text-[#FF6F00] text-xs tracking-[0.25em] uppercase font-bold">The Smokehouse</span>
              <h2 className="font-['Bebas_Neue'] text-5xl sm:text-6xl text-[#FFF3E0] mt-2 mb-3 tracking-tight">
                Our Menu
              </h2>
              <div className="w-20 h-0.5 bg-[#FF6F00] mx-auto" />
            </div>

            {store.foods.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-[#3E2723] max-w-lg mx-auto">
                <Flame size={48} className="mx-auto text-[#FF6F00]/30 mb-4" />
                <p className="font-['Bebas_Neue'] text-3xl text-[#FFF3E0] mb-2">Smoke Coming Soon</p>
                <p className="text-[#8D6E63] text-sm">Our pits are heating up. Check back for BBQ.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.foods.map((food) => (
                  <div
                    key={food.id}
                    className="group bg-[#2A2A2A] border border-[#3E2723] hover:border-[#FF6F00]/40 transition-all duration-500 overflow-hidden"
                  >
                    <div className="relative overflow-hidden aspect-[4/3]">
                      {food.image ? (
                        <img
                          src={getImageUrl(food.image) ?? undefined}
                          alt={food.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#333] flex items-center justify-center">
                          <Zap size={36} className="text-[#3E2723]" />
                        </div>
                      )}
                      {food.is_offer && (
                        <span className="absolute top-3 left-3 bg-[#FF6F00] text-[#212121] text-[9px] tracking-widest uppercase px-3 py-1 font-bold">
                          Pit Special
                        </span>
                      )}
                      {food.cooking_time && (
                        <span className="absolute bottom-3 right-3 bg-[#212121]/80 text-[#FFF3E0] text-xs px-2 py-1 border border-[#FF6F00]/30">
                          ⏱ {food.cooking_time} min
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-['Bebas_Neue'] text-xl tracking-wide text-[#FFF3E0] group-hover:text-[#FF6F00] transition-colors">
                        {food.name}
                      </h3>
                      {food.description && (
                        <p className="text-[#8D6E63] text-sm mt-1 line-clamp-2 leading-relaxed">
                          {food.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#3E2723]">
                        <span className="font-['Bebas_Neue'] text-xl tracking-wider text-[#FF6F00]">
                          {formatFoodPrice(food, currency)}
                        </span>
                        {onAddToCart && (
                          <button
                            data-add-to-cart={food.id}
                            onClick={() => onAddToCart(food.id)}
                            className="bg-[#3E2723] text-[#FFF3E0] px-4 py-2 text-xs tracking-widest uppercase font-bold hover:bg-[#FF6F00] hover:text-[#212121] transition-all duration-300 flex items-center gap-1"
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
          </div>
        </section>

        {/* ── Reviews Section ── */}
        <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#212121]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#FF6F00] text-xs tracking-[0.25em] uppercase font-bold">Testimonials</span>
              <h2 className="font-['Bebas_Neue'] text-5xl sm:text-6xl text-[#FFF3E0] mt-2 mb-3 tracking-tight">
                What They Say
              </h2>
              <div className="w-20 h-0.5 bg-[#FF6F00] mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {store.reviews.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-[#2A2A2A] p-6 border border-[#3E2723] hover:border-[#FF6F00]/20 transition-all">
                      <StarRating rating={5} size={16} activeColor="#FF6F00" inactiveColor="#5D4037" />
                      <Quote size={20} className="text-[#FF6F00]/30 mt-4 mb-3" />
                      <p className="text-[#8D6E63] text-sm leading-relaxed mb-4">
                        Best BBQ this side of the Mississippi. The brisket melts in your mouth!
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#3E2723]">
                        <div className="w-10 h-10 rounded-full bg-[#3E2723] flex items-center justify-center">
                          <span className="text-[#FF6F00] text-sm font-bold">G</span>
                        </div>
                        <div>
                          <p className="text-[#FFF3E0] text-sm font-medium">Guest</p>
                          <p className="text-[#8D6E63] text-xs">Verified Pitmaster</p>
                        </div>
                      </div>
                    </div>
                  ))
                : store.reviews.map((review) => (
                    <div key={review.id} className="bg-[#2A2A2A] p-6 border border-[#3E2723] hover:border-[#FF6F00]/30 transition-all">
                      <StarRating rating={review.rating} size={16} activeColor="#FF6F00" inactiveColor="#5D4037" />
                      <Quote size={20} className="text-[#FF6F00]/30 mt-4 mb-3" />
                      <p className="text-[#8D6E63] text-sm leading-relaxed mb-4 line-clamp-3">
                        {review.comment || 'Incredible BBQ!'}
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#3E2723]">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          {review.avatar ? (
                            <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#3E2723] flex items-center justify-center">
                              <span className="text-[#FF6F00] text-sm font-bold">{review.user.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[#FFF3E0] text-sm font-medium">{review.user}</p>
                          <p className="text-[#8D6E63] text-xs">Verified Diner</p>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* ── Staff Section ── */}
        {store.staff.length > 0 && (
          <section id="team" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-[#FF6F00] text-xs tracking-[0.25em] uppercase font-bold">The Crew</span>
                <h2 className="font-['Bebas_Neue'] text-5xl sm:text-6xl text-[#FFF3E0] mt-2 mb-3 tracking-tight">
                  Pitmasters
                </h2>
                <div className="w-20 h-0.5 bg-[#FF6F00] mx-auto" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                {store.staff.map((member, idx) => (
                  <div key={idx} className="text-center group">
                    <div className="w-24 h-24 mx-auto rounded-full border-2 border-[#3E2723] group-hover:border-[#FF6F00] transition-all duration-300 flex items-center justify-center bg-[#2A2A2A]">
                      <span className="font-['Bebas_Neue'] text-3xl text-[#FF6F00] tracking-wider">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-['Bebas_Neue'] text-lg text-[#FFF3E0] mt-4 group-hover:text-[#FF6F00] transition-colors tracking-wide">
                      {member.name}
                    </h3>
                    <p className="text-[#8D6E63] text-sm">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Opening Hours ── */}
        {store.opening_hours && (
          <section id="hours" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#212121]">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-12">
                <span className="text-[#FF6F00] text-xs tracking-[0.25em] uppercase font-bold">Smoke Hours</span>
                <h2 className="font-['Bebas_Neue'] text-5xl text-[#FFF3E0] mt-2 mb-3 tracking-tight">
                  Opening Hours
                </h2>
                <div className="w-20 h-0.5 bg-[#FF6F00] mx-auto" />
              </div>

              <div className="border border-[#3E2723] bg-[#2A2A2A] divide-y divide-[#3E2723]">
                <div className="px-6 py-3 bg-[#3E2723]">
                  <p className="font-['Bebas_Neue'] text-[#FF6F00] text-lg tracking-wider">Weekly Schedule</p>
                </div>
                {DAY_ORDER.map((day) => {
                  const hours = store.opening_hours![day]
                  return (
                    <div key={day} className="flex items-center justify-between px-6 py-4 hover:bg-[#333] transition-colors">
                      <span className="text-[#8D6E63] text-sm font-medium uppercase tracking-wide">{DAY_LABELS[day]}</span>
                      {hours ? (
                        <span className="font-['Bebas_Neue'] text-[#FF6F00] text-lg tracking-wider">
                          {hours.open} – {hours.close}
                        </span>
                      ) : (
                        <span className="text-[#5D4037] text-sm italic">Closed</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Contact Section ── */}
        <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#FF6F00] text-xs tracking-[0.25em] uppercase font-bold">Reach Out</span>
              <h2 className="font-['Bebas_Neue'] text-5xl sm:text-6xl text-[#FFF3E0] mt-2 mb-3 tracking-tight">
                Get in Touch
              </h2>
              <div className="w-20 h-0.5 bg-[#FF6F00] mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {store.phone && (
                <a
                  href={`tel:${store.phone}`}
                  className="group bg-[#2A2A2A] border border-[#3E2723] hover:border-[#FF6F00]/40 p-8 text-center transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#3E2723] group-hover:bg-[#FF6F00]/20 flex items-center justify-center mb-5 transition-colors">
                    <Phone size={22} className="text-[#FF6F00]" />
                  </div>
                  <h3 className="font-['Bebas_Neue'] text-xl text-[#FFF3E0] mb-2 tracking-wider">Phone</h3>
                  <p className="text-[#8D6E63] text-sm">{store.phone}</p>
                </a>
              )}
              {store.email && (
                <a
                  href={`mailto:${store.email}`}
                  className="group bg-[#2A2A2A] border border-[#3E2723] hover:border-[#FF6F00]/40 p-8 text-center transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#3E2723] group-hover:bg-[#FF6F00]/20 flex items-center justify-center mb-5 transition-colors">
                    <Mail size={22} className="text-[#FF6F00]" />
                  </div>
                  <h3 className="font-['Bebas_Neue'] text-xl text-[#FFF3E0] mb-2 tracking-wider">Email</h3>
                  <p className="text-[#8D6E63] text-sm">{store.email}</p>
                </a>
              )}
              {store.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#2A2A2A] border border-[#3E2723] hover:border-[#FF6F00]/40 p-8 text-center transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#3E2723] group-hover:bg-[#FF6F00]/20 flex items-center justify-center mb-5 transition-colors">
                    <MapPin size={22} className="text-[#FF6F00]" />
                  </div>
                  <h3 className="font-['Bebas_Neue'] text-xl text-[#FFF3E0] mb-2 tracking-wider">Address</h3>
                  <p className="text-[#8D6E63] text-sm">{store.address}</p>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-[#151515] border-t-2 border-[#3E2723]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {store.logo ? (
                    <img
                      src={getImageUrl(store.logo) || ''}
                      alt={store.name}
                      className="h-10 w-10 rounded object-cover ring-2 ring-[#FF6F00]/20"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-gradient-to-br from-[#FF6F00] to-[#FF8F00] flex items-center justify-center">
                      <Flame size={18} className="text-[#151515]" />
                    </div>
                  )}
                  <span className="font-['Bebas_Neue'] text-2xl text-[#FFF3E0] tracking-wider">{store.name}</span>
                </div>
                <p className="text-[#8D6E63] text-sm leading-relaxed mb-6">
                  {store.description || 'Low and slow smoked BBQ. Hand-rubbed, wood-fired, soul-fed.'}
                </p>
                <SocialLinks links={store.social_links ?? []} />
              </div>

              <div>
                <h4 className="font-['Bebas_Neue'] text-[#FF6F00] text-lg tracking-wider mb-5">Links</h4>
                <ul className="space-y-3">
                  {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-[#8D6E63] hover:text-[#FF6F00] text-sm transition-colors uppercase tracking-wider">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-['Bebas_Neue'] text-[#FF6F00] text-lg tracking-wider mb-5">Info</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#8D6E63] hover:text-[#FF6F00] text-sm transition-colors uppercase tracking-wider">Catering</a></li>
                  <li><a href="#" className="text-[#8D6E63] hover:text-[#FF6F00] text-sm transition-colors uppercase tracking-wider">Private Events</a></li>
                  <li><a href="#" className="text-[#8D6E63] hover:text-[#FF6F00] text-sm transition-colors uppercase tracking-wider">Gift Cards</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-['Bebas_Neue'] text-[#FF6F00] text-lg tracking-wider mb-5">Contact</h4>
                <ul className="space-y-3">
                  {store.phone && (
                    <li>
                      <a href={`tel:${store.phone}`} className="text-[#8D6E63] hover:text-[#FF6F00] text-sm transition-colors flex items-center gap-2 uppercase tracking-wider">
                        <Phone size={14} /> {store.phone}
                      </a>
                    </li>
                  )}
                  {store.email && (
                    <li>
                      <a href={`mailto:${store.email}`} className="text-[#8D6E63] hover:text-[#FF6F00] text-sm transition-colors flex items-center gap-2 uppercase tracking-wider">
                        <Mail size={14} /> {store.email}
                      </a>
                    </li>
                  )}
                  {store.address && (
                    <li className="flex items-start gap-2 text-[#8D6E63] text-sm uppercase tracking-wider">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span>{store.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#3E2723] bg-[#0D0D0D]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[#5D4037] text-xs uppercase tracking-wider">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
              <p className="text-[#5D4037] text-xs uppercase tracking-wider">
                Low &amp; Slow — Always
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
