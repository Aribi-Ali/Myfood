export interface TemplateFontMap {
  /** The font-family string used for display/headings in inline styles */
  displayInline?: string
  /** The font-family string used for body text in inline styles */
  bodyInline?: string
  /** The Tailwind font class token for display (e.g., 'Playfair_Display') */
  displayTw?: string
  /** The Tailwind font class token for body (e.g., 'Inter') */
  bodyTw?: string
}

export const TEMPLATE_FONT_MAPS: Record<string, TemplateFontMap> = {
  // ── Numbered templates (inline fontFamily) ──
  'dark-luxury': {
    displayInline: "'Playfair Display', Georgia, serif",
    bodyInline: "'Inter', system-ui, sans-serif",
  },
  'organic': {
    displayInline: "'DM Serif Display', Georgia, serif",
    bodyInline: "'Inter', system-ui, sans-serif",
  },
  'tech': {
    bodyInline: "'Inter', system-ui, sans-serif",
  },
  'streetwear': {
    displayInline: "'Bebas Neue', sans-serif",
    bodyInline: "'Inter', system-ui, sans-serif",
  },
  'artisan': {
    displayInline: "'DM Serif Display', Georgia, serif",
    bodyInline: "'Inter', system-ui, sans-serif",
  },

  // ── Templates with CSS fontFamily in <style> blocks ──
  'crimson-royale': {
    displayInline: "'Lora', serif",
    bodyInline: "'Inter', sans-serif",
  },
  'lavender-haze': {
    displayInline: "'Playfair Display', serif",
    bodyInline: "'Inter', sans-serif",
  },
  'slate-steel': {
    displayInline: "'DM Sans', sans-serif",
    bodyInline: "'JetBrains Mono', monospace",
  },

  // ── Templates using Tailwind font-[...] classes ──
  '6-bistro': {
    displayTw: 'Cormorant_Garamond',
    bodyTw: 'Inter',
  },
  '7-neon': {
    displayInline: "'Orbitron', sans-serif",
    bodyInline: "'Space Grotesk', system-ui, sans-serif",
  },
  '8-coastal': {
    displayTw: 'Playfair_Display',
    bodyTw: 'Inter',
  },
  '9-rustic': {
    displayTw: 'DM_Serif_Display',
    bodyTw: 'Inter',
  },
  '10-minimal': {
    bodyTw: 'Inter',
  },
  '11-tropical': {
    displayTw: 'Plus_Jakarta_Sans',
    bodyTw: 'Inter',
  },
  '12-retro': {
    displayTw: 'Fredoka_One',
    bodyTw: 'Inter',
  },
  '13-urban': {
    displayTw: 'Plus_Jakarta_Sans',
    bodyTw: 'Inter',
  },
  'velvet-noir': {
    displayTw: 'Playfair_Display',
    bodyTw: 'Inter',
  },
  'jade-garden': {
    displayTw: 'Noto_Serif_SC',
    bodyTw: 'Inter',
  },
  'amber-glow': {
    displayTw: 'DM_Serif_Display',
    bodyTw: 'Inter',
  },
  'frost-white': {},
  'saffron-spice': {},
  'denim-blue': {},
  'mint-berry': {},
  'trattoria-roma': {
    displayTw: 'Playfair_Display',
    bodyTw: 'Inter',
  },
  'sakura-zen': {
    displayTw: 'Noto_Serif_JP',
    bodyTw: 'Inter',
  },
  'fiesta-vibrant': {
    displayTw: 'DM_Sans',
    bodyTw: 'Inter',
  },
  'taj-spice': {
    displayTw: 'Cormorant_Garamond',
    bodyTw: 'Inter',
  },
  'med-blue': {
    displayTw: 'Lora',
    bodyTw: 'Inter',
  },
  'smoke-pit': {
    displayTw: 'Bebas_Neue',
    bodyTw: 'Inter',
  },
  'green-plate': {
    displayTw: 'Outfit',
    bodyTw: 'Inter',
  },
  'sweet-dreams': {
    displayTw: 'Playfair_Display',
    bodyTw: 'Inter',
  },
  'hops-barrel': {
    displayTw: 'Bebas_Neue',
    bodyTw: 'Inter',
  },
  'ocean-fresh': {
    displayTw: 'Plus_Jakarta_Sans',
    bodyTw: 'Inter',
  },
  'petit-paris': {
    displayTw: 'Cormorant_Garamond',
    bodyTw: 'Inter',
  },

  // ── 35 templates with NO font declarations (inherit from global) ──
  'bamboo-garden': {},
  'crimson-night': {},
  'ocean-wave': {},
  'sunset-glow': {},
  'mono-chic': {},
  'forest-canopy': {},
  'desert-rose': {},
  'neon-pulse': {},
  'harvest-gold': {},
  'ivory-lace': {},
  'kebab-palace': {},
  'croissant-corner': {},
  'curry-king': {},
  'poke-bowl': {},
  'tokyo-ramen': {},
  'margherita-bliss': {},
  'taco-fiesta': {},
  'burger-joint': {},
  'brew-bean': {},
  'steakhouse-premium': {},
  'garden-salad': {},
  'sushi-master': {},
  'tapas-social': {},
  'pho-street': {},
  'dim-sum-house': {},
  'ember-blaze': {},
  'aurora-dawn': {},
  'golden-wok': {},
  'terracotta': {},
  'midnight-sushi': {},
  'whiskey-barrel': {},
  'blossom-garden': {},
  'carbon-grill': {},
  'saffron-dream': {},
  'arctic-white': {},
}

/**
 * Get the font map for a template, falling back to empty map.
 */
export function getFontMap(templateSlug: string): TemplateFontMap {
  return TEMPLATE_FONT_MAPS[templateSlug] || {}
}

/**
 * Build a reverse lookup: font string → CSS variable name.
 * Handles both inline style font-family strings and Tailwind class tokens.
 */
export function buildFontReverseMap(templateSlug: string): Record<string, string> {
  const map = getFontMap(templateSlug)
  const reverse: Record<string, string> = {}

  if (map.displayInline) {
    reverse[map.displayInline.toLowerCase()] = '--font-display'
  }
  if (map.bodyInline) {
    reverse[map.bodyInline.toLowerCase()] = '--font-body'
  }
  if (map.displayTw) {
    reverse[map.displayTw.toLowerCase()] = '--font-display'
  }
  if (map.bodyTw) {
    reverse[map.bodyTw.toLowerCase()] = '--font-body'
  }

  return reverse
}
