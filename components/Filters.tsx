'use client'

import { CaseType, COUNTRIES, CountryCode } from '@/types'

interface FiltersProps {
  selectedTypes: CaseType[]
  selectedCountry: string
  onTypeChange: (types: CaseType[]) => void
  onCountryChange: (country: string) => void
}

const TYPES: { value: CaseType; label: string; color: string }[] = [
  { value: 'femicidio', label: 'Femicidio', color: '#e11d48' },
  { value: 'abuso', label: 'Abuso', color: '#9333ea' },
  { value: 'acoso', label: 'Acoso', color: '#ec4899' },
]

export default function Filters({
  selectedTypes,
  selectedCountry,
  onTypeChange,
  onCountryChange,
}: FiltersProps) {
  function toggleType(type: CaseType) {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter((t) => t !== type))
    } else {
      onTypeChange([...selectedTypes, type])
    }
  }

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
      }}
      className="rounded-2xl p-4 flex flex-wrap gap-3 items-center"
    >
      <span style={{ color: 'var(--text-secondary)' }} className="text-xs font-medium uppercase tracking-wider">
        Filtrar por
      </span>

      <div className="flex gap-2 flex-wrap">
        {TYPES.map((t) => {
          const active = selectedTypes.includes(t.value)
          return (
            <button
              key={t.value}
              onClick={() => toggleType(t.value)}
              style={{
                background: active ? t.color + '22' : 'transparent',
                border: `1px solid ${active ? t.color : 'var(--border)'}`,
                color: active ? t.color : 'var(--text-secondary)',
              }}
              className="text-xs font-medium px-3 py-1 rounded-full transition-all hover:opacity-80"
            >
              {t.label}
            </button>
          )
        })}
      </div>

      <div className="ml-auto">
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
          className="text-xs rounded-lg px-3 py-1.5 outline-none cursor-pointer"
        >
          <option value="">Todos los países</option>
          {Object.entries(COUNTRIES).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
