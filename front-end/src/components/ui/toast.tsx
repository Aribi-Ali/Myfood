'use client'

import { useEffect, useState, useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastData {
  id: number
  message: string
  type: ToastType
}

let nextId = 0
let addToastFn: ((t: Omit<ToastData, 'id'>) => void) | null = null

export function toast(message: string, type: ToastType = 'info') {
  addToastFn?.({ message, type })
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = useCallback((t: Omit<ToastData, 'id'>) => {
    const id = ++nextId
    setToasts(prev => [...prev, { ...t, id }])
    setTimeout(() => {
      setToasts(prev => prev.filter(x => x.id !== id))
    }, 3000)
  }, [])

  useEffect(() => {
    addToastFn = addToast
    return () => { addToastFn = null }
  }, [addToast])

  const remove = (id: number) => setToasts(prev => prev.filter(x => x.id !== id))

  if (!toasts.length) return null

  const colors: Record<ToastType, string> = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white',
  }

  const icons: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  }

  return (
    <div className="fixed bottom-4 ltr:right-4 rtl:left-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg animate-in ltr:slide-in-from-right rtl:slide-in-from-left ${colors[t.type]}`}
        >
          <span className="text-base leading-none">{icons[t.type]}</span>
          <span>{t.message}</span>
          <button
            onClick={() => remove(t.id)}
            className="ltr:ml-2 rtl:mr-2 opacity-70 hover:opacity-100 text-base leading-none"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  )
}
