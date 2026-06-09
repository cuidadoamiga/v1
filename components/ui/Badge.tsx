import { HTMLAttributes, ReactNode } from 'react'

type Color = 'pink' | 'purple' | 'green' | 'red' | 'orange' | 'blue'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  color?: Color
}

const colorMap: Record<Color, string> = {
  pink:   'bg-rose-700/10 text-pink-400 border border-rose-700/30',
  purple: 'bg-purple-700/10 text-purple-400 border border-purple-700/30',
  green:  'bg-green-500/10 text-green-400 border border-green-500/20',
  red:    'bg-red-500/10 text-red-400 border border-red-500/20',
  orange: 'bg-orange-500/10 text-orange-300 border border-orange-500/20',
  blue:   'bg-sky-500/10 text-sky-300 border border-sky-500/20',
}

export function Badge({ children, color = 'pink', className = '', ...rest }: BadgeProps) {
  return (
    <span
      {...rest}
      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${colorMap[color]} ${className}`}
    >
      {children}
    </span>
  )
}
