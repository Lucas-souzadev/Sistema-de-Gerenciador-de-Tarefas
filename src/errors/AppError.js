// Erro com código HTTP. Exemplo: throw new AppError('Não encontrado', 404)
export class AppError extends Error {
  constructor(mensagem, status) {
    super(mensagem);
    this.status = status;
  }
}
