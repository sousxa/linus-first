import type { InputHTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'
import { cn } from '../../lib/cn'

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode
  hint?: ReactNode
  prefix?: ReactNode
}

/** input rotulado e acessível, com prefixo opcional (ex: R$) */
export function Field({ label, hint, prefix, className, id, ...rest }: FieldProps) {
  const auto = useId()
  const inputId = id ?? auto
  return (
    <label htmlFor={inputId} className="block">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      <span
        className={cn(
          'flex items-center gap-1 rounded-xl border border-border bg-surface-2 px-3 py-2',
          'focus-within:border-primary',
        )}
      >
        {prefix && <span className="select-none text-sm text-muted">{prefix}</span>}
        <input
          id={inputId}
          className={cn(
            'tnum w-full bg-transparent text-sm text-text placeholder:text-muted/60 focus:outline-none',
            className,
          )}
          {...rest}
        />
      </span>
      {hint && <span className="mt-1 block text-[11px] text-muted">{hint}</span>}
    </label>
  )
}
