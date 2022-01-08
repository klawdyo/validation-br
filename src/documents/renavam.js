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

const {
  sumElementsByMultipliers, fakeNumber, applyMask, clearValue,
} = require('../lib/utils');

/**
 * Calcula o Dígito Verificador de um RENAVAM informado
 *
 * @returns String Número fake de um renavam válido
 */
export const dv = (value = '') => {
  if (!value) throw new Error('Renavam não informado');

  const renavam = clearValue(value, 10); // só 10 para remover o DV

  const sum1 = sumElementsByMultipliers(renavam, [3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) * 10;
  const dv1 = (sum1 % 11) >= 10 ? 0 : sum1 % 11;
  return dv1;
};

/**
 * Valida um número de renavam e retorna uma exceção caso seja inválido
 *
 * @returns String Número fake de um renavam válido
 */
export const validateOrFail = (value = '') => {
  const renavam = clearValue(value, 11);

  if (dv(renavam) !== +(renavam.substring(10, 11))) {
    throw new Error('Dígito verificador inválido');
  }

  return true;
};

/**
 * Valida um número de renavam
 *
 * @returns String Valor a ser validado
 */
export const validate = (value = '') => {
  try {
    return validateOrFail(value);
  } catch (error) {
    return false;
  }
};

/**
 * Aplica uma máscara a uma string
 *
 * @returns String string com a máscara aplicada
 */
export const mask = (value = '') => applyMask(value, '0000000000-0');

/**
 * Cria um número fake
 *
 * @returns String Número fake porém válido
 */
export const fake = (withMask = false) => {
  const value = fakeNumber(10, true);

  const renavam = `${value}${dv(value)}`;

  if (withMask) return mask(renavam);

  return renavam;
};
