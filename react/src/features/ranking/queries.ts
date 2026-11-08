import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { DataIso } from '../../shared/lib/datas'
import { buscarRanking } from './api'

/**
 * Fábrica de query keys. A chave identifica o dado no cache: cada data tem a
 * sua entrada (['ranking', '2026-11-08']). Invalidar ['ranking'] atinge todas,
 * porque o TanStack Query compara chaves por prefixo.
 */
export const rankingKeys = {
  todos: ['ranking'] as const,
  porData: (data: DataIso) => ['ranking', data] as const,
}

export function useRanking(data: DataIso) {
  return useQuery({
    queryKey: rankingKeys.porData(data),
    queryFn: () => buscarRanking(data),
    // Ao trocar a data, mantém a lista anterior na tela enquanto a nova chega,
    // em vez de piscar o estado de "carregando". isPlaceholderData indica isso.
    placeholderData: keepPreviousData,
  })
}
