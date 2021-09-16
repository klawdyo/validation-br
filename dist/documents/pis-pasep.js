"use strict";

var _require = require('../../dist/lib/utils'),
    sumElementsByMultipliers = _require.sumElementsByMultipliers,
    sumToDV = _require.sumToDV; // const { sumElementsByMultipliers, sumToDV } = require('../lib/utils');

/**
 * isPIS()
 * Calcula se um código de PIS/PASEP/NIS/NIT no formato 268.27649.96-0 é válido. Não
 * valida o formato, portanto, 26827649960 é equivalente a 268.27649.96-0 para efeitos
 * desta validação.
 *
 * @doc
 * - O número de PIS deve possuir 11 caracteres
 *
 * - Os caracteres de 1 a 10 são a numeração documento
 *
 * - O caractere 11 é o dígito verificador.
 *
 * 1) Partes do número
 *  _______________________________________________
 * |  Número                                 | D V |
 * |  2   6   8 . 2   7   6   4   9 . 9   6  -  0  |
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
 *  - O somatório encontrado é dividido por 11 e o resultado é subtraído de 11
 *    234 / 11 tem resto 3. 11 - 3 = 8. DV1 é 8.
 *    Obs.: Caso o cálculo de DV1 retorne 0, o resultado será 5.
 *          Caso retorne 1, o resto será 0
 *
 *
 *
 *
 * Fonte: http://www.macoratti.net/alg_pis.htm
 *
 * @param {String} value Objeto postal no formato 268.27649.96-0
 * @returns {Boolean}
 */


var isPIS = function isPIS() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var pis = value.replace(/[^\d]+/g, '');
  if (!pis || pis.length !== 11) return false;
  var sum = sumElementsByMultipliers(pis.substr(0, 10), [3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  var dv = sumToDV(sum); // console.log({
  //   pis,
  //   sum,
  //   dvOriginal: pis.charAt(10),
  //   dvCalculado: dv,
  // });

  return dv === Number(pis.charAt(10));
}; // console.log(isPIS());
// console.log(isPIS('11111111111'));
// console.log(isPIS('26827649960'));
// console.log(isPIS('712.82677.38-0'));
// console.log(isPIS('237.95126.95-5'));


module.exports = isPIS;
//# sourceMappingURL=pis-pasep.js.map