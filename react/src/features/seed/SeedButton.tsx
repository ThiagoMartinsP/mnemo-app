import { mensagemAmigavel } from '../../shared/api/errors'
import { Button } from '../../shared/ui/Button'
import { useSeed } from './queries'

export function SeedButton() {
  const seed = useSeed()

  function popular() {
    // O seed do back não é idempotente: rodar duas vezes duplica os dados.
    if (!window.confirm('Popular o banco com dados de exemplo? Rodar de novo duplica os registros.')) return
    seed.mutate()
  }

  return (
    <span className="seed">
      <Button type="button" variante="secundario" onClick={popular} disabled={seed.isPending}>
        {seed.isPending ? 'Populando…' : 'Popular banco (seed)'}
      </Button>
      {seed.isError && <small className="seed__erro">{mensagemAmigavel(seed.error)}</small>}
    </span>
  )
}
