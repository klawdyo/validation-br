import { CNPJ } from '../src/cnpj';
import * as _cnpj from '../src/cnpj';

describe('CNPJ', () => {
  describe('constructor', () => {
    test.each([
      // Com máscara
      '11.222.333/0001-81',
      '73.797.980/0001-79',
      '06.946.762/0001-61',
      '96.051.576/0001-57',
      '55.585.709/0001-98',
      '99360938000180',
      '23693443000100',
      '32432147000147',
      '91951438000100',
    ])('deve estar definido', (input) => {
      const cnpj = new CNPJ(input);
      expect(cnpj).toBeDefined();
      expect(cnpj.value).toMatch(/^\d{14}$/);
    });

    test.each([
      // Com máscara
      '11.222.333/0001-82', // dv invlido
      '73.797.980/0001-72', // dv invlido
      '06.946.762/0001-62', // dv invlido
      '96.051.576/0001-52', // dv invlido
      '55.585.709/0001-92', // dv invlido
      '993609380001804', // numero a mais
      '2369344300010', //   numero a menos
      '', //                vazio
      undefined, //         undefined
      null, //              null
    ])('deve lançar um erro', (input) => {
      expect(() => new CNPJ(input as any)).toThrow();
    });
  });

  describe('checksum', () => {
    test.each([
      { num: '112223330001', expected: '81' },
      { num: '993609380001', expected: '80' },
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
      const calcDv = CNPJ.checksum(item.num);
      expect(calcDv).toBe(item.expected);
      expect(typeof calcDv).toBe('string');
    });
    
    test.each(['11222333000', '1122233300011', ''])(
      'deve lançar erro de dv',
      (item) => {
        expect(() => CNPJ.checksum(item)).toThrow();
      }
    );
  });

  describe('mask', () => {
    test.each([
      { value: '11222333000181', expected: '11.222.333/0001-81' },
      { value: '99360938000180', expected: '99.360.938/0001-80' },
      { value: '32432147000147', expected: '32.432.147/0001-47' },
      { value: '00432147000150', expected: '00.432.147/0001-50' },
    ])('máscara correta em %s', (item) => {
      const masked = new CNPJ(item.value).mask();
      expect(masked).toBe(item.expected);
      expect(masked).toHaveLength(18);
    });
  });

  describe('fake', () => {
    test.each([...Array(5)])('fakes devem estar definidos', () => {
      const cnpj = CNPJ.fake();
      expect(cnpj).toBeDefined();
      expect(cnpj).toBeInstanceOf(CNPJ);
    });

    test.each([...Array(5)])(
      'fakes alfanuméricos devem estar definidos',
      () => {
        const cnpj = CNPJ.fake({ alphanumeric: true });
        expect(cnpj).toBeDefined();
        expect(cnpj).toBeInstanceOf(CNPJ);
      }
    );
  });

  describe('CNPJ alfanumérico', () => {
    test.each(['A3.170.7X3/0001-36', 'A31707X3000136'])(
      'isValid() - checa se o cnpj alfanumérico %s é válido',
      (cnpj) => {
        expect(new CNPJ(cnpj)).toBeDefined()
      }
    );

    test.each([
      { num: 'A12223330001', expected: '50' },
      { num: 'B12223330001', expected: '03' },
      { num: 'C12223330001', expected: '67' },
      { num: 'D12223330001', expected: '10' },
      { num: 'E12223330001', expected: '74' },
    ])('Deve gerar um DV correto a partir de %s ', (item) => {
      const calcDv = CNPJ.checksum(item.num);
      expect(calcDv).toBe(item.expected);
      expect(typeof calcDv).toBe('string');
    });


    test.each(['A1222333000', 'B122233300011', ''])(
      '%s deve lançar erro de dv',
      (item) => {
        expect(() => CNPJ.checksum(item)).toThrow();
      }
    );

  });
});
