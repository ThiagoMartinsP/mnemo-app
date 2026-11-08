import { useMaterias } from '../features/materias/queries'
import { TopicoForm } from '../features/topicos/TopicoForm'
import { TopicoList } from '../features/topicos/TopicoList'

export function TopicosPage() {
  // A página é quem conecta features: lê as matérias de uma e entrega à outra
  // por props. Mesmo cache ['materias'] da tela de Matérias, sem novo GET se estiver fresco.
  const materias = useMaterias()
  const opcoes = (materias.data ?? []).map(({ id, nome }) => ({ id, nome }))

  return (
    <section>
      <div className="pagina-topo">
        <h1>Tópicos</h1>
      </div>
      <div className="duas-colunas">
        <TopicoList />
        <TopicoForm materias={opcoes} carregandoMaterias={materias.isPending} />
      </div>
    </section>
  )
}
