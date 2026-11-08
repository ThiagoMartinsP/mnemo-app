import { api } from '../../shared/api/client'

/** POST /test/seedDataBase: endpoint provisório do back que popula o banco H2. */
export function popularBanco(): Promise<void> {
  return api.post<void>('/test/seedDataBase')
}
