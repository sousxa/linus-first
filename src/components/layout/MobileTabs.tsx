import { useState } from 'react'
import { cn } from '../../lib/cn'
import { SummaryBar } from '../SummaryBar'
import { ForecastTable } from '../ForecastTable'
import { RendaCard } from '../RendaCard'
import { ContaCard } from '../ContaCard'
import { SaidasFixasCard } from '../SaidasFixasCard'
import { ParcelasCard } from '../ParcelasCard'
import { CartoesCard } from '../CartoesCard'
import { CalculadoraCard } from '../CalculadoraCard'

type TabId = 'resumo' | 'lancar' | 'fixas' | 'cartoes'

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'resumo', label: 'Resumo', icon: '📊' },
  { id: 'lancar', label: 'Lançar', icon: '🧮' },
  { id: 'fixas', label: 'Fixas', icon: '🔁' },
  { id: 'cartoes', label: 'Cartões', icon: '💳' },
]

// Mobile-first: uma aba por vez (cabe na tela) + bottom-nav fixa.
export function MobileTabs() {
  const [tab, setTab] = useState<TabId>('resumo')

  return (
    <div className="flex h-full flex-col">
      <div className="scroll-area flex-1 space-y-4 overflow-y-auto p-4 pb-24">
        {tab === 'resumo' && (
          <>
            <SummaryBar />
            <ForecastTable />
          </>
        )}
        {tab === 'lancar' && <CalculadoraCard />}
        {tab === 'fixas' && (
          <>
            <RendaCard />
            <SaidasFixasCard />
            <ParcelasCard />
          </>
        )}
        {tab === 'cartoes' && (
          <>
            <ContaCard />
            <CartoesCard />
          </>
        )}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors',
              tab === t.id ? 'text-primary' : 'text-muted',
            )}
          >
            <span className="text-lg leading-none" aria-hidden>
              {t.icon}
            </span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
