import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { TemplateStore } from './types'
import { withNormalizedStore } from './shared/with-normalized-store'

type TemplateComponent = ComponentType<{ store: TemplateStore; onAddToCart?: (foodId: number) => void }>

async function loadNormalizedTemplate(
  imp: () => Promise<{ default: TemplateComponent }>,
): Promise<{ default: TemplateComponent }> {
  try {
    const mod = await imp()
    return { default: withNormalizedStore(mod.default) as TemplateComponent }
  } catch (err) {
    console.error('[template-loader] Failed to load template chunk', err)
    throw err
  }
}

export const TEMPLATE_IMPORTS: Record<string, () => Promise<{ default: TemplateComponent }>> = {
  'dark-luxury': () => import('./template-1-dark-luxury').then(m => ({ default: m.Template1DarkLuxury })),
  'organic': () => import('./template-2-organic').then(m => ({ default: m.default })),
  'tech': () => import('./template-3-tech').then(m => ({ default: m.default })),
  'streetwear': () => import('./template-4-streetwear').then(m => ({ default: m.StreetwearTemplate })),
  'artisan': () => import('./template-5-artisan').then(m => ({ default: m.default })),
  'bistro': () => import('./template-6-bistro').then(m => ({ default: m.default })),
  'neon': () => import('./template-7-neon').then(m => ({ default: m.default })),
  'coastal': () => import('./template-8-coastal').then(m => ({ default: m.default })),
  'rustic': () => import('./template-9-rustic').then(m => ({ default: m.default })),
  'minimal': () => import('./template-10-minimal').then(m => ({ default: m.default })),
  'tropical': () => import('./template-11-tropical').then(m => ({ default: m.default })),
  'retro': () => import('./template-12-retro').then(m => ({ default: m.default })),
  'urban': () => import('./template-13-urban').then(m => ({ default: m.default })),
  'velvet-noir': () => import('./template-velvet-noir').then(m => ({ default: m.VelvetNoirTemplate })),
  'jade-garden': () => import('./template-jade-garden').then(m => ({ default: m.JadeGardenTemplate })),
  'amber-glow': () => import('./template-amber-glow').then(m => ({ default: m.AmberGlowTemplate })),
  'slate-steel': () => import('./template-slate-steel').then(m => ({ default: m.SlateSteelTemplate })),
  'lavender-haze': () => import('./template-lavender-haze').then(m => ({ default: m.LavenderHazeTemplate })),
  'crimson-royale': () => import('./template-crimson-royale').then(m => ({ default: m.CrimsonRoyaleTemplate })),
  'frost-white': () => import('./template-frost-white').then(m => ({ default: m.FrostWhiteTemplate })),
  'saffron-spice': () => import('./template-saffron-spice').then(m => ({ default: m.SaffronSpiceTemplate })),
  'denim-blue': () => import('./template-denim-blue').then(m => ({ default: m.DenimBlueTemplate })),
  'mint-berry': () => import('./template-mint-berry').then(m => ({ default: m.MintBerryTemplate })),
  'trattoria-roma': () => import('./template-trattoria-roma').then(m => ({ default: m.TemplateTrattoriaRoma })),
  'sakura-zen': () => import('./template-sakura-zen').then(m => ({ default: m.TemplateSakuraZen })),
  'fiesta-vibrant': () => import('./template-fiesta-vibrant').then(m => ({ default: m.TemplateFiestaVibrant })),
  'taj-spice': () => import('./template-taj-spice').then(m => ({ default: m.TemplateTajSpice })),
  'med-blue': () => import('./template-med-blue').then(m => ({ default: m.TemplateMedBlue })),
  'smoke-pit': () => import('./template-smoke-pit').then(m => ({ default: m.TemplateSmokePit })),
  'green-plate': () => import('./template-green-plate').then(m => ({ default: m.TemplateGreenPlate })),
  'sweet-dreams': () => import('./template-sweet-dreams').then(m => ({ default: m.TemplateSweetDreams })),
  'hops-barrel': () => import('./template-hops-barrel').then(m => ({ default: m.TemplateHopsBarrel })),
  'ocean-fresh': () => import('./template-ocean-fresh').then(m => ({ default: m.TemplateOceanFresh })),
  'petit-paris': () => import('./template-petit-paris').then(m => ({ default: m.TemplatePetitParis })),

  // ── 10 New Creative Templates ──
  'bamboo-garden': () => import('./template-bamboo-garden').then(m => ({ default: m.BambooGardenTemplate })),
  'crimson-night': () => import('./template-crimson-night').then(m => ({ default: m.CrimsonNightTemplate })),
  'ocean-wave': () => import('./template-ocean-wave').then(m => ({ default: m.OceanWaveTemplate })),
  'sunset-glow': () => import('./template-sunset-glow').then(m => ({ default: m.SunsetGlowTemplate })),
  'mono-chic': () => import('./template-mono-chic').then(m => ({ default: m.MonoChicTemplate })),
  'forest-canopy': () => import('./template-forest-canopy').then(m => ({ default: m.ForestCanopyTemplate })),
  'desert-rose': () => import('./template-desert-rose').then(m => ({ default: m.DesertRoseTemplate })),
  'neon-pulse': () => import('./template-neon-pulse').then(m => ({ default: m.NeonPulseTemplate })),
  'harvest-gold': () => import('./template-harvest-gold').then(m => ({ default: m.HarvestGoldTemplate })),
  'ivory-lace': () => import('./template-ivory-lace').then(m => ({ default: m.IvoryLaceTemplate })),
  'ember-blaze': () => import('./template-ember-blaze').then(m => ({ default: m.EmberBlazeTemplate })),
  'aurora-dawn': () => import('./template-aurora-dawn').then(m => ({ default: m.AuroraDawnTemplate })),
  'golden-wok': () => import('./template-golden-wok').then(m => ({ default: m.GoldenWokTemplate })),
  'terracotta': () => import('./template-terracotta').then(m => ({ default: m.TerracottaTemplate })),
  'midnight-sushi': () => import('./template-midnight-sushi').then(m => ({ default: m.MidnightSushiTemplate })),
  'whiskey-barrel': () => import('./template-whiskey-barrel').then(m => ({ default: m.WhiskeyBarrelTemplate })),
  'blossom-garden': () => import('./template-blossom-garden').then(m => ({ default: m.BlossomGardenTemplate })),
  'carbon-grill': () => import('./template-carbon-grill').then(m => ({ default: m.CarbonGrillTemplate })),
  'saffron-dream': () => import('./template-saffron-dream').then(m => ({ default: m.SaffronDreamTemplate })),
  'arctic-white': () => import('./template-arctic-white').then(m => ({ default: m.ArcticWhiteTemplate })),
  'kebab-palace': () => import('./template-kebab-palace').then(m => ({ default: m.KebabPalaceTemplate })),
  'croissant-corner': () => import('./template-croissant-corner').then(m => ({ default: m.CroissantCornerTemplate })),
  'curry-king': () => import('./template-curry-king').then(m => ({ default: m.CurryKingTemplate })),
  'poke-bowl': () => import('./template-poke-bowl').then(m => ({ default: m.PokeBowlTemplate })),
  'tokyo-ramen': () => import('./template-tokyo-ramen').then(m => ({ default: m.TokyoRamenTemplate })),
  'margherita-bliss': () => import('./template-margherita-bliss').then(m => ({ default: m.MargheritaBlissTemplate })),
  'taco-fiesta': () => import('./template-taco-fiesta').then(m => ({ default: m.TacoFiestaTemplate })),
  'burger-joint': () => import('./template-burger-joint').then(m => ({ default: m.BurgerJointTemplate })),
  'brew-bean': () => import('./template-brew-bean').then(m => ({ default: m.BrewBeanTemplate })),
  'steakhouse-premium': () => import('./template-steakhouse-premium').then(m => ({ default: m.SteakhousePremiumTemplate })),
  'garden-salad': () => import('./template-garden-salad').then(m => ({ default: m.GardenSaladTemplate })),
  'sushi-master': () => import('./template-sushi-master').then(m => ({ default: m.SushiMasterTemplate })),
  'tapas-social': () => import('./template-tapas-social').then(m => ({ default: m.TapasSocialTemplate })),
  'pho-street': () => import('./template-pho-street').then(m => ({ default: m.PhoStreetTemplate })),
  'dim-sum-house': () => import('./template-dim-sum-house').then(m => ({ default: m.DimSumHouseTemplate })),
}

export const TEMPLATE_COMPONENTS: Record<string, LazyExoticComponent<TemplateComponent>> = {}
for (const [slug, imp] of Object.entries(TEMPLATE_IMPORTS)) {
  TEMPLATE_COMPONENTS[slug] = lazy(() => loadNormalizedTemplate(imp))
}
