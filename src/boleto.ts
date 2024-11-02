/**
 * isCNH()
 * Calcula se uma CNH é válida
 *
 * @doc
 * CNH deve possuir 11 caracteres
 *
 * - Os caracteres 1 a 9 são números sequenciais.
 *
 *
 * - Os caracteres 10 e 11 são dígitos verificadores.
 *
 * 1) Partes do número
 *  ____________________________ ______
 * |  Número                    | D V |
 * |  5  8  3  1  6  7  9  4  5   3 4 |
 * |____________________________|_____|
 *
 * 2) Cálculo do primeiro DV.
 *
 *  - Soma-se o produto das algarismos 1 a 9 pelos números 2, 3, 4, 5, 6, 7, 8, 9, 10.
 *
 *    5   8   3   1   6   7   9   4   5
 *    x   x   x   x   x   x   x   x   x
 *    2   3   4   5   6   7   8   9   10
 * = 10 +24 +12  +5 +36 +49 +72 +36  +50  = 294
 *
 *  - O somatório encontrado é dividido por 11. O DV1 é 11 subtraído do resto da divisão. Se o
 *    resto for 10, o DV1 é 0.
 *
 * 2.1) 294 / 11 tem resto igual a 8. 11-7 = 3
 *      DV1 = 3
 *
 * 3) Cálculo do segundo DV
 *
 *  - Soma-se o produto das algarismos 1 a 9 juntamente com o 10 caractere
 *    que é o DV1, pelos números 3, 4, 5, 6, 7, 8, 9, 10, 11, 2. O DV1 será
 *    multiplicado por 2 e ficará no final.
 *
 *    5   8   3   1   6   7   9   4   5   3
 *    x   x   x   x   x   x   x   x   x   x
 *    3   4   5   6   7   8   9  10  11   2
 * = 10 +24 +12  +5 +36 +49 +72 +36 +50  +6  =  348
 *
 * 3.1) 348 / 11 tem resto igual a 7. 11 - 7 = 4.
 *      DV2 = 4
 *
 *  - O somatório encontrado é dividido por 11. O DV2 é 11 subtraído do resto da divisão. Se o
 *    resto for 10, o DV2 é 0.
 *
 * Fonte: https://www.devmedia.com.br/forum/validacao-de-cnh/372972
 *
 * @param {String} value Título eleitoral
 * @returns {Boolean}
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
    console.log(Boleto.parse(Boleto.lineBounds, this._value));

    if (!this.validate()) {
      throw new InvalidChecksumException();
    }
  }

  static fromBarcode(barcode: string){
    console.log(Boleto.parse(Boleto.barcodeBounds, barcode))
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
  static parse(bounds: Record<string, [number, number]>, value: string): any {
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
  static checksum(value: string): string {
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

interface BoletoParse {
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
