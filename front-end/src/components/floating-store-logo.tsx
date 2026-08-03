'use client'

import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Store, Languages, Coins, X } from 'lucide-react'
import { useCurrency, type Currency } from '@/contexts/currency'
import { useLanguage, type Locale } from '@/contexts/language'

const EDGE_MARGIN = 20
const DRAG_THRESHOLD = 5
const GAP = 68
const VERTICAL_RANGE = 0.6 // middle 60% of viewport

const CURRENCIES: Currency[] = ['DA', 'USD', 'EUR']
const CURRENCY_LABELS: Record<Currency, string> = { DA: 'DA', USD: '$', EUR: '€' }
const LOCALES: Locale[] = ['en', 'fr', 'ar']
const LOCALE_LABELS: Record<Locale, string> = { en: 'EN', fr: 'FR', ar: 'AR' }
const LOCALE_NAMES: Record<Locale, string> = { en: 'English', fr: 'Français', ar: 'العربية' }

interface ActionDef {
  key: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  hint: string
  color: string
  onClick: () => void
}

export function FloatingStoreLogo() {
  const router = useRouter()
  const { currency, setCurrency } = useCurrency()
  const { locale, setLocale } = useLanguage()
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [open, setOpen] = useState(false)
  const [winSize, setWinSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    setWinSize({ w: window.innerWidth, h: window.innerHeight })
    const onResize = () => setWinSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const isLeft = position === null || position.x < winSize.w / 2

  const dragRef = useRef<{
    startX: number; startY: number; offsetX: number; offsetY: number
    hasMoved: boolean
  } | null>(null)
  const elRef = useRef<HTMLButtonElement>(null)

  const cycleCurrency = useCallback(() => {
    const idx = currency === 'DA' ? 0 : currency === 'USD' ? 1 : 2
    setCurrency(CURRENCIES[(idx + 1) % CURRENCIES.length]!)
  }, [currency, setCurrency])

  const cycleLocale = useCallback(() => {
    const idx = locale === 'en' ? 0 : locale === 'fr' ? 1 : 2
    setLocale(LOCALES[(idx + 1) % LOCALES.length]!)
  }, [locale, setLocale])

  const actions: ActionDef[] = useMemo(() => [
    {
      key: 'stores',
      icon: Store,
      label: locale === 'ar' ? 'المتاجر' : locale === 'fr' ? 'Magasins' : 'Stores',
      hint: 'Browse stores',
      color: 'from-amber-500 to-orange-600',
      onClick: () => { setOpen(false); router.push('/stores') },
    },
    {
      key: 'currency',
      icon: Coins,
      label: CURRENCY_LABELS[currency],
      hint: `Currency: ${currency}`,
      color: 'from-emerald-500 to-teal-600',
      onClick: cycleCurrency,
    },
    {
      key: 'language',
      icon: Languages,
      label: LOCALE_LABELS[locale],
      hint: LOCALE_NAMES[locale],
      color: 'from-violet-500 to-purple-600',
      onClick: cycleLocale,
    },
  ], [currency, locale, router, setCurrency, setLocale, cycleCurrency, cycleLocale])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const el = elRef.current
    if (!el) return
    el.setPointerCapture(e.pointerId)
    const rect = el.getBoundingClientRect()
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      hasMoved: false,
    }
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const drag = dragRef.current
    if (!drag) return
    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      drag.hasMoved = true
    }
    setPosition({
      x: e.clientX - drag.offsetX,
      y: e.clientY - drag.offsetY,
    })
  }, [])

  const handlePointerUp = useCallback(() => {
    const drag = dragRef.current
    if (!drag) return
    if (!drag.hasMoved) {
      setOpen(p => !p)
      dragRef.current = null
      return
    }
    const el = elRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = position!.x + rect.width / 2
    const cy = position!.y + rect.height / 2
    const snapX = cx < winSize.w / 2 ? EDGE_MARGIN : winSize.w - rect.width - EDGE_MARGIN
    const midRangeMin = winSize.h * (1 - VERTICAL_RANGE) / 2
    const midRangeMax = winSize.h * (1 + VERTICAL_RANGE) / 2 - rect.height
    const snapY = Math.max(midRangeMin, Math.min(midRangeMax, cy - rect.height / 2))
    setPosition({ x: snapX, y: snapY })
    setOpen(false)
    dragRef.current = null
  }, [position, winSize])

  const px = position?.x ?? EDGE_MARGIN
  const py = position?.y ?? (winSize.h ? winSize.h / 2 - 24 : 200)

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[9997] transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Menu items — vertical column to the right */}
      {actions.map((action, i) => {
        const offsetY = (i - (actions.length - 1) / 2) * 46
        const x = px + GAP
        const y = py + offsetY

        return (
          <button
            key={action.key}
            onClick={() => action.onClick()}
            title={action.hint}
            style={{
              position: 'fixed',
              zIndex: 9998,
              left: x - 20,
              top: y - 20,
              transitionDelay: open ? `${i * 60}ms` : '0ms',
            }}
            className={`
              h-10 w-10 rounded-full flex items-center justify-center
              bg-gradient-to-br ${action.color}
              shadow-lg shadow-black/30
              text-white relative group
              transition-all duration-200 ease-out
              ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}
              hover:scale-110 hover:shadow-xl
              active:scale-95
            `}
          >
            <action.icon className="h-4 w-4" />
            <span className="
              absolute left-full ml-2 px-2 py-0.5 rounded-md
              bg-black/80 text-white text-[10px] font-semibold
              whitespace-nowrap pointer-events-none
              opacity-0 group-hover:opacity-100 transition-opacity duration-150
              drop-shadow-lg backdrop-blur-sm
            ">
              {action.label}
            </span>
          </button>
        )
      })}

      {/* Animated ring behind main button */}
      <div
        style={{
          position: 'fixed',
          zIndex: 9998,
          left: px - 4,
          top: py - 4,
          width: 56,
          height: 56,
          pointerEvents: 'none',
        }}
      >
        <div
          className={`
            w-14 h-14 rounded-full border-2 border-transparent
            bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500
            bg-clip-border
            transition-all duration-500
            ${open ? 'opacity-100 scale-100 rotate-180' : 'opacity-0 scale-90'}
          `}
          style={{
            WebkitMask: 'radial-gradient(circle at center, transparent 20px, black 21px)',
            mask: 'radial-gradient(circle at center, transparent 20px, black 21px)',
          }}
        />
      </div>

      {/* Main button */}
      <button
        ref={elRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { dragRef.current = null; setOpen(false) }}
        style={{
          position: 'fixed',
          zIndex: 9999,
          left: px,
          top: py,
          cursor: 'grab',
          touchAction: 'none',
        }}
        className={`
          h-12 w-12 rounded-full
          bg-gradient-to-br from-gray-800/90 to-gray-900/90
          border-2 border-white/20
          shadow-xl shadow-black/40
          backdrop-blur-md
          flex items-center justify-center
          hover:scale-110 hover:border-white/40
          active:scale-95 active:cursor-grabbing
          transition-all duration-200 ease-out
          ${open ? 'scale-110 border-amber-400/60 shadow-amber-500/20' : ''}
        `}
        aria-label={open ? 'Close menu' : 'Quick actions'}
      >
        {open ? (
          <X className="h-5 w-5 text-amber-400" />
        ) : (
          <>
            <Store className="h-5 w-5 text-white" />
            {/* Pulsing dot */}
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </>
        )}
      </button>
    </>
  )
}
