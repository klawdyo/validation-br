/**
 * RENAVAM
 * Funções auxiliares para cálculo de máscaras, validação, dígito verificador e criaçãode
 * números fake.
 *
 * @doc
 * - O número de RENAVAM deve possuir 11 caracteres
 *
 * - Os caracteres de 1 a 10 são a numeração documento
 *
 * - O caractere 11 é o dígito verificador.
 *
 * 1) Partes do número
 *  _______________________________________________
 * |  Número                                 | D V |
 * |  2   6   8   2   7   6   4   9   9   6  -  0  |
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
 *  - O somatório encontrado é multiplicado por 10 e ao resultado
 *    é aplicado o cálculo do MOD 11.
 *
 *    ( 234 * 10 ) / 11 tem resto 8. DV = 8. Caso o resto seja maior ou igual a
 *    10, DV será 0.
 *
 *
 */

import {
  sumElementsByMultipliers,
  clearValue,
  fakeNumber,
  applyMask,
  invalidListGenerator,
} from './utils'

/**
 * dv()
 * Calcula o dígito verificador
 *
 * @param {Number|String} value
 * @returns {String}
 */
export const dv = (value: string | number): string => {
  if (!value) throw new Error('Renavam não informado')

  const renavam = clearValue(value, 10) // só 10 para remover o DV

  const invalidList = invalidListGenerator(10)
  if (invalidList.includes(renavam)) {
    throw new Error('RENAVAM não pode ser uma sequência de números iguais')
  }

  const sum1 = sumElementsByMultipliers(renavam, [3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) * 10
  const dv1 = sum1 % 11 >= 10 ? 0 : sum1 % 11
  return `${dv1}`
}

/**
 * Aplica uma máscara ao número informado
 *
 * @param {String} value Número de Processo
 * @returns {String} Valor com a máscara
 */
export const mask = (value: string | number): string => applyMask(value, '0000000000-0')

/**
 * fake()
 * Gera um número válido
 *
 * @returns {String}
 */
export const fake = (withMask: boolean = false): string => {
  const value = fakeNumber(10, true)

  const renavam = `${value}${dv(value)}`

  if (withMask) return mask(renavam)

  return renavam
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
  const renavam = clearValue(value, 11)

  if (dv(renavam) !== renavam.substring(10, 11)) {
    throw new Error('Dígito verificador inválido')
  }

  return true
}

/**
 * validate()
 * Valida se um número é valido
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
