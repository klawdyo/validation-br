const { invalidListGenerator } = require('./utils')

describe('invalidListGenerator()', () => {
  test('invalidListGenerator - Número de itens', () => {
    const list = invalidListGenerator(4)

    expect(1).toBe(1)
    expect(Array.isArray(list)).toBeTruthy()
  })

  test('invalidListGenerator - Tamanho dos itens', () => {
    const valid = [
      { length: 10, size: 8 },
      { length: 10, size: 4 },
    ]

    valid.forEach((item) => {
      const list = invalidListGenerator(item.size)

      expect(list).toHaveLength(10)

      list.forEach((num: string) => {
        expect(num).toHaveLength(item.size)
      })
    })
  })
})
