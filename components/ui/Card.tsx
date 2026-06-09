import { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Extra inner padding. Default: 'p-5' */
  padding?: string
}

export function Card({ children, padding = 'p-5', className = '', ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={`bg-[#1a1a24] border border-[#2a2a3a] rounded-xl ${padding} ${className}`}
    >
      {children}
    </div>
  )
}
