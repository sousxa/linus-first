import type { ReactNode } from 'react'
import { Wallet } from 'lucide-react'

export function Header({ left, right }: { left?: ReactNode; right?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur">
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          {left}
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Wallet size={18} />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-base font-extrabold leading-none">linus-first</h1>
            <p className="text-xs text-muted">seu dinheiro, sob controle</p>
          </div>
        </div>
        {right}
      </div>
    </header>
  )
}
