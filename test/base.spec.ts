import { Base } from "../src/base"

describe('Base', () => {
  describe('not implemented', () => {
    test('deve estar definido', () => {
      expect(() => Base.checksum('')).toThrow()
      expect(() => Base.fake('')).toThrow()
    })
  })
})