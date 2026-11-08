import { useMutation, useQueryClient } from '@tanstack/react-query'
import { popularBanco } from './api'

export function useSeed() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: popularBanco,
    // O seed mexe em tudo. As chaves-raiz entram como literais para não importar
    // de outras features. O prefixo ['ranking'] invalida o ranking de qualquer data.
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['materias'] }),
        queryClient.invalidateQueries({ queryKey: ['topicos'] }),
        queryClient.invalidateQueries({ queryKey: ['ranking'] }),
      ]),
  })
}
