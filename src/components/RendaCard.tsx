import { useState } from 'react'
import { Wallet, Pencil } from 'lucide-react'
import { useData } from '../store/VaultContext'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import { MoneyInput } from './ui/MoneyInput'
import { formatBRL } from '../lib/format'

export function RendaCard({ className }: { className?: string }) {
  const { data, update } = useData()
  const [editing, setEditing] = useState(false)
  const definida = data.renda.mensal > 0

  return (
    <Card title="Renda mensal" icon={<Wallet size={14} />} className={className}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted">Salário / entrada do mês</p>
          {definida ? (
            <p className="tnum text-3xl font-extrabold text-good">{formatBRL(data.renda.mensal)}</p>
          ) : (
            <p className="text-lg font-semibold text-muted">Defina seu salário</p>
          )}
        </div>
        <Button variant="ghost" onClick={() => setEditing(true)} className="shrink-0">
          <Pencil size={15} /> {definida ? 'Editar' : 'Definir'}
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted">Entra todo mês na sua previsão.</p>

      {editing && (
        <Modal title="Renda mensal" onClose={() => setEditing(false)}>
          <MoneyInput
            label="Salário / entrada fixa do mês"
            value={data.renda.mensal}
            onValue={(n) => update((d) => ({ ...d, renda: { mensal: n } }))}
          />
          <Button onClick={() => setEditing(false)} className="mt-4 w-full">
            Pronto
          </Button>
        </Modal>
      )}
    </Card>
  )
}
