import { useState } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Icon, ICON_NAMES } from './icons'

type Props = {
  value?: string
  onChange: (icon: string) => void
  label?: string
}

/** seletor de ícone (Lucide) compacto em popover */
export function IconPicker({ value, onChange, label = 'Ícone' }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <span className="mb-1 block text-sm font-medium text-muted">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Escolher ícone"
        className="flex h-12 w-full items-center justify-center rounded-xl border border-border bg-surface-2 text-text hover:border-primary"
      >
        {value ? <Icon name={value} size={22} /> : <Plus size={20} className="text-muted" />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute z-40 mt-1 max-h-64 w-60 overflow-y-auto rounded-xl border border-border bg-surface p-2 shadow-xl scroll-area">
            <div className="grid grid-cols-6 gap-1">
              {ICON_NAMES.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    onChange(n)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex h-9 items-center justify-center rounded-lg text-text hover:bg-surface-2',
                    value === n && 'bg-surface-2 ring-1 ring-primary',
                  )}
                >
                  <Icon name={n} size={20} />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                onChange('')
                setOpen(false)
              }}
              className="mt-2 w-full rounded-lg py-1.5 text-xs text-muted hover:bg-surface-2"
            >
              sem ícone
            </button>
          </div>
        </>
      )}
    </div>
  )
}
