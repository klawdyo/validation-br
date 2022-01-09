import ValidateBR from './index'

describe('ValidateBR', () => {
  test('Deve importar isCNH', () => {
    expect(ValidateBR.isCNH).toBeDefined()
  })

  test('Deve importar isCNPJ', () => {
    expect(ValidateBR.isCNPJ).toBeDefined()
  })

  test('Deve importar isCPF', () => {
    expect(ValidateBR.isCPF).toBeDefined()
  })

  test('Deve importar isJudicialProcess', () => {
    expect(ValidateBR.isJudicialProcess).toBeDefined()
  })

  test('Deve importar isPIS', () => {
    expect(ValidateBR.isPIS).toBeDefined()
  })

  test('Deve importar isPostalCode', () => {
    expect(ValidateBR.isPostalCode).toBeDefined()
  })

  test('Deve importar isRenavam', () => {
    expect(ValidateBR.isRenavam).toBeDefined()
  })

  test('Deve importar isTituloEleitor', () => {
    expect(ValidateBR.isTituloEleitor).toBeDefined()
  })
})
