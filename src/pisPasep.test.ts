import isPIS, { dv, fake, mask, validate, validateOrFail } from './pisPasep'
import * as _pisPasep from './pisPasep'

describe('PIS', () => {
  test('isPIS() - Números válidos', () => {
    const list = [
      // string
      '71282677380',
      '23795126955',
      // integer
      50012973803,
      27890141144,
      // masked
      '268.27649.96-0',
      '613.01862.91-7',
    ]

    list.forEach((pis) => {
      expect(isPIS(pis)).toBeTruthy()
      expect(_pisPasep.validate(pis)).toBeTruthy()
    })
  })

  test('validate() - Números válidos', () => {
    const list = [
      // string
      '71282677380',
      '23795126955',
      // integer
      50012973803,
      27890141144,
      // masked
      '268.27649.96-0',
      '613.01862.91-7',
    ]

    list.forEach((pis) => {
      expect(validate(pis)).toBeTruthy()
    })
  })

  test('validate() - Números inválidos', () => {
    const list = [
      '712.82677.38-2',
      '237.95126.95-4',
      '500.12973.80-1',
      '278.90141.14-9',
      '268.27649.96-2',
      '613.01862.91-4',
      '111.11111.11-1',
    ]

    list.forEach((pis) => {
      expect(validate(pis)).toBeFalsy()
    })
  })

  test('validateOrFail() - Números inválidos', () => {
    const list = [
      '712.82677.38-2',
      '237.95126.95-4',
      '500.12973.80-1',
      '278.90141.14-9',
      '268.27649.96-2',
      '613.01862.91-4',
      '111.11111.11-1',
    ]

    list.forEach((pis) => {
      expect(() => validateOrFail(pis)).toThrow()
    })
  })

  test('Parâmetro não informado', () => {
    expect(isPIS('')).toBeFalsy()
    expect(validate('')).toBeFalsy()
    expect(() => validateOrFail('')).toThrow()
    expect(() => dv('')).toThrow()
  })

  test('fake() - Gera fakes sem máscara', () => {
    for (let i = 0; i < 5; i += 1) {
      const pis = fake()
      expect(validate(pis)).toBeTruthy()
      expect(pis).toHaveLength(11)
    }
  })

  test('fake() - Gera fakes com máscara', () => {
    for (let i = 0; i < 5; i += 1) {
      const pis = fake(true)
      expect(validate(pis)).toBeTruthy()
      expect(pis).toHaveLength(14)
    }
  })

  test('dv() - Verificando se o DV gerado está correto', () => {
    const list = [
      { num: '7128267738', expected: '0' },
      { num: 2379512695, expected: '5' },
      { num: '5001297380', expected: '3' },
    ]

    list.forEach((item) => {
      const calcDv = dv(item.num)

      expect(calcDv).toBe(item.expected)
      expect(typeof calcDv).toBe('string')
    })
  })

  test('mask() - Testando se a máscara foi gerada corretamente', () => {
    const list = [
      { num: '71282677380', expected: '712.82677.38-0' },
      { num: 23795126955, expected: '237.95126.95-5' },
      { num: '50012973803', expected: '500.12973.80-3' },
    ]

    list.forEach((item) => {
      const masked = mask(item.num)

      expect(masked).toBe(item.expected)
      expect(masked).toHaveLength(14)
    })
  })
})
