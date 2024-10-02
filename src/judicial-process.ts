/**
 * judicialProcess
 * Valida, mascara e cria números de processos judiciais
 *
 * @link
 * https://juslaboris.tst.jus.br/bitstream/handle/20.500.12178/30318/2008_res0065_cnj_rep01.pdf?sequence=2
 * http://ghiorzi.org/DVnew.htm#f
 *
 * @doc
 * Os  números de processos judiciais são usados a partir de 2010 para unificar a
 * numeração de processos no Brasil e são usados em todos os tribunais.
 *
 * O número do processo, sem os caracteres especiais, devem possuir até 20 números
 * e deve seguir o padrão abaixo:
 *
 * 1) Partes do número
 *  0002080-25.2012.5.15.0049
 *  NNNNNNN-DD.AAAA.J.TR.OOOO
 * |______|__|____|_|__|____|
 *    |    |   |  | |   |----> Unidade de origem do processo com 4 caracteres
 *    |    |   |  | |--------> TR=Tribunal do segmento do poder judiciário com 2 caracteres
 *    |    |   |  |----------> J=Órgão do poder Judiciário com 1 caractere
 *    |    |   |-------------> Ano do ajuizamento do processo com 4 caracteres
 *    |    |-----------------> Dígito verificador com 2 caracteres
 *    |----------------------> Número sequencial do Processo, por unidade de
 *                             origem, reiniciado anualmente com 7 caracteres
 *
 * Órgãos do Poder Judiciário
 * 1 - Supremo Tribunal Federal
 * 2 - Conselho Nacional de Justiça
 * 3 - Superior Tribunal de Justiça
 * 4 - Justiça Federal
 * 5 - Justiça do Trabalho
 * 6 - Justiça Eleitoral
 * 7 - Justiça Militar da União
 * 8 - Justiça dos Estados e do Distrito Federal e Territórios
 * 9 - Justiça Militar Estadual
 *
 *
 * 2) Dígito Verificador
 *
 * O algoritmo usado para o cálculo do DV chama-se Módulo 97 de Base 10 (ISO 7064).
 *
 * Nota: O número do processo possui 20 caracteres e ultrapassa o tamanho máximo
 * do inteiro em javascript, impedindo que façamos o cálculo diretamente, desta
 * forma, será nacessária uma fatoração para que o resultado seja o correto.
 *
 * 2.1) Cálculo do DV
 * - Caso o DV seja conhecido, ele precisa ser removido do número e colocado
 * como "00" ao final. Caso não esteja incluso no número, adicione '00' ao final.
 *
 * Ex.: O processo "00020802520125150049", cujo dv é "25", será calculado como
 * "000208020125150049" e receberá "00" ao final. O número usado para o cálculo
 * do DV será "00020802012515004900"
 *
 * 2.2) Etapas de Cálculo
 *
 * 00020802012515004900
 *                   ↓↓
 *                   DV ao final como "00"
 *
 * - Aplicamos o MOD 97 aos caracteres de 0 a 7 para calcular a primeira parte
 * part1 = 0002080 % 97 = 43
 *
 * - Concatenamos part1 ao ano, órgão do poder judiciário e tribunal e aplicamos o MOD 97
 * para obtermos o valor da part2
 * part2 = ( part1 +''+ 2012 +''+ 5 +''+ 15 ) % 97 = 26
 *
 * - Concatemos part2 ao código do órgão de origem e ao "00" do final e aplicamos
 * o MOD 97 ao resultado
 * part3 = ( part2 + '0049' + '00') % 97 = 73
 *
 * - Subtraímos o resultado de 98
 * dv = 98 - 73 = 25
 *
 * O Dígito verificador é 25 e deve ser aplicado após o 7º caractere do número do processo
 *
 * Fonte: https://juslaboris.tst.jus.br/bitstream/handle/20.500.12178/30318/2008_res0065_cnj_rep01.pdf?sequence=2
 */

import ValidationBRError, {
  EmptyValueException,
  InvalidChecksumException,
  InvalidFormatException,
} from './_exceptions/ValidationBRError';
import { Random } from './_helpers/random';
import { Base } from './base';
import {
  clearValue,
  insertAtPosition,
  removeFromPosition,
} from './utils';

export class JudicialProcess extends Base {
  _court!: string;
  _subCourt!: string;
  _origin!: string;
  _year!: string;
  _processNumber!: string;
  _checksum!: string;

  protected _mask = '0000000-00.0000.0.00.0000';

  constructor(protected _value: string) {
    super(_value);
    // console.log('entrou', this._value);
    this.normalize();
    // console.log('normalized', this._value);
    

    if (!this.validate()) {
      throw new InvalidChecksumException();
    }

    this.parse();
  }

  parse() {
    this._processNumber = this._value.substring(0, 7);
    this._checksum = this._value.substring(7, 9);
    this._year = this._value.substring(9, 13);
    this._court = this._value.substring(13, 14);
    this._subCourt = this._value.substring(14, 16);
    this._origin = this._value.substring(16);
  }

  get processNumber() {
    return this._processNumber;
  }

  get checksum() {
    return this._checksum;
  }

  get year() {
    return this._year;
  }

  get court() {
    return this._court;
  }

  get subCourt() {
    return this._subCourt;
  }

  get origin() {
    return this._origin;
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
   * validateOrFail()
   * Valida se um número é válido e
   * retorna uma exceção se não estiver
   *
   * @param {String|Number} value Número a ser validado
   * @returns {Boolean}
   */
  protected validate(): boolean {
    const judicialProcess = clearValue(this._value, 20, {
      rejectEmpty: true,
      rejectIfLonger: true,
      rejectIfShorter: true,
    });

    // console.log('validate 1', judicialProcess);
    
    
    const processWithoutDV = JudicialProcess.getWithoutChecksum(judicialProcess);
    // console.log('validate 2', judicialProcess);
    
    JudicialProcess.validateCourt(processWithoutDV.substring(11, 12));
    // console.log('validate 3', judicialProcess);

    // console.log('Input', this._value, 'sem dv', processWithoutDV,'dv informado:',judicialProcess.substring(7, 9), 'dv calculado', JudicialProcess.checksum(processWithoutDV));
    

    return ( JudicialProcess.checksum(processWithoutDV) === judicialProcess.substring(7, 9) );
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
  static fake(options: Partial<FakeOptions> = {}): JudicialProcess {
    const num = Random.number(7, true);

    //
    if (options.court) JudicialProcess.validateCourt(options.court);
    if (options.subCourt) JudicialProcess.validateSubCourt(options.subCourt);
    if (options.year) JudicialProcess.validateYear(options.year);
    if (options.origin) JudicialProcess.validateOrigin(options.origin);

    let court1 = options.court || Random.number(1, true); // Não pode ser '0'
    court1 = court1 === '0' ? '1' : court1;

    const court2 = options.subCourt || JudicialProcess.getFakeSubCourt();
    const origin = options.origin || Random.number(4, true);
    const year = options.year || new Date().getFullYear() - +Random.number(1);

    const court = `${court1}${court2}`;

    const judicialProcess = `${num}${year}${court}${origin}`;
    const checksum = JudicialProcess.checksum(judicialProcess);

    const finalNumber = insertAtPosition(judicialProcess, checksum, 7);

    return new JudicialProcess(finalNumber);
  }

  /**
   * checksum()
   * Calcula o dígito verificador de um número SEM o dígito incluído
   *
   */
  static checksum(value: string): string {
    if (!value) throw new EmptyValueException();
    if(!/^\d{18}$/.test(value)) throw new InvalidFormatException()

    const num = value.substring(0, 7);
    const yearAndCourt = value.substring(7, 14);
    const origin = value.substring(14, 18);

    return String(
      98 -
        (Number(
          `${Number(`${Number(num) % 97}${yearAndCourt}`) % 97}${origin}00`
        ) %
          97)
    ).padStart(2, '0');
  }

  // ////////////////////////////////////////////
  //
  // Funções auxiliares
  //
  // ////////////////////////////////////////////

  /**
   * Gera um número fake da sub corte de acordo com as regras:
   * - Precisa ser uma string numérica de 2 dígitos.
   * - Não pode ser '0'. CAso seja zero, mude para '01'.
   *
   * A função aceita um parâmetro para viabilizar os testes. Caso
   * não seja definido, será gerado aleatoriamente.
   *
   * @param
   *
   */
  private static getFakeSubCourt(
    court: string | undefined = undefined
  ): string {
    court = court ?? Random.number(2, true).toString();
    return !court || +court === 0 ? '01' : court;
  }

  /**
   * 
   * Devolve o número completo sem o dígito verificador
   * 
   */
  private static getWithoutChecksum(value: string){
    if(value.length === 20) return removeFromPosition(value, 7, 9);
    if(value.length === 18) return value;

    throw new InvalidFormatException()
  }

  //
  //
  //
  // Validações
  //
  //

  private static validateCourt(value: string) {
    if (!value || value.length !== 1 || value === '0')
      throw new ValidationBRError(
        'Código do Órgão Judiciário precisa ser de 1 a 9'
      );
  }

  private static validateSubCourt(value: string) {
    if (!value || value.length !== 2 || value === '00')
      throw new ValidationBRError(
        'Tribunal de origem tem que ter 2 caracteres e deve ser diferente de "00"'
      );
  }

  private static validateOrigin(value: string) {
    if (!value || value.length !== 4 || value === '0000')
      throw new ValidationBRError(
        'Unidade de origem tem que ter 4 caracteres e deve ser diferente de "0000"'
      );
  }

  private static validateYear(value: string) {
    if (!value || value.length !== 4)
      throw new ValidationBRError('Digite um ano com 4 caracteres.');
  }
}

interface FakeOptions {
  court?: string;
  subCourt?: string;
  year?: string;
  origin?: string;
}
