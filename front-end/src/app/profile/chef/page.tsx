'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/contexts/auth'
import { api } from '@/lib/api-client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, Upload, CheckCircle, XCircle } from 'lucide-react'

interface ChefProfile {
  id: number
  specialization: string | null
  years_of_experience: number | null
  bio: string | null
  cuisines_expertise: string[] | null
  is_verified: boolean
  is_available: boolean
  verification_document: string | null
  average_rating: string | null
}

export default function ChefPage() {
  const { user, loading: authLoading } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState<ChefProfile | null>(null)
  const [hasProfile, setHasProfile] = useState(false)
  const [fetching, setFetching] = useState(true)

  const [specialization, setSpecialization] = useState('')
  const [yearsOfExperience, setYearsOfExperience] = useState('')
  const [bio, setBio] = useState('')
  const [cuisines, setCuisines] = useState<string[]>([])

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const CUISINE_OPTIONS = ['Italian', 'Arabic', 'Mediterranean', 'Fast Food', 'Desserts']

  async function fetchProfile() {
    setFetching(true)
    try {
      const res = await api.get<{ data: ChefProfile }>('/client/chef')
      setProfile(res.data)
      setHasProfile(true)
      setSpecialization(res.data.specialization || '')
      setYearsOfExperience(res.data.years_of_experience?.toString() || '')
      setBio(res.data.bio || '')
      setCuisines(res.data.cuisines_expertise || [])
    } catch {
      setHasProfile(false)
    }
    setFetching(false)
  }

  useEffect(() => {
    if (!authLoading && !user) return
    if (!user) return
    fetchProfile()
  }, [user, authLoading])

  function toggleCuisine(c: string) {
    setCuisines((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await api.post('/client/chef', {
        specialization,
        years_of_experience: parseInt(yearsOfExperience) || 0,
        bio,
        cuisines,
      })
      await fetchProfile()
      setMessage('Chef profile saved successfully.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save chef profile')
    }
    setSaving(false)
  }

  async function handleDocumentUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSaving(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('document', file)
      await api.post('/client/chef/document', formData)
      await fetchProfile()
      setMessage('Document uploaded successfully.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document')
    }
    setSaving(false)
  }

  if (authLoading || fetching) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Become a Chef</h1>
        <p className="text-gray-500 dark:text-gray-400">Register as a chef and get verified to offer your culinary services.</p>
      </div>

      {message && (
        <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-3 text-sm text-green-700 dark:text-green-400">{message}</div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-400">{error}</div>
      )}

      {hasProfile && profile && (
        <div className="rounded-lg border p-4 flex items-center gap-3">
          {profile.is_verified ? (
            <>
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span className="text-sm text-green-700 dark:text-green-400">Your chef profile is verified.</span>
            </>
          ) : (
            <>
              <XCircle className="h-6 w-6 text-yellow-500" />
              <span className="text-sm text-yellow-700 dark:text-yellow-300">Your chef profile is pending verification.</span>
            </>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chef Information</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-stone-200 mb-1">Specialization</label>
                  <Input value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="e.g. Pizza Chef, Pastry Chef" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-stone-200 mb-1">Years of Experience</label>
                  <Input type="number" min="0" max="80" value={yearsOfExperience} onChange={(e) => setYearsOfExperience(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-stone-200 mb-1">Cuisines</label>
                  <div className="flex flex-wrap gap-2">
                    {CUISINE_OPTIONS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCuisine(c)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          cuisines.includes(c)
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-stone-300 hover:bg-gray-200'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-stone-200 mb-1">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    maxLength={2000}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {hasProfile ? 'Update Profile' : 'Submit Application'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Verification Document</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Upload a PDF or image as proof of your culinary qualifications.</p>
              <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleDocumentUpload} />
              <Button variant="outline" className="w-full" size="sm" onClick={() => fileRef.current?.click()} disabled={saving}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
              {profile?.verification_document && (
                <p className="text-xs text-green-600 dark:text-green-400">Document uploaded.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Rating</h3>
            </CardHeader>
            <CardContent>
              {profile?.average_rating ? (
                <p className="text-3xl font-bold text-orange-600">{profile.average_rating} / 5</p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No rating yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
