export interface ThemeVariables {
  '--color-primary': string
  '--color-primary-hover': string
  '--color-secondary': string
  '--color-accent': string
  '--color-background': string
  '--color-surface': string
  '--color-text-primary': string
  '--color-text-secondary': string
  '--color-text-muted': string
  '--color-border': string
  '--color-error': string
  '--color-success': string
  '--color-warning': string
  '--font-display': string
  '--font-body': string
  '--font-mono': string
  '--font-size-base': string
  '--font-size-scale': string
  '--line-height-base': string
  '--letter-spacing-base': string
  '--spacing-unit': string
  '--spacing-xs': string
  '--spacing-sm': string
  '--spacing-md': string
  '--spacing-lg': string
  '--spacing-xl': string
  '--radius-sm': string
  '--radius-md': string
  '--radius-lg': string
  '--radius-full': string
  '--shadow-sm': string
  '--shadow-md': string
  '--shadow-lg': string
  '--btn-padding-x': string
  '--btn-padding-y': string
  '--btn-font-weight': string
  '--btn-radius': string
  '--btn-transition': string
  '--transition-speed': string
  '--transition-easing': string
  '--animation-entrance': string
  '--color-background-dark': string
  '--color-surface-dark': string
  '--color-text-primary-dark': string
}

export type ThemeVariableKey = keyof ThemeVariables

export interface ThemePreset {
  id: string
  name: string
  category: string
  description: string
  previewColor: string
  vars: ThemeVariables
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'velvet-noir', name: 'Velvet Noir', category: 'luxury',
    description: 'Ultra-premium dark with gold accents for fine dining',
    previewColor: '#c9a84c',
    vars: {
      '--color-primary': '#c9a84c', '--color-primary-hover': '#b8962e', '--color-secondary': '#8b7355',
      '--color-accent': '#e8d5a3', '--color-background': '#0d0d0d', '--color-surface': '#1a1a1a',
      '--color-text-primary': '#f5efe0', '--color-text-secondary': '#a09080', '--color-text-muted': '#6b5b4f',
      '--color-border': '#2a2a2a', '--color-error': '#ef4444', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'Cormorant Garamond', Georgia, serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '17px', '--font-size-scale': '1.25', '--line-height-base': '1.8', '--letter-spacing-base': '0.02em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '2px', '--radius-md': '4px', '--radius-lg': '8px', '--radius-full': '9999px',
      '--shadow-sm': '0 1px 2px rgba(0,0,0,0.4)', '--shadow-md': '0 4px 12px rgba(0,0,0,0.5)', '--shadow-lg': '0 8px 24px rgba(0,0,0,0.6)',
      '--btn-padding-x': '32px', '--btn-padding-y': '14px', '--btn-font-weight': '600', '--btn-radius': '2px', '--btn-transition': 'all 0.3s ease',
      '--transition-speed': '0.3s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#080808', '--color-surface-dark': '#121212', '--color-text-primary-dark': '#f5efe0',
    },
  },
  {
    id: 'jade-garden', name: 'Jade Garden', category: 'asian',
    description: 'Zen-inspired bamboo greens and warm paper tones',
    previewColor: '#2d8a4e',
    vars: {
      '--color-primary': '#2d8a4e', '--color-primary-hover': '#236e3e', '--color-secondary': '#5a9e6f',
      '--color-accent': '#e8c87a', '--color-background': '#f5f0e8', '--color-surface': '#fffcf5',
      '--color-text-primary': '#2c3e2d', '--color-text-secondary': '#6b7d6c', '--color-text-muted': '#9aaa9b',
      '--color-border': '#d4cfc4', '--color-error': '#c0392b', '--color-success': '#27ae60', '--color-warning': '#f39c12',
      '--font-display': "'Noto Serif Display', Georgia, serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.7', '--letter-spacing-base': '0.03em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '4px', '--radius-md': '8px', '--radius-lg': '16px', '--radius-full': '9999px',
      '--shadow-sm': '0 1px 3px rgba(0,0,0,0.06)', '--shadow-md': '0 4px 12px rgba(0,0,0,0.1)', '--shadow-lg': '0 8px 24px rgba(0,0,0,0.12)',
      '--btn-padding-x': '28px', '--btn-padding-y': '12px', '--btn-font-weight': '600', '--btn-radius': '9999px', '--btn-transition': 'all 0.3s ease',
      '--transition-speed': '0.3s', '--transition-easing': 'ease', '--animation-entrance': 'fade-up',
      '--color-background-dark': '#1a2e1a', '--color-surface-dark': '#2a3e2a', '--color-text-primary-dark': '#f5f0e8',
    },
  },
  {
    id: 'amber-glow', name: 'Amber Glow', category: 'warm',
    description: 'Sunset-warm amber and coral for cozy cafés',
    previewColor: '#d97706',
    vars: {
      '--color-primary': '#d97706', '--color-primary-hover': '#b45309', '--color-secondary': '#ea580c',
      '--color-accent': '#fbbf24', '--color-background': '#fffbf0', '--color-surface': '#ffffff',
      '--color-text-primary': '#292524', '--color-text-secondary': '#78716c', '--color-text-muted': '#a8a29e',
      '--color-border': '#e7e5e4', '--color-error': '#ef4444', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'DM Serif Display', Georgia, serif", '--font-body': "'Nunito', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.7', '--letter-spacing-base': '0.01em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '8px', '--radius-md': '16px', '--radius-lg': '24px', '--radius-full': '9999px',
      '--shadow-sm': '0 2px 8px rgba(0,0,0,0.06)', '--shadow-md': '0 4px 16px rgba(0,0,0,0.1)', '--shadow-lg': '0 8px 32px rgba(0,0,0,0.12)',
      '--btn-padding-x': '28px', '--btn-padding-y': '14px', '--btn-font-weight': '700', '--btn-radius': '9999px', '--btn-transition': 'all 0.25s ease',
      '--transition-speed': '0.25s', '--transition-easing': 'ease', '--animation-entrance': 'fade-up',
      '--color-background-dark': '#1c1917', '--color-surface-dark': '#292524', '--color-text-primary-dark': '#fffbf0',
    },
  },
  {
    id: 'slate-steel', name: 'Slate & Steel', category: 'industrial',
    description: 'Industrial dark charcoals with exposed texture accents',
    previewColor: '#334155',
    vars: {
      '--color-primary': '#334155', '--color-primary-hover': '#1e293b', '--color-secondary': '#f97316',
      '--color-accent': '#06b6d4', '--color-background': '#f8fafc', '--color-surface': '#ffffff',
      '--color-text-primary': '#0f172a', '--color-text-secondary': '#475569', '--color-text-muted': '#94a3b8',
      '--color-border': '#cbd5e1', '--color-error': '#dc2626', '--color-success': '#16a34a', '--color-warning': '#d97706',
      '--font-display': "'DM Sans', system-ui, sans-serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.6', '--letter-spacing-base': '-0.01em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '2px', '--radius-md': '4px', '--radius-lg': '8px', '--radius-full': '9999px',
      '--shadow-sm': '0 1px 2px rgba(0,0,0,0.05)', '--shadow-md': '0 4px 6px rgba(0,0,0,0.08)', '--shadow-lg': '0 8px 16px rgba(0,0,0,0.1)',
      '--btn-padding-x': '24px', '--btn-padding-y': '12px', '--btn-font-weight': '600', '--btn-radius': '4px', '--btn-transition': 'all 0.2s ease',
      '--transition-speed': '0.2s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#0f172a', '--color-surface-dark': '#1e293b', '--color-text-primary-dark': '#f8fafc',
    },
  },
  {
    id: 'lavender-haze', name: 'Lavender Haze', category: 'pastel',
    description: 'Soft purples and lilacs for dessert shops and bakeries',
    previewColor: '#a855f7',
    vars: {
      '--color-primary': '#a855f7', '--color-primary-hover': '#9333ea', '--color-secondary': '#c084fc',
      '--color-accent': '#f472b6', '--color-background': '#faf5ff', '--color-surface': '#ffffff',
      '--color-text-primary': '#2e1065', '--color-text-secondary': '#6b21a8', '--color-text-muted': '#a855f7',
      '--color-border': '#e9d5ff', '--color-error': '#ef4444', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'Playfair Display', Georgia, serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.7', '--letter-spacing-base': '0.02em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '12px', '--radius-md': '20px', '--radius-lg': '28px', '--radius-full': '9999px',
      '--shadow-sm': '0 2px 8px rgba(168,85,247,0.08)', '--shadow-md': '0 4px 16px rgba(168,85,247,0.12)', '--shadow-lg': '0 8px 32px rgba(168,85,247,0.15)',
      '--btn-padding-x': '28px', '--btn-padding-y': '14px', '--btn-font-weight': '600', '--btn-radius': '9999px', '--btn-transition': 'all 0.25s ease',
      '--transition-speed': '0.25s', '--transition-easing': 'ease', '--animation-entrance': 'fade-up',
      '--color-background-dark': '#1a0a2e', '--color-surface-dark': '#2a1050', '--color-text-primary-dark': '#faf5ff',
    },
  },
  {
    id: 'crimson-royale', name: 'Crimson Royale', category: 'italian',
    description: 'Deep reds and navy for classic Italian restaurants',
    previewColor: '#991b1b',
    vars: {
      '--color-primary': '#991b1b', '--color-primary-hover': '#7f1d1d', '--color-secondary': '#1e3a5f',
      '--color-accent': '#fbbf24', '--color-background': '#fdf2f2', '--color-surface': '#ffffff',
      '--color-text-primary': '#1f2937', '--color-text-secondary': '#6b7280', '--color-text-muted': '#9ca3af',
      '--color-border': '#fecaca', '--color-error': '#dc2626', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'Lora', Georgia, serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '17px', '--font-size-scale': '1.2', '--line-height-base': '1.7', '--letter-spacing-base': '0.01em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '4px', '--radius-md': '8px', '--radius-lg': '12px', '--radius-full': '9999px',
      '--shadow-sm': '0 1px 3px rgba(0,0,0,0.06)', '--shadow-md': '0 4px 12px rgba(0,0,0,0.1)', '--shadow-lg': '0 8px 24px rgba(0,0,0,0.12)',
      '--btn-padding-x': '32px', '--btn-padding-y': '14px', '--btn-font-weight': '700', '--btn-radius': '4px', '--btn-transition': 'all 0.2s ease',
      '--transition-speed': '0.2s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#1a0f0f', '--color-surface-dark': '#2a1a1a', '--color-text-primary-dark': '#fdf2f2',
    },
  },
  {
    id: 'frost-white', name: 'Frost White', category: 'scandinavian',
    description: 'Crisp Scandinavian white with ice-blue accents',
    previewColor: '#e2e8f0',
    vars: {
      '--color-primary': '#1e293b', '--color-primary-hover': '#0f172a', '--color-secondary': '#64748b',
      '--color-accent': '#38bdf8', '--color-background': '#f8fafc', '--color-surface': '#ffffff',
      '--color-text-primary': '#0f172a', '--color-text-secondary': '#475569', '--color-text-muted': '#94a3b8',
      '--color-border': '#e2e8f0', '--color-error': '#ef4444', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'Cabinet Grotesk', system-ui, sans-serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.3', '--line-height-base': '1.5', '--letter-spacing-base': '-0.02em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '8px', '--radius-md': '12px', '--radius-lg': '20px', '--radius-full': '9999px',
      '--shadow-sm': '0 0 0 1px rgba(0,0,0,0.03)', '--shadow-md': '0 4px 12px rgba(0,0,0,0.04)', '--shadow-lg': '0 8px 24px rgba(0,0,0,0.06)',
      '--btn-padding-x': '32px', '--btn-padding-y': '16px', '--btn-font-weight': '600', '--btn-radius': '9999px', '--btn-transition': 'all 0.2s ease',
      '--transition-speed': '0.2s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#0f172a', '--color-surface-dark': '#1e293b', '--color-text-primary-dark': '#f8fafc',
    },
  },
  {
    id: 'saffron-spice', name: 'Saffron Spice', category: 'oriental',
    description: 'Warm Indian spice tones with ornate geometric details',
    previewColor: '#c2410c',
    vars: {
      '--color-primary': '#c2410c', '--color-primary-hover': '#9a3412', '--color-secondary': '#d97706',
      '--color-accent': '#fcd34d', '--color-background': '#fef9ef', '--color-surface': '#fffcf5',
      '--color-text-primary': '#292524', '--color-text-secondary': '#78716c', '--color-text-muted': '#a8a29e',
      '--color-border': '#e7e5e4', '--color-error': '#dc2626', '--color-success': '#16a34a', '--color-warning': '#d97706',
      '--font-display': "'Martel', Georgia, serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '17px', '--font-size-scale': '1.25', '--line-height-base': '1.8', '--letter-spacing-base': '0.02em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '2px', '--radius-md': '6px', '--radius-lg': '12px', '--radius-full': '9999px',
      '--shadow-sm': '0 1px 3px rgba(0,0,0,0.08)', '--shadow-md': '0 4px 12px rgba(0,0,0,0.12)', '--shadow-lg': '0 8px 24px rgba(0,0,0,0.16)',
      '--btn-padding-x': '32px', '--btn-padding-y': '14px', '--btn-font-weight': '700', '--btn-radius': '2px', '--btn-transition': 'all 0.3s ease',
      '--transition-speed': '0.3s', '--transition-easing': 'ease', '--animation-entrance': 'fade-up',
      '--color-background-dark': '#1c0f0a', '--color-surface-dark': '#2a1a10', '--color-text-primary-dark': '#fef9ef',
    },
  },
  {
    id: 'denim-blue', name: 'Denim Blue', category: 'american',
    description: 'Casual Americana with denim blues and warm reds',
    previewColor: '#1d4ed8',
    vars: {
      '--color-primary': '#1d4ed8', '--color-primary-hover': '#1e40af', '--color-secondary': '#dc2626',
      '--color-accent': '#fbbf24', '--color-background': '#f8fafc', '--color-surface': '#ffffff',
      '--color-text-primary': '#1e293b', '--color-text-secondary': '#64748b', '--color-text-muted': '#94a3b8',
      '--color-border': '#dbeafe', '--color-error': '#dc2626', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'Archivo Black', system-ui, sans-serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.6', '--letter-spacing-base': '0.01em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '8px', '--radius-md': '12px', '--radius-lg': '16px', '--radius-full': '9999px',
      '--shadow-sm': '0 2px 4px rgba(0,0,0,0.05)', '--shadow-md': '0 4px 12px rgba(0,0,0,0.08)', '--shadow-lg': '0 8px 24px rgba(0,0,0,0.1)',
      '--btn-padding-x': '28px', '--btn-padding-y': '12px', '--btn-font-weight': '800', '--btn-radius': '12px', '--btn-transition': 'all 0.2s ease',
      '--transition-speed': '0.2s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#0f172a', '--color-surface-dark': '#1e293b', '--color-text-primary-dark': '#f8fafc',
    },
  },
  {
    id: 'mint-berry', name: 'Mint & Berry', category: 'fresh',
    description: 'Fresh mint green and berry pink for health cafés',
    previewColor: '#14b8a6',
    vars: {
      '--color-primary': '#14b8a6', '--color-primary-hover': '#0d9488', '--color-secondary': '#ec4899',
      '--color-accent': '#8b5cf6', '--color-background': '#f0fdf4', '--color-surface': '#ffffff',
      '--color-text-primary': '#134e4a', '--color-text-secondary': '#64748b', '--color-text-muted': '#94a3b8',
      '--color-border': '#ccfbf1', '--color-error': '#ef4444', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'Plus Jakarta Sans', system-ui, sans-serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.7', '--letter-spacing-base': '0.01em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '12px', '--radius-md': '20px', '--radius-lg': '28px', '--radius-full': '9999px',
      '--shadow-sm': '0 2px 8px rgba(20,184,166,0.08)', '--shadow-md': '0 4px 16px rgba(20,184,166,0.12)', '--shadow-lg': '0 8px 32px rgba(20,184,166,0.15)',
      '--btn-padding-x': '28px', '--btn-padding-y': '14px', '--btn-font-weight': '700', '--btn-radius': '9999px', '--btn-transition': 'all 0.25s ease',
      '--transition-speed': '0.25s', '--transition-easing': 'ease', '--animation-entrance': 'fade-up',
      '--color-background-dark': '#022c22', '--color-surface-dark': '#134e4a', '--color-text-primary-dark': '#f0fdf4',
    },
  },
  // ── Original 13 Templates ──
  {
    id: 'dark-luxury', name: 'Dark Luxury', category: 'dark_luxury',
    description: 'Elegant dark theme with gold accents for premium dining',
    previewColor: '#d4a017',
    vars: {
      '--color-primary': '#d4a017', '--color-primary-hover': '#b8860b', '--color-secondary': '#8b4513',
      '--color-accent': '#f5d060', '--color-background': '#0a0a0a', '--color-surface': '#1a1410',
      '--color-text-primary': '#f5e6d3', '--color-text-secondary': '#a89880', '--color-text-muted': '#6b5b4f',
      '--color-border': '#3d2b1a', '--color-error': '#ef4444', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'Playfair Display', Georgia, serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '17px', '--font-size-scale': '1.25', '--line-height-base': '1.8', '--letter-spacing-base': '0.03em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '2px', '--radius-md': '4px', '--radius-lg': '8px', '--radius-full': '9999px',
      '--shadow-sm': '0 1px 2px rgba(0,0,0,0.3)', '--shadow-md': '0 4px 12px rgba(0,0,0,0.4)', '--shadow-lg': '0 8px 24px rgba(0,0,0,0.5)',
      '--btn-padding-x': '32px', '--btn-padding-y': '14px', '--btn-font-weight': '600', '--btn-radius': '2px', '--btn-transition': 'all 0.3s ease',
      '--transition-speed': '0.3s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#050505', '--color-surface-dark': '#14110e', '--color-text-primary-dark': '#f5e6d3',
    },
  },
  {
    id: 'organic', name: 'Fresh Organic', category: 'organic',
    description: 'Natural green tones for farm-to-table freshness',
    previewColor: '#16a34a',
    vars: {
      '--color-primary': '#16a34a', '--color-primary-hover': '#15803d', '--color-secondary': '#84cc16',
      '--color-accent': '#facc15', '--color-background': '#f0fdf4', '--color-surface': '#ffffff',
      '--color-text-primary': '#1f2937', '--color-text-secondary': '#6b7280', '--color-text-muted': '#9ca3af',
      '--color-border': '#e5e7eb', '--color-error': '#ef4444', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'DM Serif Display', Georgia, serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.6', '--letter-spacing-base': '0.01em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '8px', '--radius-md': '12px', '--radius-lg': '20px', '--radius-full': '9999px',
      '--shadow-sm': '0 1px 2px rgba(0,0,0,0.05)', '--shadow-md': '0 4px 6px rgba(0,0,0,0.1)', '--shadow-lg': '0 10px 15px rgba(0,0,0,0.15)',
      '--btn-padding-x': '24px', '--btn-padding-y': '12px', '--btn-font-weight': '600', '--btn-radius': '9999px', '--btn-transition': 'all 0.2s ease',
      '--transition-speed': '0.2s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#052e16', '--color-surface-dark': '#14532d', '--color-text-primary-dark': '#f0fdf4',
    },
  },
  {
    id: 'tech', name: 'Tech / SaaS', category: 'tech',
    description: 'Modern blue and cyan for digital-first food ordering',
    previewColor: '#3b82f6',
    vars: {
      '--color-primary': '#3b82f6', '--color-primary-hover': '#2563eb', '--color-secondary': '#06b6d4',
      '--color-accent': '#8b5cf6', '--color-background': '#f8fafc', '--color-surface': '#ffffff',
      '--color-text-primary': '#0f172a', '--color-text-secondary': '#475569', '--color-text-muted': '#94a3b8',
      '--color-border': '#e2e8f0', '--color-error': '#ef4444', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'Inter', system-ui, sans-serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.6', '--letter-spacing-base': '0',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '4px', '--radius-md': '8px', '--radius-lg': '12px', '--radius-full': '9999px',
      '--shadow-sm': '0 1px 2px rgba(0,0,0,0.05)', '--shadow-md': '0 4px 6px rgba(0,0,0,0.05)', '--shadow-lg': '0 10px 15px rgba(0,0,0,0.05)',
      '--btn-padding-x': '24px', '--btn-padding-y': '12px', '--btn-font-weight': '500', '--btn-radius': '8px', '--btn-transition': 'all 0.2s ease',
      '--transition-speed': '0.2s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#0f172a', '--color-surface-dark': '#1e293b', '--color-text-primary-dark': '#f1f5f9',
    },
  },
  {
    id: 'streetwear', name: 'Streetwear', category: 'streetwear',
    description: 'Bold black, pink, and yellow for urban food spots',
    previewColor: '#ec4899',
    vars: {
      '--color-primary': '#ec4899', '--color-primary-hover': '#db2777', '--color-secondary': '#eab308',
      '--color-accent': '#22d3ee', '--color-background': '#0f0a0a', '--color-surface': '#1a1414',
      '--color-text-primary': '#f5f5f5', '--color-text-secondary': '#a3a3a3', '--color-text-muted': '#6b7280',
      '--color-border': '#2a2a2a', '--color-error': '#ef4444', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'Bebas Neue', 'Arial Black', sans-serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.3', '--line-height-base': '1.5', '--letter-spacing-base': '0.02em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '0px', '--radius-md': '4px', '--radius-lg': '8px', '--radius-full': '9999px',
      '--shadow-sm': '0 2px 4px rgba(0,0,0,0.3)', '--shadow-md': '0 4px 12px rgba(0,0,0,0.4)', '--shadow-lg': '0 8px 24px rgba(0,0,0,0.5)',
      '--btn-padding-x': '24px', '--btn-padding-y': '12px', '--btn-font-weight': '800', '--btn-radius': '0px', '--btn-transition': 'all 0.15s ease',
      '--transition-speed': '0.15s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#000000', '--color-surface-dark': '#0f0a0a', '--color-text-primary-dark': '#f5f5f5',
    },
  },
  {
    id: 'artisan', name: 'Artisan Handmade', category: 'artisan',
    description: 'Warm terracotta and cream for handcrafted dining',
    previewColor: '#c2410c',
    vars: {
      '--color-primary': '#c2410c', '--color-primary-hover': '#9a3412', '--color-secondary': '#d97706',
      '--color-accent': '#fcd34d', '--color-background': '#fefce8', '--color-surface': '#fffbeb',
      '--color-text-primary': '#292524', '--color-text-secondary': '#78716c', '--color-text-muted': '#a8a29e',
      '--color-border': '#e7e5e4', '--color-error': '#ef4444', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'Caveat', 'Playfair Display', cursive", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.7', '--letter-spacing-base': '0.02em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '4px', '--radius-md': '8px', '--radius-lg': '16px', '--radius-full': '9999px',
      '--shadow-sm': '0 1px 3px rgba(0,0,0,0.08)', '--shadow-md': '0 4px 12px rgba(0,0,0,0.12)', '--shadow-lg': '0 8px 24px rgba(0,0,0,0.16)',
      '--btn-padding-x': '28px', '--btn-padding-y': '14px', '--btn-font-weight': '600', '--btn-radius': '9999px', '--btn-transition': 'all 0.3s ease',
      '--transition-speed': '0.3s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#1c1917', '--color-surface-dark': '#292524', '--color-text-primary-dark': '#f5f5f4',
    },
  },
  {
    id: 'bistro', name: 'Bistro Classic', category: 'bistro',
    description: 'Warm Parisian bistro with cream and terracotta accents',
    previewColor: '#bc6c25',
    vars: {
      '--color-primary': '#bc6c25', '--color-primary-hover': '#9c551a', '--color-secondary': '#8b5a2b',
      '--color-accent': '#dda15e', '--color-background': '#fefae0', '--color-surface': '#fffcf0',
      '--color-text-primary': '#283618', '--color-text-secondary': '#6c584c', '--color-text-muted': '#a98467',
      '--color-border': '#d4c9b8', '--color-error': '#ef4444', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'Crimson Text', Georgia, serif", '--font-body': "'Lato', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '17px', '--font-size-scale': '1.2', '--line-height-base': '1.7', '--letter-spacing-base': '0.02em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '4px', '--radius-md': '8px', '--radius-lg': '12px', '--radius-full': '9999px',
      '--shadow-sm': '0 1px 3px rgba(0,0,0,0.06)', '--shadow-md': '0 4px 12px rgba(0,0,0,0.1)', '--shadow-lg': '0 8px 24px rgba(0,0,0,0.12)',
      '--btn-padding-x': '28px', '--btn-padding-y': '12px', '--btn-font-weight': '600', '--btn-radius': '4px', '--btn-transition': 'all 0.25s ease',
      '--transition-speed': '0.25s', '--transition-easing': 'ease', '--animation-entrance': 'fade-up',
      '--color-background-dark': '#1a1410', '--color-surface-dark': '#2a2018', '--color-text-primary-dark': '#fefae0',
    },
  },
  {
    id: 'neon', name: 'Neon Nights', category: 'neon',
    description: 'Dark cyberpunk with neon cyan and magenta glow effects',
    previewColor: '#06d6a0',
    vars: {
      '--color-primary': '#06d6a0', '--color-primary-hover': '#05b88a', '--color-secondary': '#ef476f',
      '--color-accent': '#ffd166', '--color-background': '#0a0a1a', '--color-surface': '#12122a',
      '--color-text-primary': '#e0e0ff', '--color-text-secondary': '#8888cc', '--color-text-muted': '#5555aa',
      '--color-border': '#2a2a55', '--color-error': '#ff3860', '--color-success': '#06d6a0', '--color-warning': '#ffd166',
      '--font-display': "'Orbitron', sans-serif", '--font-body': "'Space Grotesk', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.6', '--letter-spacing-base': '0.02em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '4px', '--radius-md': '8px', '--radius-lg': '12px', '--radius-full': '9999px',
      '--shadow-sm': '0 0 10px rgba(6,214,160,0.2)', '--shadow-md': '0 0 20px rgba(6,214,160,0.3)', '--shadow-lg': '0 0 40px rgba(6,214,160,0.4)',
      '--btn-padding-x': '24px', '--btn-padding-y': '12px', '--btn-font-weight': '700', '--btn-radius': '4px', '--btn-transition': 'all 0.2s ease',
      '--transition-speed': '0.2s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#050510', '--color-surface-dark': '#0a0a20', '--color-text-primary-dark': '#e0e0ff',
    },
  },
  {
    id: 'coastal', name: 'Coastal Breeze', category: 'coastal',
    description: 'Light blue and white beach tones for fresh seafood dining',
    previewColor: '#0ea5e9',
    vars: {
      '--color-primary': '#0ea5e9', '--color-primary-hover': '#0284c7', '--color-secondary': '#06b6d4',
      '--color-accent': '#f97316', '--color-background': '#f0f9ff', '--color-surface': '#ffffff',
      '--color-text-primary': '#0c4a6e', '--color-text-secondary': '#64748b', '--color-text-muted': '#94a3b8',
      '--color-border': '#e0f2fe', '--color-error': '#ef4444', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'DM Serif Display', Georgia, serif", '--font-body': "'Nunito', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.7', '--letter-spacing-base': '0.01em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '8px', '--radius-md': '12px', '--radius-lg': '20px', '--radius-full': '9999px',
      '--shadow-sm': '0 2px 4px rgba(0,0,0,0.05)', '--shadow-md': '0 4px 12px rgba(0,0,0,0.08)', '--shadow-lg': '0 8px 24px rgba(0,0,0,0.1)',
      '--btn-padding-x': '28px', '--btn-padding-y': '12px', '--btn-font-weight': '600', '--btn-radius': '9999px', '--btn-transition': 'all 0.25s ease',
      '--transition-speed': '0.25s', '--transition-easing': 'ease', '--animation-entrance': 'fade-up',
      '--color-background-dark': '#0c4a6e', '--color-surface-dark': '#0f5a82', '--color-text-primary-dark': '#f0f9ff',
    },
  },
  {
    id: 'rustic', name: 'Rustic Farmhouse', category: 'rustic',
    description: 'Red and gingham farmhouse with warm woody textures',
    previewColor: '#b91c1c',
    vars: {
      '--color-primary': '#b91c1c', '--color-primary-hover': '#991b1b', '--color-secondary': '#15803d',
      '--color-accent': '#fbbf24', '--color-background': '#fef9ef', '--color-surface': '#fffcf0',
      '--color-text-primary': '#292524', '--color-text-secondary': '#78716c', '--color-text-muted': '#a8a29e',
      '--color-border': '#d6d3d1', '--color-error': '#dc2626', '--color-success': '#16a34a', '--color-warning': '#d97706',
      '--font-display': "'Bitter', Georgia, serif", '--font-body': "'Source Sans 3', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '17px', '--font-size-scale': '1.2', '--line-height-base': '1.7', '--letter-spacing-base': '0.01em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '2px', '--radius-md': '4px', '--radius-lg': '8px', '--radius-full': '9999px',
      '--shadow-sm': '0 1px 2px rgba(0,0,0,0.05)', '--shadow-md': '0 4px 8px rgba(0,0,0,0.1)', '--shadow-lg': '0 8px 16px rgba(0,0,0,0.1)',
      '--btn-padding-x': '28px', '--btn-padding-y': '14px', '--btn-font-weight': '700', '--btn-radius': '2px', '--btn-transition': 'all 0.2s ease',
      '--transition-speed': '0.2s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#1c1917', '--color-surface-dark': '#292524', '--color-text-primary-dark': '#fef9ef',
    },
  },
  {
    id: 'minimal', name: 'Minimal Mono', category: 'minimal',
    description: 'Ultra-clean black and white with bold typography',
    previewColor: '#1f2937',
    vars: {
      '--color-primary': '#1f2937', '--color-primary-hover': '#111827', '--color-secondary': '#4b5563',
      '--color-accent': '#f59e0b', '--color-background': '#ffffff', '--color-surface': '#fafafa',
      '--color-text-primary': '#0f0f0f', '--color-text-secondary': '#525252', '--color-text-muted': '#a3a3a3',
      '--color-border': '#e5e5e5', '--color-error': '#ef4444', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'Inter', system-ui, sans-serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.35', '--line-height-base': '1.5', '--letter-spacing-base': '-0.02em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '0px', '--radius-md': '0px', '--radius-lg': '0px', '--radius-full': '0px',
      '--shadow-sm': '0 0 0 1px rgba(0,0,0,0.05)', '--shadow-md': '0 0 0 1px rgba(0,0,0,0.1)', '--shadow-lg': '0 0 0 1px rgba(0,0,0,0.15)',
      '--btn-padding-x': '32px', '--btn-padding-y': '16px', '--btn-font-weight': '700', '--btn-radius': '0px', '--btn-transition': 'all 0.15s ease',
      '--transition-speed': '0.15s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#0f0f0f', '--color-surface-dark': '#1a1a1a', '--color-text-primary-dark': '#f5f5f5',
    },
  },
  {
    id: 'tropical', name: 'Tropical Vibes', category: 'tropical',
    description: 'Turquoise and coral with tropical leaf accents',
    previewColor: '#14b8a6',
    vars: {
      '--color-primary': '#14b8a6', '--color-primary-hover': '#0d9488', '--color-secondary': '#f43f5e',
      '--color-accent': '#fbbf24', '--color-background': '#ecfdf5', '--color-surface': '#ffffff',
      '--color-text-primary': '#134e4a', '--color-text-secondary': '#64748b', '--color-text-muted': '#94a3b8',
      '--color-border': '#ccfbf1', '--color-error': '#ef4444', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'M PLUS Rounded 1c', system-ui, sans-serif", '--font-body': "'Nunito', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.2', '--line-height-base': '1.7', '--letter-spacing-base': '0.01em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '12px', '--radius-md': '16px', '--radius-lg': '24px', '--radius-full': '9999px',
      '--shadow-sm': '0 2px 8px rgba(0,0,0,0.06)', '--shadow-md': '0 4px 16px rgba(0,0,0,0.1)', '--shadow-lg': '0 8px 32px rgba(0,0,0,0.12)',
      '--btn-padding-x': '28px', '--btn-padding-y': '14px', '--btn-font-weight': '700', '--btn-radius': '9999px', '--btn-transition': 'all 0.25s ease',
      '--transition-speed': '0.25s', '--transition-easing': 'ease', '--animation-entrance': 'fade-up',
      '--color-background-dark': '#022c22', '--color-surface-dark': '#134e4a', '--color-text-primary-dark': '#ecfdf5',
    },
  },
  {
    id: 'retro', name: 'Retro Diner', category: 'retro',
    description: '50s diner red and white with checkered patterns',
    previewColor: '#dc2626',
    vars: {
      '--color-primary': '#dc2626', '--color-primary-hover': '#b91c1c', '--color-secondary': '#1e293b',
      '--color-accent': '#fcd34d', '--color-background': '#f8f5f0', '--color-surface': '#ffffff',
      '--color-text-primary': '#1e293b', '--color-text-secondary': '#64748b', '--color-text-muted': '#94a3b8',
      '--color-border': '#e2e8f0', '--color-error': '#dc2626', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'Fredoka One', 'Arial Black', sans-serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '17px', '--font-size-scale': '1.25', '--line-height-base': '1.6', '--letter-spacing-base': '0.01em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '0px', '--radius-md': '4px', '--radius-lg': '8px', '--radius-full': '9999px',
      '--shadow-sm': '0 1px 3px rgba(0,0,0,0.1)', '--shadow-md': '0 4px 12px rgba(0,0,0,0.15)', '--shadow-lg': '0 8px 24px rgba(0,0,0,0.15)',
      '--btn-padding-x': '28px', '--btn-padding-y': '14px', '--btn-font-weight': '700', '--btn-radius': '0px', '--btn-transition': 'all 0.2s ease',
      '--transition-speed': '0.2s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#1e293b', '--color-surface-dark': '#0f172a', '--color-text-primary-dark': '#f8f5f0',
    },
  },
  {
    id: 'urban', name: 'Urban Modern', category: 'urban',
    description: 'Charcoal and coral industrial loft with geometric accents',
    previewColor: '#1e293b',
    vars: {
      '--color-primary': '#1e293b', '--color-primary-hover': '#0f172a', '--color-secondary': '#f97316',
      '--color-accent': '#06b6d4', '--color-background': '#fafaf9', '--color-surface': '#ffffff',
      '--color-text-primary': '#1c1917', '--color-text-secondary': '#57534e', '--color-text-muted': '#a8a29e',
      '--color-border': '#e7e5e4', '--color-error': '#dc2626', '--color-success': '#22c55e', '--color-warning': '#d97706',
      '--font-display': "'Plus Jakarta Sans', system-ui, sans-serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.6', '--letter-spacing-base': '0',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '4px', '--radius-md': '6px', '--radius-lg': '8px', '--radius-full': '9999px',
      '--shadow-sm': '0 1px 2px rgba(0,0,0,0.05)', '--shadow-md': '0 4px 12px rgba(0,0,0,0.08)', '--shadow-lg': '0 8px 24px rgba(0,0,0,0.1)',
      '--btn-padding-x': '28px', '--btn-padding-y': '14px', '--btn-font-weight': '600', '--btn-radius': '6px', '--btn-transition': 'all 0.2s ease',
      '--transition-speed': '0.2s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#1c1917', '--color-surface-dark': '#292524', '--color-text-primary-dark': '#fafaf9',
    },
  },
  {
    id: 'trattoria-roma', name: 'Trattoria Roma', category: 'italian',
    description: 'Rustic Italian trattoria style with tomato reds and warm olive accents',
    previewColor: '#8b0000',
    vars: {
      '--color-primary': '#8b0000', '--color-primary-hover': '#700000', '--color-secondary': '#2e8b57',
      '--color-accent': '#d4a017', '--color-background': '#fff8dc', '--color-surface': '#ffffff',
      '--color-text-primary': '#2d2d2d', '--color-text-secondary': '#4d4d4d', '--color-text-muted': '#7d7d7d',
      '--color-border': '#e6dfd1', '--color-error': '#dc2626', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'Playfair Display', Georgia, serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.7', '--letter-spacing-base': '0.01em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '4px', '--radius-md': '8px', '--radius-lg': '12px', '--radius-full': '9999px',
      '--shadow-sm': '0 1px 2px rgba(0,0,0,0.05)', '--shadow-md': '0 4px 12px rgba(0,0,0,0.08)', '--shadow-lg': '0 8px 24px rgba(0,0,0,0.1)',
      '--btn-padding-x': '28px', '--btn-padding-y': '12px', '--btn-font-weight': '700', '--btn-radius': '6px', '--btn-transition': 'all 0.2s ease',
      '--transition-speed': '0.2s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#2b1b1b', '--color-surface-dark': '#3c2929', '--color-text-primary-dark': '#fff8dc',
    },
  },
  {
    id: 'sakura-zen', name: 'Sakura Zen', category: 'japanese',
    description: 'Serene Japanese style with cherry blossom rose and basalt grey elegance',
    previewColor: '#d4617a',
    vars: {
      '--color-primary': '#d4617a', '--color-primary-hover': '#b84a62', '--color-secondary': '#2d2d2d',
      '--color-accent': '#93c572', '--color-background': '#faf5f7', '--color-surface': '#ffffff',
      '--color-text-primary': '#2d2d2d', '--color-text-secondary': '#555555', '--color-text-muted': '#8c8c8c',
      '--color-border': '#f0d0d8', '--color-error': '#ef4444', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'Noto Serif JP', Georgia, serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.7', '--letter-spacing-base': '0.02em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '2px', '--radius-md': '4px', '--radius-lg': '8px', '--radius-full': '9999px',
      '--shadow-sm': '0 1px 2px rgba(0,0,0,0.03)', '--shadow-md': '0 4px 12px rgba(0,0,0,0.06)', '--shadow-lg': '0 8px 24px rgba(0,0,0,0.08)',
      '--btn-padding-x': '26px', '--btn-padding-y': '12px', '--btn-font-weight': '600', '--btn-radius': '2px', '--btn-transition': 'all 0.25s ease',
      '--transition-speed': '0.25s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#20181a', '--color-surface-dark': '#2c2225', '--color-text-primary-dark': '#faf5f7',
    },
  },
  {
    id: 'fiesta-vibrant', name: 'Fiesta Vibrant', category: 'mexican',
    description: 'Festive Mexican style with warm terracotta orange and vivid accents',
    previewColor: '#ff6b35',
    vars: {
      '--color-primary': '#ff6b35', '--color-primary-hover': '#e05a2a', '--color-secondary': '#e63946',
      '--color-accent': '#2a9d8f', '--color-background': '#fff3e0', '--color-surface': '#ffffff',
      '--color-text-primary': '#331d10', '--color-text-secondary': '#5d4037', '--color-text-muted': '#8d6e63',
      '--color-border': '#ffe0b2', '--color-error': '#d32f2f', '--color-success': '#388e3c', '--color-warning': '#fbc02d',
      '--font-display': "'Fredoka One', sans-serif", '--font-body': "'Plus Jakarta Sans', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.6', '--letter-spacing-base': '0.01em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '8px', '--radius-md': '16px', '--radius-lg': '24px', '--radius-full': '9999px',
      '--shadow-sm': '0 2px 4px rgba(255,107,53,0.08)', '--shadow-md': '0 4px 16px rgba(255,107,53,0.12)', '--shadow-lg': '0 8px 32px rgba(255,107,53,0.15)',
      '--btn-padding-x': '28px', '--btn-padding-y': '14px', '--btn-font-weight': '800', '--btn-radius': '9999px', '--btn-transition': 'all 0.2s ease',
      '--transition-speed': '0.2s', '--transition-easing': 'ease', '--animation-entrance': 'fade-up',
      '--color-background-dark': '#2e1810', '--color-surface-dark': '#3e241c', '--color-text-primary-dark': '#fff3e0',
    },
  },
  {
    id: 'taj-spice', name: 'Taj Spice', category: 'indian',
    description: 'Imperial Indian theme with royal purple and glowing gold',
    previewColor: '#2d1b69',
    vars: {
      '--color-primary': '#2d1b69', '--color-primary-hover': '#1f1252', '--color-secondary': '#ffbf00',
      '--color-accent': '#50c878', '--color-background': '#fffdd0', '--color-surface': '#ffffff',
      '--color-text-primary': '#21183b', '--color-text-secondary': '#483c6c', '--color-text-muted': '#7c709e',
      '--color-border': '#ebdca5', '--color-error': '#d32f2f', '--color-success': '#388e3c', '--color-warning': '#fbc02d',
      '--font-display': "'Martel', Georgia, serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.7', '--letter-spacing-base': '0.02em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '4px', '--radius-md': '8px', '--radius-lg': '16px', '--radius-full': '9999px',
      '--shadow-sm': '0 1px 3px rgba(45,27,105,0.06)', '--shadow-md': '0 4px 12px rgba(45,27,105,0.1)', '--shadow-lg': '0 8px 24px rgba(45,27,105,0.12)',
      '--btn-padding-x': '30px', '--btn-padding-y': '12px', '--btn-font-weight': '700', '--btn-radius': '4px', '--btn-transition': 'all 0.3s ease',
      '--transition-speed': '0.3s', '--transition-easing': 'ease', '--animation-entrance': 'fade-up',
      '--color-background-dark': '#1c1044', '--color-surface-dark': '#291b5c', '--color-text-primary-dark': '#fffdd0',
    },
  },
  {
    id: 'med-blue', name: 'Mediterranean Blue', category: 'mediterranean',
    description: 'Breezy Greek island feel with sky blues and clean whites',
    previewColor: '#1e90ff',
    vars: {
      '--color-primary': '#1e90ff', '--color-primary-hover': '#007df0', '--color-secondary': '#003366',
      '--color-accent': '#f5deb3', '--color-background': '#fdfbf7', '--color-surface': '#ffffff',
      '--color-text-primary': '#002244', '--color-text-secondary': '#475569', '--color-text-muted': '#94a3b8',
      '--color-border': '#e0f0ff', '--color-error': '#ef4444', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'DM Serif Display', Georgia, serif", '--font-body': "'Nunito', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.7', '--letter-spacing-base': '0.01em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '8px', '--radius-md': '12px', '--radius-lg': '20px', '--radius-full': '9999px',
      '--shadow-sm': '0 2px 4px rgba(30,144,255,0.04)', '--shadow-md': '0 4px 12px rgba(30,144,255,0.06)', '--shadow-lg': '0 8px 24px rgba(30,144,255,0.08)',
      '--btn-padding-x': '28px', '--btn-padding-y': '12px', '--btn-font-weight': '600', '--btn-radius': '9999px', '--btn-transition': 'all 0.25s ease',
      '--transition-speed': '0.25s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#002244', '--color-surface-dark': '#003366', '--color-text-primary-dark': '#fdfbf7',
    },
  },
  {
    id: 'smoke-pit', name: 'Smoke Pit', category: 'bbq',
    description: 'Charcoal steakhouse and BBQ look with dark wood accents',
    previewColor: '#3e2723',
    vars: {
      '--color-primary': '#3e2723', '--color-primary-hover': '#2d1b18', '--color-secondary': '#212121',
      '--color-accent': '#ff6f00', '--color-background': '#fff3e0', '--color-surface': '#ffffff',
      '--color-text-primary': '#212121', '--color-text-secondary': '#5d4037', '--color-text-muted': '#8d6e63',
      '--color-border': '#e0d0c0', '--color-error': '#d32f2f', '--color-success': '#388e3c', '--color-warning': '#fbc02d',
      '--font-display': "'Bebas Neue', sans-serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.3', '--line-height-base': '1.6', '--letter-spacing-base': '0.02em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '0px', '--radius-md': '4px', '--radius-lg': '8px', '--radius-full': '9999px',
      '--shadow-sm': '0 2px 4px rgba(0,0,0,0.1)', '--shadow-md': '0 4px 12px rgba(0,0,0,0.15)', '--shadow-lg': '0 8px 24px rgba(0,0,0,0.2)',
      '--btn-padding-x': '26px', '--btn-padding-y': '14px', '--btn-font-weight': '700', '--btn-radius': '0px', '--btn-transition': 'all 0.15s ease',
      '--transition-speed': '0.15s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#1a0e0b', '--color-surface-dark': '#2c1813', '--color-text-primary-dark': '#fff3e0',
    },
  },
  {
    id: 'green-plate', name: 'Green Plate', category: 'vegan',
    description: 'Fresh vegan colors with natural green tones',
    previewColor: '#87c442',
    vars: {
      '--color-primary': '#87c442', '--color-primary-hover': '#71a833', '--color-secondary': '#2e7d32',
      '--color-accent': '#2d3748', '--color-background': '#f5f5dc', '--color-surface': '#ffffff',
      '--color-text-primary': '#2d3748', '--color-text-secondary': '#4a5568', '--color-text-muted': '#718096',
      '--color-border': '#e2e2ca', '--color-error': '#dc2626', '--color-success': '#2e7d32', '--color-warning': '#eab308',
      '--font-display': "'Plus Jakarta Sans', sans-serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.7', '--letter-spacing-base': '0.01em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '6px', '--radius-md': '12px', '--radius-lg': '18px', '--radius-full': '9999px',
      '--shadow-sm': '0 1px 3px rgba(0,0,0,0.05)', '--shadow-md': '0 4px 12px rgba(0,0,0,0.08)', '--shadow-lg': '0 8px 24px rgba(0,0,0,0.1)',
      '--btn-padding-x': '28px', '--btn-padding-y': '12px', '--btn-font-weight': '600', '--btn-radius': '9999px', '--btn-transition': 'all 0.2s ease',
      '--transition-speed': '0.2s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#1e2f10', '--color-surface-dark': '#2e4a1a', '--color-text-primary-dark': '#f5f5dc',
    },
  },
  {
    id: 'sweet-dreams', name: 'Sweet Dreams', category: 'patisserie',
    description: 'Lovely pastel pink and mint green for bakeries and patisseries',
    previewColor: '#ffb6c1',
    vars: {
      '--color-primary': '#ffb6c1', '--color-primary-hover': '#ffa0b0', '--color-secondary': '#98fb98',
      '--color-accent': '#e6e6fa', '--color-background': '#fff5ee', '--color-surface': '#ffffff',
      '--color-text-primary': '#4a373a', '--color-text-secondary': '#7c6569', '--color-text-muted': '#a88f93',
      '--color-border': '#ffdcd0', '--color-error': '#ef4444', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'Playfair Display', Georgia, serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.7', '--letter-spacing-base': '0.02em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '12px', '--radius-md': '20px', '--radius-lg': '28px', '--radius-full': '9999px',
      '--shadow-sm': '0 2px 8px rgba(255,182,193,0.1)', '--shadow-md': '0 4px 16px rgba(255,182,193,0.15)', '--shadow-lg': '0 8px 32px rgba(255,182,193,0.18)',
      '--btn-padding-x': '28px', '--btn-padding-y': '14px', '--btn-font-weight': '600', '--btn-radius': '9999px', '--btn-transition': 'all 0.25s ease',
      '--transition-speed': '0.25s', '--transition-easing': 'ease', '--animation-entrance': 'fade-up',
      '--color-background-dark': '#3a1f22', '--color-surface-dark': '#4e2d31', '--color-text-primary-dark': '#fff5ee',
    },
  },
  {
    id: 'hops-barrel', name: 'Hops Barrel', category: 'brewpub',
    description: 'Ember amber and copper pub look for microbreweries and bar grills',
    previewColor: '#b87333',
    vars: {
      '--color-primary': '#b87333', '--color-primary-hover': '#a36227', '--color-secondary': '#4a3728',
      '--color-accent': '#ffbf00', '--color-background': '#f5e6cc', '--color-surface': '#ffffff',
      '--color-text-primary': '#2d2118', '--color-text-secondary': '#5c4535', '--color-text-muted': '#8c6e57',
      '--color-border': '#e5d5be', '--color-error': '#dc2626', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'Archivo Black', system-ui, sans-serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.6', '--letter-spacing-base': '0.01em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '4px', '--radius-md': '8px', '--radius-lg': '12px', '--radius-full': '9999px',
      '--shadow-sm': '0 2px 4px rgba(74,55,40,0.06)', '--shadow-md': '0 4px 12px rgba(74,55,40,0.1)', '--shadow-lg': '0 8px 24px rgba(74,55,40,0.12)',
      '--btn-padding-x': '28px', '--btn-padding-y': '12px', '--btn-font-weight': '800', '--btn-radius': '6px', '--btn-transition': 'all 0.2s ease',
      '--transition-speed': '0.2s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#241a13', '--color-surface-dark': '#32251a', '--color-text-primary-dark': '#f5e6cc',
    },
  },
  {
    id: 'ocean-fresh', name: 'Ocean Fresh', category: 'seafood',
    description: 'Deep navy blue and sandy shore colors for coastal seafood kitchens',
    previewColor: '#0a4c7a',
    vars: {
      '--color-primary': '#0a4c7a', '--color-primary-hover': '#073c61', '--color-secondary': '#063554',
      '--color-accent': '#ff7f50', '--color-background': '#f4e4c1', '--color-surface': '#ffffff',
      '--color-text-primary': '#062942', '--color-text-secondary': '#3c5a70', '--color-text-muted': '#6b89a0',
      '--color-border': '#ebd8b2', '--color-error': '#dc2626', '--color-success': '#22c55e', '--color-warning': '#eab308',
      '--font-display': "'Playfair Display', Georgia, serif", '--font-body': "'Nunito', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '16px', '--font-size-scale': '1.25', '--line-height-base': '1.7', '--letter-spacing-base': '0.01em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '8px', '--radius-md': '12px', '--radius-lg': '20px', '--radius-full': '9999px',
      '--shadow-sm': '0 2px 4px rgba(10,76,122,0.05)', '--shadow-md': '0 4px 12px rgba(10,76,122,0.08)', '--shadow-lg': '0 8px 24px rgba(10,76,122,0.1)',
      '--btn-padding-x': '28px', '--btn-padding-y': '12px', '--btn-font-weight': '600', '--btn-radius': '9999px', '--btn-transition': 'all 0.25s ease',
      '--transition-speed': '0.25s', '--transition-easing': 'ease', '--animation-entrance': 'fade-up',
      '--color-background-dark': '#041f33', '--color-surface-dark': '#072e4c', '--color-text-primary-dark': '#f4e4c1',
    },
  },
  {
    id: 'petit-paris', name: 'Petit Paris', category: 'french',
    description: 'Chic Parisian bistro style with warm gold and deep navy prestige',
    previewColor: '#0f0f1a',
    vars: {
      '--color-primary': '#0f0f1a', '--color-primary-hover': '#07070f', '--color-secondary': '#8b0000',
      '--color-accent': '#c9a84c', '--color-background': '#f5f0ea', '--color-surface': '#ffffff',
      '--color-text-primary': '#1e1e1e', '--color-text-secondary': '#5c5650', '--color-text-muted': '#8b847d',
      '--color-border': '#e5ded6', '--color-error': '#8b0000', '--color-success': '#c9a84c', '--color-warning': '#c9a84c',
      '--font-display': "'Cormorant Garamond', Georgia, serif", '--font-body': "'Inter', system-ui, sans-serif",
      '--font-mono': "'JetBrains Mono', monospace",
      '--font-size-base': '17px', '--font-size-scale': '1.25', '--line-height-base': '1.8', '--letter-spacing-base': '0.02em',
      '--spacing-unit': '8px', '--spacing-xs': '4px', '--spacing-sm': '8px', '--spacing-md': '16px', '--spacing-lg': '24px', '--spacing-xl': '32px',
      '--radius-sm': '2px', '--radius-md': '4px', '--radius-lg': '8px', '--radius-full': '9999px',
      '--shadow-sm': '0 1px 2px rgba(0,0,0,0.06)', '--shadow-md': '0 4px 12px rgba(0,0,0,0.1)', '--shadow-lg': '0 8px 24px rgba(0,0,0,0.12)',
      '--btn-padding-x': '32px', '--btn-padding-y': '14px', '--btn-font-weight': '700', '--btn-radius': '2px', '--btn-transition': 'all 0.3s ease',
      '--transition-speed': '0.3s', '--transition-easing': 'ease', '--animation-entrance': 'fade',
      '--color-background-dark': '#08080f', '--color-surface-dark': '#10101d', '--color-text-primary-dark': '#f5f0ea',
    },
  },
]

export function buildThemeCss(vars: Partial<ThemeVariables>): string {
  const lines = Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n')
  const fontDisplay = vars['--font-display']
  const fontBody = vars['--font-body']
  const fontRules: string[] = []
  if (fontBody) {
    fontRules.push(`  font-family: ${fontBody};`)
  }
  const headingCss = fontDisplay
    ? `\n\nh1, h2, h3, h4, h5, h6 {\n  font-family: ${fontDisplay};\n}`
    : ''
  const bodyCss = fontBody
    ? `\n\nbody {\n  font-family: ${fontBody};\n}`
    : ''
  return `:root {\n${lines}\n}${bodyCss}${headingCss}`
}

export function getThemePreset(id: string): ThemePreset {
  return THEME_PRESETS.find(t => t.id === id) ?? THEME_PRESETS[0]!
}

export function varsToRecord(vars: ThemeVariables): Record<string, string> {
  const record: Record<string, string> = {}
  for (const [key, value] of Object.entries(vars)) {
    record[key] = value
  }
  return record
}
