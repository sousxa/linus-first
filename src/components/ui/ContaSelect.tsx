import { useData } from '../../store/VaultContext'

type Props = {
  /** 'debito' ou o id de um cartão */
  value: string
  onChange: (value: string) => void
  label?: string
}

/** seletor de onde o gasto é cobrado: débito ou um cartão de crédito */
export function ContaSelect({ value, onChange, label = 'Cobrar em' }: Props) {
  const { data } = useData()
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[42px] w-full rounded-xl border border-border bg-surface-2 px-3 text-sm focus:border-primary focus:outline-none"
      >
        <option value="debito">🏦 Débito (conta)</option>
        {data.cartoes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.icone || '💳'} {c.nome}
          </option>
        ))}
      </select>
    </label>
  )
}

/** converte a seleção do ContaSelect em campos do item */
export function contaFromValue(value: string): { contaTipo: 'debito' | 'credito'; cartaoId?: string } {
  return value === 'debito'
    ? { contaTipo: 'debito', cartaoId: undefined }
    : { contaTipo: 'credito', cartaoId: value }
}

/** valor do ContaSelect a partir de um item */
export function valueFromConta(item: { contaTipo?: string; cartaoId?: string }): string {
  return item.contaTipo === 'credito' && item.cartaoId ? item.cartaoId : 'debito'
}
