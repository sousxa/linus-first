import { RendaCard } from './RendaCard'
import { SaidasFixasCard } from './SaidasFixasCard'
import { ParcelasCard } from './ParcelasCard'

export function Dashboard() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <RendaCard />
      <SaidasFixasCard className="lg:col-span-2" />
      <ParcelasCard className="lg:col-span-3" />
    </div>
  )
}
