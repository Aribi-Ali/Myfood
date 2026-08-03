export const THEMES = {
  'dark-fire': {
    id: 'dark-fire', name: 'Inferno Noir',
    vars: {
      '--pb-bg': '#0f0a00', '--pb-text': '#f5e6d3',
      '--pb-primary': '#e85d04', '--pb-secondary': '#fb8500',
      '--pb-accent': '#ffb703', '--pb-card': '#1a1208',
      '--pb-font': "'Inter', sans-serif",
    },
  },
  'light-bistro': {
    id: 'light-bistro', name: 'Maison Dorée',
    vars: {
      '--pb-bg': '#fef3c7', '--pb-text': '#78350f',
      '--pb-primary': '#92400e', '--pb-secondary': '#d97706',
      '--pb-accent': '#fde68a', '--pb-card': '#fffbeb',
      '--pb-font': "'Playfair Display', serif",
    },
  },
  'neon-tokyo': {
    id: 'neon-tokyo', name: 'Neon Tokyo',
    vars: {
      '--pb-bg': '#0a0015', '--pb-text': '#f0e6ff',
      '--pb-primary': '#00ff88', '--pb-secondary': '#ff00aa',
      '--pb-accent': '#00aaff', '--pb-card': '#15002a',
      '--pb-font': "'Outfit', sans-serif",
    },
  },
  'minimal-white': {
    id: 'minimal-white', name: 'Alba Bianca',
    vars: {
      '--pb-bg': '#f8fafc', '--pb-text': '#0f172a',
      '--pb-primary': '#0f172a', '--pb-secondary': '#3b82f6',
      '--pb-accent': '#e2e8f0', '--pb-card': '#ffffff',
      '--pb-font': "'Outfit', sans-serif",
    },
  },
  'luxury-gold': {
    id: 'luxury-gold', name: "Empire d'Or",
    vars: {
      '--pb-bg': '#0a0a0a', '--pb-text': '#f5e6d3',
      '--pb-primary': '#d4a017', '--pb-secondary': '#f5d060',
      '--pb-accent': '#3d2b1a', '--pb-card': '#1a1410',
      '--pb-font': "'Playfair Display', serif",
    },
  },
  mediterranean: {
    id: 'mediterranean', name: 'Terra Méditerranée',
    vars: {
      '--pb-bg': '#fdf6f0', '--pb-text': '#2d1b0e',
      '--pb-primary': '#c75b39', '--pb-secondary': '#e8a87c',
      '--pb-accent': '#f4d4b8', '--pb-card': '#ffffff',
      '--pb-font': "'Outfit', sans-serif",
    },
  },
  'forest-green': {
    id: 'forest-green', name: 'Forest & Garden',
    vars: {
      '--pb-bg': '#f0f7f0', '--pb-text': '#1a2e1a',
      '--pb-primary': '#2d6a4f', '--pb-secondary': '#52b788',
      '--pb-accent': '#b7e4c7', '--pb-card': '#ffffff',
      '--pb-font': "'Outfit', sans-serif",
    },
  },
};

export function buildFullTheme(id) {
  console.log('themes::buildFullTheme');
  const theme = THEMES[id] || THEMES['dark-fire'];
  const vars = Object.entries(theme.vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');

  return `
    :root {
    ${vars}
    }
    body {
      background-color: var(--pb-bg) !important;
      color: var(--pb-text) !important;
      font-family: var(--pb-font) !important;
      margin: 0;
      padding: 0;
    }
    a { color: var(--pb-primary); transition: opacity .2s; }
    a:hover { opacity: .8; }
    img { max-width: 100%; height: auto; }
    h1, h2, h3, h4 { margin-top: 0; }
  `.trim();
}

export function getThemeList() {
  console.log('themes::getThemeList');
  return Object.values(THEMES);
}
