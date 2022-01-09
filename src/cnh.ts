/**
 * isCNH()
 * Calcula se uma CNH é válida
 *
 * @doc
 * CNH deve possuir 11 caracteres
 *
 * - Os caracteres 1 a 9 são números sequenciais.
 *
 *
 * - Os caracteres 10 e 11 são dígitos verificadores.
 *
 * 1) Partes do número
 *  ____________________________ ______
 * |  Número                    | D V |
 * |  5  8  3  1  6  7  9  4  5   3 4 |
 * |____________________________|_____|
 *
 * 2) Cálculo do primeiro DV.
 *
 *  - Soma-se o produto das algarismos 1 a 9 pelos números 2, 3, 4, 5, 6, 7, 8, 9, 10.
 *
 *    5   8   3   1   6   7   9   4   5
 *    x   x   x   x   x   x   x   x   x
 *    2   3   4   5   6   7   8   9   10
 * = 10 +24 +12  +5 +36 +49 +72 +36  +50  = 294
 *
 *  - O somatório encontrado é dividido por 11. O DV1 é 11 subtraído do resto da divisão. Se o
 *    resto for 10, o DV1 é 0.
 *
 * 2.1) 294 / 11 tem resto igual a 8. 11-7 = 3
 *      DV1 = 3
 *
 * 3) Cálculo do segundo DV
 *
 *  - Soma-se o produto das algarismos 1 a 9 juntamente com o 10 caractere
 *    que é o DV1, pelos números 3, 4, 5, 6, 7, 8, 9, 10, 11, 2. O DV1 será
 *    multiplicado por 2 e ficará no final.
 *
 *    5   8   3   1   6   7   9   4   5   3
 *    x   x   x   x   x   x   x   x   x   x
 *    3   4   5   6   7   8   9  10  11   2
 * = 10 +24 +12  +5 +36 +49 +72 +36 +50  +6  =  348
 *
 * 3.1) 348 / 11 tem resto igual a 7. 11 - 7 = 4.
 *      DV2 = 4
 *
 *  - O somatório encontrado é dividido por 11. O DV2 é 11 subtraído do resto da divisão. Se o
 *    resto for 10, o DV2 é 0.
 *
 * Fonte: https://www.devmedia.com.br/forum/validacao-de-cnh/372972
 *
 * @param {String} value Título eleitoral
 * @returns {Boolean}
 */

import {
  sumElementsByMultipliers,
  sumToDV,
  invalidListGenerator,
  clearValue,
  applyMask,
  fakeNumber,
} from './utils'

/**
 * Calcula o Dígito Verificador de um RENAVAM informado
 *
 * @returns String Número fake de um cnh válido
 */
export const dv = (value: string | number): string => {
  if (!value) throw new Error('CNH não informado')

  const cnh = clearValue(value, 9)

  const invalidList = invalidListGenerator(9)
  if (invalidList.includes(cnh)) {
    throw new Error('CNH não pode ser uma sequência de números iguais')
  }

  const sum1 = sumElementsByMultipliers(cnh.substring(0, 9), [2, 3, 4, 5, 6, 7, 8, 9, 10])
  const dv1 = sumToDV(sum1)

  const sum2 = sumElementsByMultipliers(cnh.substring(0, 9) + dv1, [3, 4, 5, 6, 7, 8, 9, 10, 11, 2])
  const dv2 = sumToDV(sum2)

  return `${dv1}${dv2}`
}

/**
 * Valida um número de cnh e retorna uma exceção caso seja inválido
 *
 * @returns String Número fake de um cnh válido
 */
export const validateOrFail = (value: string | number): boolean => {
  const cnh = clearValue(value, 11)

  if (dv(cnh) !== cnh.substring(9, 11)) {
    throw new Error('Dígito verificador inválido')
  }

  return true
}

/**
 * Valida um número de cnh
 *
 * @returns String Valor a ser validado
 */
export const validate = (value: string | number): boolean => {
  try {
    return validateOrFail(value)
  } catch (error) {
    return false
  }
}

/**
 * Aplica uma máscara a uma string
 *
 * @returns String string com a máscara aplicada
 */
export const mask = (value: string | number): string => applyMask(value, '000000000-00')

/**
 * Cria um número fake
 *
 * @returns String Número fake porém válido
 */
export const fake = (withMask: boolean = false): string => {
  const value = fakeNumber(9, true)

  const cnh = `${value}${dv(value)}`

  if (withMask) return mask(cnh)

  return cnh
}

export default validate