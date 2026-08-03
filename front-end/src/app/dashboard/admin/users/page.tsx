'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Shield, ShieldOff, MailCheck, UserCog, AlertTriangle, Ban, X, Send } from 'lucide-react'

interface BanInfo {
  id: number
  reason: string | null
  banned_at: string
  banned_by: { id: number; name: string } | null
}

interface UserData {
  id: number
  name: string
  email: string
  phone: string | null
  role: string
  email_verified_at: string | null
  active_ban: BanInfo | null
  created_at: string
  orders_count?: number
  reviews_count?: number
  store?: { id: number; name: string; alias: string } | null
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [showBannedOnly, setShowBannedOnly] = useState(false)
  const [detailUser, setDetailUser] = useState<UserData | null>(null)
  // Warning modal state
  const [warningUser, setWarningUser] = useState<UserData | null>(null)
  const [warningSubject, setWarningSubject] = useState('')
  const [warningMessage, setWarningMessage] = useState('')
  const [sendingWarning, setSendingWarning] = useState(false)
  // Ban reason
  const [banReason, setBanReason] = useState('')
  const [showBanModal, setShowBanModal] = useState<number | null>(null)
  const [banning, setBanning] = useState(false)

  const fetchUsers = () => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams()
    if (roleFilter) params.set('role', roleFilter)
    if (search) params.set('search', search)
    if (showBannedOnly) params.set('banned', 'true')

    api.get<{ data: { data: UserData[] } }>('/admin/users?' + params.toString())
      .then(res => setUsers(res.data?.data || []))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load users'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [roleFilter, showBannedOnly])

  const handleSearch = () => { fetchUsers() }

  const confirmBan = async () => {
    if (!showBanModal) return
    setBanning(true)
    try {
      await api.post(`/admin/users/${showBanModal}/ban`, { reason: banReason })
      setSuccess('User banned globally')
      setShowBanModal(null)
      setBanReason('')
      fetchUsers()
      setDetailUser(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to ban')
    }
    setBanning(false)
  }

  const unbanUser = async (id: number) => {
    try {
      await api.post(`/admin/users/${id}/unban`)
      setSuccess('User unbanned')
      fetchUsers()
      setDetailUser(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to unban')
    }
  }

  const verifyEmail = async (id: number) => {
    try {
      await api.post(`/admin/users/${id}/verify-email`)
      setSuccess('Email verified')
      fetchUsers()
      if (detailUser?.id === id) setDetailUser({ ...detailUser, email_verified_at: new Date().toISOString() })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to verify')
    }
  }

  const sendWarning = async () => {
    if (!warningUser || !warningSubject.trim() || !warningMessage.trim()) return
    setSendingWarning(true)
    try {
      await api.post(`/admin/users/${warningUser.id}/send-warning`, {
        subject: warningSubject,
        message: warningMessage,
      })
      setSuccess(`Warning sent to ${warningUser.name}`)
      setWarningUser(null)
      setWarningSubject('')
      setWarningMessage('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send warning')
    }
    setSendingWarning(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {['', 'client', 'owner', 'chef', 'delivery', 'admin'].map(r => (
            <Button key={r} variant={roleFilter === r ? 'primary' : 'outline'} size="sm" onClick={() => setRoleFilter(r)}>
              {r || 'All'}
            </Button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={showBannedOnly} onChange={e => setShowBannedOnly(e.target.checked)} className="rounded" />
            Banned only
          </label>
          <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} className="w-48" />
          <Button variant="outline" size="sm" onClick={handleSearch}><Search className="h-4 w-4" /></Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No users found</div>
      ) : (
        <div className="space-y-2">
          {users.map(u => (
            <Card key={u.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setDetailUser(u)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center flex-shrink-0">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {u.name}
                      {u.active_ban && <span className="text-xs text-red-500 ml-2 font-normal">(banned)</span>}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{u.email}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {u.role} · Orders: {u.orders_count ?? 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {u.active_ban && (
                    <span className="text-xs text-red-700 font-medium px-2 py-1 bg-red-50 rounded-full border border-red-200">
                      Banned
                    </span>
                  )}
                  {!u.email_verified_at && (
                    <span className="text-xs text-yellow-600 font-medium px-2 py-1 bg-yellow-50 rounded-full">Unverified</span>
                  )}
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">{u.role}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDetailUser(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">User Details</h3>
              <button onClick={() => setDetailUser(null)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 pb-3 border-b">
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 font-bold text-lg flex items-center justify-center">
                  {detailUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{detailUser.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 capitalize">{detailUser.role}</span>
                  {detailUser.active_ban && <span className="text-xs text-red-500 ml-2 font-medium">Banned</span>}
                </div>
              </div>

              {detailUser.active_ban && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-red-700 mb-1">Active Ban</p>
                  <p className="text-sm text-red-600">Reason: {detailUser.active_ban.reason || 'No reason provided'}</p>
                  <p className="text-xs text-red-400 mt-0.5">
                    By: {detailUser.active_ban.banned_by?.name || 'System'} · {new Date(detailUser.active_ban.banned_at).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div><p className="text-xs text-gray-500">Email</p><p className="font-medium">{detailUser.email}</p></div>
                <div><p className="text-xs text-gray-500">Phone</p><p className="font-medium">{detailUser.phone || 'N/A'}</p></div>
                <div><p className="text-xs text-gray-500">Email Verified</p><p className="font-medium">{detailUser.email_verified_at ? 'Yes' : 'No'}</p></div>
                <div><p className="text-xs text-gray-500">Orders</p><p className="font-medium">{detailUser.orders_count ?? 0}</p></div>
              </div>

              <div className="flex flex-wrap gap-2 pt-3 border-t">
                {!detailUser.email_verified_at && (
                  <Button size="sm" variant="outline" onClick={() => verifyEmail(detailUser.id)}>
                    <MailCheck className="h-4 w-4 mr-1" /> Verify Email
                  </Button>
                )}
                {detailUser.active_ban ? (
                  <>
                    <Button size="sm" variant="outline" onClick={() => unbanUser(detailUser.id)} className="text-green-600 border-green-200">
                      <ShieldOff className="h-4 w-4 mr-1" /> Unban
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setWarningUser(detailUser); setDetailUser(null) }} className="text-orange-600 border-orange-200">
                      <AlertTriangle className="h-4 w-4 mr-1" /> Send Warning
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="outline" onClick={() => setShowBanModal(detailUser.id)} className="text-red-600 border-red-200">
                      <Ban className="h-4 w-4 mr-1" /> Ban User
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setWarningUser(detailUser); setDetailUser(null) }} className="text-orange-600 border-orange-200">
                      <AlertTriangle className="h-4 w-4 mr-1" /> Send Warning
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ban Reason Modal */}
      {showBanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setShowBanModal(null); setBanReason('') }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Ban User</h3>
            <p className="text-sm text-gray-500 mb-4">Provide a reason for the ban. The user will see this when they try to log in.</p>
            <textarea
              value={banReason}
              onChange={e => setBanReason(e.target.value)}
              placeholder="Reason for ban (optional)..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { setShowBanModal(null); setBanReason('') }}>Cancel</Button>
              <Button size="sm" onClick={confirmBan} disabled={banning} className="bg-red-600 hover:bg-red-700 text-white">
                {banning ? 'Banning...' : 'Confirm Ban'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Send Warning Modal */}
      {warningUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setWarningUser(null); setWarningSubject(''); setWarningMessage('') }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Send Warning to {warningUser.name}</h3>
              <button onClick={() => { setWarningUser(null); setWarningSubject(''); setWarningMessage('') }} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <Input
                  value={warningSubject}
                  onChange={e => setWarningSubject(e.target.value)}
                  placeholder="e.g. Warning: Order cancellation policy violation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={warningMessage}
                  onChange={e => setWarningMessage(e.target.value)}
                  placeholder="Describe the warning..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  rows={5}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => { setWarningUser(null); setWarningSubject(''); setWarningMessage('') }}>Cancel</Button>
                <Button
                  onClick={sendWarning}
                  disabled={sendingWarning || !warningSubject.trim() || !warningMessage.trim()}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Send className="h-4 w-4 mr-1" />
                  {sendingWarning ? 'Sending...' : 'Send Warning'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
