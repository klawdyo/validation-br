import { clearValue }  from '../../../src/_helpers/utils';

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
      expect(clearValue(item.value, item.size, { fillZerosAtLeft: true })).toBe(item.expected)
    })

    // Não completa com zeros
    expect(clearValue(1234, 6, { fillZerosAtLeft: false })).toBe('1234')
    expect(clearValue('1234', 6, { fillZerosAtLeft: false })).toBe('1234')
  })

  test('Deve limpar o valor os caracteres não numéricos e remover os caracteres que passarem de size', () => {
    //
    const valid = [
      { value: 123456789, size: 4, expected: '1234' },
      { value: '1234567890', size: 4, expected: '1234' },
      { value: '12.345.678-90', size: 4, expected: '1234' },
    ]

    valid.forEach((item) => {
      expect(clearValue(item.value, item.size, { trimAtRight: true })).toBe(item.expected)
    })

    // Não corta à direita
    expect(clearValue(12345678, 6, { trimAtRight: false })).toBe('12345678')
    expect(clearValue('12345678', 6, { trimAtRight: false })).toBe('12345678')
  })

  test('Deve retornar erro se receber um valor vazio', () => {
    expect(clearValue('1112', 4, { rejectEmpty: true })).toBe('1112')
    expect(() => clearValue('', null, { rejectEmpty: true })).toThrow()
  })

  test('Deve retornar erro se receber uma sequência de números iguais', () => {
    expect(clearValue('1112', 4, { rejectEqualSequence: true })).toBe('1112')
    expect(() => clearValue('1111', 4, { rejectEqualSequence: true })).toThrow()
  })

  test('Deve retornar erro se receber um valor com mais caracteres que o máximo', () => {
    expect(clearValue('1234', 4, { rejectIfLonger: true })).toBe('1234')
    expect(() => clearValue('12345', 4, { rejectIfLonger: true })).toThrow()
  })

  test('Deve retornar o mesmo valor inicial', () => {
    expect(clearValue(1234, 4)).toBe('1234')
    expect(clearValue('1234', 4)).toBe('1234')
    expect(clearValue(1234, 4, {})).toBe('1234')
    expect(clearValue('1234', 4, {})).toBe('1234')
  })
})
