// front-end/src/components/builder/blocks/blocks.ts
// 16 GrapesJS custom block definitions for store pages

import type { BlockProperties } from 'grapesjs'
import { esc } from '@/lib/utils'
import type { StoreData } from '@/types/api'

type BlockDef = {
  id: string
  label: string
  category?: string
  content: string | ((store: StoreData) => string)
  media?: string
}

function storageOrigin(): string {
  if (typeof window !== 'undefined') return window.location.origin
  const url = process.env.NEXT_PUBLIC_API_URL || '/api/v1'
  if (url.startsWith('http')) try { return new URL(url).origin } catch { /* fall through */ }
  return 'http://localhost:3000'
}

function imgTag(store: StoreData, field: 'logo' | 'cover'): string {
  const path = field === 'logo' ? store.logo : store.cover
  if (!path) return ''
  const src = path.startsWith('http') ? path : `${storageOrigin()}/storage/${path}`
  return `src="${esc(src)}"`
}

function wrapSection(inner: string, extraClass = ''): string {
  return `<div class="pb-section${extraClass ? ' ' + extraClass : ''}" style="position:relative;">${inner}</div>`
}

export const BLOCK_DEFINITIONS: BlockDef[] = [

  // ── Hero Section ──
{
    id: 'store-hero',
    label: 'Hero',
    category: 'Header',
    content: (s) => wrapSection(`
      <div style="background:linear-gradient(135deg,var(--color-primary),var(--color-accent));color:#fff;padding:100px 40px 80px;text-align:center;">
        ${s.logo ? `<img ${imgTag(s, 'logo')} alt="${esc(s.name)}" style="height:80px;margin-bottom:1.5rem;display:inline-block;" />` : ''}
        <h1 style="font-family:var(--font-display);font-size:3.5rem;margin:0 0 1rem;letter-spacing:var(--letter-spacing-base);">${esc(s.name)}</h1>
        <p style="font-size:1.2rem;max-width:600px;margin:0 auto 2rem;opacity:.9;line-height:var(--line-height-base);">${esc(s.description || 'Fresh ingredients. Authentic taste.')}</p>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
          <a href="#" class="pb-btn pb-btn-primary" style="padding:var(--btn-padding-y) var(--btn-padding-x);border-radius:var(--btn-radius);font-weight:var(--btn-font-weight);text-decoration:none;">Order Now</a>
          <a href="#" class="pb-btn pb-btn-outline" style="padding:var(--btn-padding-y) var(--btn-padding-x);border-radius:var(--btn-radius);border:2px solid #fff;color:#fff;font-weight:var(--btn-font-weight);text-decoration:none;">View Menu</a>
        </div>
      </div>`),
  },

  // ── Food Grid (Dynamic) ──
  {
    id: 'food-grid',
    label: 'Food Grid',
    category: 'Menu',
    content: (s) => {
      const hasFoods = (s.foods || []).length > 0
      return wrapSection(`
      <div data-pb-block="food-grid" data-config='${esc(JSON.stringify({ title: 'Our Menu', maxItems: 6, showAddToCart: true, columns: 2, showCategoryFilter: true, showPrices: true, showDescriptions: true, showCookingTime: true, style: 'grid' }))}'
        style="padding:60px 40px;background:var(--color-surface);text-align:center;border:2px dashed var(--color-primary);border-radius:var(--radius-md);">
        <div style="font-size:2.5rem;margin-bottom:8px;">${hasFoods ? '🍕' : '🍽️'}</div>
        <div style="font-weight:700;font-size:1.2rem;color:var(--color-text-primary);">Food Grid</div>
        <div style="font-size:.8rem;color:var(--color-text-muted);margin-top:4px;">${hasFoods ? (s.foods || []).length + ' items available' : 'Connect store data'}</div>
      </div>`)
    },
  },

  // ── Category Grid (Dynamic) ──
  {
    id: 'category-grid',
    label: 'Categories',
    category: 'Menu',
    content: (s) => {
      const hasCats = (s.foods || []).some(f => f.category)
      return wrapSection(`
      <div data-pb-block="category-grid" data-config='${esc(JSON.stringify({ title: 'Categories', showCount: true, style: 'pills' }))}'
        style="padding:60px 40px;background:var(--color-background);text-align:center;border:2px dashed var(--color-primary);border-radius:var(--radius-md);">
        <div style="font-size:2.5rem;margin-bottom:8px;">📂</div>
        <div style="font-weight:700;font-size:1.2rem;color:var(--color-text-primary);">Category Grid</div>
        <div style="font-size:.8rem;color:var(--color-text-muted);margin-top:4px;">${hasCats ? 'Categories available' : 'Add categories to your menu'}</div>
      </div>`)
    },
  },

  // ── Offer Grid (Dynamic) ──
  {
    id: 'offer-grid',
    label: 'Offer Grid',
    category: 'Offers',
    content: (s) => {
      const hasOffers = (s.foods || []).some(f => f.is_offer)
      return wrapSection(`
      <div data-pb-block="offer-grid" data-config='${esc(JSON.stringify({ title: 'Hot Offers', subtitle: 'Don\'t miss out on these deals!', maxItems: 6, showOriginalPrice: true }))}'
        style="padding:60px 40px;background:linear-gradient(135deg,var(--color-secondary),var(--color-accent));text-align:center;border:2px dashed rgba(255,255,255,.4);border-radius:var(--radius-md);color:#fff;">
        <div style="font-size:2.5rem;margin-bottom:8px;">🔥</div>
        <div style="font-weight:700;font-size:1.2rem;">Offer Grid</div>
        <div style="font-size:.8rem;opacity:.7;margin-top:4px;">${hasOffers ? 'Active offers available' : 'No current offers'}</div>
      </div>`)
    },
  },

  // ── Promo Banner ──
  {
    id: 'promo-banner',
    label: 'Promo Banner',
    category: 'Marketing',
    content: wrapSection(`
      <div style="padding:80px 40px;background:linear-gradient(135deg,var(--color-primary),var(--color-accent));text-align:center;color:#fff;">
        <span style="background:rgba(255,255,255,.2);padding:4px 14px;border-radius:var(--radius-full);font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Limited Offer</span>
        <h2 style="font-size:2.5rem;margin:.75rem 0;font-family:var(--font-display);">Get 20% Off Your First Order</h2>
        <p style="max-width:500px;margin:0 auto 2rem;opacity:.9;">Use code <strong style="background:rgba(0,0,0,.3);padding:4px 12px;border-radius:4px;">WELCOME20</strong> at checkout</p>
        <a href="#" class="pb-btn" style="background:#fff;color:var(--color-primary);padding:var(--btn-padding-y) var(--btn-padding-x);border-radius:var(--btn-radius);font-weight:var(--btn-font-weight);text-decoration:none;">Order Now</a>
      </div>`),
  },

  // ── Reservation Form (Dynamic) ──
  {
    id: 'reservation-form',
    label: 'Reservation',
    category: 'Reservation',
    content: (s) => wrapSection(`
      <div data-pb-block="reservation-form" data-config='${esc(JSON.stringify({ title: 'Make a Reservation', subtitle: 'Book your table', showDate: true, showTime: true, showGuests: true, showName: true, showPhone: true }))}'
        style="padding:60px 40px;background:var(--color-surface);text-align:center;border:2px dashed var(--color-primary);border-radius:var(--radius-md);">
        <div style="font-size:2.5rem;margin-bottom:8px;">📅</div>
        <div style="font-weight:700;font-size:1.2rem;color:var(--color-text-primary);">Reservation Form</div>
        <div style="font-size:.8rem;color:var(--color-text-muted);margin-top:4px;">Book a table at ${esc(s.name)}</div>
      </div>`),
  },

  // ── Working Hours ──
  {
    id: 'working-hours',
    label: 'Working Hours',
    category: 'Info',
    content: (s) => {
      const hours = s.opening_hours || {}
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
      return wrapSection(`
      <div style="padding:60px 40px;background:var(--color-background);">
        <h2 style="text-align:center;font-size:2rem;margin-bottom:2rem;color:var(--color-text-primary);font-family:var(--font-display);">Opening Hours</h2>
        <div style="max-width:500px;margin:0 auto;background:var(--color-surface);border-radius:var(--radius-lg);padding:2rem;box-shadow:var(--shadow-md);">
          ${days.map((d) => {
            const day = hours[d] || hours[d.charAt(0).toUpperCase() + d.slice(1)]
            return `
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--color-border);">
              <span style="font-weight:600;color:var(--color-text-primary);text-transform:capitalize;">${d}</span>
              <span style="color:var(--color-text-secondary);">${day ? `${day.open} - ${day.close}` : 'Closed'}</span>
            </div>`
          }).join('')}
        </div>
      </div>`)
    },
  },

  // ── Gallery ──
  {
    id: 'gallery',
    label: 'Gallery',
    category: 'Media',
    content: (s) => {
      const images = (s.foods || []).filter(f => f.image).slice(0, 6)
      return wrapSection(`
      <div style="padding:60px 40px;background:var(--color-surface);">
        <h2 style="text-align:center;font-size:2rem;margin-bottom:2rem;color:var(--color-text-primary);font-family:var(--font-display);">Gallery</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;max-width:1000px;margin:0 auto;">
          ${images.length ? images.map((f) => `
            <div style="border-radius:var(--radius-md);overflow:hidden;aspect-ratio:1;box-shadow:var(--shadow-sm);">
              <img src="${esc(f.image!)}" alt="${esc(f.name)}" style="width:100%;height:100%;object-fit:cover;display:block;" />
            </div>`).join('') : Array.from({ length: 6 }).map(() => `
            <div style="border-radius:var(--radius-md);overflow:hidden;aspect-ratio:1;background:var(--color-background);display:flex;align-items:center;justify-content:center;color:var(--color-text-muted);font-size:.85rem;">
              📷 Photo
            </div>`).join('')}
        </div>
      </div>`)
    },
  },

  // ── Testimonials / Reviews ──
  {
    id: 'testimonials',
    label: 'Testimonials',
    category: 'Reviews',
    content: (s) => {
      const reviews = s.reviews || []
      return wrapSection(`
      <div style="padding:60px 40px;background:var(--color-background);text-align:center;">
        <h2 style="font-size:2rem;margin-bottom:.5rem;color:var(--color-text-primary);font-family:var(--font-display);">What Our Customers Say</h2>
        <p style="color:var(--color-text-muted);margin-bottom:2rem;">Real reviews from real people</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem;max-width:1100px;margin:0 auto;">
          ${reviews.slice(0, 3).length ? reviews.slice(0, 3).map((r) => `
            <div style="background:var(--color-surface);border-radius:var(--radius-md);padding:1.5rem;box-shadow:var(--shadow-sm);text-align:left;">
              <div style="color:var(--color-warning);font-size:1.2rem;margin-bottom:.5rem;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
              <p style="color:var(--color-text-secondary);font-style:italic;">&ldquo;${esc(r.comment || 'Amazing experience!')}&rdquo;</p>
              <div style="display:flex;align-items:center;gap:.75rem;margin-top:1rem;">
                <div style="width:36px;height:36px;border-radius:50%;background:var(--color-primary);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:.85rem;">${esc(r.user.charAt(0).toUpperCase())}</div>
                <strong style="color:var(--color-text-primary);">${esc(r.user)}</strong>
              </div>
            </div>`).join('') : '<p style="color:var(--color-text-muted);grid-column:1/-1;">No reviews yet</p>'}
        </div>
      </div>`)
    },
  },

  // ── Reviews Summary ──
  {
    id: 'reviews-summary',
    label: 'Review Summary',
    category: 'Reviews',
    content: (s) => {
      const avg = s.avg_rating || 0
      const count = (s.reviews || []).length
      return wrapSection(`
      <div style="padding:60px 40px;background:var(--color-surface);">
        <div style="display:flex;gap:2rem;align-items:center;justify-content:center;max-width:600px;margin:0 auto;flex-wrap:wrap;">
          <div style="text-align:center;">
            <div style="font-size:3.5rem;font-weight:900;color:var(--color-primary);font-family:var(--font-display);">${avg.toFixed(1)}</div>
            <div style="color:var(--color-warning);font-size:1.5rem;">${'★'.repeat(Math.round(avg))}${'☆'.repeat(5 - Math.round(avg))}</div>
            <div style="color:var(--color-text-muted);font-size:.85rem;">${count} review${count !== 1 ? 's' : ''}</div>
          </div>
          <div style="flex:1;min-width:180px;">
            ${[5, 4, 3, 2, 1].map((star) => {
              const p = star <= Math.round(avg) ? 80 : 20
              return `
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                <span style="font-size:.85rem;color:var(--color-text-muted);min-width:40px;">${star} ★</span>
                <div style="flex:1;height:8px;background:var(--color-background);border-radius:var(--radius-full);overflow:hidden;">
                  <div style="width:${p}%;height:100%;background:var(--color-warning);border-radius:var(--radius-full);"></div>
                </div>
              </div>`
            }).join('')}
          </div>
        </div>
      </div>`)
    },
  },

  // ── Map ──
  {
    id: 'map-block',
    label: 'Map',
    category: 'Location',
    content: (s) => wrapSection(`
      <div style="padding:60px 40px;background:var(--color-background);">
        <h2 style="text-align:center;font-size:2rem;margin-bottom:1.5rem;color:var(--color-text-primary);font-family:var(--font-display);">Find Us</h2>
        <div style="max-width:800px;margin:0 auto;border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-md);">
          <div style="width:100%;height:400px;background:var(--color-surface);display:flex;align-items:center;justify-content:center;">
            <iframe width="100%" height="100%" style="border:0;" loading="lazy"
              src="https://www.google.com/maps?q=${encodeURIComponent(s.address || s.name || '')}&output=embed">
            </iframe>
          </div>
          <div style="background:var(--color-surface);padding:1rem;text-align:center;border-top:1px solid var(--color-border);">
            <p style="color:var(--color-text-primary);margin:0;">${esc(s.address || '123 Main Street')}</p>
          </div>
        </div>
      </div>`),
  },

  // ── Contact Info ──
  {
    id: 'contact-info',
    label: 'Contact',
    category: 'Contact',
    content: (s) => wrapSection(`
      <div style="padding:60px 40px;background:var(--color-surface);">
        <h2 style="text-align:center;font-size:2rem;margin-bottom:2rem;color:var(--color-text-primary);font-family:var(--font-display);">Contact Us</h2>
        <div style="display:flex;gap:2rem;justify-content:center;flex-wrap:wrap;max-width:800px;margin:0 auto;">
          ${[
            { icon: '📞', label: 'Phone', value: s.phone || '+213 XXX XXX XXX' },
            { icon: '✉️', label: 'Email', value: s.email || 'info@example.com' },
            { icon: '📍', label: 'Address', value: s.address || '123 Main Street' },
          ].map((item) => `
            <div style="background:var(--color-background);border-radius:var(--radius-md);padding:1.5rem;text-align:center;flex:1;min-width:180px;box-shadow:var(--shadow-sm);">
              <div style="font-size:2rem;margin-bottom:.5rem;">${item.icon}</div>
              <div style="font-weight:600;color:var(--color-text-primary);">${esc(item.value)}</div>
              <div style="font-size:.8rem;color:var(--color-text-muted);margin-top:4px;">${item.label}</div>
            </div>`).join('')}
        </div>
      </div>`),
  },

  // ── Social Links ──
  {
    id: 'social-links',
    label: 'Social Links',
    category: 'Social',
    content: wrapSection(`
      <div style="padding:40px;background:var(--color-background);text-align:center;">
        <h3 style="font-size:1.2rem;margin-bottom:1rem;color:var(--color-text-primary);font-family:var(--font-display);">Follow Us</h3>
        <div style="display:flex;gap:.75rem;justify-content:center;">
          ${['Facebook', 'Instagram', 'Twitter', 'TikTok'].map((name) => `
            <a href="#" style="display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:var(--radius-full);background:var(--color-surface);color:var(--color-text-primary);text-decoration:none;box-shadow:var(--shadow-sm);border:1px solid var(--color-border);font-size:.8rem;font-weight:600;" title="${name}">
              ${name.charAt(0)}
            </a>`).join('')}
        </div>
      </div>`),
  },

  // ── FAQ Section ──
  {
    id: 'faq',
    label: 'FAQ',
    category: 'Help',
    content: wrapSection(`
      <div style="padding:60px 40px;background:var(--color-surface);">
        <h2 style="text-align:center;font-size:2rem;margin-bottom:2rem;color:var(--color-text-primary);font-family:var(--font-display);">Frequently Asked Questions</h2>
        <div style="max-width:700px;margin:0 auto;display:flex;flex-direction:column;gap:1rem;">
          ${[
            { q: 'What are your opening hours?', a: 'We are open Monday to Sunday, 10:00 AM to 10:00 PM.' },
            { q: 'Do you offer delivery?', a: 'Yes, we deliver within a 5km radius. Minimum order 500 DA.' },
            { q: 'Can I make a reservation?', a: 'Absolutely! Use the reservation form above or call us.' },
          ].map((faq) => `
            <details style="background:var(--color-background);border-radius:var(--radius-md);padding:1rem 1.25rem;box-shadow:var(--shadow-sm);border:1px solid var(--color-border);">
              <summary style="font-weight:600;color:var(--color-text-primary);cursor:pointer;">${esc(faq.q)}</summary>
              <p style="margin-top:.75rem;color:var(--color-text-secondary);line-height:var(--line-height-base);">${esc(faq.a)}</p>
            </details>`).join('')}
        </div>
      </div>`),
  },

  // ── Newsletter Subscription ──
  {
    id: 'newsletter',
    label: 'Newsletter',
    category: 'Marketing',
    content: wrapSection(`
      <div style="padding:80px 40px;background:linear-gradient(135deg,var(--color-primary),var(--color-secondary));color:#fff;text-align:center;">
        <h2 style="font-size:2rem;margin:0 0 .5rem;font-family:var(--font-display);">Stay in the Loop</h2>
        <p style="opacity:.9;margin-bottom:2rem;max-width:450px;margin-left:auto;margin-right:auto;">Get exclusive offers and updates delivered to your inbox.</p>
        <form style="display:flex;gap:.5rem;max-width:450px;margin:0 auto;" onsubmit="event.preventDefault();">
          <input type="email" placeholder="Your email address" required
            style="flex:1;padding:12px 16px;border:none;border-radius:var(--radius-sm);font-size:1rem;" />
          <button type="submit" style="background:var(--color-accent);color:#fff;padding:12px 24px;border:none;border-radius:var(--radius-sm);font-weight:var(--btn-font-weight);cursor:pointer;">
            Subscribe
          </button>
        </form>
      </div>`),
  },

  // ── Footer ──
  {
    id: 'footer',
    label: 'Footer',
    category: 'Layout',
    content: (s) => wrapSection(`
      <footer style="background:var(--color-background-dark, #1a1a1a);color:var(--color-text-primary-dark, #ccc);padding:40px;text-align:center;">
        ${s.logo ? `<img ${imgTag(s, 'logo')} alt="${esc(s.name)}" style="height:40px;margin-bottom:1rem;display:inline-block;" />` : `<strong style="font-size:1.2rem;font-family:var(--font-display);">${esc(s.name)}</strong>`}
        <p style="margin:.5rem 0;color:var(--color-text-muted);">${esc(s.address || '')}${s.phone ? ` · ${esc(s.phone)}` : ''}</p>
        <div style="display:flex;gap:1rem;justify-content:center;margin:1rem 0;">
          <a href="#" style="color:var(--color-text-muted);text-decoration:none;">About</a>
          <a href="#" style="color:var(--color-text-muted);text-decoration:none;">Menu</a>
          <a href="#" style="color:var(--color-text-muted);text-decoration:none;">Contact</a>
          <a href="#" style="color:var(--color-text-muted);text-decoration:none;">Privacy</a>
        </div>
        <p style="margin-top:1rem;font-size:.8rem;opacity:.5;">&copy; ${new Date().getFullYear()} ${esc(s.name)}. All rights reserved.</p>
      </footer>`),
  },

  // ── Two Columns ──
  {
    id: 'two-columns',
    label: 'Two Columns',
    category: 'Layout',
    content: '<div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;padding:2rem;max-width:1100px;margin:0 auto;"><div style="background:var(--color-background);border-radius:var(--radius-md);padding:2rem;min-height:100px;"></div><div style="background:var(--color-background);border-radius:var(--radius-md);padding:2rem;min-height:100px;"></div></div>',
  },

  // ── Three Columns ──
  {
    id: 'three-columns',
    label: 'Three Columns',
    category: 'Layout',
    content: '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.5rem;padding:2rem;max-width:1100px;margin:0 auto;"><div style="background:var(--color-background);border-radius:var(--radius-md);padding:1.5rem;min-height:80px;"></div><div style="background:var(--color-background);border-radius:var(--radius-md);padding:1.5rem;min-height:80px;"></div><div style="background:var(--color-background);border-radius:var(--radius-md);padding:1.5rem;min-height:80px;"></div></div>',
  },

  // ── Spacer ──
  {
    id: 'spacer',
    label: 'Spacer',
    category: 'Layout',
    content: '<div style="height:60px;"></div>',
  },

  // ── Text Block ──
    {
      id: 'text-block',
      label: 'Text Block',
      category: 'Layout',
      content: '<div style="padding:40px;max-width:800px;margin:0 auto;color:var(--color-text-primary);"><h2 style="font-family:var(--font-display);">Section Title</h2><p style="line-height:var(--line-height-base);color:var(--color-text-secondary);">Add your content here. Drag and drop to rearrange.</p></div>',
  },

  // ── Image ──
    {
      id: 'image-block',
      label: 'Image',
      category: 'Layout',
      content: '<div style="padding:40px;text-align:center;"><img src="https://placehold.co/800x400/EEE/999?text=Your+Image" alt="Image" style="max-width:100%;border-radius:var(--radius-md);box-shadow:var(--shadow-md);" /></div>',
  },

  // ── Button ──
    {
      id: 'button-block',
      label: 'Button',
      category: 'Layout',
      content: '<div style="padding:40px;text-align:center;"><a href="#" class="pb-btn pb-btn-primary" style="display:inline-block;background:var(--color-primary);color:#fff;padding:var(--btn-padding-y) var(--btn-padding-x);border-radius:var(--btn-radius);font-weight:var(--btn-font-weight);text-decoration:none;transition:var(--btn-transition);">Click Here</a></div>',
  },

  // ── Divider ──
    {
      id: 'divider',
      label: 'Divider',
      category: 'Layout',
      content: '<div style="padding:20px 40px;"><hr style="border:none;border-top:1px solid var(--color-border);margin:0;" /></div>',
  },

  // ── Brand Story / About Us (luxury split panel) ──
  {
    id: 'brand-story',
    label: 'Brand Story',
    category: 'About',
    content: (s) => wrapSection(`
      <div style="background:#0E0E0E;padding:80px 40px;">
        <div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;">
          <div style="position:relative;overflow:hidden;">
            <img src="https://picsum.photos/seed/${esc(s.alias)}-story/800/1000" alt="" style="width:100%;height:400px;object-fit:cover;" />
            <div style="position:absolute;inset:0;border:1px solid rgba(201,168,76,0.2);pointer-events:none;"></div>
          </div>
          <div>
            <span style="color:#C9A84C;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-weight:500;">Heritage</span>
            <h2 style="font-family:Georgia,serif;font-size:36px;font-weight:700;color:#F5F0EB;margin:16px 0 20px;line-height:1.2;">Crafting Excellence Since Day One</h2>
            <p style="color:#A89E8E;font-size:15px;line-height:1.7;margin-bottom:24px;">Every creation at ${esc(s.name)} is born from a passion for perfection. We source only the finest ingredients.</p>
            <a href="#" style="display:inline-flex;align-items:center;gap:8px;color:#C9A84C;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;font-weight:500;text-decoration:none;">Discover More &rsaquo;</a>
          </div>
        </div>
      </div>`),
  },

  // ── Features / USP Grid ──
  {
    id: 'features-grid',
    label: 'Features Grid',
    category: 'About',
    content: wrapSection(`
      <div style="background:#f8fafc;padding:80px 40px;">
        <div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr 1fr;gap:32px;">
          <div style="padding:24px;text-align:center;">
            <div style="width:56px;height:56px;border-radius:12px;background:rgba(59,130,246,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:28px;">⚡</div>
            <h3 style="font-size:18px;font-weight:600;color:#0f172a;margin:0 0 8px;">Lightning Fast</h3>
            <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0;">Order in seconds with our streamlined checkout. No unnecessary steps, just speed.</p>
          </div>
          <div style="padding:24px;text-align:center;">
            <div style="width:56px;height:56px;border-radius:12px;background:rgba(59,130,246,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:28px;">🛡️</div>
            <h3 style="font-size:18px;font-weight:600;color:#0f172a;margin:0 0 8px;">Quality Assured</h3>
            <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0;">Every item is verified for freshness and quality before it reaches you.</p>
          </div>
          <div style="padding:24px;text-align:center;">
            <div style="width:56px;height:56px;border-radius:12px;background:rgba(59,130,246,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:28px;">📈</div>
            <h3 style="font-size:18px;font-weight:600;color:#0f172a;margin:0 0 8px;">Smart Tracking</h3>
            <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0;">Real-time order tracking from preparation to delivery. Know exactly when it arrives.</p>
          </div>
        </div>
      </div>`),
  },

  // ── Staff / Team Grid ──
  {
    id: 'staff-grid',
    label: 'Team Grid',
    category: 'About',
    content: (s) => wrapSection(`
      <div style="background:#1A1A1A;padding:80px 40px;">
        <div style="max-width:1200px;margin:0 auto;">
          <div style="text-align:center;margin-bottom:48px;">
            <span style="color:#C9A84C;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-weight:500;">Our Team</span>
            <h2 style="font-family:Georgia,serif;font-size:36px;font-weight:700;color:#F5F0EB;margin:12px 0;">Meet the Team</h2>
            <div style="width:64px;height:2px;background:#C9A84C;margin:16px auto 0;"></div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:32px;">
            <div style="background:#0E0E0E;padding:32px;text-align:center;border:1px solid rgba(201,168,76,0.2);">
              <div style="width:80px;height:80px;border-radius:50%;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.3);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
                <span style="color:#C9A84C;font-size:28px;font-weight:700;font-family:Georgia,serif;">A</span>
              </div>
              <h3 style="color:#F5F0EB;font-size:17px;font-weight:500;margin:0 0 4px;font-family:Georgia,serif;">Ahmed</h3>
              <p style="color:#A89E8E;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0;">Head Chef</p>
            </div>
            <div style="background:#0E0E0E;padding:32px;text-align:center;border:1px solid rgba(201,168,76,0.2);">
              <div style="width:80px;height:80px;border-radius:50%;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.3);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
                <span style="color:#C9A84C;font-size:28px;font-weight:700;font-family:Georgia,serif;">S</span>
              </div>
              <h3 style="color:#F5F0EB;font-size:17px;font-weight:500;margin:0 0 4px;font-family:Georgia,serif;">Sarah</h3>
              <p style="color:#A89E8E;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0;">Pastry Chef</p>
            </div>
            <div style="background:#0E0E0E;padding:32px;text-align:center;border:1px solid rgba(201,168,76,0.2);">
              <div style="width:80px;height:80px;border-radius:50%;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.3);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
                <span style="color:#C9A84C;font-size:28px;font-weight:700;font-family:Georgia,serif;">M</span>
              </div>
              <h3 style="color:#F5F0EB;font-size:17px;font-weight:500;margin:0 0 4px;font-family:Georgia,serif;">Mehdi</h3>
              <p style="color:#A89E8E;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0;">Manager</p>
            </div>
            <div style="background:#0E0E0E;padding:32px;text-align:center;border:1px solid rgba(201,168,76,0.2);">
              <div style="width:80px;height:80px;border-radius:50%;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.3);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
                <span style="color:#C9A84C;font-size:28px;font-weight:700;font-family:Georgia,serif;">L</span>
              </div>
              <h3 style="color:#F5F0EB;font-size:17px;font-weight:500;margin:0 0 4px;font-family:Georgia,serif;">Leila</h3>
              <p style="color:#A89E8E;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0;">Sommelier</p>
            </div>
          </div>
        </div>
      </div>`),
  },

  // ── Featured Spotlight (hero product) ──
  {
    id: 'featured-spotlight',
    label: 'Featured Spotlight',
    category: 'Marketing',
    content: wrapSection(`
      <div style="background:#151010;padding:80px 40px;">
        <div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;">
          <div style="position:relative;overflow:hidden;border-radius:16px;border:1px solid rgba(236,72,153,0.3);">
            <img src="https://picsum.photos/seed/spotlight/800/600" alt="Featured" style="width:100%;height:400px;object-fit:cover;" />
            <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(15,10,10,0.8),transparent);"></div>
            <div style="position:absolute;bottom:24px;left:24px;">
              <span style="background:#ec4899;color:white;font-size:11px;font-weight:700;padding:6px 16px;border-radius:999px;text-transform:uppercase;letter-spacing:1px;">Featured</span>
            </div>
          </div>
          <div>
            <div style="font-size:28px;color:#eab308;margin-bottom:16px;">⚡</div>
            <h2 style="font-family:'Bebas Neue',Impact,sans-serif;font-size:48px;font-weight:700;color:white;margin:0 0 12px;text-transform:uppercase;">Signature Dish</h2>
            <p style="color:#a0a0a0;font-size:15px;line-height:1.7;margin-bottom:24px;">The signature piece. Bold, unapologetic, and crafted for those who dare to stand out.</p>
            <div style="margin-bottom:24px;">
              <span style="color:#eab308;font-size:32px;font-weight:700;">1,200 DA</span>
            </div>
            <a href="#" style="display:inline-flex;align-items:center;gap:8px;background:#ec4899;color:white;padding:14px 40px;border-radius:999px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;text-decoration:none;">🛒 Grab It Now</a>
          </div>
        </div>
      </div>`),
  },

  // ── Tech CTA Banner ──
  {
    id: 'cta-banner-tech',
    label: 'CTA Banner',
    category: 'Marketing',
    content: wrapSection(`
      <div style="background:linear-gradient(to right,#3b82f6,#8b5cf6);padding:80px 40px;text-align:center;">
        <div style="max-width:700px;margin:0 auto;">
          <h2 style="font-size:40px;font-weight:700;color:white;margin:0 0 12px;">Ready to Order?</h2>
          <p style="color:rgba(255,255,255,0.7);font-size:18px;margin-bottom:32px;">Experience the fastest way to get fresh food delivered to your door.</p>
          <a href="#" style="display:inline-flex;align-items:center;gap:8px;background:white;color:#3b82f6;padding:16px 48px;border-radius:999px;font-size:15px;font-weight:600;text-decoration:none;box-shadow:0 10px 30px rgba(0,0,0,0.2);">Order Now &rarr;</a>
        </div>
      </div>`),
  },

  // ── Scandinavian Minimalist Hero ──
  {
    id: 'hero-scandinavian',
    label: 'Hero — Minimal',
    category: 'Header',
    content: (s) => wrapSection(`
      <div style="background:linear-gradient(to bottom,#f8fafc,#ffffff,#f1f5f9);padding:120px 40px 80px;text-align:center;position:relative;">
        <div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(to right,transparent,rgba(56,189,248,0.3),transparent);"></div>
        <div style="max-width:700px;margin:0 auto;">
          <div style="display:inline-flex;align-items:center;gap:8px;color:#38bdf8;margin-bottom:24px;">
            <span style="font-size:16px;">❄</span>
            <span style="font-size:11px;font-weight:500;letter-spacing:2px;text-transform:uppercase;">Pure &amp; Simple</span>
          </div>
          <h1 style="font-size:56px;font-weight:700;color:#0f172a;margin:0 0 24px;letter-spacing:-0.02em;line-height:1.05;">${esc(s.name)}</h1>
          <div style="width:64px;height:1px;background:#38bdf8;margin:0 auto 24px;"></div>
          <p style="font-size:18px;color:#64748b;margin-bottom:32px;line-height:1.6;">${esc(s.description || 'Clean. Fresh. Thoughtfully crafted. Scandinavian simplicity at its best.')}</p>
          <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
            <a href="#" style="display:inline-flex;align-items:center;gap:8px;background:#0f172a;color:white;padding:16px 32px;font-size:13px;font-weight:500;letter-spacing:1px;text-decoration:none;">🛒 Order Now</a>
            <a href="#" style="display:inline-flex;align-items:center;gap:8px;border:1px solid #e2e8f0;color:#64748b;padding:16px 32px;font-size:13px;font-weight:500;letter-spacing:1px;text-decoration:none;">Explore Menu</a>
          </div>
        </div>
      </div>`),
  },

  // ── Fire/Glow Hero (Ember Blaze) ──
  {
    id: 'hero-fire-glow',
    label: 'Hero — Fire Glow',
    category: 'Header',
    content: (s) => wrapSection(`
      <div style="position:relative;background:#1c1917;padding:120px 40px 100px;overflow:hidden;">
        <div style="position:absolute;inset:0;">
          <img src="https://picsum.photos/seed/${esc(s.alias)}-hero/1600/900" alt="" style="width:100%;height:100%;object-fit:cover;opacity:0.3;" />
          <div style="position:absolute;inset:0;background:linear-gradient(to right,rgba(69,10,10,0.9),rgba(69,10,10,0.6),rgba(69,10,10,0.8));"></div>
          <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(220,38,38,0.15) 0%,transparent 70%);"></div>
        </div>
        <div style="position:relative;z-index:1;max-width:800px;margin:0 auto;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px;">
            <span style="font-size:20px;color:#f97316;">🔥</span>
            <span style="color:#f97316;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Ember Grille &middot; Fire-Kissed Flavors</span>
          </div>
          <h1 style="font-size:60px;font-weight:900;color:white;line-height:1.05;margin:0 0 24px;">${esc(s.name)}</h1>
          <p style="font-size:18px;color:rgba(245,245,245,0.8);margin-bottom:32px;line-height:1.6;max-width:600px;">${esc(s.description || 'Wood-fired perfection. Every dish kissed by flame.')}</p>
          <div style="display:flex;gap:16px;flex-wrap:wrap;">
            <a href="#" style="display:inline-flex;align-items:center;gap:8px;background:#dc2626;color:white;padding:16px 32px;border-radius:999px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;text-decoration:none;box-shadow:0 10px 30px rgba(220,38,38,0.4);">🔥 Order Now</a>
            <a href="#" style="display:inline-flex;align-items:center;gap:8px;border:2px solid rgba(249,115,22,0.5);color:#f97316;padding:16px 32px;border-radius:999px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;text-decoration:none;">View Menu</a>
          </div>
        </div>
      </div>`),
  },

  // ── Left Accent Section Header (Carbon Grill) ──
  {
    id: 'section-header-accent',
    label: 'Section Header',
    category: 'Layout',
    content: (s) => wrapSection(`
      <div style="background:#171717;padding:60px 40px;">
        <div style="max-width:1200px;margin:0 auto;display:flex;gap:20px;">
          <div style="width:4px;background:#dc2626;flex-shrink:0;"></div>
          <div>
            <span style="color:#dc2626;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Section Label</span>
            <h2 style="font-size:32px;font-weight:700;color:white;margin:8px 0 0;">Section Title</h2>
            <p style="color:#a3a3a3;font-size:15px;line-height:1.6;margin-top:12px;">Add your section description here. This left accent border creates a consistent visual rhythm across your page.</p>
          </div>
        </div>
      </div>`),
  },
]

export function getBlockProperties(store: StoreData): BlockProperties[] {
  const result: BlockProperties[] = []
  const bm = BLOCK_DEFINITIONS
  const catMap = new Map<string, BlockDef[]>()

  for (const b of bm) {
    const cat = b.category || 'Custom'
    if (!catMap.has(cat)) catMap.set(cat, [])
    catMap.get(cat)!.push(b)
  }

  for (const [cat, blocks] of catMap) {
    for (const b of blocks) {
      const content = typeof b.content === 'function' ? b.content(store) : b.content
      result.push({
        id: b.id,
        label: b.label,
        category: cat,
        content,
        media: b.media,
        attributes: { class: 'gjs-block' },
      })
    }
  }

  return result
}
