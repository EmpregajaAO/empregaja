/**
 * Calcula os dias restantes até a data de expiração da vaga
 */
export const calcularDiasRestantes = (dataExpiracao: string | null): number | null => {
  if (!dataExpiracao) return null;
  
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  const expiracao = new Date(dataExpiracao);
  expiracao.setHours(0, 0, 0, 0);
  
  const diffTime = expiracao.getTime() - hoje.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Formata a mensagem de dias restantes para candidatura
 */
export const formatarDiasRestantes = (dias: number | null): string | null => {
  if (dias === null) return null;
  if (dias < 0) return "Expirado";
  if (dias === 0) return "Último dia";
  if (dias === 1) return "1 dia restante";
  return `${dias} dias restantes`;
};
