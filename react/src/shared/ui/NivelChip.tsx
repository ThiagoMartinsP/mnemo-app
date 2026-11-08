import { Chip } from './Chip'

const NIVEL_MAX = 4

/**
 * Chip colorido pela escada de níveis. Lê --nivel-N e --nivel-N-texto do tokens.css.
 * O clamp evita var(--nivel-7) inexistente: o back hoje não limita o nível (ver CLAUDE.md).
 */
export function NivelChip({ nivel }: { nivel: number }) {
  const n = Math.min(Math.max(Math.trunc(nivel), 0), NIVEL_MAX)
  return (
    <Chip fundo={`var(--nivel-${n})`} cor={`var(--nivel-${n}-texto)`} title={`Nível ${nivel} de ${NIVEL_MAX}`}>
      NÍVEL {nivel}
    </Chip>
  )
}
