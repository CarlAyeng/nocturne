import type { InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Input({ label, className, ...rest }: InputProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-muted">{label}</label>
      <input
        className={cn(
          'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-white/25 focus:bg-white/10',
          className,
        )}
        {...rest}
      />
    </div>
  )
}