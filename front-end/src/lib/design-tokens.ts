/** Sushi-inspired Design Tokens
 *  Warm cream + crimson accent + editorial serif/sans pairing
 */

export const CARD_PRESETS = {
  base: 'bg-surface dark:bg-surface rounded-2xl border border-border shadow-sm',
  hover: 'transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-xl hover:-translate-y-1.5',
  interactive: 'cursor-pointer active:scale-[0.98]',
  elevated: 'shadow-lg hover:shadow-2xl',
  glass: 'bg-surface/80 dark:bg-surface/80 backdrop-blur-xl border border-border/50',
} as const

export const BUTTON_PRESETS = {
  primary: 'inline-flex items-center justify-center bg-primary px-7 py-3.5 text-sm font-semibold text-white rounded-full transition-all duration-300 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25 active:scale-[0.97] disabled:opacity-50 cursor-pointer',
  secondary: 'inline-flex items-center justify-center bg-ink dark:bg-charcoal px-7 py-3.5 text-sm font-semibold text-cream rounded-full transition-all duration-300 hover:shadow-lg active:scale-[0.97] cursor-pointer',
  ghost: 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-foreground/70 transition-all duration-300 hover:text-foreground hover:bg-cream-dark/50 cursor-pointer',
  danger: 'inline-flex items-center justify-center bg-red-500 px-6 py-3 text-sm font-semibold text-white rounded-full transition-all duration-300 hover:bg-red-600 hover:shadow-lg active:scale-[0.97] cursor-pointer',
  outline: 'inline-flex items-center justify-center border-2 border-foreground/20 px-7 py-3.5 text-sm font-semibold text-foreground rounded-full transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-cream active:scale-[0.97] cursor-pointer',
  icon: 'inline-flex items-center justify-center p-2.5 text-foreground/60 transition-all duration-300 hover:text-foreground hover:bg-cream-dark/50 rounded-full cursor-pointer min-w-[44px] min-h-[44px]',
} as const

export const TEXT_PRESETS = {
  heading1: 'font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] text-foreground',
  heading2: 'font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-foreground',
  heading3: 'font-display text-xl sm:text-2xl font-semibold tracking-tight text-foreground',
  body: 'text-sm sm:text-base text-muted leading-relaxed',
  muted: 'text-xs sm:text-sm text-muted',
  label: 'text-[11px] font-semibold uppercase tracking-[0.15em] text-primary',
  price: 'text-lg font-bold text-foreground',
  priceOld: 'text-sm line-through text-muted/60',
  hero: 'font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.95] text-foreground',
  section: 'font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-foreground',
  sectionSub: 'text-sm sm:text-base text-muted leading-relaxed max-w-lg',
} as const

export const AVATAR_PRESETS = {
  base: 'flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
} as const

export const BADGE_PRESETS = {
  primary: 'inline-flex items-center px-3 py-1 text-[10px] font-semibold uppercase tracking-widest bg-primary/10 text-primary rounded-full',
  green: 'inline-flex items-center px-3 py-1 text-[10px] font-semibold uppercase tracking-widest bg-green-500/10 text-green-600 rounded-full',
  red: 'inline-flex items-center px-3 py-1 text-[10px] font-semibold uppercase tracking-widest bg-red-500/10 text-red-500 rounded-full',
  blue: 'inline-flex items-center px-3 py-1 text-[10px] font-semibold uppercase tracking-widest bg-blue-500/10 text-blue-500 rounded-full',
  orange: 'inline-flex items-center px-3 py-1 text-[10px] font-semibold uppercase tracking-widest bg-orange-500/10 text-orange-600 rounded-full',
  gray: 'inline-flex items-center px-3 py-1 text-[10px] font-semibold uppercase tracking-widest bg-foreground/5 text-muted rounded-full',
  accent: 'inline-flex items-center px-3 py-1 text-[10px] font-semibold uppercase tracking-widest bg-primary text-white rounded-full',
} as const

export const INPUT_PRESETS = {
  base: 'w-full bg-surface dark:bg-surface-elevated px-5 py-3.5 text-sm text-foreground placeholder-muted/60 rounded-xl border border-border transition-all duration-300 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none',
  error: 'border-red-400 focus:border-red-500 focus:ring-red-200',
  textarea: 'min-h-[100px] resize-y',
} as const

