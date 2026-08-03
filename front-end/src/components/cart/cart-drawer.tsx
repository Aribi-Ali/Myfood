'use client'

import { type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth'
import { useCart, useCheckout, CheckoutProvider } from '@/contexts/cart'
import { useLanguage } from '@/contexts/language'
import { Modal } from '@/components/modal'

export function CartDrawer({ storeId }: { storeId?: number | null }) {
  return (
    <CheckoutProvider>
      <CartDrawerInner storeId={storeId} />
    </CheckoutProvider>
  )
}

function CartDrawerInner({ storeId }: { storeId?: number | null }) {
  const router = useRouter()
  const { t } = useLanguage()
  const { user } = useAuth()
  const {
    items, cartTotal, cartQuantity, cartOpen, setCartOpen,
    updateQuantity, removeFromCart,
  } = useCart()
  const {
    checkoutOpen, setCheckoutOpen, deliveryType, setDeliveryType,
    promoCode, setPromoCode, promoDiscount, promoLoading, promoError, applyPromo,
    phone, setPhone, address, setAddress, wilaya, setWilaya, daira, setDaira, commune, setCommune, notes, setNotes,
    scheduledAt, setScheduledAt,
    placingOrder, orderError, orderSuccess, placeOrder,
  } = useCheckout()

  const handlePlaceOrder = (e: FormEvent) => {
    e.preventDefault()
    if (storeId) placeOrder(storeId)
  }

  return (
    <>
      {/* Floating Cart Button */}
      {items.length > 0 && (
        <div className="fixed bottom-6 ltr:right-6 rtl:left-6 z-40">
          <button onClick={() => setCartOpen(true)}
            className="flex items-center gap-3 font-bold px-6 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 bg-amber-600 hover:bg-amber-700 text-white active:scale-95">
            <span className="text-lg">🛒</span>
            <span className="px-2 py-0.5 rounded-lg text-xs font-extrabold bg-white/20">{cartQuantity}</span>
            <span className="text-sm font-bold">{Math.round(cartTotal)} DA</span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <div className={`fixed inset-0 overflow-hidden z-50 transition-opacity duration-300 ${cartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} role="dialog" aria-modal="true">
        <div className="absolute inset-0 overflow-hidden">
          <div onClick={() => setCartOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />
          <div className="pointer-events-none fixed inset-y-0 ltr:right-0 rtl:left-0 flex max-w-full ltr:ps-10 rtl:pe-10">
            <div className={`pointer-events-auto w-screen max-w-md transition-transform duration-300 ease-out ${cartOpen ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full'}`}>
              <div className="flex h-full flex-col bg-white shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700">{t('your_cart')}</h2>
                  <button onClick={() => setCartOpen(false)} className="text-xl text-stone-400 hover:text-stone-600 transition p-1">&times;</button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                  {items.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-5xl mb-4">🛒</div>
                      <p className="text-xs font-bold uppercase tracking-widest text-stone-400">{t('cart_empty')}</p>
                    </div>
                  ) : (
                    items.map((item) => {
                      const price = item.food.new_price ?? item.food.price
                      return (
                        <div key={item.food.id} className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 bg-stone-50/50">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-stone-800 truncate">{item.food.name}</p>
                            <p className="text-xs font-bold text-amber-700 mt-0.5">{Math.round(price)} DA</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => updateQuantity(item.food.id, -1)}
                              className="w-8 h-8 rounded-xl border border-stone-200 flex items-center justify-center font-bold text-stone-500 hover:bg-stone-100 transition text-sm">−</button>
                            <span className="w-6 text-center text-sm font-bold text-stone-800">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.food.id, 1)}
                              className="w-8 h-8 rounded-xl border border-stone-200 flex items-center justify-center font-bold text-stone-500 hover:bg-stone-100 transition text-sm">+</button>
                          </div>
                          <button onClick={() => removeFromCart(item.food.id)} className="text-sm text-stone-400 hover:text-red-500 transition ltr:ml-1 rtl:mr-1">✕</button>
                        </div>
                      )
                    })
                  )}
                </div>

                <div className="border-t border-stone-200 px-6 py-5 bg-stone-50 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-stone-700 uppercase tracking-wider">{t('total')}</span>
                    <span className="text-lg font-extrabold text-stone-800">{Math.round(cartTotal - promoDiscount)} DA</span>
                  </div>

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-xs font-bold text-emerald-600">
                      <span>{t('discount')}</span><span>-{Math.round(promoDiscount)} DA</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder={t('promo_code')}
                      className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-white" />
                    <button onClick={applyPromo} disabled={promoLoading}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white font-bold text-xs transition uppercase tracking-wider">
                      {promoLoading ? '...' : t('apply')}</button>
                  </div>
                  {promoError && <p className="text-xs font-bold text-red-500">{promoError}</p>}

                  <div className="flex gap-2">
                    <button onClick={() => setDeliveryType('delivery')}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition ${
                        deliveryType === 'delivery' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-stone-500 border-stone-200'
                      }`}>{t('delivery')}</button>
                    <button onClick={() => setDeliveryType('pickup')}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition ${
                        deliveryType === 'pickup' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-stone-500 border-stone-200'
                      }`}>{t('pickup')}</button>
                  </div>

                  <button onClick={() => { if (!user) { router.push('/login'); return }; setCheckoutOpen(true) }}
                    disabled={items.length === 0}
                    className="w-full py-3.5 rounded-xl bg-stone-800 hover:bg-stone-900 disabled:bg-stone-300 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm disabled:cursor-not-allowed">
                    {t('checkout')}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} title={t('checkout')} className="max-w-lg max-h-[85vh]">
        <form onSubmit={handlePlaceOrder} className="p-6 space-y-4">
          {orderSuccess && <div className="p-4 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-200">{orderSuccess}</div>}
          {orderError && <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-bold border border-red-200">{orderError}</div>}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-stone-500">{t('phone')} *</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required
              className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-stone-50" />
          </div>

          {deliveryType === 'delivery' && (
            <>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-stone-500">{t('address')} *</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required
                  className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-stone-50" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(['Wilaya', 'Daira', 'Commune'] as const).map((key) => {
                  const label = t(key === 'Wilaya' ? 'wilaya' : key === 'Daira' ? 'daira' : 'commune')
                  const val = key === 'Wilaya' ? wilaya : key === 'Daira' ? daira : commune
                  const set = key === 'Wilaya' ? setWilaya : key === 'Daira' ? setDaira : setCommune
                  return (
                    <div key={key}>
                      <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-stone-500">{label}</label>
                      <input type="text" value={val} onChange={(e) => set(e.target.value)}
                        className="w-full px-3 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-stone-50" />
                    </div>
                  )
                })}
              </div>
            </>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-stone-500">{t('notes')}</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-stone-50 resize-none" />
          </div>

          {/* Pre-order date/time */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5 text-stone-500">
              {t('schedule_order')}
            </label>
            <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)}
              min={new Date(Date.now() + 3600000).toISOString().slice(0, 16)}
              className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 bg-stone-50" />
          </div>

          <div className="rounded-xl bg-stone-50 p-4 border border-stone-200 space-y-2">
            <div className="flex justify-between text-sm text-stone-600">
              <span>{t('tracking_items_title')}</span><span className="font-bold text-stone-800">{cartQuantity}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-stone-200 pt-2 mt-2">
              <span className="text-stone-700">{t('total')}</span>
              <span className="text-amber-700">{Math.round(cartTotal - promoDiscount)} DA</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setCheckoutOpen(false)}
              className="flex-1 py-3.5 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs uppercase tracking-wider hover:bg-stone-50 transition">
              {t('cancel')}</button>
            <button type="submit" disabled={placingOrder}
              className="flex-1 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm disabled:cursor-not-allowed">
              {placingOrder ? t('placing_order') : t('order_now')}</button>
          </div>
        </form>
      </Modal>

      {orderSuccess && !checkoutOpen && (
        <div className="fixed bottom-20 right-6 z-50 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-xl">
          ✅ {orderSuccess}
        </div>
      )}
    </>
  )
}
