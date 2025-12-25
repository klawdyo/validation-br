/**
 * isCPF()
 * Calcula se um CPF é válido
 *
 * @doc
 * CPF deve possuir 11 dígitos.
 *
 * - Os caracteres 1 a 8 são números sequenciais definidos pela Receita Federal
 *
 * - O caractere 9 refere-se à região fiscal emissora do documento
 *    1 – DF, GO, MS, MT e TO
 *    2 – AC, AM, AP, PA, RO e RR
 *    3 – CE, MA e PI
 *    4 – AL, PB, PE, RN
 *    5 – BA e SE
 *    6 – MG
 *    7 – ES e RJ
 *    8 – SP
 *    9 – PR e SC
 *    0 – RS
 *
 * - Os caracteres 10 e 11 são dígitos verificadores.
 *
 * 1) Partes do número
 * ------------------------------------------------
 * | Número                       | R |  DV  |
 *  2   8   0 . 0   1   2 . 3   8   9 - 3   8
 *
 * 2) Cálculo do primeiro DV.
 *
 *  - Soma-se o produto das algarismos 1 a 9 pelos números 10, 9, 8, 7, 6, 5, 4, 3, 2
 *
 *    2   8   0   0   1   2   3   8   9
 *    x   x   x   x   x   x   x   x   x
 *   10   9   8   7   6   5   4   3   2
 * = 20 +72  +0  +0  +6 +10 +12 +24 +18 = 162
 *
 *  - O somatório encontrado é dividido por 11 e o resultado é subtraído de 11
 *    162 / 11 tem resto 8. 11 - 8 = 3. DV1 é 3.
 *    Obs.: Caso o cálculo de DV1 retorne 10, o resultado será 0.
 *
 * 3) Cálculo do segundo DV.
 *
 *  - Soma-se o produto das algarismos 1 a 10 pelos números 11, 10, 9, 8, 7, 6, 5, 4, 3, 2
 *
 *    2   8   0   0   1   2   3   8   9   3
 *    x   x   x   x   x   x   x   x   x   x
 *   11  10   9   8   7   6   5   4   3   2
 * = 22 +80  +0  +0  +7 +12 +15 +32 +27 = 201
 *
 *  - O somatório encontrado é dividido por 11 e o resultado é subtraído de 11
 *    201 / 11 tem resto 3. 11 - 3 = 8. DV2 é 8.
 *    Obs.: Caso o cálculo de DV2 retorne 10, o resultado será 0.
 *
 * Fonte: http://clubes.obmep.org.br/blog/a-matematica-nos-documentos-cpf/
 *
 * @param {String} value Título eleitoral
 * @returns {Boolean}
 */

import ValidationBRError from './_exceptions/ValidationBRError'
import { sumElementsByMultipliers, sumToDV, clearValue, fakeNumber, applyMask } from './utils'

/**
 * dv()
 * Calcula o dígito verificador
 *
 * @param {Number|String} value
 * @returns {String}
 */
export const dv = (value: string | number): string => {
  const cpf = clearValue(value, 9, {
    trimAtRight: true,
    rejectEmpty: true,
  })

  const sum1 = sumElementsByMultipliers(cpf, [10, 9, 8, 7, 6, 5, 4, 3, 2])
  const dv1 = sumToDV(sum1)

  const sum2 = sumElementsByMultipliers(cpf + dv1, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2])
  const dv2 = sumToDV(sum2)

  return `${dv1}${dv2}`
}

/**
 * Aplica uma máscara ao número informado
 *
 * @param {String} value Número de Processo
 * @returns {String} Valor com a máscara
 */
export const mask = (value: string | number): string => applyMask(value, '000.000.000-00')

/**
 * fake()
 * Gera um número válido
 *
 * @returns {String}
 */
export const fake = (withMask: boolean = false): string => {
  const num = fakeNumber(9, true)

  const cpf = `${num}${dv(num)}`

  if (withMask) return mask(cpf)
  return cpf
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
  const cpf = normalize(value);

  if (dv(cpf) !== cpf.substring(9, 11)) {
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

/**
 * Retorna String sem máscara
 * 
 * @param {String|Number} value Valor a remover máscara
 * @returns {String}
 */
export const normalize = (value: string | number): string => {
  return clearValue(value, 11, {
    fillZerosAtLeft: true,
    rejectEmpty: true,
    rejectHigherLength: true,
    rejectEqualSequence: true,
  })
}

export default validate
