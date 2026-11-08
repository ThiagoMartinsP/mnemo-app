import { useState, type FormEvent } from 'react'
import { mensagemAmigavel } from '../../shared/api/errors'
import { isoParaBr } from '../../shared/lib/datas'
import { Button } from '../../shared/ui/Button'
import { Field } from '../../shared/ui/Field'
import { useCriarMateria } from './queries'

export function MateriaForm() {
  // useState aqui é estado de FORMULÁRIO (o que o usuário está digitando),
  // não estado de servidor. Por isso não viola a regra "servidor só via TanStack Query".
  const [nome, setNome] = useState('')
  const [dataProvaIso, setDataProvaIso] = useState('') // '' = sem prova
  const criar = useCriarMateria()

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // impede o submit nativo, que recarregaria a página
    criar.mutate(
      { nome: nome.trim(), data_prova: dataProvaIso ? isoParaBr(dataProvaIso) : null },
      {
        onSuccess: () => {
          setNome('')
          setDataProvaIso('')
        },
      },
    )
  }

  return (
    <form className="form" onSubmit={enviar}>
      <h2>Nova matéria</h2>
      <Field label="Nome" htmlFor="materia-nome">
        <input id="materia-nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
      </Field>
      <Field label="Data da prova" htmlFor="materia-prova" dica="Opcional.">
        <input id="materia-prova" type="date" value={dataProvaIso} onChange={(e) => setDataProvaIso(e.target.value)} />
      </Field>
      {criar.isError && (
        <p className="form__erro" role="alert">
          {mensagemAmigavel(criar.error)}
        </p>
      )}
      <Button type="submit" disabled={criar.isPending || !nome.trim()}>
        {criar.isPending ? 'Salvando…' : 'Adicionar matéria'}
      </Button>
    </form>
  )
}
