import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cuidado Amiga — Mapa de casos en América Latina',
  description: 'Documentación colaborativa de femicidios y abusos en América Latina',
  keywords: ['femicidio', 'violencia de género', 'América Latina', 'mapa'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
