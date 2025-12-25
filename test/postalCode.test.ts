import isPostalCode, { dv, fake, normalize, validate, validateOrFail } from '../src/postalCode';
import * as _postalCode from '../src/postalCode';

describe('PostalCode', () => {
  test.each([
    'PN718252423BR',
    'PO925539762BR',
    'JT194690698BR',
    'SV143851674BR',
    'RG727348650CN',
    'RY747622885CN',
    'RY728187035CN',
    'RH940629235CN',
    'RY686586175CN',
    'RY648001205CN',
    'UJ776469464CN',
    'LZ667841882CN',
    'RS737783818NL',
  ])('isPostalCode() - Números válidos', (item) => {

    expect(isPostalCode(item)).toBeTruthy();
    expect(_postalCode.validate(item)).toBeTruthy();

  });

  test.each([
    'PN718252423BR',
    'PO925539762BR',
    'JT194690698BR',
    'SV143851674BR',
    'RG727348650CN',
    'RY747622885CN',
    'RY728187035CN',
    'RH940629235CN',
    'RY686586175CN',
    'RY648001205CN',
    'UJ776469464CN',
    'LZ667841882CN',
    'RS737783818NL',
  ])('validate() - Números válidos', (item) => {

    expect(validate(item)).toBeTruthy();

  });

  test.each([
    'PO925524762BR',
    'JT194624698BR',
    'SV143824674BR',
    'RG727324650CN',
    'RY747624885CN',
    'RY728114035CN',
  ])('validate() - Números inválidos', (item) => {
    expect(validate(item)).toBeFalsy();
  });

  test.each([
    'PO925524762BR',
    'JT194624698BR',
    'SV143824674BR',
    'RG727324650CN',
    'RY747624885CN',
    'RY728114035CN',
  ])('validateOrFail() - Números inválidos', (item) => {
    expect(() => validateOrFail(item)).toThrow();
  });

  test('Parâmetro não informado', () => {
    expect(isPostalCode('')).toBeFalsy();
    expect(validate('')).toBeFalsy();
    expect(() => validateOrFail('')).toThrow();
    expect(() => dv('')).toThrow();
  });

  test.each([...Array(5)])('fake() - Gera fakes corretamente', () => {
    const postalCode = fake();

    expect(validate(postalCode)).toBeTruthy();
    expect(postalCode).toHaveLength(13);
  });

  test.each([
    { value: 'PN718252423BR', expected: '3' },
    { value: 'PO925539762BR', expected: '2' },
    { value: 'JT194690698BR', expected: '8' },
  ])('dv() - Verificando se o DV gerado está correto', (item) => {
    const calcDv = dv(item.value);

    expect(calcDv).toBe(item.expected);
    expect(typeof calcDv).toBe('string');
  });

  test.each([
    { value: 'pn718252423br', expected: 'PN718252423BR' },
    { value: 'po925539762br', expected: 'PO925539762BR' },
    { value: 'jt194690698br', expected: 'JT194690698BR' },
  ])('normalize() - Deve normalizar o valor inicial corretamente', (item) => {
    const normalized = normalize(item.value);

    expect(normalized).toBe(item.expected);
    expect(normalized).toHaveLength(13);
  });
});
