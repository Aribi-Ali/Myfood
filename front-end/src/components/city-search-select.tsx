'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { api } from '@/lib/api-client'
import { Loader2, Search, ChevronDown } from 'lucide-react'

interface CityResult {
  id: number
  wilaya_id: number
  daira_id: number
  commune_id: number
  label: string
}

interface CitySearchSelectProps {
  value: string
  onChange: (val: string, meta: { wilaya_id: number; daira_id: number; commune_id: number } | null) => void
}

export function CitySearchSelect({ value, onChange }: CitySearchSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CityResult[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const fetchCities = useCallback(async (search: string, pageNum: number, append: boolean) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search.length >= 2) params.set('search', search)
      params.set('page', String(pageNum))
      const res = await api.get<{ data: CityResult[]; meta: { has_more: boolean } }>(`/geo/cities?${params}`)
      if (append) {
        setResults(prev => [...prev, ...(res.data ?? [])])
      } else {
        setResults(res.data ?? [])
      }
      setHasMore(res.meta?.has_more ?? false)
    } catch {
      if (!append) setResults([])
    }
    setLoading(false)
  }, [])

  // Debounced search
  useEffect(() => {
    if (!open) return
    setPage(1)
    const timer = setTimeout(() => fetchCities(query, 1, false), 300)
    return () => clearTimeout(timer)
  }, [query, open, fetchCities])

  // Infinite scroll
  useEffect(() => {
    if (!open || !sentinelRef.current) return
    const el = sentinelRef.current
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loading) {
          const nextPage = page + 1
          setPage(nextPage)
          fetchCities(query, nextPage, true)
        }
      },
      { root: dropdownRef.current, rootMargin: '100px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [open, hasMore, loading, page, query, fetchCities])

  // Click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelect = (city: CityResult) => {
    setSelectedLabel(city.label)
    setQuery('')
    setOpen(false)
    onChange(city.label, { wilaya_id: city.wilaya_id, daira_id: city.daira_id, commune_id: city.commune_id })
  }

  const displayText = selectedLabel || value || ''

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={open ? query : displayText}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => { setOpen(true); if (!query && !results.length) fetchCities('', 1, false) }}
          placeholder="Search city..."
          className="w-full rounded-xl border border-gray-300 bg-gray-50 ltr:pl-10 ltr:pr-10 rtl:pr-10 rtl:pl-10 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800"
        />
        <ChevronDown className={`absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
        >
          {results.length === 0 && !loading && (
            <p className="p-3 text-sm text-gray-400 text-center">
              {query.length >= 2 ? 'No cities found' : 'Type at least 2 characters to search'}
            </p>
          )}
          {results.map(city => (
            <button
              key={city.id}
              type="button"
              onClick={() => handleSelect(city)}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 dark:text-slate-200 dark:hover:bg-orange-900/20 dark:hover:text-orange-300 transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0"
            >
              {city.label}
            </button>
          ))}
          {loading && (
            <div className="flex items-center justify-center py-3">
              <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
            </div>
          )}
          <div ref={sentinelRef} className="h-1" />
        </div>
      )}
    </div>
  )
}
