'use client'

import { useRef, useEffect, useState, type ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in'
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
  as?: 'div' | 'section' | 'article'
}

const ANIMATION_CLASSES: Record<string, string> = {
  'fade-up': 'translate-y-8',
  'fade-down': '-translate-y-8',
  'fade-left': 'translate-x-8',
  'fade-right': '-translate-x-8',
  'zoom-in': 'scale-95',
}

export function ScrollReveal({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  threshold = 0.15,
  once = true,
  as: Tag = 'div',
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]; if (!entry) return
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  const translateClass = ANIMATION_CLASSES[animation] || ANIMATION_CLASSES['fade-up']

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate(0, 0) scale(1)' : undefined,
        transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        transitionDelay: `${delay}ms`,
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
    >
      <div
        className={visible ? '' : translateClass}
        style={{
          transition: `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          transitionDelay: `${delay}ms`,
        }}
      >
        {children}
      </div>
    </Tag>
  )
}
