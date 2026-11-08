import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { criarTopico, listarTopicos } from './api'

export const topicosKeys = {
  todos: ['topicos'] as const,
}

export function useTopicos() {
  return useQuery({ queryKey: topicosKeys.todos, queryFn: listarTopicos })
}

export function useCriarTopico() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: criarTopico,
    // Um tópico novo muda a lista de tópicos E o ranking de qualquer data.
    // ['ranking'] é literal para não importar da feature ranking; o prefixo
    // casa com ['ranking', <data>]. Queries sem ninguém usando só são marcadas
    // como velhas e refazem o GET quando a tela Hoje for aberta.
    // Não usamos a resposta do POST no cache: ela volta com materia.nome = null.
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: topicosKeys.todos }),
        queryClient.invalidateQueries({ queryKey: ['ranking'] }),
      ]),
  })
}
