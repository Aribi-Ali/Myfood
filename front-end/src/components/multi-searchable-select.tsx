'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, X } from 'lucide-react'

interface Option {
  value: string
  label: string
}

interface MultiSearchableSelectProps {
  values: string[]
  onChange: (values: string[]) => void
  options: Option[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function MultiSearchableSelect({ values, onChange, options, placeholder = 'Select...', disabled = false, className = '' }: MultiSearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = search
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options

  const selectedLabels = values.map(v => options.find(o => o.value === v)?.label).filter(Boolean) as string[]

  useEffect(() => {
    if (open) {
      setSearch('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function toggle(val: string) {
    if (values.includes(val)) {
      onChange(values.filter(v => v !== val))
    } else {
      onChange([...values, val])
    }
  }

  function remove(val: string) {
    onChange(values.filter(v => v !== val))
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => { if (!disabled) setOpen(v => !v) }}
        disabled={disabled}
        className="flex w-full min-h-[2.5rem] items-center justify-between rounded-lg border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:text-gray-400"
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selectedLabels.length > 0 ? (
            selectedLabels.map(label => (
              <span key={label} className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                {label}
                <span role="button" tabIndex={0} onClick={e => { e.stopPropagation(); const v = values[selectedLabels.indexOf(label)]; if (v !== undefined) remove(v) }} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); const v = values[selectedLabels.indexOf(label)]; if (v !== undefined) remove(v) } }} className="cursor-pointer hover:text-orange-900">
                  <X className="h-3 w-3" />
                </span>
              </span>
            ))
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="relative border-b border-gray-100">
            <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-t-lg border-0 py-2.5 ltr:pl-10 ltr:pr-3 rtl:pr-10 rtl:pl-3 text-sm focus:outline-none focus:ring-0"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-gray-400">No results</p>
            ) : (
              filtered.map(o => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => toggle(o.value)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-orange-50 ${
                    values.includes(o.value) ? 'bg-orange-50 font-semibold text-orange-700' : 'text-gray-700'
                  }`}
                >
                  <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    values.includes(o.value) ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                  }`}>
                    {values.includes(o.value) && (
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {o.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
