import { clearValue } from './utils'

describe('clearValue()', () => {
  test('Deve limpar o valor - Strings do Mesmo tamanho', () => {
    //
    const valid = [
      { value: 1234567890, size: 10, expected: '1234567890' },
      { value: '1234567890', size: 10, expected: '1234567890' },
      { value: '12.345.678-90', size: 10, expected: '1234567890' },
    ]

    valid.forEach((item) => {
      expect(clearValue(item.value, item.size)).toBe(item.expected)
    })
  })

  test('Deve limpar os caracteres não numéricos sem verificar o tamanho da string', () => {
    //
    const valid = [
      { value: 1234567890123, size: null, expected: '1234567890123' },
      { value: '4567890', size: null, expected: '4567890' },
      { value: '345.678-90', size: null, expected: '34567890' },
    ]

    valid.forEach((item) => {
      expect(clearValue(item.value, item.size)).toBe(item.expected)
    })
  })

  test('Deve limpar o valor os caracteres não numéricos e completar com zeros à esquerda', () => {
    //
    const valid = [
      { value: 1234, size: 10, expected: '0000001234' },
      { value: '1234', size: 10, expected: '0000001234' },
      { value: '123-4', size: 10, expected: '0000001234' },
    ]

    valid.forEach((item) => {
      expect(clearValue(item.value, item.size)).toBe(item.expected)
    })
  })

  test('Deve limpar o valor os caracteres não numéricos e remover os caracteres que passarem de size', () => {
    //
    const valid = [
      { value: 123456789, size: 4, expected: '1234' },
      { value: '1234567890', size: 4, expected: '1234' },
      { value: '12.345.678-90', size: 4, expected: '1234' },
    ]

    valid.forEach((item) => {
      expect(clearValue(item.value, item.size)).toBe(item.expected)
    })
  })
})
