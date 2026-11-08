import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { criarMateria, listarMaterias } from './api'

export const materiasKeys = {
  todas: ['materias'] as const,
}

export function useMaterias() {
  return useQuery({ queryKey: materiasKeys.todas, queryFn: listarMaterias })
}

export function useCriarMateria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: criarMateria,
    // Invalidar marca a lista como velha. Quem estiver usando useMaterias
    // (esta tela, o <select> da tela de Tópicos) refaz o GET sozinho.
    // Retornar a Promise faz a mutation só "terminar" quando a lista nova chegar.
    // O ranking não muda: uma matéria nova ainda não tem tópicos.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: materiasKeys.todas }),
  })
}
