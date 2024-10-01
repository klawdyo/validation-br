/**
 * isCNPJ()
 * Calcula se um CNPJ é válido
 *
 * A partir da Nota Técnica conjunta COCAD/SUARA/RFB nº 49 de 14 de maio de 2024, CNPJ passa
 * a poder ser criado com letras e números, ao invés de apenas números. Esta alteração entra
 * em vigor em 2026.
 *
 *
 * @doc
 * - CNPJ deve possuir 14 dígitos no formato AA.AAA.AAA/AAAA-NN, onde A representa letras
 * ou números e N representa números (Nota Técnica conjunta COCAD/SUARA/RFB nº 49 de 14 de maio de 2024)
 *
 * - Os caracteres 1 a 8 são a identificação da empresa definida pela Receita Federal. Podem ser letras ou números
 *
 * - Os caracteres 9 a 12 são a identificação das filiais da empresa. Podendo ser letras ou números
 *
 * - Os caracteres 13 e 14 são os dígitos verificadores
 *
 * 1) Partes do número
 *  _______________________________ _______________ _______
 * | Número                        |    Filiais    |  DV   |
 * | 1   1 . 2   2   2 . 3   3   3 / 0   0   0   1 - X   Y |
 * |_______________________________|_______________|_______|
 *
 *
 * 2.1) Conversão dos números para tabela ASCII
 * Converte os caracteres do CNPJ em valores numéricos, mesmo que alguns deles
 * sejam numéricos. A conversão será baseada na tabela ASCII
 *
 *  Tabela ASCII
 *  0 = 48    1 = 49     2 = 50    3 = 51    4 = 52
 *  5 = 53    6 = 54     7 = 55    8 = 56    9 = 57
 *  A = 65    B = 66     C = 67    D = 68    E = 69
 *  F = 70    G = 71     H = 72    I = 73    J = 74
 *  K = 75    L = 76     M = 77    N = 78    O = 79
 *  P = 80    Q = 81     R = 82    S = 83    T = 84
 *  U = 85    V = 86     W = 87    X = 88    Y = 89
 *  Z = 90
 *
 * Ao converter cada dígito do CNPJ para o seu equivalente na tabela ASCII, subtraia de 48
 * para obter o número que será multiplicado.
 * Como o "0" é 48 e deve-se subtrair de 48, não há mudanças nos números.
 *
 *
 *
 * 2) Cálculo do primeiro DV.
 *
 *  - Soma-se o produto das algarismos 1 a 12 pelos números 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2
 *
 *    1   1   2   2   2   3   3   3   0   0   0   1
 *    x   x   x   x   x   x   x   x   x   x   x   x
 *    5   4   3   2   9   8   7   6   5   4   3   2
 * =  5  +4  +6  +4 +18 +24 +21 +18  +0  +0  +0  +2 = 102
 *
 *  - O somatório encontrado é dividido por 11 e o resultado é subtraído de 11
 *    102 / 11 tem resto 8. 11 - 3 = 8. DV1 é 8.
 *    Obs.: Caso o cálculo de DV1 retorne 10, o resultado será 0.
 *
 * 3) Cálculo do segundo DV.
 *
 *  - Soma-se o produto das algarismos 1 a 13 (incluindo o DV1 calculado) pelos
 *    números 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2.
 *
 *    1   1   2   2   2   3   3   3   0   0   0   1   8
 *    x   x   x   x   x   x   x   x   x   x   x   x   x
 *    6   5   4   3   2   9   8   7   6   5   4   3   2
 * =  6  +5  +8  +6  +4 +27 +24 +21  +0  +0  +0  +3 +16 = 120
 *
 *  - O somatório encontrado é dividido por 11 e o resultado é subtraído de 11
 *    120 / 11 tem resto 10. 11 - 10 = 1. DV2 é 1.
 *    Obs.: Caso o cálculo de DV2 retorne 10, o resultado será 0.
 *
 * Fonte: http://www.macoratti.net/alg_cnpj.htm
 *
 * @param {String} value Título eleitoral
 * @returns {Boolean}
 */

import {
  EmptyValueException,
  InvalidChecksumException,
  InvalidFormatException,
} from './_exceptions/ValidationBRError';
import { Base } from './base';
import {
  sumElementsByMultipliers,
  sumToDV,
  clearValue,
  fakeNumber,
  applyMask,
} from './utils';

export class CNPJ extends Base {
  protected _mask = '00.000.000/0000-00';

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
   * validateOrFail()
   * Valida se um número é válido e
   * retorna uma exceção se não estiver
   *
   */
  protected validate(): boolean {
    const cnpj = clearValue(this._value, 14, {
      rejectEmpty: true,
      rejectIfLonger: true,
      rejectEqualSequence: true,
    });

    if (CNPJ.checksum(cnpj.substring(0, 12)) !== cnpj.substring(12, 14)) {
      throw new InvalidChecksumException();
    }

    return true;
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
    if (!/^[a-z0-9]{12}$/i.test(value)) throw new InvalidFormatException();

    const dv1Factors = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const dv1 = sumToDvWithAlpha(value.substring(0, 12), dv1Factors);

    const dv2Factors = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const dv2 = sumToDvWithAlpha(value.substring(0, 12) + dv1, dv2Factors);

    return `${dv1}${dv2}`;
  }

  /**
   *
   *
   */
  static fake(options: Partial<FakeInput> = {}): CNPJ {
    const defaultOptions = { alphanumeric: true, ...options };
    const num = fakeNumber(12, true, defaultOptions.alphanumeric);
    return new CNPJ(`${num}${CNPJ.checksum(num)}`);
  }
}

type FakeInput = {
  alphanumeric?: boolean;
};

/**
 *
 * Converte o número para
 *
 *
 */
function asciiTableConverter(character: string): number {
  if (/^\d$/.test(character)) return +character;
  const ascii = character.toLocaleUpperCase().charCodeAt(0) - 48;

  return ascii;
}

/**
 *
 *
 *
 */
function sumToDvWithAlpha(value: string, multiplier: number[]) {
  const sum = [...value]
    .map((character) => asciiTableConverter(character))
    .reduce(
      (sum: number, asciiChar: any, index: number) =>
        sum + asciiChar * multiplier[index],
      0
    );

  return sumToDV(sum);
}
