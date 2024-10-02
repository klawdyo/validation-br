import { clearValue, insertAtPosition } from '../utils';

export class Mask {
  constructor(private _value: string) {}

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
  apply(mask: string): string {
    const maskLen = clearValue(mask).length;
    let masked = clearValue(this._value, maskLen, {
      fillZerosAtLeft: true,
      trimAtRight: true,
    });
    const specialChars = ['/', '-', '.', '(', ')', ' '];

    for (let position = 0; position < mask.length; position += 1) {
      const current = mask[position];
      if (specialChars.includes(current))
        masked = insertAtPosition(masked, current, position);
    }

    return masked;
  }
}
