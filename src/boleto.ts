/**
 * Boleto
 *
 * WIP: parse() já separa os campos da linha digitável/código de barras,
 * mas validate()/checksum()/fake() ainda não implementam o cálculo real
 * do dígito verificador (módulo 10/módulo 11) e lançam "Not implemented".
 */

import { InvalidChecksumException } from './_exceptions/ValidationBRError';
import { Base } from './base';

export class Boleto extends Base {
  protected _mask = '00000.00000 00000.000000 00000.000000 0 00000000000000';

  protected static barcodeBounds: Record<string, [number, number]> = {
    // Código do banco
    bank: [0, 3],
    // Moeda = 9 (real)
    currency: [3, 4],
    // DV principal
    mainChecksum: [4, 5],
    // Fator de vencimento. Dias passados desde 07/10/1997
    expirationFactor: [5, 9],
    // Valor do boleto
    amount: [9, 19],
    // Parte variável do banco
    variablePart: [19, 44],
  };

  protected static lineBounds: Record<string, [number, number]> = {
    bank: [0, 3], // banco/moeda
    currency: [3, 4], // banco/moeda
    mainChecksum: [32, 33], // dv geral
    expirationFactor: [33, 37], // fator vencimento
    amount: [37, 47], // valor
    type: [4, 9], // carteira-parte1
    lineChecksum1: [9, 10], // Ignore o  DV1 da linha digitável
    number: [10, 20], // nosso numero
    lineChecksum2: [20, 21], // Ignore o DV2 da linha digitável
    account: [21, 31], // conta corrent
    lineChecksum3: [31, 32], // Ignore o  DV3 da linha digitável
  };

  constructor(protected _value: string) {
    super(_value);

    this.normalize();

    if (!this.validate()) {
      throw new InvalidChecksumException();
    }
  }

  static fromBarcode(barcode: string): Record<string, unknown> {
    return Boleto.parse(Boleto.barcodeBounds, barcode);
  }

  //
  //
  //
  //
  //
  //

  protected normalize(): void {
    this._value = this._value.replace(/[\s.]/g, '');
  }

  /**
   * parse()
   * Valida se um número é válido e
   * retorna uma exceção se não estiver
   */
  static parse(bounds: Record<string, [number, number]>, value: string): Record<string, unknown> {
    // Valor de saída
    const output: Record<string, string> = <Record<string, string>>{};

    // Loop pelas chaves
    Object.entries(bounds).forEach(([key, bounds]) => {
      output[key] = value.substring(bounds[0], bounds[1] || bounds[0]);
    });

    return {
      expires_at: expirationFactorToDate(output.expirationFactor),
      amount_number: Number(output.amount) / 100,
      ...output,
    };
  }

  /**
   * validate()
   * Valida se um número é válido e
   * retorna uma exceção se não estiver
   */
  protected validate(): boolean {
    throw new Error('Not implemented');
  }

  //
  //
  //
  //
  //
  //

  /**
   *
   * checksum()
   * Calcula o dígito verificador de um número SEM o dígito incluído
   *
   */
  static checksum(_value: string): string {
    throw new Error('Not implemented');
  }

  /**
   *
   * Cria um número fake
   *
   */
  static fake(): Boleto {
    throw new Error('Not implemented');
  }
}

export interface BoletoParse {
  expires_at: Date;
  // Valor convertido em número
  amount_number: number;
  // Forma que o banco usa para exibir os dados do
  // emissor no boleto bancário
  emitter: string;
  // Logo
  logo: string;
  //
  slug: string;

  // Dados comuns a todos os boletos

  // Código do Banco
  bank: string;
  // Moeda
  currency: string;
  // Dígito verificador principal
  mainChecksum: string;
  // Fator de vencimento: string
  expirationFactor: string;
  // Valor em string com 10 caracteres
  amount: string;

  // Parte específica do banco.
  // Estes caracteres podem conter basicamente qualquer informação
  // que o banco ache relevante. Alguns bancos informam nosso número,
  // número de agência, número de conta, outros usam código de cliente etc.
  // Cada banco trabalha com um padrão diferente.
  variablePart: string;
}

/**
 * Calcula a data a partir de um fator de vencimento
 
 * @returns {Date} objeto de data
 */
export function expirationFactorToDate(factor: string) {
  if (factor === '0000') {
    return null;
  }

  const msByDay = 1000 * 60 * 60 * 24;
  const days1 = new Date('1997-10-07').getTime() / msByDay;
  return new Date((+factor + days1) * msByDay);
}
