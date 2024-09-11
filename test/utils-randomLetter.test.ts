import { randomLetter } from '../src/utils'

describe('randomLetter()', () => {
  test('forceLength = false', () => {
    const list = [...Array(1000)]

    list.forEach(() => {
      const letter = randomLetter()

      expect(letter).toMatch(/^[A-Z]{1}$/)
      expect(typeof letter).toBe('string')
    })
  })
})
