"use strict";

var _require = require('../lib/utils'),
    invalidListGenerator = _require.invalidListGenerator,
    sumElementsByMultipliers = _require.sumElementsByMultipliers,
    sumToDV = _require.sumToDV;
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


var isCNPJ = function isCNPJ() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var cnpj = value.replace(/[^\d]+/g, '');
  var blackList = invalidListGenerator(14);
  if (!cnpj || cnpj.length !== 14 || blackList.includes(cnpj)) return false;
  var sum1 = sumElementsByMultipliers(cnpj.substr(0, 12), '543298765432');
  var sum2 = sumElementsByMultipliers(cnpj.substr(0, 13), '6543298765432');
  var dv1 = sumToDV(sum1);
  var dv2 = sumToDV(sum2);
  if (dv1 !== Number(cnpj.charAt(12))) return false;
  if (dv2 !== Number(cnpj.charAt(13))) return false;
  return true;
};

module.exports = isCNPJ;
//# sourceMappingURL=cnpj.js.map