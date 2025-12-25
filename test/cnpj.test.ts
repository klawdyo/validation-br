import isCNPJ, { dv, fake, mask, validate, validateOrFail, normalize } from '../src/cnpj';
import * as _cnpj from '../src/cnpj';

describe('CNPJ', () => {
  test.each([
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
  ])('isCNPJ() - Números válidos', (cnpj) => {
    expect(isCNPJ(cnpj)).toBeTruthy();
    expect(_cnpj.validate(cnpj)).toBeTruthy();
  });

  test.each([
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
  ])('validate() - Números válidos', (cnpj) => {

    expect(validate(cnpj)).toBeTruthy();
  });

  test.each([
    '53.797.980/0001-79',
    '36.946.762/0001-61',
    '26.051.576/0001-57',
    '85.585.709/0001-98',
    '39360938000180',
    '93693443000100',
    '12432147000147',
    '61951438000100',
    '11111111111111',
  ])('validate() - Números inválidos', (cnpj) => {
    expect(validate(cnpj)).toBeFalsy();
  });

  test.each([
    '53.797.980/0001-79',
    '36.946.762/0001-61',
    '26.051.576/0001-57',
    '85.585.709/0001-98',
    '39360938000180',
    '93693443000100',
    '12432147000147',
    '61951438000100',
    '11111111111111',
  ])('validateOrFail() - Números inválidos', (cnpj) => {
    expect(() => validateOrFail(cnpj)).toThrow();


  });

  test('Parâmetro não informado', () => {
    expect(isCNPJ('')).toBeFalsy();
    expect(validate('')).toBeFalsy();
    expect(() => validateOrFail('')).toThrow();
    expect(() => dv('')).toThrow();
  });

  test('fake() - Gera fakes sem máscara', () => {
    for (let i = 0; i < 5; i += 1) {
      const cnpj = fake();
      expect(validate(cnpj)).toBeTruthy();
      expect(cnpj).toHaveLength(14);
    }
  });

  test('fake() - Gera fakes com máscara', () => {
    for (let i = 0; i < 5; i += 1) {
      const cnpj = fake(true);
      expect(validate(cnpj)).toBeTruthy();
      expect(cnpj).toHaveLength(18);
    }
  });

  test('fake() - Gera fakes com máscara usando opções como objeto', () => {
    for (let i = 0; i < 5; i += 1) {
      const cnpj = fake({ withMask: true, alphanumeric: false });
      expect(validate(cnpj)).toBeTruthy();
      expect(cnpj).toHaveLength(18);
      expect(cnpj).toMatch(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/);
    }
  });

  test('fake() - Gera fakes sem máscara usando opções como objeto', () => {
    for (let i = 0; i < 5; i += 1) {
      const cnpj = fake({ withMask: false, alphanumeric: false });
      expect(cnpj).toMatch(/^\d{14}$/);
      expect(validate(cnpj)).toBeTruthy();
      expect(cnpj).toHaveLength(14);
    }
  });

  test('fake() - Gera CNPJs alfanuméricos', () => {
    for (let i = 0; i < 5; i += 1) {
      const cnpj = fake({ withMask: false, alphanumeric: true });
      expect(cnpj).toMatch(/^[0-9A-Z]{14}$/);
      expect(validate(cnpj)).toBeTruthy();
      expect(cnpj).toHaveLength(14);
    }
  });

  test.each([
    { num: '112223330001', expected: '81' },
    { num: 993609380001, expected: '80' },
    { num: '324321470001', expected: '47' },
    { num: '132496630001', expected: '96' },
    { num: '752827070001', expected: '37' },
    { num: '265066480001', expected: '28' },
    { num: '708032680001', expected: '47' },
    { num: '195255840001', expected: '47' },
    { num: '888634370001', expected: '08' },
    { num: '060757490001', expected: '84' },
    { num: '554120850001', expected: '07' },
    { num: '754097240001', expected: '92' },

  ])('dv() - Verificando se o DV gerado está correto', (item) => {
    const calcDv = dv(item.num);
    expect(calcDv).toBe(item.expected);
    expect(typeof calcDv).toBe('string');
  });

  test.each([
    { value: '11222333000181', expected: '11.222.333/0001-81' },
    { value: 99360938000180, expected: '99.360.938/0001-80' },
    { value: '32432147000147', expected: '32.432.147/0001-47' },
    { value: 432147000147, expected: '00.432.147/0001-47' },
  ])('mask() - Testando se a máscara foi gerada corretamente', (item) => {
    const masked = mask(item.value);
    expect(masked).toBe(item.expected);
    expect(masked).toHaveLength(18);
  });

  test.each([
    { value: '11.222.333/0001-81', expected: '11222333000181' },
    { value: '73.797.980/0001-79', expected: '73797980000179' },
    { value: '06.946.762/0001-61', expected: '06946762000161' },
    { value: '96.051.576/0001-57', expected: '96051576000157' },
    { value: '55.585.709/0001-98', expected: '55585709000198' },
  ])('normalize() - Deve remover a máscara corretamente', (item) => {
    const normalized = normalize(item.value);
    expect(normalized).toBe(item.expected);
    expect(normalized).toHaveLength(14);
  });

});

describe('CNPJ alfanumérico', () => {

  test.each([
    'A3.170.7X3/0001-36',
    'A31707X3000136',
  ])('isValid() - checa se o cnpj alfanumérico %s é válido', (cnpj) => {
    expect(validate(cnpj)).toBeTruthy();
  });


  test.each([
    { num: 'A1.222.333/0001', expected: '50' },
    { num: 'B1.222.333/0001', expected: '03' },
    { num: 'C1.222.333/0001', expected: '67' },
    { num: 'D12223330001', expected: '10' },
    { num: 'E12223330001', expected: '74' },
  ])('dv() - Verificando se o DV gerado de %s está correto', (item) => {
    const calcDv = dv(item.num);
    expect(calcDv).toBe(item.expected);
    expect(typeof calcDv).toBe('string');
  });


});
