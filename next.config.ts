import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // HSTS removido: causa ERR_CERT_AUTHORITY_INVALID en redes con portal cautivo
  // Vercel ya maneja HTTPS automáticamente
]

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
  ],
  images: {
    // Dominios permitidos para next/image (ítem 19)
    // Agregá aquí los dominios de donde vienen las imágenes de casos
    remotePatterns: [
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: '**.wikipedia.org' },
      { protocol: 'https', hostname: '**.wikimedia.org' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },
    ],
  },
}

export default nextConfig;
