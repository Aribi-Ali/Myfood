import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={cn('bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden', className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: CardProps) {
  return <div className={cn('p-5 border-b border-gray-100 dark:border-slate-700', className)} {...props}>{children}</div>
}

export function CardContent({ className, children, ...props }: CardProps) {
  return <div className={cn('p-5', className)} {...props}>{children}</div>
}
