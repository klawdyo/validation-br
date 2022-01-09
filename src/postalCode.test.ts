import isPostalCode, { dv, fake, mask, validate, validateOrFail } from './postalCode'

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

  test('fake() - Gera fakes sem máscara', () => {
    for (let i = 0; i < 5; i += 1) {
      const postalCode = fake()

      expect(validate(postalCode)).toBeTruthy()
      expect(postalCode).toHaveLength(13)
    }
  })

  test('fake() - Gera fakes com máscara', () => {
    for (let i = 0; i < 5; i += 1) {
      const postalCode = fake(true)

      expect(validate(postalCode)).toBeTruthy()
      expect(postalCode).toHaveLength(13)
    }
  })

  test('dv() - Verificando se o DV gerado está correto', () => {
    const list = [
      { num: 'PN718252423BR', expected: '3' },
      { num: 'PO925539762BR', expected: '2' },
      { num: 'JT194690698BR', expected: '8' },
    ]

    list.forEach((item) => {
      const calcDv = dv(item.num)

      expect(calcDv).toBe(item.expected)
      expect(typeof calcDv).toBe('string')
    })
  })

  test('mask() - Testando se a máscara foi gerada corretamente', () => {
    const list = [
      { num: 'pn718252423br', expected: 'PN718252423BR' },
      { num: 'po925539762br', expected: 'PO925539762BR' },
      { num: 'jt194690698br', expected: 'JT194690698BR' },
    ]

    list.forEach((item) => {
      const masked = mask(item.num)

      expect(masked).toBe(item.expected)
      expect(masked).toHaveLength(13)
    })
  })
})
