import { randomLetter } from '../src/utils';

describe('randomLetter()', () => {
  test.each([...Array(1000)])('forceLength = false', () => {
    const letter = randomLetter();
    expect(letter).toMatch(/^[A-Z]{1}$/);
    expect(typeof letter).toBe('string');
  });
});
