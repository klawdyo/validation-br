/**
  * judicialProcess
  * Valida, mascara e cria números de processos judiciais
  *
  * @link
  * https://juslaboris.tst.jus.br/bitstream/handle/20.500.12178/30318/2008_res0065_cnj_rep01.pdf?sequence=2
  * http://ghiorzi.org/DVnew.htm#f
  *
  * @doc
  * Os  números de processos judiciais são usados a partir de 2010 para unificar a
  * numeração de processos no Brasil e são usados em todos os tribunais.
  *
  * O número do processo, sem os caracteres especiais, devem possuir até 20 números
  * e deve seguir o padrão abaixo:
  *
  * 1) Partes do número
  *  0002080-25.2012.5.15.0049
  *  NNNNNNN-DD.AAAA.J.TR.OOOO
  * |______|__|____|_|__|____|
  *    |    |   |  | |   |----> Unidade de origem do processo com 4 caracteres
  *    |    |   |  | |--------> TR=Tribunal do segmento do poder judiciário com 2 caracteres
  *    |    |   |  |----------> J=Órgão do poder Judiciário com 1 caractere
  *    |    |   |-------------> Ano do ajuizamento do processo com 4 caracteres
  *    |    |-----------------> Dígito verificador com 2 caracteres
  *    |----------------------> Número sequencial do Processo, por unidade de
  *                             origem, reiniciado anualmente com 7 caracteres
  *
  * Órgãos do Poder Judiciário
  * 1 - Supremo Tribunal Federal
  * 2 - Conselho Nacional de Justiça
  * 3 - Superior Tribunal de Justiça
  * 4 - Justiça Federal
  * 5 - Justiça do Trabalho
  * 6 - Justiça Eleitoral
  * 7 - Justiça Militar da União
  * 8 - Justiça dos Estados e do Distrito Federal e Territórios
  * 9 - Justiça Militar Estadual
  *
  *
  * 2) Dígito Verificador
  *
  * O algoritmo usado para o cálculo do DV chama-se Módulo 97 de Base 10 (ISO 7064).
  *
  * Nota: O número do processo possui 20 caracteres e ultrapassa o tamanho máximo
  * do inteiro em javascript, impedindo que façamos o cálculo diretamente, desta
  * forma, será nacessária uma fatoração para que o resultado seja o correto.
  *
  * 2.1) Cálculo do DV
  * - Caso o DV seja conhecido, ele precisa ser removido do número e colocado
  * como "00" ao final. Caso não esteja incluso no número, adicione '00' ao final.
  *
  * Ex.: O processo "00020802520125150049", cujo dv é "25", será calculado como
  * "000208020125150049" e receberá "00" ao final. O número usado para o cálculo
  * do DV será "00020802012515004900"
  *
  * 2.2) Etapas de Cálculo
  *
  * 00020802012515004900
  *                   ↓↓
  *                   DV ao final como "00"
  *
  * - Aplicamos o MOD 97 aos caracteres de 0 a 7 para calcular a primeira parte
  * part1 = 0002080 % 97 = 43
  *
  * - Concatenamos part1 ao ano, órgão do poder judiciário e tribunal e aplicamos o MOD 97
  * para obtermos o valor da part2
  * part2 = ( part1 +''+ 2012 +''+ 5 +''+ 15 ) % 97 = 26
  *
  * - Concatemos part2 ao código do órgão de origem e ao "00" do final e aplicamos
  * o MOD 97 ao resultado
  * part3 = ( part2 + '0049' + '00') % 97 = 73
  *
  * - Subtraímos o resultado de 98
  * dv = 98 - 73 = 25
  *
  * O Dígito verificador é 25 e deve ser aplicado após o 7º caractere do número do processo
  *
  * Fonte: https://juslaboris.tst.jus.br/bitstream/handle/20.500.12178/30318/2008_res0065_cnj_rep01.pdf?sequence=2
  */

const {
  clearValue, fakeNumber, insertAtPosition, applyMask, removeFromPosition,
} = require('../lib/utils');

/**
 *
 *
 */
const dv = (value) => {
  if (!value) throw new Error('Número do processo é obrigatório');
  if (typeof value !== 'string') throw new Error('Número do processo precisa ser string');

  const judicialProcess = clearValue(value, 18);

  const number = judicialProcess.substring(0, 7);
  const yearAndCourt = judicialProcess.substring(7, 14);
  const origin = judicialProcess.substring(14, 18);

  return String(98 - ((`${(`${number % 97}${yearAndCourt}`) % 97}${origin}00`) % 97)).padStart(2, '0');
};

/**
 * Aplica uma máscara ao número informado
 *
 * @param {String} value Número de Processo
 * @returns {String} Valor com a máscara
 */
const mask = (value) => applyMask(value, '0000000-00.0000.0.00.0000');

/**
 *
 *
 */
const fake = (withMask = false) => {
  // const judicialProcess = fakeNumber(14, true);
  const num = fakeNumber(7, true);
  const year = (new Date()).getFullYear() - fakeNumber(1);
  const courte1 = fakeNumber(1, true);
  const courte = (courte1 === '0' || courte1 >= '10' ? '1' : courte1) + fakeNumber(2, true);
  const origin = fakeNumber(4, true);

  const judicialProcess = `${num}${year}${courte}${origin}`;
  const digits = dv(judicialProcess);

  const finalNumber = insertAtPosition(judicialProcess, digits, 7);

  if (withMask) return mask(finalNumber);
  return finalNumber;
};

/**
 * validate()
 * Valida se um número de processo está correto
 *
 */
const validateOrFail = (value) => {
  const judicialProcess = clearValue(value, 20);
  const processWithoutDV = removeFromPosition(judicialProcess, 7, 9);

  if (processWithoutDV.substring(11, 12) === '0') {
    throw new Error('Código do Órgão Judiciário não pode ser "0"');
  }

  if (dv(processWithoutDV) !== judicialProcess.substring(7, 9)) {
    throw new Error('Dígito verificador inválido');
  }

  return true;
};

/**
 * validate()
 * Valida se um número de processo está correto
 *
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
