function store() {
  console.log('sections::store');
  return window.pageBuilderStoreData || {};
}

function esc(str) {
  console.log('sections::esc');
  if (!str) return '';
  const d = document.createElement('div');
  d.textContent = String(str);
  return d.innerHTML;
}

function truncate(str, len) {
  console.log('sections::truncate');
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
}

function buildHeroInfernoNoir() {
  console.log('sections::buildHeroInfernoNoir');
  const s = store();
  const name = esc(s.name || 'Inferno Noir');
  const desc = esc(s.description || 'Fire-grilled perfection. Taste the heat.');
  return `<section style="background:linear-gradient(135deg,#0f0a00,#3d1a05,#6b2100);color:#fff;padding:120px 40px 100px;text-align:center;position:relative;overflow:hidden;">
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,rgba(232,93,4,.25) 0%,transparent 60%);"></div>
    <h1 style="font-size:3.5rem;margin:0 0 1rem;font-family:'Playfair Display',serif;font-weight:900;position:relative;">${name}</h1>
    <p style="font-size:1.2rem;max-width:600px;margin:0 auto 2.5rem;opacity:.9;position:relative;">${desc}</p>
    <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;position:relative;">
      <a href="#" style="background:linear-gradient(135deg,#e85d04,#fb8500);color:#fff;padding:.85rem 2.5rem;border-radius:2.5rem;font-weight:700;text-decoration:none;display:inline-block;box-shadow:0 4px 20px rgba(232,93,4,.4);">Order Now</a>
      <a href="#" style="background:transparent;border:2px solid rgba(255,255,255,.2);color:#fff;padding:.85rem 2.5rem;border-radius:2.5rem;font-weight:700;text-decoration:none;display:inline-block;">View Menu</a>
    </div>
  </section>`;
}

function buildHeroMaisonDoree() {
  console.log('sections::buildHeroMaisonDoree');
  const s = store();
  const name = esc(s.name || 'Maison Dorée');
  const desc = esc(s.description || 'Warm bistro flavors since day one.');
  return `<section style="background:linear-gradient(135deg,#fef3c7,#fde68a,#fbbf24);color:#1a1a1a;padding:100px 40px 80px;text-align:center;">
    <h1 style="font-size:3rem;margin:0 0 1rem;font-family:'Playfair Display',serif;font-weight:900;color:#78350f;">${name}</h1>
    <p style="font-size:1.15rem;max-width:600px;margin:0 auto 2rem;color:#92400e;">${desc}</p>
    <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
      <a href="#" style="background:#78350f;color:#fef3c7;padding:.85rem 2.5rem;border-radius:2.5rem;font-weight:700;text-decoration:none;display:inline-block;">Order Now</a>
      <a href="#" style="background:transparent;border:2px solid #78350f;color:#78350f;padding:.85rem 2.5rem;border-radius:2.5rem;font-weight:700;text-decoration:none;display:inline-block;">View Menu</a>
    </div>
  </section>`;
}

function buildHeroNeonTokyo() {
  console.log('sections::buildHeroNeonTokyo');
  const s = store();
  const name = esc(s.name || 'Neon Tokyo');
  return `<section style="background:linear-gradient(135deg,#12001a,#2d0059,#6a00b3);color:#fff;padding:100px 40px 80px;text-align:center;position:relative;">
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 80% 20%,rgba(255,0,170,.2) 0%,transparent 50%),radial-gradient(circle at 20% 80%,rgba(0,255,136,.1) 0%,transparent 50%);"></div>
    <h1 style="font-size:3.2rem;margin:0 0 1rem;font-weight:900;position:relative;background:linear-gradient(135deg,#00ff88,#ff00aa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${name}</h1>
    <p style="font-size:1.15rem;max-width:550px;margin:0 auto 2rem;opacity:.8;position:relative;">Cyberpunk flavors. Electric vibes. Order now.</p>
    <a href="#" style="display:inline-block;position:relative;background:#00ff88;color:#12001a;padding:.85rem 2.5rem;border-radius:2.5rem;font-weight:800;text-decoration:none;box-shadow:0 0 30px rgba(0,255,136,.3);">Order Now</a>
  </section>`;
}

function buildHeroAlbaBianca() {
  console.log('sections::buildHeroAlbaBianca');
  const s = store();
  const name = esc(s.name || 'Alba Bianca');
  const cover = s.cover;
  const bgStyle = cover
    ? `background:linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3)),url('${cover}') center/cover no-repeat;`
    : 'background:#f8fafc;';
  return `<section style="${bgStyle}padding:120px 40px;text-align:center;color:${cover ? '#fff' : '#0f172a'};">
    <h1 style="font-size:3rem;margin:0 0 1rem;font-weight:800;font-family:'Outfit',sans-serif;">${name}</h1>
    <p style="font-size:1.15rem;max-width:550px;margin:0 auto 2rem;opacity:.85;">${esc(s.description || 'Clean, fresh, and authentic.')}</p>
    <a href="#" style="display:inline-block;background:${cover ? '#fff' : '#0f172a'};color:${cover ? '#0f172a' : '#fff'};padding:.85rem 2.5rem;border-radius:.5rem;font-weight:700;text-decoration:none;">View Menu</a>
  </section>`;
}

function buildGridSombre() {
  console.log('sections::buildGridSombre');
  const s = store();
  const foods = s.foods || [];
  const items = foods.length ? foods : [
    { name: 'Margherita', price: 9.90, description: 'Fresh mozzarella & basil', is_offer: false },
    { name: 'Pepperoni', price: 12.90, description: 'Spicy pepperoni & cheese', is_offer: false },
  ];
  return `<section style="padding:60px 40px;background:#111;color:#fff;">
    <h2 style="text-align:center;font-size:2rem;margin-bottom:2rem;color:#e85d04;">Our Menu</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem;max-width:1100px;margin:0 auto;">
      ${items.slice(0, 8).map(f => `
        <div style="background:#1a1a1a;border-radius:1rem;overflow:hidden;border:1px solid #2a2a2a;transition:transform .2s;">
          <div style="background:linear-gradient(135deg,#2d1a00,#4a2800);height:140px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;color:#e85d04;font-weight:900;">${esc(f.name.charAt(0))}</div>
          <div style="padding:1.25rem;">
            <div style="display:flex;justify-content:space-between;align-items:start;">
              <strong style="font-size:1.1rem;">${esc(f.name)}</strong>
              ${f.is_offer ? '<span style="background:#e85d04;color:#fff;font-size:.7rem;font-weight:700;padding:2px 8px;border-radius:4px;">PROMO</span>' : ''}
            </div>
            <p style="color:#888;font-size:.85rem;margin:.4rem 0 .6rem;">${esc(truncate(f.description || 'Fresh & delicious', 60))}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="color:#e85d04;font-weight:700;font-size:1.1rem;">
                ${f.new_price ? `<span style="text-decoration:line-through;color:#666;font-size:.85rem;margin-right:.5rem;">${f.price} DA</span>${f.new_price} DA` : `${f.price} DA`}
              </span>
              <button data-add-to-cart="${f.id || ''}" style="background:#e85d04;color:#fff;border:none;padding:.4rem 1rem;border-radius:2rem;font-weight:600;cursor:pointer;">+ Add</button>
            </div>
          </div>
        </div>`).join('')}
    </div>
  </section>`;
}

function buildGridClaire() {
  console.log('sections::buildGridClaire');
  const s = store();
  const foods = s.foods || [];
  const items = foods.length ? foods : [
    { name: 'Margherita', price: 9.90, description: 'Fresh mozzarella & basil' },
    { name: 'Pepperoni', price: 12.90, description: 'Spicy pepperoni & cheese' },
  ];
  return `<section style="padding:60px 40px;background:#f8fafc;">
    <h2 style="text-align:center;font-size:2rem;margin-bottom:2rem;color:#1a1a1a;">Our Menu</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem;max-width:1100px;margin:0 auto;">
      ${items.slice(0, 8).map(f => `
        <div style="background:#fff;border-radius:1rem;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.06);">
          <div style="background:linear-gradient(135deg,#f8f9fa,#e9ecef);height:140px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;color:#e85d04;font-weight:900;">${esc(f.name.charAt(0))}</div>
          <div style="padding:1.25rem;">
            <strong style="font-size:1.1rem;color:#1a1a1a;">${esc(f.name)}</strong>
            <p style="color:#666;font-size:.85rem;margin:.4rem 0 .6rem;">${esc(truncate(f.description || 'Fresh & delicious', 60))}</p>
            <span style="color:#e85d04;font-weight:700;font-size:1.1rem;">
              ${f.new_price ? `<span style="text-decoration:line-through;color:#999;font-size:.85rem;margin-right:.5rem;">${f.price} DA</span>${f.new_price} DA` : `${f.price} DA`}
            </span>
          </div>
        </div>`).join('')}
    </div>
  </section>`;
}

function buildReviewsAvisSombres() {
  console.log('sections::buildReviewsAvisSombres');
  const s = store();
  const reviews = s.reviews || [];
  const items = reviews.length ? reviews : [
    { user: 'Sarah M.', rating: 5, comment: 'Absolutely amazing food!' },
    { user: 'James T.', rating: 5, comment: 'Best restaurant in town.' },
  ];
  return `<section style="padding:60px 40px;background:#111;color:#fff;">
    <h2 style="text-align:center;font-size:2rem;margin-bottom:2rem;">What Our Customers Say</h2>
    ${items.length === 0 ? '<p style="text-align:center;color:#666;">Be the first to leave a review!</p>' :
    `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem;max-width:1100px;margin:0 auto;">
      ${items.slice(0, 6).map(r => `
        <div style="background:#1a1a1a;border-radius:1rem;padding:1.5rem;border:1px solid #2a2a2a;">
          <div style="color:#fb8500;font-size:1.2rem;margin-bottom:.75rem;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
          <p style="color:#ccc;line-height:1.7;font-style:italic;margin:0 0 1rem;">"${esc(truncate(r.comment || '', 150))}"</p>
          <strong style="color:#e85d04;">— ${esc(r.user || 'Anonymous')}</strong>
        </div>`).join('')}
    </div>`}
  </section>`;
}

function buildReviewsAvisClairs() {
  console.log('sections::buildReviewsAvisClairs');
  const s = store();
  const reviews = s.reviews || [];
  const items = reviews.length ? reviews : [
    { user: 'Sarah M.', rating: 5, comment: 'Absolutely amazing food!' },
    { user: 'James T.', rating: 5, comment: 'Best restaurant in town.' },
  ];
  return `<section style="padding:60px 40px;background:#f8fafc;">
    <h2 style="text-align:center;font-size:2rem;margin-bottom:2rem;color:#1a1a1a;">Reviews</h2>
    ${items.length === 0 ? '<p style="text-align:center;color:#999;">Be the first to leave a review!</p>' :
    `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem;max-width:1100px;margin:0 auto;">
      ${items.slice(0, 6).map(r => `
        <div style="background:#fff;border-radius:1rem;padding:1.5rem;box-shadow:0 2px 12px rgba(0,0,0,.06);">
          <div style="color:#fb8500;font-size:1.2rem;margin-bottom:.75rem;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
          <p style="color:#555;line-height:1.7;font-style:italic;margin:0 0 1rem;">"${esc(truncate(r.comment || '', 150))}"</p>
          <strong style="color:#e85d04;">— ${esc(r.user || 'Anonymous')}</strong>
        </div>`).join('')}
    </div>`}
  </section>`;
}

function buildStatsBar() {
  console.log('sections::buildStatsBar');
  const s = store();
  const foodCount = (s.foods || []).length;
  const avgRating = s.avg_rating || '5.0';
  return `<section style="padding:40px;background:var(--pb-primary);color:#fff;">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;max-width:900px;margin:0 auto;text-align:center;">
      <div><div style="font-size:2.5rem;font-weight:900;">${foodCount || '0'}</div><div style="opacity:.8;font-size:.9rem;">Menu Items</div></div>
      <div><div style="font-size:2.5rem;font-weight:900;">★ ${avgRating}</div><div style="opacity:.8;font-size:.9rem;">Average Rating</div></div>
      <div><div style="font-size:2.5rem;font-weight:900;">${s.foods?.[0]?.cooking_time || '30'}min</div><div style="opacity:.8;font-size:.9rem;">Avg. Prep Time</div></div>
    </div>
  </section>`;
}

function buildNotreHistoire() {
  console.log('sections::buildNotreHistoire');
  const s = store();
  const desc = esc(s.description || 'Founded with passion, we serve the finest ingredients. Every dish tells a story.');
  return `<section style="padding:80px 40px;background:var(--pb-bg);text-align:center;">
    <div style="font-size:4rem;margin-bottom:1rem;">👨‍🍳</div>
    <h2 style="font-size:2rem;margin:0 0 1rem;color:var(--pb-primary);">Our Story</h2>
    <p style="max-width:650px;margin:0 auto;line-height:1.9;color:var(--pb-text);opacity:.85;">${desc}</p>
  </section>`;
}

function buildBannierePromo() {
  console.log('sections::buildBannierePromo');
  return `<section style="padding:60px 40px;background:linear-gradient(135deg,#e85d04,#fb8500,#ffb703);text-align:center;color:#fff;">
    <div style="font-size:3rem;margin-bottom:.5rem;">🔥</div>
    <h2 style="font-size:2.2rem;margin:0 0 .5rem;">Limited Time Offer!</h2>
    <p style="font-size:1.15rem;margin:0 0 2rem;opacity:.9;">Get 20% off your first order. Use code: HEAT20</p>
    <a href="#" style="background:#fff;color:#e85d04;padding:.85rem 2.5rem;border-radius:2.5rem;font-weight:800;text-decoration:none;display:inline-block;">Order Now</a>
  </section>`;
}

function buildCtaBanner() {
  console.log('sections::buildCtaBanner');
  const s = store();
  const phone = esc(s.phone || '+1 234 567 890');
  return `<section style="padding:60px 40px;background:var(--pb-primary);text-align:center;color:#fff;">
    <h2 style="font-size:2rem;margin:0 0 .75rem;">Hungry? Order in minutes!</h2>
    <p style="font-size:1.1rem;opacity:.9;margin:0 0 1.5rem;">Fresh food delivered to your door. Fast, easy, delicious.</p>
    <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
      <a href="#" style="background:#fff;color:var(--pb-primary);font-weight:700;padding:.85rem 2rem;border-radius:2.5rem;text-decoration:none;">Order Now</a>
      <a href="tel:${phone}" style="background:transparent;border:2px solid rgba(255,255,255,.3);color:#fff;font-weight:600;padding:.85rem 2rem;border-radius:2.5rem;text-decoration:none;">Call ${phone}</a>
    </div>
  </section>`;
}

function buildContactHours() {
  console.log('sections::buildContactHours');
  const s = store();
  const oh = s.opening_hours || {};
  const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  const dayLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  return `<section style="padding:60px 40px;background:var(--pb-card);">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:3rem;max-width:900px;margin:0 auto;">
      <div>
        <h2 style="font-size:1.75rem;margin:0 0 1.25rem;color:var(--pb-primary);">Find Us</h2>
        <p style="line-height:1.8;color:var(--pb-text);">📍 ${esc(s.address || '123 Main Street')}</p>
        <p style="color:var(--pb-text);">📞 ${esc(s.phone || '')}</p>
        <p style="color:var(--pb-text);">✉️ ${esc(s.email || 'hello@restaurant.com')}</p>
      </div>
      <div>
        <h2 style="font-size:1.75rem;margin:0 0 1.25rem;color:var(--pb-primary);">Opening Hours</h2>
        <table style="width:100%;border-collapse:collapse;color:var(--pb-text);">
          ${days.map((d, i) => {
            const dayData = oh[d] || {};
            const hrs = dayData.open && dayData.close ? `${dayData.open} – ${dayData.close}` : 'Closed';
            return `<tr><td style="padding:.4rem 0;border-bottom:1px solid var(--pb-accent);">${dayLabels[i]}</td><td style="text-align:right;font-weight:600;padding:.4rem 0;border-bottom:1px solid var(--pb-accent);">${hrs}</td></tr>`;
          }).join('')}
        </table>
      </div>
    </div>
  </section>`;
}

function buildGaleriePhotos() {
  console.log('sections::buildGaleriePhotos');
  const s = store();
  const images = s.foods?.filter(f => f.image).slice(0, 6).map(f => f.image) || [];
  const placeholders = ['🍕','🍔','🍝','🥗','🍮','🥤'];
  return `<section style="padding:60px 40px;background:var(--pb-bg);">
    <h2 style="text-align:center;font-size:2rem;margin-bottom:2rem;color:var(--pb-primary);">Gallery</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;max-width:1000px;margin:0 auto;">
      ${(images.length ? images : placeholders).slice(0, 6).map(img => `
        <div style="background:var(--pb-card);height:180px;border-radius:.75rem;overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:3rem;box-shadow:0 2px 8px rgba(0,0,0,.08);">
          ${img ? `<img src="${img}" style="width:100%;height:100%;object-fit:cover;" />` : placeholders[Math.floor(Math.random() * placeholders.length)]}
        </div>`).join('')}
    </div>
  </section>`;
}

function buildInfosRestaurant() {
  console.log('sections::buildInfosRestaurant');
  const s = store();
  return `<section style="padding:60px 40px;background:var(--pb-bg);">
    <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1.5rem;">
      <div style="background:var(--pb-card);border-radius:1rem;padding:1.5rem;text-align:center;">
        <div style="font-size:2rem;margin-bottom:.5rem;">🏪</div>
        <strong style="color:var(--pb-text);">${esc(s.name || 'Restaurant')}</strong>
      </div>
      <div style="background:var(--pb-card);border-radius:1rem;padding:1.5rem;text-align:center;">
        <div style="font-size:2rem;margin-bottom:.5rem;">📞</div>
        <strong style="color:var(--pb-text);">${esc(s.phone || 'N/A')}</strong>
      </div>
      <div style="background:var(--pb-card);border-radius:1rem;padding:1.5rem;text-align:center;">
        <div style="font-size:2rem;margin-bottom:.5rem;">⏰</div>
        <div><strong style="color:var(--pb-text);">${s.opening_hours?.monday?.open || 'N/A'} - ${s.opening_hours?.monday?.close || 'N/A'}</strong></div>
      </div>
      <div style="background:var(--pb-card);border-radius:1rem;padding:1.5rem;text-align:center;">
        <div style="font-size:2rem;margin-bottom:.5rem;">⭐</div>
        <strong style="color:var(--pb-text);">★ ${s.avg_rating || '5.0'}</strong>
      </div>
    </div>
  </section>`;
}

function buildNotreEquipe() {
  console.log('sections::buildNotreEquipe');
  const s = store();
  const staff = s.staff || [];
  if (!staff.length) return '';
  return `<section style="padding:60px 40px;background:var(--pb-card);">
    <h2 style="text-align:center;font-size:2rem;margin-bottom:2rem;color:var(--pb-primary);">Our Team</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1.5rem;max-width:800px;margin:0 auto;">
      ${staff.slice(0, 8).map(m => `
        <div style="background:var(--pb-bg);border-radius:1rem;padding:1.5rem;text-align:center;">
          <div style="width:60px;height:60px;border-radius:50%;background:var(--pb-primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;margin:0 auto .75rem;">${esc((m.name || 'S')[0])}</div>
          <strong style="color:var(--pb-text);">${esc(m.name || 'Staff')}</strong>
          <p style="color:var(--pb-text);opacity:.7;font-size:.85rem;margin:.25rem 0 0;">${esc(m.role || 'Team Member')}</p>
        </div>`).join('')}
    </div>
  </section>`;
}

function buildFooter() {
  console.log('sections::buildFooter');
  const s = store();
  const name = esc(s.name || 'Restaurant Name');
  const phone = esc(s.phone || '');
  const address = esc(s.address || '');
  const year = new Date().getFullYear();
  return `<footer style="background:#1a1a1a;color:#ccc;padding:40px;text-align:center;">
    <div style="font-size:2rem;margin-bottom:.5rem;">🍕</div>
    <strong style="color:#fff;font-size:1.2rem;">${name}</strong>
    <p style="margin:.5rem 0;font-size:.9rem;">${address}${phone ? ' · ' + phone : ''}</p>
    <div style="margin-top:1rem;font-size:.8rem;opacity:.5;">© ${year} ${name}. All rights reserved.</div>
  </footer>`;
}

export function registerSections(editor) {
  console.log('sections::registerSections');
  const bm = editor.BlockManager;

  const sectionBlocks = [
    { id: 'hero-inferno-noir', label: '🔥 Inferno Noir', category: 'Heroes', content: buildHeroInfernoNoir },
    { id: 'hero-maison-doree', label: '🌾 Maison Dorée', category: 'Heroes', content: buildHeroMaisonDoree },
    { id: 'hero-neon-tokyo', label: '💜 Neon Tokyo', category: 'Heroes', content: buildHeroNeonTokyo },
    { id: 'hero-alba-bianca', label: '🤍 Alba Bianca', category: 'Heroes', content: buildHeroAlbaBianca },
    { id: 'grid-sombre', label: '🌑 Grid Sombre', category: 'Menus', content: buildGridSombre },
    { id: 'grid-claire', label: '☀️ Grid Claire', category: 'Menus', content: buildGridClaire },
    { id: 'reviews-sombres', label: '🌙 Avis Sombres', category: 'Reviews', content: buildReviewsAvisSombres },
    { id: 'reviews-clairs', label: '📋 Avis Clairs', category: 'Reviews', content: buildReviewsAvisClairs },
    { id: 'stats-bar', label: '📊 Stats Bar', category: 'Other', content: buildStatsBar },
    { id: 'notre-histoire', label: '📖 Our Story', category: 'Other', content: buildNotreHistoire },
    { id: 'banniere-promo', label: '🏷️ Promo Banner', category: 'Other', content: buildBannierePromo },
    { id: 'cta-banner', label: '📣 CTA Banner', category: 'Other', content: buildCtaBanner },
    { id: 'contact-hours', label: '📍 Contact & Hours', category: 'Other', content: buildContactHours },
    { id: 'galerie-photos', label: '🖼️ Gallery', category: 'Other', content: buildGaleriePhotos },
    { id: 'infos-restaurant', label: 'ℹ️ Restaurant Info', category: 'Other', content: buildInfosRestaurant },
    { id: 'notre-equipe', label: '👥 Our Team', category: 'Other', content: buildNotreEquipe },
    { id: 'footer', label: '🦶 Footer', category: 'Other', content: buildFooter },
  ];

  const basicBlocks = [
    {
      id: 'text-block', label: '📝 Text Block', category: 'Basic',
      content: `<div style="padding:2rem;max-width:800px;margin:0 auto;color:var(--pb-text);line-height:1.8;">
        <h2 style="color:var(--pb-primary)">Section Title</h2>
        <p>Your text content goes here. Click to edit this block and replace with your own content.</p>
      </div>`,
    },
    {
      id: 'divider', label: '➖ Divider', category: 'Basic',
      content: `<div style="padding:1.5rem 40px;"><hr style="border:none;border-top:2px solid var(--pb-accent);"/></div>`,
    },
    {
      id: 'spacer', label: '↕️ Spacer', category: 'Basic',
      content: `<div style="height:60px;"></div>`,
    },
    {
      id: 'image-block', label: '🖼️ Image', category: 'Basic',
      content: `<div style="padding:2rem;text-align:center;">
        <img src="https://placehold.co/800x400/eeeeee/999999?text=Click+to+change+image" alt="Image" style="max-width:100%;border-radius:1rem;"/>
      </div>`,
    },
    {
      id: 'two-columns', label: '⬜⬜ Two Columns', category: 'Layout',
      content: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;padding:2rem 40px;">
        <div style="background:var(--pb-card);border-radius:1rem;padding:2rem;min-height:120px;"><p style="color:var(--pb-text);">Left column</p></div>
        <div style="background:var(--pb-card);border-radius:1rem;padding:2rem;min-height:120px;"><p style="color:var(--pb-text);">Right column</p></div>
      </div>`,
    },
    {
      id: 'three-columns', label: '⬜⬜⬜ Three Columns', category: 'Layout',
      content: `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.5rem;padding:2rem 40px;">
        ${[1,2,3].map(n => `<div style="background:var(--pb-card);border-radius:1rem;padding:1.5rem;min-height:100px;"><p style="color:var(--pb-text);">Column ${n}</p></div>`).join('')}
      </div>`,
    },
  ];

  [...sectionBlocks, ...basicBlocks].forEach(b => {
    const contentFn = typeof b.content === 'function' ? b.content : () => b.content;
    bm.add(b.id, {
      label: b.label,
      category: b.category || 'Other',
      content: contentFn,
      attributes: { class: 'pb-section-card' },
    });
  });
}
