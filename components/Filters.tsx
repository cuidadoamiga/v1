'use client'

import { CaseType, COUNTRIES, CountryCode } from '@/types'

interface FiltersProps {
  selectedTypes: CaseType[]
  selectedCountry: string
  onTypeChange: (types: CaseType[]) => void
  onCountryChange: (country: string) => void
  onSearch: () => void
}

const TYPES: { value: CaseType; label: string; color: string }[] = [
  { value: 'femicidio', label: 'Femicidio', color: '#be123c' },
  { value: 'abuso', label: 'Abuso', color: '#7c3aed' },
  { value: 'acoso', label: 'Acoso', color: '#db2777' },
]

export default function Filters({
  selectedTypes,
  selectedCountry,
  onTypeChange,
  onCountryChange,
  onSearch,
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
      className="rounded-xl p-4 flex flex-col gap-3"
    >
      <span style={{ color: 'var(--text-secondary)' }} className="text-xs font-semibold uppercase tracking-wider">
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
                background: active ? t.color : 'transparent',
                border: `1px solid ${active ? t.color : 'var(--border)'}`,
                color: active ? '#ffffff' : 'var(--text-secondary)',
              }}
              className="text-xs font-medium px-3 py-1.5 rounded-full transition-all hover:opacity-80"
            >
              {t.label}
            </button>
          )
        })}
      </div>

      <select
        value={selectedCountry}
        onChange={(e) => onCountryChange(e.target.value)}
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
        }}
        className="text-sm rounded-lg px-3 py-2 outline-none cursor-pointer w-full"
      >
        <option value="">Todos los países</option>
        {Object.entries(COUNTRIES).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>

      <button
        onClick={onSearch}
        style={{
          background: 'linear-gradient(135deg, var(--rose), var(--pink))',
          color: 'white',
          border: 'none',
        }}
        className="w-full py-2 rounded-lg text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
      >
        Buscar
      </button>
    </div>
  )
}
