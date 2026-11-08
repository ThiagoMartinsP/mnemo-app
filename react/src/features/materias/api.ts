import { api } from '../../shared/api/client'
import type { Materia, NovaMateria } from './types'

export function listarMaterias(): Promise<Materia[]> {
  return api.get<Materia[]>('/materia')
}

export function criarMateria(nova: NovaMateria): Promise<Materia> {
  return api.post<Materia>('/materia', nova)
}
