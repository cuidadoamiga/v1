'use client'

import { useEffect, useRef, useState } from 'react'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { Case, CASE_TYPE_COLORS, CASE_TYPE_LABELS } from '@/types'

interface MapViewProps {
  cases: Case[]
}

const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0d0d1a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9d8fad' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#2a2a3a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a2a3a' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3a2a4a' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#9d8fad' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d1520' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3a4a5a' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#16162a' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1a2a1a' }] },
]

export default function MapView({ cases }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey || apiKey === 'your_google_maps_api_key') {
      setLoaded(true)
      return
    }

    setOptions({ key: apiKey })

    importLibrary('maps').then(() => {
      if (!mapRef.current) return

      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: { lat: -15, lng: -60 },
        zoom: 3,
        // @ts-ignore — styles work at runtime with legacy Maps JS API
        styles: MAP_STYLES,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      })

      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (!mapInstance.current || !loaded) return

    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []

    cases.forEach((c) => {
      const color = CASE_TYPE_COLORS[c.tipo]

      const marker = new google.maps.Marker({
        position: { lat: c.lat, lng: c.lng },
        map: mapInstance.current!,
        title: c.nombre,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: color,
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 1.5,
        },
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="
            background: #1a1a24;
            color: #f0eaf5;
            padding: 12px;
            border-radius: 8px;
            min-width: 180px;
            font-family: system-ui, sans-serif;
          ">
            <div style="
              display: inline-block;
              background: ${color}22;
              color: ${color};
              font-size: 10px;
              padding: 2px 8px;
              border-radius: 999px;
              border: 1px solid ${color};
              margin-bottom: 6px;
            ">${CASE_TYPE_LABELS[c.tipo]}</div>
            <h3 style="margin: 0 0 4px; font-size: 14px; font-weight: 600;">${c.nombre}</h3>
            <p style="margin: 0 0 8px; font-size: 12px; color: #9d8fad;">${c.fecha} · ${c.pais}</p>
            <a href="/cases/${c.id}" style="
              color: #ec4899;
              font-size: 12px;
              text-decoration: none;
              font-weight: 500;
            ">Ver ficha completa →</a>
          </div>
        `,
      })

      marker.addListener('click', () => {
        infoWindow.open(mapInstance.current!, marker)
      })

      markersRef.current.push(marker)
    })
  }, [cases, loaded])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey || apiKey === 'your_google_maps_api_key') {
    return (
      <div
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        className="w-full h-full rounded-2xl flex flex-col items-center justify-center gap-3"
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #e11d48, #9333ea)',
            width: 48,
            height: 48,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span className="text-white text-2xl">🗺</span>
        </div>
        <p style={{ color: 'var(--text-secondary)' }} className="text-sm text-center px-6">
          Configurá <strong style={{ color: 'var(--pink)' }}>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</strong> en{' '}
          <code
            style={{
              background: 'var(--bg-secondary)',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 12,
            }}
          >
            .env.local
          </code>{' '}
          para ver el mapa
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
          {cases.length} casos listos para mostrar
        </p>
      </div>
    )
  }

  return <div ref={mapRef} className="w-full h-full rounded-2xl overflow-hidden" />
}
