/** Resposta genérica para APIs — não expor detalhes de Postgres/RLS ao cliente. */
export function publicApiErrorMessage(error?: unknown): string {
  void error;
  return "Não foi possível concluir esta operação. Tente novamente.";
}
