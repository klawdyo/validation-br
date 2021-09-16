"use strict";

var _require = require('../lib/utils'),
    sumElementsByMultipliers = _require.sumElementsByMultipliers;
/**
 * isTitulo()
 * Calcula se um título eleitoral é válido
 *
 * @doc
 * Título de eleitor deve possuir 12 dígitos.
 *
 * - Os caracteres 1 a 8 são números sequenciais.
 *
 * - Os caracteres 9 e 10 representam os estados da federação onde o título
 *   foi emitido (01 = SP, 02 = MG, 03 = RJ, 04 = RS, 05 = BA, 06 = PR, 07 = CE, 08 = PE,
 *   09 = SC, 10 = GO,  11 = MA12 = PB, 13 = PA, 14 = ES, 15 = PI, 16 = RN, 17 = AL,
 *   18 = MT, 19 = MS, 20 = DF, 21 = SE, 22 = AM, 23 = RO, 24 = AC, 25 = AP, 26 = RR,
 *   27 = TO, 28 = Exterior(ZZ).
 *
 * - Os caracteres 11 e 12 são dígitos verificadores.
 *
 * 1) Partes do número
 * ------------------------------------------------
 * |       Número Sequencial      |  UF   |   DV  |
 *  1   0   2   3   8   5   0   1   0   6   7   1
 *
 * 2) Cálculo do primeiro DV.
 *
 *  - Soma-se o produto das algarismos 1 a 8 pelos números 2, 3, 4, 5, 6, 7, 8 e 9.
 *
 *   1   0   2   3   8   5   0   1
 *   x   x   x   x   x   x   x   x
 *   2   3   4   5   6   7   8   9
 * = 2 + 0 + 8 +15 +48 +35 + 0 + 9  = 117
 *
 *  - O somatório encontrado é dividido por 11. O DV1 é o resto da divisão. Se o
 *    resto for 10, o DV1 é 0.
 *
 * 2.1) 117 / 11 tem resto igual a 7.
 *
 * 3) Cálculo do segundo DV
 *
 * - Soma-se o produto dos algarismos 9 a 11 (relativos aos 2 dígitos da UF e o novo
 *   DV1 que acabou de ser calculado) e os multiplicam pelos números 7, 8 e 9. Se o
 *   resto for 10, DV2 será 0.
 *   0   6   7
 *   x   x   x
 *   7   8   9
 * = 0 +48 +63 = 111
 *
 * 3.1) 111 / 11 tem resto igual a 1.
 *
 * Fonte: http://clubes.obmep.org.br/blog/a-matematica-nos-documentos-titulo-de-eleitor/
 *
 * @param {String} value Título eleitoral
 * @returns {Boolean}
 */


var isTitulo = function isTitulo() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var titulo = value.replace(/[^\d]+/g, '');
  if (!titulo || titulo.length !== 12) return false;
  var sum1 = sumElementsByMultipliers(titulo.substr(0, 8), [2, 3, 4, 5, 6, 7, 8, 9]);
  var sum2 = sumElementsByMultipliers(titulo.substr(8, 3), [7, 8, 9]);
  var dv1 = sum1 % 11 >= 10 ? 0 : sum1 % 11;
  var dv2 = sum2 % 11 >= 10 ? 0 : sum2 % 11;
  return "".concat(dv1).concat(dv2) === titulo.substr(10, 2);
};

module.exports = isTitulo;
//# sourceMappingURL=titulo-eleitor.js.map