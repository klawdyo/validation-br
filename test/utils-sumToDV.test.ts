import { sumToDV } from '../src/utils'

describe('sumToDV()', () => {
  test('Os resultados devem ser os esperados', () => {
    const list = [
      { value: 102, expected: 8 },
      { value: 120, expected: 1 },
      { value: 162, expected: 3 },
      { value: 179, expected: 8 },
    ]

    list.forEach((item) => {
      expect(sumToDV(item.value)).toBe(item.expected)
    })
  })
})
