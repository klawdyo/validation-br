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

import {
  EmptyValueException,
  InvalidChecksumException,
  InvalidFormatException,
} from './_exceptions/ValidationBRError';
import { Random } from './_helpers/random';
import { Base } from './base';
import {
  sumElementsByMultipliers,
  sumToDV,
  clearValue,
} from './utils';

export class CNH extends Base {
  protected _mask = '000000000-00';

  constructor(value: string) {
    super(value);
    this.normalize();

    if (!this.validate()) {
      throw new InvalidChecksumException();
    }
  }

  //
  //
  //
  //
  //
  //

  protected normalize(): void {
    this._value = this._value.replace(/[.-]/g, '');
  }

  /**
   * validate()
   * Valida se um número é válido e
   * retorna uma exceção se não estiver
   */
  protected validate(): boolean {
    const cnh = clearValue(this._value, 11, {
      rejectEmpty: true,
      rejectIfLonger: true,
      rejectIfShorter: true,
      rejectEqualSequence: true,
    });

    return CNH.checksum(cnh.substring(0, 9)) === cnh.substring(9, 11);
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
    if (!value) throw new EmptyValueException();
    if (!/^\d{9}$/.test(value)) throw new InvalidFormatException();

    const sum1 = sumElementsByMultipliers(
      value.substring(0, 9),
      [2, 3, 4, 5, 6, 7, 8, 9, 10]
    );
    const dv1 = sumToDV(sum1);

    const sum2 = sumElementsByMultipliers(
      value.substring(0, 9) + dv1,
      [3, 4, 5, 6, 7, 8, 9, 10, 11, 2]
    );
    const dv2 = sumToDV(sum2);

    return `${dv1}${dv2}`;
  }

  /**
   *
   * Cria uma instância com um número válido aleatório
   *
   */
  static fake(): CNH {
    const base = Random.number(9, true);
    return new CNH(`${base}${CNH.checksum(base)}`);
  }
}
