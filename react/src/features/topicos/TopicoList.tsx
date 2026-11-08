import { mensagemAmigavel } from '../../shared/api/errors'
import { EstadoCarregando, EstadoErro, EstadoVazio } from '../../shared/ui/Estados'
import { NivelChip } from '../../shared/ui/NivelChip'
import { useTopicos } from './queries'

export function TopicoList() {
  const { data: topicos, isPending, isError, error, refetch } = useTopicos()

  if (isPending) return <EstadoCarregando />
  if (isError) return <EstadoErro mensagem={mensagemAmigavel(error)} onTentarDeNovo={() => refetch()} />
  if (topicos.length === 0) return <EstadoVazio>Nenhum tópico cadastrado.</EstadoVazio>

  return (
    // O wrapper permite rolar a tabela na horizontal em telas estreitas sem quebrar a página.
    <div className="tabela-wrap">
      <table className="tabela">
        <thead>
          <tr>
            <th>Tópico</th>
            <th>Matéria</th>
            <th>Nível</th>
            <th>Dificuldade</th>
            <th>Última vez</th>
          </tr>
        </thead>
        <tbody>
          {topicos.map((t) => (
            <tr key={t.id}>
              <td>{t.nome}</td>
              <td>{t.materia.nome}</td>
              <td>
                <NivelChip nivel={t.nivel} />
              </td>
              <td className="num">{t.dificuldade.toFixed(2)}</td>
              <td className="num">{t.ultima_vez_visto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
