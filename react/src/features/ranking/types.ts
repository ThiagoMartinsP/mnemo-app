import type { DataBr } from '../../shared/lib/datas'

// Espelho EXATO do JSON de GET /ranking (conferido com o back rodando).
// Os nomes em snake_case vêm do @JsonProperty do Spring.
// Esta feature declara só a forma que ELA consome; não importa os types de
// materias/ nem de topicos/, para manter as features independentes.

export interface MateriaNoRanking {
  id: number
  nome: string
  data_prova: DataBr | null
}

export interface TopicoNoRanking {
  id: number
  nome: string
  nivel: number
  dificuldade: number
  ultima_vez_visto: DataBr
  materia: MateriaNoRanking
}

export interface TopicoPontuado {
  topico: TopicoNoRanking
  score: number
}
