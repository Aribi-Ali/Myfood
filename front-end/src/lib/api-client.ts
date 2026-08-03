const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1'

if (!process.env.NEXT_PUBLIC_API_URL && typeof window !== 'undefined') {
  console.warn(
    '[api-client] NEXT_PUBLIC_API_URL is not set. Falling back to relative path "/api/v1".' +
    ' This will fail during SSR. Set NEXT_PUBLIC_API_URL in your .env.local file.'
  )
}

export type Params = Record<string, string | number | boolean | undefined | null>

function buildQuery(params?: Params): string {
  if (!params) return ''
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) sp.append(k, String(v))
  }
  const str = sp.toString()
  return str ? `?${str}` : ''
}

class ApiClient {
  private csrfPromise: Promise<void> | null = null

  private getCsrfToken(): string | null {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN\s*=\s*([^;]+)/)
    return match ? decodeURIComponent(match[1]!) : null
  }

  /** Fetch a fresh CSRF cookie — called once, subsequent calls reuse it */
  private async ensureCsrf(): Promise<void> {
    if (this.getCsrfToken()) return
    if (this.csrfPromise) return this.csrfPromise
    this.csrfPromise = fetch('/sanctum/csrf-cookie', { credentials: 'include' }).then(() => {
      this.csrfPromise = null
    })
    return this.csrfPromise
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const method = (options.method || 'GET').toUpperCase()

    // Sanctum validates CSRF for stateful requests — fetch the cookie first
    // Ensure CSRF token exists for any request that may need it (including GET when session is used)
    if (!this.getCsrfToken()) {
      await this.ensureCsrf();
    }

  

    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    const xsrf = this.getCsrfToken()
    if (xsrf && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      headers['X-XSRF-TOKEN'] = xsrf
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      const msg = body.message || (body.errors ? Object.values(body.errors).flat().join(', ') : `HTTP ${res.status}`)
      throw new Error(msg)
    }

    return res.json()
  }

  get<T>(endpoint: string, params?: Params) {
    return this.request<T>(`${endpoint}${buildQuery(params)}`)
  }

  post<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    })
  }

  put<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  patch<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  delete<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  upload<T>(endpoint: string, file: File, field = 'file') {
    const form = new FormData()
    form.append(field, file)
    return this.request<T>(endpoint, { method: 'POST', body: form })
  }
}

export const api = new ApiClient()

