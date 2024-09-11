import ValidationBRError from './data/ValidationBRError'

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
 * Cria uma lista de valores repetidos no tamanho do documento para eliminar
 * valores que já conhecemos como inválidos
 *
 * @example
 * invalidListGenerator(10, 11)
 * //-> [00000000000, 11111111111, ....., 99999999999]
 *
 * @param {Integer} length Número de itens do array
 * @param {Integer} size Tamanho da string gerada
 * @returns {Array} Lista de valores
 */
export function invalidListGenerator(size: number): string[] {
  return [...Array(10).keys()].map((f) => String(f).repeat(size))
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
export function sumElementsByMultipliers(value: string, multiplier: string | number[]): number {
  if (typeof multiplier === 'string') multiplier = multiplier.split('').map((n) => Number(n))

  return multiplier.reduce(
    (accu: number, curr: any, i: number) => accu + curr * Number(value.charAt(i)),
    0,
  )
}

/**
 * fakeNumber()
 * Cria um número aleatório com o número de caracteres
 *
 * @example
 * fakeNumber(8, true) // -> 00083159
 * fakeNumber(4) // -> 831
 *
 * @param {Integer} length
 * @param {Boolean} forceLength Adiciona zeros à esquerda para ter os números de caractes exatos
 * @returns {String}
 */
export function fakeNumber(length: number, forceLength: boolean = false): number | string {
  const value = Math.floor(Math.random() * 10 ** length)

  if (forceLength) return String(value).padStart(length, '0')

  return +value
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
  let clearedValue = String(value).replace(/([/.-]+)/gi, '')

  if (options) {
    const shouldRejectEmpty = options.rejectEmpty === true && clearedValue.length === 0;
    if (shouldRejectEmpty) {
      throw ValidationBRError.EMPTY_VALUE
    }

    const shouldRejectHigherLength = options.rejectHigherLength === true && length && clearedValue.length > length;
    if (shouldRejectHigherLength) {
      throw ValidationBRError.MAX_LEN_EXCEDEED
    }

    const shouldRejectEqualSequence = options.rejectEqualSequence === true && length
    if (shouldRejectEqualSequence) {
      if (checkRepeatedSequence(clearedValue)) throw ValidationBRError.REPEATED_SEQUENCE
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
 * applyMask()
 * Aplica uma máscara a uma string
 *
 * @example
 * applyMask('59650000', '00.000-000') // -> 59.650-000
 * applyMask('99877665544', '(00) 0 0000-0000') // -> (99) 8 7766-5544
 *
 * @param {String|Number} value Valor original
 * @param {String} mask
 * @returns {String}
 *
 */
export function applyMask(value: string | number, mask: string): string {
  const maskLen = clearValue(mask).length
  let masked = clearValue(value, maskLen, { fillZerosAtLeft: true, trimAtRight: true })
  const specialChars = ['/', '-', '.', '(', ')', ' ']

  for (let position = 0; position < mask.length; position += 1) {
    const current = mask[position]
    if (specialChars.includes(current)) masked = insertAtPosition(masked, current, position)
  }

  return masked
}

/**
 * randomLetter()
 * Pega uma letra maiúscula aleatoriamente
 *
 * @example
 * randomLetter() // -> A
 * randomLetter() // -> S
 *
 * @returns {String}
 */
export function randomLetter(): string {
  const idx = Math.floor(1 + Math.random() * 26)
  return String.fromCharCode(idx + 64)
}

/**
 * Opções do clearValue
 */
interface ClearValueOptions {
  // Preenche 0 à esquerda se for menor que o limite
  fillZerosAtLeft?: boolean

  // Corta à direita caso sejam superiores ao limite
  trimAtRight?: boolean

  // Permite número vazio?
  rejectEmpty?: boolean

  // Rejeita se o número for maior que o tamanho definido
  rejectHigherLength?: boolean

  // Rejeita uma sequência de números iguais
  rejectEqualSequence?: boolean
}
