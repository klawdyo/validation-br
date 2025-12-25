import { removeFromPosition } from '../src/utils';

describe('removeFromPosition()', () => {
  test.each([
      { value: 'Jossé', start: 2, end: 3, expected: 'José' },
      { value: 'Cláuudio', start: 4, end: 5, expected: 'Cláudio' },
    ])('removeFromPosition', (item) => {
      expect(removeFromPosition(item.value, item.start, item.end)).toBe(item.expected);
  });
});
