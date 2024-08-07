import isCNPJ, { dv, fake, mask, validate, validateOrFail } from '../src/cnpj'
import * as _cnpj from '../src/cnpj'

describe('CNPJ', () => {
  test('isCNPJ() - Números válidos', () => {
    const list = [
      // Com máscara
      '11.222.333/0001-81',
      '73.797.980/0001-79',
      '06.946.762/0001-61',
      '96.051.576/0001-57',
      '55.585.709/0001-98',
      // inteiro
      99360938000180,
      23693443000100,
      // string
      '32432147000147',
      '91951438000100',
    ]

    list.forEach((cnpj) => {
      expect(isCNPJ(cnpj)).toBeTruthy()
      expect(_cnpj.validate(cnpj)).toBeTruthy()
    })
  })

  test('validate() - Números válidos', () => {
    const list = [
      // Com máscara
      '11.222.333/0001-81',
      '73.797.980/0001-79',
      '06.946.762/0001-61',
      '96.051.576/0001-57',
      '55.585.709/0001-98',
      // inteiro
      99360938000180,
      23693443000100,
      // string
      '32432147000147',
      '91951438000100',
    ]

    list.forEach((cnpj) => {
      expect(validate(cnpj)).toBeTruthy()
    })
  })

  test('validate() - Números inválidos', () => {
    const list = [
      '53.797.980/0001-79',
      '36.946.762/0001-61',
      '26.051.576/0001-57',
      '85.585.709/0001-98',
      '39360938000180',
      '93693443000100',
      '12432147000147',
      '61951438000100',
      '11111111111111',
    ]

    list.forEach((cnpj) => {
      expect(validate(cnpj)).toBeFalsy()
    })
  })

  test('validateOrFail() - Números inválidos', () => {
    const list = [
      '53.797.980/0001-79',
      '36.946.762/0001-61',
      '26.051.576/0001-57',
      '85.585.709/0001-98',
      '39360938000180',
      '93693443000100',
      '12432147000147',
      '61951438000100',
      '11111111111111',
    ]

    list.forEach((cnpj) => {
      expect(() => validateOrFail(cnpj)).toThrow()
    })
  })

  test('Parâmetro não informado', () => {
    expect(isCNPJ('')).toBeFalsy()
    expect(validate('')).toBeFalsy()
    expect(() => validateOrFail('')).toThrow()
    expect(() => dv('')).toThrow()
  })

  test('fake() - Gera fakes sem máscara', () => {
    for (let i = 0; i < 5; i += 1) {
      const cnpj = fake()
      expect(validate(cnpj)).toBeTruthy()
      expect(cnpj).toHaveLength(14)
    }
  })

  test('fake() - Gera fakes com máscara', () => {
    for (let i = 0; i < 5; i += 1) {
      const cnpj = fake(true)
      expect(validate(cnpj)).toBeTruthy()
      expect(cnpj).toHaveLength(18)
    }
  })

  test('dv() - Verificando se o DV gerado está correto', () => {
    const list = [
      { num: '112223330001', expected: '81' },
      { num: 993609380001, expected: '80' },
      { num: '324321470001', expected: '47' },
    ]

    list.forEach((item) => {
      const calcDv = dv(item.num)

      expect(calcDv).toBe(item.expected)
      expect(typeof calcDv).toBe('string')
    })
  })

  test('mask() - Testando se a máscara foi gerada corretamente', () => {
    const list = [
      { value: '11222333000181', expected: '11.222.333/0001-81' },
      { value: 99360938000180, expected: '99.360.938/0001-80' },
      { value: '32432147000147', expected: '32.432.147/0001-47' },
      { value: 432147000147, expected: '00.432.147/0001-47' },
    ]

    list.forEach((item) => {
      const masked = mask(item.value)

      expect(masked).toBe(item.expected)
      expect(masked).toHaveLength(18)
    })
  })
})
