'use client'

import { type ReactNode } from 'react'
import { useFeatures } from './feature-context'
import { UpgradePrompt } from './upgrade-prompt'

interface FeatureGateProps {
  feature: string
  featureName?: string
  fallback?: ReactNode
  children: ReactNode
}

export function FeatureGate({ feature, featureName, fallback, children }: FeatureGateProps) {
  const { can } = useFeatures()

  if (can(feature)) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return <UpgradePrompt feature={feature} featureName={featureName ?? feature} />
}
