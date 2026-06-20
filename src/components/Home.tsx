import { ChevronRight } from 'lucide-react'
import { SummaryBar } from './SummaryBar'
import { NAV, type View } from './navConfig'

/** home do mobile: resumo + containers que abrem cada seção */
export function Home({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <div className="scroll-area h-full space-y-4 overflow-y-auto p-4 pb-8">
      <SummaryBar />
      <div className="grid grid-cols-2 gap-3">
        {NAV.map((it) => (
          <button
            key={it.id}
            onClick={() => onNavigate(it.id)}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 text-left transition active:bg-surface-2"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <it.icon size={22} />
            </span>
            <div className="flex items-end justify-between">
              <div>
                <p className="font-semibold">{it.label}</p>
                <p className="text-sm text-muted">{it.desc}</p>
              </div>
              <ChevronRight size={18} className="text-muted" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
