import { CalendarRange, Calculator, Repeat, Receipt, CreditCard, type LucideIcon } from 'lucide-react'

export type View = 'home' | 'previsao' | 'lancar' | 'fixas' | 'parcelas' | 'cartoes' | 'config'

export const NAV: { id: Exclude<View, 'home'>; label: string; desc: string; icon: LucideIcon }[] = [
  { id: 'previsao', label: 'Previsão', desc: 'Próximos meses', icon: CalendarRange },
  { id: 'lancar', label: 'Lançar', desc: 'Gasto ou entrada', icon: Calculator },
  { id: 'fixas', label: 'Fixas & renda', desc: 'Salário e contas', icon: Repeat },
  { id: 'parcelas', label: 'Parcelas', desc: 'Compras parceladas', icon: Receipt },
  { id: 'cartoes', label: 'Cartões', desc: 'Crédito e saldo', icon: CreditCard },
]
