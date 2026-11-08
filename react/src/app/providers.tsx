import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  // useState com inicializador garante UM QueryClient por montagem do app:
  // ele é o cache. Recriá-lo a cada render jogaria o cache fora.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Dados "frescos" por 30s: navegar entre telas não refaz o GET à toa.
            // Depois disso, o próximo uso dispara um refetch em segundo plano.
            staleTime: 30_000,
            // Repetir em erro de validação (4xx) não adianta; 1 tentativa basta
            // para cobrir um soluço de rede.
            retry: 1,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools buttonPosition="bottom-left" />}
    </QueryClientProvider>
  )
}
