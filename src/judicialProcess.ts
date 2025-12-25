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

import ValidationBRError from './_exceptions/ValidationBRError';
import { clearValue, fakeNumber, applyMask, insertAtPosition, removeFromPosition } from './utils';

/**
 *
 *
 */
export const dv = (value: string): string => {
  const judicialProcess = clearValue(value, 18, { trimAtRight: true, rejectEmpty: true });

  const num = judicialProcess.substring(0, 7);
  const yearAndCourt = judicialProcess.substring(7, 14);
  const origin = judicialProcess.substring(14, 18);

  return String(
    98 - (Number(`${Number(`${Number(num) % 97}${yearAndCourt}`) % 97}${origin}00`) % 97),
  ).padStart(2, '0');
};

/**
 * Aplica uma máscara ao número informado
 *
 * @param {String} value Número de Processo
 * @returns {String} Valor com a máscara
 */
export const mask = (value: string | number): string =>
  applyMask(value, '0000000-00.0000.0.00.0000');

/**
 *
 *
 */
export const fake = (withMask: boolean = false): string => {
  const num = fakeNumber(7, true);
  const year = new Date().getFullYear() - +fakeNumber(1);

  let courte1 = fakeNumber(1, true); // Não pode ser '0'
  courte1 = courte1 === '0' ? '1' : courte1;

  const courte2 = _getSubCourt();

  const courte = `${courte1}${courte2}`;

  const origin = fakeNumber(4, true);

  const judicialProcess = `${num}${year}${courte}${origin}`;
  const digits = dv(judicialProcess);

  const finalNumber = insertAtPosition(judicialProcess, digits, 7);

  if (withMask) return mask(finalNumber);
  return finalNumber;
};

/**
 * validateOrFail()
 * Valida se um número é válido e
 * retorna uma exceção se não estiver
 *
 * @param {String} value Número a ser validado
 * @returns {Boolean}
 */
export const validateOrFail = (value: string): boolean => {
  const judicialProcess = normalize(value);
  const processWithoutDV = removeFromPosition(judicialProcess, 7, 9);

  if (processWithoutDV.substring(11, 12) === '0') {
    throw new Error('Código do Órgão Judiciário não pode ser "0"');
  }

  if (dv(processWithoutDV) !== judicialProcess.substring(7, 9)) {
    throw ValidationBRError.INVALID_DV;
  }

  return true;
};

/**
 * validate()
 * Valida se um número é válido
 *
 * @param {String} value Número a ser validado
 * @returns {Boolean}
 */
export const validate = (value: string): boolean => {
  try {
    return validateOrFail(value);
  } catch (error) {
    return false;
  }
};

// ////////////////////////////////////////////
//
// Funções auxiliares
//
// ////////////////////////////////////////////

/**
 * Gera um número fake da sub corte de acordo com as regras:
 * - Precisa ser uma string numérica de 2 dígitos.
 * - Não pode ser '0'. CAso seja zero, mude para '01'.
 *
 * A função aceita um parâmetro para viabilizar os testes. Caso
 * não seja definido, será gerado aleatoriamente.
 *
 * @param
 *
 */
export function _getSubCourt(courte: string | undefined = undefined): string {
  courte = courte ?? fakeNumber(2, true).toString();
  return +courte === 0 ? '01' : courte;
}

/**
 * Retorna String sem máscara
 * 
 * @param {String|Number} value Valor a remover máscara
 * @returns {String}
 */
export const normalize = (value: string | number): string => {
  return clearValue(value, 20, {
    fillZerosAtLeft: true,
    rejectEmpty: true,
    rejectHigherLength: true,
  });
};

export default validate;
