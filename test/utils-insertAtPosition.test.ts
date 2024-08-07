import { insertAtPosition } from '../src/utils'

describe('insertAtPosition()', () => {
  test('Deve inserir um caractere em uma determinada posição da string', () => {
    //
    const list = [
      { value: 'AAABBB', insert: 'C', position: 3, expected: 'AAACBBB' },
      { value: 'J Med', insert: 'Cl ', position: 2, expected: 'J Cl Med' },
    ]

    list.forEach((item) => {
      expect(insertAtPosition(item.value, item.insert, item.position)).toBe(item.expected)
    })
  })
})
