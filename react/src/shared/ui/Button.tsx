import type { ButtonHTMLAttributes } from 'react'

type Variante = 'primario' | 'secundario'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
}

/** Repassa todas as props nativas de <button> (onClick, disabled, type...). */
export function Button({ variante = 'primario', className = '', ...props }: ButtonProps) {
  return <button className={`btn btn--${variante} ${className}`.trim()} {...props} />
}
