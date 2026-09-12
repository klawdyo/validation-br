/**
 * isCAEPF()
 * Calcula se um CAEPF é válido
 *
 * @doc
 * CAEPF (Cadastro de Atividade Econômica da Pessoa Física) identifica, perante a
 * Receita Federal, cada atividade econômica exercida por uma pessoa física que não
 * possui CNPJ (produtor rural, segurado especial etc). Uma mesma pessoa pode ter
 * vários CAEPFs, um para cada atividade/estabelecimento.
 *
 * CAEPF deve possuir 14 dígitos no formato 000.000.000/000-00.
 *
 * - Os caracteres 1 a 9 são o número base do CPF do titular (sem os 2 dígitos
 *   verificadores do próprio CPF).
 *
 * - Os caracteres 10 a 12 são o número de ordem: sequencial das diversas
 *   atividades/estabelecimentos do mesmo titular (001 a 999).
 *
 * - Os caracteres 13 e 14 são os dígitos verificadores.
 *
 * 1) Partes do número
 * ------------------------------------------------
 * | Base do CPF (sem DV) | Ordem |  DV  |
 *  4   1   1 . 4   2   2 . 6   0   0 / 0   0   1 - 0   1
 *
 * 2) Cálculo do primeiro DV.
 *
 *  - Soma-se o produto dos algarismos 1 a 12 pelos números 6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9
 *
 *    4   1   1   4   2   2   6   0   0   0   0   1
 *    x   x   x   x   x   x   x   x   x   x   x   x
 *    6   7   8   9   2   3   4   5   6   7   8   9
 * = 24  +7  +8 +36  +4  +6 +24  +0  +0  +0  +0  +9 = 118
 *
 *  - O somatório encontrado é dividido por 11. O resto da divisão é o DV1.
 *    118 / 11 tem resto 8. DV1 é 8.
 *    Obs.: Caso o resto seja 10, o DV1 será 0.
 *
 * 3) Cálculo do segundo DV.
 *
 *  - Soma-se o produto dos algarismos 1 a 12 (com o DV1 calculado acrescentado
 *    ao final) pelos números 5, 6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9
 *
 *    4   1   1   4   2   2   6   0   0   0   0   1   8
 *    x   x   x   x   x   x   x   x   x   x   x   x   x
 *    5   6   7   8   9   2   3   4   5   6   7   8   9
 * = 20  +6  +7 +32 +18  +4 +18  +0  +0  +0  +0  +8 +72 = 185
 *
 *  - O somatório encontrado é dividido por 11. O resto da divisão é o DV2.
 *    185 / 11 tem resto 9. DV2 é 9.
 *    Obs.: Caso o resto seja 10, o DV2 será 0.
 *
 * 4) Ajuste final.
 *
 *  - Diferente do CPF/CNPJ, o CAEPF ainda soma 12 ao número formado por DV1 e
 *    DV2 e, caso o resultado passe de 99, subtrai 100.
 *
 *    DV1 e DV2 juntos formam 89. 89 + 12 = 101. Como passou de 99, 101 - 100 = 1.
 *    O DV final, sempre com 2 dígitos, é 01.
 *
 * Fonte:
 * https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/cadastros/caepf/legislacao
 * http://ghiorzi.org/DVnew.htm
 *
 * @param {String} value CAEPF
 * @returns {Boolean}
 */

import {
  EmptyValueException,
  InvalidChecksumException,
  InvalidFormatException,
} from './_exceptions/ValidationBRError';
import { Random } from './_helpers/random';
import { Base } from './base';
import { sumElementsByMultipliers, clearValue } from './_helpers/utils';

export class CAEPF extends Base {
  protected _mask = '000.000.000/000-00';

  // Pesos aplicados aos 12 dígitos (base do CPF + número de ordem), da
  // esquerda para a direita.
  private static readonly dv1Weights = [6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9];
  private static readonly dv2Weights = [5, 6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9];

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

  protected normalize(): void {
    this._value = this._value.replace(/[/.-]/g, '');
  }

  /**
   * validate()
   * Valida se um número é válido e
   * retorna uma exceção se não estiver
   */
  protected validate(): boolean {
    const caepf = clearValue(this._value, 14, {
      rejectEmpty: true,
      rejectIfLonger: true,
      rejectIfShorter: true,
      rejectEqualSequence: true,
    });

    return CAEPF.checksum(caepf.substring(0, 12)) === caepf.substring(12, 14);
  }

  //
  //
  //
  //

  /**
   * checksum()
   * Calcula o dígito verificador de um número SEM o dígito incluído
   *
   */
  static checksum(value: string): string {
    if (!value) throw new EmptyValueException();
    if (!/^\d{12}$/.test(value)) throw new InvalidFormatException();

    const sum1 = sumElementsByMultipliers(value, CAEPF.dv1Weights);
    const dv1 = sum1 % 11 === 10 ? 0 : sum1 % 11;

    const sum2 = sumElementsByMultipliers(`${value}${dv1}`, CAEPF.dv2Weights);
    const dv2 = sum2 % 11 === 10 ? 0 : sum2 % 11;

    const adjusted = (dv1 * 10 + dv2 + 12) % 100;

    return String(adjusted).padStart(2, '0');
  }

  /**
   *
   *
   */
  static fake(): CAEPF {
    const base = Random.number(12, true);
    return new CAEPF(`${base}${CAEPF.checksum(base)}`);
  }
}
