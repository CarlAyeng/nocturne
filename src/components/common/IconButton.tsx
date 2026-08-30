import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required for accessibility — icon-only controls need a name. */
  label: string
  size?: 'sm' | 'md' | 'lg'
  active?: boolean
  tone?: 'default' | 'accent'
}

const sizes = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, size = 'md', active = false, tone = 'default', className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-all duration-200 hover:bg-white/10 active:scale-90',
        'text-muted hover:text-ink',
        active && (tone === 'accent' ? 'text-accent hover:text-accent' : 'text-primary-soft hover:text-primary-soft'),
        sizes[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
})
