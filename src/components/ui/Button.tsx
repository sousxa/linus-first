import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'ghost' | 'danger' | 'subtle'

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:brightness-110',
  ghost: 'bg-transparent text-text hover:bg-surface-2 border border-border',
  danger: 'bg-transparent text-bad hover:bg-bad/10 border border-border',
  subtle: 'bg-surface-2 text-text hover:brightness-110',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

export function Button({ variant = 'primary', className, ...rest }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...rest}
    />
  )
}
