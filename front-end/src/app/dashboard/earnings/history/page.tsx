'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BarChart3, DollarSign } from 'lucide-react'
import type { DeliveryEarningsData } from '@/types/api'

export default function EarningsHistoryPage() {
  const router = useRouter()
  const [earnings, setEarnings] = useState<DeliveryEarningsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchHistory = useCallback(() => {
    setLoading(true)
    api.get<{ data: DeliveryEarningsData }>('/delivery/pricing/earnings/history')
      .then(res => setEarnings(res.data))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load history'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  const maxGross = Math.max(...(earnings?.history ?? []).map(h => h.gross_fees), 1)
  const maxNet = Math.max(...(earnings?.history ?? []).map(h => h.net_earnings), 1)

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/earnings')}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  const history = earnings?.history ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/earnings')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Earnings History</h1>
          <p className="text-sm text-gray-500">{history.length} months of data</p>
        </div>
      </div>

      {history.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No earnings history yet.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Chart */}
          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-500" /> Monthly Gross vs Net
              </h3>
              <div className="flex items-end gap-2 h-64">
                {history.map((h, i) => {
                  const grossHeight = (h.gross_fees / maxGross) * 100
                  const netHeight = (h.net_earnings / maxNet) * 100
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                      <div className="w-full flex flex-col items-center gap-0.5" style={{ height: '100%', justifyContent: 'flex-end' }}>
                        {/* Gross bar */}
                        <div
                          className="w-full rounded-t-sm bg-orange-300 transition-all hover:opacity-80 cursor-pointer"
                          style={{ height: `${Math.max(grossHeight, 1)}%` }}
                          title={`${h.month} ${h.year}: Gross ${h.gross_fees.toLocaleString()} DA`}
                        />
                        {/* Net bar */}
                        <div
                          className="w-full rounded-t-sm bg-green-500 transition-all hover:opacity-80 cursor-pointer"
                          style={{ height: `${Math.max(netHeight, 1)}%` }}
                          title={`${h.month} ${h.year}: Net ${h.net_earnings.toLocaleString()} DA`}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 whitespace-nowrap">{h.month.slice(0, 3)} {String(h.year).slice(2)}</span>
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-orange-300" /> Gross</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-500" /> Net</span>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-600">Month</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Deliveries</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Gross</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Platform Fee</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Net Earnings</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Fee %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((h, i) => {
                  const feePercent = h.gross_fees > 0 ? ((h.platform_fees / h.gross_fees) * 100).toFixed(1) : '0'
                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{h.month} {h.year}</td>
                      <td className="px-4 py-3">{h.deliveries}</td>
                      <td className="px-4 py-3">{h.gross_fees.toLocaleString()} DA</td>
                      <td className="px-4 py-3 text-red-600">{h.platform_fees.toLocaleString()} DA</td>
                      <td className="px-4 py-3 font-bold text-green-600">{h.net_earnings.toLocaleString()} DA</td>
                      <td className="px-4 py-3 text-gray-500">{feePercent}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
