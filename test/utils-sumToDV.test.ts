import { sumToDV } from '../src/utils';

describe('sumToDV()', () => {
  test.each([
    { value: 102, expected: 8 },
    { value: 120, expected: 1 },
    { value: 162, expected: 3 },
    { value: 179, expected: 8 },
  ])('Os resultados devem ser os esperados', (item) => {
    expect(sumToDV(item.value)).toBe(item.expected);
  });
});
