import { useState } from 'react'
import { Landmark, Pencil } from 'lucide-react'
import { useData } from '../store/VaultContext'
import { cn } from '../lib/cn'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import { MoneyInput } from './ui/MoneyInput'
import { formatBRL } from '../lib/format'

export function ContaCard({ className }: { className?: string }) {
  const { data, update } = useData()
  const [editing, setEditing] = useState(false)

  return (
    <Card title="Conta (débito)" icon={<Landmark size={14} />} className={className}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted">Saldo atual em conta</p>
          <p
            className={cn(
              'tnum text-3xl font-extrabold',
              data.saldoDebito >= 0 ? 'text-text' : 'text-bad',
            )}
          >
            {formatBRL(data.saldoDebito)}
          </p>
        </div>
        <Button variant="ghost" onClick={() => setEditing(true)} className="shrink-0">
          <Pencil size={15} /> Editar
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted">É o ponto de partida da sua previsão.</p>

      {editing && (
        <Modal title="Saldo em conta" onClose={() => setEditing(false)}>
          <MoneyInput
            label="Saldo atual em conta (débito)"
            value={data.saldoDebito}
            onValue={(n) => update((d) => ({ ...d, saldoDebito: n }))}
          />
          <Button onClick={() => setEditing(false)} className="mt-4 w-full">
            Pronto
          </Button>
        </Modal>
      )}
    </Card>
  )
}
