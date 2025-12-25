import { fakeNumber } from '../src/utils';

describe('fakeNumber()', () => {
  test.each([...Array(10)])('forceLength = true', () => {
    const num = fakeNumber(4, true);

    expect(num).toHaveLength(4);
    expect(typeof num).toBe('string');
    expect(num).toMatch(/^[\d]+$/);
  });

  test.each([...Array(10)])('forceLength = false', () => {
    const num = fakeNumber(4);

    expect(+num).toBeLessThanOrEqual(9999);
    expect(+num).toBeGreaterThanOrEqual(0);
    expect(typeof num).toBe('string');
  });


  test.each([...Array(10)])('isAlpha = true', () => {
    const num = fakeNumber(4, true, true);

    expect(num).toHaveLength(4);
    expect(typeof num).toBe('string');
    expect(num).toMatch(/^[0-9A-Z]+$/);
  });
});
