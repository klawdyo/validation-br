/**
 * Boleto
 * Calcula, converte e mascara boletos bancários (linha digitável e código de barras)
 *
 * @doc
 * O boleto bancário possui duas representações: o código de barras, com 44 dígitos,
 * e a linha digitável, com 47 dígitos, que reorganiza o código de barras em 5 campos,
 * 3 deles com um dígito verificador próprio (Módulo 10).
 *
 * Exemplo usado nos cálculos abaixo:
 * Banco 001, moeda 9, fator de vencimento 9636, valor R$ 1.234,00 e campo livre
 * "1234567890123456789012345".
 *
 * 1) Partes do código de barras (44 dígitos)
 *  _____ ________ ______ ________________ ____________ ___________________________
 * | Bco | Moeda  |  DV  | Fator vencto.  |    Valor    |        Campo livre        |
 * | 001 |   9    |  1   |     9636       | 0000123400  | 1234567890123456789012345 |
 * |_____|________|______|________________|_____________|___________________________|
 *
 * - Banco (3): código do banco emissor.
 * - Moeda (1): sempre "9" (Real).
 * - DV geral (1): dígito verificador Módulo 11, calculado no passo 2 abaixo.
 * - Fator de vencimento (4): quantidade de dias corridos desde 07/10/1997. "0000" quando
 *   o boleto não tem vencimento definido.
 * - Valor (10): valor do boleto em centavos.
 * - Campo livre (25): definido livremente por cada banco (agência, conta, nosso número
 *   etc.), sem um padrão único entre eles. Por isso este validador não tenta decompor
 *   esse trecho, apenas o mantém disponível como está.
 *
 * 2) Cálculo do DV geral (Módulo 11)
 *
 *  - Soma-se o produto dos 43 dígitos do código de barras SEM o DV geral (banco + moeda
 *    + fator de vencimento + valor + campo livre) por pesos de 2 a 9, cíclicos, aplicados
 *    da direita para a esquerda.
 *
 *    0  0  1  9  9  6  3  6  0  0  0  0  1  2  3  4  0  0  1  2  3  4  5  6  7  8  9  0  1  2  3  4  5  6  7  8  9  0  1  2  3  4  5
 *    x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x  x
 *    4  3  2  9  8  7  6  5  4  3  2  9  8  7  6  5  4  3  2  9  8  7  6  5  4  3  2  9  8  7  6  5  4  3  2  9  8  7  6  5  4  3  2
 *
 *    Soma = 813
 *
 *  - O somatório encontrado é dividido por 11. O DV geral é 11 subtraído do resto da divisão.
 *    813 / 11 tem resto 10. 11 - 10 = 1. DV geral é 1.
 *    Obs.: Caso o cálculo do DV retorne 0, 10 ou 11, o resultado será 1.
 *
 * 3) Partes da linha digitável (47 dígitos), a partir do mesmo exemplo
 *  ____________ _____________ _____________ _ ______________
 * | Campo 1    |  Campo 2    |  Campo 3    |4|   Campo 5    |
 * | 00191.23454| 67890.123457| 67890.123457|1|96360000123400|
 * |____________|_____________|_____________|_|______________|
 *
 * - Campo 1 (10): banco (3) + moeda (1) + 5 primeiros dígitos do campo livre (5) + DV1
 * - Campo 2 (11): dígitos 6 a 15 do campo livre (10) + DV2
 * - Campo 3 (11): dígitos 16 a 25 do campo livre (10) + DV3
 * - Campo 4 (1): DV geral, o mesmo calculado no passo 2
 * - Campo 5 (14): fator de vencimento (4) + valor (10)
 *
 * 4) Cálculo do DV de cada campo da linha digitável (Módulo 10)
 *
 *  - Soma-se o produto dos dígitos do campo (sem o seu DV) por pesos alternados 2 e 1,
 *    da direita para a esquerda. Quando o produto é maior que 9, somam-se os dois
 *    algarismos do resultado (ex.: 5 x 2 = 10, que vira 1 + 0 = 1).
 *
 *    Campo 1 (001912345):
 *
 *    0   0   1   9   1   2   3   4   5
 *    x   x   x   x   x   x   x   x   x
 *    2   1   2   1   2   1   2   1   2
 *  = 0  +0  +2  +9  +2  +2  +6  +4  +1 = 26
 *
 *  - O somatório encontrado é dividido por 10. O DV é 10 menos o resto da divisão.
 *    26 / 10 tem resto 6. 10 - 6 = 4. DV1 é 4.
 *    Obs.: Caso o resto seja 0, o DV será 0.
 *
 *  - O mesmo cálculo se aplica aos campos 2 e 3, usando os 10 dígitos de cada um.
 *
 * Fonte: Febraban - Layout do código de barras de cobrança
 *
 * @param {String} value Linha digitável (47) ou código de barras (44)
 * @returns {Boolean}
 */

import {
  EmptyValueException,
  InvalidChecksumException,
  InvalidFormatException,
} from './_exceptions/ValidationBRError';
import { Random } from './_helpers/random';
import { Mask } from './_helpers/mask';
import { ExpirationFactor } from './_helpers/expiration-factor';
import { sumElementsByMultipliers, sumToDV } from './_helpers/utils';
import { Base } from './base';

export class Boleto extends Base {
  protected _mask = '00000.00000 00000.000000 00000.000000 0 00000000000000';

  // Pesos cíclicos (2 a 9, da direita para a esquerda) aplicados aos 43 dígitos
  // do código de barras sem o DV geral, usados no cálculo do Módulo 11.
  private static readonly generalChecksumWeights = [
    4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4,
    3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2,
  ];

  private _bank!: string;
  private _generalChecksum!: string;
  private _expirationFactor!: string;
  private _amount!: string;
  private _freeField!: string;

  constructor(protected _value: string) {
    super(_value);

    this.normalize();

    if (!this.validate()) {
      throw new InvalidChecksumException();
    }

    this.parse();
  }

  /**
   * Cria um Boleto a partir de um código de barras (44 dígitos).
   * Equivalente a chamar o construtor diretamente, mas deixa a intenção explícita.
   */
  static fromBarcode(barcode: string): Boleto {
    return new Boleto(barcode);
  }

  //
  //
  //
  //
  //
  //

  /**
   * Código do banco emissor
   */
  get bank(): string {
    return this._bank;
  }

  /**
   * Valor do boleto, em reais
   */
  get amount(): number {
    return Number(this._amount) / 100;
  }

  /**
   * Data de vencimento, ou null se o boleto não tiver vencimento definido
   */
  get expiresAt(): Date | null {
    return ExpirationFactor.toDate(this._expirationFactor);
  }

  /**
   * Campo livre (25 dígitos), definido livremente por cada banco.
   * Não é decomposto por este validador por não seguir um padrão único.
   */
  get freeField(): string {
    return this._freeField;
  }

  //
  //
  //
  //
  //
  //

  protected normalize(): void {
    this._value = this._value.replace(/\D/g, '');
  }

  /**
   * validate()
   * Identifica se o valor é uma linha digitável (47) ou um código de barras (44)
   * e delega para a validação específica de cada formato.
   */
  protected validate(): boolean {
    if (this._value.length === 47) return this.validateLinhaDigitavel(this._value);
    if (this._value.length === 44) return this.validateBarcode(this._value);

    throw new InvalidFormatException();
  }

  /**
   * Valida um código de barras (44 dígitos): recalcula o DV geral (Módulo 11)
   * sobre os outros 43 dígitos e compara com o DV informado.
   */
  private validateBarcode(value: string): boolean {
    const bank = value.substring(0, 3);
    const currency = value.substring(3, 4);
    const generalChecksum = value.substring(4, 5);
    const expirationFactor = value.substring(5, 9);
    const amount = value.substring(9, 19);
    const freeField = value.substring(19, 44);

    const body = `${bank}${currency}${expirationFactor}${amount}${freeField}`;

    return Boleto.checksum(body) === generalChecksum;
  }

  /**
   * Valida uma linha digitável (47 dígitos): recalcula o DV (Módulo 10) de cada
   * um dos 3 campos e, a partir deles, o DV geral (Módulo 11), comparando ambos
   * com os dígitos informados.
   */
  private validateLinhaDigitavel(value: string): boolean {
    const field1Body = value.substring(0, 9);
    const field1Checksum = value.substring(9, 10);
    const field2Body = value.substring(10, 20);
    const field2Checksum = value.substring(20, 21);
    const field3Body = value.substring(21, 31);
    const field3Checksum = value.substring(31, 32);
    const generalChecksum = value.substring(32, 33);
    const expirationFactor = value.substring(33, 37);
    const amount = value.substring(37, 47);

    if (Boleto.calculateModulo10(field1Body) !== field1Checksum) return false;
    if (Boleto.calculateModulo10(field2Body) !== field2Checksum) return false;
    if (Boleto.calculateModulo10(field3Body) !== field3Checksum) return false;

    const bank = field1Body.substring(0, 3);
    const currency = field1Body.substring(3, 4);
    const freeField = `${field1Body.substring(4, 9)}${field2Body}${field3Body}`;

    const body = `${bank}${currency}${expirationFactor}${amount}${freeField}`;

    return Boleto.checksum(body) === generalChecksum;
  }

  /**
   * Preenche os campos comuns a partir do valor já validado, convertendo para
   * o código de barras quando o valor recebido for uma linha digitável.
   */
  private parse(): void {
    const barcode = this.toBarcode();

    this._bank = barcode.substring(0, 3);
    this._generalChecksum = barcode.substring(4, 5);
    this._expirationFactor = barcode.substring(5, 9);
    this._amount = barcode.substring(9, 19);
    this._freeField = barcode.substring(19, 44);
  }

  //
  //
  //
  //
  //
  //

  /**
   * Devolve sempre o código de barras (44 dígitos), independentemente do
   * formato recebido no construtor.
   */
  toBarcode(): string {
    if (this._value.length === 44) return this._value;

    return Boleto.linhaDigitavelToBarcode(this._value);
  }

  /**
   * Devolve sempre a linha digitável (47 dígitos, sem máscara), independentemente
   * do formato recebido no construtor.
   */
  toString(): string {
    if (this._value.length === 47) return this._value;

    return Boleto.barcodeToLinhaDigitavel(this._value);
  }

  /**
   * Devolve a linha digitável mascarada, no formato
   * 00000.00000 00000.000000 00000.000000 0 00000000000000
   */
  mask(): string {
    return new Mask(this.toString()).apply(this._mask);
  }

  //
  //
  //
  //
  //
  //

  /**
   * checksum()
   * Calcula o DV geral (Módulo 11) a partir dos 43 dígitos do código de
   * barras SEM o DV geral (banco + moeda + fator de vencimento + valor + campo livre)
   */
  static checksum(value: string): string {
    if (!value) throw new EmptyValueException();
    if (!/^\d{43}$/.test(value)) throw new InvalidFormatException();

    const sum = sumElementsByMultipliers(value, Boleto.generalChecksumWeights);

    return String(sumToDV(sum, 1));
  }

  /**
   * Gera um boleto fake válido
   */
  static fake(options: Partial<FakeBoletoOptions> = {}): Boleto {
    const bank = options.bank ?? Random.number(3, true);
    const currency = '9';
    const expirationFactor = options.expiresAt
      ? ExpirationFactor.fromDate(options.expiresAt)
      : Random.number(4, true);
    const amount =
      options.amount !== undefined
        ? String(Math.round(options.amount * 100)).padStart(10, '0').slice(-10)
        : Random.number(10, true);
    // Random.number() perde precisão para strings deste tamanho (10**25 > Number.MAX_SAFE_INTEGER)
    const freeField = Array.from({ length: 25 }, () => Random.between(0, 9)).join('');

    const body = `${bank}${currency}${expirationFactor}${amount}${freeField}`;
    const generalChecksum = Boleto.checksum(body);

    const barcode = `${bank}${currency}${generalChecksum}${expirationFactor}${amount}${freeField}`;

    return new Boleto(Boleto.barcodeToLinhaDigitavel(barcode));
  }

  // ////////////////////////////////////////////
  //
  // Funções auxiliares
  //
  // ////////////////////////////////////////////

  /**
   * Converte uma linha digitável (47) no código de barras (44) equivalente.
   */
  private static linhaDigitavelToBarcode(linhaDigitavel: string): string {
    const field1Body = linhaDigitavel.substring(0, 9);
    const field2Body = linhaDigitavel.substring(10, 20);
    const field3Body = linhaDigitavel.substring(21, 31);
    const generalChecksum = linhaDigitavel.substring(32, 33);
    const expirationFactor = linhaDigitavel.substring(33, 37);
    const amount = linhaDigitavel.substring(37, 47);

    const bank = field1Body.substring(0, 3);
    const currency = field1Body.substring(3, 4);
    const freeField = `${field1Body.substring(4, 9)}${field2Body}${field3Body}`;

    return `${bank}${currency}${generalChecksum}${expirationFactor}${amount}${freeField}`;
  }

  /**
   * Converte um código de barras (44) na linha digitável (47) equivalente,
   * calculando o DV (Módulo 10) de cada um dos 3 campos.
   */
  private static barcodeToLinhaDigitavel(barcode: string): string {
    const bank = barcode.substring(0, 3);
    const currency = barcode.substring(3, 4);
    const generalChecksum = barcode.substring(4, 5);
    const expirationFactor = barcode.substring(5, 9);
    const amount = barcode.substring(9, 19);
    const freeField = barcode.substring(19, 44);

    const field1Body = `${bank}${currency}${freeField.substring(0, 5)}`;
    const field2Body = freeField.substring(5, 15);
    const field3Body = freeField.substring(15, 25);

    const field1Checksum = Boleto.calculateModulo10(field1Body);
    const field2Checksum = Boleto.calculateModulo10(field2Body);
    const field3Checksum = Boleto.calculateModulo10(field3Body);

    return (
      `${field1Body}${field1Checksum}` +
      `${field2Body}${field2Checksum}` +
      `${field3Body}${field3Checksum}` +
      `${generalChecksum}${expirationFactor}${amount}`
    );
  }

  /**
   * Módulo 10: usado no DV de cada campo da linha digitável.
   */
  private static calculateModulo10(value: string): string {
    let sum = 0;
    let weight = 2;

    for (let i = value.length - 1; i >= 0; i -= 1) {
      let product = Number(value[i]) * weight;
      if (product >= 10) product = Math.floor(product / 10) + (product % 10);

      sum += product;
      weight = weight === 2 ? 1 : 2;
    }

    const rest = sum % 10;
    return String(rest === 0 ? 0 : 10 - rest);
  }

}

interface FakeBoletoOptions {
  bank: string;
  amount: number;
  expiresAt: Date;
}
