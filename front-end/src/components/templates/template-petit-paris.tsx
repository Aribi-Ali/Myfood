'use client'

import { useState, useEffect } from 'react'
import { StarRating } from '@/components/templates/blocks/star-rating'
import { SocialLinks } from '@/components/templates/blocks/social-links'
import { Clock, MapPin, Phone, Mail, Menu, X, ShoppingCart, Quote, Music, Palette, ArrowRight, ChevronDown, Calendar, Sun, Moon, Coffee, UtensilsCrossed, Wine, Sparkles, Landmark, Heart, Eye, Star } from 'lucide-react'
import type { TemplateStore } from '@/components/templates/types'
import { cn, formatPrice, getImageUrl } from '@/lib/utils'
import { formatFoodPrice } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency'

interface PetitParisProps {
  store: TemplateStore
  themeColors?: Record<string, string>
  onAddToCart?: (foodId: number) => void
  onShopNow?: () => void
}

const DEEP_NAVY = '#0F0F1A'
const WARM_GOLD = '#C9A84C'
const CREAM = '#F5F0EA'
const BURGUNDY = '#8B0000'
const DARK_TEXT = '#1E1E1E'
const MUTED = '#6B6580'
const SURFACE = '#FFFFFF'
const GOLD_LIGHT = '#E8D5A3'

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
}

const TIME_SLOTS = [
  { icon: Coffee, label: 'Breakfast', time: '7:00 – 12:00', gradient: 'from-amber-100 to-orange-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-700' },
  { icon: Sun, label: 'Lunch', time: '12:00 – 15:00', gradient: 'from-yellow-100 to-orange-50', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-700' },
  { icon: Wine, label: 'Happy Hour', time: '15:00 – 18:00', gradient: 'from-rose-100 to-pink-50', iconBg: 'bg-rose-100', iconColor: 'text-rose-600' },
  { icon: Moon, label: 'Dinner', time: '18:00 – 23:00', gradient: 'from-indigo-100 to-purple-50', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-700' },
]

export function TemplatePetitParis({ store, themeColors, onAddToCart, onShopNow }: PetitParisProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeReview, setActiveReview] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (store.reviews.length < 2) return
    const interval = setInterval(() => {
      setActiveReview(prev => (prev + 1) % store.reviews.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [store.reviews.length])

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
      '@type': 'AggregateRating', ratingValue: store.avg_rating, reviewCount: store.reviews_count,
    } : undefined,
    servesCuisine: 'French, Parisian Bistro, European',
    image: getImageUrl(store.cover_image || store.cover),
  }

  const hasBgImage = !!(store.cover_image || store.cover)
  const heroBg = getImageUrl(store.cover_image || store.cover)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
        :root { ${Object.entries(c).map(([k, v]) => `${k}: ${v};`).join('\n')} }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scroll-width: none; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-shimmer { background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%); background-size: 200% 100%; animation: shimmer 3s infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>

      <div className="min-h-screen bg-[#F5F0EA] text-[#1E1E1E] font-['Inter'] overflow-x-hidden">
        {/* ── Announcement Bar ── */}
        <div className="bg-[#0F0F1A] text-[#E8D5A3] text-center text-xs sm:text-sm py-2.5 px-4 tracking-[0.15em] overflow-hidden font-medium">
          <div className="animate-marquee whitespace-nowrap">
            <span className="mx-6">✦ Parisian Art Bistro — Since 2020</span>
            <span className="mx-6">✦</span>
            <span className="mx-6">🎨 Art, Jazz & Gastronomy</span>
            <span className="mx-6">✦</span>
            <span className="mx-6">🥐 French Cuisine with Oriental Generosity</span>
            <span className="mx-6">✦</span>
            <span className="mx-6">Open Every Day 7am – 1am</span>
            <span className="mx-6">✦</span>
            <span className="mx-6">Parisian Art Bistro — Since 2020</span>
            <span className="mx-6">✦</span>
            <span className="mx-6">🎨 Art, Jazz & Gastronomy</span>
            <span className="mx-6">✦</span>
            <span className="mx-6">🥐 French Cuisine with Oriental Generosity</span>
            <span className="mx-6">✦</span>
            <span className="mx-6">Open Every Day 7am – 1am</span>
          </div>
        </div>

        {/* ── Navbar ── */}
        <nav
          className={cn(
            'fixed top-9 left-0 right-0 z-50 transition-all duration-500',
            scrolled ? 'top-0 bg-[#0F0F1A]/95 backdrop-blur-lg shadow-lg shadow-black/30' : 'bg-transparent'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                {store.logo ? (
                  <img
                    src={getImageUrl(store.logo) || ''}
                    alt={store.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-[#C9A84C]/40"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[#C9A84C]/20 flex items-center justify-center border border-[#C9A84C]/40">
                    <Landmark size={18} className="text-[#C9A84C]" />
                  </div>
                )}
                <span className="font-['Cormorant_Garamond'] text-2xl italic text-[#F5F0EA] tracking-wide">
                  {store.name}
                </span>
              </div>

              <div className="hidden lg:flex items-center gap-8">
                {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm tracking-wider text-[#C9A84C]/80 hover:text-[#C9A84C] transition-colors duration-300 font-medium"
                  >
                    {item}
                  </a>
                ))}
                {onShopNow && (
                  <button
                    onClick={onShopNow}
                    className="bg-[#C9A84C] text-[#0F0F1A] px-6 py-2.5 text-sm tracking-wider font-bold hover:bg-[#D4B85A] transition-all duration-300 shadow-lg shadow-[#C9A84C]/20"
                  >
                    Order Now
                  </button>
                )}
              </div>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-[#F5F0EA] p-2"
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
            <div className="bg-[#0F0F1A]/98 backdrop-blur-md border-t border-[#C9A84C]/10 px-4 py-6 space-y-4">
              {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm tracking-wider text-[#C9A84C]/80 hover:text-[#C9A84C] transition-colors"
                >
                  {item}
                </a>
              ))}
              {onShopNow && (
                <button
                  onClick={() => { setMenuOpen(false); onShopNow?.() }}
                  className="w-full bg-[#C9A84C] text-[#0F0F1A] px-6 py-3 text-sm tracking-wider font-bold"
                >
                  Order Now
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center overflow-hidden pt-9">
          {hasBgImage && (
            <div className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[2s]" style={{ backgroundImage: `url(${heroBg})` }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F1A]/95 via-[#0F0F1A]/80 to-[#0F0F1A]/60" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #C9A84C 1px, transparent 1px), radial-gradient(circle at 75% 75%, #C9A84C 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center py-32">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 bg-[#C9A84C]/10 border border-[#C9A84C]/20 px-5 py-2.5 backdrop-blur-sm animate-fade-in-up">
                  <Palette size={14} className="text-[#C9A84C]" />
                  <span className="text-[#E8D5A3] text-xs tracking-[0.25em] uppercase font-medium">Parisian Art Bistro</span>
                </div>

                <h1 className="font-['Cormorant_Garamond'] italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#F5F0EA] leading-[0.95] animate-fade-in-up delay-100">
                  {store.name}
                </h1>

                <div className="flex items-center gap-4 animate-fade-in-up delay-200">
                  <div className="h-px w-16 bg-[#C9A84C]" />
                  <span className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase font-medium">Art de Vivre</span>
                  <div className="h-px w-16 bg-[#C9A84C]" />
                </div>

                <p className="text-lg sm:text-xl text-[#C9A84C]/70 max-w-lg leading-relaxed font-light animate-fade-in-up delay-200">
                  {store.description || 'The art bistro of Paris Beaubourg district — where French cuisine meets oriental generosity, art, and jazz.'}
                </p>

                <div className="flex items-center gap-3 animate-fade-in-up delay-200">
                  <Clock size={14} className="text-[#C9A84C]" />
                  <span className="text-[#E8D5A3] text-sm tracking-wide">Open Every Day · 7am – 1am</span>
                </div>

                {store.avg_rating > 0 && (
                  <div className="flex items-center gap-4 bg-white/[0.06] backdrop-blur-sm px-5 py-3 border border-[#C9A84C]/15 max-w-fit animate-fade-in-up delay-300">
                    <StarRating rating={store.avg_rating} size={18} activeColor="#C9A84C" inactiveColor="#D1C9B6" />
                    <span className="text-[#C9A84C] text-sm font-semibold">{store.avg_rating.toFixed(1)}</span>
                    <span className="text-[#C9A84C]/60 text-sm">({store.reviews_count} reviews)</span>
                  </div>
                )}

                <div className="flex items-center gap-4 flex-wrap animate-fade-in-up delay-300">
                  {onShopNow && (
                    <button
                      onClick={onShopNow}
                      className="group bg-[#C9A84C] text-[#0F0F1A] px-8 py-3.5 text-sm tracking-wider font-bold hover:bg-[#D4B85A] transition-all duration-300 shadow-xl shadow-[#C9A84C]/20 flex items-center gap-2"
                    >
                      Explore Our Menu
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                  <a
                    href="#menu"
                    className="border-2 border-[#C9A84C]/40 text-[#C9A84C] px-8 py-3.5 text-sm tracking-wider font-medium hover:bg-[#C9A84C]/10 transition-all duration-300"
                  >
                    Book a Table
                  </a>
                </div>
              </div>

              <div className="hidden lg:flex items-center justify-center">
                <div className="relative animate-float">
                  <div className="w-96 h-96 rounded-full border border-[#C9A84C]/20 flex items-center justify-center">
                    <div className="w-80 h-80 rounded-full border border-[#C9A84C]/10 flex items-center justify-center bg-[#C9A84C]/5">
                      <div className="text-center">
                        <Landmark size={64} className="mx-auto text-[#C9A84C]/30 mb-4" />
                        <p className="font-['Cormorant_Garamond'] italic text-[#E8D5A3] text-2xl">Paris</p>
                        <p className="text-[#C9A84C]/50 text-xs tracking-[0.3em] uppercase mt-1">Art & Gastronomy</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-full animate-shimmer pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown size={20} className="text-[#C9A84C]/60" />
          </div>
        </section>

        {/* ── Time Slots ── */}
        <section className="relative z-10 -mt-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {TIME_SLOTS.map((slot, i) => {
              const Icon = slot.icon
              return (
                <div
                  key={slot.label}
                  className="group bg-white border border-[#C9A84C]/10 p-6 hover:shadow-xl hover:shadow-[#C9A84C]/5 hover:-translate-y-1 transition-all duration-300 text-center cursor-default"
                  style={{ animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both` }}
                >
                  <div className={cn('w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4', slot.iconBg)}>
                    <Icon size={20} className={slot.iconColor} />
                  </div>
                  <h3 className="font-['Cormorant_Garamond'] italic text-lg font-semibold text-[#1E1E1E]">{slot.label}</h3>
                  <p className="text-[#C9A84C] text-sm font-medium mt-1">{slot.time}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── About / Brand Story ── */}
        <section className="py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 px-4 py-2 mb-6">
                <Sparkles size={14} className="text-[#C9A84C]" />
                <span className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase font-medium">Our Story</span>
              </div>
              <h2 className="font-['Cormorant_Garamond'] italic text-4xl sm:text-5xl text-[#1E1E1E] leading-tight mb-6">
                Oriental Generosity
                <br />
                <span className="text-[#C9A84C]">French Cuisine</span>
                <br />
                Art & Jazz
              </h2>
              <div className="w-20 h-px bg-[#C9A84C] mb-6" />
              <p className="text-[#6B6580] leading-relaxed text-base">
                Nestled in the heart of the Beaubourg district, steps away from the Centre Pompidou,
                {store.name} is a Parisian art bistro where every detail tells a story. Our cuisine blends
                the richness of French gastronomy with the warm generosity of oriental traditions —
                a tribute to the vibrant cultural tapestry of Paris.
              </p>
              <p className="text-[#6B6580] leading-relaxed text-base mt-4">
                With live jazz echoing through our art-deco halls, every meal becomes a sensory journey.
                Welcome to a place where art meets the plate.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-[#C9A84C]/20 to-[#0F0F1A]/10 border border-[#C9A84C]/20 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Landmark size={48} className="mx-auto text-[#C9A84C]/40 mb-4" />
                    <p className="font-['Cormorant_Garamond'] italic text-2xl text-[#C9A84C]">Beaubourg</p>
                    <p className="text-[#8B7D6B] text-xs tracking-[0.2em] uppercase mt-2">Paris 4ᵉ</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#0F0F1A] px-8 py-4 border border-[#C9A84C]/20">
                <p className="text-[#C9A84C] font-['Cormorant_Garamond'] italic text-xl">Depuis 2020</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Menu Section ── */}
        <section id="menu" className="py-28 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 px-4 py-2 mb-4">
                <UtensilsCrossed size={14} className="text-[#C9A84C]" />
                <span className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase font-medium">La Carte</span>
              </div>
              <h2 className="font-['Cormorant_Garamond'] italic text-4xl sm:text-5xl text-[#1E1E1E] mt-3 mb-4">
                Our Menu
              </h2>
              <div className="w-16 h-px bg-[#C9A84C] mx-auto" />
              <p className="text-[#6B6580] max-w-xl mx-auto mt-4">A symphony of flavors — French tradition with an oriental soul</p>
            </div>

            {store.foods.length === 0 ? (
              <div className="text-center py-20 border-2 border-[#C9A84C]/20 max-w-lg mx-auto bg-[#F5F0EA]/50">
                <UtensilsCrossed size={48} className="mx-auto text-[#C9A84C]/30 mb-4" />
                <p className="font-['Cormorant_Garamond'] italic text-2xl text-[#1E1E1E] mb-2">Menu in Preparation</p>
                <p className="text-[#6B6580]">Our chefs are crafting something special.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {store.foods.map((food, idx) => (
                    <div
                      key={food.id}
                      className="group bg-[#F5F0EA] hover:bg-white border border-[#C9A84C]/10 hover:border-[#C9A84C]/30 hover:shadow-xl hover:shadow-[#C9A84C]/5 transition-all duration-500 overflow-hidden"
                    >
                      <div className="relative h-48 overflow-hidden">
                        {food.image ? (
                          <img
                            src={getImageUrl(food.image) ?? undefined}
                            alt={food.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#C9A84C]/10 to-[#0F0F1A]/10 flex items-center justify-center">
                            <UtensilsCrossed size={32} className="text-[#C9A84C]/30" />
                          </div>
                        )}
                        {food.is_offer && (
                          <div className="absolute top-3 left-3 bg-[#C9A84C] text-[#0F0F1A] text-[9px] tracking-[0.2em] uppercase px-3 py-1 font-bold">
                            Du Jour
                          </div>
                        )}
                        {onAddToCart && (
                          <button
                            data-add-to-cart={food.id}
                            onClick={() => onAddToCart(food.id)}
                            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-[#C9A84C] hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-md"
                          >
                            <ShoppingCart size={14} />
                          </button>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-['Cormorant_Garamond'] text-lg font-semibold text-[#1E1E1E]">
                          {food.name}
                        </h3>
                        {food.description && (
                          <p className="text-[#6B6580] text-sm mt-1.5 line-clamp-2 leading-relaxed">
                            {food.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#C9A84C]/10">
                          <div>
                            <span className="font-['Cormorant_Garamond'] text-xl font-bold text-[#C9A84C]">
                              {formatFoodPrice(food, currency)}
                            </span>
                            {food.new_price && (
                              <span className="text-[#6B6580] text-xs line-through ml-2">{formatFoodPrice(food, currency, { original: true })}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* ── Team Section ── */}
        {store.staff.length > 0 && (
          <section id="team" className="py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 px-4 py-2 mb-4">
                <Heart size={14} className="text-[#C9A84C]" />
                <span className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase font-medium">L&apos;Équipe</span>
              </div>
              <h2 className="font-['Cormorant_Garamond'] italic text-4xl sm:text-5xl text-[#1E1E1E] mt-3 mb-4">
                Meet the Team
              </h2>
              <div className="w-16 h-px bg-[#C9A84C] mx-auto" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {store.staff.map((member, idx) => (
                <div key={idx} className="group text-center bg-white border border-[#C9A84C]/10 p-8 hover:shadow-xl hover:shadow-[#C9A84C]/5 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-28 h-28 mx-auto rounded-full border-2 border-[#C9A84C]/30 flex items-center justify-center bg-[#F5F0EA] group-hover:border-[#C9A84C] transition-colors duration-300">
                    <span className="font-['Cormorant_Garamond'] text-4xl font-bold italic text-[#C9A84C]">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#1E1E1E] mt-5 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#C9A84C] text-sm italic">{member.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Reviews Section ── */}
        <section id="reviews" className="py-28 px-4 sm:px-6 lg:px-8 bg-[#0F0F1A]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 px-4 py-2 mb-4">
                <Star size={14} className="text-[#C9A84C]" />
                <span className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase font-medium">Ils Nous Aiment</span>
              </div>
              <h2 className="font-['Cormorant_Garamond'] italic text-4xl sm:text-5xl text-[#F5F0EA] mt-3 mb-4">
                Guest Love Letters
              </h2>
              <div className="w-16 h-px bg-[#C9A84C] mx-auto" />
            </div>

            {store.reviews.length === 0 ? (
              <div className="text-center p-12 border border-[#C9A84C]/10 max-w-lg mx-auto">
                <Quote size={40} className="mx-auto text-[#C9A84C]/20 mb-4" />
                <p className="font-['Cormorant_Garamond'] italic text-2xl text-[#F5F0EA] mb-2">Aucun avis pour le moment</p>
                <p className="text-[#C9A84C]/60">Be the first to share your experience.</p>
              </div>
            ) : (
              <div className="relative">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${activeReview * 100}%)` }}
                  >
                    {store.reviews.map((review) => (
                      <div key={review.id} className="w-full shrink-0 px-4">
                        <div className="text-center p-8 md:p-12 border border-[#C9A84C]/10 bg-[#C9A84C]/[0.02]">
                          <StarRating rating={review.rating} size={20} activeColor="#C9A84C" inactiveColor="#D1C9B6" />
                          <Quote size={32} className="text-[#C9A84C]/20 mx-auto mt-6 mb-6" />
                          <p className="text-[#E8D5A3] italic text-lg leading-relaxed max-w-2xl mx-auto mb-8 font-light">
                            &ldquo;{review.comment || 'A wonderful dining experience.'}&rdquo;
                          </p>
                          <div className="flex items-center justify-center gap-3 pt-6 border-t border-[#C9A84C]/10">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C9A84C]/30">
                              {review.avatar ? (
                                <img src={getImageUrl(review.avatar) ?? undefined} alt={review.user} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-[#C9A84C]/20 flex items-center justify-center">
                                  <span className="text-[#C9A84C] font-['Cormorant_Garamond'] text-xl font-bold">{review.user.charAt(0).toUpperCase()}</span>
                                </div>
                              )}
                            </div>
                            <div className="text-left">
                              <p className="text-[#F5F0EA] font-medium">{review.user}</p>
                              <p className="text-[#C9A84C]/60 text-xs">Verified Guest</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {store.reviews.length > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    {store.reviews.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveReview(i)}
                        className={cn(
                          'w-2.5 h-2.5 rounded-full transition-all duration-300',
                          i === activeReview ? 'bg-[#C9A84C] w-8' : 'bg-[#C9A84C]/30 hover:bg-[#C9A84C]/50'
                        )}
                        aria-label={`Go to review ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── Opening Hours ── */}
        {store.opening_hours && (
          <section id="hours" className="py-28 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 px-4 py-2 mb-4">
                <Clock size={14} className="text-[#C9A84C]" />
                <span className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase font-medium">Horaires</span>
              </div>
              <h2 className="font-['Cormorant_Garamond'] italic text-4xl sm:text-5xl text-[#1E1E1E] mt-3 mb-4">
                Opening Hours
              </h2>
              <div className="w-16 h-px bg-[#C9A84C] mx-auto" />
              <p className="text-[#6B6580] text-sm mt-4">Open every day — from breakfast until late</p>
            </div>

            <div className="border border-[#C9A84C]/20 bg-white overflow-hidden">
              <div className="bg-[#0F0F1A] px-6 py-4 flex items-center justify-between">
                <p className="text-[#C9A84C] font-['Cormorant_Garamond'] italic font-semibold">Weekly Schedule</p>
                <span className="text-[#E8D5A3] text-xs tracking-wider">7:00 – 1:00</span>
              </div>
              <div className="divide-y divide-[#C9A84C]/10">
                {DAY_ORDER.map((day) => {
                  const hours = store.opening_hours![day]
                  return (
                    <div key={day} className="flex items-center justify-between px-6 py-4 hover:bg-[#F5F0EA] transition-colors">
                      <span className="text-[#1E1E1E] text-sm font-medium capitalize">{DAY_LABELS[day]}</span>
                      {hours ? (
                        <span className="text-[#C9A84C] text-sm font-semibold tracking-wide">
                          {hours.open} – {hours.close}
                        </span>
                      ) : (
                        <span className="text-[#8B7D6B] text-sm italic">Fermé</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Contact Section ── */}
        <section id="contact" className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 px-4 py-2 mb-4">
              <MapPin size={14} className="text-[#C9A84C]" />
              <span className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase font-medium">Contact</span>
            </div>
            <h2 className="font-['Cormorant_Garamond'] italic text-4xl sm:text-5xl text-[#1E1E1E] mt-3 mb-4">
              Find Us
            </h2>
            <div className="w-16 h-px bg-[#C9A84C] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {store.phone && (
              <a
                href={`tel:${store.phone}`}
                className="group bg-white border border-[#C9A84C]/10 hover:border-[#C9A84C]/40 p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-[#C9A84C]/5 hover:-translate-y-1"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#C9A84C]/10 group-hover:bg-[#C9A84C]/20 flex items-center justify-center mb-5 transition-colors">
                  <Phone size={22} className="text-[#C9A84C]" />
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-lg font-semibold text-[#1E1E1E] mb-2">Phone</h3>
                <p className="text-[#6B6580] text-sm">{store.phone}</p>
              </a>
            )}
            {store.email && (
              <a
                href={`mailto:${store.email}`}
                className="group bg-white border border-[#C9A84C]/10 hover:border-[#C9A84C]/40 p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-[#C9A84C]/5 hover:-translate-y-1"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#C9A84C]/10 group-hover:bg-[#C9A84C]/20 flex items-center justify-center mb-5 transition-colors">
                  <Mail size={22} className="text-[#C9A84C]" />
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-lg font-semibold text-[#1E1E1E] mb-2">Email</h3>
                <p className="text-[#6B6580] text-sm">{store.email}</p>
              </a>
            )}
            {store.address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-[#C9A84C]/10 hover:border-[#C9A84C]/40 p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-[#C9A84C]/5 hover:-translate-y-1"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#C9A84C]/10 group-hover:bg-[#C9A84C]/20 flex items-center justify-center mb-5 transition-colors">
                  <MapPin size={22} className="text-[#C9A84C]" />
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-lg font-semibold text-[#1E1E1E] mb-2">Address</h3>
                <p className="text-[#6B6580] text-sm">{store.address}</p>
              </a>
            )}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="bg-[#0F0F1A] border-t-2 border-[#C9A84C]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {store.logo ? (
                    <img src={getImageUrl(store.logo) || ''} alt={store.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-[#C9A84C]/30" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-[#C9A84C]/20 flex items-center justify-center border border-[#C9A84C]/40">
                      <Landmark size={18} className="text-[#C9A84C]" />
                    </div>
                  )}
                  <span className="font-['Cormorant_Garamond'] italic text-xl text-[#F5F0EA]">{store.name}</span>
                </div>
                <p className="text-[#8B7D6B] text-sm leading-relaxed mb-6 font-light">
                  {store.description || 'Parisian art bistro — French cuisine with oriental generosity.'}
                </p>
                <SocialLinks links={store.social_links ?? []} />
              </div>

              <div>
                <h4 className="font-['Cormorant_Garamond'] italic text-[#C9A84C] text-xl mb-5">Quick Links</h4>
                <ul className="space-y-3">
                  {['Menu', 'Reviews', 'Team', 'Hours', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-[#8B7D6B] hover:text-[#C9A84C] text-sm transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-['Cormorant_Garamond'] italic text-[#C9A84C] text-xl mb-5">Information</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-[#8B7D6B] hover:text-[#C9A84C] text-sm transition-colors">Our Story</a></li>
                  <li><a href="#" className="text-[#8B7D6B] hover:text-[#C9A84C] text-sm transition-colors">Art Events</a></li>
                  <li><a href="#" className="text-[#8B7D6B] hover:text-[#C9A84C] text-sm transition-colors">Private Events</a></li>
                  <li><a href="#" className="text-[#8B7D6B] hover:text-[#C9A84C] text-sm transition-colors">Gift Cards</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-['Cormorant_Garamond'] italic text-[#C9A84C] text-xl mb-5">Contact</h4>
                <ul className="space-y-3">
                  {store.phone && (
                    <li>
                      <a href={`tel:${store.phone}`} className="text-[#8B7D6B] hover:text-[#C9A84C] text-sm transition-colors flex items-center gap-2">
                        <Phone size={14} /> {store.phone}
                      </a>
                    </li>
                  )}
                  {store.email && (
                    <li>
                      <a href={`mailto:${store.email}`} className="text-[#8B7D6B] hover:text-[#C9A84C] text-sm transition-colors flex items-center gap-2">
                        <Mail size={14} /> {store.email}
                      </a>
                    </li>
                  )}
                  {store.address && (
                    <li className="flex items-start gap-2 text-[#8B7D6B] text-sm">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span>{store.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-[#C9A84C]/10 bg-[#0A0A14]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[#8B7D6B]/60 text-xs">
                &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
              </p>
              <p className="text-[#8B7D6B]/60 text-xs italic">
                Parisian Art Bistro — Art de Vivre à la Française
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
