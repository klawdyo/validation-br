import isNUP17, { dv, fake, mask, normalize, validate, validateOrFail } from '../src/nup17';
import * as _nup17 from '../src/nup17';

describe('NUP17', () => {
  test.each([
    // Masked
    '23037.001380/2021-11',
    '23037.001434/2021-48',
    '23037.001321/2021-42',
    // String
    '23037001462202165',
    '23037001537202116',
    '23037001086202117',
  ])('isNUP17() - Números válidos', (item) => {

    expect(isNUP17(item)).toBeTruthy();
    expect(_nup17.validate(item)).toBeTruthy();
  });

  test.each([
    // Masked
    '23037.001380/2021-11',
    '23037.001434/2021-48',
    '23037.001321/2021-42',
    // String
    '23037001462202165',
    '23037001537202116',
    '23037001086202117',
  ])('validate() - Números válidos', (item) => {

    expect(validate(item)).toBeTruthy();

  });

  test.each([
    // Masked
    '23037001380202112',
    '23037001434202142',
    '23037001462202162',
    '23037001537202112',
  ])('validate() - Números inválidos', (item) => {

    expect(validate(item)).toBeFalsy();
  });

  test.each([
    // Masked
    '23037001380202112',
    '23037001434202142',
    '23037001462202162',
    '23037001537202112',
  ])('validateOrFail() - Números inválidos', (item) => {

    expect(() => validateOrFail(item)).toThrow();
  });

  test.each([
    // Números válidos com 1 caractere a mais no final
    '230370014622021650',
    '230370015372021160',
    '230370010862021170',
  ])('validateOrFail() - Números válidos com caracteres adicionais', (item) => {
    expect(() => validateOrFail(item)).toThrow();
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
  ])('normalize() - Deve remover a máscara corretamente', (item) => {

    const normalized = normalize(item.value);

    expect(normalized).toBe(item.expected);
    expect(normalized).toHaveLength(17);
  });
});
