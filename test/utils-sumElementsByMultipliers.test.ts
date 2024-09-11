import { sumElementsByMultipliers } from '../src/utils'

describe('sumElementsByMultipliers()', () => {
  test('Tipo do retorno', () => {
    const sum = sumElementsByMultipliers('1234', [9, 8, 7, 6])

    expect(typeof sum).toBe('number')
    expect(sum).toBe(70)
  })

  test.each([
    { input: '1234', multipliers: [9, 8, 7, 6], expected: 70 },
    // cnpj
    { input: '112223330001', multipliers: [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2], expected: 102 },
    // cpf
    { input: '280012389', multipliers: [10, 9, 8, 7, 6, 5, 4, 3, 2], expected: 162 },
    { input: '2800123893', multipliers: [11, 10, 9, 8, 7, 6, 5, 4, 3, 2], expected: 201 },
    // titulo
  ])('Valores retornados', (item) => {
    const sum = sumElementsByMultipliers(item.input, item.multipliers)
    expect(sum).toBe(item.expected)

  })
})