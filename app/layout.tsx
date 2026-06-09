import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
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
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N15RB16HDH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N15RB16HDH');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  )
}
