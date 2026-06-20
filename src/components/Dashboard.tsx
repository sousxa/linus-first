import { RendaCard } from './RendaCard'
import { ContaCard } from './ContaCard'
import { SaidasFixasCard } from './SaidasFixasCard'
import { ParcelasCard } from './ParcelasCard'
import { CartoesCard } from './CartoesCard'
import { CalculadoraCard } from './CalculadoraCard'

export function Dashboard() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <RendaCard />
      <ContaCard />
      <CartoesCard className="lg:row-span-2" />
      <SaidasFixasCard className="lg:col-span-2" />
      <ParcelasCard className="lg:col-span-2" />
      <CalculadoraCard />
    </div>
  )
}
