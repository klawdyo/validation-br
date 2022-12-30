/**
 * isPIS()
 * Calcula se um código de PIS/PASEP/NIS/NIT no formato 268.27649.96-0 é válido. Não
 * valida o formato, portanto, 26827649960 é equivalente a 268.27649.96-0 para efeitos
 * desta validação.
 *
 * @doc
 * - O número de PIS deve possuir 11 caracteres
 *
 * - Os caracteres de 1 a 10 são a numeração documento
 *
 * - O caractere 11 é o dígito verificador.
 *
 * 1) Partes do número
 *  _______________________________________________
 * |  Número                                 | D V |
 * |  2   6   8 . 2   7   6   4   9 . 9   6  -  0  |
 * |_________________________________________|_____|
 *
 * 2) Cálculo do DV.
 *
 *  - Soma-se o produto das algarismos 3 a 10 pelos números 3, 2, 9, 8, 7, 6, 5, 4, 3, 2
 *
 *    2   6   8   2   7   6   4   9   9   6
 *    x   x   x   x   x   x   x   x   x   x
 *    3   2   9   8   7   6   5   4   3   2
 * =  6 +12 +72 +16 +49 +12 +20 +36 +27 +12  =  234
 *
 *  - O somatório encontrado é dividido por 11 e o resultado é subtraído de 11
 *    234 / 11 tem resto 3. 11 - 3 = 8. DV1 é 8.
 *    Obs.: Caso o cálculo de DV1 retorne 0, o resultado será 5.
 *          Caso retorne 1, o resto será 0
 *
 *
 *
 *
 * Fonte: http://www.macoratti.net/alg_pis.htm
 *
 * @param {String} value Objeto postal no formato 268.27649.96-0
 * @returns {Boolean}
 */

import ValidationBRError from './data/ValidationBRError'
import { sumElementsByMultipliers, sumToDV, clearValue, fakeNumber, applyMask } from './utils'

/**
 * dv()
 * Calcula o dígito verificador
 *
 * @param {Number|String} value
 * @returns {String}
 */
export const dv = (value: string | number): string => {
  const pis = clearValue(value, 10, {
    trimAtRight: true,
    rejectEmpty: true,
  })

  const sum = sumElementsByMultipliers(pis, [3, 2, 9, 8, 7, 6, 5, 4, 3, 2])

  return String(sumToDV(sum))
}

/**
 * Aplica uma máscara ao número informado
 *
 * @param {String} value Número de Processo
 * @returns {String} Valor com a máscara
 */
export const mask = (value: string | number): string => applyMask(value, '000.00000.00-0')

/**
 * fake()
 * Gera um número válido
 *
 * @returns {String}
 */
export const fake = (withMask: boolean = false): string => {
  const num = fakeNumber(10, true)

  const pis = `${num}${dv(num)}`

  if (withMask) return mask(pis)
  return pis
}

/**
 * validateOrFail()
 * Valida se um número é válido e
 * retorna uma exceção se não estiver
 *
 * @param {String|Number} value Número a ser validado
 * @returns {Boolean}
 */
export const validateOrFail = (value: string | number): boolean => {
  const pis = clearValue(value, 11, {
    fillZerosAtLeft: true,
    rejectEmpty: true,
    rejectHigherLength: true,
    rejectEqualSequence: true,
  })

  if (dv(pis) !== pis.substring(10, 11)) {
    throw ValidationBRError.INVALID_DV
  }

  return true
}

/**
 * validate()
 * Valida se um número é válido
 *
 * @param {String|Number} value Número a ser validado
 * @returns {Boolean}
 */
export const validate = (value: string | number): boolean => {
  try {
    return validateOrFail(value)
  } catch (error) {
    return false
  }
}

export default validate
