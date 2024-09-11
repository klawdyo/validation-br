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
 * validateOrFail('84999963214')
 * mask('84999963214')
 * fake()
 */

import { IBRDocument } from "./_interfaces/document.interface";
import ValidationBRError from "./_exceptions/ValidationBRError";
import { fakeNumber } from "./utils";
import { arrayRandom } from "./_helpers/array_random";

type FakeSettings = {
  withMask: boolean;
  withCountry: boolean;
  isMobile: boolean;
  isLandline: boolean;
  ddd: string;
}

type MaskSettings = {
  withCountry: boolean;
}

export class Phone implements IBRDocument {
  private _regex = /^(?<br>\+55)?\s?\(?(?<ddd>\d{2})?\)?-?\s?(?<num>9?\s?\d{4}[-|\s]?\d{4})$/;
  private _parts = { ddd: '', phone: '', isMobile: false };
  private static _ddds: string[] = [
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "24", "27", "28", "31", "32",
    "33", "34", "35", "37", "38", "41", "42", "43", "44", "45", "46", "47", "48", "49", "51", "53",
    "54", "55", "61", "62", "63", "64", "65", "66", "67", "68", "69", "71", "73", "74", "75", "77",
    "79", "81", "82", "83", "84", "85", "86", "87", "88", "89", "91", "92", "93", "94", "95", "96",
    "97", "98", "99"
  ];

  constructor(public phone: string) {
    this.normalize()
  }

  /**
   * 
   * 
   * 
   */
  normalize(): string {
    const match = this._regex.exec(this.phone)
    if (!match) throw ValidationBRError.INVALID_FORMAT;

    const [, , ddd, phone] = match

    const clearedNum = phone.replace(/[^\d]/g, '');
    this.phone = `+55${ddd}${clearedNum}`

    const dddExists = Phone._ddds.includes(ddd)
    if (!dddExists) throw new ValidationBRDDDNotFound();

    this._parts = { ddd, phone, isMobile: clearedNum.length === 9 }

    return this.phone
  }

  /**
   * 
   * 
   * 
   */
  validate() {
    this.normalize()
    return true
  }

  /**
   * Devolve com máscara
   * 
   */
  mask(config?: Partial<MaskSettings>): string {
    return `${config?.withCountry ? '+55 ' : ''}${this._parts.ddd} ${this._parts.phone}`
  }

  /**
   * Devolve o checksum
   * 
   */
  checksum(): string | null {
    return null
  }

  /**
   * 
   * Gera um número fake
   * 
   */
  static fake(config?: Partial<FakeSettings>): string {
    const country = config?.withCountry ? '+55' : '';
    
    const inputInvalidDDD = config?.ddd && !Phone._ddds.includes(config?.ddd);
    if (inputInvalidDDD) throw new ValidationBRDDDNotFound();

    const ddd = config?.ddd ?? arrayRandom(Phone._ddds);

    const mobilePrefixes = ['99', '98', '97'];
    const landLinePrefixes = ['3', '4'];

    let firstPart;
    if (config?.isMobile) firstPart = arrayRandom(mobilePrefixes);
    else if (config?.isLandline) firstPart = arrayRandom(landLinePrefixes);
    else firstPart = arrayRandom([...mobilePrefixes, ...landLinePrefixes]);

    const number = fakeNumber(7, true);
    const phone = `${country}${ddd}${firstPart}${number}`;

    if (config?.withMask) return (new Phone(phone)).mask({ withCountry: config?.withCountry });
    return phone;
  }
}


export const fake = (config?: Partial<FakeSettings>) => Phone.fake(config);

export const checksum = (phone: string) => null;

export const validateOrFail = (phone: string) => {
  new Phone(phone);
  return true;
}

export const validate = (phone: string) => {
  try {
    new Phone(phone)
    return true;
  } catch (error) {
    return false;
  }
}

export const mask = (phone: string, config?: Partial<MaskSettings>) => {
  const object = new Phone(phone);
  return object.mask(config);
}


export class ValidationBRDDDNotFound extends ValidationBRError {
  constructor() {
    super('DDD não encontrado');
  }
}