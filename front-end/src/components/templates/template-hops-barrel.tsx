'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, ChevronRight, Quote, Beer, Wheat, Factory } from 'lucide-react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import { SocialLinks } from '@/components/templates/blocks/social-links'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface HopsBarrelProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const COPPER = '#B87333'
const AMBER = '#FFBF00'
const DARK_WOOD = '#4A3728'
const CREAM = '#F5E6CC'
const INDUSTRIAL = '#6B5B4F'
const DARK = '#2C1810'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

export function TemplateHopsBarrel({ store, themeColors, onAddToCart, onShopNow }: HopsBarrelProps) {
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
    servesCuisine: 'American, Brewpub, Gastropub, Beer, Bar Food',
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

      <div className="min-h-screen bg-[#2C1810] text-[#F5E6CC] font-['Inter'] overflow-x-hidden">
        {/* ── Announcement Bar ── */}
        <div className="bg-[#4A3728] text-[#FFBF00] text-center text-xs sm:text-sm py-2 px-4 tracking-wider uppercase font-semibold border-b border-[#B87333]/30">
          <div className="animate-marquee whitespace-nowrap">
            <span className="mx-6">🍺 Happy Hour 4-7PM — $5 Pints!</span>
            <span className="mx-6">✦</span>
            <span className="mx-6">🍺 New IPA Release Every Friday!</span>
            <span className="mx-6">✦</span>
            <span className="mx-6">🍺 Trivia Night Every Wednesday!</span>
          </div>
        </div>

        {/* ── Navbar ── */}
        <nav
          className={cn(
            'fixed top-8 left-0 right-0 z-50 transition-all duration-500',
            scrolled ? 'top-8 bg-[#2C1810]/95 backdrop-blur-md shadow-lg shadow-black/40' : 'bg-transparent'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                {store.logo ? (
                  <img
                    src={getImageUrl(store.logo) || ''}
                    alt={store.name}
                    className="h-10 w-10 rounded object-cover ring-1 ring-[#B87333]/50"
                  />
                ) : (
                  <div className="h-10 w-10 rounded bg-gradient-to-br from-[#B87333] to-[#FFBF00] flex items-center justify-center">
                    <Beer size={18} className="text-[#2C1810]" />
                  </div>
                )}
                <span className="font-['Bebas_Neue'] text-2xl tracking-wider text-[#F5E6CC]">
                  {store.name}
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-6">
                {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm tracking-widest uppercase text-[#8B7D6B] hover:text-[#FFBF00] transition-colors duration-300 font-medium"
                  >
                    {item}
                  </a>
                ))}
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="bg-[#B87333] text-[#F5E6CC] px-6 py-2.5 text-sm tracking-widest uppercase font-bold hover:bg-[#A0652A] transition-all duration-300"
                  >
                    Order Now
                  </button>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-[#F5E6CC] p-2"
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
            <div className="bg-[#2C1810]/98 backdrop-blur-md border-t border-[#B87333]/20 px-4 py-6 space-y-4">
              {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm tracking-widest uppercase text-[#8B7D6B] hover:text-[#FFBF00] transition-colors"
                >
                  {item}
                </a>
              ))}
              {onShopNow && (
                <button
                  onClick={() => { setMenuOpen(false); onShopNow?.() }}
                  className="w-full bg-[#B87333] text-[#F5E6CC] px-6 py-3 text-sm tracking-widest uppercase font-bold"
                >
                  Order Now
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center overflow-hidden pt-8">
          <div className="absolute inset-0 bg-[#2C1810]" />
          {/* Warm amber glow */}
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(ellipse at 50% 50%, #FFBF00 0%, transparent 70%)' }} />
          {/* Brick texture overlay */}
          <div className="absolute inset-0 opacity-8" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(139,90,43,0.1) 30px, rgba(139,90,43,0.1) 31px), repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(139,90,43,0.1) 80px, rgba(139,90,43,0.1) 81px)' }} />

          {(store.cover_image || store.cover) && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${getImageUrl(store.cover_image || store.cover)})` }}
            />
          )}

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#4A3728]/80 border border-[#B87333]/30 px-4 py-2 mb-6">
                  <Wheat size={14} className="text-[#FFBF00]" />
                  <span className="text-[#FFBF00] text-xs tracking-[0.2em] uppercase font-bold">Craft Brewery &amp; Kitchen</span>
                </div>
                <h1 className="font-['Bebas_Neue'] text-6xl sm:text-7xl md:text-8xl text-[#F5E6CC] leading-[0.9] tracking-tight">
                  {store.name}
                </h1>
                <p className="text-base sm:text-lg text-[#8B7D6B] max-w-lg mt-6 leading-relaxed">
                  {store.description || 'Hand-crafted ales and lagers brewed on-site, paired with gastropub fare that hits the spot.'}
                </p>
                <div className="flex items-center gap-4 mt-10 flex-wrap">
                  <button
                    onClick={onShopNow}
                    className="bg-[#B87333] text-[#F5E6CC] px-10 py-4 text-sm tracking-[0.15em] uppercase font-bold hover:bg-[#A0652A] transition-all duration-300 shadow-2xl shadow-amber-900/30"
                  >
                    See the Tap List
                  </button>
                  <a
                    href="#menu"
                    className="border-2 border-[#8B7D6B] text-[#8B7D6B] px-10 py-4 text-sm tracking-[0.15em] uppercase font-medium hover:border-[#FFBF00] hover:text-[#FFBF00] transition-all duration-300"
                  >
                    View Menu
                  </a>
                </div>
                {store.avg_rating > 0 && (
                  <div className="flex items-center gap-3 mt-10 border border-[#4A3728] px-5 py-3 max-w-fit bg-black/20">
                    <StarRating rating={store.avg_rating} size={18} activeColor="#FFBF00" inactiveColor="#6B5B4F" />
                    <span className="text-[#FFBF00] text-sm font-bold">{store.avg_rating.toFixed(1)}</span>
                    <span className="text-[#8B7D6B] text-sm">({store.reviews_count} reviews)</span>
                  </div>
                )}
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative">
                  <div className="w-72 h-96 border-2 border-[#4A3728] flex items-center justify-center bg-[#1A0E08]">
                    <div className="text-center px-6">
                      <Beer size={70} className="mx-auto text-[#B87333]/40 mb-4" />
                      <div className="w-16 h-1 bg-[#FFBF00]/30 mx-auto mb-4" />
                      <p className="font-['Bebas_Neue'] text-3xl text-[#B87333] tracking-wider">EST.</p>
                      <p className="font-['Bebas_Neue'] text-4xl text-[#FFBF00] tracking-wider">2012</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-[#4A3728] border border-[#B87333]/30 px-5 py-2">
                    <p className="font-['Bebas_Neue'] text-lg text-[#FFBF00] tracking-wider">SMALL BATCH</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Menu Section ── */}
        <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1A0E08]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Beer size={24} className="mx-auto text-[#B87333] mb-3" />
              <span className="text-[#B87333] text-xs tracking-[0.25em] uppercase font-bold">The Taproom</span>
              <h2 className="font-['Bebas_Neue'] text-5xl sm:text-6xl text-[#F5E6CC] mt-2 mb-3 tracking-tight">
                Our Menu
              </h2>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#B87333] to-transparent mx-auto" />
            </div>

            {store.foods.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-[#4A3728] max-w-lg mx-auto">
                <Beer size={48} className="mx-auto text-[#B87333]/30 mb-4" />
                <p className="font-['Bebas_Neue'] text-3xl text-[#F5E6CC] mb-2">Brewing Soon</p>
                <p className="text-[#8B7D6B] text-sm">Our menu is fermenting. Check back for pub grub!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.foods.map((food) => (
                  <div
                    key={food.id}
                    className="group bg-[#2C1810] border border-[#4A3728] hover:border-[#B87333]/40 transition-all duration-500 overflow-hidden"
                  >
                    <div className="relative overflow-hidden aspect-[4/3]">
                      {food.image ? (
                        <img
                          src={getImageUrl(food.image) ?? undefined}
                          alt={food.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#3D2B1F] flex items-center justify-center">
                          <Wheat size={36} className="text-[#4A3728]" />
                        </div>
                      )}
                      {food.is_offer && (
                        <span className="absolute top-3 left-3 bg-[#B87333] text-[#F5E6CC] text-[9px] tracking-widest uppercase px-3 py-1 font-bold">
                          Brew Special
                        </span>
                      )}
                      {food.cooking_time && (
                        <span className="absolute bottom-3 right-3 bg-[#2C1810]/80 text-[#F5E6CC] text-xs px-2 py-1 border border-[#B87333]/30">
                          ⏱ {food.cooking_time} min
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-['Bebas_Neue'] text-xl tracking-wide text-[#F5E6CC] group-hover:text-[#B87333] transition-colors">
                        {food.name}
                      </h3>
                      {food.description && (
                        <p className="text-[#8B7D6B] text-sm mt-1 line-clamp-2 leading-relaxed">
                          {food.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#4A3728]">
                        <div>
                          <span className="font-['Bebas_Neue'] text-xl tracking-wider text-[#FFBF00]">
                            {formatFoodPrice(food, currency)}
                          </span>
                          {food.new_price && (
                            <span className="text-[#8B7D6B] text-xs line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>
                          )}
                        </div>
                        {onAddToCart && (
                          <button
                            data-add-to-cart={food.id}
                            onClick={() => onAddToCart(food.id)}
                            className="bg-[#4A3728] text-[#F5E6CC] px-4 py-2 text-xs tracking-widest uppercase font-bold hover:bg-[#B87333] hover:text-[#2C1810] transition-all duration-300 flex items-center gap-1"
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
        <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#2C1810]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#B87333] text-xs tracking-[0.25em] uppercase font-bold">Pub Talk</span>
              <h2 className="font-['Bebas_Neue'] text-5xl sm:text-6xl text-[#F5E6CC] mt-2 mb-3 tracking-tight">
                What People Say
              </h2>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#B87333] to-transparent mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {store.reviews.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-[#3D2B1F] p-6 border border-[#4A3728] hover:border-[#B87333]/20 transition-all">
                      <StarRating rating={5} size={16} activeColor="#FFBF00" inactiveColor="#6B5B4F" />
                      <Quote size={20} className="text-[#B87333]/30 mt-4 mb-3" />
                      <p className="text-[#8B7D6B] text-sm leading-relaxed mb-4">
                        Best craft beer selection in town! The IPA is a must-try, and the food pairs perfectly.
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#4A3728]">
                        <div className="w-10 h-10 rounded-full bg-[#4A3728] flex items-center justify-center">
                          <span className="text-[#FFBF00] text-sm font-bold">G</span>
                        </div>
                        <div>
                          <p className="text-[#F5E6CC] text-sm font-medium">Guest</p>
                          <p className="text-[#8B7D6B] text-xs">Regular</p>
                        </div>
                      </div>
                    </div>
                  ))
                : store.reviews.map((review) => (
                    <div key={review.id} className="bg-[#3D2B1F] p-6 border border-[#4A3728] hover:border-[#B87333]/30 transition-all">
                      <StarRating rating={review.rating} size={16} activeColor="#FFBF00" inactiveColor="#6B5B4F" />
                      <Quote size={20} className="text-[#B87333]/30 mt-4 mb-3" />
                      <p className="text-[#8B7D6B] text-sm leading-relaxed mb-4 line-clamp-3">
                        {review.comment || 'Great brews and atmosphere!'}
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#4A3728]">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          {review.avatar ? (
                            <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#4A3728] flex items-center justify-center">
                              <span className="text-[#FFBF00] text-sm font-bold">{review.user.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[#F5E6CC] text-sm font-medium">{review.user}</p>
                          <p className="text-[#8B7D6B] text-xs">Verified Patron</p>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* ── Staff Section ── */}
        {store.staff.length > 0 && (
          <section id="team" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1A0E08]">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-[#B87333] text-xs tracking-[0.25em] uppercase font-bold">The Crew</span>
                <h2 className="font-['Bebas_Neue'] text-5xl sm:text-6xl text-[#F5E6CC] mt-2 mb-3 tracking-tight">
                  Brew Crew
                </h2>
                <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#B87333] to-transparent mx-auto" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                {store.staff.map((member, idx) => (
                  <div key={idx} className="text-center group">
                    <div className="w-24 h-24 mx-auto rounded-full border-2 border-[#4A3728] group-hover:border-[#B87333] transition-all duration-300 flex items-center justify-center bg-[#2C1810]">
                      <span className="font-['Bebas_Neue'] text-3xl text-[#B87333] tracking-wider">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-['Bebas_Neue'] text-lg text-[#F5E6CC] mt-4 group-hover:text-[#B87333] transition-colors tracking-wide">
                      {member.name}
                    </h3>
                    <p className="text-[#8B7D6B] text-sm">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Opening Hours ── */}
        {store.opening_hours && (
          <section id="hours" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#2C1810]">
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-12">
                <span className="text-[#B87333] text-xs tracking-[0.25em] uppercase font-bold">Tap Hours</span>
                <h2 className="font-['Bebas_Neue'] text-5xl text-[#F5E6CC] mt-2 mb-3 tracking-tight">
                  Opening Hours
                </h2>
                <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#B87333] to-transparent mx-auto" />
              </div>

              <div className="border border-[#4A3728] bg-[#3D2B1F] divide-y divide-[#4A3728]">
                <div className="px-6 py-3 bg-[#4A3728]">
                  <p className="font-['Bebas_Neue'] text-[#FFBF00] text-lg tracking-wider">Taproom Schedule</p>
                </div>
                {DAY_ORDER.map((day) => {
                  const hours = store.opening_hours![day]
                  return (
                    <div key={day} className="flex items-center justify-between px-6 py-4 hover:bg-[#4A3728] transition-colors">
                      <span className="text-[#8B7D6B] text-sm font-medium uppercase tracking-wide">{DAY_LABELS[day]}</span>
                      {hours ? (
                        <span className="font-['Bebas_Neue'] text-[#FFBF00] text-lg tracking-wider">
                          {hours.open} – {hours.close}
                        </span>
                      ) : (
                        <span className="text-[#6B5B4F] text-sm italic">Closed</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Contact Section ── */}
        <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1A0E08]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#B87333] text-xs tracking-[0.25em] uppercase font-bold">Reach Out</span>
              <h2 className="font-['Bebas_Neue'] text-5xl sm:text-6xl text-[#F5E6CC] mt-2 mb-3 tracking-tight">
                Get in Touch
              </h2>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#B87333] to-transparent mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {store.phone && (
                <a
                  href={`tel:${store.phone}`}
                  className="group bg-[#2C1810] border border-[#4A3728] hover:border-[#B87333]/40 p-8 text-center transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#4A3728] group-hover:bg-[#B87333]/20 flex items-center justify-center mb-5 transition-colors">
                    <Phone size={22} className="text-[#B87333]" />
                  </div>
                  <h3 className="font-['Bebas_Neue'] text-xl text-[#F5E6CC] mb-2 tracking-wider">Phone</h3>
                  <p className="text-[#8B7D6B] text-sm">{store.phone}</p>
                </a>
              )}
              {store.email && (
                <a
                  href={`mailto:${store.email}`}
                  className="group bg-[#2C1810] border border-[#4A3728] hover:border-[#B87333]/40 p-8 text-center transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#4A3728] group-hover:bg-[#B87333]/20 flex items-center justify-center mb-5 transition-colors">
                    <Mail size={22} className="text-[#B87333]" />
                  </div>
                  <h3 className="font-['Bebas_Neue'] text-xl text-[#F5E6CC] mb-2 tracking-wider">Email</h3>
                  <p className="text-[#8B7D6B] text-sm">{store.email}</p>
                </a>
              )}
              {store.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#2C1810] border border-[#4A3728] hover:border-[#B87333]/40 p-8 text-center transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#4A3728] group-hover:bg-[#B87333]/20 flex items-center justify-center mb-5 transition-colors">
                    <MapPin size={22} className="text-[#B87333]" />
                  </div>
                  <h3 className="font-['Bebas_Neue'] text-xl text-[#F5E6CC] mb-2 tracking-wider">Address</h3>
                  <p className="text-[#8B7D6B] text-sm">{store.address}</p>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-[#150B05] border-t-2 border-[#4A3728]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {store.logo ? (
                    <img
                      src={getImageUrl(store.logo) || ''}
                      alt={store.name}
                      className="h-10 w-10 rounded object-cover ring-1 ring-[#B87333]/30"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-gradient-to-br from-[#B87333] to-[#FFBF00] flex items-center justify-center">
                      <Beer size={18} className="text-[#150B05]" />
                    </div>
                  )}
                  <span className="font-['Bebas_Neue'] text-2xl text-[#F5E6CC] tracking-wider">{store.name}</span>
                </div>
                <p className="text-[#8B7D6B] text-sm leading-relaxed mb-6">
                  {store.description || 'Hand-crafted beers and great food, served in good company.'}
                </p>
                <SocialLinks links={store.social_links ?? []} />
              </div>

              <div>
                <h4 className="font-['Bebas_Neue'] text-[#B87333] text-lg tracking-wider mb-5">Links</h4>
                <ul className="space-y-3">
                  {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-[#8B7D6B] hover:text-[#FFBF00] text-sm transition-colors uppercase tracking-wider">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-['Bebas_Neue'] text-[#B87333] text-lg tracking-wider mb-5">Info</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#8B7D6B] hover:text-[#FFBF00] text-sm transition-colors uppercase tracking-wider">Brewery Tours</a></li>
                  <li><a href="#" className="text-[#8B7D6B] hover:text-[#FFBF00] text-sm transition-colors uppercase tracking-wider">Private Events</a></li>
                  <li><a href="#" className="text-[#8B7D6B] hover:text-[#FFBF00] text-sm transition-colors uppercase tracking-wider">Gift Cards</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-['Bebas_Neue'] text-[#B87333] text-lg tracking-wider mb-5">Contact</h4>
                <ul className="space-y-3">
                  {store.phone && (
                    <li>
                      <a href={`tel:${store.phone}`} className="text-[#8B7D6B] hover:text-[#FFBF00] text-sm transition-colors flex items-center gap-2 uppercase tracking-wider">
                        <Phone size={14} /> {store.phone}
                      </a>
                    </li>
                  )}
                  {store.email && (
                    <li>
                      <a href={`mailto:${store.email}`} className="text-[#8B7D6B] hover:text-[#FFBF00] text-sm transition-colors flex items-center gap-2 uppercase tracking-wider">
                        <Mail size={14} /> {store.email}
                      </a>
                    </li>
                  )}
                  {store.address && (
                    <li className="flex items-start gap-2 text-[#8B7D6B] text-sm uppercase tracking-wider">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span>{store.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#4A3728] bg-[#0D0704]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[#6B5B4F] text-xs uppercase tracking-wider">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
              <p className="text-[#6B5B4F] text-xs uppercase tracking-wider">
                Drink Local. Eat Well. 🍻
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
