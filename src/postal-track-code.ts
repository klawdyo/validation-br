/**
 * isPostalCode()
 * Calcula se um código de rastreamento postal no formato JT194690698BR é válido.
 *
 * @doc
 * - O número de registro postal deve possuir 13 caracters no formato JT194690698BR.
 *
 * - Os caracteres 1 e 2 informam o tipo do objeto. Ex.: SX é Sedex, RC é carta registrada etc.
 *
 * - Os caracteres de 3 a 10 são a numeração sequencial do tipo do objeto.
 *
 * - O caractere 11 é o dígito verificador.
 *
 * - Os caracteres 12 e 13 representa o código do País de onde a postagem partiu.
 *
 * 1) Partes do número
 *  ______ ___________________________ ______ _______
 * | Tipo | Número                    |  DV  |  País |
 * | J T    1  9  4  6  9  0  6  9       8      B R  |
 * |______|___________________________|______|_______|
 *
 * 2) Cálculo do DV.
 *
 *  - Soma-se o produto das algarismos 3 a 10 pelos números 8, 6, 4, 2, 3, 5, 9, 7
 *
 *    1   9   4   6   9   0   6   9
 *    x   x   x   x   x   x   x   x
 *    8   6   4   2   3   5   9   7
 * =  8 +54 +16 +12 +18  +0 +54 +63 = 234
 *
 *  - O somatório encontrado é dividido por 11 e o resultado é subtraído de 11
 *    234 / 11 tem resto 3. 11 - 3 = 8. DV1 é 8.
 *    Obs.: Caso o cálculo de DV1 retorne 0, o resultado será 5.
 *          Caso retorne 1, o resto será 0
 *
 *
 *
 *
 * Fonte:
 *
 * @param {String} value Objeto postal no formato JT194690698BR
 * @returns {Boolean}
 */

import {
  EmptyValueException,
  InvalidChecksumException,
  InvalidFormatException,
} from './_exceptions/ValidationBRError';
import { sumElementsByMultipliers, clearValue } from './utils';

import { Base } from './base';
import { Random } from './_helpers/random';

export class PostalTrackCode extends Base {
  protected _mask = null;

  constructor(protected _value: string) {
    super(_value);
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

  /**
   *
   *
   *
   */
  protected normalize(): void {
    this._value = this._value.toLocaleUpperCase().trim();
  }

  /**
   * validate()
   * Valida se um número é válido e
   * retorna uma exceção se não estiver
   *
   * @param {String|Number} value Número a ser validado
   * @returns {Boolean}
   */
  protected validate(): boolean {
    if (!/^[a-z]{2}([\d]{9})[a-z]{2}$/gi.test(String(this._value))) {
      throw new InvalidFormatException();
    }

    const postalCode = clearValue(this._value.substring(2, 11), 9);

    if (
      PostalTrackCode.checksum(postalCode.substring(0, 8)) !==
      postalCode.substring(8, 9)
    ) {
      throw new InvalidChecksumException();
    }

    return true;
  }

  //
  //
  //
  //
  //
  //

  /**
   * fake()
   * Gera um número válido
   *
   */
  static fake(): PostalTrackCode {
    const num = Random.number(8, true);
    const letter = `${Random.alpha(2)}`;

    return new PostalTrackCode(
      `${letter}${num}${PostalTrackCode.checksum(num)}BR`
    );
  }

  /**
   *
   * checksum()
   * Calcula o dígito verificador dos 8 números sem as letras, sem o DV e sem o código do país
   *
   */
  static checksum(value: string): string {
    if (!value) throw new EmptyValueException();
    if (!/^\d{8}$/.test(value)) throw new InvalidFormatException();

    const sum = sumElementsByMultipliers(value, [8, 6, 4, 2, 3, 5, 9, 7]);
    const rest = sum % 11;

    const specificities = [
      { rest: 0, dv: 5 },
      { rest: 1, dv: 0 },
    ];

    const specifity = specificities.find((item) => item.rest === rest);
    const DV = specifity ? specifity.dv : 11 - rest;

    return String(DV);
  }
}
