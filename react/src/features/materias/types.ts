import type { DataBr } from '../../shared/lib/datas'

/** Espelho do JSON de GET /materia (e da resposta do POST). */
export interface Materia {
  id: number
  nome: string
  data_prova: DataBr | null
}

/** Corpo do POST /materia. Sem id: quem gera é o banco. */
export interface NovaMateria {
  nome: string
  data_prova: DataBr | null
}
