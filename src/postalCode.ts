/**
 * isPostalCode()
 * Calcula se um código de rastreamento postal no formato JT194690698BR é válido.
 *
 * @doc
 * - O número de registro postal deve possuir 13 caracters no formato JT194690698BR.
 *
 * - Os caracteres 1 e 2 informam o tipo do objeto. Ex.: SX é Sedex, RC é carta registrada etc.
 *
 * - Os caracteres de 3 a 10 são a numeração sequencial do tipo do objeto.
 *
 * - O caractere 11 é o dígito verificador.
 *
 * - Os caracteres 12 e 13 representa o código do País de onde a postagem partiu.
 *
 * 1) Partes do número
 *  ______ ___________________________ ______ _______
 * | Tipo | Número                    |  DV  |  País |
 * | J T    1  9  4  6  9  0  6  9       8      B R  |
 * |______|___________________________|______|_______|
 *
 * 2) Cálculo do DV.
 *
 *  - Soma-se o produto das algarismos 3 a 10 pelos números 8, 6, 4, 2, 3, 5, 9, 7
 *
 *    1   9   4   6   9   0   6   9
 *    x   x   x   x   x   x   x   x
 *    8   6   4   2   3   5   9   7
 * =  8 +54 +16 +12 +18  +0 +54 +63 = 234
 *
 *  - O somatório encontrado é dividido por 11 e o resultado é subtraído de 11
 *    234 / 11 tem resto 3. 11 - 3 = 8. DV1 é 8.
 *    Obs.: Caso o cálculo de DV1 retorne 0, o resultado será 5.
 *          Caso retorne 1, o resto será 0
 *
 *
 *
 *
 * Fonte:
 *
 * @param {String} value Objeto postal no formato JT194690698BR
 * @returns {Boolean}
 */

import  { EmptyValueException, InvalidChecksumException } from './_exceptions/ValidationBRError'
import { sumElementsByMultipliers, clearValue, fakeNumber, randomLetter } from './utils'

/**
 * dv()
 * Calcula o dígito verificador
 *
 * @param {Number|String} value
 * @returns {String}
 */
export const dv = (value: string | number): string => {
  if (!value) throw new EmptyValueException()

  const postalCode = String(value)
    .replace(/[^0-9]+/gi, '')
    .padStart(8, '0')
    .substring(0, 8)

  const sum = sumElementsByMultipliers(postalCode, [8, 6, 4, 2, 3, 5, 9, 7])

  const rest = sum % 11
  // const specificities = { 0: { dv: 5 }, 1: { dv: 0 } }

  const specificities = [
    { rest: 0, dv: 5 },
    { rest: 1, dv: 0 },
  ]

  const specifity = specificities.find((item) => item.rest === rest)

  const DV = specifity ? specifity.dv : 11 - rest

  return String(DV)
}

/**
 * Aplica uma máscara ao número informado
 *
 * @param {String} value Número de Processo
 * @returns {String} Valor com a máscara
 */
export const mask = (value: string | number): string => String(value).toLocaleUpperCase()

/**
 * fake()
 * Gera um número válido
 *
 * @returns {String}
 */
export const fake = (withMask: boolean = false): string => {
  const num = fakeNumber(8, true)

  const postalCode = `${randomLetter()}${randomLetter()}${num}${dv(num)}BR`

  if (withMask) return mask(postalCode)
  return postalCode
}

/**
 * validateOrFail()
 * Valida se um número é válido e
 * retorna uma exceção se não estiver
 *
 * @param {String} value Número a ser validado
 * @returns {Boolean}
 */
export const validateOrFail = (value: string): boolean => {
  if (!/^[a-z]{2}([\d]{9})[a-z]{2}$/gi.test(String(value))) {
    throw new Error('O número não está no formato "XX000000000XX"')
  }

  const postalCode = clearValue(value.substring(2, 11), 9)

  if (dv(value.substring(2, 11)) !== postalCode.substring(8, 9)) {
    throw new InvalidChecksumException()
  }

  return true
}

/**
 * validate()
 * Valida se um número é válido
 *
 * @param {String} value Número a ser validado
 * @returns {Boolean}
 */
export const validate = (value: string): boolean => {
  try {
    return validateOrFail(value)
  } catch (error) {
    return false
  }
}

export default validate
