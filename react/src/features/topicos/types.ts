import type { DataBr } from '../../shared/lib/datas'

/** Espelho do JSON de GET /topico. */
export interface Topico {
  id: number
  nome: string
  nivel: number
  dificuldade: number
  ultima_vez_visto: DataBr
  materia: {
    id: number
    nome: string
    data_prova: DataBr | null
  }
}

/** Corpo do POST /topico. A matéria vai só como referência pelo id. */
export interface NovoTopico {
  nome: string
  ultima_vez_visto: DataBr
  nivel: number
  dificuldade: number
  materia: { id: number }
}

/**
 * O que o formulário precisa saber de uma matéria. A página fornece isso
 * (vindo da feature materias) sem que esta feature dependa daquela.
 */
export interface OpcaoMateria {
  id: number
  nome: string
}

export const NIVEIS = [0, 1, 2, 3, 4] as const
export const DIFICULDADE_PADRAO = 0.5
