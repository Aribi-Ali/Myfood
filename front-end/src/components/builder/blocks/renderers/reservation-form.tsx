'use client'

import { useState } from 'react'
import type { ReservationFormConfig } from '@/components/templates/types'
import { useLanguage } from '@/contexts/language'

interface ReservationFormProps {
  config: ReservationFormConfig
  storeName: string
}

export function ReservationForm({ config, storeName }: ReservationFormProps) {
  const { t } = useLanguage()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  if (submitted) {
    return (
      <div className="py-16 px-6 bg-stone-50 text-center">
        <div className="max-w-lg mx-auto bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-lg font-bold text-stone-800 mb-2">{t('request_sent')}</h3>
          <p className="text-sm text-stone-500">{t('reservation_confirm_desc')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16 px-6 bg-stone-50">
      <div className="max-w-lg mx-auto">
        {config.title && (
          <h2 className="text-2xl md:text-3xl font-bold text-center text-stone-800 mb-2">{config.title}</h2>
        )}
        {config.subtitle && (
          <p className="text-sm text-stone-500 text-center mb-8">{config.subtitle}</p>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
          {config.showName && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-stone-500">{t('name')}</label>
              <input type="text" required className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 bg-stone-50" placeholder={t('your_name')} />
            </div>
          )}
          {config.showPhone && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-stone-500">{t('phone')}</label>
              <input type="tel" required className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 bg-stone-50" placeholder={t('your_phone')} />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            {config.showDate && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-stone-500">{t('date')}</label>
                <input type="date" required className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 bg-stone-50" />
              </div>
            )}
            {config.showTime && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-stone-500">{t('time')}</label>
                <input type="time" required className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 bg-stone-50" />
              </div>
            )}
          </div>
          {config.showGuests && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-stone-500">{t('guests')}</label>
              <input type="number" min="1" max="20" defaultValue="2" className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 bg-stone-50" />
            </div>
          )}
          <div className="text-[10px] text-stone-400 text-center py-2">
            {t('booking_at')} <strong className="text-stone-600">{storeName}</strong>
          </div>
          <button type="submit" className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm uppercase tracking-wider transition shadow-sm active:scale-95">
            {t('book_now')}
          </button>
        </form>
      </div>
    </div>
  )
}
