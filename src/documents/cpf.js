const { invalidListGenerator, sumElementsByMultipliers, sumToDV } = require('../lib/utils');

/**
 * isCPF()
 * Calcula se um CPF é válido
 *
 * @doc
 * CPF deve possuir 11 dígitos.
 *
 * - Os caracteres 1 a 8 são números sequenciais definidos pela Receita Federal
 *
 * - O caractere 9 refere-se à região fiscal emissora do documento
 *    1 – DF, GO, MS, MT e TO
 *    2 – AC, AM, AP, PA, RO e RR
 *    3 – CE, MA e PI
 *    4 – AL, PB, PE, RN
 *    5 – BA e SE
 *    6 – MG
 *    7 – ES e RJ
 *    8 – SP
 *    9 – PR e SC
 *    0 – RS
 *
 * - Os caracteres 10 e 11 são dígitos verificadores.
 *
 * 1) Partes do número
 * ------------------------------------------------
 * | Número                       | R |  DV  |
 *  2   8   0 . 0   1   2 . 3   8   9 - 3   8
 *
 * 2) Cálculo do primeiro DV.
 *
 *  - Soma-se o produto das algarismos 1 a 9 pelos números 10, 9, 8, 7, 6, 5, 4, 3, 2
 *
 *    2   8   0   0   1   2   3   8   9
 *    x   x   x   x   x   x   x   x   x
 *   10   9   8   7   6   5   4   3   2
 * = 20 +72  +0  +0  +6 +10 +12 +24 +18 = 162
 *
 *  - O somatório encontrado é dividido por 11 e o resultado é subtraído de 11
 *    162 / 11 tem resto 8. 11 - 8 = 3. DV1 é 3.
 *    Obs.: Caso o cálculo de DV1 retorne 10, o resultado será 0.
 *
 * 3) Cálculo do segundo DV.
 *
 *  - Soma-se o produto das algarismos 1 a 10 pelos números 11, 10, 9, 8, 7, 6, 5, 4, 3, 2
 *
 *    2   8   0   0   1   2   3   8   9   3
 *    x   x   x   x   x   x   x   x   x   x
 *   11  10   9   8   7   6   5   4   3   2
 * = 22 +80  +0  +0  +7 +12 +15 +32 +27 = 201
 *
 *  - O somatório encontrado é dividido por 11 e o resultado é subtraído de 11
 *    201 / 11 tem resto 3. 11 - 3 = 8. DV2 é 8.
 *    Obs.: Caso o cálculo de DV2 retorne 10, o resultado será 0.
 *
 * Fonte: http://clubes.obmep.org.br/blog/a-matematica-nos-documentos-cpf/
 *
 * @param {String} value Título eleitoral
 * @returns {Boolean}
 */
const isCPF = (value = '') => {
  const cpf = value.replace(/[^\d]+/g, '');

  const blackList = invalidListGenerator(11);
  if (!cpf || cpf.length !== 11 || blackList.includes(cpf)) return false;

  const sum1 = sumElementsByMultipliers(cpf.substr(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const sum2 = sumElementsByMultipliers(cpf.substr(0, 10), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);

  const dv1 = sumToDV(sum1);
  const dv2 = sumToDV(sum2);

  if (dv1 !== Number(cpf.charAt(9))) return false;
  if (dv2 !== Number(cpf.charAt(10))) return false;

  return true;
};

module.exports = isCPF;
