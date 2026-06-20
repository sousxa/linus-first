import { useEffect, useState, type ReactNode } from 'react'
import { Field } from './Field'
import { parseMoney } from '../../lib/format'

function fmt(n: number): string {
  return n ? n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''
}

type Props = {
  value: number
  onValue: (n: number) => void
  label: ReactNode
  placeholder?: string
  id?: string
}

/** input de dinheiro com prefixo R$, parsing pt-BR e reformatação no blur */
export function MoneyInput({ value, onValue, label, placeholder = '0,00', id }: Props) {
  const [text, setText] = useState(() => fmt(value))
  const [focused, setFocused] = useState(false)

  // sincroniza mudanças externas do valor quando o campo não está em foco
  useEffect(() => {
    if (!focused) setText(fmt(value))
  }, [value, focused])

  return (
    <Field
      label={label}
      id={id}
      prefix="R$"
      inputMode="decimal"
      placeholder={placeholder}
      value={text}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false)
        setText(fmt(value))
      }}
      onChange={(e) => {
        setText(e.target.value)
        onValue(parseMoney(e.target.value))
      }}
    />
  )
}
