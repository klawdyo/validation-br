import  { fakeNumber } from'./utils'

describe('fakeNumber()', () => {
  test('forceLength = true', () => {
    const num = fakeNumber(4, true)

    expect(num).toHaveLength(4)
    expect(typeof num).toBe('string')
    expect(num).toMatch(/^[\d]+$/)
  })

  test('forceLength = false', () => {
    const num = fakeNumber(4)

    expect(num).toBeLessThanOrEqual(9999)
    expect(num).toBeGreaterThanOrEqual(0)
    expect(typeof num).toBe('number')
  })
})
