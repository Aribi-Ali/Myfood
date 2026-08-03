import { registerSections } from './sections.js';
import { buildFullTheme, getThemeList } from './themes.js';

const themeStyleId = 'pb-theme-style';
let _editor = null;
let _activeThemeId = null;
let _initialLoadComplete = false;

function getLivewireComponent() {
  console.log('getLivewireComponent');
  const el = document.querySelector('[wire\\:id]');
  if (!el) return null;
  return window.Livewire?.find(el.getAttribute('wire:id'));
}

function showToast(type, msg) {
  console.log('showToast');
  const c = document.getElementById('pb-toasts');
  if (!c) return;
  const icons = { success: '✓', info: 'i', warning: '!', error: '✕' };
  const t = document.createElement('div');
  t.className = `pb-toast pb-toast--${type}`;
  t.innerHTML = `<span style="font-weight:800;font-size:14px;width:20px;text-align:center;flex-shrink:0">${icons[type] || 'i'}</span><span>${msg}</span>`;
  c.appendChild(t);
  requestAnimationFrame(() => t.classList.add('pb-toast--in'));
  setTimeout(() => {
    t.classList.remove('pb-toast--in');
    t.classList.add('pb-toast--out');
    setTimeout(() => t.remove(), 400);
  }, 3200);
}

function debounce(fn, ms) {
  console.log('debounce');
  let timer;
  return (...a) => { clearTimeout(timer); timer = setTimeout(() => fn(...a), ms); };
}

function esc(str) {
  console.log('esc');
  if (str == null) return '';
  const d = document.createElement('div');
  d.textContent = String(str);
  return d.innerHTML;
}

function safeCall(fn, fallback) {
  console.log('safeCall');
  try { return fn(); } catch { return fallback; }
}

function getEditor() {
  console.log('getEditor');
  return _editor || window.__pbEditor;
}

function injectThemeIntoCanvas(editor, themeId) {
  console.log('injectThemeIntoCanvas');
  _activeThemeId = themeId;
  const doc = safeCall(() => editor.Canvas.getDocument());
  if (!doc) return;
  let el = doc.getElementById(themeStyleId);
  if (!el) {
    el = doc.createElement('style');
    el.id = themeStyleId;
    doc.head.appendChild(el);
  }
  el.textContent = buildFullTheme(themeId);
}

function buildThemePanel() {
  console.log('buildThemePanel');
  const el = document.getElementById('pb-themes-tab-content');
  if (!el) return;
  el.innerHTML = getThemeList().map(t =>
    `<button class="pb-theme-chip" data-theme="${t.id}">
      <span class="pb-theme-chip__preview" style="background:${t.vars['--pb-primary']}"></span>
      <span class="pb-theme-chip__name">${esc(t.name)}</span>
    </button>`
  ).join('');

  const activeTheme = (window.pageBuilderInitial?.theme) || 'dark-fire';
  el.querySelector(`[data-theme="${activeTheme}"]`)?.classList.add('active');

  el.addEventListener('click', e => {
    const btn = e.target.closest('[data-theme]');
    if (!btn) return;
    const id = btn.dataset.theme;
    if (!confirm('Apply this theme? It will replace your current content.')) return;
    const editor = getEditor();
    if (!editor) return;
    injectThemeIntoCanvas(editor, id);
    editor.setComponents('');
    editor.setStyle('');
    getLivewireComponent()?.call('applyThemePreset', id);
    el.querySelectorAll('.pb-theme-chip').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showToast('info', `Theme: ${btn.querySelector('.pb-theme-chip__name')?.textContent || id}`);
  });
}

function enableBlockSearch() {
  console.log('enableBlockSearch');
  const input = document.getElementById('pb-blocks-search');
  if (!input) return;
  input.addEventListener('input', debounce(() => {
    const q = input.value.toLowerCase().trim();
    document.querySelectorAll('.pb-blocks-grid .gjs-block').forEach(block => {
      const label = block.querySelector('.gjs-block-label')?.textContent?.toLowerCase() || '';
      const title = block.getAttribute('title')?.toLowerCase() || '';
      const match = !q || label.includes(q) || title.includes(q);
      block.style.display = match ? '' : 'none';
    });
    document.querySelectorAll('.pb-blocks-grid .gjs-category-title').forEach(cat => {
      const next = cat.nextElementSibling;
      const blocks = next ? next.querySelectorAll('.gjs-block') : [];
      const hasVisible = Array.from(blocks).some(b => b.style.display !== 'none');
      cat.style.display = (!q || hasVisible) ? '' : 'none';
    });
  }, 200));
}

function updateStatusBadge(published) {
  console.log('updateStatusBadge');
  const badge = document.getElementById('pb-status-badge');
  if (!badge) return;
  badge.textContent = published ? 'Published' : 'Draft';
  badge.className = `pb-status-badge ${published ? 'badge--published' : 'badge--draft'}`;
}

function markDirty() { console.log('markDirty'); window.dispatchEvent(new CustomEvent('pb-dirty')); }
function markClean() { console.log('markClean'); window.dispatchEvent(new CustomEvent('pb-clean')); }
function showSaving(show) { console.log('showSaving'); window.dispatchEvent(new CustomEvent(show ? 'pb-saving-start' : 'pb-saving-end')); }

function getEditorPayload(editor) {
  console.log('getEditorPayload');
  try {
    return {
      html: editor.getHtml(),
      css: editor.getCss({ avoidProtected: true }),
      grapesData: JSON.stringify(editor.getProjectData()),
    };
  } catch {
    return { html: '', css: '', grapesData: '' };
  }
}

function doSaveDraft(editor, silent) {
  console.log('doSaveDraft');
  if (!editor) return;
  const lw = getLivewireComponent();
  if (!lw) return;
  showSaving(true);
  const payload = getEditorPayload(editor);
  lw.call('saveDraft', payload)
    .then(() => { markClean(); showSaving(false); if (!silent) showToast('info', 'Draft saved'); })
    .catch(() => { showSaving(false); showToast('error', 'Save failed'); });
}

function doPublish(editor) {
  console.log('doPublish');
  if (!editor) return;
  const lw = getLivewireComponent();
  if (!lw) return;
  showSaving(true);
  const payload = getEditorPayload(editor);
  lw.call('saveDraft', payload)
    .then(() => lw.call('publishPage'))
    .then(() => { showSaving(false); updateStatusBadge(true); markClean(); showToast('success', 'Page published!'); })
    .catch(() => { showSaving(false); showToast('error', 'Publish failed'); });
}

function doUnpublish() {
  console.log('doUnpublish');
  const lw = getLivewireComponent();
  if (!lw) return;
  showSaving(true);
  lw.call('unpublishPage')
    .then(() => { showSaving(false); updateStatusBadge(false); showToast('warning', 'Page unpublished'); })
    .catch(() => { showSaving(false); showToast('error', 'Unpublish failed'); });
}

function clearCanvas(editor) {
  console.log('clearCanvas');
  if (!editor) return;
  if (!confirm('Clear the entire canvas? This action cannot be undone.')) return;
  editor.DomComponents.clear();
  editor.CssComposer.clear();
  showToast('info', 'Canvas cleared');
  markDirty();
}

function updateZoomLabel(editor) {
  console.log('updateZoomLabel');
  const label = document.getElementById('pb-zoom-label');
  if (!label || !editor) return;
  const z = safeCall(() => editor.Canvas.getZoom(), 1);
  label.textContent = `${Math.round(z * 100)}%`;
}

function setDevice(editor, elId, deviceName) {
  console.log('setDevice');
  if (!editor) return;
  editor.setDevice(deviceName);
  document.querySelectorAll('.pb-btn-device').forEach(b => b.classList.remove('active'));
  document.getElementById(elId)?.classList.add('active');
  setTimeout(() => safeCall(() => editor.Canvas.autofit()), 150);
}

function bindToolbar(editor) {
  console.log('bindToolbar');
  if (!editor) return;

  document.getElementById('pb-btn-save')?.addEventListener('click', () => doSaveDraft(editor));
  document.getElementById('pb-btn-publish')?.addEventListener('click', () => doPublish(editor));
  document.getElementById('pb-btn-unpublish')?.addEventListener('click', doUnpublish);
  document.getElementById('pb-btn-undo')?.addEventListener('click', () => editor.UndoManager.undo());
  document.getElementById('pb-btn-redo')?.addEventListener('click', () => editor.UndoManager.redo());
  document.getElementById('pb-btn-clear')?.addEventListener('click', () => clearCanvas(editor));

  document.getElementById('pb-btn-preview')?.addEventListener('click', () => {
    safeCall(() => editor.Commands.run('preview'));
  });

  const devices = [
    { el: 'pb-btn-desktop', name: 'Desktop' },
    { el: 'pb-btn-tablet', name: 'Tablet' },
    { el: 'pb-btn-mobile', name: 'Mobile portrait' },
  ];
  devices.forEach(({ el, name }) => {
    document.getElementById(el)?.addEventListener('click', () => setDevice(editor, el, name));
  });

  document.getElementById('pb-btn-zoom-in')?.addEventListener('click', () => {
    if (!editor) return;
    const z = Math.min(1.5, safeCall(() => editor.Canvas.getZoom(), 1) + 0.1);
    editor.Canvas.setZoom(z);
    updateZoomLabel(editor);
  });
  document.getElementById('pb-btn-zoom-out')?.addEventListener('click', () => {
    if (!editor) return;
    const z = Math.max(0.25, safeCall(() => editor.Canvas.getZoom(), 1) - 0.1);
    editor.Canvas.setZoom(z);
    updateZoomLabel(editor);
  });
  document.getElementById('pb-btn-zoom-reset')?.addEventListener('click', () => {
    if (!editor) return;
    editor.Canvas.setZoom(1);
    updateZoomLabel(editor);
  });

  // Panel toggles — autofit handled by Alpine $watch
  document.getElementById('pb-btn-toggle-left')?.addEventListener('click', () => {});
  document.getElementById('pb-btn-toggle-right')?.addEventListener('click', () => {});

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    const ctrl = e.ctrlKey || e.metaKey;
    if (ctrl && e.key === 's') { e.preventDefault(); doSaveDraft(editor); }
    if (ctrl && e.key === 'z') { e.preventDefault(); if (e.shiftKey) editor.UndoManager.redo(); else editor.UndoManager.undo(); }
    if (ctrl && e.key === 'y') { e.preventDefault(); editor.UndoManager.redo(); }
    if ((e.key === 'Delete' || e.key === 'Backspace') && !e.target.closest('input,textarea,select,[contenteditable]')) {
      const selected = safeCall(() => editor.getSelected());
      if (selected && !selected.is('body')) markDirty();
    }
  });
}

function bindPanelTabs() {
  console.log('bindPanelTabs');
  document.querySelectorAll('.pb-left-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pb-left-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.pb-left-tab-content').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.target)?.classList.add('active');
    });
  });
  document.querySelectorAll('.pb-right-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pb-right-tab').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.pb-right-tab-content').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.target)?.classList.add('active');
    });
  });
}

function enableAutoSave(editor) {
  console.log('enableAutoSave');
  if (!editor) return;
  const save = debounce(() => {
    if (!_initialLoadComplete) return;
    const lw = getLivewireComponent();
    if (!lw) return;
    lw.call('saveDraft', getEditorPayload(editor))
      .then(() => markClean())
      .catch(() => {});
  }, 2000);

  editor.on('component:update', save);
  editor.on('component:add', save);
  editor.on('component:remove', save);
  editor.on('style:update', save);
}

function retryLoadContent(editor, initial) {
  console.log('retryLoadContent');
  let attempts = 0;
  const maxAttempts = 20;
  const interval = setInterval(() => {
    attempts++;
    try {
      if (initial.grapesData) {
        const data = typeof initial.grapesData === 'string' ? JSON.parse(initial.grapesData) : initial.grapesData;
        if (data && Object.keys(data).length) { editor.loadProjectData(data); clearInterval(interval); return; }
      }
      if (initial.html) {
        editor.setComponents(initial.html);
        if (initial.css) editor.setStyle(initial.css);
        clearInterval(interval);
        return;
      }
    } catch (e) { /* fallback */ }
    if (attempts >= maxAttempts) { clearInterval(interval); setDefaultContent(editor); }
  }, 500);
}

function setDefaultContent(editor) {
  console.log('setDefaultContent');
  editor.setComponents(buildDefaultPage());
  const themeId = window.pageBuilderInitial?.theme || 'dark-fire';
  injectThemeIntoCanvas(editor, themeId);
}

function buildDefaultPage() {
  console.log('buildDefaultPage');
  const store = window.pageBuilderStoreData || {};
  const name = esc(store.name || 'My Restaurant');
  return `
    <section style="background:linear-gradient(135deg,#1a0a00,#3d1a05);color:#fff;padding:100px 40px 80px;text-align:center;">
      <h1 style="font-size:3.5rem;margin:0 0 1rem;font-family:'Playfair Display',serif;font-weight:900;">${name}</h1>
      <p style="font-size:1.25rem;max-width:600px;margin:0 auto 2rem;opacity:.9;">${esc(store.description || 'Fresh ingredients. Authentic taste.')}</p>
      <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
        <a href="#" style="background:#e85d04;color:#fff;padding:.85rem 2.5rem;border-radius:2.5rem;font-weight:700;text-decoration:none;display:inline-block;">Order Now</a>
        <a href="#" style="background:transparent;border:2px solid rgba(255,255,255,.3);color:#fff;padding:.85rem 2.5rem;border-radius:2.5rem;font-weight:700;text-decoration:none;display:inline-block;">View Menu</a>
      </div>
    </section>
    <section style="padding:60px 40px;background:#fff;">
      <h2 style="text-align:center;color:#1a1a1a;font-size:2rem;margin-bottom:2rem;">Our Menu</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem;max-width:1100px;margin:0 auto;">
        ${(store.foods || []).slice(0, 6).map(f => `
          <div style="background:#f8f9fa;border-radius:1rem;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
            <div style="background:linear-gradient(135deg,#e85d04,#ffb703);height:140px;display:flex;align-items:center;justify-content:center;font-size:3rem;color:#fff;font-weight:900;">${esc(f.name.charAt(0))}</div>
            <div style="padding:1.25rem;">
              <strong style="color:#1a1a1a;font-size:1.1rem;">${esc(f.name)}</strong>
              <p style="color:#666;font-size:.85rem;margin:.35rem 0;">${esc((f.description || '').substring(0, 80))}</p>
              <span style="color:#e85d04;font-weight:700;font-size:1.1rem;">${f.new_price ? `<s style="color:#999;margin-right:.5rem;">${f.price} DA</s>${f.new_price} DA` : `${f.price} DA`}</span>
            </div>
          </div>
        `).join('') || '<p style="text-align:center;color:#999;grid-column:1/-1;">Add your menu items from the dashboard.</p>'}
      </div>
    </section>
    <footer style="background:#1a1a1a;color:#ccc;padding:40px;text-align:center;">
      <strong style="color:#fff;font-size:1.2rem;">${name}</strong>
      <p style="margin:.5rem 0;font-size:.9rem;">${esc(store.address || '')} · ${esc(store.phone || '')}</p>
      <div style="margin-top:1rem;font-size:.8rem;opacity:.5;">© ${new Date().getFullYear()} ${name}. All rights reserved.</div>
    </footer>`;
}

function initPageBuilder() {
  console.log('initPageBuilder');
  const initial = window.pageBuilderInitial || {};
  if (!window.grapesjs) { console.error('GrapesJS not loaded'); return; }

  const editor = grapesjs.init({
    container: '#pb-canvas',
    fromElement: false,
    height: '100%',
    width: '100%',
    storageManager: false,
    panels: { defaults: [] },
    blockManager: { appendTo: '#pb-blocks-container' },
    layerManager: { appendTo: '#pb-layers-container' },
    selectorManager: { appendTo: '#pb-selector-container', componentFirst: true },
    styleManager: {
      appendTo: '#pb-style-container',
      sectors: [
        { name: 'Layout', open: false, buildProps: ['display', 'width', 'height', 'min-height', 'max-width'] },
        { name: 'Typography', open: false, buildProps: ['font-family', 'font-size', 'font-weight', 'color', 'text-align', 'line-height', 'letter-spacing'] },
        { name: 'Background', open: false, buildProps: ['background-color', 'background-image', 'background-size', 'background-position', 'background-repeat'] },
        { name: 'Border', open: false, buildProps: ['border', 'border-radius', 'border-color', 'border-style', 'border-width'] },
        { name: 'Spacing', open: false, buildProps: ['margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left'] },
        { name: 'Effects', open: false, buildProps: ['opacity', 'box-shadow', 'transition', 'transform'] },
      ],
    },
    traitManager: { appendTo: '#pb-traits-container' },
    assetManager: {
      uploadName: 'file',
      upload: '/owner/page-builder/upload-asset',
      uploadInput() {
        return '<label style="display:flex;align-items:center;gap:8px;padding:12px 16px;border:2px dashed #c7d2fe;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;color:#6366f1;background:#f8f7ff">📁 Upload Image<input type="file" name="file" accept="image/*" style="display:none"/></label>';
      },
      headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '' },
      assets: [
        ...((window.pageBuilderStoreData?.foods || []).filter(f => f.image).map(f => ({ src: f.image, name: f.name }))),
        ...(window.pageBuilderStoreData?.logo ? [{ src: window.pageBuilderStoreData.logo, name: 'Logo' }] : []),
        ...(window.pageBuilderStoreData?.cover ? [{ src: window.pageBuilderStoreData.cover, name: 'Cover' }] : []),
      ],
    },
    canvas: {
      styles: [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Outfit:wght@400;600;700;900&display=swap',
      ],
    },
    deviceManager: {
      devices: [
        { name: 'Desktop', width: '' },
        { name: 'Desktop HD', width: '1280px' },
        { name: 'Tablet', width: '768px' },
        { name: 'Mobile portrait', width: '375px' },
      ],
    },
    undoManager: { track: true },
  });

  _editor = editor;
  window.__pbEditor = editor;

  registerSections(editor);

  editor.on('load', () => {
    if (initial.grapesData || initial.html) {
      retryLoadContent(editor, initial);
    } else {
      setDefaultContent(editor);
    }
    injectThemeIntoCanvas(editor, initial.theme || _activeThemeId || 'dark-fire');
    setTimeout(() => safeCall(() => editor.Canvas.autofit()), 300);
    updateZoomLabel(editor);
    _initialLoadComplete = true;
  });

  editor.on('canvas:frame:loaded', () => {
    if (_activeThemeId) injectThemeIntoCanvas(editor, _activeThemeId);
    setTimeout(() => safeCall(() => editor.Canvas.autofit()), 150);
  });

  editor.on('canvas:zoom', () => updateZoomLabel(editor));

  bindToolbar(editor);
  bindPanelTabs();
  buildThemePanel();
  enableBlockSearch();
  enableAutoSave(editor);

  editor.on('component:selected', markDirty);
  editor.on('component:deselected', markDirty);

  document.addEventListener('livewire:dispatch', e => {
    const { event, params } = e.detail ?? {};
    if (event === 'pb-toast' && params?.message) showToast(params.type ?? 'info', params.message);
    if (event === 'pb-theme-changed' && params?.themeId) injectThemeIntoCanvas(editor, params.themeId);
    if (event === 'pb-status-changed') updateStatusBadge(!!params?.published);
  });

  // Window resize → autofit canvas
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => safeCall(() => editor.Canvas.autofit()), 200);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPageBuilder);
} else {
  initPageBuilder();
}
