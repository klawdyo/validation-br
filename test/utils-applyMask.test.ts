import { applyMask } from '../src/utils';

describe('applyMask()', () => {
  test.each([
    { value: '123456', mask: '00000-0', expected: '12345-6' },
    { value: '12345', mask: '00000-0', expected: '01234-5' },
    { value: '123456789', mask: '00000-0', expected: '12345-6' },
    { value: 123456789, mask: '00000-0', expected: '12345-6' },
  ])('Máscara deve ser aplicada com o valor e tamanho correto', (item) => {
    expect(item.expected.length).toBe(item.mask.length);
    expect(applyMask(item.value, item.mask)).toBe(item.expected);
  });
});
