import { useState, type FormEvent } from 'react'
import { mensagemAmigavel } from '../../shared/api/errors'
import { hojeIso, isoParaBr } from '../../shared/lib/datas'
import { Button } from '../../shared/ui/Button'
import { Field } from '../../shared/ui/Field'
import { useCriarTopico } from './queries'
import { DIFICULDADE_PADRAO, NIVEIS, type OpcaoMateria } from './types'

interface TopicoFormProps {
  materias: OpcaoMateria[]
  carregandoMaterias: boolean
}

export function TopicoForm({ materias, carregandoMaterias }: TopicoFormProps) {
  const [nome, setNome] = useState('')
  const [materiaId, setMateriaId] = useState('') // <select> trabalha com string
  const [ultimaVezIso, setUltimaVezIso] = useState(hojeIso)
  const [nivel, setNivel] = useState(0)
  const [dificuldade, setDificuldade] = useState(DIFICULDADE_PADRAO)
  const criar = useCriarTopico()

  const semMaterias = !carregandoMaterias && materias.length === 0
  const podeEnviar = nome.trim() !== '' && materiaId !== '' && !criar.isPending

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    criar.mutate(
      {
        nome: nome.trim(),
        // Campo de data apagado → volta ao padrão "hoje" (o back não aceita sem).
        ultima_vez_visto: isoParaBr(ultimaVezIso || hojeIso()),
        nivel,
        dificuldade,
        materia: { id: Number(materiaId) },
      },
      {
        // Limpa só o nome: a matéria, a data e os ajustes costumam se repetir
        // ao cadastrar vários tópicos seguidos.
        onSuccess: () => setNome(''),
      },
    )
  }

  return (
    <form className="form" onSubmit={enviar}>
      <h2>Novo tópico</h2>

      <Field label="Nome" htmlFor="topico-nome">
        <input id="topico-nome" required value={nome} onChange={(e) => setNome(e.target.value)} />
      </Field>

      <Field
        label="Matéria"
        htmlFor="topico-materia"
        dica={semMaterias ? 'Cadastre uma matéria primeiro.' : undefined}
      >
        <select
          id="topico-materia"
          required
          value={materiaId}
          onChange={(e) => setMateriaId(e.target.value)}
          disabled={carregandoMaterias || semMaterias}
        >
          <option value="" disabled>
            {carregandoMaterias ? 'Carregando…' : 'Selecione…'}
          </option>
          {materias.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Última vez visto" htmlFor="topico-ultima">
        <input id="topico-ultima" type="date" value={ultimaVezIso} onChange={(e) => setUltimaVezIso(e.target.value)} />
      </Field>

      <Field label="Nível" htmlFor="topico-nivel" dica="0 = recém-aprendido · 4 = dominado">
        <select id="topico-nivel" value={nivel} onChange={(e) => setNivel(Number(e.target.value))}>
          {NIVEIS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </Field>

      <Field label={`Dificuldade: ${dificuldade.toFixed(2)}`} htmlFor="topico-dificuldade" dica="0 = fácil · 0,5 = neutro · 1 = difícil">
        <input
          id="topico-dificuldade"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={dificuldade}
          onChange={(e) => setDificuldade(Number(e.target.value))}
        />
      </Field>

      {criar.isError && (
        <p className="form__erro" role="alert">
          {mensagemAmigavel(criar.error)}
        </p>
      )}
      <Button type="submit" disabled={!podeEnviar}>
        {criar.isPending ? 'Salvando…' : 'Adicionar tópico'}
      </Button>
    </form>
  )
}
