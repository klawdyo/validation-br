const { applyMask } = require('./utils')

describe('applyMask()', () => {
  const items = [
    { value: '123456', mask: '00000-0', expected: '12345-6' },
    { value: '12345', mask: '00000-0', expected: '01234-5' },
    { value: '123456789', mask: '00000-0', expected: '12345-6' },
    { value: 123456789, mask: '00000-0', expected: '12345-6' },
  ]

  test('Máscara deve ser aplicada com o valor e tamanho correto', () => {
    items.forEach((item) => {
      expect(item.expected.length).toBe(item.mask.length)
      expect(applyMask(item.value, item.mask)).toBe(item.expected)
    })
  })
})
