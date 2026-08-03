import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import { QueryProvider } from '@/components/providers/query-provider'
import { AuthProvider } from '@/contexts/auth'
import { CartProvider } from '@/contexts/cart'
import { GeoProvider } from '@/contexts/geo'
import { CityProvider } from '@/contexts/city'
import { CurrencyProvider } from '@/contexts/currency'
import { ThemeProvider, ThemeScript } from '@/contexts/theme'
import { LanguageProvider } from '@/contexts/language'
import { CustomDomainDetector } from '@/components/custom-domain-detector'
import './globals.css'

const APP_NAME = 'YallahKool'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ea580c',
}

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Your Store, Your Way`,
    template: `%s — ${APP_NAME}`,
  },
  description: 'Order food online from local restaurants. Fresh ingredients, authentic taste, fast delivery.',
  metadataBase: new URL(APP_URL),
  alternates: {
    canonical: '/',
    languages: {
      en: '/',
      fr: '/',
      ar: '/',
    },
  },
  openGraph: {
    title: APP_NAME,
    description: 'Order food online from local restaurants. Fresh ingredients, authentic taste, fast delivery.',
    type: 'website',
    siteName: APP_NAME,
    locale: 'en_US',
    images: [{ url: '/logo.png', width: 512, height: 512 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: 'Order food online from local restaurants.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/manifest.json',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('locale')?.value as 'en' | 'fr' | 'ar' | undefined) ?? 'en'
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&family=Noto+Serif+JP:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeScript />
        <QueryProvider>
          <ThemeProvider>
            <LanguageProvider initialLocale={locale}>
              <AuthProvider>
                <GeoProvider>
                  <CityProvider>
                    <CurrencyProvider>
                      <CartProvider>
                        <CustomDomainDetector>{children}</CustomDomainDetector>
                      </CartProvider>
                    </CurrencyProvider>
                  </CityProvider>
                </GeoProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
