// Modelo de dados do app. Tudo isto vive cifrado no localStorage.

export interface SaidaFixa {
  id: string
  nome: string
  valor: number
  diaVencimento: number
  /** meses (YYYY-MM) em que esta saída já foi marcada como paga */
  pagasPorMes: string[]
}

export interface Parcela {
  id: string
  nome: string
  valorParcela: number
  totalParcelas: number
  parcelasPagas: number
  /** primeiro mês da parcela, YYYY-MM */
  mesInicio: string
}

export interface CartaoCredito {
  id: string
  nome: string
  limite: number
  faturaAtual: number
  diaVencimento: number
}

export interface Transacao {
  id: string
  data: string // ISO (YYYY-MM-DD)
  descricao: string
  valor: number
  direcao: 'entrada' | 'saida'
  contaTipo: 'debito' | 'credito'
  cartaoId?: string
}

export interface AppData {
  versao: number
  /** saldo atual em conta (débito) */
  saldoDebito: number
  renda: { mensal: number }
  saidasFixas: SaidaFixa[]
  parcelas: Parcela[]
  cartoes: CartaoCredito[]
  transacoes: Transacao[]
}

export function emptyData(): AppData {
  return {
    versao: 1,
    saldoDebito: 0,
    renda: { mensal: 0 },
    saidasFixas: [],
    parcelas: [],
    cartoes: [],
    transacoes: [],
  }
}
