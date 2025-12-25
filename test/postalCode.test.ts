import isPostalCode, { dv, fake, normalize, validate, validateOrFail } from '../src/postalCode';
import * as _postalCode from '../src/postalCode'

describe('PostalCode', () => {
  test('isPostalCode() - Números válidos', () => {
    const list = [
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
    ]

    list.forEach((postalCode) => {
      expect(isPostalCode(postalCode)).toBeTruthy()
      expect(_postalCode.validate(postalCode)).toBeTruthy()
    })
  })

  test('validate() - Números válidos', () => {
    const list = [
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
    ]

    list.forEach((postalCode) => {
      expect(validate(postalCode)).toBeTruthy()
    })
  })

  test('validate() - Números inválidos', () => {
    const list = [
      'PO925524762BR',
      'JT194624698BR',
      'SV143824674BR',
      'RG727324650CN',
      'RY747624885CN',
      'RY728114035CN',
    ]

    list.forEach((postalCode) => {
      expect(validate(postalCode)).toBeFalsy()
    })
  })

  test('validateOrFail() - Números inválidos', () => {
    const list = [
      'PO925524762BR',
      'JT194624698BR',
      'SV143824674BR',
      'RG727324650CN',
      'RY747624885CN',
      'RY728114035CN',
    ]

    list.forEach((postalCode) => {
      expect(() => validateOrFail(postalCode)).toThrow()
    })
  })

  test('Parâmetro não informado', () => {
    expect(isPostalCode('')).toBeFalsy()
    expect(validate('')).toBeFalsy()
    expect(() => validateOrFail('')).toThrow()
    expect(() => dv('')).toThrow()
  })

  test.each([
    { value: 'pn718252423br', expected: 'PN718252423BR' },
    { value: 'po925539762br', expected: 'PO925539762BR' },
    { value: 'jt194690698br', expected: 'JT194690698BR' },
  ])('normalize() - Deve normalizar o valor inicial corretamente', (item) => {
    const normalized = normalize(item.value);

    expect(normalized).toBe(item.expected);
    expect(normalized).toHaveLength(13);
  });
