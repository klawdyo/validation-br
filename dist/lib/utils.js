"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sumToDV = sumToDV;
exports.invalidListGenerator = invalidListGenerator;
exports.sumElementsByMultipliers = sumElementsByMultipliers;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

/**
 * Calcula o DV verificador a partir das regras do MOD11:
 * O valor da soma é dividido por 11. O resultado é o resto da divisão. Caso o resto seja
 * menor que 2, ou seja, o valor da divisão seja 10 ou 11, o resultado é 0.
 *
 * @param {Integer} sum Soma
 */
function sumToDV(sum) {
  return sum % 11 < 2 ? 0 : 11 - sum % 11;
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


function invalidListGenerator(size) {
  return (0, _toConsumableArray2.default)(Array(10).keys()).map(function (f) {
    return String(f).repeat(size);
  });
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


function sumElementsByMultipliers(value, multiplier) {
  return (Array.isArray(multiplier) ? multiplier : multiplier.split('')).reduce(function (accu, curr, i) {
    return accu + curr * Number(value.charAt(i));
  }, 0);
}
//# sourceMappingURL=utils.js.map