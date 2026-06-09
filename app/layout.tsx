import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Cuidado Amiga — Mapa de casos en América Latina',
  description: 'Documentación colaborativa de femicidios y abusos en América Latina',
  keywords: ['femicidio', 'violencia de género', 'América Latina', 'mapa'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`h-full ${inter.className}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
