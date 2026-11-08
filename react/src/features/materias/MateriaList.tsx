import { mensagemAmigavel } from '../../shared/api/errors'
import { EstadoCarregando, EstadoErro, EstadoVazio } from '../../shared/ui/Estados'
import { useMaterias } from './queries'

export function MateriaList() {
  const { data: materias, isPending, isError, error, refetch } = useMaterias()

  if (isPending) return <EstadoCarregando />
  if (isError) return <EstadoErro mensagem={mensagemAmigavel(error)} onTentarDeNovo={() => refetch()} />
  if (materias.length === 0) return <EstadoVazio>Nenhuma matéria cadastrada.</EstadoVazio>

  return (
    <table className="tabela">
      <thead>
        <tr>
          <th>Matéria</th>
          <th>Prova</th>
        </tr>
      </thead>
      <tbody>
        {materias.map((m) => (
          <tr key={m.id}>
            <td>{m.nome}</td>
            <td className="num">{m.data_prova ?? <span className="sem-valor">sem prova</span>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
