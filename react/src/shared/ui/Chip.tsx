import type { CSSProperties, ReactNode } from 'react'

interface ChipProps {
  children: ReactNode
  /** Cor de fundo (aceita var(--token)). */
  fundo?: string
  /** Cor do texto. */
  cor?: string
  title?: string
}

export function Chip({ children, fundo, cor, title }: ChipProps) {
  const style: CSSProperties = { background: fundo, color: cor }
  return (
    <span className="chip" style={style} title={title}>
      {children}
    </span>
  )
}
