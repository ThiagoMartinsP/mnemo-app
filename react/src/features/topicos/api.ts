import { api } from '../../shared/api/client'
import type { NovoTopico, Topico } from './types'

export function listarTopicos(): Promise<Topico[]> {
  return api.get<Topico[]>('/topico')
}

/**
 * O back ainda não aplica defaults: sem ultima_vez_visto o ranking quebra (NPE)
 * e sem dificuldade ela vira 0.0. Por isso NovoTopico exige os dois campos e o
 * TypeScript não deixa chamar esta função sem eles.
 */
export function criarTopico(novo: NovoTopico): Promise<Topico> {
  return api.post<Topico>('/topico', novo)
}
