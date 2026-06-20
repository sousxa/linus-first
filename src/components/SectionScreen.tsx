import type { View } from './navConfig'
import { ForecastTable } from './ForecastTable'
import { CalculadoraCard } from './CalculadoraCard'
import { RendaCard } from './RendaCard'
import { ContaCard } from './ContaCard'
import { SaidasFixasCard } from './SaidasFixasCard'
import { ParcelasCard } from './ParcelasCard'
import { CartoesCard } from './CartoesCard'

/** conteúdo de uma seção (mobile), aberto a partir da home */
export function SectionScreen({ view }: { view: View }) {
  return (
    <div className="scroll-area h-full space-y-4 overflow-y-auto p-4 pb-8">
      {view === 'previsao' && <ForecastTable />}
      {view === 'lancar' && <CalculadoraCard />}
      {view === 'fixas' && (
        <>
          <RendaCard />
          <SaidasFixasCard />
        </>
      )}
      {view === 'parcelas' && <ParcelasCard />}
      {view === 'cartoes' && (
        <>
          <ContaCard />
          <CartoesCard />
        </>
      )}
    </div>
  )
}
