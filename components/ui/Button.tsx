import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const variantStyles: Record<string, string> = {
  primary:   'bg-gradient-to-br from-rose-700 to-pink-500 text-white border-0 hover:opacity-90',
  secondary: 'bg-transparent text-[#9d8fad] border border-[#2a2a3a] hover:text-white',
  danger:    'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
  ghost:     'bg-transparent text-[#9d8fad] border-0 hover:text-white',
}

const sizeStyles: Record<string, string> = {
  sm: 'text-xs px-3 py-1.5 rounded-lg',
  md: 'text-sm px-4 py-2 rounded-lg',
  lg: 'text-sm px-6 py-3 rounded-xl font-semibold',
}

export function Button({ variant = 'primary', size = 'md', className = '', disabled, children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={[
        'font-semibold transition-opacity cursor-pointer',
        variantStyles[variant],
        sizeStyles[size],
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}
