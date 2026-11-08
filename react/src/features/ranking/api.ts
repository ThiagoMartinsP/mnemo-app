import { api } from '../../shared/api/client'
import type { DataIso } from '../../shared/lib/datas'
import type { TopicoPontuado } from './types'

/** GET /ranking?date=YYYY-MM-DD. O back já devolve ordenado por score desc. */
export function buscarRanking(data: DataIso): Promise<TopicoPontuado[]> {
  const params = new URLSearchParams({ date: data })
  return api.get<TopicoPontuado[]>(`/ranking?${params}`)
}
