import {
  isCarPlate,
  isCNH,
  isCNPJ,
  isCPF,
  isJudicialProcess,
  isNUP17,
  isPhone,
  isPIS,
  isPixCopyPaste,
  isPixKey,
  isPostalTrackCode,
  isRenavam,
  isTituloEleitor,
} from '../src/main'

describe('ValidateBR', () => {
  test('Deve importar isCNH', () => {
    expect(isCNH).toBeDefined()

    expect(isCNH('69044271146')).toBeTruthy()
    expect(isCNH('69044271146')).toBeTruthy()
  })

  test('Deve importar isCNPJ', () => {
    expect(isCNPJ).toBeDefined()

    expect(isCNPJ('32432147000147')).toBeTruthy()
    expect(isCNPJ('32432147000147')).toBeTruthy()
  })

  test('Deve importar isCPF', () => {
    expect(isCPF).toBeDefined()

    expect(isCPF('15886489070')).toBeTruthy()
    expect(isCPF('15886489070')).toBeTruthy()
  })

  test('Deve importar isJudicialProcess', () => {
    expect(isJudicialProcess).toBeDefined()

    expect(isJudicialProcess('08002732820164058400')).toBeTruthy()
    expect(isJudicialProcess('08002732820164058400')).toBeTruthy()
  })

  test('Deve importar isNUP17', () => {
    expect(isNUP17).toBeDefined()

    expect(isNUP17('23037001462202165')).toBeTruthy()
    expect(isNUP17('23037001462202165')).toBeTruthy()
  })

  test('Deve importar isPIS', () => {
    expect(isPIS).toBeDefined()

    expect(isPIS('23795126955')).toBeTruthy()
    expect(isPIS('23795126955')).toBeTruthy()
  })

  test('Deve importar isPostalTrackCode', () => {
    expect(isPostalTrackCode).toBeDefined()

    expect(isPostalTrackCode('PN718252423BR')).toBeTruthy()
    expect(isPostalTrackCode('PN718252423BR')).toBeTruthy()
  })

  test('Deve importar isRenavam', () => {
    expect(isRenavam).toBeDefined()

    expect(isRenavam('80499688374')).toBeTruthy()
    expect(isRenavam('80499688374')).toBeTruthy()
  })

  test('Deve importar isTituloEleitor', () => {
    expect(isTituloEleitor).toBeDefined()

    expect(isTituloEleitor('153036161686')).toBeTruthy()
    expect(isTituloEleitor('153036161686')).toBeTruthy()
  })

  test('Deve importar isCarPlate', () => {
    expect(isCarPlate).toBeDefined()

    expect(isCarPlate('AAA-1A34')).toBeTruthy()
    expect(isCarPlate('AAA-1A34')).toBeTruthy()
  })

  test('Deve importar isPhone', () => {
    expect(isPhone).toBeDefined()

    expect(isPhone('+5584987654321')).toBeTruthy()
    expect(isPhone('+558433311454')).toBeTruthy()
  })
  test('Deve importar isPixKey', () => {
    expect(isPixKey).toBeDefined()

    expect(isPixKey('klawdyo@gmail.com')).toBeTruthy()
    expect(isPixKey('+5584987654321')).toBeTruthy()
    expect(isPixKey('+558433311454')).toBeTruthy()
    expect(isPixKey('01234567-0123-4567-8900-000000000000')).toBeTruthy()
    expect(isPixKey('99360938000180')).toBeTruthy()
    expect(isPixKey('74172316085')).toBeTruthy()
  })
  test('Deve importar isPixCopyPaste', () => {
    expect(isPixCopyPaste).toBeDefined()
    const pixStone = `00020101021226820014br.gov.bcb.pix2560pix.stone.com.br/pix/v2/b411f5c8-e97f-4a18-af0e-fc66491748d7520400005303986540510.005802BR5925DIOGO DA SILVA SANTOS LTD6014RIO DE JANEIRO622905251e3afd7926983f8ffe086cdc16304FF60`;
    const pixManual = `00020126550014BR.GOV.BCB.PIX0123alexandrepato@gmail.com0206almoco5204000053039865406100.005802BR5914Alexandre Pato6009Ipanguacu61085950800062490511PIXJS76657250300017BR.GOV.BCB.BRCODE01051.0.0630455CF`;
    
    expect(isPixCopyPaste(pixStone)).toBeTruthy()
    expect(isPixCopyPaste(pixManual)).toBeTruthy()
  })
})
