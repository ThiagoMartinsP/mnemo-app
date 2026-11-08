/**
 * Logo da direção B: 5 degraus com alturas em escala log dos intervalos
 * (1, 3, 6, 12, 24 dias), um em cada cor de nível. Puro SVG, escala sem perder nitidez.
 */
export function Logo() {
  return (
    <svg className="logo" viewBox="0 0 134 106" height="28" role="img" aria-label="MNEMO">
      <rect x="0" y="80" width="22" height="26" rx="3" fill="var(--nivel-0)" />
      <rect x="28" y="56" width="22" height="50" rx="3" fill="var(--nivel-1)" />
      <rect x="56" y="40" width="22" height="66" rx="3" fill="var(--nivel-2)" />
      <rect x="84" y="22" width="22" height="84" rx="3" fill="var(--nivel-3)" />
      <rect x="112" y="4" width="22" height="102" rx="3" fill="var(--nivel-4)" />
    </svg>
  )
}
