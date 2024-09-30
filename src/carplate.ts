/**
 * Placas de carro no formato mercosul e placas mais antigas
 * AAA-0000 e AAA-0A00
 * 
 * 
 */


import { Base } from "./base";
import { InvalidFormatException, NoChecksumException } from "./_exceptions/ValidationBRError";
import { fakeNumber, randomLetter } from "./utils";

export class CarPlate extends Base {

  protected _mask: string = '000-0000'

  constructor(protected _value: string) {
    super(_value)
    this.normalize()
    if (!this.validate()) throw new InvalidFormatException()
  }

  // 
  // 
  // 
  // 
  // 

  validate() {
    return /^[A-Z]{3}-?[0-9][A-Z0-9][0-9]{2}$/i.test(this._value)
  }

  // 
  // 
  // PROTECTED
  // 
  // 

  /**
   * Padroniza o valor, sem modificar a ponto de permitir que a validação aceite um valor inválido
   * Ex.: AAA0-000 é inválido. Normalize() não pode modificar isso.
   */
  protected normalize(): void {
    this._value = this._value.toLocaleUpperCase().trim()//.replace(/[-]+/g, '')
  }


  // 
  // 
  // STATIC
  // 
  // 

  static checksum(): string | null {
    throw new NoChecksumException();
  }

  static fake(): CarPlate {
    const fake = `${randomLetter()}${randomLetter()}${randomLetter()}${fakeNumber(1)}${randomLetter()}${fakeNumber(2, true)}`;
    return new CarPlate(fake)
  }
}
