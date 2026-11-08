import { ApiError } from './errors'

/**
 * Wrapper fino sobre fetch. Responsabilidades:
 *  - serializar/desserializar JSON;
 *  - transformar status fora de 2xx em ApiError (fetch, sozinho, só rejeita
 *    em falha de rede; um 500 "resolve" normalmente);
 *  - usar URLs relativas: em dev o proxy do Vite encaminha para o Spring.
 */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })

  const texto = await res.text()
  const corpo: unknown = texto ? JSON.parse(texto) : undefined

  if (!res.ok) throw new ApiError(res.status, corpo)
  return corpo as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
}
