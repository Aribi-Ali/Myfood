'use client'

import { useLanguage } from '@/contexts/language'
import Image from 'next/image'

export function AuthBackground({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage()
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left — Algerian-Inspired Illustration Panel */}
      <div className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden bg-gradient-to-br from-green-950 via-stone-950 to-red-950">
        {/* Flag gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, rgba(0,102,51,0.2) 0%, transparent 33%, transparent 66%, rgba(204,0,0,0.15) 100%),
              radial-gradient(ellipse 90% 60% at 25% 15%, rgba(0,102,51,0.15) 0%, transparent 60%),
              radial-gradient(ellipse 70% 50% at 75% 85%, rgba(204,0,0,0.1) 0%, transparent 50%),
              radial-gradient(ellipse 40% 30% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 40%)
            `,
          }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Algerian geometric pattern — top */}
        <div className="absolute top-0 left-0 right-0 h-3 flex">
          <div className="flex-1 bg-green-600/20" />
          <div className="flex-1 bg-white/5" />
          <div className="flex-1 bg-red-600/20" />
        </div>

        {/* Algerian geometric pattern — bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-3 flex">
          <div className="flex-1 bg-red-600/20" />
          <div className="flex-1 bg-white/5" />
          <div className="flex-1 bg-green-600/20" />
        </div>

        {/* Decorative rings — inspired by traditional ceramics */}
        <div className="absolute w-[520px] h-[520px] rounded-full border border-green-500/10" />
        <div className="absolute w-[400px] h-[400px] rounded-full border border-green-500/15" />
        <div className="absolute w-[280px] h-[280px] rounded-full border border-red-400/20" />
        <div className="absolute w-[160px] h-[160px] rounded-full border border-amber-500/25" />

        {/* Traditional zigzag pattern border */}
        <div
          className="absolute bottom-20 left-10 right-10 h-6 opacity-[0.07]"
          style={{
            background: `repeating-linear-gradient(
              135deg,
              transparent,
              transparent 8px,
              rgba(255,255,255,0.3) 8px,
              rgba(255,255,255,0.3) 16px
            )`,
          }}
        />

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center text-center px-8">
          {/* Algerian food spread */}
          <div className="relative mb-10">
            {/* Large traditional plate */}
            <div className="w-52 h-52 rounded-full bg-gradient-to-b from-green-600/10 via-amber-800/5 to-red-600/10 border border-amber-500/20 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                {/* Steam */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex gap-1.5">
                  <div className="w-0.5 h-8 bg-amber-300/30 rounded-full animate-steam-1" />
                  <div className="w-0.5 h-6 bg-amber-300/25 rounded-full animate-steam-2" />
                  <div className="w-0.5 h-10 bg-amber-300/30 rounded-full animate-steam-1" />
                  <div className="w-0.5 h-7 bg-amber-300/25 rounded-full animate-steam-2" />
                </div>
                {/* Couscous — main dish */}
                <span className="text-5xl block">🍚</span>
                <span className="text-sm text-amber-400/70 mt-1 block font-light">Couscous</span>
              </div>
            </div>
            {/* Surrounding Algerian icons */}
            <span className="absolute -top-5 ltr:left-2 rtl:right-2 text-4xl animate-float">☪️</span>
            <span className="absolute -top-4 ltr:-right-4 rtl:-left-4 text-3xl animate-float-delayed">🌴</span>
            <span className="absolute -bottom-3 ltr:-left-7 rtl:-right-7 text-3xl animate-float">🍵</span>
            <span className="absolute -bottom-8 ltr:right-3 rtl:left-3 text-3xl animate-float-delayed">🌊</span>
            <span className="absolute top-14 ltr:-left-10 rtl:-right-10 text-2xl animate-float">🌵</span>
            <span className="absolute top-16 ltr:-right-10 rtl:-left-10 text-2xl animate-float-delayed">🏺</span>
          </div>

          {/* Brand */}
          <Image
            src="/logo.png"
            alt={t('app_name')}
            width={72}
            height={72}
            className="h-18 w-18 rounded-2xl object-cover shadow-lg mb-4 ring-2 ring-white/10"
          />
          <h1 className="text-4xl font-bold text-white tracking-tight">
            {t('app_name')}
          </h1>
          <div className="mt-2 h-0.5 w-20 bg-gradient-to-r from-green-500 via-white/30 to-red-500 rounded-full" />
          <p className="mt-4 text-white/50 text-sm max-w-xs leading-relaxed font-light tracking-wide">
            {t('auth_tagline')}
          </p>

          {/* Algerian feature badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {[t('auth_badge_algerian'), t('auth_badge_couscous'), t('auth_badge_cities')].map((feat) => (
              <span
                key={feat}
                className="px-3 py-1.5 text-xs text-white/60 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm"
              >
                {feat}
              </span>
            ))}
          </div>

          {/* Traditional pattern */}
          <div className="mt-10 flex gap-3 opacity-30">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 border-2 border-amber-500/40 rounded-sm"
                style={{ transform: `rotate(${i * 18}deg)` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-green-950 via-stone-950 to-red-950 px-4 py-16 lg:px-12">
        {/* Flag accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-green-600/30" />
          <div className="flex-1 bg-white/10" />
          <div className="flex-1 bg-red-600/30" />
        </div>

        {/* Background glow */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 30% 20%, rgba(0,102,51,0.12) 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 70% 80%, rgba(204,0,0,0.08) 0%, transparent 50%)
            `,
          }}
        />

        {/* Mobile header */}
        <div className="lg:hidden absolute top-8 left-0 right-0 text-center z-10">
          <h2 className="text-lg font-bold text-white/90">{t('app_name')}</h2>
        </div>

        {/* Glass Card */}
        <div className="relative z-10 w-full max-w-sm">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl shadow-green-950/50">
            {children}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes steam-1 {
          0%, 100% { transform: translateY(0) scaleX(1); opacity: 0.3; }
          50% { transform: translateY(-12px) scaleX(0.6); opacity: 0.1; }
        }
        @keyframes steam-2 {
          0%, 100% { transform: translateY(0) scaleX(1); opacity: 0.25; }
          50% { transform: translateY(-10px) scaleX(0.7); opacity: 0.08; }
        }
        .animate-float { animation: float 3s ease-in-out infinite; display: inline-block; }
        .animate-float-delayed { animation: float-delayed 3s ease-in-out 1.5s infinite; display: inline-block; }
        .animate-steam-1 { animation: steam-1 2.5s ease-in-out infinite; }
        .animate-steam-2 { animation: steam-2 2.5s ease-in-out 1.2s infinite; }
      `}</style>
    </div>
  )
}
