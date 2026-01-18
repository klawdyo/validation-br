import { removeFromPosition } from '../../../src/_helpers/utils';

describe('removeFromPosition()', () => {
  test('', () => {
    //
    const list = [
      { value: 'Jossé', start: 2, end: 3, expected: 'José' },
      { value: 'Cláuudio', start: 4, end: 5, expected: 'Cláudio' },
    ]

    list.forEach((item) => {
      expect(removeFromPosition(item.value, item.start, item.end)).toBe(item.expected)
    })
  })
})
