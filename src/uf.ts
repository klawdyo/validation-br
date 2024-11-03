import ValidationBRError, { EmptyValueException } from './_exceptions/ValidationBRError';
import { Random } from './_helpers/random';
import { Base } from './base';

export class UF extends Base {
  _mask = null;

  /**
   *
   */
  private static _values: UFItem[] = [
    { name: 'Acre', short: 'AC' },
    { name: 'Alagoas', short: 'AL' },
    { name: 'Amapá', short: 'AP' },
    { name: 'Amazonas', short: 'AM' },
    { name: 'Bahia', short: 'BA' },
    { name: 'Ceará', short: 'CE' },
    { name: 'Distrito Federal', short: 'DF' },
    { name: 'Espírito Santo', short: 'ES' },
    { name: 'Goiás', short: 'GO' },
    { name: 'Maranhão', short: 'MA' },
    { name: 'Mato Grosso', short: 'MT' },
    { name: 'Mato Grosso do Sul', short: 'MS' },
    { name: 'Minas Gerais', short: 'MG' },
    { name: 'Pará', short: 'PA' },
    { name: 'Paraíba', short: 'PB' },
    { name: 'Paraná', short: 'PR' },
    { name: 'Pernambuco', short: 'PE' },
    { name: 'Piauí', short: 'PI' },
    { name: 'Rio de Janeiro', short: 'RJ' },
    { name: 'Rio Grande do Norte', short: 'RN' },
    { name: 'Rio Grande do Sul', short: 'RS' },
    { name: 'Rondônia', short: 'RO' },
    { name: 'Roraima', short: 'RR' },
    { name: 'Santa Catarina', short: 'SC' },
    { name: 'São Paulo', short: 'SP' },
    { name: 'Sergipe', short: 'SE' },
    { name: 'Tocantins', short: 'TO' },
  ];

  protected _value: string;
  protected _ufItem: UFItem;

  constructor(uf: string);
  constructor(ufItem: UFItem);
  constructor(data: string | UFItem) {
    if (!data) throw new EmptyValueException();

    const isString = typeof data === 'string';
    super(isString ? data : data.short);

    if (isString) {
      this._value = data;
      this.normalize();
      this.validate();
      this._ufItem = UF.find(this._value);
    } else {
      this._value = data.short;
      this.normalize();
      this.validate();
      this._ufItem = data;
    }
  }

  //
  //
  //
  //

  /**
   * Sigla
   */
  get short() {
    return this._value;
  }

  /**
   * Nome do estado
   */
  get name(): string {
    return this._ufItem.name;
  }

  //
  //
  //
  //

  /**
   * Devolve a sigla
   */
  toString() {
    return this._value;
  }

  /**
   * Devolve o nome
   */
  getName(): string {
    return this.name;
  }

  //
  //
  //
  //
  //

  /**
   * 
   * 
   */
  protected normalize(): void {
    this._value = this._value.toLocaleUpperCase();
  }

  /**
   * 
   * 
   */
  protected validate(): boolean {
    return /^[a-z]{2}$/i.test(this._value);
  }

  //
  //
  // STATIC
  //
  //

  static get AC(): UF {
    return new UF('AC');
  }

  static get AL(): UF {
    return new UF('AL');
  }

  static get AP(): UF {
    return new UF('AP');
  }

  static get AM(): UF {
    return new UF('AM');
  }

  static get BA(): UF {
    return new UF('BA');
  }

  static get CE(): UF {
    return new UF('CE');
  }

  static get DF(): UF {
    return new UF('DF');
  }

  static get ES(): UF {
    return new UF('ES');
  }

  static get GO(): UF {
    return new UF('GO');
  }

  static get MA(): UF {
    return new UF('MA');
  }

  static get MT(): UF {
    return new UF('MT');
  }

  static get MS(): UF {
    return new UF('MS');
  }

  static get MG(): UF {
    return new UF('MG');
  }

  static get PA(): UF {
    return new UF('PA');
  }

  static get PB(): UF {
    return new UF('PB');
  }

  static get PR(): UF {
    return new UF('PR');
  }

  static get PE(): UF {
    return new UF('PE');
  }

  static get PI(): UF {
    return new UF('PI');
  }

  static get RJ(): UF {
    return new UF('RJ');
  }

  static get RN(): UF {
    return new UF('RN');
  }

  static get RS(): UF {
    return new UF('RS');
  }

  static get RO(): UF {
    return new UF('RO');
  }

  static get RR(): UF {
    return new UF('RR');
  }

  static get SC(): UF {
    return new UF('SC');
  }

  static get SP(): UF {
    return new UF('SP');
  }

  static get SE(): UF {
    return new UF('SE');
  }

  static get TO(): UF {
    return new UF('TO');
  }

  /**
   * 
   * Localiza um ufitem pela sigla
   * 
   */
  static find(short: string): UFItem {
    const found = UF._values.find((uf) => uf.short === short);

    if (found) return found;

    throw new NotFoundUFException();
  }

  /**
   *
   */
  static getList(): UFItem[] {
    return UF._values;
  }

  /**
   * 
   * 
   */
  static getRandom(): UF {
    const random = Random.fromArray<UFItem>(UF._values);
    return new UF(random);
  }
}

export class NotFoundUFException extends ValidationBRError {
  constructor() {
    super('UF não localizada');
  }
}

interface UFItem {
  name: string;
  short: string;
}
