import { arrayRandom } from "../../src/_helpers/array_random"


describe('arrayRandom()', () => {
  describe('Testa se o valor escolhido está dentro da lista', () => {
    test.each([...Array(20)])('Testa se está no array', () => {
      const list = [1, 2, 3, 4]
      const selected = arrayRandom(list)
      expect(list).toContain(selected)
    })
  })
})