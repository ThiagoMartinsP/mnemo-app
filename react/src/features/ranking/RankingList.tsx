import { mensagemAmigavel } from '../../shared/api/errors'
import type { DataIso } from '../../shared/lib/datas'
import { EstadoCarregando, EstadoErro, EstadoVazio } from '../../shared/ui/Estados'
import { RankingCard } from './RankingCard'
import { useRanking } from './queries'

export function RankingList({ data }: { data: DataIso }) {
  // Nada de copiar o resultado para useState: o hook já é a fonte da verdade
  // e re-renderiza o componente quando o cache muda.
  const { data: ranking, isPending, isError, error, refetch, isPlaceholderData } = useRanking(data)

  if (isPending) return <EstadoCarregando>Calculando o ranking…</EstadoCarregando>
  if (isError) return <EstadoErro mensagem={mensagemAmigavel(error)} onTentarDeNovo={() => refetch()} />
  if (ranking.length === 0) {
    return <EstadoVazio>Nenhum tópico cadastrado ainda. Cadastre matérias e tópicos para ver o ranking.</EstadoVazio>
  }

  return (
    // aria-busy + opacidade sinalizam que a lista exibida ainda é a da data anterior.
    <ol className="ranking-lista" aria-busy={isPlaceholderData} style={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
      {ranking.map((item, i) => (
        // key estável (id do tópico), não o índice: a ordem muda entre datas.
        <li key={item.topico.id}>
          <RankingCard item={item} posicao={i + 1} dataReferencia={data} />
        </li>
      ))}
    </ol>
  )
}
