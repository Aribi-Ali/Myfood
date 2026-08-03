'use client'

import { useState, type FormEvent } from 'react'
import { useLanguage } from '@/contexts/language'

export function ReviewInput({ user, onSubmit }: { user: { name: string } | null; onSubmit: (rating: number, comment: string) => Promise<void> }) {
  const { t } = useLanguage()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    setSubmitting(true)
    await onSubmit(rating, comment)
    setComment('')
    setRating(5)
    setSubmitting(false)
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-stone-200 dark:border-stone-700 p-5 mb-6 bg-white dark:bg-stone-800 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">{t('review_login_prompt')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-stone-200 dark:border-stone-700 p-5 mb-6 bg-white dark:bg-stone-800 shadow-sm">
      <h3 className="font-bold text-sm mb-4 text-stone-800 dark:text-stone-100">{t('review_form_heading')}</h3>
      <div className="mb-4">
        <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-stone-400 dark:text-stone-500">{t('review_rating_label')}</label>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => setRating(star)}
              className={`text-2xl transition-all duration-150 hover:scale-110 ${star <= rating ? 'text-amber-400 drop-shadow-sm' : 'text-stone-200 dark:text-stone-600'}`}>★</button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-stone-400 dark:text-stone-500">{t('review_comment_label')}</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3}
          className="w-full text-sm rounded-xl border border-stone-200 dark:border-stone-700 p-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 resize-none bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500"
          placeholder={t('review_comment_placeholder')} />
      </div>
      <button type="submit" disabled={submitting || !comment.trim()}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-stone-300 disabled:to-stone-300 dark:disabled:from-stone-600 dark:disabled:to-stone-600 text-white font-bold text-xs py-3.5 min-h-[48px] rounded-xl transition-all duration-200 uppercase tracking-wider shadow-sm hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:shadow-none">
        {submitting ? t('review_submit_loading') : t('review_submit')}
      </button>
    </form>
  )
}
