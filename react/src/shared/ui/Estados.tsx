import type { ReactNode } from 'react'

export function EstadoCarregando({ children = 'Carregando…' }: { children?: ReactNode }) {
  // role="status" faz leitores de tela anunciarem a mudança sem roubar o foco.
  return (
    <p className="estado" role="status">
      {children}
    </p>
  )
}

export function EstadoErro({ mensagem, onTentarDeNovo }: { mensagem: string; onTentarDeNovo?: () => void }) {
  return (
    <div className="estado estado--erro" role="alert">
      <p>{mensagem}</p>
      {onTentarDeNovo && (
        <button type="button" className="btn btn--secundario" onClick={onTentarDeNovo}>
          Tentar de novo
        </button>
      )}
    </div>
  )
}

export function EstadoVazio({ children }: { children: ReactNode }) {
  return <p className="estado estado--vazio">{children}</p>
}
