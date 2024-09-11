import ValidateBR, {
  isCNH,
  isCNPJ,
  isCPF,
  isJudicialProcess,
  isNUP17,
  isPIS,
  isPostalCode,
  isRenavam,
  isTituloEleitor,
} from '../src/index'

describe('ValidateBR', () => {
  test('Deve importar isCNH', () => {
    expect(ValidateBR.isCNH).toBeDefined()
    expect(isCNH).toBeDefined()

    expect(ValidateBR.isCNH('69044271146')).toBeTruthy()
    expect(isCNH('69044271146')).toBeTruthy()
  })

  test('Deve importar isCNPJ', () => {
    expect(ValidateBR.isCNPJ).toBeDefined()
    expect(isCNPJ).toBeDefined()

    expect(ValidateBR.isCNPJ('32432147000147')).toBeTruthy()
    expect(isCNPJ('32432147000147')).toBeTruthy()
  })

  test('Deve importar isCPF', () => {
    expect(ValidateBR.isCPF).toBeDefined()
    expect(isCPF).toBeDefined()

    expect(ValidateBR.isCPF('15886489070')).toBeTruthy()
    expect(isCPF('15886489070')).toBeTruthy()
  })

  test('Deve importar isJudicialProcess', () => {
    expect(ValidateBR.isJudicialProcess).toBeDefined()
    expect(isJudicialProcess).toBeDefined()

    expect(ValidateBR.isJudicialProcess('08002732820164058400')).toBeTruthy()
    expect(isJudicialProcess('08002732820164058400')).toBeTruthy()
  })

  test('Deve importar isNUP17', () => {
    expect(ValidateBR.isNUP17).toBeDefined()
    expect(isNUP17).toBeDefined()

    expect(ValidateBR.isNUP17('23037001462202165')).toBeTruthy()
    expect(isNUP17('23037001462202165')).toBeTruthy()
  })

  test('Deve importar isPIS', () => {
    expect(ValidateBR.isPIS).toBeDefined()
    expect(isPIS).toBeDefined()

    expect(ValidateBR.isPIS('23795126955')).toBeTruthy()
    expect(isPIS('23795126955')).toBeTruthy()
  })

  test('Deve importar isPostalCode', () => {
    expect(ValidateBR.isPostalCode).toBeDefined()
    expect(isPostalCode).toBeDefined()

    expect(ValidateBR.isPostalCode('PN718252423BR')).toBeTruthy()
    expect(isPostalCode('PN718252423BR')).toBeTruthy()
  })

  test('Deve importar isRenavam', () => {
    expect(ValidateBR.isRenavam).toBeDefined()
    expect(isRenavam).toBeDefined()

    expect(ValidateBR.isRenavam('80499688374')).toBeTruthy()
    expect(isRenavam('80499688374')).toBeTruthy()
  })

  test('Deve importar isTituloEleitor', () => {
    expect(ValidateBR.isTituloEleitor).toBeDefined()
    expect(isTituloEleitor).toBeDefined()

    expect(ValidateBR.isTituloEleitor('153036161686')).toBeTruthy()
    expect(isTituloEleitor('153036161686')).toBeTruthy()
  })
})
