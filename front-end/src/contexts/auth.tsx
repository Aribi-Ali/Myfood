'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '@/lib/api-client'
import type { User } from '@/types/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (name: string, email: string, password: string, passwordConfirmation: string, phone: string) => Promise<User>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await api.get<User>('/user')
        setUser(res)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      await api.post('/login', { email, password })
      const u = await api.get<User>('/user')
      setUser(u)
      return u
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Login failed')
    }
  }

  const register = async (name: string, email: string, password: string, passwordConfirmation: string, phone: string) => {
    try {
      await api.post('/register', {
        name, email, phone, password, password_confirmation: passwordConfirmation,
      })
      const u = await api.get<User>('/user')
      setUser(u)
      return u
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  const refreshUser = async () => {
    try {
      const res = await api.get<User>('/user')
      setUser(res)
    } catch {
      // ignore
    }
  }

  const logout = async () => {
    try { await api.post('/logout') } catch { /* ignore */ }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
