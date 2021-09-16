"use strict";

var _require = require('../../dist/lib/utils'),
    sumElementsByMultipliers = _require.sumElementsByMultipliers;
/**
 * isPostalCode()
 * Calcula se um código de rastreamento postal no formato JT194690698BR é válido.
 *
 * @doc
 * - O número de registro postal deve possuir 13 caracters no formato JT194690698BR.
 *
 * - Os caracteres 1 e 2 informam o tipo do objeto. Ex.: SX é Sedex, RC é carta registrada etc.
 *
 * - Os caracteres de 3 a 10 são a numeração sequencial do tipo do objeto.
 *
 * - O caractere 11 é o dígito verificador.
 *
 * - Os caracteres 12 e 13 representa o código do País de onde a postagem partiu.
 *
 * 1) Partes do número
 *  ______ ___________________________ ______ _______
 * | Tipo | Número                    |  DV  |  País |
 * | J T    1  9  4  6  9  0  6  9       8      B R  |
 * |______|___________________________|______|_______|
 *
 * 2) Cálculo do DV.
 *
 *  - Soma-se o produto das algarismos 3 a 10 pelos números 8, 6, 4, 2, 3, 5, 9, 7
 *
 *    1   9   4   6   9   0   6   9
 *    x   x   x   x   x   x   x   x
 *    8   6   4   2   3   5   9   7
 * =  8 +54 +16 +12 +18  +0 +54 +63 = 234
 *
 *  - O somatório encontrado é dividido por 11 e o resultado é subtraído de 11
 *    234 / 11 tem resto 3. 11 - 3 = 8. DV1 é 8.
 *    Obs.: Caso o cálculo de DV1 retorne 0, o resultado será 5.
 *          Caso retorne 1, o resto será 0
 *
 *
 *
 *
 * Fonte: http://clubes.obmep.org.br/blog/a-matematica-nos-documentos-cpf/
 *
 * @param {String} value Título eleitoral
 * @returns {Boolean}
 */


var isPostalCode = function isPostalCode(value) {
  var match = value.match(/^[a-z]{2}([\d]{9})[a-z]{2}$/ig, '');
  if (!match) return false;
  var postalCode = match[0].replace(/[^\d]+/g, '');
  var sum = sumElementsByMultipliers(postalCode.substr(0, 8), [8, 6, 4, 2, 3, 5, 9, 7]);
  var rest = sum % 11;
  var specificities = {
    0: {
      dv: 5
    },
    1: {
      dv: 0
    }
  };
  var dv = specificities[rest] ? specificities[rest].dv : 11 - rest;
  if (dv !== Number(postalCode.charAt(8))) return false;
  return true;
};

console.log(isPostalCode('JT194690698BR'));
module.exports = isPostalCode;
//# sourceMappingURL=postal-code.js.map