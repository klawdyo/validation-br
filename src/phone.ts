/**
 * isPhone()
 * Calcula se um número de telefone brasileiro, fixo ou celular, é válido.
 *
 * @doc
 * - O número pode ser informado com ou sem DDD e com ou sem máscara.
 *
 * - Após a retirada dos caracteres não-numéricos, o número deve possuir entre 8 e
 *   11 dígitos.
 *
 * - Quando informado com DDD (10 ou 11 dígitos), os dois primeiros dígitos formam o
 *   DDD e não podem conter o algarismo 0.
 *
 * - O número local possui 8 dígitos para telefones fixos e 9 dígitos para celulares.
 *
 * - Telefone fixo: o primeiro dígito do número local deve estar entre 2 e 8.
 *
 * - Celular: o primeiro dígito do número local deve ser 9.
 *
 * 1) Partes do número
 *  ______ _____________________
 * | DDD  | Número              |
 * | 1 1    9  8  7  6  5  4  3  2  1 |
 * |______|_____________________|
 *
 *
 * @param {String|Number} value Número de telefone
 * @returns {Boolean}
 */

import ValidationBRError from './_exceptions/ValidationBRError';
import { checkRepeatedSequence, fakeNumber, applyMask } from './utils';

/**
 * fake()
 * Gera um número válido
 *
 * @param {Boolean} withMask Define se o número deve ser gerado com máscara
 * @returns {String}
 */
export const fake = (withMask = false): string => {
  const ddd = `${1 + Math.floor(Math.random() * 9)}${1 + Math.floor(Math.random() * 9)}`;
  const phone = `${ddd}9${fakeNumber(8, true)}`;

  if (withMask) return mask(phone);

  return phone;
};

/**
 * validateOrFail()
 * Valida se um número é válido e
 * retorna uma exceção se não estiver
 *
 * @param {String} value Número a ser validado
 * @returns {Boolean}
 */
export const validateOrFail = (value: string | number): boolean => {
  const phone = String(value).replace(/[^0-9]/g, '');

  if (!phone) throw ValidationBRError.EMPTY_VALUE;

  if (checkRepeatedSequence(phone)) {
    throw ValidationBRError.REPEATED_SEQUENCE;
  }

  if (phone.length < 8 || phone.length > 11) {
    throw ValidationBRError.INVALID_FORMAT;
  }

  if (phone.length > 9 && [0, 1].indexOf(phone.indexOf('0')) !== -1) {
    throw ValidationBRError.INVALID_FORMAT;
  }

  const localNumber = phone.length > 9 ? phone.substring(2) : phone;

  if (localNumber.length === 8) {
    if ([2, 3, 4, 5, 6, 7, 8].indexOf(Number(localNumber[0])) === -1) {
      throw ValidationBRError.INVALID_FORMAT;
    }

    return true;
  }

  if (localNumber[0] !== '9') {
    throw ValidationBRError.INVALID_FORMAT;
  }

  return true;
};

/**
 * validate()
 * Valida se um número é válido
 *
 * @param {String} value Número a ser validado
 * @returns {Boolean}
 */
export const validate = (value: string | number): boolean => {
  try {
    return validateOrFail(value);
  } catch (error) {
    return false;
  }
};

/**
 * normalize()
 * Retira a máscara do número, retornando apenas os dígitos
 *
 * @param {String} value Número de telefone
 * @returns {String} Número sem máscara
 */
export const normalize = (value: string | number): string => String(value).replace(/[^0-9]/g, '');

/**
 * mask()
 * Aplica a máscara correspondente ao tamanho do número
 *
 * @param {String} value Número de telefone
 * @returns {String} Valor com a máscara
 */
export const mask = (value: string | number): string => {
  const phone = normalize(value);

  const masks: { [key: number]: string } = {
    8: '0000-0000',
    9: '0 0000-0000',
    10: '(00) 0000-0000',
    11: '(00) 0 0000-0000',
  };

  const pattern = masks[phone.length];

  if (!pattern) return phone;

  return applyMask(phone, pattern);
};

export default validate;
