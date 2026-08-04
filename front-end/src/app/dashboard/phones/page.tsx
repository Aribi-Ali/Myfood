'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/auth'
import { SettingsNav } from '@/components/settings-nav'
import { Phone, ShieldCheck, ShieldAlert, Plus, Trash2, Loader2, Check } from 'lucide-react'

interface PhoneEntry {
  id?: number
  phone: string
  is_primary: boolean
  verified: boolean
  source: 'user' | 'store'
}

export default function PhonesPage() {
  const { user, refreshUser } = useAuth()
  const [phones, setPhones] = useState<PhoneEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [newPhone, setNewPhone] = useState('')
  const [adding, setAdding] = useState(false)

  const [sendingCode, setSendingCode] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [verifyPhone, setVerifyPhone] = useState('')
  const [code, setCode] = useState('')

  const fetchPhones = useCallback(() => {
    setLoading(true)
    api.get<{ data: PhoneEntry[] }>('/phone')
      .then(res => setPhones(res.data))
      .catch(() => setError('Failed to load phone numbers'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchPhones() }, [fetchPhones])

  const handleSendCode = async (phone: string) => {
    setSendingCode(true)
    setError('')
    try {
      const res = await api.post<{ data: { debug_code: string } }>('/phone/send-code', { phone })
      setCodeSent(true)
      setVerifyPhone(phone)
      setCode('')
      setMessage(`Code sent${res.data.debug_code ? ` (debug: ${res.data.debug_code})` : ''}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code')
    }
    setSendingCode(false)
  }

  const handleVerify = async () => {
    setVerifying(true)
    setError('')
    try {
      await api.post('/phone/verify', { phone: verifyPhone, code })
      setMessage('Phone number verified successfully!')
      setCodeSent(false)
      setVerifyPhone('')
      setCode('')
      fetchPhones()
      refreshUser()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    }
    setVerifying(false)
  }

  const handleAddPhone = async () => {
    if (!newPhone.trim()) return
    setAdding(true)
    setError('')
    try {
      const res = await api.post<{ data: PhoneEntry }>('/phone/add', { phone: newPhone.trim() })
      setPhones(prev => [...prev, res.data])
      setNewPhone('')
      setMessage('Phone added! Verify it to start receiving calls.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add phone')
    }
    setAdding(false)
  }

  const handleRemovePhone = async (entry: PhoneEntry) => {
    if (!entry.id) return
    setError('')
    try {
      await api.delete(`/phone/${entry.id}`)
      setPhones(prev => prev.filter(p => p.id !== entry.id))
      setMessage('Phone number removed.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove phone')
    }
  }

  const handleSetPrimary = async (entry: PhoneEntry) => {
    if (!entry.id) return
    setError('')
    try {
      await api.post(`/phone/${entry.id}/set-primary`)
      setMessage('Primary phone updated.')
      fetchPhones()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set primary')
    }
  }

  const hasStore = user?.store?.id

  return (
    <div className="flex flex-col min-h-0 lg:flex-row lg:gap-6">
      <SettingsNav />
      <div className="flex-1 min-w-0 min-h-0 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Phone Numbers</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Manage and verify your phone numbers.</p>
      </div>

      {message && <div className="rounded-lg bg-green-50 dark:bg-green-900/30 p-3 text-sm text-green-700 dark:text-green-300">{message}</div>}
      {error && <div className="rounded-lg bg-red-50 dark:bg-red-900/30 p-3 text-sm text-red-700 dark:text-red-300">{error}</div>}

      {loading ? (
        <div className="space-y-4"><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></div>
      ) : (
        <div className="space-y-4">
          {phones.map((entry, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-full ${entry.verified ? 'bg-green-100 dark:bg-green-900/40' : 'bg-yellow-100 dark:bg-yellow-900/40'}`}>
                    {entry.verified ? <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" /> : <ShieldAlert className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {entry.phone}
                      {entry.is_primary && <span className="ml-2 text-xs text-orange-600 dark:text-orange-400 font-medium">Primary</span>}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {entry.verified ? 'Verified' : 'Not verified'}
                      {entry.source === 'user' ? ' (Your number)' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!entry.verified && (
                    !codeSent || verifyPhone !== entry.phone ? (
                      <Button size="sm" variant="outline" onClick={() => handleSendCode(entry.phone)} disabled={sendingCode}>
                        {sendingCode && verifyPhone === entry.phone ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                        Verify
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Input value={code} onChange={e => setCode(e.target.value)} placeholder="6-digit code" className="w-24 h-8 text-xs" maxLength={6} />
                        <Button size="sm" onClick={handleVerify} disabled={verifying || code.length !== 6}>
                          {verifying ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                        </Button>
                      </div>
                    )
                  )}
                  {!entry.is_primary && entry.source === 'store' && entry.id && (
                    <button onClick={() => handleSetPrimary(entry)} className="p-1.5 text-gray-400 hover:text-orange-600" title="Set as primary">
                      <Phone className="h-4 w-4" />
                    </button>
                  )}
                  {!entry.is_primary && entry.source === 'store' && entry.id && (
                    <button onClick={() => handleRemovePhone(entry)} className="p-1.5 text-red-400 hover:text-red-600" title="Remove">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {phones.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center text-sm text-gray-500 dark:text-slate-400">
                No phone numbers yet.
              </CardContent>
            </Card>
          )}

          {hasStore && (
            <Card>
              <CardHeader>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Add Another Number</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="e.g. 0661234567" className="flex-1" />
                  <Button onClick={handleAddPhone} disabled={adding || !newPhone.trim()}>
                    {adding ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      </div>
    </div>
  )
}
