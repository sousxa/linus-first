import { useData } from '../store/VaultContext'
import { Card } from './ui/Card'
import { MoneyInput } from './ui/MoneyInput'

export function RendaCard({ className }: { className?: string }) {
  const { data, update } = useData()
  return (
    <Card title="Renda mensal" icon="💰" className={className}>
      <MoneyInput
        label="Salário / entrada fixa do mês"
        value={data.renda.mensal}
        onValue={(n) => update((d) => ({ ...d, renda: { mensal: n } }))}
      />
      <p className="mt-2 text-[11px] text-muted">Considerada todo mês na sua previsão.</p>
    </Card>
  )
}
