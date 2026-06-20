import { useState } from 'react'
import { cn } from '../../lib/cn'

const ICONS = [
  '🏠', '🏦', '💳', '💡', '💧', '🔥',
  '📱', '📶', '📺', '🎵', '🎮', '🛒',
  '🍔', '☕', '🚗', '⛽', '🚌', '✈️',
  '💊', '🏥', '🏋️', '📚', '🎓', '🐶',
  '🎁', '💼', '🧾', '💰', '🍺', '💅',
]

type Props = {
  value?: string
  onChange: (icon: string) => void
  label?: string
}

/** seletor de emoji compacto (popover com grade + opção de limpar) */
export function IconPicker({ value, onChange, label = 'Ícone' }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Escolher ícone"
        className="flex h-[42px] w-full items-center justify-center rounded-xl border border-border bg-surface-2 text-xl hover:border-primary"
      >
        {value || '➕'}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute z-40 mt-1 w-56 rounded-xl border border-border bg-surface p-2 shadow-xl">
            <div className="grid grid-cols-6 gap-1">
              {ICONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onChange(i)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex h-8 items-center justify-center rounded-lg text-lg hover:bg-surface-2',
                    value === i && 'bg-surface-2 ring-1 ring-primary',
                  )}
                >
                  {i}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                onChange('')
                setOpen(false)
              }}
              className="mt-2 w-full rounded-lg py-1 text-[11px] text-muted hover:bg-surface-2"
            >
              sem ícone
            </button>
          </div>
        </>
      )}
    </div>
  )
}
