import { useData } from '../../store/VaultContext'

/** chip que mostra onde um item é cobrado: débito ou um cartão */
export function ContaTag({ item }: { item: { contaTipo?: string; cartaoId?: string } }) {
  const { data } = useData()
  if (item.contaTipo === 'credito' && item.cartaoId) {
    const c = data.cartoes.find((x) => x.id === item.cartaoId)
    return (
      <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] text-text">
        {c ? `${c.icone || '💳'} ${c.nome}` : '💳 cartão'}
      </span>
    )
  }
  return <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] text-muted">🏦 Débito</span>
}
