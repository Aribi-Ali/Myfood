'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'
import Link from 'next/link'

interface UpgradePromptProps {
  feature: string
  featureName: string
}

export function UpgradePrompt({ feature, featureName }: UpgradePromptProps) {
  return (
    <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-3">
          <div className="p-3 rounded-full bg-gray-100">
            <Lock className="w-6 h-6 text-gray-400" />
          </div>
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          {featureName} is locked
        </h3>
        <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
          Upgrade to Menu + Online Orders to unlock this feature.
        </p>
        <Link href="/dashboard/subscription/change">
          <Button variant="primary" size="sm">
            See Plans &rarr;
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
