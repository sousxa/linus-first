import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'ghost' | 'danger' | 'subtle'

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-black hover:bg-primary/90',
  ghost: 'bg-transparent text-text border border-border hover:bg-surface-2',
  danger: 'bg-transparent text-bad border border-bad/50 hover:bg-bad/10',
  subtle: 'bg-surface-2 text-text border border-border hover:bg-border',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

export function Button({ variant = 'primary', className, ...rest }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        variants[variant],
        className,
      )}
      {...rest}
    />
  )
}
