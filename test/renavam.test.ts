import isRenavam, { dv, fake, mask, unmask, validate, validateOrFail } from '../src/renavam';


describe('Renavam', () => {
  test.each([
    // valores com máscara
    '1952519770-3',
    '3394038959-9',
    // valores como inteiros
    3607626105,
    64090416160,
    // valores como string sem máscara
    '80499688374',
    '40650543741',
  ])('isRenavam() - %s deve ser um renavam válido', (renavam) => {
    expect(isRenavam(renavam)).toBeTruthy();
    expect(validate(renavam)).toBeTruthy();
    expect(validateOrFail(renavam)).toBeTruthy();
  });

  test.each(['19525227703', '33940229599', '03607226105', '64090226160', '80499228374'])(
    'validate() - Números inválidos',
    (renavam) => {
      expect(validate(renavam)).toBeFalsy();
      expect(() => validateOrFail(renavam)).toThrow();
    },
  );

  test('Parâmetro não informado', () => {
    expect(isRenavam('')).toBeFalsy();
    expect(validate('')).toBeFalsy();
    expect(() => validateOrFail('')).toThrow();
    expect(() => dv('')).toThrow();
  });

  test.each([...Array(5)])('fake() - Gera fakes sem máscara', () => {
    const renavam = fake();
    expect(validate(renavam)).toBeTruthy();
    expect(renavam).toHaveLength(11);
  });

  test.each([...Array(5)])('fake() - Gera fakes com máscara', () => {
    const renavam = fake(true);
    expect(validate(renavam)).toBeTruthy();
    expect(renavam).toHaveLength(12);
  });

  test.each([
    { value: '1952519770', expected: '3' },
    { value: 952519770, expected: '6' },
    { value: 52519770, expected: '2' },
  ])('renavam.dv() - Verificando se o DV gerado está correto', (item) => {
    const calcDv = dv(item.value);
    expect(calcDv).toBe(item.expected);
    expect(typeof calcDv).toBe('string');
  });

  test.each([
    { value: '19525197703', expected: '1952519770-3' },
    { value: 9525197703, expected: '0952519770-3' },
    { value: 525197703, expected: '0052519770-3' },
  ])('mask() - Testando se a máscara foi gerada corretamente', (item) => {
    const masked = mask(item.value);
    expect(masked).toBe(item.expected);
    expect(masked).toHaveLength(12);
  });

  test.each([
    { value: '1952519770-3', expected: '19525197703', },
    { value: '0952519770-3', expected: '09525197703', },
    { value: '0052519770-3', expected: '00525197703', },
  ])('unmask() - Deve remover a máscara corretamente', (item) => {
    const unmasked = unmask(item.value);
    expect(unmasked).toBe(item.expected);
    expect(unmasked).toHaveLength(11);
  });
});
