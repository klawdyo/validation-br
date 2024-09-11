/**
 * Placas de carro no formato mercosul e placas mais antigas
 * AAA-0000 e AAA-0A00
 * 
 * 
 */


import { IBRDocument } from "./_interfaces/document.interface";
import ValidationBRError from "./_exceptions/ValidationBRError";
import { applyMask, fakeNumber, randomLetter } from "./utils";

type FakeOptions = {
  withMask: boolean
}

class CarPlate implements IBRDocument {
  carPlate: string;

  constructor(carPlate: string) {
    this.carPlate = carPlate.toLocaleUpperCase().replace(/[^0-9A-Z]+/g, '')
    const isValid = this.validate()
    if (!isValid) throw ValidationBRError.INVALID_FORMAT
  }

  validate() {
    return /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(this.carPlate)
  }

  mask(): string {
    return applyMask(this.carPlate, '000-0000')
  }

  static fake(withMask: boolean | FakeOptions = false): string {
    const fake = `${randomLetter()}${randomLetter()}${randomLetter()}${fakeNumber(1)}${randomLetter()}${fakeNumber(2, true)}`
    if (!withMask) return fake
    const carPlate = new CarPlate(fake)
    return carPlate.mask()
  }

  checksum(): string | null {
    return null
  }

}

/**
 * @deprecated
 */
export function dv(value: string): string | null {
  const carPlate = new CarPlate(value)
  return carPlate.checksum()
}

/**
 * 
 * Dígito verificador
 * 
 */
export function checksum(value: string): string | null {
  const carPlate = new CarPlate(value)
  return carPlate.checksum()
}

/**
 * 
 * Placa fake
 * 
 */
export function fake(withMask = false): string {
  return CarPlate.fake(withMask)
}

/**
 * 
 * Máscara
 * 
 */
export function mask(value: string): string {
  const carPlate = new CarPlate(value)
  return carPlate.mask()
}

/**
 * 
 * Valida ou retorna um erro
 * 
 * 
 */
export function validateOrFail(value: string): boolean {
  new CarPlate(value)
  return true
}

/**
 * 
 * Valida
 * 
 */
export function validate(value: string): boolean {
  try {
    new CarPlate(value)
    return true
  } catch (error) {
    return false
  }
}
