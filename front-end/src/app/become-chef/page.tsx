'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Navbar } from '@/components/navbar'
import { X } from 'lucide-react'

interface ChefProfile {
  bio: string | null
  specialization: string | null
  years_of_experience: number | null
  cuisines: string[]
  verification_document: string | null
}

export default function BecomeChefPage() {
  const { t } = useLanguage()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [bio, setBio] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [yearsExp, setYearsExp] = useState('')
  const [cuisines, setCuisines] = useState<string[]>([])
  const [cuisineInput, setCuisineInput] = useState('')
  const [verificationDoc, setVerificationDoc] = useState<File | null>(null)
  const [existingDocUrl, setExistingDocUrl] = useState('')

  const [fetching, setFetching] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function fetchProfile() {
    setFetching(true)
    try {
      const res = await api.get<{ data: ChefProfile }>('/client/chef-profile')
      const profile = res.data
      setBio(profile.bio || '')
      setSpecialization(profile.specialization || '')
      setYearsExp(profile.years_of_experience ? String(profile.years_of_experience) : '')
      setCuisines(profile.cuisines || [])
      setExistingDocUrl(profile.verification_document || '')
    } catch {
      // No existing profile - that's fine
    }
    setFetching(false)
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    if (!user) return
    ;(async () => {
      setFetching(true)
      try {
        const res = await api.get<{ data: ChefProfile }>('/client/chef-profile')
        const profile = res.data
        setBio(profile.bio || '')
        setSpecialization(profile.specialization || '')
        setYearsExp(profile.years_of_experience ? String(profile.years_of_experience) : '')
        setCuisines(profile.cuisines || [])
        setExistingDocUrl(profile.verification_document || '')
      } catch {
        // No existing profile - that's fine
      }
      setFetching(false)
    })()
  }, [user, authLoading, router])

  function addCuisine() {
    const trimmed = cuisineInput.trim()
    if (trimmed && !cuisines.includes(trimmed)) {
      setCuisines([...cuisines, trimmed])
    }
    setCuisineInput('')
  }

  function removeCuisine(cuisine: string) {
    setCuisines(cuisines.filter((c) => c !== cuisine))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      const body = new FormData()
      body.append('bio', bio)
      body.append('specialization', specialization)
      body.append('years_of_experience', yearsExp)
      body.append('cuisines', JSON.stringify(cuisines))
      if (verificationDoc) {
        body.append('verification_document', verificationDoc)
      }
      await api.post('/client/chef-profile', body)
      setSuccess(t('become_chef_success'))
    } catch (err) {
      setError(err instanceof Error ? err.message : t('become_chef_error_failed'))
    }
    setSubmitting(false)
  }

  if (authLoading || fetching) {
    return (
      <>
        <Navbar />
        <main className="flex-1 mx-auto max-w-lg px-4 py-12 space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-64 w-full" />
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 mx-auto max-w-lg px-4 py-12">
        <Card>
          <CardHeader>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white text-center">{t('become_chef')}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{t('become_chef_subtitle')}</p>
          </CardHeader>
          <CardContent>
            {success && (
              <div className="mb-4 rounded-lg bg-green-50 dark:bg-green-900/30 p-3 text-sm text-green-700 dark:text-green-400">{success}</div>
            )}
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/30 p-3 text-sm text-red-700 dark:text-red-400">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('become_chef_bio_label')}</label>
                <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500" rows={4} required
                />
              </div>

              <Input id="specialization" label={t('specialization_placeholder')} value={specialization} onChange={(e) => setSpecialization(e.target.value)} required />

              <Input id="years" label={t('years_of_experience')} type="number" value={yearsExp} onChange={(e) => setYearsExp(e.target.value)} required />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('cuisines')}</label>
                <div className="mt-1 flex gap-2">
                  <Input
                    placeholder={t('become_chef_cuisine_placeholder')}
                    value={cuisineInput}
                    onChange={(e) => setCuisineInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCuisine() } }}
                  />
                  <Button variant="outline" type="button" onClick={addCuisine}>{t('become_chef_cuisine_add')}</Button>
                </div>
                {cuisines.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {cuisines.map((c) => (
                      <span key={c} className="inline-flex items-center gap-1 rounded-full bg-orange-100 dark:bg-orange-900/30 px-2.5 py-0.5 text-xs font-medium text-orange-700 dark:text-orange-300">
                        {c}
                        <button onClick={() => removeCuisine(c)}><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('verification_document')}</label>
                {existingDocUrl && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('become_chef_document_existing')}</p>
                )}
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setVerificationDoc(e.target.files?.[0] || null)}
                  className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-50 dark:file:bg-orange-900/30 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-orange-700 dark:file:text-orange-300 hover:file:bg-orange-100 dark:hover:file:bg-orange-800/50"
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? t('become_chef_submit_loading') : t('become_chef_submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
