import { EmptyValueException, TooLongException, RepeatedSequenceException, TooShortException } from '../_exceptions/ValidationBRError'

/**
 * Calcula o DV verificador a partir das regras do MOD11:
 * O valor da soma é dividido por 11. O resultado é o resto da divisão. Caso o resto seja
 * menor que 2, ou seja, o valor da divisão seja 10 ou 11, o resultado é 0.
 *
 * @param {Integer} sum Soma
 * @returns {Integer}
 */
export function sumToDV(sum: number): number {
  return sum % 11 < 2 ? 0 : 11 - (sum % 11)
}

/**
 * Checa se o número repassado possui todos os digitos iguais
 * 
 * @example
 * checkRepeatedSequence(12345678) 
 * // -> false
 * checkRepeatedSequence(11111111) 
 * // -> true
 * 
 */
export function checkRepeatedSequence(value: string) {
  return [...value].every(digit => digit === value[0])
}

/**
 * Multiplica os elementos de uma string com os elementos de outra, ou de um array
 * e soma o resultado ao final
 *
 * @example
 *   sumElementsByMultipliers('123', '987')      //-> 46
 *   sumElementsByMultipliers('123', [9, 8, 7])  //-> 46
 *
 * @param {String} value
 * @param {String|Array} multiplier
 * @returns {Integer} Somatório
 */
export function sumElementsByMultipliers(value: string, multiplier: number[]): number {
  return multiplier.reduce(
    (accu: number, curr: any, i: number) => accu + curr * Number(value[i]),
    0,
  )
}

/**
 * Limpa um número informado, retirando caracteres diferentes de números,
 * preenchendo com zeros à esquerda se for menor que o tamanho exato e
 * removendo uma parte do número se for maior que tamanho definido.
 *
 * 1) Retira caracteres não-numéricos
 * 2) Preenche com zeros à esquerda se 'value' for menor que 'length'
 * 3) Remove caracteres à direita se 'value' for maior que 'length'
 *
 * @example
 *  clearValue(12345-6, 6) // -> 123456
 *  clearValue(12345678, 3) // -> 123
 *  clearValue(12345, 10) // -> 0000001234
 *
 * @param {Number|String} value
 * @param {Number} length Tamanho exato. Se for null, só retira os caracteres não-numéricos
 * @returns {String} Número com o tamanho exato
 */
export function clearValue(
  value: string | number,
  length: number | null = null,
  options?: ClearValueOptions,
): string {
  let clearedValue = String(value).replace(/([/.\s-])+/gi, '')

  if (options) {
    const shouldRejectEmpty = options.rejectEmpty === true && clearedValue.length === 0;
    if (shouldRejectEmpty) {
      throw new EmptyValueException()
    }

    const shouldrejectIfLonger = options.rejectIfLonger === true && length && clearedValue.length > length;
    if (shouldrejectIfLonger) {
      throw new TooLongException()
    }

    const shouldrejectIfShorter = options.rejectIfShorter === true && length && clearedValue.length < length;
    if (shouldrejectIfShorter) {
      throw new TooShortException()
    }

    const shouldRejectEqualSequence = options.rejectEqualSequence === true && length
    if (shouldRejectEqualSequence) {
      if (checkRepeatedSequence(clearedValue)) throw new RepeatedSequenceException()
    }

    if (length && options.fillZerosAtLeft) clearedValue = clearedValue.padStart(length, '0')
    if (length && options.trimAtRight) clearedValue = clearedValue.substring(0, length)
  }

  return clearedValue
}

/**
 * insertAtPosition()
 * Insere um conjunto de caracteres em um local específico de uma string
 *
 * @example
 * insertAtPosition('AAABBB', 'C', 3) // -> AAACBBB
 * insertAtPosition('000011122223445555', 99, 7) // -> 00001119922223445555
 *
 * @param {String|Number} value Valor original
 * @param {String|Number} insertValue Valor que será inserido
 * @param {String|Number} position Posição que receberá o novo valor
 * @returns {String}
 *
 */
export function insertAtPosition(value: string, insertValue: string, position: number): string {
  return `${value.substring(0, position)}${insertValue}${value.substring(position)}`
}

/**
 * removeFromPosition()
 * Retira um conjunto de caracteres de um local específico de uma string
 *
 * @example
 * removeFromPosition('00001119922223445555', 7,9) // -> 000011122223445555
 * removeFromPosition('AAACBBB', 3,4) // -> AAABBB
 *
 * @param {String|Number} value Valor original
 * @param {String|Number} startPosition
 * @param {String|Number} endPosition
 * @returns {String}
 *
 */
export function removeFromPosition(
  value: string,
  startPosition: number,
  endPosition: number,
): string {
  return [value.slice(0, startPosition), value.slice(endPosition)].join('')
}


/**
 * Opções do clearValue
 */
interface ClearValueOptions {
  // Preenche 0 à esquerda se for menor que o limite
  fillZerosAtLeft?: boolean;

  // Corta à direita caso sejam superiores ao limite
  trimAtRight?: boolean;

  // Permite número vazio?
  rejectEmpty?: boolean;

  // Rejeita se o número for maior que o tamanho definido
  rejectIfLonger?: boolean;

  // Rejeita uma sequência de números iguais
  rejectIfShorter?: boolean;

  // Rejeita uma sequência de números iguais
  rejectEqualSequence?: boolean;
}
