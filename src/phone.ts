/**
 * Valida telefone brasileiro.
 *
 *
 * @example
 *
 * // Com classes
 *
 * new Phone('+55 (84) 9 9966-2587').validate()
 * // -> true
 *
 * new Phone('84 9 9966 2587').validate()
 * // -> true
 *
 * new Phone('8440043214').validate()
 * // -> true
 *
 * new Phone('(23) 4004-3214').validate()
 * // -> throws error
 *
 * new Phone('(13) 6 6321-875').validate()
 * // -> throws error
 *
 * new Phone('(79) 3333698').validate()
 * // -> throws error
 *
 * Phone.fake()
 * // -> 84987654321
 *
 * new Phone('(84) 555 178').mask()
 * //
 *
 * // Métodos estáticos
 * validate('84999963214')
 * validate('84999963214')
 * mask('84999963214')
 * fake()
 */

import ValidationBRError, {
  InvalidFormatException,
} from './_exceptions/ValidationBRError';
import { Random } from './_helpers/random';
import { Base } from './base';

type FakeSettings = {
  isMobile: boolean;
  isLandline: boolean;
  ddd: string;
};

type MaskSettings = {
  withCountry: boolean;
};

export class Phone extends Base {
  protected _mask = null;

  private _regex = /^(?<ddi>\+55)?(?<ddd>\d{2})(?<phone>9\d{8}|[34]\d{7})$/;
  // private _parts = { ddd: '', phone: '', isMobile: false };
  private static _ddds: string[] = [
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '21',
    '22',
    '24',
    '27',
    '28',
    '31',
    '32',
    '33',
    '34',
    '35',
    '37',
    '38',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '47',
    '48',
    '49',
    '51',
    '53',
    '54',
    '55',
    '61',
    '62',
    '63',
    '64',
    '65',
    '66',
    '67',
    '68',
    '69',
    '71',
    '73',
    '74',
    '75',
    '77',
    '79',
    '81',
    '82',
    '83',
    '84',
    '85',
    '86',
    '87',
    '88',
    '89',
    '91',
    '92',
    '93',
    '94',
    '95',
    '96',
    '97',
    '98',
    '99',
  ];

  private _ddd: string = '';
  private _phone: string = '';
  private _ddi: string = '';
  private _isMobile: boolean = false;

  constructor(protected _value: string) {
    super(_value);
    // console.log('1', _value);

    this.normalize();
    this.parse();
    // console.log('2', this);

    if (!this.validate()) {
      throw new InvalidFormatException();
    }
  }

  get ddi(): string {
    return this._ddi;
  }

  get ddd(): string {
    return this._ddd;
  }

  get phone(): string {
    return this._phone;
  }

  get isMobile(): boolean {
    return this._isMobile;
  }

  /**
   *
   * Remove os caracteres especiais e somente eles.
   * Não remove letras e outros caracteres estranhos para evitar que
   * o validador acabe aceitando um número com letras, por exemplo.
   *
   */
  protected normalize(): string {
    const clearedNum = this._value.replace(/([()\s-])/g, '');
    return (this._value = clearedNum);
  }

  /**
   *
   * Separa o número em ddi, ddd e número
   *
   */
  protected parse() {
    const match = this._regex.exec(this._value);

    if (match?.groups) {
      this._ddi = match.groups.ddi || '+55';
      this._ddd = match.groups.ddd;
      this._phone = match.groups.phone;
      this._isMobile = match.groups.phone.length === 9;
      this._value = `${this._ddi}${this._ddd}${this._phone}`;
    } else {
      throw new InvalidFormatException();
    }
  }

  /**
   *
   * Verifica se o DDD localizado existe na lista de DDDs
   *
   */
  protected validate(): boolean {
    return Phone._ddds.includes(this._ddd);
  }

  /**
   * Devolve com máscara
   *
   */
  mask(config?: Partial<MaskSettings>): string {
    return `${config?.withCountry ? '+55 ' : ''}${this._ddd} ${this._phone}`;
  }

  /**
   * Devolve o checksum
   *
   */
  checksum(): string | null {
    return null;
  }

  /**
   *
   * Gera um número fake
   *
   */
  static fake(config?: Partial<FakeSettings>): Phone {
    // Se definir um DDD pro fake, ele precisa existir
    const inputInvalidDDD = config?.ddd && !Phone._ddds.includes(config?.ddd);
    if (inputInvalidDDD) throw new DDDNotFoundException();

    // Se o DDD não estiver preenchido, escolha um da lista
    const ddd = config?.ddd ?? Random.fromArray(Phone._ddds);

    // Prefixos
    const mobilePrefixes = ['99', '98', '97'];
    const landLinePrefixes = ['3', '4'];

    // Se não informar se quer mobile ou fixo, gere o tipo
    let firstPart;
    if (config?.isMobile) firstPart = Random.fromArray(mobilePrefixes);
    else if (config?.isLandline) firstPart = Random.fromArray(landLinePrefixes);
    else firstPart = Random.fromArray([...mobilePrefixes, ...landLinePrefixes]);

    // Pega o restante do número aleatoriamente
    const number = Random.number(7, true);
    const phone = `+55${ddd}${firstPart}${number}`;

    return new Phone(phone);
  }
}

export class DDDNotFoundException extends ValidationBRError {
  constructor() {
    super('DDD não encontrado');
  }
}
