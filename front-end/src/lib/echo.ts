import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

type EchoConfig = ConstructorParameters<typeof Echo>[0] & { broadcaster: 'reverb' }

let echo: Echo<'reverb'> | null = null

Pusher.logToConsole = process.env.NODE_ENV !== 'production'

export function getEcho(): Echo<'reverb'> {
  if (echo) return echo

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1'

  const wsHost = typeof window !== 'undefined'
    ? window.location.hostname
    : (process.env.NEXT_PUBLIC_WS_HOST ?? process.env.NEXT_PUBLIC_REVERB_HOST ?? 'localhost')

  echo = new Echo({
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_WS_APP_KEY ?? process.env.NEXT_PUBLIC_REVERB_APP_KEY ?? 'yallahkool-reverb-key',
    authorizer: (channel: { name: string }) => ({
      authorize: (socketId: string, callback: (error: unknown, data: unknown) => void) => {
        const xsrfToken = document.cookie
          .split('; ')
          .find((row) => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1]

        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (xsrfToken) {
          headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken)
        }

        fetch(`${baseUrl}/broadcasting/auth`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({
            socket_id: socketId,
            channel_name: channel.name,
          }),
        })
          .then((res) => {
            if (!res.ok) throw new Error('Channel auth failed')
            return res.json()
          })
          .then((data) => callback(null, data))
          .catch((err) => callback(err, null))
      },
    }),
    wsHost,
    wsPort: Number(process.env.NEXT_PUBLIC_WS_PORT ?? process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080),
    wssPort: Number(process.env.NEXT_PUBLIC_WS_PORT ?? process.env.NEXT_PUBLIC_REVERB_PORT ?? 443),
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
  } as EchoConfig)

  return echo
}

export function disconnectEcho(): void {
  if (echo) {
    echo.disconnect()
    echo = null
  }
}
