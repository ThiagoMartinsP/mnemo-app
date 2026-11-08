/**
 * Ponto ÚNICO de conversão de datas. Dois formatos circulam no app:
 *  - ISO  "YYYY-MM-DD": <input type="date">, query param do /ranking, estado de UI;
 *  - BR   "dd/MM/yyyy": corpo JSON do back (@JsonFormat no Spring).
 *
 * Trabalhamos com strings e componentes de data em vez de `new Date("2026-11-08")`,
 * porque esse construtor interpreta a string como UTC à meia-noite. No Brasil
 * (UTC-3) isso vira o dia ANTERIOR às 21h, um bug clássico de "data um dia antes".
 */

export type DataIso = string // "YYYY-MM-DD"
export type DataBr = string // "dd/MM/yyyy"

const pad = (n: number) => String(n).padStart(2, '0')

/** Data local de hoje em ISO (sem passar por UTC). */
export function hojeIso(): DataIso {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function isoParaBr(iso: DataIso): DataBr {
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}

export function brParaIso(br: DataBr): DataIso {
  const [d, m, a] = br.split('/')
  return `${a}-${m}-${d}`
}

/** Dias de `de` até `ate` (negativo se `ate` já passou). Contagem por dia de calendário. */
export function diasEntre(de: DataIso, ate: DataIso): number {
  const MS_DIA = 86_400_000
  // Date.UTC evita o deslocamento de fuso e o horário de verão: os dois lados ficam em UTC.
  const utc = (iso: DataIso) => {
    const [a, m, d] = iso.split('-').map(Number)
    return Date.UTC(a, m - 1, d)
  }
  return Math.round((utc(ate) - utc(de)) / MS_DIA)
}
