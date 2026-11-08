import { useSearchParams } from 'react-router'
import { RankingList } from '../features/ranking/RankingList'
import { hojeIso } from '../shared/lib/datas'
import { Field } from '../shared/ui/Field'

export function HojePage() {
  // A data escolhida é estado de UI, não de servidor: fica na URL (?data=AAAA-MM-DD).
  // Assim um F5 ou um link compartilhado mantém o dia selecionado.
  const [params, setParams] = useSearchParams()
  const data = params.get('data') ?? hojeIso()

  function mudarData(nova: string) {
    // Campo limpo (string vazia) volta para hoje. replace evita encher o histórico a cada clique.
    setParams(nova ? { data: nova } : {}, { replace: true })
  }

  return (
    <section>
      <div className="pagina-topo">
        <h1>Hoje</h1>
        <Field label="Data do ranking" htmlFor="data-ranking">
          <input id="data-ranking" type="date" value={data} onChange={(e) => mudarData(e.target.value)} />
        </Field>
      </div>
      <RankingList data={data} />
    </section>
  )
}
