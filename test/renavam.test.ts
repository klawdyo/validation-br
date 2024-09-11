import isRenavam, { dv, fake, mask, validate, validateOrFail } from '../src/renavam'
import * as _renavam from '../src/renavam'

describe('Renavam', () => {
  test('isRenavam() - Números válidos', () => {
    const list = [
      // valores com máscara
      '1952519770-3',
      '3394038959-9',
      // valores como inteiros
      3607626105,
      64090416160,
      // valores como string sem máscara
      '80499688374',
      '40650543741',
    ]

    list.forEach((renavam) => {
      expect(isRenavam(renavam)).toBeTruthy()
      expect(_renavam.validate(renavam)).toBeTruthy()
    })
  })

  test('validate() - Números válidos', () => {
    const list = [
      // valores com máscara
      '1952519770-3',
      '3394038959-9',
      // valores como inteiros
      3607626105,
      64090416160,
      // valores como string sem máscara
      '80499688374',
      '40650543741',
    ]

    list.forEach((renavam) => {
      expect(validate(renavam)).toBeTruthy()
    })
  })

  test('validate() - Números inválidos', () => {
    const list = ['19525227703', '33940229599', '03607226105', '64090226160', '80499228374']

    list.forEach((renavam) => {
      expect(validate(renavam)).toBeFalsy()
    })
  })

  test('validateOrFail() - Números inválidos', () => {
    const list = ['19525227703', '33940229599', '03607226105', '64090226160', '80499228374']

    list.forEach((renavam) => {
      expect(() => validateOrFail(renavam)).toThrow()
    })
  })

  test('Parâmetro não informado', () => {
    expect(isRenavam('')).toBeFalsy()
    expect(validate('')).toBeFalsy()
    expect(() => validateOrFail('')).toThrow()
    expect(() => dv('')).toThrow()
  })

  test('fake() - Gera fakes sem máscara', () => {
    for (let i = 0; i < 5; i += 1) {
      const renavam = fake()

      expect(validate(renavam)).toBeTruthy()
      expect(renavam).toHaveLength(11)
    }
  })

  test('fake() - Gera fakes com máscara', () => {
    for (let i = 0; i < 5; i += 1) {
      const renavam = fake(true)

      expect(validate(renavam)).toBeTruthy()
      expect(renavam).toHaveLength(12)
    }
  })

  test('renavam.dv() - Verificando se o DV gerado está correto', () => {
    const list = [
      { num: '1952519770', expected: '3' },
      { num: 952519770, expected: '6' },
      { num: 52519770, expected: '2' },
    ]

    list.forEach((item) => {
      const calcDv = dv(item.num)

      expect(calcDv).toBe(item.expected)
      expect(typeof calcDv).toBe('string')
    })
  })

  test('mask() - Testando se a máscara foi gerada corretamente', () => {
    const list = [
      { num: '19525197703', expected: '1952519770-3' },
      { num: 9525197703, expected: '0952519770-3' },
      { num: 525197703, expected: '0052519770-3' },
    ]

    list.forEach((item) => {
      const masked = mask(item.num)

      expect(masked).toBe(item.expected)
      expect(masked).toHaveLength(12)
    })
  })
})
