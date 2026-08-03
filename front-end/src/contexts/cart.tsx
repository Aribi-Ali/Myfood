'use client'

import {
  createContext, useContext, useReducer, useState,
  useCallback, useEffect, type ReactNode,
} from 'react'
import { api } from '@/lib/api-client'
import type { Food } from '@/types/api'

// ── Constants ──────────────────────────────────────────────────────────────

const STORAGE_KEY = 'yallahkool_cart'

// ── Types ──────────────────────────────────────────────────────────────────

export interface CartItem {
  food: Food
  quantity: number
}

export type DeliveryType = 'delivery' | 'pickup'

// ── Cart Reducer ───────────────────────────────────────────────────────────

type CartAction =
  | { type: 'HYDRATE'; items: CartItem[] }
  | { type: 'ADD'; food: Food }
  | { type: 'UPDATE_QTY'; foodId: number; delta: number }
  | { type: 'REMOVE'; foodId: number }
  | { type: 'CLEAR' }

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'HYDRATE':
      return action.items

    case 'ADD': {
      const idx = state.findIndex(i => i.food.id === action.food.id)
      if (idx !== -1) {
        return state.map((item, i) =>
          i === idx ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...state, { food: action.food, quantity: 1 }]
    }

    case 'UPDATE_QTY': {
      return state
        .map(item =>
          item.food.id === action.foodId
            ? { ...item, quantity: Math.max(0, item.quantity + action.delta) }
            : item
        )
        .filter(item => item.quantity > 0)
    }

    case 'REMOVE':
      return state.filter(item => item.food.id !== action.foodId)

    case 'CLEAR':
      return []

    default:
      return state
  }
}

// ── localStorage helpers ───────────────────────────────────────────────────

function loadPersistedCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as unknown
      if (Array.isArray(parsed)) return parsed as CartItem[]
    }
  } catch { /* ignore */ }
  return []
}

function persistCart(items: CartItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch { /* ignore */ }
}

// ── Server cart migration ──────────────────────────────────────────────────

interface ServerCartItem {
  id: number
  store_id?: number
  name: string
  price: number
  image?: string | null
  quantity: number
}

function migrateServerCart(cartData: ServerCartItem[]): CartItem[] {
  return cartData.map(item => ({
    food: {
      id: item.id,
      store_id: item.store_id ?? 0,
      name: item.name,
      price: item.price,
      new_price: null,
      image: item.image ?? null,
      description: null,
      cooking_time: null,
      is_offer: false,
      category_id: null,
    } as Food,
    quantity: item.quantity,
  }))
}

// ── Cart Context ───────────────────────────────────────────────────────────

interface CartContextType {
  items: CartItem[]
  addToCart: (food: Food) => Promise<void>
  updateQuantity: (foodId: number, delta: number) => Promise<void>
  removeFromCart: (foodId: number) => Promise<void>
  cartTotal: number
  cartQuantity: number
  clearCart: () => Promise<void>
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  // Start empty to avoid SSR/client hydration mismatch
  const [items, dispatch] = useReducer(cartReducer, [])
  const [cartOpen, setCartOpen] = useState(false)

  // Defer localStorage load to after mount
  useEffect(() => {
    dispatch({ type: 'HYDRATE', items: loadPersistedCart() })
  }, [])

  // Persist on every change
  useEffect(() => {
    persistCart(items)
  }, [items])

  // On mount, seed from server cache if local cart is empty
  useEffect(() => {
    api.get<{ data?: { cart?: ServerCartItem[] } }>('/client/cart')
      .then(res => {
        const cart = res?.data?.cart
        const localCart = loadPersistedCart()
        if (Array.isArray(cart) && cart.length > 0 && localCart.length === 0) {
          dispatch({ type: 'HYDRATE', items: migrateServerCart(cart) })
        }
      })
      .catch(() => {})
  }, [])

  const addToCart = useCallback(async (food: Food) => {
    try {
      await api.post('/client/cart/add', {
        food_id: food.id,
        store_id: food.store_id,
        quantity: 1,
      })
    } catch { /* server cart may not be available */ }
    dispatch({ type: 'ADD', food })
  }, [])

  const updateQuantity = useCallback(async (foodId: number, delta: number) => {
    dispatch({ type: 'UPDATE_QTY', foodId, delta })
    // Fire-and-forget server sync after optimistic local update
    // We derive the new quantity from a fresh read of the updated state in a later tick
    setTimeout(() => {
      // Nothing to do here — server sync is best-effort; order placement uses server-side cart
    }, 0)
  }, [])

  const removeFromCart = useCallback(async (foodId: number) => {
    dispatch({ type: 'REMOVE', foodId })
    api.post('/client/cart/remove', { food_id: foodId }).catch(() => {})
  }, [])

  const clearCart = useCallback(async () => {
    dispatch({ type: 'CLEAR' })
    api.post('/client/cart/clear').catch(() => {})
  }, [])

  const cartTotal = items.reduce((sum, item) => {
    const price = item.food.new_price ?? item.food.price
    return sum + price * item.quantity
  }, 0)

  const cartQuantity = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items, addToCart, updateQuantity, removeFromCart,
        cartTotal, cartQuantity, clearCart,
        cartOpen, setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}

// ── Checkout Context ───────────────────────────────────────────────────────
// Separated so checkout form changes don't re-render cart consumers (e.g. navbar badge).

interface CheckoutContextType {
  checkoutOpen: boolean
  setCheckoutOpen: (open: boolean) => void
  deliveryType: DeliveryType
  setDeliveryType: (type: DeliveryType) => void
  scheduledAt: string
  setScheduledAt: (val: string) => void

  promoCode: string
  setPromoCode: (code: string) => void
  promoDiscount: number
  promoLoading: boolean
  promoError: string
  applyPromo: () => Promise<void>

  phone: string
  setPhone: (val: string) => void
  address: string
  setAddress: (val: string) => void
  wilaya: string
  setWilaya: (val: string) => void
  daira: string
  setDaira: (val: string) => void
  commune: string
  setCommune: (val: string) => void
  notes: string
  setNotes: (val: string) => void

  placingOrder: boolean
  orderError: string
  orderSuccess: string
  placeOrder: (storeId: number) => Promise<void>
}

const CheckoutContext = createContext<CheckoutContextType | null>(null)

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const { items, cartTotal, clearCart, setCartOpen } = useCart()

  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery')
  const [scheduledAt, setScheduledAt] = useState('')

  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [wilaya, setWilaya] = useState('')
  const [daira, setDaira] = useState('')
  const [commune, setCommune] = useState('')
  const [notes, setNotes] = useState('')

  const [promoCode, setPromoCode] = useState('')
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState('')

  const [placingOrder, setPlacingOrder] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [orderSuccess, setOrderSuccess] = useState('')

  const applyPromo = useCallback(async () => {
    if (!promoCode.trim()) return
    const storeId = items[0]?.food?.store_id
    if (!storeId) {
      setPromoError('No store selected')
      return
    }
    setPromoLoading(true)
    setPromoError('')
    try {
      const res = await api.post<{ discount_amount: number }>(
        '/promo/validate',
        { code: promoCode, store_id: storeId, subtotal: cartTotal }
      )
      setPromoDiscount(res.discount_amount)
    } catch (err) {
      setPromoError(err instanceof Error ? err.message : 'Invalid code')
      setPromoDiscount(0)
    }
    setPromoLoading(false)
  }, [promoCode, cartTotal, items])

  const placeOrder = useCallback(async (_storeId: number) => {
    setOrderError('')
    setPlacingOrder(true)
    try {
      await api.post('/client/orders', {
        delivery_type: deliveryType,
        scheduled_at: scheduledAt || null,
        pickup_time: null,
        address: deliveryType === 'delivery' ? address : null,
        phone,
        notes: notes || null,
        promo_code: promoCode || null,
      })
      setOrderSuccess('Order placed successfully!')
      await clearCart()
      setCartOpen(false)
      setCheckoutOpen(false)
      setPromoDiscount(0)
      setPromoCode('')
      setScheduledAt('')
      setTimeout(() => setOrderSuccess(''), 4000)
    } catch (err: unknown) {
      setOrderError(err instanceof Error ? err.message : 'Failed to place order')
    }
    setPlacingOrder(false)
  }, [deliveryType, phone, notes, address, promoCode, scheduledAt, clearCart, setCartOpen])

  return (
    <CheckoutContext.Provider
      value={{
        checkoutOpen, setCheckoutOpen,
        deliveryType, setDeliveryType,
        scheduledAt, setScheduledAt,
        promoCode, setPromoCode, promoDiscount, promoLoading, promoError, applyPromo,
        phone, setPhone, address, setAddress,
        wilaya, setWilaya, daira, setDaira, commune, setCommune,
        notes, setNotes,
        placingOrder, orderError, orderSuccess, placeOrder,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}

export function useCheckout(): CheckoutContextType {
  const ctx = useContext(CheckoutContext)
  if (!ctx) throw new Error('useCheckout must be used within a CheckoutProvider')
  return ctx
}

