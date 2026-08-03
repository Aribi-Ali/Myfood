import { FoodGrid } from './food-grid'
import { CategoryGrid } from './category-grid'
import { OfferGrid } from './offer-grid'
import { ReservationForm } from './reservation-form'
import type { ComponentType } from 'react'

interface BlockRendererProps {
  config: Record<string, unknown>
  store: {
    name: string
    foods: import('@/types/api').Food[]
    [key: string]: unknown
  }
  foods: import('@/types/api').Food[]
  storeName: string
  onAddToCart?: (food: import('@/types/api').Food) => void
  onSelectCategory?: (categoryId: number | null) => void
}

export const BLOCK_RENDERER_MAP: Record<string, ComponentType<BlockRendererProps>> = {
  'food-grid': FoodGrid as unknown as ComponentType<BlockRendererProps>,
  'category-grid': CategoryGrid as unknown as ComponentType<BlockRendererProps>,
  'offer-grid': OfferGrid as unknown as ComponentType<BlockRendererProps>,
  'reservation-form': ReservationForm as unknown as ComponentType<BlockRendererProps>,
}
