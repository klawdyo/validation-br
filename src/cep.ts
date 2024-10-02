import ValidationBRError, {
  InvalidFormatException,
  NoChecksumException,
} from './_exceptions/ValidationBRError';
import { Random } from './_helpers/random';
import { Base } from './base';
import { UF } from './uf';

export class CEP extends Base {
  protected _mask = '00000-000';

  protected static _ranges: Record<string, [string, string][]> = {
    // São Paulo(SP) 01000-000 a 19999-999
    [UF.SP.value]: [['01000000', '19999999']],
    // Rio de Janeiro(RJ) 20000-000 a 28999-999
    [UF.RJ.value]: [['20000000', '28999999']],
    // Espírito Santo(ES) 29000-000 a 29999-999
    [UF.ES.value]: [['29000000', '29999999']],
    // Minas Gerais(MG) 30000-000 a 39999-999
    [UF.MG.value]: [['30000000', '39999999']],
    // Paraná(PR) 80000-000 a 87999-999
    [UF.PR.value]: [['80000000', '87999999']],
    // Santa Catarina(SC) 88000-000 a 89999-999
    [UF.SC.value]: [['88000000', '89999999']],
    // Rio Grande do Sul(RS) 90000-000 a 99999-999
    [UF.RS.value]: [['90000000', '99999999']],
    // Bahia(BA) 40000-000 a 48999-999
    [UF.BA.value]: [['40000000', '48999999']],
    // Sergipe(SE) 49000-000 a 49999-999
    [UF.SE.value]: [['49000000', '49999999']],
    // Pernambuco(PE) 50000-000 a 56999-999
    [UF.PE.value]: [['50000000', '56999999']],
    // Alagoas(AL) 57000-000 a 57999-999
    [UF.AL.value]: [['57000000', '57999999']],
    // Paraíba(PB) 58000-000 a 58999-999
    [UF.PB.value]: [['58000000', '58999999']],
    // Rio Grande do Norte(RN) 59000-000 a 59999-999
    [UF.RN.value]: [['59000000', '59999999']],
    // Ceará(CE) 60000-000 a 63999-999
    [UF.CE.value]: [['60000000', '63999999']],
    // Piauí(PI) 64000-000 a 64999-999
    [UF.PI.value]: [['64000000', '64999999']],
    // Maranhão(MA) 65000-000 a 65999-999
    [UF.MA.value]: [['01000000', '19999999']],
    // Pará(PA) 01000-000 a 19999-999
    [UF.PA.value]: [['01000000', '19999999']],
    // Amapá(AP) 68900-000 a 68999-999
    [UF.AP.value]: [['68900000', '68999999']],

    // Amazonas(AM) 1 69000-000 a 69299-999
    // Amazonas(AM) 2 69400-000 a 69899-999
    [UF.AM.value]: [
      ['69000000', '69299999'],
      ['69400000', '69899999'],
    ],

    // Roraima(RR) 69300-000 a 69399-999
    [UF.RR.value]: [['69300000', '69399999']],
    // Acre(AC) 69900-000 a 69999-999
    [UF.AC.value]: [['69900000', '69999999']],
    // Rondônia(RO) 76800-000 a 76999-999
    [UF.RO.value]: [['76800000', '76999999']],
    // Tocantins(TO) 77000-000 a 77999-999
    [UF.TO.value]: [['77000000', '77999999']],

    // Distrito Federal(DF) 1 70000-000 a 72799-999
    // Distrito Federal(DF) 2 73000-000 a 73699-999
    [UF.DF.value]: [
      ['70000000', '72799999'],
      ['73000000', '73699999'],
    ],

    // Goiás(GO) 1 72800-000 a 72999-999
    // Goiás(GO) 2 73700-000 a 76799-999
    [UF.GO.value]: [
      ['72800000', '72999999'],
      ['73700000', '76799999'],
    ],

    // Mato Grosso(MT) 78000-000 a 78899-999
    [UF.MT.value]: [['78000000', '78899999']],
    // Mato Grosso do Sul(MS) 79000-000 a 79999-999
    [UF.MS.value]: [['79000000', '79999999']],
  };

  constructor(protected _value: string, options?: ValidationOptions) {
    super(_value);

    if (!this.validate(options)) {
      throw new InvalidFormatException();
    }

    this.normalize();
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
    this._value = this._value.replace(/[.-]/g, '');
  }

  /**
   * validateOrFail()
   * Valida se um número é válido e
   * retorna uma exceção se não estiver
   *
   * @link https://regex101.com/r/uQJuUM/1
   * 
   *
   */
  protected validate(options?: ValidationOptions): boolean {
    const rgx = /^(\d{2}\.?\d{3}-|\d{5}-?)\d{3}$/;
    const isValidFormat = rgx.test(this._value);
    if (!isValidFormat) return false;

    // Valida se tiver estado
    if (options?.uf) {
      return CEP.getUFByCEP(this._value).short === options.uf.short;
    }

    return true;
  }

  /**
   * checksum()
   * Calcula o dígito verificador de um número SEM o dígito incluído
   *
   */
  static checksum(value: string): string {
    throw new NoChecksumException();
  }

  /**
   * Cria um número fake
   * - Deve criar um fake dentro de uma faixa
   *
   */
  static fake(options: Partial<ValidationOptions> = {}): CEP {
    if (options.uf) {
      return CEP.getRandomByUF(options.uf);
    } else {
      return new CEP(Random.number(8, true));
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
   * Verifica se um CEP está dentro de uma faixa e retorna o estado
   *
   */
  static getUFByCEP(value: string): UF {
    const normalized = value.replace(/\D/g, '');

    const foundItem = Object.entries(CEP._ranges).find(([ufShort, ranges]) => {
      const foundRange = ranges.find((range) => {
        return normalized >= range[0] && normalized <= range[1];
      });

      return foundRange ? true : false;
    });

    if (foundItem) return new UF(foundItem[0]);

    throw new NotFoundCEPException();
  }

  /**
   *
   * Pega aleatoriamente um CEP em um estado
   *
   */
  static getRandomByUF(uf: UF): CEP {
    const [range] = CEP.getRangesByUF(uf);
    const randomCEP = Random.between(+range[0], +range[1]);
    return new CEP(String(randomCEP).padStart(8, '0'));
  }

  /**
   *
   * Pega as faixas de CEP por estado
   *
   */
  static getRangesByUF(uf: UF) {
    return CEP._ranges[uf.value];
  }
}

interface ValidationOptions {
  uf?: UF;
}

export class NotFoundCEPException extends ValidationBRError {
  constructor() {
    super('CEP não encontrado');
  }
}
