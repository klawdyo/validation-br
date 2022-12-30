/**
 * isCNPJ()
 * Calcula se um CNPJ é válido
 *
 * @doc
 * - CNPJ deve possuir 14 dígitos no formato 00.000.000/0000-00
 *
 * - Os caracteres 1 a 8 são números sequenciais definidos pela Receita Federal
 *
 * - Os caracteres 9 a 12 são a identificação das filiais da empresa.
 *
 * - Os caracteres 13 e 14 são os dígitos verificadores
 *
 * 1) Partes do número
 *  _______________________________ _______________ _______
 * | Número                        |    Filiais    |  DV   |
 * | 1   1 . 2   2   2 . 3   3   3 / 0   0   0   1 - X   Y |
 * |_______________________________|_______________|_______|
 *
 * 2) Cálculo do primeiro DV.
 *
 *  - Soma-se o produto das algarismos 1 a 12 pelos números 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2
 *
 *    1   1   2   2   2   3   3   3   0   0   0   1
 *    x   x   x   x   x   x   x   x   x   x   x   x
 *    5   4   3   2   9   8   7   6   5   4   3   2
 * =  5  +4  +6  +4 +18 +24 +21 +18  +0  +0  +0  +2 = 102
 *
 *  - O somatório encontrado é dividido por 11 e o resultado é subtraído de 11
 *    102 / 11 tem resto 8. 11 - 3 = 8. DV1 é 8.
 *    Obs.: Caso o cálculo de DV1 retorne 10, o resultado será 0.
 *
 * 3) Cálculo do segundo DV.
 *
 *  - Soma-se o produto das algarismos 1 a 13 (incluindo o DV1 calculado) pelos
 *    números 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2.
 *
 *    1   1   2   2   2   3   3   3   0   0   0   1   8
 *    x   x   x   x   x   x   x   x   x   x   x   x   x
 *    6   5   4   3   2   9   8   7   6   5   4   3   2
 * =  6  +5  +8  +6  +4 +27 +24 +21  +0  +0  +0  +3 +16 = 120
 *
 *  - O somatório encontrado é dividido por 11 e o resultado é subtraído de 11
 *    120 / 11 tem resto 10. 11 - 10 = 1. DV2 é 1.
 *    Obs.: Caso o cálculo de DV2 retorne 10, o resultado será 0.
 *
 * Fonte: http://www.macoratti.net/alg_cnpj.htm
 *
 * @param {String} value Título eleitoral
 * @returns {Boolean}
 */

import {
  invalidListGenerator,
  sumElementsByMultipliers,
  sumToDV,
  clearValue,
  fakeNumber,
  applyMask,
} from './utils'

export const dv = (value: string | number): string => {
  const cnpj = clearValue(value, 12, { trimAtRight: true, rejectEmpty: true })

  const blackList = invalidListGenerator(12)
  if (blackList.includes(cnpj)) {
    throw new Error('CNPJ não permite sequência de caracteres iguais')
  }

  const sum1 = sumElementsByMultipliers(cnpj.substring(0, 12), '543298765432')
  const dv1 = sumToDV(sum1)

  const sum2 = sumElementsByMultipliers(cnpj.substring(0, 12) + dv1, '6543298765432')
  const dv2 = sumToDV(sum2)

  return `${dv1}${dv2}`
}

/**
 * Aplica uma máscara ao número informado
 *
 * @param {String} value Número de Processo
 * @returns {String} Valor com a máscara
 */
export const mask = (value: string | number): string => applyMask(value, '00.000.000/0000-00')

/**
 *
 *
 */
export const fake = (withMask: boolean = false): string => {
  const num = fakeNumber(12, true)

  const cnpj = `${num}${dv(num)}`

  if (withMask) return mask(cnpj)
  return cnpj
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
  const cnpj = clearValue(value, 14, {
    fillZerosAtLeft: true,
    rejectEmpty: true,
    rejectHigherLength: true,
  })

  if (dv(cnpj) !== cnpj.substring(12, 14)) {
    throw new Error('Dígito verificador inválido')
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
