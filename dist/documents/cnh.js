"use strict";

var _require = require('../lib/utils'),
    sumElementsByMultipliers = _require.sumElementsByMultipliers,
    sumToDV = _require.sumToDV,
    invalidListGenerator = _require.invalidListGenerator;
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


var isCNH = function isCNH(value) {
  var cnh = value.replace(/[^\d]+/g, '');
  var invalidList = invalidListGenerator(11);
  if (!cnh || invalidList.includes(cnh) || cnh.length !== 11) return false;
  var sum1 = sumElementsByMultipliers(cnh.substr(0, 9), [2, 3, 4, 5, 6, 7, 8, 9, 10]);
  var sum2 = sumElementsByMultipliers(cnh.substr(0, 10), [3, 4, 5, 6, 7, 8, 9, 10, 11, 2]);
  var dv1 = sumToDV(sum1);
  var dv2 = sumToDV(sum2); // console.log({
  //   sum1,
  //   res1: sum1 % 11,
  //   sum2,
  //   res2: sum2 % 11,
  //   dv1Original: cnh.charAt(9),
  //   dv1,
  //   dv2Original: cnh.charAt(10),
  //   dv2,
  // });

  return "".concat(dv1).concat(dv2) === cnh.substr(9, 2);
}; // console.log(isCNH('58316794534'));


module.exports = isCNH;
//# sourceMappingURL=cnh.js.map