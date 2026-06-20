// Modelo de dados do app. Tudo isto vive cifrado no localStorage.
import { currentMonth } from './lib/date'

/** onde um gasto é cobrado: na conta (débito) ou num cartão de crédito */
export type Conta =
  | { contaTipo?: 'debito'; cartaoId?: undefined }
  | { contaTipo: 'credito'; cartaoId: string }

export interface SaidaFixa {
  id: string
  nome: string
  valor: number
  diaVencimento: number
  /** meses (YYYY-MM) em que esta saída já foi marcada como paga */
  pagasPorMes: string[]
  /** emoji opcional */
  icone?: string
  /** onde é cobrada — débito (default) ou um cartão */
  contaTipo?: 'debito' | 'credito'
  cartaoId?: string
}

export interface Parcela {
  id: string
  nome: string
  valorParcela: number
  totalParcelas: number
  parcelasPagas: number
  /** primeiro mês da parcela, YYYY-MM */
  mesInicio: string
  icone?: string
  contaTipo?: 'debito' | 'credito'
  cartaoId?: string
}

export interface CartaoCredito {
  id: string
  nome: string
  limite: number
  faturaAtual: number
  diaVencimento: number
  icone?: string
}

export interface Transacao {
  id: string
  data: string // ISO (YYYY-MM-DD)
  descricao: string
  valor: number
  direcao: 'entrada' | 'saida'
  contaTipo: 'debito' | 'credito'
  cartaoId?: string
  /** mês de competência (YYYY-MM) pra agrupar no fechamento */
  mesRef?: string
}

/** resumo de um mês já fechado (histórico, só leitura) */
export interface MesArquivado {
  mes: string
  fechadoEm: string // ISO
  renda: number
  fixasPagas: number
  parcelas: number
  entradas: number
  saidas: number
  saldoFinal: number
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
  /** mês ativo de trabalho (YYYY-MM) */
  mesAtual: string
  /** meses fechados (histórico) */
  arquivoMeses: MesArquivado[]
}

export function emptyData(): AppData {
  return {
    versao: 2,
    saldoDebito: 0,
    renda: { mensal: 0 },
    saidasFixas: [],
    parcelas: [],
    cartoes: [],
    transacoes: [],
    mesAtual: currentMonth(),
    arquivoMeses: [],
  }
}

/** completa dados antigos com os campos novos (não quebra cofres já salvos) */
export function migrate(d: Partial<AppData>): AppData {
  return {
    ...emptyData(),
    ...d,
    mesAtual: d.mesAtual ?? currentMonth(),
    arquivoMeses: d.arquivoMeses ?? [],
  }
}
