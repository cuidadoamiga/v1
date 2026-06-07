'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Filters from '@/components/Filters'
import CaseCard from '@/components/CaseCard'
import { Case, CaseType } from '@/types'
import { supabase } from '@/lib/supabase'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

const DEMO_CASES: Case[] = [
  {
    id: '1',
    nombre: 'Caso Demo — Argentina',
    fecha: '2024-03-15',
    tipo: 'femicidio',
    pais: 'Argentina',
    descripcion: 'Caso de ejemplo para demostración del mapa.',
    foto_url: null,
    fuentes: ['https://ejemplo.com'],
    lat: -34.6037,
    lng: -58.3816,
    estado: 'aprobado',
    creado_at: '2024-03-15T00:00:00Z',
  },
  {
    id: '2',
    nombre: 'Caso Demo — Brasil',
    fecha: '2024-04-02',
    tipo: 'abuso',
    pais: 'Brasil',
    descripcion: 'Caso de ejemplo.',
    foto_url: null,
    fuentes: [],
    lat: -23.5505,
    lng: -46.6333,
    estado: 'aprobado',
    creado_at: '2024-04-02T00:00:00Z',
  },
  {
    id: '3',
    nombre: 'Caso Demo — México',
    fecha: '2024-05-10',
    tipo: 'acoso',
    pais: 'México',
    descripcion: 'Caso de ejemplo.',
    foto_url: null,
    fuentes: [],
    lat: 19.4326,
    lng: -99.1332,
    estado: 'aprobado',
    creado_at: '2024-05-10T00:00:00Z',
  },
]

export default function HomePage() {
  const [cases, setCases] = useState<Case[]>([])
  const [filtered, setFiltered] = useState<Case[]>([])
  const [selectedTypes, setSelectedTypes] = useState<CaseType[]>(['femicidio', 'abuso', 'acoso'])
  const [selectedCountry, setSelectedCountry] = useState('')
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
    if (selectedCountry) {
      result = result.filter((c) => c.pais === selectedCountry)
    }
    setFiltered(result)
  }, [cases, selectedTypes, selectedCountry])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />

      {usingDemo && (
        <div
          style={{
            background: '#9333ea22',
            borderBottom: '1px solid #9333ea55',
            color: '#c084fc',
          }}
          className="text-center text-xs py-2 px-4"
        >
          Mostrando datos de demo — configurá Supabase en <code>.env.local</code> para ver casos reales
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
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
              selectedTypes={selectedTypes}
              selectedCountry={selectedCountry}
              onTypeChange={setSelectedTypes}
              onCountryChange={setSelectedCountry}
            />
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-3 px-1">
              {filtered.length} {filtered.length === 1 ? 'caso' : 'casos'} encontrados
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                  className="rounded-xl h-20 animate-pulse"
                />
              ))
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
                  No hay casos con los filtros seleccionados
                </p>
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
    </div>
  )
}
