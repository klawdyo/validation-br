import isCNH, { dv, fake, mask, normalize, validate, validateOrFail } from '../src/cnh';
import * as _cnh from '../src/cnh'

describe('CNH', () => {
  test('isCNH() - Números válidos', () => {
    const list = [
      // como inteiro
      50195131143,
      58316794534,
      50195471165,
      // como string
      '69044271146',
      '46190906839',
      // com máscara
      '624729276-37',
    ]

    list.forEach((cnh) => {
      expect(isCNH(cnh)).toBeTruthy()
      expect(_cnh.validate(cnh)).toBeTruthy()
    })

    // t.end()
  })

  test('validate() - Números válidos', () => {
    const list = [
      // como inteiro
      50195131143,
      58316794534,
      // como string
      '69044271146',
      '46190906839',
      // com máscara
      '624729276-37',
    ]

    list.forEach((cnh) => {
      // t.true(isCNH(cnh), `CNH ${cnh} deve ser válida`)
      expect(validate(cnh)).toBeTruthy()
    })
  })

  test('validate() - Números inválidos', () => {
    const list = ['50195471143', '58316474534', '69044471146', '33333333333', '88888888888']

    list.forEach((cnh) => {
      expect(validate(cnh)).toBeFalsy()
    })
  })

  test('validateOrFail() - Números inválidos', () => {
    const list = ['50195471143', '58316474534', '69044471146', '33333333333', '88888888888']

    list.forEach((cnh) => {
      expect(() => validateOrFail(cnh)).toThrow()
    })
  })

  test('Parâmetro não informado', () => {
    expect(isCNH('')).toBeFalsy()
    expect(validate('')).toBeFalsy()
    expect(() => validateOrFail('')).toThrow()
    expect(() => dv('')).toThrow()
  })

  test('fake() - Gera fakes sem máscara', () => {
    for (let i = 0; i < 5; i += 1) {
      const cnh = fake()
      expect(validate(cnh)).toBeTruthy()
      expect(cnh).toHaveLength(11)
    }
  })

  test('fake() - Gera fakes com máscara', () => {
    for (let i = 0; i < 5; i += 1) {
      const cnh = fake(true)
      expect(validate(cnh)).toBeTruthy()
      expect(cnh).toHaveLength(12)
    }

    // t.end()
  })

  test('dv() - Verificando se o DV gerado está correto', () => {
    const list = [
      { num: '501954711', expected: '65' },
      { num: 583164745, expected: '75' },
      { num: 690444711, expected: '17' },
    ]

    list.forEach((item) => {
      const calcDv = dv(item.num)

      expect(calcDv).toBe(item.expected)
      expect(typeof calcDv).toBe('string')
    })
  })

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
