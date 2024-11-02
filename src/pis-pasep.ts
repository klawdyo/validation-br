/**
 * isPIS()
 * Calcula se um código de PIS/PASEP/NIS/NIT no formato 268.27649.96-0 é válido. Não
 * valida o formato, portanto, 26827649960 é equivalente a 268.27649.96-0 para efeitos
 * desta validação.
 *
 * @doc
 * - O número de PIS deve possuir 11 caracteres
 *
 * - Os caracteres de 1 a 10 são a numeração documento
 *
 * - O caractere 11 é o dígito verificador.
 *
 * 1) Partes do número
 *  _______________________________________________
 * |  Número                                 | D V |
 * |  2   6   8 . 2   7   6   4   9 . 9   6  -  0  |
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
 *  - O somatório encontrado é dividido por 11 e o resultado é subtraído de 11
 *    234 / 11 tem resto 3. 11 - 3 = 8. DV1 é 8.
 *    Obs.: Caso o cálculo de DV1 retorne 0, o resultado será 5.
 *          Caso retorne 1, o resto será 0
 *
 *
 *
 *
 * Fonte: http://www.macoratti.net/alg_pis.htm
 *
 * @param {String} value Objeto postal no formato 268.27649.96-0
 * @returns {Boolean}
 */

import  { EmptyValueException, InvalidChecksumException, InvalidFormatException } from './_exceptions/ValidationBRError'
import { sumElementsByMultipliers, sumToDV, clearValue } from './utils'

import { Base } from "./base";
import { Random } from './_helpers/random';

export class PIS extends Base {
  protected _mask = '000.00000.00-0';

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

  protected normalize(): void {
    this._value = this._value.replace(/([.-])/g, '');
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
    const pis = clearValue(this._value, 11, {
      rejectEmpty: true,
      rejectIfLonger: true,
      rejectEqualSequence: true,
      rejectIfShorter: true
    })
  
    if (PIS.checksum(pis.substring(0,10)) !== pis.substring(10, 11)) {
      throw new InvalidChecksumException()
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
   * @returns {String}
   */
  static fake(): PIS {
    const num = Random.number(10, true)

    return new PIS(`${num}${PIS.checksum(num)}`)
  }

  /**
   * checksum()
   * Calcula o dígito verificador de um número SEM o dígito incluído
   *
   */
  static checksum(value: string): string {
    if (!value) throw new EmptyValueException();
    if(!/^\d{10}$/.test(value)) throw new InvalidFormatException()

  
    const sum = sumElementsByMultipliers(value, [3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  
    return String(sumToDV(sum))
    
  }
}

