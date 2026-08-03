'use client'

import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { BrutalistMarquee } from '@/components/brutalist-marquee'
import { FilmGrain } from '@/components/film-grain'
import { FadeIn, Parallax, ScaleIn, HoverScale } from '@/components/motion-components'
import { ArrowRight, ArrowLeft, Store, Utensils, Bike, Star } from 'lucide-react'
import { useLanguage } from '@/contexts/language'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

const FOOD_CATEGORIES = [
  { label: 'Pizza', emoji: '🍕' },
  { label: 'Burger', emoji: '🍔' },
  { label: 'Tacos', emoji: '🌮' },
  { label: 'Couscous', emoji: '🥘' },
  { label: 'Grill', emoji: '🥩' },
  { label: 'Pastry', emoji: '🥐' },
  { label: 'Sushi', emoji: '🍣' },
  { label: 'Salad', emoji: '🥗' },
  { label: 'Dessert', emoji: '🍰' },
  { label: 'Coffee', emoji: '☕' },
  { label: 'Juice', emoji: '🧃' },
  { label: 'Seafood', emoji: '🦐' },
]

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 1800
          const start = performance.now()
          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 4)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function HomePage() {
  const { locale, t } = useLanguage()
  const isAr = locale === 'ar'
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const heroImgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <>
      <Navbar />
      <FilmGrain />
      <main className="flex-1">

        {/* ---- HERO: Sushi-inspired split layout ---- */}
        <section ref={heroRef} className="relative overflow-hidden bg-cream dark:bg-background">
          {/* Warm gradient overlay */}
          <div className="absolute inset-0 warm-gradient opacity-60 pointer-events-none" />

          {/* Japanese kanji decorative text */}
          <div className="absolute top-20 right-8 kanji-deco text-[160px] sm:text-[220px] select-none pointer-events-none dark:text-cream">
            food
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              {/* Left: Editorial content */}
              <motion.div style={{ y: heroTextY }} className="lg:col-span-6 z-10">
                <FadeIn direction="down" delay={0.1}>
                  <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
                    <Store className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                      {t('app_name')} -- {t('hero_from_algeria')}
                    </span>
                  </div>
                </FadeIn>

                <FadeIn direction="up" delay={0.2}>
                  <h1 className="font-display text-[2.8rem] sm:text-[3.8rem] lg:text-[4.5rem] xl:text-[5.5rem] font-bold tracking-tight leading-[0.95] text-foreground">
                    {t('hero_title_your_store')}
                    <br />
                    <span className="text-primary">{t('hero_title_your_way')}</span>
                  </h1>
                </FadeIn>

                <FadeIn direction="up" delay={0.35}>
                  <p className="mt-6 max-w-md text-base text-muted leading-relaxed">
                    {t('hero_subtitle')}
                  </p>
                </FadeIn>

                <FadeIn direction="up" delay={0.5}>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link href="/register" className="inline-flex items-center justify-center bg-primary px-8 py-4 text-sm font-bold text-white rounded-full transition-all duration-300 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25 active:scale-[0.97]">
                      {t('hero_cta_start_free')}
                      {isAr ? <ArrowLeft className="h-4 w-4 mr-2" /> : <ArrowRight className="h-4 w-4 ml-2" />}
                    </Link>
                    <Link href="/stores" className="inline-flex items-center justify-center border-2 border-foreground/20 px-8 py-4 text-sm font-bold text-foreground rounded-full transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-cream active:scale-[0.97]">
                      {t('hero_cta_browse_stores')}
                    </Link>
                  </div>
                </FadeIn>

                {/* Social proof */}
                <FadeIn direction="up" delay={0.65}>
                  <div className="mt-12 flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {['bg-primary', 'bg-orange-400', 'bg-charcoal', 'bg-primary/70'].map((c, i) => (
                        <div key={i} className={`w-10 h-10 ${c} rounded-full border-2 border-cream flex items-center justify-center text-white text-xs font-bold`}>
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">24,000+</div>
                      <div className="text-xs text-muted">{t('hero_happy_customers')}</div>
                    </div>
                  </div>
                </FadeIn>
              </motion.div>

              {/* Right: Floating food card grid (Sushi-style) */}
              <div className="lg:col-span-6 hidden lg:block relative min-h-[500px]">
                <motion.div style={{ y: heroY, scale: heroImgScale }} className="relative">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Large feature card */}
                    <ScaleIn delay={0.3}>
                      <HoverScale>
                        <div className="bg-primary rounded-3xl p-8 text-white flex flex-col justify-between min-h-[280px] shadow-2xl shadow-primary/20">
                          <div className="text-5xl">🍕</div>
                          <div>
                            <div className="text-sm font-semibold opacity-80">{t('hero_popular_restaurants')}</div>
                            <div className="text-3xl font-bold mt-1">500+</div>
                          </div>
                        </div>
                      </HoverScale>
                    </ScaleIn>

                    {/* Small cards stack */}
                    <div className="flex flex-col gap-4">
                      <ScaleIn delay={0.4}>
                        <HoverScale>
                          <div className="bg-white dark:bg-surface rounded-2xl p-5 border border-border shadow-sm">
                            <div className="text-3xl mb-2">🍔</div>
                            <div className="text-xs font-semibold text-muted uppercase tracking-widest">{t('hero_orders')}</div>
                            <div className="text-2xl font-bold text-foreground mt-1">10K+</div>
                          </div>
                        </HoverScale>
                      </ScaleIn>

                      <ScaleIn delay={0.5}>
                        <HoverScale>
                          <div className="bg-foreground dark:bg-charcoal rounded-2xl p-5 text-white">
                            <div className="text-3xl mb-2">🚚</div>
                            <div className="text-xs font-semibold opacity-70 uppercase tracking-widest">{t('hero_fast_delivery')}</div>
                          </div>
                        </HoverScale>
                      </ScaleIn>
                    </div>

                    {/* Bottom row */}
                    <ScaleIn delay={0.55} className="col-span-2">
                      <HoverScale>
                        <div className="bg-cream-dark dark:bg-surface rounded-2xl p-6 border border-border flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                              <Star className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-foreground">{t('hero_58_wilayas')}</div>
                              <div className="text-xs text-muted">{t('hero_full_coverage')}</div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 text-orange-400 fill-current" />)}
                          </div>
                        </div>
                      </HoverScale>
                    </ScaleIn>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- MARQUEE ---- */}
        <BrutalistMarquee items={FOOD_CATEGORIES.map(c => ({ label: c.label, emoji: c.emoji }))} speed={30} />

        {/* ---- FEATURES: Zigzag editorial (Sushi-style) ---- */}
        <section className="bg-cream dark:bg-background border-t border-border py-20 sm:py-28 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <FadeIn>
              <div className="text-center mb-16">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{t('how_it_works_label')}</span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mt-3">
                  {t('how_it_works_heading')}
                </h2>
              </div>
            </FadeIn>

            {/* Steps - Alternating left/right (like Sushi about section) */}
            {[
              { num: '01', titleKey: 'step_1_title', descKey: 'step_1_desc', icon: Store, color: 'bg-primary', emoji: '🏪' },
              { num: '02', titleKey: 'step_2_title', descKey: 'step_2_desc', icon: Utensils, color: 'bg-charcoal', emoji: '🍽️' },
              { num: '03', titleKey: 'step_3_title', descKey: 'step_3_desc', icon: Bike, color: 'bg-primary/80', emoji: '🛵' },
            ].map(({ num, titleKey, descKey, color, emoji }, i) => (
              <div key={num} className={`grid lg:grid-cols-2 gap-10 lg:gap-20 items-center ${i > 0 ? 'mt-20 sm:mt-28' : ''}`}>
                {/* Image side */}
                <FadeIn direction={i % 2 === 0 ? 'left' : 'right'} delay={0.1} className={i % 2 !== 0 ? 'lg:order-2' : ''}>
                  <Parallax speed={0.15}>
                    <div className={`${color} rounded-3xl p-12 sm:p-16 flex items-center justify-center min-h-[300px] relative overflow-hidden`}>
                      <div className="text-8xl sm:text-9xl opacity-30 absolute top-6 right-6 font-display font-bold text-white select-none">{num}</div>
                      <div className="text-[120px] sm:text-[160px] select-none">{emoji}</div>
                    </div>
                  </Parallax>
                </FadeIn>

                {/* Content side */}
                <FadeIn direction={i % 2 === 0 ? 'right' : 'left'} delay={0.2} className={i % 2 !== 0 ? 'lg:order-1' : ''}>
                  <div className="max-w-md">
                    <div className="text-[80px] sm:text-[100px] font-display font-bold text-foreground/[0.05] leading-none select-none -mb-8">
                      {num}
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
                      {t(titleKey)}
                    </h3>
                    <p className="text-base text-muted leading-relaxed">
                      {t(descKey)}
                    </p>
                  </div>
                </FadeIn>
              </div>
            ))}
          </div>
        </section>

        {/* ---- STATS: Editorial bar ---- */}
        <section className="bg-foreground dark:bg-surface border-y border-border">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-3 divide-x divide-border">
              {[
                { target: 500, suffix: '+', labelKey: 'hero_stat_stores_label' },
                { target: 10000, suffix: '+', labelKey: 'hero_stat_orders_label' },
                { target: 58, suffix: '', labelKey: 'hero_stat_cities_label' },
              ].map(({ target, suffix, labelKey }) => (
                <div key={labelKey} className="py-10 sm:py-14 text-center px-4">
                  <div className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-none text-cream dark:text-foreground">
                    <AnimatedCounter target={target} suffix={suffix} />
                  </div>
                  <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-cream/50 dark:text-foreground/50 mt-3">
                    {t(labelKey)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- CTA: Warm crimson section ---- */}
        <section className="bg-primary py-20 sm:py-28 overflow-hidden relative">
          {/* Decorative diagonal lines */}
          <div className="absolute inset-0 pointer-events-none opacity-10"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(255,255,255,0.15) 30px, rgba(255,255,255,0.15) 32px)' }}
          />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn direction="up">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
                {t('cta_owner_heading')}
              </h2>
            </FadeIn>
            <FadeIn direction="up" delay={0.15}>
              <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto mb-8">
                {t('cta_owner_desc')}
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.3}>
              <Link href="/register" className="inline-flex items-center justify-center bg-white px-8 py-4 text-sm font-bold text-foreground rounded-full transition-all duration-300 hover:shadow-xl active:scale-[0.97]">
                {t('cta_owner_button')}
                {isAr ? <ArrowLeft className="h-4 w-4 mr-2" /> : <ArrowRight className="h-4 w-4 ml-2" />}
              </Link>
            </FadeIn>
          </div>
        </section>

        {/* ---- FOOTER: Minimal ---- */}
        <footer className="bg-cream dark:bg-background border-t border-border py-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            {t('footer_copyright', { year: new Date().getFullYear() })}
          </p>
        </footer>
      </main>
    </>
  )
}
