import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react'

const BASE = 'bg-[#13131a] border border-[#2a2a3a] text-[#f0eaf5] rounded-lg px-3 py-2 text-[13px] outline-none w-full focus:border-pink-500/50 transition-colors placeholder:text-[#4a4a6a]'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode
}

export function Input({ label, className = '', ...rest }: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#9d8fad] mb-1">
          {label}
        </label>
      )}
      <input className={`${BASE} ${className}`} {...rest} />
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode
  children: ReactNode
}

export function Select({ label, className = '', children, ...rest }: SelectProps) {
  return (
    <div>
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#9d8fad] mb-1">
          {label}
        </label>
      )}
      <select className={`${BASE} ${className}`} {...rest}>{children}</select>
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode
}

export function Textarea({ label, className = '', ...rest }: TextareaProps) {
  return (
    <div>
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-wide text-[#9d8fad] mb-1">
          {label}
        </label>
      )}
      <textarea className={`${BASE} resize-vertical ${className}`} {...rest} />
    </div>
  )
}
