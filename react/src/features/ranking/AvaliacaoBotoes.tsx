// Os botões existem desde já para fixar o layout do card, mas ficam
// desativados: o endpoint de avaliação pós-sessão ainda não existe no back.
const MOTIVO = 'Em breve: o back-end ainda não tem o endpoint de avaliação.'

export function AvaliacaoBotoes() {
  return (
    <div className="avaliacao" role="group" aria-label="Avaliar sessão de estudo">
      <button type="button" className="avaliacao__btn avaliacao__btn--tranquilo" disabled title={MOTIVO}>
        ↑ Tranquilo
      </button>
      <button type="button" className="avaliacao__btn avaliacao__btn--esforco" disabled title={MOTIVO}>
        → Com esforço
      </button>
      <button type="button" className="avaliacao__btn avaliacao__btn--esqueci" disabled title={MOTIVO}>
        ↺ Esqueci
      </button>
    </div>
  )
}
