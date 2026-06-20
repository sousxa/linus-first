import type { ReactNode } from 'react'

export function Header({ right }: { right?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            💸
          </span>
          <div>
            <h1 className="text-base font-extrabold leading-none">linus-first</h1>
            <p className="text-[11px] text-muted">seu dinheiro, sob controle</p>
          </div>
        </div>
        {right}
      </div>
    </header>
  )
}
