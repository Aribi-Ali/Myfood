import { SettingsNav } from '@/components/settings-nav'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-0 lg:flex-row lg:gap-6">
      <SettingsNav />
      <div className="flex-1 min-w-0 min-h-0">{children}</div>
    </div>
  )
}
