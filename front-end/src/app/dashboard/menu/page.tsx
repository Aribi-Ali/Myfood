'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { useLanguage } from '@/contexts/language'
import { api } from '@/lib/api-client'
import { getImageUrl } from '@/lib/utils'
import { Plus, Pencil, Trash2, Package, Utensils, Clock, Sparkles, ImageIcon, Loader2 } from 'lucide-react'
import { useCurrency } from '@/contexts/currency'
import { formatFoodPrice } from '@/lib/utils'
import { MultiSearchableSelect } from '@/components/multi-searchable-select'

interface Category {
  id: number
  name: string
}

interface PackageItem {
  id: number
  name: string
  price: number
  pivot: { quantity: number }
  category?: { id: number; name: string } | null
}

interface FoodItem {
  id: number
  name: string
  description: string | null
  price: number
  price_usd?: number | null
  price_eur?: number | null
  new_price: number | null
  new_price_usd?: number | null
  new_price_eur?: number | null
  image: string | null
  cooking_time: number | null
  is_offer: boolean
  is_available: boolean
  ingredients: string | null
  category_id: number | null
  category?: { id: number; name: string } | null
  categories?: { id: number; name: string }[]
  package_items?: PackageItem[]
}

const ITEMS_PER_PAGE = 20

export default function MenuPage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const { currency } = useCurrency()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')

  const [activeTab, setActiveTab] = useState<'foods' | 'offers'>(tabParam === 'offers' ? 'offers' : 'foods')
  const [allFoods, setAllFoods] = useState<FoodItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [fetching, setFetching] = useState(true)
  const [foodPage, setFoodPage] = useState(1)
  const [offerPage, setOfferPage] = useState(1)
  const foodFileRef = useRef<HTMLInputElement>(null)
  const offerFileRef = useRef<HTMLInputElement>(null)
  const [submitting, setSubmitting] = useState<'food' | 'offer' | null>(null)

  useEffect(() => {
    if (tabParam === 'offers' || tabParam === 'foods') setActiveTab(tabParam)
  }, [tabParam])

  const [foodName, setFoodName] = useState('')
  const [foodDescription, setFoodDescription] = useState('')
  const [foodPrice, setFoodPrice] = useState('')
  const [foodPriceUsd, setFoodPriceUsd] = useState('')
  const [foodPriceEur, setFoodPriceEur] = useState('')
  const [foodNewPrice, setFoodNewPrice] = useState('')
  const [foodNewPriceUsd, setFoodNewPriceUsd] = useState('')
  const [foodNewPriceEur, setFoodNewPriceEur] = useState('')
  const [foodIngredients, setFoodIngredients] = useState('')
  const [foodCookingTime, setFoodCookingTime] = useState('')
  const [foodCategoryIds, setFoodCategoryIds] = useState<number[]>([])
  const [foodIsAvailable, setFoodIsAvailable] = useState(true)
  const [editingFoodId, setEditingFoodId] = useState<number | null>(null)
  const [foodImageFile, setFoodImageFile] = useState<File | null>(null)
  const [foodImagePreview, setFoodImagePreview] = useState<string | null>(null)

  const [offerName, setOfferName] = useState('')
  const [offerDescription, setOfferDescription] = useState('')
  const [offerPrice, setOfferPrice] = useState('')
  const [offerIsAvailable, setOfferIsAvailable] = useState(true)
  const [selectedFoodIds, setSelectedFoodIds] = useState<number[]>([])
  const [foodQuantities, setFoodQuantities] = useState<Record<number, number>>({})
  const [editingOfferId, setEditingOfferId] = useState<number | null>(null)
  const [offerImageFile, setOfferImageFile] = useState<File | null>(null)
  const [offerImagePreview, setOfferImagePreview] = useState<string | null>(null)

  const regularFoods = allFoods.filter(f => !f.is_offer)
  const offers = allFoods.filter(f => f.is_offer)

  const totalFoodPages = Math.max(1, Math.ceil(regularFoods.length / ITEMS_PER_PAGE))
  const totalOfferPages = Math.max(1, Math.ceil(offers.length / ITEMS_PER_PAGE))
  const paginatedFoods = regularFoods.slice((foodPage - 1) * ITEMS_PER_PAGE, foodPage * ITEMS_PER_PAGE)
  const paginatedOffers = offers.slice((offerPage - 1) * ITEMS_PER_PAGE, offerPage * ITEMS_PER_PAGE)

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return }
    if (!user) return
    Promise.all([
      api.get<{ data: FoodItem[] }>('/owner/foods'),
      api.get<{ data: Category[] }>('/owner/foods/categories'),
    ])
      .then(([fRes, cRes]) => {
        setAllFoods(fRes.data)
        setCategories(cRes.data)
      })
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [user, loading, router])

  function resetFoodForm() {
    setFoodName(''); setFoodDescription(''); setFoodPrice('')
    setFoodPriceUsd(''); setFoodPriceEur(''); setFoodNewPrice('')
    setFoodNewPriceUsd(''); setFoodNewPriceEur('')
    setFoodIngredients(''); setFoodCookingTime(''); setFoodCategoryIds([])
    setFoodIsAvailable(true); setFoodImageFile(null); setFoodImagePreview(null)
    setEditingFoodId(null)
    if (foodFileRef.current) foodFileRef.current.value = ''
  }

  function editFood(f: FoodItem) {
    setEditingFoodId(f.id)
    setFoodName(f.name); setFoodDescription(f.description || '')
    setFoodPrice(String(f.price))
    setFoodPriceUsd(f.price_usd != null ? String(f.price_usd) : '')
    setFoodPriceEur(f.price_eur != null ? String(f.price_eur) : '')
    setFoodNewPrice(f.new_price ? String(f.new_price) : '')
    setFoodNewPriceUsd(f.new_price_usd != null ? String(f.new_price_usd) : '')
    setFoodNewPriceEur(f.new_price_eur != null ? String(f.new_price_eur) : '')
    setFoodIngredients(f.ingredients || '')
    setFoodCookingTime(f.cooking_time ? String(f.cooking_time) : '')
    const cats = f.categories?.map(c => c.id) || (f.category_id ? [f.category_id] : [])
    console.log('editFood', { categories: f.categories, cats, category_id: f.category_id })
    setFoodCategoryIds(cats)
    setFoodIsAvailable(f.is_available ?? true)
    setFoodImageFile(null); setFoodImagePreview(null)
    if (foodFileRef.current) foodFileRef.current.value = ''
    setActiveTab('foods')
  }

  async function handleFoodSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting('food')
    try {
      const payload: Record<string, unknown> = {
        name: foodName, description: foodDescription || null,
        price: parseFloat(foodPrice),
        price_usd: foodPriceUsd ? parseFloat(foodPriceUsd) : null,
        price_eur: foodPriceEur ? parseFloat(foodPriceEur) : null,
        new_price: foodNewPrice ? parseFloat(foodNewPrice) : null,
        new_price_usd: foodNewPriceUsd ? parseFloat(foodNewPriceUsd) : null,
        new_price_eur: foodNewPriceEur ? parseFloat(foodNewPriceEur) : null,
        ingredients: foodIngredients || null,
        cooking_time: foodCookingTime ? parseInt(foodCookingTime) : null,
        category_ids: foodCategoryIds, is_available: foodIsAvailable,
      }
      let saved: FoodItem
      if (editingFoodId) {
        const res = await api.put<{ data: FoodItem }>(`/owner/foods/${editingFoodId}`, payload)
        saved = res.data
      } else {
        const res = await api.post<{ data: FoodItem }>('/owner/foods', payload)
        saved = res.data
      }
      if (foodImageFile) {
        const uploadRes = await api.upload<{ data: FoodItem }>(`/owner/foods/${saved.id}/image`, foodImageFile, 'image')
        saved = uploadRes.data
      }
      setAllFoods(prev => {
        const idx = prev.findIndex(f => f.id === saved.id)
        if (idx >= 0) { const n = [...prev]; n[idx] = saved; return n }
        return [...prev, saved]
      })
      resetFoodForm()
    } catch { /* ignore */ }
    setSubmitting(null)
  }

  async function deleteFood(id: number) {
    if (!confirm(t('delete_confirm'))) return
    try {
      await api.delete(`/owner/foods/${id}`)
      setAllFoods(prev => prev.filter(f => f.id !== id))
    } catch { /* ignore */ }
  }

  function resetOfferForm() {
    setOfferName(''); setOfferDescription(''); setOfferPrice('')
    setOfferIsAvailable(true); setSelectedFoodIds([]); setFoodQuantities({})
    setOfferImageFile(null); setOfferImagePreview(null); setEditingOfferId(null)
    if (offerFileRef.current) offerFileRef.current.value = ''
  }

  function editOffer(o: FoodItem) {
    setEditingOfferId(o.id)
    setOfferName(o.name); setOfferDescription(o.description || '')
    setOfferPrice(o.new_price ? String(o.new_price) : '')
    setOfferIsAvailable(o.is_available ?? true)
    const ids = o.package_items?.map(p => p.id) || []
    setSelectedFoodIds(ids)
    const qtyMap: Record<number, number> = {}
    o.package_items?.forEach(p => { qtyMap[p.id] = p.pivot.quantity })
    setFoodQuantities(qtyMap)
    setOfferImageFile(null); setOfferImagePreview(null)
    if (offerFileRef.current) offerFileRef.current.value = ''
    setActiveTab('offers')
  }

  function toggleFoodSelection(foodId: number) {
    setSelectedFoodIds(prev =>
      prev.includes(foodId) ? prev.filter(id => id !== foodId) : [...prev, foodId]
    )
    if (!(foodId in foodQuantities)) {
      setFoodQuantities(prev => ({ ...prev, [foodId]: 1 }))
    }
  }

  function setFoodQty(foodId: number, qty: number) {
    setFoodQuantities(prev => ({ ...prev, [foodId]: Math.max(1, qty) }))
  }

  async function handleOfferSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting('offer')
    try {
      const foodItems = selectedFoodIds.map(id => ({ id, quantity: foodQuantities[id] || 1 }))
      const payload: Record<string, unknown> = {
        name: offerName, description: offerDescription || null,
        new_price: offerPrice ? parseFloat(offerPrice) : null,
        is_offer: true, is_available: offerIsAvailable,
        food_items: foodItems, cooking_time: 20,
      }
      let saved: FoodItem
      if (editingOfferId) {
        const res = await api.put<{ data: FoodItem }>(`/owner/foods/${editingOfferId}`, payload)
        saved = res.data
      } else {
        const res = await api.post<{ data: FoodItem }>('/owner/foods', payload)
        saved = res.data
      }
      if (offerImageFile) {
        const uploadRes = await api.upload<{ data: FoodItem }>(`/owner/foods/${saved.id}/image`, offerImageFile, 'image')
        saved = uploadRes.data
      }
      setAllFoods(prev => {
        const idx = prev.findIndex(f => f.id === saved.id)
        if (idx >= 0) { const n = [...prev]; n[idx] = saved; return n }
        return [...prev, saved]
      })
      resetOfferForm()
    } catch { /* ignore */ }
    setSubmitting(null)
  }

  async function deleteOffer(id: number) {
    if (!confirm(t('delete_confirm'))) return
    try {
      await api.delete(`/owner/foods/${id}`)
      setAllFoods(prev => prev.filter(f => f.id !== id))
    } catch { /* ignore */ }
  }

  if (loading || fetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  const foodImgUrl = (f: FoodItem) => (f.image ? (getImageUrl(f.image) ?? '') : '')

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800 w-fit" role="tablist">
        <button role="tab" aria-selected={activeTab === 'foods'}
          onClick={() => { setActiveTab('foods'); setEditingFoodId(null) }}
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${
            activeTab === 'foods'
              ? 'bg-white text-orange-600 shadow-sm dark:bg-gray-700 dark:text-orange-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}>
          <Utensils className="h-4 w-4" />
          {t('foods')}
        </button>
        <button role="tab" aria-selected={activeTab === 'offers'}
          onClick={() => { setActiveTab('offers'); setEditingOfferId(null) }}
          className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all ${
            activeTab === 'offers'
              ? 'bg-white text-orange-600 shadow-sm dark:bg-gray-700 dark:text-orange-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}>
          <Package className="h-4 w-4" />
          {t('offers')}
        </button>
      </div>

      {activeTab === 'foods' && (
        <>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                {editingFoodId ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {editingFoodId ? t('edit_menu_item') : t('add_menu_item')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {editingFoodId ? 'Modifiez les détails du plat' : 'Ajoutez un nouveau plat à votre menu'}
                </p>
              </div>
            </div>
            <form onSubmit={handleFoodSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('name')} *</label>
                <input type="text" value={foodName} onChange={e => setFoodName(e.target.value)}
                  placeholder="Ex: Pizza Margherita"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800"
                  required />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('categories')}</label>
                <MultiSearchableSelect
                  key={String(foodCategoryIds)}
                  values={foodCategoryIds.map(String)}
                  onChange={vals => setFoodCategoryIds(vals.map(Number))}
                  options={categories.map(c => ({ value: String(c.id), label: c.name }))}
                  placeholder="Search categories..."
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('price')} *</label>
                <input type="number" value={foodPrice} onChange={e => setFoodPrice(e.target.value)}
                  placeholder="0" min="0" step="0.01"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800"
                  required />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('price_usd')}</label>
                <input type="number" value={foodPriceUsd} onChange={e => setFoodPriceUsd(e.target.value)}
                  placeholder="0" min="0" step="0.01"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('price_eur')}</label>
                <input type="number" value={foodPriceEur} onChange={e => setFoodPriceEur(e.target.value)}
                  placeholder="0" min="0" step="0.01"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('sale_price')} (DZD)</label>
                <input type="number" value={foodNewPrice} onChange={e => setFoodNewPrice(e.target.value)}
                  placeholder={t('sale_price')} min="0" step="0.01"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('sale_price')} (USD)</label>
                <input type="number" value={foodNewPriceUsd} onChange={e => setFoodNewPriceUsd(e.target.value)}
                  placeholder="0" min="0" step="0.01"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('sale_price')} (EUR)</label>
                <input type="number" value={foodNewPriceEur} onChange={e => setFoodNewPriceEur(e.target.value)}
                  placeholder="0" min="0" step="0.01"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('cooking_time')}</label>
                <input type="number" value={foodCookingTime} onChange={e => setFoodCookingTime(e.target.value)}
                  placeholder="30" min="1" max="300"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('image')}</label>
                <input ref={foodFileRef} type="file" accept="image/*" onChange={e => {
                  const file = e.target.files?.[0] || null
                  setFoodImageFile(file)
                  if (file) { const r = new FileReader(); r.onload = () => setFoodImagePreview(r.result as string); r.readAsDataURL(file) }
                  else { setFoodImagePreview(null) }
                }}
                  className="w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-orange-600 hover:file:bg-orange-100 dark:text-gray-400 dark:file:bg-orange-900/30 dark:file:text-orange-400 dark:hover:file:bg-orange-900/50" />
                {(foodImagePreview || (editingFoodId && regularFoods.find(f => f.id === editingFoodId)?.image)) && (
                  <div className="mt-3">
                    <img src={foodImagePreview || foodImgUrl(regularFoods.find(f => f.id === editingFoodId)!)} className="h-20 w-20 rounded-xl border border-gray-200 object-cover dark:border-gray-700" alt="" />
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('description')}</label>
                <textarea value={foodDescription} onChange={e => setFoodDescription(e.target.value)}
                  rows={2} placeholder={t('description')}
                  className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('ingredients')}</label>
                <textarea value={foodIngredients} onChange={e => setFoodIngredients(e.target.value)}
                  rows={2} placeholder="Tomate, mozzarella, basilic..."
                  className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800" />
              </div>
              <div className="md:col-span-2 flex items-center gap-3">
                <button type="button" onClick={() => setFoodIsAvailable(v => !v)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 ${
                    foodIsAvailable ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    foodIsAvailable ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
                <span className={`text-sm font-semibold ${foodIsAvailable ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>
                  {foodIsAvailable ? t('available') : t('unavailable')}
                </span>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={submitting === 'food'}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-orange-600 disabled:opacity-50 dark:bg-orange-600 dark:hover:bg-orange-500">
                  {submitting === 'food' ? <Loader2 className="h-4 w-4 animate-spin" /> : editingFoodId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {submitting === 'food' ? t('saving') : editingFoodId ? t('update') : t('add_menu_item')}
                </button>
                {editingFoodId && (
                  <button type="button" onClick={resetFoodForm}
                    className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
                    {t('cancel')}
                  </button>
                )}
              </div>
            </form>
          </div>

          {paginatedFoods.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedFoods.map(f => (
                <div key={f.id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
                  <div className="flex h-32 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                    {f.image ? (
                      <img src={foodImgUrl(f)} alt={f.name} className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">{f.name}</h4>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        f.is_available
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {f.is_available ? t('available_short') : t('unavailable_short')}
                      </span>
                    </div>
                    {f.categories && f.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {f.categories.map(cat => (
                          <span key={cat.id} className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">{cat.name}</span>
                        ))}
                      </div>
                    )}
                    <div className="mt-auto space-y-1">
                      <div className="flex items-baseline gap-1.5">
                        {(f.new_price ?? 0) > 0 ? (
                          <><span className="text-base font-bold text-orange-600 dark:text-orange-400">{formatFoodPrice(f, currency)}</span>
                            <span className="text-xs text-gray-400 line-through dark:text-gray-500">{formatFoodPrice(f, currency, { original: true })}</span></>
                        ) : (
                          <span className="text-base font-bold text-gray-900 dark:text-gray-100">{formatFoodPrice(f, currency)}</span>
                        )}
                      </div>
                      {f.cooking_time && (
                        <p className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                          <Clock className="h-3 w-3" /> {f.cooking_time} min
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 pt-3 opacity-0 transition-opacity group-hover:opacity-100">
                      <button onClick={() => editFood(f)}
                        className="flex-1 rounded-lg bg-orange-50 px-2.5 py-1.5 text-xs font-semibold text-orange-600 transition-colors hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30">
                        <Pencil className="mr-1 inline-block h-3 w-3" />{t('edit')}
                      </button>
                      <button onClick={() => deleteFood(f.id)}
                        className="flex-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30">
                        <Trash2 className="mr-1 inline-block h-3 w-3" />{t('delete')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center dark:border-gray-700">
              <Utensils className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="mt-4 text-sm font-bold text-gray-500 dark:text-gray-400">{t('no_foods_yet')}</p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{t('add_first_food_hint')}</p>
            </div>
          )}
          {totalFoodPages > 1 && (
            <div className="flex items-center justify-center gap-1.5">
              {Array.from({ length: totalFoodPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setFoodPage(p)}
                  className={`min-w-[2rem] rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    p === foodPage
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'offers' && (
        <>
          <div id="offers-section" className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                {editingOfferId ? <Pencil className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {editingOfferId ? t('edit_offer') : t('add_offer')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {editingOfferId ? 'Modifiez le package' : 'Créez un nouveau package promotionnel'}
                </p>
              </div>
            </div>
            <form onSubmit={handleOfferSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('offer_name')} *</label>
                  <input type="text" value={offerName} onChange={e => setOfferName(e.target.value)}
                    placeholder="Ex: Menu Familial"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800"
                    required />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('offer_price')} *</label>
                  <input type="number" value={offerPrice} onChange={e => setOfferPrice(e.target.value)}
                    placeholder={t('offer_price')} min="0" step="0.01"
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800"
                    required />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('description')}</label>
                <textarea value={offerDescription} onChange={e => setOfferDescription(e.target.value)}
                  rows={2} placeholder={t('description')}
                  className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-orange-500 dark:focus:ring-orange-800" />
              </div>
              <div>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('included_foods')}</label>
                {regularFoods.filter(f => f.is_available).length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {regularFoods.filter(f => f.is_available).map(f => {
                      const isSelected = selectedFoodIds.includes(f.id)
                      return (
                        <label key={f.id} onClick={() => toggleFoodSelection(f.id)}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3.5 transition-all ${
                            isSelected
                              ? 'border-orange-400 bg-orange-50 dark:border-orange-500 dark:bg-orange-900/20'
                              : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
                          }`}>
                          <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                            isSelected
                              ? 'border-orange-500 bg-orange-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {isSelected && (
                              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{f.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{Number(f.price).toFixed(0)} DA</p>
                          </div>
                          {isSelected && (
                            <div className="w-16 shrink-0">
                              <input type="number" value={foodQuantities[f.id] || 1}
                                onChange={e => { e.stopPropagation(); setFoodQty(f.id, parseInt(e.target.value) || 1) }}
                                onClick={e => e.stopPropagation()} min="1"
                                className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-center text-xs font-bold text-gray-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                              />
                            </div>
                          )}
                        </label>
                      )
                    })}
                  </div>
                ) : (
                  <p className="rounded-xl border-2 border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">{t('no_foods_available')}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('image')}</label>
                <input ref={offerFileRef} type="file" accept="image/*" onChange={e => {
                  const file = e.target.files?.[0] || null
                  setOfferImageFile(file)
                  if (file) { const r = new FileReader(); r.onload = () => setOfferImagePreview(r.result as string); r.readAsDataURL(file) }
                  else { setOfferImagePreview(null) }
                }}
                  className="w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-orange-600 hover:file:bg-orange-100 dark:text-gray-400 dark:file:bg-orange-900/30 dark:file:text-orange-400 dark:hover:file:bg-orange-900/50" />
                {(offerImagePreview || (editingOfferId && offers.find(o => o.id === editingOfferId)?.image)) && (
                  <div className="mt-3">
                    <img src={offerImagePreview || foodImgUrl(offers.find(o => o.id === editingOfferId)!)} className="h-20 w-20 rounded-xl border border-gray-200 object-cover dark:border-gray-700" alt="" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setOfferIsAvailable(v => !v)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 ${
                    offerIsAvailable ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    offerIsAvailable ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
                <span className={`text-sm font-semibold ${offerIsAvailable ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>
                  {offerIsAvailable ? t('available') : t('unavailable')}
                </span>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={submitting === 'offer' || selectedFoodIds.length === 0}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-orange-600 disabled:opacity-50 dark:bg-orange-600 dark:hover:bg-orange-500">
                  {submitting === 'offer' ? <Loader2 className="h-4 w-4 animate-spin" /> : editingOfferId ? <Pencil className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  {submitting === 'offer' ? t('saving') : editingOfferId ? t('update') : t('add_offer')}
                </button>
                {editingOfferId && (
                  <button type="button" onClick={resetOfferForm}
                    className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
                    {t('cancel')}
                  </button>
                )}
              </div>
            </form>
          </div>

          {paginatedOffers.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedOffers.map(o => (
                <div key={o.id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
                  <div className="h-1.5 bg-gradient-to-r from-orange-400 to-rose-400" />
                  <div className="space-y-3 p-4">
                    {o.image && (
                      <img src={foodImgUrl(o)} alt={o.name} className="h-24 w-full rounded-xl object-cover" />
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">{o.name}</h4>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        o.is_available
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {o.is_available ? t('active') : t('inactive')}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{Number(o.new_price || o.price).toFixed(0)} DA</span>
                      {o.new_price && <span className="text-sm text-gray-400 line-through dark:text-gray-500">{Number(o.price).toFixed(0)}</span>}
                    </div>
                    {o.package_items && o.package_items.length > 0 && (
                      <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Package className="h-3 w-3" />
                        {t('includes')}: {o.package_items.slice(0, 3).map(p => `${p.name} x${p.pivot.quantity}`).join(', ')}{o.package_items.length > 3 ? '…' : ''}
                      </p>
                    )}
                    <div className="flex gap-2 pt-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button onClick={() => editOffer(o)}
                        className="flex-1 rounded-lg bg-orange-50 px-2.5 py-1.5 text-xs font-semibold text-orange-600 transition-colors hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30">
                        <Pencil className="mr-1 inline-block h-3 w-3" />{t('edit')}
                      </button>
                      <button onClick={() => deleteOffer(o.id)}
                        className="flex-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30">
                        <Trash2 className="mr-1 inline-block h-3 w-3" />{t('delete')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center dark:border-gray-700">
              <Package className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="mt-4 text-sm font-bold text-gray-500 dark:text-gray-400">{t('no_offers')}</p>
            </div>
          )}
          {totalOfferPages > 1 && (
            <div className="flex items-center justify-center gap-1.5">
              {Array.from({ length: totalOfferPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setOfferPage(p)}
                  className={`min-w-[2rem] rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    p === offerPage
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
