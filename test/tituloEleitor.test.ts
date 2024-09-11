import isTituloEleitor, { dv, fake, mask, validate, validateOrFail } from '../src/tituloEleitor'
import * as _tituloEleitor from '../src/tituloEleitor'

describe('TituloEleitor', () => {
  test('isTituloEleitor() - Números válidos', () => {
    const list = [
      // masked
      '1023.8501.0671',
      '8365.7137.1619',
      // string
      '153036161686',
      '525028881694',
      // integer
      11122223360,
      1122223336,
    ]

    list.forEach((tituloEleitor) => {
      expect(isTituloEleitor(tituloEleitor)).toBeTruthy()
      expect(_tituloEleitor.validate(tituloEleitor)).toBeTruthy()
    })
  })

  test('validate() - Números válidos', () => {
    const list = [
      // masked
      '1023.8501.0671',
      '8365.7137.1619',
      // string
      '153036161686',
      '525028881694',
      // integer
      11122223360,
      1122223336,
    ]

    list.forEach((tituloEleitor) => {
      expect(validate(tituloEleitor)).toBeTruthy()
    })
  })

  test('validate() - Números inválidos', () => {
    const list = [
      '836531371619',
      '743620641660',
      '153016161686',
      '525078881694',
      '026367681660',
      '558647441635',
      '222222222222',
    ]

    list.forEach((tituloEleitor) => {
      expect(validate(tituloEleitor)).toBeFalsy()
    })
  })

  test('validateOrFail() - Números inválidos', () => {
    const list = [
      '836531371619',
      '743620641660',
      '153016161686',
      '525078881694',
      '026367681660',
      '558647441635',
      '222222222222',
    ]

    list.forEach((tituloEleitor) => {
      expect(() => validateOrFail(tituloEleitor)).toThrow()
    })
  })

  test('Parâmetro não informado', () => {
    expect(isTituloEleitor('')).toBeFalsy()
    expect(validate('')).toBeFalsy()
    expect(() => validateOrFail('')).toThrow()
    expect(() => dv('')).toThrow()
  })

  test('fake() - Gera fakes sem máscara', () => {
    for (let i = 0; i < 5; i += 1) {
      const tituloEleitor = fake()

      expect(validate(tituloEleitor)).toBeTruthy()
      expect(tituloEleitor).toHaveLength(12)
    }
  })

  test('fake() - Gera fakes com máscara', () => {
    for (let i = 0; i < 5; i += 1) {
      const tituloEleitor = fake(true)

      expect(validate(tituloEleitor)).toBeTruthy()
      expect(tituloEleitor).toHaveLength(14)
    }
  })

  test('dv() - Verificando se o DV gerado está correto', () => {
    const list = [
      { num: '1023850106', expected: '71' },
      { num: '8365713716', expected: '19' },
      { num: '7436506416', expected: '60' },
      { num: 11222233, expected: '36' },
    ]

    list.forEach((item) => {
      const calcDv = dv(item.num)

      expect(calcDv).toBe(item.expected)
      expect(typeof calcDv).toBe('string')
    })
  })

  test('mask() - Testando se a máscara foi gerada corretamente', () => {
    const list = [
      { num: '102385010671', expected: '1023.8501.0671' },
      { num: '836571371619', expected: '8365.7137.1619' },
      { num: '743650641660', expected: '7436.5064.1660' },
      { num: 11122223360, expected: '0111.2222.3360' },
      { num: 1122223336, expected: '0011.2222.3336' },
    ]

    list.forEach((item) => {
      const masked = mask(item.num)

      expect(masked).toBe(item.expected)
      expect(masked).toHaveLength(14)
    })
  })
})
