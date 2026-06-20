import { SummaryBar } from '../SummaryBar'
import { ForecastTable } from '../ForecastTable'
import { RendaCard } from '../RendaCard'
import { ContaCard } from '../ContaCard'
import { SaidasFixasCard } from '../SaidasFixasCard'
import { ParcelasCard } from '../ParcelasCard'
import { CartoesCard } from '../CartoesCard'
import { CalculadoraCard } from '../CalculadoraCard'

// Desktop: usa a tela inteira. 3 colunas que preenchem a altura; cada uma rola por
// dentro (scroll interno), então a página em si não cresce.
export function DesktopDashboard() {
  return (
    <div className="grid h-full grid-cols-12 gap-4 overflow-hidden p-4">
      <div className="scroll-area col-span-3 space-y-4 overflow-y-auto pr-1">
        <ContaCard />
        <CartoesCard />
      </div>
      <div className="scroll-area col-span-5 space-y-4 overflow-y-auto pr-1">
        <RendaCard />
        <SaidasFixasCard />
        <ParcelasCard />
      </div>
      <div className="scroll-area col-span-4 space-y-4 overflow-y-auto pr-1">
        <SummaryBar />
        <ForecastTable />
        <CalculadoraCard />
      </div>
    </div>
  )
}
