import isCPF, { dv, fake, mask, validate, validateOrFail } from './cpf'
import * as _cpf from './cpf'

describe('CPF', () => {
  test('isCPF() - Números válidos', () => {
    const list = [
      // masked
      '133.782.710-00',
      '400.448.260-79',
      // integer
      8796742020, // começa com zero
      74172316085,
      // string
      '15886489070',
      '90889477086',
    ]

    list.forEach((cpf) => {
      expect(isCPF(cpf)).toBeTruthy()
      expect(_cpf.validate(cpf)).toBeTruthy()
    })
  })

  test('validate() - Números válidos', () => {
    const list = [
      // masked
      '133.782.710-00',
      '400.448.260-79',
      // integer
      8796742020, // começa com zero
      74172316085,
      // string
      '15886489070',
      '90889477086',
    ]

    list.forEach((cpf) => {
      expect(validate(cpf)).toBeTruthy()
    })
  })

  test('validate() - Números inválidos', () => {
    const list = [
      '287.967.420-20',
      '333.782.710-00',
      '200.448.260-79',
      '24172316085',
      '25886489070',
      '20889477086',
      '11111111111',
    ]

    list.forEach((cpf) => {
      expect(validate(cpf)).toBeFalsy()
    })
  })

  test('validateOrFail() - Números inválidos', () => {
    const list = [
      '287.967.420-20',
      '333.782.710-00',
      '200.448.260-79',
      '24172316085',
      '25886489070',
      '20889477086',
      '11111111111',
    ]

    list.forEach((cpf) => {
      expect(() => validateOrFail(cpf)).toThrow()
    })
  })

  test('Parâmetro não informado', () => {
    expect(isCPF('')).toBeFalsy()
    expect(validate('')).toBeFalsy()
    expect(() => validateOrFail('')).toThrow()
    expect(() => dv('')).toThrow()
  })

  test('fake() - Gera fakes sem máscara', () => {
    for (let i = 0; i < 5; i += 1) {
      const cpf = fake()
      expect(validate(cpf)).toBeTruthy()
      expect(cpf).toHaveLength(11)
    }
  })

  test('fake() - Gera fakes com máscara', () => {
    for (let i = 0; i < 5; i += 1) {
      const cpf = fake(true)
      expect(validate(cpf)).toBeTruthy()
      expect(cpf).toHaveLength(14)
    }
  })

  test('dv() - Verificando se o DV gerado está correto', () => {
    const list = [
      { num: '741723160', expected: '85' },
      { num: 158864890, expected: '70' },
      { num: '908894770', expected: '86' },
    ]

    list.forEach((item) => {
      const calcDv = dv(item.num)

      expect(calcDv).toBe(item.expected)
      expect(typeof calcDv).toBe('string')
    })
  })

  test('mask() - Testando se a máscara foi gerada corretamente', () => {
    const list = [
      { num: '74172316085', expected: '741.723.160-85' },
      { num: 15886489070, expected: '158.864.890-70' },
      { num: '90889477086', expected: '908.894.770-86' },
      { num: 889477086, expected: '008.894.770-86' },
    ]

    list.forEach((item) => {
      const masked = mask(item.num)

      expect(masked).toBe(item.expected)
      expect(masked).toHaveLength(14)
    })
  })
})
