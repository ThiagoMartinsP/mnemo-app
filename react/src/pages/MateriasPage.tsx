import { MateriaForm } from '../features/materias/MateriaForm'
import { MateriaList } from '../features/materias/MateriaList'

export function MateriasPage() {
  return (
    <section>
      <div className="pagina-topo">
        <h1>Matérias</h1>
      </div>
      <div className="duas-colunas">
        <MateriaList />
        <MateriaForm />
      </div>
    </section>
  )
}
