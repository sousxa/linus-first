import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

/** modal responsivo: bottom-sheet no mobile, diálogo centralizado no desktop */
export function Modal({
  title,
  onClose,
  children,
}: {
  title: ReactNode
  onClose: () => void
  children: ReactNode
}) {
  // fecha no ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="scroll-area relative max-h-[88vh] w-full overflow-y-auto rounded-t-2xl border border-border bg-surface p-4 pb-6 sm:max-w-md sm:rounded-2xl sm:pb-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-lg p-1 text-muted hover:bg-surface-2 hover:text-text"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
