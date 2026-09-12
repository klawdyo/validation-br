/**
 * ExpirationFactor
 * Converte entre o fator de vencimento do boleto bancário e a data que ele representa
 *
 * @doc
 * O fator de vencimento é a quantidade de dias corridos entre uma data-base e o
 * vencimento do boleto, representado em 4 dígitos (0000 a 9999). "0000" indica
 * que o boleto não tem vencimento definido.
 *
 * Esse intervalo de 4 dígitos, contado a partir de 07/10/1997, esgotou em
 * 21/02/2025 e, a partir de 22/02/2025, a Febraban reiniciou a contagem em
 * 1000, usando 29/05/2022 como nova data-base. Como o fator sozinho não indica
 * de qual era ele é, usamos 6000 como corte: fatores menores indicam a era
 * nova (válida até 31/10/2038) e fatores maiores ou iguais indicam a era
 * antiga (válida até 21/02/2025, quando ela se esgotou).
 *
 * Nota para o futuro: quando a era nova se esgotar (por volta de 2038), a
 * data-base usada abaixo deixa de ser válida e um novo corte precisará ser
 * calculado.
 *
 * Fonte: http://portalabbc.org.br/images/content/manual%20operacional.pdf
 */
export class ExpirationFactor {
  private static readonly oldEraBaseDate = new Date('1997-10-07');
  private static readonly newEraBaseDate = new Date('2022-05-29');
  private static readonly newEraStartDate = new Date('2025-02-22');
  private static readonly newEraThreshold = '6000';

  /**
   * Converte o fator de vencimento em data. "0000" representa um boleto sem
   * vencimento definido.
   */
  static toDate(factor: string): Date | null {
    if (factor === '0000') return null;

    const baseDate =
      factor < ExpirationFactor.newEraThreshold
        ? ExpirationFactor.newEraBaseDate
        : ExpirationFactor.oldEraBaseDate;

    const msByDay = 1000 * 60 * 60 * 24;
    const baseDays = baseDate.getTime() / msByDay;

    return new Date((+factor + baseDays) * msByDay);
  }

  /**
   * Converte uma data no fator de vencimento equivalente, escolhendo a era
   * (ver acima) a partir da própria data: a era antiga só é usada para datas
   * até 21/02/2025, quando ela se esgotou.
   */
  static fromDate(date: Date): string {
    const baseDate =
      date < ExpirationFactor.newEraStartDate
        ? ExpirationFactor.oldEraBaseDate
        : ExpirationFactor.newEraBaseDate;

    const msByDay = 1000 * 60 * 60 * 24;
    const days = Math.round(date.getTime() / msByDay - baseDate.getTime() / msByDay);

    return String(days).padStart(4, '0').slice(-4);
  }
}
