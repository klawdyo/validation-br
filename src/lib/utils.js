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

/**
 * Limpa um número informado, retirando caracteres diferentes de números,
 * preenchendo com zeros à esquerda se for menor que o tamanho exato e
 * removendo uma parte do número se for maior que tamanho definido.
 *
 * 1) Retira caracteres não-numéricos
 * 2) Preenche com zeros à esquerda se 'value' for menor que 'length'
 * 3) Remove caracteres à direita se 'value' for maior que 'length'
 *
 * @example
 *  clearValue(12345-6, 6) // -> 123456
 *  clearValue(12345678, 3) // -> 123
 *  clearValue(12345, 10) // -> 0000001234
 *
 * @param {Number|String} value
 * @param {Number} length Tamanho exato. Se for vazio, só faz a retirada dos caracteres
 * @returns {String} Número com o tamanho exato
 */
export function clearValue(value, length = null) {
  const clearedValue = String(value).replace(/([^\d]+)/ig, '');

  if (!length || clearedValue.length === length) return clearedValue;

  if (clearedValue.length > length) return clearedValue.substring(0, length);
  return clearedValue.padStart(length, '0');
}

/**
 * Aplica uma máscara a um número passado.
 *
 * 1) Retira caracteres não-numéricos.
 * 2) Verifica o tamanho da máscara e o tamanho do número.
 *   2.1) A máscara é maior que o número? Preenche com zeros à esquerda.
 *   2.2) A máscara é menor que o número? Remove caracteres à direita.
 * 3) Aplica o formato da máscara ao número de entrada.
 * 4) Devolve o número com a máscara aplicada.
 *
 * @example
 *  applyMask(123456, '00000-0') // -> 12345-6
 *  applyMask(12345678, '0000-0') // -> 1234-5
 *  applyMask(12345, '00000000-0') // -> 00001234-5
 *
 */
export function applyMask(value, mask) {
  const maskLen = clearValue(mask).length;
  let cleared = clearValue(value, maskLen);

  for (let i = mask.length; i > 0; i -= 1) {
    const current = mask[i];
    if (current !== '0') cleared = [cleared.slice(0, i), current, cleared.slice(i)].join('');
  }

  return cleared;
}
