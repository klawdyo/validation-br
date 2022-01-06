/**
 * Calcula o DV verificador a partir das regras do MOD11:
 * O valor da soma é dividido por 11. O resultado é o resto da divisão. Caso o resto seja
 * menor que 2, ou seja, o valor da divisão seja 10 ou 11, o resultado é 0.
 *
 * @param {Integer} sum Soma
 */
export function sumToDV(sum) {
  return sum % 11 < 2 ? 0 : 11 - (sum % 11);
}

/**
 * Cria uma lista de valores repetidos no tamanho do documento para eliminar
 * valores que já conhecemos como inválidos
 *
 * @example
 * invalidListGenerator(10, 11)
 * //-> [00000000000, 11111111111, ....., 99999999999]
 *
 * @param {Integer} length Número de itens do array
 * @param {Integer} size Tamanho da string gerada
 * @returns {Array} Lista de valores
 */
export function invalidListGenerator(size) {
  return [...Array(10).keys()].map((f) => String(f).repeat(size));
}

/**
 * Soma os elementos de uma string com os elementos de outra, ou de um array
 * @example
 *   sumElementsByMultipliers('123', '987')      //-> 46
 *   sumElementsByMultipliers('123', [9, 8, 7])  //-> 46
 *
 * @param {String} value
 * @param {String|Array} multiplier
 * @returns {Integer} Somatório
 */
export function sumElementsByMultipliers(value, multiplier) {
  return (Array.isArray(multiplier) ? multiplier : multiplier.split(''))
    .reduce((accu, curr, i) => accu + (curr * Number(value.charAt(i))), 0);
}

/**
 * Cria um número aleatório com um tamanho especificado
 *
 * @example
 *  fakeNumber(4)  // -> 4201
 *  fakeNumber(5)  // -> 02201
 *
 * @param {Integer} length Número de caracteres do número fake
 * @returns {String}
 */
export function fakeNumber(length) {
  const value = parseInt(Math.random() * (10 ** length), 10);

  return value.toString().padStart(length, '0');
}
