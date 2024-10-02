/**
 * RENAVAM
 * Funções auxiliares para cálculo de máscaras, validação, dígito verificador e criaçãode
 * números fake.
 *
 * @doc
 * - O número de RENAVAM deve possuir 11 caracteres
 *
 * - Os caracteres de 1 a 10 são a numeração documento
 *
 * - O caractere 11 é o dígito verificador.
 *
 * 1) Partes do número
 *  _______________________________________________
 * |  Número                                 | D V |
 * |  2   6   8   2   7   6   4   9   9   6  -  0  |
 * |_________________________________________|_____|
 *
 * 2) Cálculo do DV.
 *
 *  - Soma-se o produto das algarismos 3 a 10 pelos números 3, 2, 9, 8, 7, 6, 5, 4, 3, 2
 *
 *    2   6   8   2   7   6   4   9   9   6
 *    x   x   x   x   x   x   x   x   x   x
 *    3   2   9   8   7   6   5   4   3   2
 * =  6 +12 +72 +16 +49 +12 +20 +36 +27 +12  =  234
 *
 *  - O somatório encontrado é multiplicado por 10 e ao resultado
 *    é aplicado o cálculo do MOD 11.
 *
 *    ( 234 * 10 ) / 11 tem resto 8. DV = 8. Caso o resto seja maior ou igual a
 *    10, DV será 0.
 *
 *
 */
import {
  InvalidChecksumException,
  InvalidFormatException,
} from './_exceptions/ValidationBRError';
import { sumElementsByMultipliers, clearValue } from './utils';

import { Base } from './base';
import { Random } from './_helpers/random';

export class Renavam extends Base {
  protected _mask = '0000000000-0';

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
    this._value = this._value.replace(/([-])/g, '');
  }

  /**
   *
   * Valida se um número é válido e
   * retorna uma exceção se não estiver
   *
   */
  protected validate(): boolean {
    const renavam = clearValue(this._value, 11, {
      rejectEmpty: true,
      rejectIfLonger: true,
      rejectIfShorter: true,
      rejectEqualSequence: true,
    });    

    if (Renavam.checksum(renavam.substring(0,10)) !== renavam.substring(10, 11)) {
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
   *
   * Gera um número válido
   *
   */
  static fake(): Renavam {
    const value = Random.number(10, true);

    return new Renavam(`${value}${Renavam.checksum(value)}`);
  }

  /**
   * checksum()
   * Calcula o dígito verificador de um número SEM o dígito incluído
   *
   */
  static checksum(value: string): string {
    if (!/^\d{10}$/.test(value)) {
      throw new InvalidFormatException();
    }

    const sum1 =
      sumElementsByMultipliers(value, [3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) * 10;
    const dv1 = sum1 % 11 >= 10 ? 0 : sum1 % 11;

    return `${dv1}`;
  }
}
