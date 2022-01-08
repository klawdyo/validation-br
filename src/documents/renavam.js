const { sumElementsByMultipliers, fakeNumber, applyMask } = require('../lib/utils');

/**
 * Calcula o Dígito Verificador de um RENAVAM informado
 *
 * @returns String Número fake de um renavam válido
 */
export const dv = (value = '') => {
  // Verifica se o valor foi informado
  if (!value) throw new Error('Renavam não informado');
  // console.log({ value });
  const renavam = value
    .replace(/[^\d]+/g, '') // Remove caracteres indesejado
    .substring(0, 10) // Pega somente os 10 primeiros caracteres
    .padStart(10, '0'); // Completa com zeros à esquerda

  // console.log(renavam);

  const sum1 = sumElementsByMultipliers(renavam, [3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) * 10;

  const dv1 = (sum1 % 11) >= 10 ? 0 : sum1 % 11;
  // console.log({ value, dv1 });
  return dv1;
};

/**
 * Cria um número fake
 *
 * @returns String Número fake de um renavam válido
 */
export const validate = (value = '') => {
  try {
    return dv(value) === +value.substring(10, 11);
  } catch (error) {
    return false;
  }
};

/**
 * Cria um número fake
 *
 * @returns String Número fake de um renavam válido
 */
export const fake = () => {
  const value = fakeNumber(10);

  return `${value}${dv(value)}`;
};

/**
 * Cria um número fake
 *
 * @returns String Número fake de um renavam válido
 */
export const mask = (value = '') => applyMask(value, '0000000000-0');
