import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  /** id do controle: liga o <label> ao input (clique no rótulo foca o campo, leitores de tela leem o nome). */
  htmlFor: string
  dica?: string
  children: ReactNode
}

export function Field({ label, htmlFor, dica, children }: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {dica && <small className="field__dica">{dica}</small>}
    </div>
  )
}
