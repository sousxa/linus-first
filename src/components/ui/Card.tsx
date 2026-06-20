import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type CardProps = {
  title?: ReactNode
  icon?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function Card({ title, icon, action, children, className }: CardProps) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5',
        className,
      )}
    >
      {(title || action) && (
        <header className="mb-3 flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
            {icon}
            {title}
          </h2>
          {action}
        </header>
      )}
      {children}
    </section>
  )
}
