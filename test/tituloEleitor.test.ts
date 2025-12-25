import isTituloEleitor, { dv, fake, mask, normalize, validate, validateOrFail } from '../src/tituloEleitor';

describe('TituloEleitor', () => {
  test.each([
    // masked
    '1023.8501.0671',
    '8365 7137 1619',
    // string
    '153036161686',
    '525028881694',
    // integer
    13132331643,
    1122221333,
  ])('isTituloEleitor() - Números válidos', (item) => {
    expect(isTituloEleitor(item)).toBeTruthy();
    expect(validate(item)).toBeTruthy();
  });

  test('Deve rejeitar quando a UF for maior que 28', () => {
    const titulo = '1122 3344 2992';
    expect(validate(titulo)).toBeFalsy();
    // expect(() => validateOrFail(titulo)).toThrow()
  });

  test.each([
    '836531371619',
    '743620641660',
    '153016161686',
    '525078881694',
    '026367681660',
    '558647441635',
    '222222222222',
  ])('validate() - Números inválidos', (item) => {
    expect(validate(item)).toBeFalsy();
  });

  test.each([
    '836531371619',
    '743620641660',
    '153016161686',
    '525078881694',
    '026367681660',
    '558647441635',
    '222222222222',
  ])('validateOrFail() - Números inválidos', (item) => {
    expect(() => validateOrFail(item)).toThrow();
  });

  test('Parâmetro não informado', () => {
    expect(isTituloEleitor('')).toBeFalsy();
    expect(validate('')).toBeFalsy();
    expect(() => validateOrFail('')).toThrow();
    expect(() => dv('')).toThrow();
  });

  test.each([...Array(5)])('fake() - Gera fakes sem máscara', () => {
    const tituloEleitor = fake();

    expect(validate(tituloEleitor)).toBeTruthy();
    expect(tituloEleitor).toHaveLength(12);
  });

  test.each([...Array(5)])('fake() - Gera fakes com máscara', () => {
    const tituloEleitor = fake(true);

    expect(validate(tituloEleitor)).toBeTruthy();
    expect(tituloEleitor).toHaveLength(14);
  });

  test.each([
    { value: '1023850106', expected: '71' },
    { value: '8365713716', expected: '19' },
    { value: '7436506416', expected: '60' },
    { value: '0011222213', expected: '33' },
  ])('dv() - Verificando se o DV gerado está correto', (item) => {
    const calcDv = dv(item.value);

    expect(calcDv).toBe(item.expected);
    expect(typeof calcDv).toBe('string');
  });

  test.each([
    { value: '102385010671', expected: '1023.8501.0671' },
    { value: '836571371619', expected: '8365.7137.1619' },
    { value: '743650641660', expected: '7436.5064.1660' },
    { value: 11122223360, expected: '0111.2222.3360' },
    { value: 1122223336, expected: '0011.2222.3336' },
  ]

  )('mask() - Testando se a máscara foi gerada corretamente', (item) => {
    const masked = mask(item.value);

    expect(masked).toBe(item.expected);
    expect(masked).toHaveLength(14);
  });

  test.each([
    { value: '1023.8501.0671', expected: '102385010671', },
    { value: '8365.7137.1619', expected: '836571371619', },
    { value: '7436.5064.1660', expected: '743650641660', },
    { value: '0111.2222.3360', expected: '011122223360', },
    { value: '0011.2222.3336', expected: '001122223336', },
  ]
  )('normalize() - Deve remover a máscara corretamente', (item) => {
    const normalized = normalize(item.value);

    expect(normalized).toBe(item.expected);
    expect(normalized).toHaveLength(12);
  });
});
