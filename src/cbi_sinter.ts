/**
 * CBISinter
 * Valida o Código Imobiliário Brasileiro (CIB) no padrão SINTER.
 *
 * @doc
 * O CIB (Código Imobiliário Brasileiro) é o código único de identificação do imóvel,
 * estabelecido pelo SINTER (Sistema Nacional de Gestão de Informações Territoriais).
 * O código é composto por 7 caracteres alfanuméricos seguidos de um dígito verificador.
 *
 * O algoritmo utiliza a Base 32 de Crockford, que:
 * - É insensível a maiúsculas/minúsculas.
 * - Remove os caracteres I, L, O e U para evitar confusões visuais e palavras obscenas.
 * - Substitui 'I' e 'L' por '1'.
 * - Substitui 'O' por '0'.
 *
 * 1) Partes do código
 *  A 3 N 8 Z 4 F - Y
 *  |___________|   |
 *      Base        DV
 *
 * 2) Cálculo do Dígito Verificador
 *
 * O cálculo utiliza o algoritmo de Módulo 31 com pesos específicos.
 *
 * Exemplo: A3N8Z4F
 *
 * Pesos: 4, 3, 9, 5, 7, 1, 8
 *
 * Caracteres Base32 (Valor):
 * 0=0, 1=1, ..., 9=9
 * A=10, B=11, C=12, D=13, E=14, F=15, G=16, H=17
 * J=18, K=19, M=20, N=21, P=22, Q=23, R=24, S=25
 * T=26, V=27, W=28, X=29, Y=30, Z=31
 *
 * Cálculo:
 * A (10) * 4 = 40
 * 3 (3)  * 3 = 9
 * N (21) * 9 = 189
 * 8 (8)  * 5 = 40
 * Z (31) * 7 = 217
 * 4 (4)  * 1 = 4
 * F (15) * 8 = 120
 *
 * Soma = 40 + 9 + 189 + 40 + 217 + 4 + 120 = 619
 *
 * Resto = 619 % 31 = 30
 *
 * O valor 30 corresponde ao caractere 'Y' na Base 32 de Crockford.
 * Portanto, o DV é Y.
 * 
 * Observação: O DV nunca pode ser "Z", pois o resto máximo da divisão por 31 é 30.
 */

import { EmptyValueException, InvalidChecksumException, InvalidFormatException } from "./_exceptions/ValidationBRError";
import { Crockford } from "./_helpers/crockford";
import { Random } from "./_helpers/random";
import { Base } from "./base";
import { clearValue } from "./_helpers/utils";

export class CBISinter extends Base {
  protected _mask: string = "0000000-0"; // Máscara apenas informativa

  constructor(value: string) {
    super(value);
    this.normalize();

    if (!this.validate()) {
      throw new InvalidChecksumException();
    }
  }

  /**
   * Normaliza o valor informado no construtor, atualizando o _value interno.
   */
  protected normalize(): void {
    this._value = Crockford.normalize(this._value);
  }

  /**
 * Valida se o DV informado na string original coincide com o DV calculado.
 */
  public validate(): boolean {
    const cib = clearValue(this._value, 8, {
      rejectEmpty: true,
      rejectIfLonger: true,
      rejectIfShorter: true,
    });

    return CBISinter.checksum(cib.substring(0, 7)) === cib.substring(7, 8);
  }

  /**
   *
   * checksum()
   * Calcula o dígito verificador de um número SEM o dígito incluído
   * 
   */
  static checksum(value: string): string {
    if (!value) throw new EmptyValueException();
    if (!/^[0-9a-z]{7}$/i.test(value)) throw new InvalidFormatException();

    // Garante que temos pelo menos os 7 caracteres da base
    // const base = value.substring(0, 7);
    const base = value;
    const weights = [4, 3, 9, 5, 7, 1, 8];

    let sum = 0;
    for (let i = 0; i < base.length; i++) {
      const charValue = Crockford.charToInt(base[i]);
      sum += charValue * weights[i];
    }

    const rest = sum % 31;
    return Crockford.intToChar(rest);
  }



  /**
   *
   * Cria uma instância com um número válido aleatório
   *
   */
  static fake(): CBISinter {
    // Pego o alfabeto usado pelo Crockford como array
    const alphabet = Crockford.getAlphabet().split('');
    // Uso o random.fromArray para pegar 7 caracteres aleatórios de dentro do alfabeto
    const base = Random.fromArray(alphabet, 7).join('');

    return new CBISinter(`${base}${CBISinter.checksum(base)}`);
  }
}