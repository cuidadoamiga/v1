'use client'

import { useEffect, useRef } from 'react'
import { Case, CASE_TYPE_LABELS } from '@/types'

interface MapViewProps {
  cases: Case[]
}

const TYPE_COLORS: Record<string, string> = {
  femicidio: '#e11d48',
  abuso:     '#f97316',
  acoso:     '#3b82f6',
}

function makeIcon(color: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <path d="M14 0C6.27 0 0 6.27 0 14c0 9.33 14 22 14 22S28 23.33 28 14C28 6.27 21.73 0 14 0z"
        fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="14" cy="14" r="5" fill="white"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

export default function MapView({ cases }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Leaflet solo funciona en browser
    Promise.all([
      import('leaflet'),
      import('leaflet.markercluster'),
    ]).then(([L]) => {
      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center: [-15, -65],
        zoom: 3,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map)

      // Cluster group para agrupar pines cercanos
      const clusterGroup = (L as any).markerClusterGroup({
        maxClusterRadius: 40,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
      })
      map.addLayer(clusterGroup)

      mapInstanceRef.current = { map, L, clusterGroup }
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.map.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return
    const { L, clusterGroup } = mapInstanceRef.current

    // Limpiar marcadores previos del cluster
    if (clusterGroup) {
      clusterGroup.clearLayers()
    } else {
      markersRef.current.forEach((m) => m.remove())
    }
    markersRef.current = []

    cases.forEach((c) => {
      const color = TYPE_COLORS[c.tipo] || '#e11d48'
      const icon = L.icon({
        iconUrl: makeIcon(color),
        iconSize: [28, 36],
        iconAnchor: [14, 36],
        popupAnchor: [0, -36],
      })

      const marker = L.marker([c.lat, c.lng], { icon })
        .bindPopup(`
          <div style="font-family: Inter, system-ui, sans-serif; min-width: 160px; padding: 4px;">
            <span style="
              display: inline-block;
              background: ${color}22;
              color: ${color};
              border: 1px solid ${color}66;
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              padding: 2px 8px;
              border-radius: 999px;
              margin-bottom: 6px;
            ">${CASE_TYPE_LABELS[c.tipo]}</span>
            <div style="font-weight: 700; font-size: 14px; color: #1a202c; margin-bottom: 2px;">${c.nombre}</div>
            ${(c as any).victima ? `<div style="font-size: 12px; color: #9333ea; margin-bottom: 2px;">Víctima: ${(c as any).victima}</div>` : ''}
            <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">${c.fecha} · ${c.pais}</div>
            <a href="/cases/${c.id}" style="
              color: ${color};
              font-size: 12px;
              font-weight: 600;
              text-decoration: none;
            ">Ver ficha completa →</a>
          </div>
        `)

      if (clusterGroup) {
        clusterGroup.addLayer(marker)
      } else {
        const { map } = mapInstanceRef.current
        marker.addTo(map)
      }
      markersRef.current.push(marker)
    })
  }, [cases])

  return (
    <>
      <style>{`
        .leaflet-container { border-radius: 12px; }
        .leaflet-popup-content-wrapper {
          border-radius: 10px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12) !important;
          border: 1px solid #e2e8f0 !important;
        }
        .leaflet-popup-tip { background: white !important; }
      `}</style>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" />
      <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 12 }} />
    </>
  )
}
