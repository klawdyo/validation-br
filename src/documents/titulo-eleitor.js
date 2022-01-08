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

const {
  sumElementsByMultipliers,
  clearValue, fakeNumber, applyMask,
  invalidListGenerator,
} = require('../lib/utils');

/**
 * dv()
 * Calcula o dígito verificador de um CPF
 *
 * @param {Number|String} value
 * @returns {String}
 */
const dv = (value = '') => {
  if (!value) throw new Error('CPF não informado');

  const titulo = clearValue(value, 10);

  const invalidList = invalidListGenerator(10);
  if (invalidList.includes(titulo)) {
    throw new Error('Título não pode ser uma sequência de números iguais');
  }

  const sum1 = sumElementsByMultipliers(titulo.substring(0, 8), [2, 3, 4, 5, 6, 7, 8, 9]);
  const dv1 = (sum1 % 11) >= 10 ? 0 : sum1 % 11;

  const sum2 = sumElementsByMultipliers(titulo.substring(8, 10) + dv1, [7, 8, 9]);
  const dv2 = (sum2 % 11) >= 10 ? 0 : sum2 % 11;

  return `${dv1}${dv2}`;
};

/**
 * Aplica uma máscara ao número informado
 *
 * @param {String} value Número de Processo
 * @returns {String} Valor com a máscara
 */
const mask = (value) => applyMask(value, '0000.0000.0000');

/**
 * fake()
 * Gera um número válido
 *
 * @returns {String}
 */
const fake = (withMask = false) => {
  const num = fakeNumber(8, true);

  const uf = String(parseInt(Math.random() * 27 + 1, 10)).padStart(2, '0');

  const titulo = `${num}${uf}${dv(num + uf)}`;

  if (withMask) return mask(titulo);
  return titulo;
};

/**
 * validateOrFail()
 * Valida se um número de processo está correto e
 * retorna uma exceção se não estiver
 *
 * @returns {Boolean}
 */
const validateOrFail = (value) => {
  const titulo = clearValue(value, 12);

  if (dv(titulo) !== titulo.substring(10, 12)) {
    throw new Error('Dígito verificador inválido');
  }

  return true;
};

/**
 * validate()
 * Valida se um número de processo está correto
 *
 * @returns {Boolean}
 */
const validate = (value) => {
  try {
    return validateOrFail(value);
  } catch (error) {
    return false;
  }
};

module.exports = {
  dv,
  fake,
  mask,
  validate,
  validateOrFail,
};
