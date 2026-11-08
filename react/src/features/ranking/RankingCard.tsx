import { brParaIso, diasEntre, type DataIso } from '../../shared/lib/datas'
import { Card } from '../../shared/ui/Card'
import { Chip } from '../../shared/ui/Chip'
import { AvaliacaoBotoes } from './AvaliacaoBotoes'
import type { TopicoPontuado } from './types'

interface RankingCardProps {
  item: TopicoPontuado
  posicao: number
  /** Data de referência do ranking: "dias até a prova" é contado a partir dela, não de hoje. */
  dataReferencia: DataIso
}

function rotuloProva(dias: number): string {
  if (dias < 0) return 'PROVA PASSOU'
  if (dias === 0) return 'PROVA HOJE'
  return `PROVA ${dias}d`
}

export function RankingCard({ item, posicao, dataReferencia }: RankingCardProps) {
  const { topico, score } = item
  const { materia } = topico
  const diasProva = materia.data_prova ? diasEntre(dataReferencia, brParaIso(materia.data_prova)) : null

  return (
    <Card className="ranking-card">
      <div className="ranking-card__topo">
        <span className="ranking-card__posicao">#{posicao}</span>
        <div className="ranking-card__info">
          <h3 className="ranking-card__nome">{topico.nome}</h3>
          <div className="ranking-card__chips">
            <Chip>NÍVEL {topico.nivel}</Chip>
            <Chip>{materia.nome}</Chip>
            {diasProva !== null && <Chip title={`Prova em ${materia.data_prova}`}>{rotuloProva(diasProva)}</Chip>}
          </div>
        </div>
        <div className="ranking-card__score">
          {score.toFixed(2)}
          <small>SCORE</small>
        </div>
      </div>
      <AvaliacaoBotoes />
    </Card>
  )
}
