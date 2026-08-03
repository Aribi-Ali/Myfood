'use client'

import { useEffect, useRef } from 'react'
import { getEcho } from './echo'

function useOrderChannel<T extends Record<string, unknown> = Record<string, unknown>>(
  channelName: string,
  channelKey: number | undefined,
  onPlaced?: (data: T) => void,
  onStatusUpdated?: (data: T) => void,
) {
  const placedRef = useRef(onPlaced)
  const updatedRef = useRef(onStatusUpdated)

  useEffect(() => {
    placedRef.current = onPlaced
    updatedRef.current = onStatusUpdated
  })

  useEffect(() => {
    if (!channelKey) return

    const echo = getEcho()
    const channel = echo.private(`${channelName}.${channelKey}`)

    channel.listen('.order.placed', (e: T) => {
      placedRef.current?.(e)
    })
    channel.listen('.order.status.updated', (e: T) => {
      updatedRef.current?.(e)
    })

    return () => {
      channel.stopListening('.order.placed')
      channel.stopListening('.order.status.updated')
    }
  }, [channelName, channelKey])
}

export function useStoreOrdersChannel(
  storeId: number | undefined,
  onPlaced?: (data: Record<string, unknown>) => void,
  onStatusUpdated?: (data: Record<string, unknown>) => void,
) {
  useOrderChannel('orders.store', storeId, onPlaced, onStatusUpdated)
}

export function useClientOrdersChannel(
  clientId: number | undefined,
  onPlaced?: (data: Record<string, unknown>) => void,
  onStatusUpdated?: (data: Record<string, unknown>) => void,
) {
  useOrderChannel('orders.client', clientId, onPlaced, onStatusUpdated)
}
