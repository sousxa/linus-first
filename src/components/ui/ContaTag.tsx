import { Landmark } from 'lucide-react'
import { useData } from '../../store/VaultContext'
import { Icon } from './icons'

/** chip que mostra onde um item é cobrado: débito ou um cartão */
export function ContaTag({ item }: { item: { contaTipo?: string; cartaoId?: string } }) {
  const { data } = useData()
  if (item.contaTipo === 'credito' && item.cartaoId) {
    const c = data.cartoes.find((x) => x.id === item.cartaoId)
    return (
      <span className="inline-flex items-center gap-1 rounded bg-surface px-1.5 py-0.5 text-xs text-text">
        {c?.icone ? <Icon name={c.icone} size={12} /> : null}
        {c ? c.nome : 'cartão'}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded bg-surface px-1.5 py-0.5 text-xs text-muted">
      <Landmark size={12} />
      Débito
    </span>
  )
}
