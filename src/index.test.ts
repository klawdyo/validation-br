import ValidateBR from './index'

describe('ValidateBR', () => {
  test('Deve importar isCNH', () => {
    expect(ValidateBR.isCNH).toBeDefined()
    expect(ValidateBR.isCNH('69044271146')).toBeTruthy()
  })

  test('Deve importar isCNPJ', () => {
    expect(ValidateBR.isCNPJ).toBeDefined()
    expect(ValidateBR.isCNPJ('32432147000147')).toBeTruthy()
  })

  test('Deve importar isCPF', () => {
    expect(ValidateBR.isCPF).toBeDefined()
    expect(ValidateBR.isCPF('15886489070')).toBeTruthy()
  })

  test('Deve importar isJudicialProcess', () => {
    expect(ValidateBR.isJudicialProcess).toBeDefined()
    expect(ValidateBR.isJudicialProcess('08002732820164058400')).toBeTruthy()
  })

  test('Deve importar isNUP17', () => {
    expect(ValidateBR.isNUP17).toBeDefined()
    expect(ValidateBR.isNUP17('23037001462202165')).toBeTruthy()
  })

  test('Deve importar isPIS', () => {
    expect(ValidateBR.isPIS).toBeDefined()
    expect(ValidateBR.isPIS('23795126955')).toBeTruthy()
  })

  test('Deve importar isPostalCode', () => {
    expect(ValidateBR.isPostalCode).toBeDefined()
    expect(ValidateBR.isPostalCode('PN718252423BR')).toBeTruthy()
  })

  test('Deve importar isRenavam', () => {
    expect(ValidateBR.isRenavam).toBeDefined()
    expect(ValidateBR.isRenavam('80499688374')).toBeTruthy()
  })

  test('Deve importar isTituloEleitor', () => {
    expect(ValidateBR.isTituloEleitor).toBeDefined()
    expect(ValidateBR.isTituloEleitor('153036161686')).toBeTruthy()
  })
})
