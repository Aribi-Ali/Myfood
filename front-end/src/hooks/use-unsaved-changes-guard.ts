'use client'

import { useEffect, useCallback, type RefObject } from 'react'

const CONFIRM_MESSAGE = 'You have unsaved changes. Leave anyway?'

export function useUnsavedChangesGuard(isDirtyRef: RefObject<boolean>) {
  const shouldBlock = useCallback(() => !!isDirtyRef.current, [isDirtyRef])

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!shouldBlock()) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [shouldBlock])

  /** App Router has no routeChangeStart — intercept same-origin navigations. */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!shouldBlock()) return
      const anchor = (e.target as Element | null)?.closest('a[href]') as HTMLAnchorElement | null
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      try {
        const url = new URL(href, window.location.href)
        if (url.origin !== window.location.origin) return
        if (!window.confirm(CONFIRM_MESSAGE)) {
          e.preventDefault()
          e.stopPropagation()
        }
      } catch {
        /* ignore malformed href */
      }
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [shouldBlock])
}

export function confirmUnsavedNavigation(isDirty: boolean): boolean {
  if (!isDirty) return true
  return window.confirm(CONFIRM_MESSAGE)
}
