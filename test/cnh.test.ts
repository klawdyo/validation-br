import isCNH, { dv, fake, mask, normalize, validate, validateOrFail } from '../src/cnh';
import * as _cnh from '../src/cnh';

describe('CNH', () => {
  test.each([
    // como inteiro
    50195131143,
    58316794534,
    50195471165,
    // como string
    '69044271146',
    '46190906839',
    // com máscara
    '624729276-37',
  ])('isCNH() - Números válidos', (item) => {

    expect(isCNH(item)).toBeTruthy();
    expect(_cnh.validate(item)).toBeTruthy();


  });

  test.each([
    // como inteiro
    50195131143,
    58316794534,
    // como string
    '69044271146',
    '46190906839',
    // com máscara
    '624729276-37',
  ])('validate() - Números válidos', (item) => {

    // t.true(isCNH(cnh), `CNH ${cnh} deve ser válida`)
    expect(validate(item)).toBeTruthy();
  });

  test.each([
    // 
    '50195471143',
    '58316474534',
    '69044471146',
    '33333333333',
    '88888888888'
  ])('validate() - Números inválidos', (item) => {

    expect(validate(item)).toBeFalsy();

  });

  test.each(['50195471143', '58316474534', '69044471146', '33333333333', '88888888888'])('validateOrFail() - Números inválidos', (item) => {
    expect(() => validateOrFail(item)).toThrow();
  });

  test('Parâmetro não informado', () => {
    expect(isCNH('')).toBeFalsy();
    expect(validate('')).toBeFalsy();
    expect(() => validateOrFail('')).toThrow();
    expect(() => dv('')).toThrow();
  });

  test.each([...Array(5)])('fake() - Gera fakes sem máscara', () => {
    const cnh = fake();
    expect(validate(cnh)).toBeTruthy();
    expect(cnh).toHaveLength(11);
  });

  test.each([...Array(5)])('fake() - Gera fakes com máscara', () => {
    const cnh = fake(true);
    expect(validate(cnh)).toBeTruthy();
    expect(cnh).toHaveLength(12);

  });

  test.each([
    { value: '501954711', expected: '65' },
    { value: 583164745, expected: '75' },
    { value: 690444711, expected: '17' },
  ])('dv() - Verificando se o DV gerado está correto', (item) => {

    const calcDv = dv(item.value);

    expect(calcDv).toBe(item.expected);
    expect(typeof calcDv).toBe('string');

  });

  test.each([
    { value: 50195471143, expected: '501954711-43' },
    { value: 58316474534, expected: '583164745-34' },
    { value: 69044471146, expected: '690444711-46' },
  ])('mask() - Testando se a máscara foi gerada corretamente', (item) => {
    const masked = mask(item.value);

    expect(masked).toBe(item.expected);
    expect(masked).toHaveLength(12);
  });

  test.each([
    { value: '501954711-43', expected: '50195471143' },
    { value: '583164745-34', expected: '58316474534' },
    { value: '690444711-46', expected: '69044471146' },
    { value: '50195471143', expected: '50195471143' },
    { value: '58316474534', expected: '58316474534' },
    { value: '69044471146', expected: '69044471146' },
  ])('normalize() - Testando se remove a máscara corretamente', (item) => {

    const normalized = normalize(item.value);

    expect(normalized).toBe(item.expected);
    expect(normalized).toHaveLength(11);
  });
});
