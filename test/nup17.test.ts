import isNUP17, { dv, fake, mask, unmask, validate, validateOrFail } from '../src/nup17';
import * as _nup17 from '../src/nup17';

describe('NUP17', () => {
  test('isNUP17() - Números válidos', () => {
    const list = [
      // Masked
      '23037.001380/2021-11',
      '23037.001434/2021-48',
      '23037.001321/2021-42',
      // String
      '23037001462202165',
      '23037001537202116',
      '23037001086202117',
    ];

    list.forEach((nup17) => {
      expect(isNUP17(nup17)).toBeTruthy();
      expect(_nup17.validate(nup17)).toBeTruthy();
    });
  });

  test('validate() - Números válidos', () => {
    const list = [
      // Masked
      '23037.001380/2021-11',
      '23037.001434/2021-48',
      '23037.001321/2021-42',
      // String
      '23037001462202165',
      '23037001537202116',
      '23037001086202117',
    ];

    list.forEach((nup17) => {
      expect(validate(nup17)).toBeTruthy();
    });
  });

  test('validate() - Números inválidos', () => {
    const list = [
      // Masked
      '23037001380202112',
      '23037001434202142',
      '23037001462202162',
      '23037001537202112',
    ];

    list.forEach((nup17) => {
      expect(validate(nup17)).toBeFalsy();
    });
  });

  test('validateOrFail() - Números inválidos', () => {
    const list = [
      // Masked
      '23037001380202112',
      '23037001434202142',
      '23037001462202162',
      '23037001537202112',
    ];

    list.forEach((nup17) => {
      expect(() => validateOrFail(nup17)).toThrow();
    });
  });

  test('validateOrFail() - Números válidos com caracteres adicionais', () => {
    const list = [
      // Números válidos com 1 caractere a mais no final
      '230370014622021650',
      '230370015372021160',
      '230370010862021170',
    ];

    list.forEach((nup17) => {
      expect(() => validateOrFail(nup17)).toThrow();
    });
  });

  test('Parâmetro não informado', () => {
    expect(isNUP17('')).toBeFalsy();
    expect(validate('')).toBeFalsy();
    expect(() => validateOrFail('')).toThrow();
    expect(() => dv('')).toThrow();
  });

  test.each([...Array(5)])('fake() - Gera fakes sem máscara', () => {
    const nup17 = fake();
    expect(validate(nup17)).toBeTruthy();
    expect(nup17).toHaveLength(17);
  });

  test.each([...Array(5)])('fake() - Gera fakes com máscara', () => {
    const nup17 = fake(true);
    expect(validate(nup17)).toBeTruthy();
    expect(nup17).toHaveLength(20);
  });

  test.each([
    { num: '23037.001380/2021', expected: '11' },
    { num: '23037.001434/2021', expected: '48' },
    { num: '23037.001321/2021', expected: '42' },
    { num: '230370014622021', expected: '65' },
    { num: '230370015372021', expected: '16' },
    { num: '230370010862021', expected: '17' },
  ])('dv() - Verificando se o DV gerado está correto', (item) => {
    const calcDv = dv(item.num);

    expect(calcDv).toBe(item.expected);
    expect(typeof calcDv).toBe('string');
  });

  test.each([
    { value: '23037001380202111', expected: '23037.001380/2021-11' },
    { value: '23037001434202148', expected: '23037.001434/2021-48' },
    { value: '23037001321202142', expected: '23037.001321/2021-42' },
    { value: '23037001462202165', expected: '23037.001462/2021-65' },
    { value: '23037001537202116', expected: '23037.001537/2021-16' },
    { value: '23037001086202117', expected: '23037.001086/2021-17' },
  ])('mask() - Testando se a máscara foi gerada corretamente', (item) => {
    const masked = mask(item.value);

    expect(masked).toBe(item.expected);
    expect(masked).toHaveLength(20);
  });

  test.each([
    { value: '23037.001380/2021-11', expected: '23037001380202111', },
    { value: '23037.001434/2021-48', expected: '23037001434202148', },
    { value: '23037.001321/2021-42', expected: '23037001321202142', },
    { value: '23037.001462/2021-65', expected: '23037001462202165', },
    { value: '23037.001537/2021-16', expected: '23037001537202116', },
    { value: '23037.001086/2021-17', expected: '23037001086202117', },
  ])('unmask() - Deve remover a máscara corretamente', (item) => {

    const unmasked = unmask(item.value);

    expect(unmasked).toBe(item.expected);
    expect(unmasked).toHaveLength(17);
  });
});
