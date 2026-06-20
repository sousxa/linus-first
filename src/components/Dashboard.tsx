import { RendaCard } from './RendaCard'
import { SaidasFixasCard } from './SaidasFixasCard'

export function Dashboard() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <RendaCard />
      <SaidasFixasCard className="lg:col-span-2" />
    </div>
  )
}
