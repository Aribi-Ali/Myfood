'use client'

import { useMemo, type ComponentType } from 'react'
import type { TemplateStore } from '../types'
import { normalizeTemplateStore } from './normalize-template-store'

type TemplateProps = {
  store: TemplateStore
  onAddToCart?: (foodId: number) => void
  themeColors?: Record<string, string>
  onShopNow?: () => void
}

export function withNormalizedStore<P extends TemplateProps>(
  Component: ComponentType<P>,
): ComponentType<P> {
  function NormalizedTemplate(props: P) {
    const store = useMemo(() => normalizeTemplateStore(props.store), [props.store])
    return <Component {...props} store={store} />
  }
  NormalizedTemplate.displayName = `Normalized(${Component.displayName ?? Component.name ?? 'Template'})`
  return NormalizedTemplate
}
