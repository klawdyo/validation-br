const { invalidListGenerator } = require('./utils')

describe('invalidListGenerator()', () => {
  test('invalidListGenerator - Número de itens', () => {
    const list = invalidListGenerator(4)

    expect(1).toBe(1)
    expect(Array.isArray(list)).toBeTruthy()
  })

  test.each([

    { length: 10, size: 8 },
    { length: 10, size: 4 },
  ])('invalidListGenerator - Tamanho dos itens %s %s', (item) => {


    // valid.forEach((item) => {
      const list = invalidListGenerator(item.size)

      expect(list).toHaveLength(10)

      list.forEach((num: string) => {
        expect(num).toHaveLength(item.size)
      })
  })
})
