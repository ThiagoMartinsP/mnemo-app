/** Erro HTTP vindo do back (status fora de 2xx). */
export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, body: unknown) {
    super(`HTTP ${status}`)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

/**
 * Traduz qualquer erro (HTTP, rede, parse) em uma mensagem para o usuário.
 * O back ainda não devolve detalhes de validação, então a mensagem é genérica
 * por faixa de status.
 */
export function mensagemAmigavel(erro: unknown): string {
  if (erro instanceof ApiError) {
    if (erro.status >= 400 && erro.status < 500) {
      return 'Os dados enviados foram recusados. Confira os campos e tente de novo.'
    }
    return 'O servidor encontrou um erro ao processar o pedido. Confira os campos e tente de novo.'
  }
  // fetch lança TypeError quando não consegue nem conectar.
  if (erro instanceof TypeError) {
    return 'Não foi possível falar com o back-end. Ele está rodando em localhost:8080?'
  }
  return 'Algo deu errado. Tente de novo.'
}
