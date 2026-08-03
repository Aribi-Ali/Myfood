'use client'

import { useTheme } from '@/contexts/theme'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="group flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-orange-50 hover:text-orange-700 dark:text-gray-400 dark:hover:bg-gray-800"
      title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 text-gray-400 transition-colors duration-200 group-hover:text-orange-500" />
      ) : (
        <Sun className="h-4 w-4 text-gray-400 transition-colors duration-200 group-hover:text-orange-500" />
      )}
    </button>
  )
}
