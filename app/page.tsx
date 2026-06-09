'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Filters from '@/components/Filters'
import CaseCard from '@/components/CaseCard'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import { Case, CaseType } from '@/types'
import { supabase } from '@/lib/supabase'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

const DEMO_CASES: Case[] = [
  {
    id: '1',
    nombre: 'Caso Demo — Argentina',
    victima: null,
    fecha: '2024-03-15',
    tipo: 'femicidio',
    pais: 'Argentina',
    descripcion: 'Caso de ejemplo para demostración del mapa.',
    foto_url: null,
    fuentes: ['https://ejemplo.com'],
    proceso_judicial: null,
    ciudad: 'Buenos Aires',
    lat: -34.6037,
    lng: -58.3816,
    estado: 'aprobado',
    creado_at: '2024-03-15T00:00:00Z',
  },
  {
    id: '2',
    nombre: 'Caso Demo — Brasil',
    victima: null,
    fecha: '2024-04-02',
    tipo: 'abuso',
    pais: 'Brasil',
    ciudad: 'São Paulo',
    descripcion: 'Caso de ejemplo.',
    foto_url: null,
    fuentes: [],
    proceso_judicial: null,
    lat: -23.5505,
    lng: -46.6333,
    estado: 'aprobado',
    creado_at: '2024-04-02T00:00:00Z',
  },
  {
    id: '3',
    nombre: 'Caso Demo — México',
    victima: null,
    fecha: '2024-05-10',
    tipo: 'acoso',
    pais: 'México',
    ciudad: 'Ciudad de México',
    descripcion: 'Caso de ejemplo.',
    foto_url: null,
    fuentes: [],
    proceso_judicial: null,
    lat: 19.4326,
    lng: -99.1332,
    estado: 'aprobado',
    creado_at: '2024-05-10T00:00:00Z',
  },
]

export default function HomePage() {
  const [cases, setCases] = useState<Case[]>([])
  const [filtered, setFiltered] = useState<Case[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<CaseType[]>(['femicidio', 'abuso', 'acoso'])
  const [pendingTypes, setPendingTypes] = useState<CaseType[]>(['femicidio', 'abuso', 'acoso'])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [pendingCountry, setPendingCountry] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [pendingCity, setPendingCity] = useState('')
  const [loading, setLoading] = useState(true)
  const [usingDemo, setUsingDemo] = useState(false)

  useEffect(() => {
    async function fetchCases() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      if (!url || url === 'your_supabase_url') {
        setCases(DEMO_CASES)
        setUsingDemo(true)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('estado', 'aprobado')
        .order('fecha', { ascending: false })

      if (error || !data) {
        setCases(DEMO_CASES)
        setUsingDemo(true)
      } else {
        setCases(data as Case[])
      }
      setLoading(false)
    }

    fetchCases()
  }, [])

  useEffect(() => {
    let result = cases.filter((c) => selectedTypes.includes(c.tipo))
    if (selectedCountry) result = result.filter((c) => c.pais === selectedCountry)
    if (selectedCity) result = result.filter((c) => c.ciudad?.toLowerCase().includes(selectedCity.toLowerCase()))
    setFiltered(result)
  }, [cases, selectedTypes, selectedCountry, selectedCity])

  function handleSearch() {
    setSelectedTypes(pendingTypes)
    setSelectedCountry(pendingCountry)
    setSelectedCity(pendingCity)
    setHasSearched(true)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(180deg, #13131a 0%, #0d0d12 100%)', borderBottom: '1px solid #2a2a3a' }} className="px-6 py-12 md:py-16 text-center">
        <span style={{ background: '#be123c22', color: '#f472b6', border: '1px solid #be123c55', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 12px', borderRadius: 999, display: 'inline-block', marginBottom: 16 }}>
          América Latina
        </span>
        <h1 style={{ background: 'linear-gradient(135deg, #f472b6, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 16 }}>
          Documentamos la violencia<br className="hidden md:block" /> de género en tiempo real
        </h1>
        <p style={{ color: '#9d8fad', fontSize: 15, lineHeight: 1.7, maxWidth: 560, margin: '0 auto 24px' }}>
          Un mapa colaborativo de femicidios, abusos y acosos en América Latina.
          Cada pin es una historia que no debe ser olvidada.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a href="/cases/new" style={{ background: 'linear-gradient(135deg, #be123c, #ec4899)', color: 'white', fontWeight: 700, fontSize: 14, padding: '10px 24px', borderRadius: 999, textDecoration: 'none', display: 'inline-block' }}>
            + Reportar un caso
          </a>
          <a href="/recursos" style={{ background: 'transparent', color: '#c084fc', border: '1px solid #9333ea44', fontWeight: 600, fontSize: 14, padding: '10px 24px', borderRadius: 999, textDecoration: 'none', display: 'inline-block' }}>
            ¿Dónde denunciar?
          </a>
        </div>
      </section>

      {usingDemo && (
        <div
          style={{ background: '#fef9c3', borderBottom: '1px solid #fde047', color: '#854d0e' }}
          className="text-center text-xs py-2 px-4"
        >
          Mostrando datos de demo
        </div>
      )}

      {/* ── MOBILE layout ── */}
      <div className="md:hidden flex flex-col">
        {/* Mapa 4:5 */}
        <div style={{ aspectRatio: '4/5', width: '100%', position: 'relative' }}>
          <MapView cases={filtered} />
        </div>

        {/* Filtros */}
        <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }} className="p-4">
          <Filters
            selectedTypes={pendingTypes}
            selectedCountry={pendingCountry}
            selectedCity={pendingCity}
            onTypeChange={setPendingTypes}
            onCountryChange={setPendingCountry}
            onCityChange={setPendingCity}
            onSearch={handleSearch}
          />
        </div>

        {/* Casos — solo si buscó */}
        {hasSearched && (
          <div className="p-4 flex flex-col gap-3">
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs px-1">
              {filtered.length} {filtered.length === 1 ? 'caso' : 'casos'} encontrados
            </p>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} className="rounded-xl h-20 animate-pulse" />
              ))
            ) : filtered.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm text-center py-6">
                No hay casos con los filtros seleccionados
              </p>
            ) : (
              filtered.map((c) => <CaseCard key={c.id} c={c} />)
            )}
          </div>
        )}
      </div>

      {/* ── DESKTOP layout ── */}
      <div className="hidden md:flex overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
        <aside
          style={{
            background: 'var(--bg-secondary)',
            borderRight: '1px solid var(--border)',
            width: 320,
            flexShrink: 0,
          }}
          className="flex flex-col overflow-hidden"
        >
          <div className="p-4 flex-shrink-0">
            <Filters
              selectedTypes={pendingTypes}
              selectedCountry={pendingCountry}
              selectedCity={pendingCity}
              onTypeChange={setPendingTypes}
              onCountryChange={setPendingCountry}
              onCityChange={setPendingCity}
              onSearch={handleSearch}
            />
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-3 px-1">
              {filtered.length} {filtered.length === 1 ? 'caso' : 'casos'} encontrados
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} className="rounded-xl h-20 animate-pulse" />
              ))
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <p style={{ color: 'var(--text-secondary)' }} className="text-sm">No hay casos con los filtros seleccionados</p>
              </div>
            ) : (
              filtered.map((c) => <CaseCard key={c.id} c={c} />)
            )}
          </div>
        </aside>

        <main className="flex-1 p-4">
          <MapView cases={filtered} />
        </main>
      </div>

      {/* FAQ y Footer */}
      <FAQ />
      <Footer />
    </div>
  )
}
